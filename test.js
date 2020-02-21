function deepClone(target, cache = new WeakMap()) {
  if (typeof target !== "object" || target === null) {
    return target;
  }

  if (cache.get(target)) {
    return target;
  }

  const copy = Array.isArray(target) ? [] : [];
  cache.set(target, copy);
  Object.keys(target).forEach(
    key => (copy[key] = deepClone(target[key], cache))
  );
  return copy;
}
