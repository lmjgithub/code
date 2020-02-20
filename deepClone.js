const deepClone = (target, cache = new WeakMap()) => {
  if (target === null || typeof target !== "object") {
    return target;
  }
  if (cache.get(target)) {
    return target;
  }
  const copy = Array.isArray(target) ? [] : {};
  cache.set(target, copy);
  Object.keys(target).forEach(key => (copy[key] = deepClone(obj[key], cache)));
  return copy;
};

// 不支持 WeakMap 可以用这种实现
function find(list, f) {
  return list.filter(f)[0];
}

function deepCopy(obj, cache = []) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  const hit = find(cache, c => c.original === obj);
  if (hit) {
    return hit.copy;
  }

  const copy = Array.isArray(obj) ? [] : {};
  cache.push({
    original: obj,
    copy
  });
  Object.keys(obj).forEach(key => (copy[key] = deepCopy(obj[key], cache)));

  return copy;
}
