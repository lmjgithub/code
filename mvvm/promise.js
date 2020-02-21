const PENDING = "penging";
const RESOLVED = "resolved";
const REJECTED = "rejected";

function MyPromise(fn) {
  const _ = this;
  _.state = PENDING;
  _.value = null;
  _.resolvedCallBacks = [];
  _.rejectedCallBacks = [];

  function resolve(value) {
    if (value instanceof MyPromise) {
      return value.then(resolve, reject);
    }

    setTimeout(() => {
      if (_.state === PENDING) {
        _.state = RESOLVED;
        _.value = value;
        _.resolvedCallBacks.forEach(cb => cb(_.value));
      }
    }, 0);
  }

  function reject(value) {
    if (_.state === PENDING) {
      _.state = REJECTED;
      _.value = value;
      _.rejectedCallBacks.forEach(cb => cb(_.value));
    }
  }

  try {
    fn(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

function resolutionProcedure(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError("error"));
  }

  if (x instanceof MyPromise) {
    x.then(value => {
      resolutionProcedure(promise2, value, resolve, reject);
    }, reject);
  }

  let called = false;
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            resolutionProcedure(promise2, y, resolve, reject);
          },
          e => {
            if (called) return;
            called = true;
            reject(e);
          }
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) true;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}

MyPromise.prototype.then = function(onFulfilled, onRejected) {
  const _ = this;
  onFulfilled = typeof onFulfilled === "function" ? onFulfilled : v => v;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : v => {
          throw v;
        };

  if (_.state === PENDING) {
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
    // _.resolvedCallBacks.push(onFulfilled);
    // _.rejectedCallBacks.push(onRejected);
  }
  if (_.state === RESOLVED) {
    onFulfilled(_.value);
  }
  if (_.state === REJECTED) {
    onRejected(_.value);
  }
};

/* const a = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject("MyPromise 1");
  }, 2000);
});

a.then(
  a => {
    return new MyPromise((resolve, reject) => {
      setTimeout(() => {
        resolve("x");
      }, 1000);
    });
  },
  e => {
    console.log(e);
    return "MyPromise err";
  }
).then(a => {
  console.log(a);
}); */

var b = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("promise 1");
  }, 1000);
});

b.catch(e => {
  console.log(1);
  return "xxx";
}).then(e => console.log(e));
