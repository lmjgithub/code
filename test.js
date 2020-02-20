function debounce(fn, wait = 100) {
  let timer;
  if (timer) clearTimeout(timer);

  return function() {
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, wait);
  };
}

function throttle(fn, wait = 100) {
  let last = new Date();
  return function() {
    const now = new Date();
    if (now - last > wait) {
      fn.apply(this, arguments);
      last = new Date();
    }
  };
}

Function.prototype.myApply = function(context, arr) {
  if (typeof this !== "function") {
    throw new Error("type Error");
  }
  context = context || window;
  context.fn = this;
  let result;
  if (arr) {
    result = context.fn(...arr);
  } else {
    result = context.fn();
  }
  delete context.fn;
  return result;
};

Function.prototype.myCall = function(context, ...args) {
  if (typeof this !== "function") {
    throw new Error("type Error");
  }
  context = context || window;
  context.fn = this;
  const result = context.fn(...args);
  delete context.fn;
  return result;
};

Function.prototype.myBind = function(context, ...args) {
  if (typeof this !== "function") {
    throw new Error("type Error");
  }
  const _this = this;
  return function F() {
    if (this instanceof F) {
      return new _this(...args, ...arguments);
    }
    return _this.apply(context, args.concat(...arguments));
  };
};

function myNew(fn, ...args) {
  let obj = {};
  obj.__proto__ == fn.prototype;
  let result = fn.apply(obj, args);
  return result instanceof Object ? result : obj;
}

function myInstanceof(obj, fn) {
  const prototype = fn.prototype;
  obj = obj.__proto__;
  while (true) {
    if (obj === null || obj === undefined) {
      return false;
    }
    if (obj === prototype) {
      return true;
    }
    obj = obj.__proto__;
  }
}

const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

function MyPromise(fn) {
  const _this = this;
  _this.state = PENDING;
  _this.value = null;
  _this.resolvedCallBacks = [];
  _this.rejctedCallBacks = [];

  function resolve(value) {
    if (value instanceof MyPromise) {
      value.then(resolve, reject);
    }
    setTimeout(() => {
      if (_this.state === PENDING) {
        _this.state = RESOLVED;
        _this.value = value;
        _this.resolvedCallBacks.forEach(fn => fn(_this.value));
      }
    }, 0);
  }

  function reject(value) {
    if (_this.state === PENDING) {
      _this.state = REJECTED;
      _this.value = value;
      _this.rejctedCallBacks.forEach(fn => fn(_this.value));
    }
  }

  try {
    fn(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError("error"));
  }
  if (x instanceof MyPromise) {
    x.then(value => {
      resolvePromise(promise2, value, resolve, reject);
    }, reject);
  }

  let called = false;
  if (x !== null && (typeof x === "function" || typeof x === "object")) {
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          value => {
            if (called) return;
            called = true;
            resolvePromise(promise2, value, resolve, reject);
          },
          err => {
            if (called) return;
            called = true;
            reject(err);
          }
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}

MyPromise.prototype.then = function(onFulfilled, onRejected) {
  const _this = this;
  onFulfilled = typeof onFulfilled === "function" ? onFulfilled : v => v;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : e => {
          throw new Error(e);
        };

  if (_this.state === PENDING) {
    return (promise2 = new MyPromise((resolve, reject) => {
      _this.resolvedCallBacks.push(() => {
        setTimeout(() => {
          try {
            const x = onFulfilled(_this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
      _this.rejctedCallBacks.push(() => {
        setTimeout(() => {
          try {
            const x = onRejected(_this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
    }));
  }
  if (_this.state === RESOLVED) {
    onFulfilled(_this.value);
  }
  if (_this.state === REJECTED) {
    onRejected(_this.value);
  }
};
