import { currentInstance } from ".";

export const provide = (key, value) => {
  if (!currentInstance) return console.error('你的 hooks 可能得在 Vue 组件的 setup 钩子中使用');
  currentInstance.provider[key] = value;
}
export const inject = (key, defaultValue, asFactory) => {
  if (!currentInstance) return console.error('你的 hooks 可能得在 Vue 组件的 setup 钩子中使用');

  // 遍历祖先
  let parent = currentInstance.$parent;
  while (parent) {
    if (parent.provider[key]) return parent.provider[key];
    parent = parent.$parent;
  }

  // 没有找到，返回默认值
  if (defaultValue) {
    if(asFactory && typeof defaultValue === 'function') {
      return defaultValue();
    }
    else {
      return defaultValue;
    }
  }
}