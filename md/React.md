# React

## 问题
* context 在那几个生命周期里面可以访问
##  跨组件通信

### Context
context 只是个对象里面不应含有任何业务逻辑的实现，

#### React.createContext
创建一个 Context 对象。
当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 Provider 中读取到当前的 context 值。

#### Context.Provider
```js
<MyContext.Provider value={/* 某个值 */}>
```
Provider 及其内部 consumer 组件都不受制于 shouldComponentUpdate 函数，因此当 consumer 组件在其祖先组件退出更新的情况下也能更新。

#### Class.contextType
class组件可以通过 以下两种方式来消费 context
```
	static contextType = MyContext;
	// 或者
	MyClass.contextType = MyContext;
```

#### Context.Consumer
这个函数接收当前的 context 值，返回一个 React 节点。
传递给函数的 value 值等同于往上组件树离这个 context 最近的 Provider 提供的 value 值。
如果没有对应的 Provider，value 参数等同于传递给 createContext() 的 defaultValue。
```js
<ThemeContext.Consumer>{value => value}</ThemeContext.Consumer>
```

### 组合组件
使用一个特殊的 children prop 来将他们的子组件传递到渲染结果中
```js
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}
```
## 错误处理
如果一个 class 组件中定义了 static getDerivedStateFromError() 或 componentDidCatch() 这两个生命周期方法中的任意一个（或两个）时，那么它就变成一个错误边界。
当抛出错误后，
请使用 static getDerivedStateFromError() 渲染备用 UI ，
使用 componentDidCatch() 打印错误信息。
**错误边界仅可以捕获其子组件的错误，它无法捕获其自身的错误**
开发环境会显示错误界面，生产环境则会正确显示

## Refs
**你不能在函数组件上使用 ref 属性;因为他们没有实例**
**在函数组件内部使用 ref 属性**
**简单来说函数组件输出的是VDOM对象，不是组件实例，不能调用组件的提供的方法；在函数组件中可以对 DOM 元素或 类 组件使用Refs**
适合使用 refs 的场景

* 管理焦点，文本选择或媒体播放。
* 触发强制动画。
* 集成第三方 DOM 库。

###  React.createRef()
ref 不是 prop 属性

```js
// Refs传递 转发方式
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;

// Refs传递 回调方式
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}
class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```

### 关于回调 refs 的说明
如果 ref 回调函数是以内联函数的方式定义的，在更新过程中它会被执行两次，第一次传入参数 null，然后第二次会传入参数 DOM 元素。这是因为在每次渲染时会创建一个新的函数实例，所以 React 清空旧的 ref 并且设置新的。通过将 ref 的回调函数定义成 class 的绑定函数的方式可以避免上述问题，但是大多数情况下它是无关紧要的。

## HOC
用于复用组件逻辑的一种高级技巧，是参数为组件，返回值为新组件的函数。
组件是将 props 转换为 UI，而高阶组件是将组件转换为另一个组件。
* 不要改变原始组件。使用组合。
* 约定
	* 将不相关的 props 传递给被包裹的组件
	* 最大化可组合性
	* 包装显示名称以便轻松调试
* 不要在 render 方法中使用 HOC
* 务必复制静态方法
	* 使用 hoist-non-react-statics 自动拷贝所有非 React 静态方法
	* 额外导出这个静态方法
* Refs 不会被传递

## Portals
Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的方案

### Portals
从 portal 内部触发的事件会一直冒泡至包含 React 树的祖先，即便这些元素并不是 DOM 树 中的祖先。

## Profiler
Profiler 测量渲染一个 React 应用多久渲染一次以及渲染一次的“代价”。

## Diffing 算法
* 比对不同类型的元素
	* 当根节点为不同类型的元素时，React 会拆卸原有的树并且建立起新的树
* 比对同一类型的元素
	* 当比对两个相同类型的 React 元素时，React 会保留 DOM 节点，仅比对及更新有改变的属性。
	* 在处理完当前节点之后，React 继续对子节点进行递归。
* 比对同类型的组件元素
	* 当一个组件更新时，组件实例保持不变，这样 state 在跨越不同的渲染时保持一致。 
	* 调用 render() 方法，diff 算法将在之前的结果以及新的结果中进行递归。
