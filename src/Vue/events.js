import { markRaw } from 'vue';

export default function mountEvents(vm, events) {
  Object.assign(vm, {
    $events: markRaw(events),
    $emit: markRaw((ev, ...args) => {
      const $events = vm.$events;
      if ($events[ev]) {
        $events[ev].forEach((cb) => typeof cb === "function" && cb(...args));
      }
    }), // 将在组件上下文中定义
    $on: markRaw((ev, cb) => {
      const $events = vm.$events;
      if ($events[ev]) {
        $events[ev].push(cb);
      } else {
        $events[ev] = [cb];
      }
    }), // 事件监听需要自己实现，Vue 3 建议使用提供/注入机制或 EventEmitter
    $off: markRaw((ev, cb) => {
      const $events = vm.$events;
      if ($events[ev]) {
        if (cb) $events[ev].splice($events[ev].indexOf(cb), 1);
        else delete $events[ev];
      }
    }), // 移除事件监听器需要自己实现
    $once: markRaw((ev, cb) => {
      const once = (...args) => {
        cb(...args);
        vm.$off(ev, once);
      };
      vm.$on(ev, once);
    })
  })
}