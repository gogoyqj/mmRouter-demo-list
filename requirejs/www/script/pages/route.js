define(["oniui/tree/avalon.tree"], function() {
        // 定义一个顶层的vmodel，用来放置全局共享数据
        var root = avalon.define("root", function(vm) {
            vm.page = ""
        })

        // 重写模板加载器，改为用text插件加载
        // avalon.state.templateLoader = function(url, resolve, reject, reason) {
        //     avalon.require(["text!" + url], function(tpl) {
        //         resolve(avalon.templateCache[url] = tpl)
        //     })
        // }
        // 定义一个全局抽象状态，用来渲染通用不会改变的视图，比如header，footer
        avalon.state("blog", {
            url: "/",
            abstract: true, // 抽象状态，不会对应到url上
            // onEnter: function(rs, rj) {
                // return false // 中断
                // 可以在这里做一些权限判断
            // },
            views: {
                "": {
                    templateUrl: "pages/common/blog.html", // 指定模板地址
                    controllerUrl: "pages/common/blog" // 指定控制器地址
                },
                "footer@": { // 视图名字的语法请仔细查阅文档
                    template: function() {
                        return "<div style=\"text-align:center;\">this is footer</div>"
                    } // 指定一个返回字符串的函数来获取模板
                }
            }
        }).state("blog.list", { // 定义一个子状态，对应url是 /{pageId}，比如/1，/2
            url: "{pageId}",
            // 可以按照state模块化，在state的onEnter回调里去load module
            onEnter: function(pageId, rs, rj)    {
                requirejs(["pages/lists/index"], function() {
                    rs()
                })
                return false
            },
            views: {
                "": {
                    templateUrl: "pages/lists/list.html",
                    controllerUrl: "pages/lists/lists",
                    ignoreChange: function(type) {
                        return !!type
                    } // url通过{}配置的参数变量发生变化的时候是否通过innerHTML重刷ms-view内的DOM，默认会，如果你做的是翻页这种应用，建议使用例子内的配置，把数据更新到vmodel上即可
                }
            }
        }).state("blog.detail", { // 定义一个子状态，对应url是 /detail/{blogId}，比如/detail/1。/detail/2
            url: "detail/{blogId}",
            views: {
                "": {
                    templateUrl: "pages/detail/detail.html",
                    controllerUrl: "pages/detail/detail"
                }
            }
        }).state("blog.detail.comment", {
            views: {
                "": {
                    templateUrl: "pages/comment/comment.html"
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
        // return {
        //     init: function() {
                avalon.history.start({
                    // basepath: "/mmRouter",
                    fireAnchor: false
                })
                //go!!!!!!!!!
                avalon.scan()
        //     }
        // }
    })