## mmState CLI && demo list

### CLI

```
    npm install mmstate #安装

    mmstate new projectName #创建一个默认使用avalon 1.7的mmState项目

    mmstate new -h
        -v, --avalonVersion [avalonVersion]  avalon的版本
        -l, --loader [loader]                打包方式，requirejs or webpack，avalon 2只能用webpack打包

    cd projectName 

    mmstate serve #启动服务器

    mmstate update #更新模板库，linux上可能需要 suo

    mmstate build #编译
```


### 例子



** 需要服务器环境才能跑起来【commonjs need fekit】

1，打开页面看效果

2，对着文档看例子代码 & http://ued.qunar.com/oniui/mmRouter/avalon.mmRouter.doc.html#!/

3，动手，做任何修改使之适合你的业务

4，常见问题，请看 & https://github.com/RubyLouvre/mmRouter/issues/71

5，打包

requirejs和webpack版本都支持打包以及按需加载

###requirejs打包：gulpfile.js

build task配置

```
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
```


###webpack打包：StateUrlCompilationPlugin[在本项目的webpack目录下获取]

重写avalon.controller.loader

```
    avalon.controller.loader = function (url, callback) {
        if (url.join) {
            __webpack_require__.e(url[1], function (r) {
                callback(r(url[0]))
            })
        } else {
            var msg = url + '没有打包进来'
            window.console && console.log(msg)
            throw Error(msg)
        }
    }
```

webpack.config配置

```
'use strict';

var path = require('path');
var fs = require('fs');

var webpack = require('webpack');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var StateUrlCompilationPlugin = require('./StateUrlCompilationPlugin')

var excludeFromStats = [
    /node_modules[\\\/]/,
    /\.html/
];

var srcDir = path.resolve(process.cwd(), 'www');

var alias = {
    avalon     : 'script/avalon.new',
    '../avalon': 'script/avalon.new',
    mmRequest  : 'script/mmRequest/mmRequest',
    mmPromise  : 'script/mmPromise/mmPromise',
    mmRouter   : 'script/mmRouter/mmRouter',
    mmHistory  : 'script/mmRouter/mmHistory',
    mmState    : 'script/mmRouter/mmState',
    route      : 'script/route',
    Animation  : 'script/animation/avalon.animation'
}

function makeConf(options){
    options = options || {};

    var config = {
        entry: {
            "detail": ["script/detail"],
            "list"  : ["script/list"],
            "route" : ["route", "script/blog"],
            "lib"   : ['avalon', 'mmPromise', 'script/avalon.getModel.js', 'mmRequest', 'mmState', 'Animation']
        },
        output: {
            path: path.resolve('./'),
            filename: 'build/script/[name].js',
            chunkFilename: 'build/script/[name].js',
            publicPath: '/'
        },

        resolve: {
            root: [path.resolve(srcDir, 'build'), srcDir],
            alias: alias,
            extensions: ['', '.js', '.css', '.scss', '.png', '.jpg', '.jpeg']
        },

        module: {
            noParse: ['avalon', 'script/avalon.new', 'node_modules'],
            loaders: [
                {test: /\.css$/, loader: 'style-loader!css-loader'},
                {test: /\.html$/, loader: 'html', exclude: [/.(ex|doc)[0-9]*\.html/]}
            ],
            // preLoaders: [
            //     {test: /\.js$/, loader: "amdcss-loader"}
            // ]
        },
        plugins: [
            new ExtractTextPlugin('build/css/[name].css',{
                allChunks: true
            }),
            new webpack.ProvidePlugin({
                avalon: "avalon"
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: "lib", 
                minChunks: Infinity,
                filename: "build/script/lib.js"
            }),
            new StateUrlCompilationPlugin({})
        ],
        devServer: {
            stats: {
                cached: false,
                exclude: excludeFromStats,
                colors: true
            }
        }
    };

    return config;
}

module.exports = makeConf({});

```
