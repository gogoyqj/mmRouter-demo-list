var fs = require("fs"),
    stateUrlReg = /([\'\"]?stateUrl[\'\"]?[\s]?:[^\'\"]?[\'\"])([^\'\"]+)([\'\"])/g,
    getStateUrl = function(mat) {
        return mat.split(':')[1].replace(/[\'\"]+/g, '').trim()
    }
function StateUrlCompilationPlugin(options) {
    this.options = options || {}
}

StateUrlCompilationPlugin.prototype.apply = function(compiler) {
    var stateUrls = {}, replaceFiles = {}
    compiler.plugin('emit', function(compilation, callback) {
        for (var basename in compilation.assets) {
            var entry = compilation.assets[basename]
                content = entry.source()
            content.replace(stateUrlReg, function(mat) {
                replaceFiles[basename] = stateUrls[getStateUrl(mat)] = 1
            })
        }
        var chunks = compilation.chunks,
                modules = compilation.modules;
            chunks.forEach(function(chunk) {
                var cid = chunk.id,
                    cname = chunk.name,
                    cmodules = chunk.modules,
                    mdIds = []
                cmodules.forEach(function(md) {
                    var id = md.id,
                        file = md.identifier().replace(/\\/g, '\/')
                    for (stateUrl in stateUrls) {
                        var _stateUrl = stateUrl.replace(/[\.]+/g, '')
                        if (file.indexOf(_stateUrl) != -1 && stateUrls[stateUrl] == 1) {
                            stateUrls[stateUrl] = [id, cid]
                            break
                        } 
                    }
                })
            })
            for (var basename in compilation.assets) {
                var entry = compilation.assets[basename]
                if (replaceFiles[basename]) {
                    function _tmp(ct) {
                        return function() {
                            return ct.replace(stateUrlReg, function(mat) {
                                var stateUrl = getStateUrl(mat)
                                if (!stateUrls[stateUrl].join) return mat
                                return mat.replace(new RegExp('[\'\"]' + stateUrl + '[\'\"]'), '[' + stateUrls[stateUrl].join(',') + ']')
                            })
                        }
                    }
                    entry.source = _tmp(entry.source())
                }
            }
            for (var stateUrl in stateUrls) {
                if (stateUrls[stateUrl] == 1) {
                   compilation.errors.push('在entry和chunk内都未能找到' + stateUrl + '，请在webpack配置文件内添加')
                }
            }
        callback();
    });
    compiler.plugin('done', function(compilation) {
    })
};

module.exports = StateUrlCompilationPlugin;