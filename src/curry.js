const curry = fn =>
  (_curry = (...args) =>
    args.length >= fn.length
      ? fn(...args)
      : (...newArgs) => _curry(...args, ...newArgs));
