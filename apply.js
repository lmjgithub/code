Function.prototype.myApply = function(context) {
  if (typeof this !== "function") {
    throw new Error("type error");
  }
  context = context || window;
  context.fn = this;
  let result;
  if (arguments[1]) {
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }
  delete context.fn;
  return result;
};

function test(a, b) {
  console.log(a, b);
}
test.myApply(null, [1, 2]);
