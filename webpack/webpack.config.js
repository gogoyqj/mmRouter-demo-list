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
            "detail": ['route', 'script/blog', 'script/detail'],
            "list"  : ['route', 'script/blog', 'script/list'],
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
            new webpack.optimize.CommonsChunkPlugin({
                name: "route", 
                minChunks: Infinity,
                chunks: ["route", "detail", "list"],
                filename: "build/script/route.js"
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
