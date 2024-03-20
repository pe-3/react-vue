import { reactive, nextTick, watch, computed, isRef, markRaw } from "vue";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  createContext,
  useContext,
  useRef
} from "react";

import { set, omit } from "lodash";

import defineProps from "./props";
import Refs from "./refs";

import { LifeHooks, mountLifeHooks } from "./lifehooks";
import mountEvents from "./events";
import expand from "./expand";
import buildVmTree from "./build-vm-tree";
import compare from "./compare";

export const VueContext = createContext();
export const IfContext = createContext();

export let currentInstance = null;
export const getCurrentInstance = () => currentInstance;

// todo: 热更新有大问题，需要整理一下更新逻辑，还有 react 的热更新逻辑

const useReRender = (option) => {
  const [render, setRender] = useState(0);
  const rerender = () => setRender((pre) => pre + 1);
  console.log(`🚀～： 组件 ${option.name} 渲染了 ${render} 次`);
  return rerender;
}

const useVueInstance = (option) => {
  const rerender = useReRender(option);

  const { props, attrs, events, slots, scopedSlots } = defineProps(
    option.defineProps,
    option.props
  );

  const parent = useContext(VueContext) || null;

  const watcharr = useRef();

  const vm = useMemo(() => {
    const vm = reactive({
      $data: null, // ok
      $props: null, // ok
      $attrs: reactive(attrs), // ok
      $option: markRaw(option), // ok

      $slots: markRaw(slots), // ok
      $scopedSlots: markRaw(scopedSlots), // ok

      $el: null, // ok

      // build-vm-tree 去 assing 这些属性
      $root: null,
      $parent: null,
      $children: null,

      $refs: markRaw(new Refs()), // refs 相关逻辑 ok

      $watch: (source, cb, option) => watch(source, cb, option), // ok
      $set: set, // ok
      $delete: (source, key) => omit(source, [key]), // ok

      $nextTick: () => nextTick(), // ok
      $forceUpdate: rerender, // ok
      $mount: () => {
        throw new Error(
          `不能调用 $mount 方法用于挂载，渲染还是基于 react，请走 react 的渲染链路`
        );
      },

      // provide, inject
      provider: markRaw({})
    });

    // 设置当前渲染的 vm
    currentInstance = vm;

    // 注册事件系统，events 是通过事先通过配置初始化好的事件对象
    mountEvents(vm, events);

    mountLifeHooks(vm.$events, option);

    buildVmTree(vm, parent);

    // 将 props，data，setup，methods 展开到 vm 上
    watcharr.current = expand(vm, {
      props,
      attrs,
      data: option.data,
      methods: option.methods || {},
      setup: option.setup
    })


    // life-hook: 挂载前
    nextTick(() => {
      vm.$emit(LifeHooks.beforeMount, vm);
    });

    return vm;
  }, []);

  // 响应式 -> set -> rerender，react 和 vue 的交接点
  useEffect(() => {
    let stop = null

    nextTick(() => {
      // 挂载之后监听，开始
      const watchCallback = () => {
        // life-hook: 更新前
        vm.$emit(LifeHooks.beforeUpdate, vm);
        rerender();
        // life-hook: 更新了
        setTimeout(() => {
          vm.$emit(LifeHooks.updated, vm); 
        });
      }

      // 监听 vm 身上的浅层属性
      const stopvm = watch(vm, watchCallback, {
        flush: 'sync',
        deep: false
      });
      // 监听 setup 里返回的 reactive 对象
      const stopstate = watch(watcharr.current, watchCallback, {
        flush: 'sync'
      })

      stop = () => {
        stopvm();
        stopstate();
      }

      // life-hook: 挂载
      vm.$emit(LifeHooks.mounted, vm);
    })

    // life-hook: 卸载
    return () => {
      stop && stop(); // 卸载时，销毁对 vm 的监听
      vm.$emit(LifeHooks.unmounted);
    }
  }, [option])

  // todo: 属性消失或添加做处理
  // 稳定时候的处理 prod 模式下
  Object.assign(vm.$attrs, attrs);

  compare(vm.$props, props, {
    onAdd(key) {
      vm[key] = computed(() => vm.$props[key])
    },
    onDelete(key) {
      delete vm[key];
    },
    onChange(key) {
      vm.$props[key] = props[key]
    }
  })

  return vm;
};

