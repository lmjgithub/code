const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(fn) {
  const _this = this;
  _this.value = null;
  _this.status = PENDING;
  _this.onFulfilledCallbacks = [];
  _this.rejectedCallBacks = [];
  _this.finallyCallBacks = [];

  function resolve(value) {
    if (value instanceof MyPromise) {
      return value.then(resolve, reject);
    }
    // 实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
    setTimeout(() => {
      if (_this.status === PENDING) {
        _this.value = value;
        _this.status = FULFILLED;
        _this.onFulfilledCallbacks.forEach(cb => cb(_this.value));
      }
    }, 0);
  }

  function reject(value) {
    setTimeout(() => {
      if (_this.status === PENDING) {
        _this.value = value;
        _this.status = REJECTED;
        _this.rejectedCallBacks.forEach(cb => cb(_this.value));
      }
    }, 0);
  }

  try {
    fn(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

MyPromise.prototype.then = function(onFulfilled, onRejected) {
  const _this = this;
  onFulfilled = typeof onFulfilled === "function" ? onFulfilled : v => v;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : err => {
          throw err;
        };

  if (_this.status === FULFILLED) {
    return (newPromise = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          let x = onFulfilled(_this.value);
          resolvePromise(newPromise, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    }));
  }

  if (_this.status === REJECTED) {
    return (newPromise = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          const x = onRejected(_this.value);
          resolvePromise(newPromise, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    }));
  }

  if (_this.status === PENDING) {
    return (newPromise = new MyPromise((resolve, reject) => {
      _this.onFulfilledCallbacks.push(() => {
        setTimeout(() => {
          try {
            const x = onFulfilled(_this.value);
            resolvePromise(newPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      });

      _this.rejectedCallBacks.push(() => {
        setTimeout(() => {
          try {
            const x = onRejected(_this.value);
            resolvePromise(newPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
    }));
  }
};

function resolvePromise(promise2, x, resolve, reject) {
  // 排除promise循环引用的问题
  if (promise2 === x) {
    return reject(new TypeError("error"));
  }
  /*
  如果返回的是promise话 需要等待状态的变更
  1. 如果 `x` 处于等待态，`Promise` 需保持为等待态直至 `x` 被执行或拒绝
  2. 如果 `x` 处于其他状态，则用相同的值处理 `Promise`
   */
  if (x instanceof MyPromise) {
    x.then(value => resolvePromise(promise2, value, resolve, reject), reject);
  }

  let called = false;
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      let then = x.then;
      // 兼容类 promise 对象
      if (typeof then === "function") {
        then.call(
          x,
          value => {
            if (called) return;
            called = true;
            resolvePromise(promise2, value, resolve, reject);
          },
          error => {
            if (called) return;
            called = true;
            reject(error);
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

const p = new MyPromise((resolve, reject) => {
  resolve(1);
});
p.then(e => {
  console.log(e);
  return 2;
}).then(e => {
  console.log(e);
});
