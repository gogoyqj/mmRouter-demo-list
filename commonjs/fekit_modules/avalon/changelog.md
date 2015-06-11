Changelog

======

> 1.3.9 (2015-01-15)

+ ms-html内部不再使用异步
+ head元素中的avalon元素加入ms-skip指令
+ 重构计算属性，现在超级轻量化
+ 重构CG回收，不会每次都全部检测所有绑定对象
+ 重构内部方法isArrayLike，更好的判定非负整数
+ 重构number过滤器
+ 重构widget的节点回收，去掉onTree方法
+ 重构Collection内部工厂
+ 重构modelFactory, 现在VM.$event.$digest开启异步刷新视图功能
+ 重构offsetParent
+ 重构ms-repeat，不再触发多余的回调
+ 针对IE下 MutationObserver 会撕碎文本节点BUG， 添加 mergeTextNode 内部方法
优化短路与， 短路或的处理逻辑
+ 支持CommonJS和AMD和单文件三种方式引用，支持通过bower命令加载avalon
+ avalon.modern.js遗漏了 parseJSON补上，并且修正parseJSON的逻辑与原生的JSON.parse保持一致
去掉所有与scanCallback相关的定时器
