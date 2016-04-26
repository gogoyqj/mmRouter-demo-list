define([], function() {
    return {
        views: {
            "": {
                template: require("./template/blog.html"), // 指定模板地址
                controller: require("./controller/blog") // 指定控制器地址
            },
            "footer@": { // 视图名字的语法请仔细查阅文档
                template: function() {
                    return "<div style=\"text-align:center;\">this is footer</div>"
                } // 指定一个返回字符串的函数来获取模板
            }
        }
    }    
})