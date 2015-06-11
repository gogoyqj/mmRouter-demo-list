avalon框架
====================


### 修改过的内容

* 增加 avalon.$ui ，可以获取页面中的 avalon 定义的对象
* 增加 window.$$ ，指代 window.avalon
* 增加 avalon.assign , 可以为某个深层结构递归赋值
* 增加 avalon.getModel , 可以根据表达式获取对应的 vmodel

1.2.3

* 增加avalon.live.js

1.2.4

* 排除中间生成的代理vm
* 取得离组件最近的vm

1.2.5

* 升级widget绑定
* ms-widget必须在ms-controller的控制范围之内

1.3

* 增加vm的缓存池

1.3.1

* 增加对svg的支持
* 支持sanitize过滤器
* 暴露avalon.templateCaches

1.3.2

* 支持事件系统
* 事件系统改名及支持全局发包的方式 20140811更新

1.3.3

* 修正style样式
* 修复ie6下bug 2014-08-20更新
* fix DOMNodeRemovedFromDocument 操作

1.3.4

* 优化repeat
* 标准化onmousewheel事件

1.3.5 

* fix ms-include 引发的死循环BUG

1.3.6

* 添加includeReplace指令
* fix avalon 变量alls书写错误
* fix ie8 下float 解析bug
* make sure data-include-src的data-include-rendered回调在include进的模板被全部扫描之后才调用