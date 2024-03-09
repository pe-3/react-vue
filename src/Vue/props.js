function toType(value) {
  return Array.isArray(value) ? Array : value.constructor;
}

function validateType(value, expectedType) {
  if (!expectedType) return true;
  if (Array.isArray(expectedType)) {
    return expectedType.some((type) => toType(value) === type);
  }
  return toType(value) === expectedType;
}

function getDefault(typeInfo) {
  if (typeof typeInfo.default === "function") {
    return typeInfo.default();
  }
  return typeInfo.default;
}

export default function defineProps(propsConfig = {}, externalProps = {}) {
  const parsedProps = {};
  const attrs = { ...externalProps };
  const events = {};
  const slots = {};
  const scopedSlots = {};

  // 解析 props & attrs
  if (Array.isArray(propsConfig)) {
    propsConfig.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(externalProps, key)) {
        parsedProps[key] = externalProps[key];
        delete attrs[key];
      }
    });
  } else {
    Object.keys(propsConfig).forEach((key) => {
      const typeInfo = propsConfig[key];
      const value = externalProps[key];

      const expectedType = typeInfo.type || typeInfo;
      const isRequired = typeof typeInfo === "object" && typeInfo.required;
      const hasDefault = typeof typeInfo === "object" && "default" in typeInfo;

      if (value !== undefined) {
        if (validateType(value, expectedType)) {
          parsedProps[key] = value;
        } else {
          console.warn(`警告: Props 验证失败: "${key}" 类型不匹配。`);
        }
      } else if (isRequired) {
        throw new Error(`错误: 缺少必需的 prop: "${key}"`);
      } else if (hasDefault) {
        parsedProps[key] = getDefault(typeInfo);
      }

      delete attrs[key];
    });
  }

  // 解析 events
  Object.keys(attrs).forEach((key) => {
    if (/^on[A-Z]/.test(key)) {
      events[key.slice(2).toLowerCase()] = [attrs[key]];
      delete attrs[key];
    }
    if (/^v-slot-[a-zA-Z]/.test(key)) {
      if (typeof attrs[key] === "object") {
        slots[key.slice(7)] = attrs[key];
        delete attrs[key];
      } else if (typeof attrs[key] === "function") {
        scopedSlots[key.slice(7)] = attrs[key];
        delete attrs[key];
      }
    }
    if (key === "v-slot") {
      if (typeof attrs[key] === "object") {
        slots["default"] = attrs[key];
      } else if (typeof attrs[key] === "function") {
        scopedSlots["default"] = attrs[key];
      }
      delete attrs[key];
    }
  });

  return { props: parsedProps, attrs: attrs, events, slots, scopedSlots };
}
