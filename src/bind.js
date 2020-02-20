Function.prototype.myBind = function(context) {
  if (typeof this !== "function") {
    throw new Error("type error");
  }
  const _this = this;
  const args = [...arguments].slice(1);
  return function F() {
    //   处理 new 调用
    if (this instanceof F) {
      return new _this(...args, ...arguments);
    }
    return _this.apply(context, args.concat(...arguments));
  };
};
