# Proxy
> [ES6 之 Proxy 巧用，涨知识了！](https://mp.weixin.qq.com/s?__biz=MzUxNzk1MjQ0Ng==&mid=2247484790&idx=1&sn=75be9278facc25f62034b3f2f1ba22bd&chksm=f99103a7cee68ab1b95262474c4662db33b6d6f7d2fe2cd64bb06759406299a63ce2738ab6c9&scene=126&sessionid=1581902973&key=63c035b2857395ed0d850e489c73d4e5d26afc0e73a5a4aa4fe5dd15c850f1cf3c612ea1d593340860b9c47ed790b6b5166ea7d0878c39f4b9f8caf585dc5d9471a054cc0344d90ffaa4eb49c8b1464f&ascene=1&uin=MTYwMDQ1MzIxNg%3D%3D&devicetype=Windows+10&version=6208006f&lang=zh_CN&exportkey=A75sUYgX2RN7QVhFHLbF%2Bss%3D&pass_ticket=2HnXN9DWry2ktyerQWSKEGfzWHJmpyBNXzAiKp7IujLKIPu2%2FM%2Fd3GuoCZnFr7om) 

## 为什么要使用 Proxy？
Proxy 提供虚拟化接口来控制任何目标 Object的行为。这样做可以在简单性和实用性之间取得平衡，而不会牺牲兼容性。
## Polyfill
Proxy 没有完整的 polyfill。然而，有一个由谷歌编写的 partial polyfill for Proxy ，它支持get、set、apply和construct trap，并适用于IE9+。
## 它是 Proxy 吗？
根据Javascript语言规范，无法确定对象是否是代理。但是，在 Node 10+上，可以使用util.types.isProxy方法。
## Proxy 目标是什么？
给定一个代理对象，就不可能获得或更改目标对象。也不可能获取或修改处理程序对象。
## Proxy 代理对象
Proxy的一个限制是目标必须是Object。这意味着我们不能直接使用像String这样的原语。
## Proxy 性能
Proxy的一个主要缺点是性能。因浏览器和使用而异，但是对于性能有要求的代码来说，代理不是最好的方法。当然，可以衡量影响并确定代理的优势是否超过对性能的影响。
## Proxy 可以实现的功能
### 默认值/“零值”
### 负索引数组
### 隐藏属性 实现私有属性
### 缓存
### 枚举和只读视图
### 运算符重载
### cookie对象

