const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

function MyPromise(fn) {
  const _ = this;
  _.value = null;
  _.status = PENDING;
  _.resolvedCallBacks = [];
  _.rejectedCallBacks = [];
  _.finallyCallBacks = [];

  function resolve(value) {
    if (value instanceof MyPromise) {
      return value.then(resolve, reject);
    }
    setTimeout(() => {
      if (_.status === PENDING) {
        _.value = value;
        _.status = RESOLVED;
        _.resolvedCallBacks.forEach(fn => fn(_.value));
        _.finallyCallBacks.forEach(fn => fn(_.value));
      }
    }, 0);
  }

  function reject(value) {
    if (_.status === PENDING) {
      _.value = value;
      _.status = REJECTED;
      _.rejectedCallBacks.forEach(fn => fn(_.value));
      _.finallyCallBacks.forEach(fn => fn(_.value));
    }
  }

  try {
    fn(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

MyPromise.prototype.then = function(onFulfilled, onRejected) {
  const _ = this;
  onFulfilled = typeof onFulfilled === "function" ? onFulfilled : v => v;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : err => {
          throw err;
        };
  if (_.status === PENDING) {
    return (promise2 = new MyPromise((resolve, reject) => {
      _.resolvedCallBacks.push(() => {
        setTimeout(() => {
          try {
            const x = onFulfilled(_.value);
            resolutionProcedure(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      });

      _.rejectedCallBacks.push(() => {
        setTimeout(() => {
          try {
            const x = onRejected(_.value);
            resolutionProcedure(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
    }));
  }
  if (_.status === RESOLVED) {
    onFulfilled(_.value);
  }
  if (_.status === REJECTED) {
    onRejected(_.value);
  }
};

MyPromise.prototype.finally = function(onFinally) {
  const _ = this;
  onFinally = typeof onFinally === "function" ? onFinally : v => v;
  if (_.status === PENDING) {
    return (promise2 = new MyPromise((resolve, reject) => {
      _.finallyCallBacks.push(() => {
        setTimeout(() => {
          try {
            let x = onFinally(_.value);
            resolutionProcedure(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
    }));
  } else {
    onFinally(_.value);
  }
};

MyPromise.prototype.catch = function(onRejected) {
  const _ = this;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : e => {
          throw err;
        };

  if (_.status === PENDING) {
    return (promise2 = new MyPromise((resolve, reject) => {
      _.rejectedCallBacks.push(() => {
        setTimeout(() => {
          try {
            let x = onRejected(_.value);
            resolutionProcedure(promise2, x, resolve, reject);
          } catch (error) {
            reject(reject);
          }
        }, 0);
      });
    }));
  }

  if (_.status === REJECTED) {
    onRejected(_.value);
  }
};

function resolutionProcedure(promise2, x, resolve, reject) {
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
    x.then(
      value => resolutionProcedure(promise2, value, resolve, reject),
      reject
    );
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
            resolutionProcedure(promise2, value, resolve, reject);
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

var p = new Promise((resolve, reject) => {
  resolve(1);
});

var p1 = p.then(e => {
  return 1;
});


setTimeout(() => {
  p.then(e=>{console.log(1)}).then(e=>{console.log(2)})
}, 1000);