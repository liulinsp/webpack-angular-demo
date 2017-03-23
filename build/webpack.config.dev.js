var path = require('path');
var fs = require('fs'); 
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');//css抽取插件
var pages = require('./pages.config');

// 引入基本配置
var config = require('./webpack.config');


config.output.publicPath = '/';

var newPlugins = [];
//newPlugins.push(new webpack.optimize.OccurrenceOrderPlugin());
//增加热部署插件
newPlugins.push(new webpack.HotModuleReplacementPlugin());
//增加警告提示插件
newPlugins.push(new webpack.NoEmitOnErrorsPlugin());

// 删除html导出的插件和清空target目录插件
config.plugins.forEach((plu) => {
  if( __typeof__(plu) != "HtmlWebpackPlugin" && __typeof__(plu) != "CleanWebpackPlugin"){
    newPlugins.push(plu);
  }
});
config.plugins = newPlugins;
   
// 重新设置html导出插件
pages.forEach((page) => {
  var initDataStr = fs.readFileSync(path.resolve(__dirname, '../data/'+page+'/init.json'));
  if(!initDataStr){
    initDataStr ="{}";
  }
  const htmlPlugin = new HtmlWebpackPlugin({
    filename: page+'.html',
    template: path.resolve(__dirname, '../src/'+page+'/page.html'),
    templateJspTop: '',
    ctx: config.output.publicPath,
    templateInitScript: '<script type="text/javascript">var appInitData = '+initDataStr+'; var ctx = "'+config.output.publicPath+'";</script>',
    chunks: [page, 'commons'],
    inject: true
  });
  config.plugins.push(htmlPlugin);

  //模板导出
  try{
    var templateFiles = fs.readdirSync(path.resolve(__dirname, '../src/'+page+'/template'));
    templateFiles.forEach(function(item) { 
      const templatePlugin = new HtmlWebpackPlugin({
        filename: 'static/template/'+item,
        template: path.resolve(__dirname, '../src/'+page+'/template/'+item),
        inject: false
      });
      config.plugins.push(templatePlugin);
    });
  }catch(e){
    
  }
});

// 动态向入口配置中注入 webpack-hot-middleware/client
var devClient = './build/dev-client';
Object.keys(config.entry).forEach(function (name, i) {
    var extras = [devClient]
    config.entry[name] = extras.concat(config.entry[name])
});

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