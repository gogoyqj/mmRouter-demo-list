define([], function() {
    var cache = window._cache = {}
    var detail = avalon.define({
        $id: "detail",
        title: "",
        content: "",
        blogId: 0,
        comments: [],
        ct: "",
        comment: function(e) {
            e.preventDefault()
            avalon.router.go("blog.detail.comment", mmState.currentState.params)
        },
        post: function(e) {
            e.preventDefault()
            if(detail.ct) {
                cache[detail.blogId] = cache[detail.blogId] || []
                cache[detail.blogId].push(detail.ct)
                detail.comments.push(detail.ct)
            }
            avalon.router.go("blog.detail", mmState.currentState.params, {confirmed: true})
        }
    })

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
        }
        // 进入视图
        // 进入视图
        $ctrl.$onEnter = function(params, rs) {
            var blogId = params.blogId !== "" ? params.blogId : 0
            setTimeout(function() {
                var json = {
                    title: '有趣的文章',
                    blogId: blogId,
                    content: "从前有座山，山上有个庙，庙里有个老和尚再讲故事：从前有座山……"
                }
                detail.ct = ""
                detail.title = json.title
                detail.blogId = json.blogId
                detail.comments = cache[blogId] || []
                detail.content = "<p>" + json.content.split("。").join("。</p><p>") + "</p>"
                rs()
            }, 200)
            return false
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    })
})