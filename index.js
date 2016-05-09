#!/usr/bin/env node
var program = require('commander'),
    fs      = require('fs-extra'),
    clc     = require('cli-color'),
    child_process = require('child_process'),
    Download= require('download'),
    unzip   = require('unzip'),
    http    = require('https'),
    which   = require('os').tmpdir().indexOf('\\') != -1 ? 'where' : 'which',
    tpldir  = __dirname + '/__tpldir',
    infoPath= tpldir + '/__info.json'


function error(msg) {
    console.error(clc.red('[ERROR] ' + msg))
}
function log(msg) {
    console.log(clc.white('[LOG] ' + msg))
}
function warning(msg) {
    console.log(clc.yellow('[WARNING] ' + msg))
}
function success(msg) {
    console.log(clc.green('[SUCCESS] ' + msg))
}

function loadInfo() {
    if (fs.existsSync(tpldir)) {
        try {
            var config = fs.readJsonSync(infoPath)
            if ('v' in config) return config['v']
        } catch(e) {

        }
    }
    return false
}

function commandChecker(cmd) {
    try {
        child_process.execSync(which + ' ' + cmd).toString()
        success(cmd + '已安装')
        return true
    } catch(e) {
        error(cmd + ' is required, run "npm install -g ' + cmd + '"')
        return false
    }
}

program
    .version('1.0.0')

program
    .command('new [projectName]')
    .option('-v, --avalonVersion [avalonVersion]', 'avalon的版本')
    .option('-l, --loader [loader]', '打包方式，requirejs or webpack，avalon 2只能用webpack打包')
    .description('new projectName@version 创建一个新项目')
    .action(function (projectName, options) {
        options = options || {}
        if (fs.existsSync(projectName)) {
            return error(projectName + '已存在')
        }
        var loader = options.loader == 'requirejs' ? 'requirejs' : 'webpack',
            avalonVersion = (options.avalonVersion || '').match(/^2/g) ? '-avalon2'  : ''
        if (avalonVersion == '-avalon2') loader = 'webpack'
        var p = './' + loader + avalonVersion
        fs.mkdirSync(projectName)
        if (loader == 'webpack') {
            commandChecker('webpack')
        } else {
            commandChecker('r.js')
        }

        var currentVersion = loadInfo()

        if (currentVersion !== false) {
            p = tpldir + '/' + 'mmRouter-demo-list-' + currentVersion + '/' + p
            if (!fs.existsSync(p)) return error('模板库错误，run " mmstate update --force=true"')
        }

        try {
            fs.copySync(p, projectName)
            fs.writeJsonSync(projectName + '/__info.json', {
                loader: loader
            })
            fs.mkdirSync(projectName + '/node_modules')
            // cnpm
            child_process.exec('npm --registry=https://registry.npm.taobao.org --cache=$HOME/.npm/.cache/cnpm --disturl=https://npm.taobao.org/dist --userconfig=$HOME/.cnpmrc install', {
                cwd: projectName
            }, function(error, stdout, stderr) {
                log(stdout.toString())
                if (!error) {
                    success(projectName + '创建成功')
                } else {
                    error(error)
                    error(stderr.toString())
                }
            })
        } catch (err) {
            error('无法拷贝模板文件' + err)
            fs.rmdirSync(projectName)
        }


    })

program
    .command('serve')
    .description('serve 启动服务')
    .action(function (options) {
        var cwd = process.cwd(),
            __info = cwd + '/__info.json'
        try {
            __info = fs.readJsonSync(__info)
            if (__info.loader !== 'requirejs') {
                var ps = child_process.spawn('gulp', ['run-webpack'])
                ps.stdout.on('data', function (data) {
                    log(data.toString());
                });

                ps.stderr.on('data', function (data) {
                    error(data.toString());
                });
            }
        } catch(e) {
            return error('启动失败' + error)
        }
    })

program
    .command('update')
    .option('-f, --force [force]', '强制更新')
    .description('update 更新模板库')
    .action(function(options) {
        var emsg = '下载更新包失败',
            options = options || {}
        http.get('https://github.com/gogoyqj/mmRouter-demo-list/releases/latest', function(res) {
            res.on('data', function(d) {
                var version = d.toString().match(/[0-9]+\.[0-9]+\.[0-9]+/g),
                    currentVersion = loadInfo()
                version = version && version[0]
                if (!version) error('未能查询到更新包版本号')
                if (currentVersion === version && !options.force) return success('本地已经是最新版本' + version)
                if (currentVersion !== false) fs.removeSync(tpldir)
                log('正在更新...')
                var file = version + '.zip'
                var d = new Download({mode: '755'})
                    .get('https://github.com/gogoyqj/mmRouter-demo-list/archive/' + file)
                    .dest(tpldir)
                    .run(function (err, files) {
                        if (err) {
                            return error()
                        }
                        fs.writeJsonSync(infoPath, {
                            v: version
                        })
                        fs.createReadStream(tpldir + '/' + file).pipe(unzip.Extract({
                            path: tpldir
                        })).on('close', function(e) {
                            fs.removeSync(tpldir + '/' + file)
                            success('更新到' + version)
                        }).on('error', function(e) {
                            error('解压失败' + (e && e.message || e))
                        })
                    })
            });
        }).on('error', function(e) {
            error(emsg + e.message)
        })
    })

program.parse(process.argv)