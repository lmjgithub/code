# Babel
Babel 是一个 JavaScript 编译器。

##  只是转译新标准引入的语法
* 箭头函数
* let / const
* 解构

## 不会转译需要引入 polyfill 来实现的API
* 全局变量
* Promise
* Symbol
* WeakMap
* Set
* includes
* generator 函数

## Bebel编译阶段

![image-20200214140923778](C:%5CUsers%5CAdministrator%5CAppData%5CRoaming%5CTypora%5Ctypora-user-images%5Cimage-20200214140923778.png)
1. 解析（Parsing）：将代码字符串解析成抽象语法树。
2. 转换（Transformation）：对抽象语法树进行转换操作。
3. 生成（Code Generation）: 根据变换后的抽象语法树再生成代码字符串。

###  解析（Parsing）
#### AST
```JSON
{
  "type": "Program",
  "body": [
    {
      "type": "ExpressionStatement",
      "expression": {
        "type": "CallExpression",
        "callee": {
          "type": "MemberExpression",
          "computed": false,
          "object": {
            "type": "Identifier",
            "name": "console"
          },
          "property": {
            "type": "Identifier",
            "name": "log"
          }
        },
        "arguments": [
          {
          "type": "Literal",
          "value": "zcy",
          "raw": "'zcy'"
          }
        ]
      }
    }
  ],
  "sourceType": "script"
}
```
##### 分词
语法单元通俗点说就是代码中的最小单元，不能再被分割，就像原子是化学变化中的最小粒子一样。
Javascript 代码中的语法单元主要包括以下这么几种：
* 关键字：const、 let、  var 等
* 标识符：可能是一个变量，也可能是 if、else 这些关键字，又或者是 true、false 这些常量
* 运算符
* 数字
* 空格
* 注释：对于计算机来说，知道是这段代码是注释就行了，不关心其具体内容

##### 语法分析
语法分析是对语句和表达式识别，这是个递归过程，在解析中，Babel  会在解析每个语句和表达式的过程中设置一个暂存器，用来暂存当前读取到的语法单元，如果解析失败，就会返回之前的暂存点，再按照另一种方式进行解析，如果解析成功，则将暂存点销毁，不断重复以上操作，直到最后生成对应的语法树。

### 转换（Transformation）
#### Plugins
插件应用于 babel 的转译过程，尤其是第二个阶段 Transformation，如果这个阶段不使用任何插件，那么 babel 会原样输出代码。

#### Presets
Babel 官方帮我们做了一些预设的插件集，称之为 Preset，这样我们只需要使用对应的 Preset 就可以了。每年每个 Preset 只编译当年批准的内容。而 babel-preset-env 相当于 ES2015 ，ES2016 ，ES2017 及最新版本。

#### Plugin/Preset 路径
* 如果 Plugin 是通过 npm 安装，可以传入 Plugin 名字给 Babel，Babel 将检查它是否安装在 node_modules 中。
* 指定你的 Plugin/Preset 的相对或绝对路径。

#### Plugin/Preset 排序
* Plugin 会运行在 Preset 之前。
* Plugin 会从第一个开始顺序执行。
* Preset 的顺序则刚好相反(从最后一个逆序执行)。

### 生成（Code Generation）
用 babel-generator 通过 AST 树生成 ES5 代码。

## 常用的工具
### @babel/core
Babel 的编译器，核心 API 都在这里面，比如常见的 transform、parse。

### @babel/cli
cli 是命令行工具,  安装了 @babel/cli 就能够在命令行中使用 babel  命令来编译文件。当然我们一般不会用到，打包工具已经帮我们做好了。

### @babel/node
直接在 node 环境中，运行 ES6 的代码。

### babylon
Babel 的解析器。

### babel-traverse
用于对 AST 的遍历，维护了整棵树的状态，并且负责替换、移除和添加节点。

### babel-types
用于 AST 节点的 Lodash 式工具库, 它包含了构造、验证以及变换 AST 节点的方法，对编写处理 AST 逻辑非常有用。

### babel-generator
Babel 的代码生成器，它读取 AST 并将其转换为代码和源码映射（sourcemaps）。

## babel plugin 插件例子
```js
module.exports = function(babel) {
  return {
    visitor: {
      VariableDeclarator(path, state) {
        if (path.node.id.name == "a") {
          path.node.id = babel.types.identifier("b");
        }
      }
    }
  };
};

```
## 测试 babel plugin
```js
const babel = require('@babel/core');

const c = `var a = 1`;

const { code } = babel.transform(c, {
    plugins: [
        function ({ types: t }) {
            return {
                visitor: {
                    VariableDeclarator(path, state) {
                        if (path.node.id.name == 'a') {
                            path.node.id = t.identifier('b')
                        }
                    }
                }
            }
        }
    ]
});

console.log(code)
```


