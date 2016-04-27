requirejs.config({
    baseUrl: "script/",
    urlArgs: "@ver=ver@",
    map: {
        "*": {
            // "avalon": "avalon.shim" // 意为所有avalon都指向avalon.shim
            "css": "require-css/css",
            "text": "lib/text"
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
        "avalon": "lib/avalon.shim" // 跟map上的配置实现同样的效果
    },
    pragmasOnSave: {
        excludeRequireCss: true
    }
});
// 为了可以预览，直接在这里requirejs，而不是通过include
requirejs(["avalon", "lib/oniui/avalon.getModel", "lib/oniui/mmRouter/mmState", "lib/oniui/mmRequest/mmRequest", "lib/oniui/animation/avalon.animation", "text"], function () {
    avalon.require = requirejs
});
