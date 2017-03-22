var path = require('path');
var fs = require('fs'); 
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');//css抽取插件
var pages = require('./pages.config');


// 引入基本配置
var config = require('./webpack.config');

config.output.publicPath = '${ctx}/';

config.module.loaders=[
        {
          test: /\.(css|less)$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: "css-loader!less-loader!postcss-loader",
            publicPath: ''
          })
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          loader: 'url-loader',
          include: /(img)/,
          options: {limit: 10240}
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          loader: 'file-loader',
          include: /(spriteImgs)/,
          options: {
              name: '../imgs/[name].[ext]?[hash]',
            }
        }
      ];

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
    filename: 'WEB-INF/pages/'+page+'.jsp',
    template: path.resolve(__dirname, '../src/'+page+'/page.html'),
    templateJspTop: '<%@ page contentType="text/html;charset=UTF-8" %>\n'
                         +'<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>\n'
                         +'<c:set var="ctx" value="${pageContext.request.contextPath}"/>',
    ctx: config.output.publicPath,
    templateInitScript: '<script type="text/javascript">'
    +'var appInitData = ${empty appInitData? "{}" : appInitData};'
    +'var ctx = "'+config.output.publicPath+'";'
    +'</script>',
    chunks: [page, 'commons'],
    inject: true,
  });
  config.plugins.push(htmlPlugin);

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
