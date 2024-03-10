const isObject = (val) => {
  return val !== null && typeof val === 'object';
}

export default function compare(
  oldObj, 
  newObj, 
  {
    onAdd,
    onDelete,
    onChange
  } = {}
) {
  if (!isObject(oldObj) || !isObject(newObj)) {
    return {
      added: [],
      deleted: [],
      changed: []
    };
  }

  const addedProps = [];
  const deletedProps = [];
  const changedProps = [];

  // Check for changes in existing properties and added properties
  Object.keys(newObj).forEach((key) => {
    if (!(key in oldObj)) {
      addedProps.push(key); // Key is added
    } else if (oldObj[key] !== newObj[key]) {
      changedProps.push({ key: key, oldValue: oldObj[key], newValue: newObj[key] }); // Key is changed
    }
  });

  // Check for deleted properties
  Object.keys(oldObj).forEach((key) => {
    if (!(key in newObj)) {
      deletedProps.push(key); // Key is deleted
    }
  });

  changedProps.forEach((key) => {
    typeof onChange === 'function' && onChange(key);
  });
  addedProps.forEach((key) => {
    typeof onAdd === 'function' && onAdd(key);
  });
  deletedProps.forEach((key) => {
    typeof onDelete === 'function' && onDelete(key);
  });

  return {
    added: addedProps,
    deleted: deletedProps,
    changed: changedProps
  };
}