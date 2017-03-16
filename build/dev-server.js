// 引入必要的模块
var express = require('express');
var bodyParder = require('body-parser');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var url = require("url"); 
var config = require('./webpack.config.dev');
var routers = require('./router.config');

// 创建一个express实例
var app = express()

// 调用webpack并把配置传递过去
var compiler = webpack(config)

// 使用 webpack-dev-middleware 中间件
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    stats: {
        colors: true,
        chunks: false
    }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)

// webpack插件，监听html文件改变事件
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        // 发布事件
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})

// 注册中间件
app.use(devMiddleware)
// 注册中间件
app.use(hotMiddleware)
// 请求内容解析中间件
app.use(bodyParder());
//设置路由
for ( var pathName in routers ){
    var router = routers[pathName];
    console.log("router pathName=",pathName);
    console.log("router",router);
    if(router.method == "post"){
        app.post(pathName, function (req, res) {
            //res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
            var pathname = url.parse(req.url).pathname;

            console.log("pathname=",pathname);
            console.log("[post params] = ", req.body);
            console.log("[method = post], file="+path.resolve(__dirname, '../'+routers[pathname].file));
            
            var data= fs.readFileSync(path.resolve(__dirname, '../'+routers[pathname].file),"utf-8");
            console.log("res data=",data);
            //res.contentType('json');//返回的数据类型  
            res.send(data); 
            res.end(); 
        });
    }else{
        app.get(pathName, function (req, res) {
            //res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
            var pathname = url.parse(req.url).pathname;
            console.log("pathname=",pathname);
            console.log("[get params] = ", req.body);
            console.log("[method = get], file="+path.resolve(__dirname, '../'+routers[pathname].file));
            var data= fs.readFileSync(path.resolve(__dirname, '../'+routers[pathname].file),"utf-8");
            console.log("res data=",data);
            //res.contentType('json');//返回的数据类型  
            res.send(data); 
            res.end();
        });
    }
}

// 监听 8888端口，开启服务器
app.listen(8888, function (err) {
    if (err) {
        console.log(err)
        return
    }
    console.log('Listening at http://localhost:8888')
})