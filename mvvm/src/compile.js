export default function Compile(el, vm) {
  vm.$el = document.querySelector(el);
  let fragment = document.createDocumentFragment();
  while ((child = vm.$el.firstChild)) {
    fragment.appendChild(child);
  }

  function replace(frag) {
    Array.from(frag.childNodes).forEach(node => {
      let txt = node.textContent;
      let reg = /\{\{(.*?)\}\}/g;

      if (node.nodeType === 3 && reg.test(txt)) {
        let arr = RegExp.$1.split(".");
        let val = vm;
        arr.forEach(key => {
          val = val[key];
        });
        node.textContent = txt.replace(reg, val).trim();
      }
      if (node.childNodes && node.childNodes.length) {
        replace(node);
      }
    });
  }
  replace(fragment);
  vm.$el.appendChild(fragment);
}
