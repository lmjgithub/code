const store = new Map();
function walkStep(n) {
  if (n === 1) return 1;
  if (n === 2) return 2;

  if (store.get(n)) {
    return store.get(n);
  }
  let value = walk(n - 1) + walk(n - 2);
  store.set(n, value);

  return value;
}
