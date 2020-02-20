function EventEmitter() {
  const subs = {};
  const emit = (event, ...args) => {
    if (subs[event] && subs[event].length) {
      subs[event].forEach(cb => cb(...args));
    }
  };
  const on = (event, cb) => {
    (subs[event] || (subs[event] = [])).push(cb);
  };

  const off = (event, offcb) => {
    if (offcb) {
      if (subs[event] && subs[event].length) {
        subs[event] = subsp[event].filter(cb => cb !== offcb);
      }
    } else {
      subs[event] = [];
    }
  };
  return { emit, on, off };
}
