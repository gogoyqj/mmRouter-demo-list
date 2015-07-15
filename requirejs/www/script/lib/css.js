/**
 * 基于requirejs text.js 插件进行一些定制修改，使得其可以支持异步加载与合并oniui的css
 * @license RequireJS text 2.0.14 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require, XMLHttpRequest, ActiveXObject,
  define, window, process, Packages,
  java, location, Components, FileUtils */

define(['module', 'text'], function (module, text) {
    'use strict';

    var masterConfig = (module.config && module.config()) || {},
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = {},
        _config;

    var css = {
        // 这个方法直接从text.js拷贝过来，由于text内部不是使用的this，因此导致不能很好的被继承
        load: function (name, req, onLoad, config) {
            _config = config || _config;
            if (config && config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config && config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName +
                    (parsed.ext ? '.' + parsed.ext : ''),
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr,
                me = this;

            // Do not load if it is an empty: url
            if (url.indexOf('empty:') === 0) {
                onLoad();
                return;
            }

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                me.get(url, function (content) {
                    me.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                req([nonStripName], function (content) {
                    me.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                });
            }
        },

        createStyle: function(name, text) {
            var style = document.createElement('style')
            style.type = 'text/css'
            style.id = name
            if(style.styleSheet && !style.sheet) {
                style.styleSheet.cssText = text
            } else {
                style.innerHTML = text
            }
            document.getElementsByTagName('head')[0].appendChild(style)
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            var me = this;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
            //if in browser inject css into page
            if(masterConfig.env === 'xhr' || (!masterConfig.env &&
            me.createXhr())) {
                me.createStyle(name, content)
            }
        },
        
        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = buildMap[moduleName];
                // write.asModule(pluginName + "!" + moduleName, "var a='" + 2 + "';\n");
                // 将文件写入 build配置的module.css内
                // console.log(requirejs.s.contexts._.config )
                // return
            console.log(_config);
            console.log(222222222222222)
                write.asModule(pluginName + "!" + moduleName, "define({});\n");
            }
        },
        // only used optimizeAllPluginResources=true 压缩源文件，诶，不支持这个api了
        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                extPart = parsed.ext ? '.' + parsed.ext : '',
                nonStripName = parsed.moduleName + extPart,
                fileName = req.toUrl(parsed.moduleName + extPart),
                me = this;

            me.load(nonStripName, req, function (value) {
                var cssWrite = function (contents) {
                    return write(fileName, contents);
                };
                cssWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                me.write(pluginName, nonStripName, cssWrite, config);
            }, config);
        }
    };

    for(var i in text) {
        if(!(i in css)) css[i] = text[i];
    }
    
    return css;
});
