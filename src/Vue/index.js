import { reactive, nextTick, watch, computed, isRef, markRaw } from "vue";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useMemo,
  useState,
  createContext,
  useContext,
} from "react";

import { set, omit } from "lodash";

import defineProps from "./props";
import Refs from "./refs";

const VueContext = createContext();

const useVueInstance = (option) => {
  const [render, setRender] = useState(0);
  const rerender = () => setRender((pre) => pre + 1);
  console.log(`🚀～： 组件 ${option.name} 渲染了 ${render} 次`);

  const { props, attrs, events, slots, scopedSlots } = defineProps(
    option.defineProps,
    option.props
  );

  const parent = useContext(VueContext) || null;

  const vm = useMemo(() => {
    // 对 props 进行前置处理
    // on 开头的事件属性不应该再变化
    // 其他的属性可以随状态变化，所以要把事件单独先过滤出来
    const $props = reactive(props);
    const $attrs = reactive(attrs);
    const $data = reactive(
      typeof option.data === "function" ? option.data() : {}
    );

    const vm = reactive({
      $data, // ok

      // props 解析链路
      $props, // ok
      $attrs, // ok
      $option: option, // ok

      $slots: slots, // ok
      $scopedSlots: scopedSlots, // ok

      $el: null, // ok

      // 根据 vue 上下文联动，使用 栈 还是 context ？
      $parent: parent, // ok

      // stricmode 下组件回渲染两次，产生一个无用副本，过滤掉
      _children: [],
      $children: computed(() => vm._children.filter(child => child.$el)), // ok

      $root: null, // ok

      $refs: markRaw(new Refs()), // refs 相关逻辑 ok

      $watch: (source, cb, option) => watch(source, cb, option), // ok
      $set: set, // ok
      $delete: (source, key) => omit(source, [key]), // ok

      // 事件总线逻辑 ok
      $events: markRaw(events),
      $emit: (ev, ...args) => {
        const $events = vm.$events;
        if ($events[ev]) {
          $events[ev].forEach((cb) => typeof cb === "function" && cb(...args));
        }
      }, // 将在组件上下文中定义
      $on: (ev, cb) => {
        const $events = vm.$events;
        if ($events[ev]) {
          $events[ev].push(cb);
        } else {
          $events[ev] = [cb];
        }
      }, // 事件监听需要自己实现，Vue 3 建议使用提供/注入机制或 EventEmitter
      $off: (ev, cb) => {
        const $events = vm.$events;
        if ($events[ev]) {
          if (cb) $events[ev].splice($events[ev].indexOf(cb), 1);
          else delete $events[ev];
        }
      }, // 移除事件监听器需要自己实现
      $once: (ev, cb) => {
        const $events = vm.$events;
        const once = (...args) => {
          cb(...args);
          vm.$off(ev, once);
        };
        vm.$on(ev, once);
      },

      $nextTick: () => nextTick(), // ok
      $forceUpdate: rerender, // ok
      $mount: () => {
        throw new Error(
          `此 vm 非彼 vm，此 vm 只是 react 的 hooks 状态，通过在其上面运行响应式逻辑，来调动组件更新。这个 vm 是不管渲染链路的，只是单纯的响应式状态管理。`
        );
      }, // ok
      // todo: 生命周期
    });

    if (parent) {
      // children
      Array.isArray(parent._children) && parent._children.push(vm);
      // $root
      vm.$root = parent.$root ? parent.$root : parent;
    }

    const $expand = (target, writeable = false) => {
      if (target === null || typeof target !== "object") return;
      Object.keys(target).forEach((key) => {
        if (!writeable) {
          // 对 ref 单独判断
          if (isRef(target[key])) {
            vm[key] = computed(() => target[key].value);
          } else {
            vm[key] = computed(() => target[key]);
          }
        } else {
          vm[key] = computed({
            get: () => target[key],
            set: (val) => (target[key] = val),
          });
        }
      });
    };

    $expand($props);
    $expand($data, true);
    $expand(
      typeof option.setup === "function"
        ? option.setup(vm.$props, {
            emit: vm.$emit,
            slots: vm.$slots,
            attrs: vm.$attrs,
            expose: vm.$expose,
          })
        : null
    );

    const methods = option.methods || {};

    Object.keys(methods).forEach((key) => {
      if (typeof methods[key] === "function") {
        vm[key] = methods[key].bind(vm);
      }
    });


    return vm;
  }, []);

  // 响应式 -> set -> rerender，react 和 vue 的交接点
  useEffect(() => {
    nextTick(() => { 
      // useEffect + nextTick，保证在 $el 赋值之后，这里真正挂载
      watch(vm, rerender, {
        deep: true,
      }); 
    });
  }, [])

  Object.assign(vm.$props, props);
  Object.assign(vm.$attrs, attrs);

  return vm;
};

const useMount = (vm) => {
  const rootRef = useRef();
  useEffect(() => {
    const $el = rootRef.current;
    vm.$el = $el;
  }, []);
  return rootRef;
};

const Vue = forwardRef(function (option, ref) {
  const vm = useVueInstance(option);
  const rootRef = useMount(vm);

  // 通过 ref 向外暴露 vm
  useImperativeHandle(ref, () => vm, []);

  // 判断 vue 底下有多个元素
  if (Array.isArray(option.children)) {
    throw new Error("Vue 虚拟组件下不能由多个根元素。");
  }

  return (
    <VueContext.Provider value={vm}>
      {React.cloneElement(option.template || option.children, {
        ref: rootRef,
        vm,
      })}
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

export default Vue;
