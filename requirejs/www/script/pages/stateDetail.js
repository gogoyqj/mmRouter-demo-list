define(["avalon", "text!./detail/detail.html", "./detail/detail"], function(avalon, tpl, ctrl) {
    // do something
    return {
        views: {
            "": {
                template: tpl,
                controller: ctrl
            }
        }
    }    
})