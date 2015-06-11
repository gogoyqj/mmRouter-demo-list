define([], function() {
    var cache = {}
    var detail = avalon.define("detail", function(vm) {
        vm.title = ""
        vm.content = ""
        vm.blogId = 0
        vm.comments = []
        vm.ct = ""
        vm.comment = function(e) {
            e.preventDefault()
            avalon.router.go("blog.detail.comment", mmState.currentState.params)
        }
        vm.post = function(e) {
            e.preventDefault()
            if(vm.ct) {
                cache[vm.blogId] = cache[vm.blogId] || []
                cache[vm.blogId].push(vm.ct)
                vm.comments.push(vm.ct)
            }
            avalon.router.go("blog.detail", mmState.currentState.params, {confirmed: true})
        }
    })

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
        }
        // 进入视图
        $ctrl.$onEnter = function(params) {
            var blogId = params.blogId !== "" ? params.blogId : 0
            detail.comments = cache[blogId] || []
            detail.ct = ""
            return avalon.ajax({
                url: "api/data.php",
                data: {
                    action: "detail",
                    blogId: blogId
                },
                dataType: "json",
                success: function(json) {
                    detail.title = json.title
                    detail.blogId = json.blogId
                    detail.content = "<p>" + json.content.split("。").join("。</p><p>") + "</p>"
                }
            })
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    })
})