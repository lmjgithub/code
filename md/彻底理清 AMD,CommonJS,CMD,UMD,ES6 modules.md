# 彻底理清 AMD,CommonJS,CMD,UMD,ES6 modules
> [彻底理清 AMD,CommonJS,CMD,UMD,ES6 modules](https://mp.weixin.qq.com/s?__biz=MzI5MjUxNjA4Mw==&mid=2247486244&idx=1&sn=fcfd3a246e88e44b6c1de20ece38941a&chksm=ec0172b8db76fbae440a19a8658e9ee29cd145dc6462062568f41668f31804522a70340815c3&scene=126&sessionid=1582016153&key=47c0c8dda35b3d6e844d01eedc5897cb1e1f3224755c4619ea95e587009eb3c7fa7c1e8ab90e401913c4099b7ba2fba44cc228b756097d9395e7917781630be286b02b239cc7d174b5972800432a479e&ascene=1&uin=MTYwMDQ1MzIxNg%3D%3D&devicetype=Windows+10&version=6208006f&lang=zh_CN&exportkey=AycsYGTeluIj4BPZ9gJ2Qgg%3D&pass_ticket=HkN%2FIVoxM8F0rbevlZulkYbV5XkBGuMiHT3P4KrHVLUJdjWjDVbyKXTC8GtHG5qt)

## Rollup 是什么
一个打包 ES Module 的工具
> Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码，例如 library 或应用程序。Rollup 对代码模块使用新的标准化格式，这些标准都包含在 JavaScript 的 ES6 版本中，而不是以前的特殊解决方案，如 CommonJS 和 AMD。ES6 模块可以使你自由、无缝地使用你最喜爱的 library 中那些最有用独立函数，而你的项目不必携带其他未使用的代码。ES6 模块最终还是要由浏览器原生实现，但当前 Rollup 可以使你提前体验。

## CommonJS
CommonJS 主要运行于服务器端，该规范指出，一个单独的文件就是一个模块。
Node.js为主要实践者，它有四个重要的环境变量为模块化的实现提供支持：module、exports、require、global。
require 命令用于输入其他模块提供的功能，module.exports命令用于规范模块的对外接口，输出的是一个值的拷贝，输出之后就不能改变了，会缓存起来。
CommonJS 采用同步加载模块，而加载的文件资源大多数在本地服务器，所以执行速度或时间没问题。但是在浏览器端，限于网络原因，更合理的方案是使用异步加载。

## AMD
- AMD是"Asynchronous Module Definition"的缩写，意思就是"异步模块定义"。
- 它采用异步方式加载模块，模块的加载不影响它后面语句的运行。
- 所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。
- 其中 RequireJS 是最佳实践者。
- 模块功能主要的几个命令：define、require、return和define.amd。
- define是全局函数，用来定义模块,define(id?, dependencies?, factory)。
- require命令用于输入其他模块提供的功能，return命令用于规范模块的对外接口，define.amd属性是一个对象，此属性的存在来表明函数遵循AMD规范。

## CMD
- CMD(Common Module Definition - 通用模块定义)规范主要是Sea.js推广中形成的，一个文件就是一个模块，可以像Node.js一般书写模块代码。
- 主要在浏览器中运行，当然也可以在Node.js中运行。
- 它与AMD很类似，不同点在于：AMD 推崇依赖前置、提前执行，CMD推崇依赖就近、延迟执行。

## CMD 和 AMD 的区别
-  CMD 更加接近于 CommonJS 的写法
-  AMD 更加接近于浏览器的异步的执行方式
```JS
// AMD 
define(function (require) {
    var model1 = require('./model1');
    console.log(model1.getHello());
    var model2 = require('./model2');
    console.log(model2.getHello());
});
// model1 entry -> model2 entry -> model1 -> model2

// CMD
define(function(require, exports, module) {
    var model1 = require('./model1'); //在需要时申明
    console.log(model1.getHello());
    var model2 = require('./model2'); //在需要时申明
    console.log(model2.getHello());
});
// model1 entry -> model1 -> model2 entry -> model2
```

## UMD
- UMD(Universal Module Definition - 通用模块定义)模式，该模式主要用来解决CommonJS模式和AMD模式代码不能通用的问题，并同时还支持老式的全局变量规范。
- 判断define为函数，并且是否存在define.amd，来判断是否为AMD规范
- 判断module是否为一个对象，并且是否存在module.exports来判断是否为CommonJS规范
- 如果以上两种都没有，设定为原始的代码规范。

## ES Modules
- ES modules（ESM）是 JavaScript 官方的标准化模块系统。
- 它因为是标准，所以未来很多浏览器会支持，可以很方便的在浏览器中使用。(浏览器默认加载不能省略.js)
- 它同时兼容在node环境下运行。
- 模块的导入导出，通过import和export来确定。可以和Commonjs模块混合使用。
- ES modules 输出的是值的引用，输出接口动态绑定，而 CommonJS 输出的是值的拷贝。
- ES modules 模块编译时执行，而 CommonJS 模块总是在运行时加载。

## CommonJS 执行特点
1. CommonJS 模块中 require 引入模块的位置不同会对输出结果产生影响，并且会生成值的拷贝。
2. CommonJS 模块重复引入的模块并不会重复执行，再次获取模块只会获得之前获取到的模块的缓存。

## ES6 模块编译执行特点
1. import 命令会被 JavaScript 引擎静态分析，优先于模块内的其他内容执行。
2. export 命令会有变量声明提前的效果。

```JS
// a.js
console.log('a.js')
import { age } from './b.js';

// b.js
export let age = 1;
console.log('b.js 先执行');

// 运行 index.html 执行结果:
// b.js 先执行
// a.js
```

## Tree shaking
**使用 Tree-shaking 要注意代码的副作用**
1. 没有使用额外的模块系统，直接定位import来替换export的模块
2. 去掉了未被使用的代码

## ES Modules 之所以能 Tree-shaking 的原因
1. import 只能作为模块顶层的语句出现，不能出现在 function 里面或是 if 里面。
2. import 的模块名只能是字符串常量。
3. 不管 import 的语句出现的位置在哪里，在模块初始化的时候所有的 import 都必须已经导入完成。
4. import binding 是 immutable 的，类似 const。比如说你不能 import { a } from ‘./a’ 然后给 a 赋值个其他什么东西。

**CommonJS 同步加载， AMD 异步加载， UMD = CommonJS + AMD , ES Module 是标准规范, 取代 UMD，是大势所趋。Tree-shaking 牢记副作用。**