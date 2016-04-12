define(["avalon"], function() {
    // do something
    return {
        views: {
            "": {
                templateUrl: "./script/template/blog.html", // 指定模板地址
                controllerUrl: "./controller/blog.js" // 指定控制器地址
            },
            "footer@": { // 视图名字的语法请仔细查阅文档
                template: function() {
                    return "<div style=\"text-align:center;\">this is footer</div>"
                } // 指定一个返回字符串的函数来获取模板
            }
        }
}    
})