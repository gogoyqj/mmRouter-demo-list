requirejs.config({
    baseUrl: "script/lib/",
    urlArgs: "@ver=ver@",
    map: {
        "*": {
            // "avalon": "avalon.shim" // 意为所有avalon都指向avalon.shim
            "css": "require-css/css"
        }
    },
    shim: {
        "avalon": {
            exports: "avalon"
        },
        "avalon.shim": {
            exports: "avalon"
        }
    },
    paths: {
        "avalon": "avalon.shim", // 跟map上的配置实现同样的效果
        "pages": "../pages/"
    },
    pragmasOnSave: {
        excludeRequireCss: true
    }
});
// 为了可以预览，直接在这里requirejs，而不是通过include
requirejs(["avalon", "oniui/avalon.getModel", "oniui/mmRouter/mmState", "oniui/mmRequest/mmRequest", "oniui/animation/avalon.animation"], function (argument) {
    avalon.require = requirejs
});