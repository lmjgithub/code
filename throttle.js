/**
 * 节流
 * @param {Function} fn 节流函数
 * @param {Number} wait 节流时间 毫秒
 */
const throttle = (fn, wait = 300) => {
  let prev = 0;
  let result;
  return function(...args) {
    let now = +new Date();
    if (now - prev > wait) {
      prev = now;
      return (result = fn.apply(this, ...args));
    }
  };
};
