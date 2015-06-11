define(["./mmRouter/mmState", "./mmRequest/mmRequest", "./animation/avalon.animation"], function() {
    // 定义一个顶层的vmodel，用来放置全局共享数据
    var root = avalon.define("root", function(vm) {
        vm.page = ""
    })

    // 定义一个全局抽象状态，用来渲染通用不会改变的视图，比如header，footer
    avalon.state("blog", {
        url: "/",
        abstract: true, // 抽象状态，不会对应到url上
        views: {
            "": {
                templateUrl: "./script/template/blog.html", // 指定模板地址
                controllerUrl: "./controller/blog.js" // 指定控制器地址
            },
            "footer@": { // 视图名字的语法请仔细查阅文档
                template: function() {
                    return "<div style=\"text-align:center;\">this is footer</div>"
                } // 指定一个返回字符串的函数来获取模板
            }
        }
    }).state("blog.list", { // 定义一个子状态，对应url是 /{pageId}，比如/1，/2
        url: "{pageId}",
        views: {
            "": {
                templateUrl: "./script/template/list.html",
                controllerUrl: "./controller/lists.js",
                ignoreChange: function(type) {
                    return !!type
                } // url通过{}配置的参数变量发生变化的时候是否通过innerHTML重刷ms-view内的DOM，默认会，如果你做的是翻页这种应用，建议使用例子内的配置，把数据更新到vmodel上即可
            }
        }
    }).state("blog.detail", { // 定义一个子状态，对应url是 /detail/{blogId}，比如/detail/1。/detail/2
        url: "detail/{blogId}",
        views: {
            "": {
                templateUrl: "./script/template/detail.html",
                controllerUrl: "./controller/detail.js"
            }
        }
    }).state("blog.detail.comment", {
        views: {
            "": {
                templateUrl: "./script/template/comment.html"
            }
        }
    })

    avalon.state.config({
        onError: function() {
            console.log(arguments)
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
    return {
        init: function() {
            avalon.history.start({
                // basepath: "/mmRouter",
                fireAnchor: false
            })
            //go!!!!!!!!!
            avalon.scan()
        }
    }
})