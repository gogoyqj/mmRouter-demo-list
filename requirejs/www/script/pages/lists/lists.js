define([], function() {
    var lists = avalon.define({
        $id: "lists",
        blogs: [],
        totalPage: 9,
        currentPage: 0,
        pre: function(e) {
            e.preventDefault()
            lists.currentPage--
        },
        next: function(e) {
            e.preventDefault()
            lists.currentPage++
        }
    })

    lists.$watch("currentPage", function(pageId) {
        avalon.router.go("blog.list", {pageId: pageId})
    })

    return avalon.controller(function($ctrl) {
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            avalon.log("leave list")
        }
        // 进入视图
        $ctrl.$onEnter = function(params, rs) {
            lists.currentPage = params.pageId !== "" ? params.pageId : 0
            setTimeout(function() {
                var arr = []
                while(arr.length < 10) {
                    arr.push({
                        id: arr.length + 10 * lists.currentPage,
                        title: "从前有座山的故事"
                    })
                }
                lists.blogs = arr
                rs()
            }, 200)
            return false
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    })
})