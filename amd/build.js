({
    appDir: "www",
    baseUrl: "script/",
    dir: "build",
    map: {
        "*": {
            "css": "require-css/css",
            "avalon": "empty:" // 不打包avalon
        }
    },
    skipDirOptimize: true, // 只处理modules的配置
    optimizeCss: "none",
    //separateCSS: true,
    //buildCSS: false,
    modules: [
        {
            name: "route"
        }
    ]
})