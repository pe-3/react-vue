import { reactive, isRef, computed, isReactive } from 'vue';

export default function expand(vm, {
  props,
  data,
  methods,
  setup
}) {
  // 稳定的属性，编译好了之后，option 和 props 都不会再变化
  const watcharr = [vm.$attrs]; // 额外需要监听的响应式对象
  const $props = reactive(props);
  const $data = reactive(typeof data === "function" ? data() : {});

  Object.assign(vm, {
    $props,
    $data,
  });

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

      if (isReactive(target[key])) {
        watcharr.push(target[key]);
      }
    });
  };

  // 展开 props、data、setup 到 vm 上
  $expand($props);
  $expand($data, true);
  $expand(
    typeof setup === "function"
      ? setup(vm.$props, {
          emit: vm.$emit,
          slots: vm.$slots,
          attrs: vm.$attrs,
          expose: vm.$expose,
        })
      : null
  );

  // 展开 methods
  Object.keys(methods).forEach((key) => {
    if (typeof methods[key] === "function") {
      vm[key] = methods[key].bind(vm);
    }
  });

  return watcharr;
}