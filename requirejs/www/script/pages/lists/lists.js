define([], function() {
    var lists = avalon.define("lists", function(vm) {
        vm.blogs = []
        vm.totalPage = 9
        vm.currentPage = 0

        vm.$tree = {
            children: [
                { name:"父节点1 - 展开", open:true,
                    children: [
                        { name:"父节点11 - 折叠", open: false,
                            children: [
                                { name:"叶子节点111"},
                                { name:"叶子节点112"},
                                { name:"叶子节点113"},
                                { name:"叶子节点114"}
                            ]},
                        { name:"父节点12 - 折叠", open: false,
                            children: [
                                { name:"叶子节点121"},
                                { name:"叶子节点122"},
                                { name:"叶子节点123"},
                                { name:"叶子节点124"}
                            ]},
                        { name:"父节点13 - 没有子节点", isParent:true, open: false}
                    ]},
                { name:"父节点2 - 折叠", open: false,
                    children: [
                        { name:"父节点21 - 展开", open:true,
                            children: [
                                { name:"叶子节点211"},
                                { name:"叶子节点212"},
                                { name:"叶子节点213"},
                                { name:"叶子节点214"}
                            ]},
                        { name:"父节点22 - 折叠", open: false,
                            children: [
                                { name:"叶子节点221"},
                                { name:"叶子节点222"},
                                { name:"叶子节点223"},
                                { name:"叶子节点224"}
                            ]},
                        { name:"父节点23 - 折叠", open: false,
                            children: [
                                { name:"叶子节点231"},
                                { name:"叶子节点232"},
                                { name:"叶子节点233"},
                                { name:"叶子节点234"}
                            ]}
                    ]},
                { name:"父节点3 - 没有子节点", isParent:true, open: false}
            ]
        }

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