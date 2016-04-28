define(["./mmRouter/mmState", "./mmRequest/mmRequest", "./animation/avalon.animation"], function() {
    // 定义一个顶层的vmodel，用来放置全局共享数据
    var root = avalon.define({
        $id: "root",
        page: "",
        views: {
            "": {
                template: require("./template/comment.html")
            }
        },
        onReady: function() {
            avalon.controller.stateUrls = {
                './blog': '',
                './list': '',
                './detail': ''
            }
            avalon.controller.loader = function (url, callback) {
                if (avalon.controller.stateUrls[url]) url = avalon.controller.stateUrls[url]
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
                }

            })
            
            avalon.history.start({
                // basepath: "/mmRouter",
                fireAnchor: false
            })
        }
    })
})