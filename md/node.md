## global
## util
### util.promisify(fn)
### util.types.isArgumentsObject(value)
### util.types.isAsyncFunction(value)
### util.types.isBooleanObject(value)
### util.types.isBoxedPrimitive(value)
### util.types.isDate(value)
### util.types.isGeneratorFunction(value)
### util.types.isGeneratorObject(value)
### util.types.isMap(value)
### util.types.isPromise(value)
### util.types.isProxy(value)
### util.types.isRegExp(value)
### util.types.isSet(value)
### util.types.isWeakMap(value)
### util.types.isWeakSet(value)

## events
### newListener
### removeListener
### EventEmitter.defaultMaxListeners
### emitter.addListener,emitter.on
### emitter.emit
### emitter.eventNames()
### emitter.getMaxListeners()
### emitter.off,emitter.removeListener
### emitter.once
### emitter.prependListener
### emitter.removeAllListeners
removeListener() 最多只会从监听器数组中移除一个监听器。 如果监听器被多次添加到指定 eventName 的监听器数组中，则必须多次调用 removeListener() 才能移除所有实例。

## stream
可缓冲的数据大小取决于传入流构造函数的 highWaterMark 选项。 对于普通的流， highWaterMark 指定了字节的总数。 对于对象模式的流， highWaterMark 指定了对象的总数。
- writeable
- readable
- duplex
- transform

如果可读流在处理期间发送错误，则可写流目标不会自动关闭。 如果发生错误，则需要手动关闭每个流以防止内存泄漏。


### stream.Writable
- close
- drain
- error
- finish
- pipe
- unpipe