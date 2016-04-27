define(['avalon', 'mmPromise', 'script/avalon.getModel.js', 'mmRequest', 'mmState', 'Animation', 'lib'], function() {
    avalon.controller.loader = function (url, callback) {
        // 没有错误回调...
        function wrapper($ctrl) {
            callback && callback($ctrl)
        }
        // require([url], wrapper)
        var md = require(url)
        if (md) {
            wrapper(md)
        } else {
            __webpack_require__.e(url, wrapper)
        }
    }
})