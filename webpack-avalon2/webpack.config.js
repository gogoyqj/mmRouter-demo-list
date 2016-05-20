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
    avalon     : 'script/avalon',
    '../avalon': 'script/avalon',
    mmRequest  : 'script/mmRequest/mmRequest',
    mmPromise  : 'script/mmPromise/mmPromise',
    mmRouter   : 'script/mmRouter/mmRouter',
    mmHistory  : 'script/mmRouter/mmHistory',
    mmState    : 'script/mmRouter/mmState',
    route      : 'script/route',
    Animation  : 'script/animation/avalon.animation',
}

function makeConf(options){
    options = options || {};

    var config = {
        entry: {
            "avalon": ["avalon"],
            "detail": ["script/detail"],
            "list"  : ["script/list"],
            "route" : ["route", "script/blog"],
            "lib"   : ['mmPromise', 'mmRequest', 'mmState', 'Animation']
        },
        output: {
            path: path.resolve('./'),
            filename: 'build/script/[name].js',
            chunkFilename: 'build/script/[name].js',
            publicPath: '/',
        },

        resolve: {
            root: [path.resolve(srcDir, 'build'), srcDir],
            alias: alias,
            extensions: ['', '.js', '.css', '.scss', '.png', '.jpg', '.jpeg']
        },

        module: {
            noParse: ['avalon', 'node_modules'],
            loaders: [
                {test: /\.css$/, loader: 'style-loader!css-loader'},
                {test: /\.html$/, loader: 'html', exclude: [/.(ex|doc)[0-9]*\.html/]}
            ],
        },
        plugins: [
            new ExtractTextPlugin('build/css/[name].css',{
                allChunks: true
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: "avalon", 
                minChunks: Infinity,
                filename: "build/script/avalon.js"
            }),
            // new webpack.optimize.CommonsChunkPlugin({
            //     name: "lib", 
            //     minChunks: Infinity,
            //     filename: "build/script/lib.js"
            // }),
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
