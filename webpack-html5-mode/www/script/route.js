define(["./mmRouter/mmState", "./mmRequest/mmRequest", "./animation/avalon.animation"], function() {
    // 定义一个顶层的vmodel，用来放置全局共享数据
    var root = avalon.define({
        $id: "root",
        page: ""
    }), $ = require('jquery')

    // 定义一个全局抽象状态，用来渲染通用不会改变的视图，比如header，footer
    avalon.state("blog", {
        url: "/",
        abstract: true, // 抽象状态，不会对应到url上
        stateUrl: "./blog"
    }).state("blog.list", { // 定义一个子状态，对应url是 /{pageId}，比如/1，/2
        url: "{pageId}",
        stateUrl: "./list"
    }).state("blog.detail", { // 定义一个子状态，对应url是 /detail/{blogId}，比如/detail/1。/detail/2
        url: "detail/{blogId}",
        stateUrl: "./detail"
    }).state("blog.detail.comment", {
        views: {
            "": {
                template: require("./template/comment.html")
            }
        }
    })

    avalon.controller.loader = function (url, callback) {
        if (url.join) {
            __webpack_require__.e(url[1], function (r) {
                callback(r(url[0]))
            })
        } else {
            var msg = url + '没有打包进来'
            window.console && console.log(msg)
            throw Error(msg)
        }
    }

    avalon.state.config({
        onError: function() {
            console.log("错误信息：" + arguments[0].message)
        }, // 强烈打开错误配置
        onLoad: function() {
            root.page = mmState.currentState.stateName.split(".")[1]
        },
        onViewEnter: function(newNode, oldNode) {
            avalon(oldNode).animate({
                marginLeft: "-100%"
            }, 500, "easein", function() {
                oldNode.parentNode && oldNode.parentNode.removeChild(oldNode)
            })
             
        } // 不建议使用动画，因此实际使用的时候，最好去掉onViewEnter和ms-view元素上的oni-mmRouter-slide

    })
    
    avalon.history.start({
        basepath: "/",
        html5Mode: true,
        fireAnchor: false
    })
    //go!!!!!!!!!
    avalon.scan()
})