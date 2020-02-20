/**
 *  1. 新生成了一个对象
    2. 链接到原型
    3. 绑定 this
    4. 返回新对象
 */
function myNew() {
  let obj = {};
  let fn = [].shift.call(arguments);
  obj.__proto__ = fn.prototype;

  let result = fn.apply(obj, arguments);
  return result instanceof Object ? result : obj;
}
