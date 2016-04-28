var fs = require("fs"),
    stateUrlReg = /([\'\"]?stateUrl[\'\"]?[\s]?[:=][^\'\"]?[\'\"])([^\'\"]+)([\'\"])/g,
    complexStateUrlReg = /[\t\s]*avalon\.controller\.stateUrls[\s]*=[\s]*\{[^\}]+\}/gm
    getStateUrl = function(mat) {
        return mat.split(':')[1].replace(/[\'\"]+/g, '').trim()
    }
function StateUrlCompilationPlugin(options) {
    this.options = options || {}
}

StateUrlCompilationPlugin.prototype.apply = function(compiler) {
    var stateUrls = {}, replaceFiles = {}
    compiler.plugin('emit', function(compilation, callback) {
        // 调整策略,这样只需要匹配一次
        var chunks = compilation.chunks,
            modules = compilation.modules,
            modulesTree = {}, stateUrlToMC = {};
        chunks.forEach(function(chunk) {
            var cid = chunk.id,
                cname = chunk.name,
                cmodules = chunk.modules,
                mdIds = []
            cmodules.forEach(function(md) {
                var id = md.id,
                    file = md.identifier().replace(/\\/g, '\/')
                // 构建file => [moduleID, chunkId]
                modulesTree[file] = [id, cid]
            })
        })
        for (var basename in compilation.assets) {
            var entry = compilation.assets[basename]
            function _tmp(ct) {
                return function() {
                    return ct.replace(stateUrlReg, function(mat) {
                        var stateUrl = getStateUrl(mat),
                            mc = findMCByStateUrl(modulesTree, stateUrl)
                        if (!mc) {
                            compilation.errors.push('在entry和chunk内都未能找到' + stateUrl + '，请在webpack配置文件内添加')
                            return mat
                        }
                        return mat.replace(new RegExp('[\'\"]' + stateUrl + '[\'\"]'), '[' + mc.join(',') + ']')
                    }).replace(complexStateUrlReg, function(mat) {
                        try {
                            var urls = (new Function('return ' + mat.match(/\{[^\}]+\}/gm)[0] + ';'))()
                            for (var stateUrl in urls) {
                                var //stateUrl = urls[stateName] + '',
                                    mc = findMCByStateUrl(modulesTree, stateUrl)
                                if (!mc) {
                                    compilation.errors.push('在entry和chunk内都未能找到' + stateUrl + '，请在webpack配置文件内添加')
                                } else {
                                    urls[stateUrl] = mc
                                }
                            }
                            return mat.split('=')[0] + '= avalon.mix(avalon.controller.stateUrls || {}, ' + JSON.stringify(urls) + ');'
                        } catch(e) {
                            compilation.errors.push('未能序列化\n' + mat + '\n请检查' + basename)
                            return mat
                        }
                    })
                }
            }
            entry.source = _tmp(entry.source())
        }
        callback();
    });
    compiler.plugin('done', function(compilation) {
    })
};

function findMCByStateUrl(obj, stateUrl) {
    var _stateUrl = stateUrl.replace(/[\.]+/g, '')
    for (var file in obj) {
        var _stateUrl = stateUrl.replace(/[\.]+/g, '')
        if (file.indexOf(_stateUrl) != -1) {
            return obj[file]
        }
    }
    return false
}

module.exports = StateUrlCompilationPlugin;