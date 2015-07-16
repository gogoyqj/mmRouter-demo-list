var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var rjs = require('requirejs');
gulp.task('build', function(cb) {
    rjs.optimize({
        appDir: "www",
        mainConfigFile: "www/script/common.js",
        dir: "build",
        skipDirOptimize: true, // 只处理modules的配置
        removeCombined: true, // 删除已经合并的文件
        // optimizeCss: "none", // npm install csso must
        // separateCSS: true,
        // buildCSS: false,
        // stubModules: ["text"],
        modules: [
            {
                name: "../common",
                include: ["css", "text", "require-css/normalize"]
            },
            {
                name: "../route-blog",
                exclude: ["../common", "require-css/normalize"], // 不打包某文件，异步加载
                include: ["pages/route"] // 显式的要求将某文件打包，若果使用了route可以显式的在这里将模板和controller打包进来
            }
        ]
    }, function(buildResponse) {
        // console.log('build response', buildResponse);
        cb();
        // 比如修改模板文件的版本号
        // 比如合并require-css生成的独立的css文件
        // 替换图片的路径
    }, cb);
});
