import { currentInstance } from ".";

export const LifeHooks = {
  beforeMount: "beforeMount",
  mounted: "mounted",
  beforeUpdate: "beforeUpdate",
  updated: "updated",
  beforeUnmount: "beforeUnmount",
  unmounted: "unmounted",
  errorCaptured: "errorCaptured",
  renderTracked: "renderTracked",
  renderTriggered: "renderTriggered",
  activated: "activated",
  deactivated: "deactivated",
  serverPrefetch: "serverPrefetch"
}

export const onMounted = (cb) => currentInstance && currentInstance?.$on?.(LifeHooks.mounted, cb);
export const onUpdated = (cb) => currentInstance && currentInstance?.$on?.(LifeHooks.updated, cb);
export const onUnmounted = (cb) => currentInstance && currentInstance?.$on?.(LifeHooks.unmounted, cb);
export const onBeforeMount = (cb) => currentInstance && currentInstance?.$on?.(LifeHooks.beforeMount, cb);
export const onBeforeUpdate = (cb) => currentInstance && currentInstance?.$on?.(LifeHooks.beforeUpdate, cb);
export const onBeforeUnmount = (cb) => currentInstance && currentInstance?.$on?.(LifeHooks.beforeUnmount, cb);
export const onErrorCaptured = (cb) => currentInstance && currentInstance?.$on?.(LifeHooks.errorCaptured, cb);
export const onRenderTracked = (cb) => currentInstance && currentInstance?.$on?.(LifeHooks.renderTracked, cb);
export const onRenderTriggered = (cb) => currentInstance && currentInstance?.$on?.(LifeHooks.renderTriggered, cb);
export const onActived = (cb) => currentInstance && currentInstance?.$on?.(LifeHooks.activated, cb);
export const onDeactived = (cb) => currentInstance && currentInstance?.$on?.(LifeHooks.deactivated, cb);
export const onSeverPrefetch = (cb) => currentInstance && currentInstance?.$on?.(LifeHooks.serverPrefetch, cb);

export const mountLifeHooks = (events, option) => {
  Object.assign(
    events,
    Object.keys(LifeHooks).reduce((events, hook) => {
      if(typeof option[hook] === 'function') {
        events[hook] = [option[hook].bind(currentInstance)];
      }
      return events;
    }, ({}))
  )
}