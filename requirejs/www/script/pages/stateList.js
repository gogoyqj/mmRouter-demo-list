define([], function() {
    // do something
    return {
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
    }    
})