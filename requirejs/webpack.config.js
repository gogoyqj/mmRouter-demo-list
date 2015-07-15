var webpack = require('webpack');
var plugin = new webpack.ProvidePlugin({
    avalon: "avalon",
    "window.avalon": "avalon"
});
module.exports = {
      context: __dirname + "/script", // 根目录
      entry: {
          test: "./test",
          main: "./main"
      },
      output: {
          path: __dirname + '/script',
          filename: '[name].build.js'
      },
      module: {
          loaders: [
                //{ test: /\.js$/, loader: 'jsx-loader?harmony'  },
                //{ test: /\.less$/, loader: 'style-loader!css-loader!less-loader'  }, // use ! to chain loaders
                //{ test: /\.css$/, loader: 'style-loader!css-loader'  },
                //{ test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'  } // inline base64 URLs for <=8k images, direct URLs for the rest
          ],
          noParse: [
              /avalon\.shim\.js$/,
              /mmRequest\/mmRequest\.js$/
          ]
      },
      resolve: {
          // you can now require('file') instead of require('file.coffee')
          extensions: ['', '.js'],
          alias: {
              avalon: __dirname + '/script/avalon.shim.js' // 绝对地址
          }
      }
};
