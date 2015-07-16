// 一个入口文件
({
    baseUrl: ".",
    name: "main",
    out: "main-built.js",
    map: {
        "*": {
            "css": "require-css/css"
        }
    },
    paths: {
        avalon: "empty:" or avalon: "avalon.shim"
    }
})

// 多个入口文件
({
    baseUrl: ".",
    map: {
        "*": {
            "css": "require-css/css"
        }
    },
    paths: {
        avalon: "empty:" or avalon: "avalon.shim"
    },
    modules: [
        {
            name: "page1"
        },
        {
            name: "page2"
        }
    ]
})