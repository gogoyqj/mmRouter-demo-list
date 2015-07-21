({
    appDir: "www",
    mainConfigFile: "www/script/common.js",
    dir: "build",
    skipDirOptimize: true, // 只处理modules的配置
    removeCombined: true, // 删除已经合并的文件
    // optimizeCss: "none", // npm install csso -g must
    //separateCSS: true,
    //buildCSS: false,
    modules: [
        {
            name: "../common",
            include: ["css", "text", "require-css/normalize"]
        },
        {
            name: "../route-blog",
            exclude: ["../common", "require-css/normalize"], // 不打包某文件，异步加载
            include: ["pages/route", "pages/common/blog", "text!pages/common/blog.html"] // 显式的要求将某文件打包，若果使用了route可以显式的在这里将模板和controller打包进来
        }
    ]
})