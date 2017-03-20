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

config.plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    //抽取公共模块
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons', // 这公共代码的 chunk 名为 'commons'
      filename: 'commons.js', // 生成后的文件名
      //minChunks: 4 // 设定要有 4 个 chunk（即4个页面）加载的 js 模块才会被纳入公共代码
    }),
    // 提取css文件
	  new ExtractTextPlugin("static/css/[name].[hash].css"),
    // 自动添加样式前缀
    new webpack.LoaderOptionsPlugin({
     options: {
       postcss:[
  	    autoprefixer({
  	      browsers: ['last 5 versions', 'ie >= 9', 'ie_mob >= 10',
  	        'ff >= 30', 'chrome >= 34', 'safari >= 6', 'opera >= 12.1',
  	        'ios >= 8', 'android >= 4.4', 'bb >= 10', 'and_uc >= 9.9']
  	    })
	     ]
     }
    }),   
];
    
//导出html
pages.forEach((page) => {
  var initDataStr = fs.readFileSync(path.resolve(__dirname, '../data/'+page+'/init.json'));
  if(!initDataStr){
    initDataStr ="{}";
  }
  const htmlPlugin = new HtmlWebpackPlugin({
    filename: page+'.html',
    template: path.resolve(__dirname, '../src/'+page+'/page.html'),
    templateJspTop: '',
    templateInitScript: '<script type="text/javascript">var appInitData = '+initDataStr+';</script>',
    chunks: [page, 'commons'],
    inject: true
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

// 动态向入口配置中注入 webpack-hot-middleware/client
var devClient = './build/dev-client';
Object.keys(config.entry).forEach(function (name, i) {
    var extras = [devClient]
    config.entry[name] = extras.concat(config.entry[name])
});


module.exports = config;