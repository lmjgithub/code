/**
 * 防抖
 * @param {Function} fn 需要执行的函数
 * @param {Number} wait 防抖时间 毫秒
 * @param {boolean} leading 是否立即执行
 */
function debounce(fn, wait = 50, leading = true) {
  let timer, result;
  return function(...args) {
    timer && clearTimeout(timer);
    if (leading) {
      if (!timer) result = fn.apply(this, args);
      timer = setTimeout(() => {
        timer = null;
      }, wait);
    } else {
      timer = setTimeout(() => {
        result = fn.apply(this, args);
      }, wait);
    }
    return result;
  };
}
