define(["avalon", "text!../template/detail.html", "./detail"], function(avalon, tpl, ctrl) {
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