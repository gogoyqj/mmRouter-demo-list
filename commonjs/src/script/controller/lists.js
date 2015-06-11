(function() {
    var lists = avalon.define("lists", function(vm) {
        vm.blogs = []
        vm.totalPage = 9
        vm.currentPage = 0

        vm.pre = function(e) {
            e.preventDefault()
            vm.currentPage--
        }
        vm.next = function(e) {
            e.preventDefault()
            vm.currentPage++
        }
    })

    lists.$watch("currentPage", function(pageId) {
        avalon.router.go("blog.list", {pageId: pageId})
    })

    exports.controller = avalon.controller(function($ctrl) {
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            avalon.log("leave list")
        }
        // 进入视图
        $ctrl.$onEnter = function(params) {
            lists.currentPage = params.pageId !== "" ? params.pageId : 0
            return avalon.ajax({
                url: "api/list.json",
                data: {
                    action: "list",
                    pageId: lists.currentPage
                },
                dataType: "json",
                success: function(list) {
                    lists.blogs = list
                }
            })
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    })
})()