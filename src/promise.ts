/**
 * 0: pending，当前 Promise 正在执行中
 * 1: fulfilled, 表示执行了 `resolve` 函数，并且 _value instanceof Promise === true
 * 2: rejected, 表示执行了`reject` 函数
 * 3: fulfilled, 执行了 `resolve 函数，并且 _value instanceof Promise === false
 */
type _state = 0 | 1 | 2 | 3;

function LPromise(fn) {
  /** 常规操作，如果不是 Promise 实例，就先甩锅（报错）**/
  if (!(this instanceof Promise))
    throw new TypeError("Promises must be constructed via new");

  /** 如果入参 `fn` 不是函数，也报错，“我不管，就是你的错” **/
  if (typeof fn !== "function") throw new TypeError("not a function");

  /** 初始化一系列状态变量，想象成各种监视 Promise 内部运转行为的各种监视器 **/
  this._state = 0;
  this._handled = false;
  this._value = undefined;
  this._deferreds = [];

  /** 开始调用传入 `fn` 函数，doResolve 方法解释在下方 👇  **/
  doResolve(fn, this);
}

function doResolve(fn, self) {
  /** 先初始化 `done` 变量为 false，这个 `done` 变量挺有用的，确保 `resolve` 和 `reject` 只执行一次 **/
  var done = false;

  try {
    /** 立即执行传入的 fn(resolve,reject)，注意这个 “立即执行”，敲黑板，这是考试重点！**/
    fn(
      /** 这里是 fn 的 resolve 回调**/
      function (value) {
        /** done 变量发挥了它的作用 **/
        if (done) return;
        done = true;

        /** 这里是 Promise 内部 resove 方法的调用，注意区分！！这个函数待会儿会讲**/
        resolve(self, value);
      },
      /** 这里是 fn 的 reject 回调**/
      function (reason) {
        /** done 变量再一次发挥了它的作用 **/
        if (done) return;
        done = true;
        /** 同样这里是 Promise 内部 reject 方法的调用**/
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
  this.onRejected = typeof onRejected === "function" ? onRejected : null;
  this.promise = promise;
}

function resolve(self, newValue) {
  try {
    /** resolve 的值不能为本身 this 对象，不然要死循环了；虽说你可以狠起来连自己都打，但在 Promise 里不行 **/
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
      
    /** 如果被 resolve 值为 Promise 对象的情况，特殊处理 **/
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        /** 如果是 promise 对象，_state = 3 **/
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        /** 兼容类 Promise 对象的处理方式，对其 then 方法继续执行 doResolve **/
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    /** 被 resolve 的为正常值时的流程，_state = 1 **/
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}
