var path = require('path');
var fs = require('fs'); 
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');//css抽取插件
var pages = require('./pages.config');

// 引入基本配置
var config = require('./webpack.config');

// 删除html导出的插件
var newPlugins = [];
config.plugins.forEach((plu) => {
  if( __typeof__(plu) != "HtmlWebpackPlugin"){
    newPlugins.push(plu);
  }
});
config.plugins = newPlugins;
        
//导出html
pages.forEach((page) => {
  config.entry[page] = path.resolve(__dirname, '../src/'+page+'/entry.js');

  const htmlPlugin = new HtmlWebpackPlugin({
    filename: '../../WEB-INF/pages/'+page+'.jsp',
    template: path.resolve(__dirname, '../src/'+page+'/page.html'),
    templateJspTop: '<%@ page contentType="text/html;charset=UTF-8" %>'
                         +'\n<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>',
    templateInitScript: '<script type="text/javascript">var appInitData = ${empty appInitData? "{}" : appInitData};</script>',
    chunks: [page, 'commons'],
    inject: true,
  });
  config.plugins.push(htmlPlugin);

  try{
    var templateFiles = fs.readdirSync(path.resolve(__dirname, '../src/'+page+'/template'));
    templateFiles.forEach(function(item) { 
      const templatePlugin = new HtmlWebpackPlugin({
        filename: '../template/'+item,
        template: path.resolve(__dirname, '../src/'+page+'/template/'+item),
    });
    config.plugins.push(templatePlugin);
    });
  }catch(e){
    
  }
});

//全局开启代码热替换
//config.plugins.push(new webpack.HotModuleReplacementPlugin());

//获得对象类型方法
function __typeof__(objClass)
 {
     if ( objClass && objClass.constructor )
     {
         var strFun = objClass.constructor.toString();
         var className = strFun.substr(0, strFun.indexOf('('));
         className = className.replace('function', '');
         return className.replace(/(^\s*)|(\s*$)/ig, '');  
     }
     return typeof(objClass);
 }

 module.exports = config;