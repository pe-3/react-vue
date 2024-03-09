import { computed } from 'vue';

export default function buildVmTree(vm, parent) {
  Object.assign(vm, {
    // 根据 vue 上下文联动，使用 栈 还是 context ？
    $parent: parent, // ok

    // stricmode 下组件回渲染两次，产生一个无用副本，过滤掉
    _children: [],
    $children: computed(() => vm._children.filter(child => child.$el)), // ok

    $root: null, // ok
  })

  if (parent) {
    // children
    Array.isArray(parent._children) && parent._children.push(vm);
    // $root
    vm.$root = parent.$root ? parent.$root : parent;
  }
}