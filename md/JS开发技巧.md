# JS开发技巧
## String Skill
### 格式化金钱
```JS
const ThousandNum = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
```

### 生成随机ID
```JS
const RandomId = len =>Math.random().toString(36).substr(3, len);
```

### 生成随机HEX色值
```JS
const RandomColor = () =>"#" + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0");
```

###  操作URL查询参数
```JS
const params = new URLSearchParams(location.search.replace(/\?/ig, ""));
```

## Number Skill

### 取整
```JS
// 代替正数的Math.floor()，代替负数的Math.ceil()
const num1 = ~~ 1.69;
const num2 = 1.69 | 0;
const num3 = 1.69 >> 0;
```

### 补零
```JS
const FillZero = (num, len) => num.toString().padStart(len, "0");
```

### 精确小数
```JS
const RoundNum = (num, decimal) =>Math.round(num * 10 ** decimal) / 10 ** decimal;
```

### 判断奇偶
```JS
const OddEven = num => !!(num & 1) ? "odd" : "even";
```

### 生成范围随机数
```JS
const RandomNum = (min, max) =>Math.floor(Math.random() * (max - min + 1)) + min;
```

## Boolean Skill

### 判断数据类型
```JS
// 可判断类型：undefined、null、string、number、boolean、array、object、symbol、date、regexp、function、asyncfunction、arguments、set、map、weakset、weakmap
function DataType(tgt, type) {
    const dataType = Object.prototype.toString.call(tgt).replace(/\[object (\w+)\]/, "$1").toLowerCase();
    return type ? dataType === type : dataType;
}
```

### 是否为空对象
```JS
const flag = DataType(obj, "object") && !Object.keys(obj).length;
```

## Array Skill

### 混淆数组
```JS
const arr = [0, 1, 2, 3, 4, 5].slice().sort(() =>Math.random() - .5);
```

### 过滤空值
```JS
[undefined, null, "", 0, false, NaN, 1, 2].filter(Boolean);
```

### 获取随机数组成员
```JS
const randomItem = arr[Math.floor(Math.random() * arr.length)];
```

## Object Skill
### 删除对象无用属性
```JS
const obj = { a: 0, b: 1, c: 2 }; // 只想拿b和c
const { a, ...rest } = obj;
```

## Function Skill

### 惰性载入函数
```JS
function Func() {
    if (a === b) {
        console.log("x");
    } else {
        console.log("y");
    }
}
// 换成
function Func() {
    if (a === b) {
        Func = function() {
            console.log("x");
        }
    } else {
        Func = function() {
            console.log("y");
        }
    }
    return Func();
}
```

### 检测非空参数
```JS
function IsRequired() {
    throw new Error("param is required");
}
function Func(name = IsRequired()) {
    console.log("I Love " + name);
}
```

### 优雅处理Async/Await参数
```JS
function AsyncTo(promise) {
    return promise.then(data => [null, data]).catch(err => [err]);
}
const [err, res] = await AsyncTo(Func());
```

### 优雅处理多个函数返回值
```JS
function Func() {
    return Promise.all([
        fetch("/user"),
        fetch("/comment")
    ]);
}
const [user, comment] = await Func(); 
```

## DOM Skill
### 自适应页面
```JS
// 页面基于一张设计图但需做多款机型自适应，元素尺寸使用rem进行设置
function AutoResponse(width = 750) {
    const target = document.documentElement;
    target.clientWidth >= 600
        ? (target.style.fontSize = "80px")
        : (target.style.fontSize = target.clientWidth / width * 100 + "px");
}
```

### 过滤XSS
```JS
function FilterXss(content) {
    let elem = document.createElement("div");
    elem.innerText = content;
    const result = elem.innerHTML;
    elem = null;
    return result;
}
```