* 对子节点进行递归
	* 在默认条件下，当递归 DOM 节点的子元素时，React 会同时遍历两个子元素的列表；当产生差异时，生成一个 mutation。
	* 在子元素列表末尾新增元素时，更变开销比较小；
	* React 支持 key 属性。当子元素拥有 key 时，React 使用 key 来匹配原有树上的子元素以及最新树上的子元素。

## Render Props
* 指一种在 React 组件之间使用一个值为函数的 prop 共享代码的简单技术
* 具有 render prop 的组件接受一个函数，该函数返回一个 React 元素并调用它而不是实现自己的渲染逻辑。
* render prop 是一个用于告知组件需要渲染什么内容的函数 prop

## StrictMode

## react 工作流程
1. 渲染 阶段会确定需要进行哪些更改，比如 DOM。在此阶段，React 调用 render，然后将结果与上次渲染的结果进行比较。
2. 提交 阶段发生在当 React 应用变化时。（对于 React DOM 来说，会发生在 React 插入，更新及删除 DOM 节点的时候。）在此阶段，React 还会调用 componentDidMount 和 componentDidUpdate 之类的生命周期方法。


### 渲染阶段的生命周期包括以下 class 组件方法
下列方法可能会被多次调用，所以不要在它们内部编写副作用相关的代码
* constructor
* componentWillMount
* componentWillReceiveProps
* componentWillUpdate
* getDerivedStateFromProps
* shouldComponentUpdate
* render
* setState 更新函数（第一个参数）

## props
可以通过配置特定的 defaultProps 属性来定义 props 的默认值：
```js
ClassComponent.defaultProps = {
  name: 'Stranger'
};
```

## 非受控组件
```js
// 始终是一个非受控组件
<input type="file" />
```

### Web Components

### Hook Component 和 Class Component 性能比较

> React Hooks 究竟有多慢？ https://juejin.im/post/5e3ac653e51d45270b7d4e3d

* 当使用 Hook 的时候，整体性能相比 Class 组件会有 10 - 20% 的性能降低。
* 当仅仅使用函数式组件，而不使用 Hook 的时候，性能不会有降低。也就是说可以放心使用纯函数式组件
* Hook 的性能降低不仅仅体现在渲染过程，就算是在第一次挂载过程中，也相比 Class 有一定程度的降低
* Hook 的性能降低有三部分
	* 第一部分是 Hook 的调用，比如说 useState 这些。但是这里有一点需要注意的是，这里的调用指的是有无，而不是数量。简单来说就是从 0 到 1，性能降低的程度远远高于 从 1 到 n。
	* 第二部分是因为引入 Hook 而不得不在每次渲染的时候创建大量的函数闭包，临时对象等等
	* 第三部分是 React 对 Hook 处理所带来的额外消耗，比如对 Hook 链表的管理、对依赖的处理等等。随着 Hook 的增加，这些边际内容所占用的时间也会变得越来越大。

但 Hook 有一点很强，在逻辑的复用上，是远高于 HOC 方式，算是扳回一局。

## Hooks的使用
> [React Hooks的体系设计之一 - 分层](https://zhuanlan.zhihu.com/p/106665408)
* 状态的分层设计
	* 最底层的内置hook，不需要自己实现，官方直接提供。
	* 简化状态更新方式的hook，比较经典的是引入immer来达到更方便地进行不可变更新的目的。
	* 引入“状态 + 行为”的概念，通过声明状态结构与相应行为快速创建一个完整上下文。
	* 对常见数据结构的操作进行封装，如数组的操作。
	* 针对通用业务场景进行封装，如分页的列表、滚动加载的列表、多选等。
	* 实际面向业务的实现。
* 使用immer更新状态
* 状态与行为的封装
* 数据结构的抽象
	* 	针对常用数据结构的抽象，在试图解决一些问题的同时，也能扩展一些行为；
* 通用场景封装
	* 场景的封装不应与组件库耦合，它应当是业务与组件之间的桥梁，不同的组件库使用相同的hook实现不同的界面，这才是一个理想的模式：

**四种类型的组件是当你觉得它们有意义的时候，你可以使用的一种模式。它们并不是硬性规定。如果你不确定某些内容是否需要拆分，那就不要拆分，因为即使某些组件比其他组件更臃肿，世界末日也不会到来。**
