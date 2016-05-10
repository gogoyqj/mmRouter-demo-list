var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('webserver', function() {
    gulp
    .src('./www')
    .pipe(webserver({
        livereload: true,
        port: 8080,
        open: true
    }));
});

gulp.task('build', function() {
    var requirejs = require('requirejs');

    var config = {
        appDir: "www",
        baseUrl: "script/",
        dir: "build",
        map: {
            "*": {
                "css": "require-css/css",
                "text": "lib/text",
                "avalon": "empty:" // 不打包avalon
            }
        },
        skipDirOptimize: true, // 只处理modules的配置
        optimizeCss: "none",
        //separateCSS: true,
        //buildCSS: false,
        modules: [
            {
                name: "common"
            },
            {
                name: "pages/stateBlog",
                exclude: ["text"]
            },
            {
                name: "pages/stateDetail",
                exclude: ["text"]
            },
            {
                name: "pages/stateList",
                exclude: ["text"]
            }
        ]
    };

    requirejs.optimize(config, function (buildResponse) {
        var contents = fs.readFileSync(config.out, 'utf8');
    }, function(err) {
    });
});