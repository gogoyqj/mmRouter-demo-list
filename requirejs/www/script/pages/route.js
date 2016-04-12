define(["avalon", "lib/oniui/mmRouter/mmState", "text!pages/comment/comment.html"], function(avalon, x, commentTpl) {
        // 定义一个顶层的vmodel，用来放置全局共享数据
        var root = avalon.define({
            page : "",
            $id: "root",

            $opt: {
                multiple: true,
                data: []
            },

            source: []
        })

        // root.$opt.$source = root.source

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
            stateUrl: "pages/stateBlog"
        }).state("blog.list", { // 定义一个子状态，对应url是 /{pageId}，比如/1，/2
            url: "{pageId}",
            stateUrl: "pages/stateList"
        }).state("blog.detail", { // 定义一个子状态，对应url是 /detail/{blogId}，比如/detail/1。/detail/2
            url: "detail/{blogId}",
            stateUrl: "pages/stateDetail"
        }).state("blog.detail.comment", {
            views: {
                "": {
                    template: commentTpl
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