define(["avalon"], function() {
    // do something
    return {
        views: {
            "": {
                template: require("../template/detail.html"),
                controller: require("../controller/detail.js")
            }
        }
    }    
})