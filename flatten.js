const flatten = (arr, deep = 1) => {
  return arr.reduce((cur, next) => {
    return Array.isArray(next) && deep > 1
      ? [...cur, ...flatten(next, deep - 1)]
      : [...cur, next];
  }, []);
};
