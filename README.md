** 需要服务器环境才能跑起来【commonjs need fekit】

1，打开页面看效果

2，对着文档看例子代码 & http://ued.qunar.com/oniui/mmRouter/avalon.mmRouter.doc.html#!/

3，动手，做任何修改使之适合你的业务

4，常见问题，请看 & https://github.com/RubyLouvre/mmRouter/issues/71

5，打包

requirejs和webpack版本都支持打包以及按需加载

requirejs打包：r.js

```
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
})
```


webpack打包：StateUrlCompilationPlugin[在本项目的webpack目录下获取]

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
