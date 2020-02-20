Function.prototype.myCall = function (context) {
  if (typeof this !== "function") {
    throw new Error("type error");
  }
  context = context || window;
  context.fn = this;
  const args = [...arguments].slice(1);
  const result = context.fn(...args);
  delete context.fn;
  return result;
};