const Vue = forwardRef(function (option, ref) {
  const vm = useVueInstance(option);
  
  // 挂载 el 逻辑
  const rootRef = useRef(null);
  useEffect(() => {
    vm.$el = rootRef.current;
  }, [])

  // 通过 ref 向外暴露 vm
  useImperativeHandle(ref, () => vm, []);

  // 判断 vue 底下有多个元素
  if (Array.isArray(option.children)) {
    throw new Error("Vue 虚拟组件下不能由多个根元素。");
  }

  return (
    <VueContext.Provider value={vm}>
      <IfContext.Provider value={{
        current: 0,
        queue : []
      }}>
        {React.cloneElement(option.template || option.children, {
          vm,
          ref: rootRef
        })}
      </IfContext.Provider>
    </VueContext.Provider>
  );
});

Vue.slot = ({ name = "default", children, ...args }) => {
  const vm = useContext(VueContext) || {};
  const { $slots = {}, $scopedSlots = {} } = vm;
  if (Object.keys(args).length) {
    const Slot = $scopedSlots[name] || (() => children);
    return <Slot {...args} />;
  } else {
    return $slots[name] || children;
  }
};

Vue.If = ({ when = true, children }) => {
  const IfCtx = useContext(IfContext);
  if(!IfCtx) {
    throw new Error('If 组件必须在 Vue 组件中使用')
  }

  IfCtx.queue.push({
    type: 'If',
    when
  });
  IfCtx.current ++;

  return when ? children : null;
}
Vue.ElseIf = ({ when = false, children }) => {
  const IfCtx = useContext(IfContext);
  if(!IfCtx) {
    throw new Error('ElseIf 组件必须在 Vue 组件中使用')
  }
  if(IfCtx.current === 0) {
    throw new Error('ElseIf 前面必须有 If 组件');
  }

  let rendered = false;
  // 一直往上找，找到第一个 If 组件
  let idx = IfCtx.current - 1;
  while(idx >= 0) {
    // 判断元素为师
    if (IfCtx.queue[idx].type === 'Else') {
      throw new Error('Else 必须在 ElseIf 组件的后面');
    }
    if (IfCtx.queue[idx].when) {
      rendered = false;
      break;
    }
    if (IfCtx.queue[idx].type === 'If') {
      rendered = when;
      break;
    }

    idx --;
  }

  IfCtx.queue.push({
    type: 'ElseIf',
    when
  })
  IfCtx.current ++;

  return rendered ? children : null;
}
Vue.Else = ({ children }) => {
  const IfCtx = useContext(IfContext);
  if(!IfCtx) {
    throw new Error('Else 组件必须在 Vue 组件中使用')
  }
  if(IfCtx.current === 0) {
    throw new Error('Else 前面必须有 If 组件');
  }

  let rendered = false;
  // 一直往上找，找到第一个 If 组件
  let idx = IfCtx.current - 1;
  while(idx >= 0) {
    // 判断元素为师
    if (IfCtx.queue[idx].type === 'Else') {
      throw new Error('Else 不能在 Else 组件的前面');
    }
    if (IfCtx.queue[idx].when) {
      rendered = false;
      break;
    }
    if (IfCtx.queue[idx].type === 'If') {
      rendered = true;
      break;
    }

    idx --;
  }

  IfCtx.queue.push({
    type: 'Else'
  })
  IfCtx.current ++;


  return rendered ? children : null;
}

export default Vue;

// 语法糖出现
export function forwardVue(
  options,
  template
) {
  const Template = forwardRef(({ vm }, ref) => {
    // 自动绑定 ref，直接传递 vm
    const $t = template(vm);
    return React.cloneElement($t, {
      ref
    })
  })

  // 便携配置 props
  const defineProps = options.props;
  delete options.props;

  return forwardRef((props, ref) => (
    <Vue
      ref={ref}
      props={props}
      defineProps={defineProps}
      {...options}
    >
      <Template />
    </Vue>
  ))
}
