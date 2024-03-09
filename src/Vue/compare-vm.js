const isObject = (val) => {
  return val !== null && typeof val === 'object';
}

export default function compare(newval, oldval) {
  if(!isObject(newval) || !isObject(oldval)) return;

  Object.keys(newval).forEach(key => {
    if (newval[key] !== oldval[key]) {
      return console.log(key, '发生了变化');
    }
  })
}