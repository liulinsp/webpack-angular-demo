var path = require('path');
var fs = require('fs'); 
var webpack = require("webpack");
var CleanWebpackPlugin = require('clean-webpack-plugin'); //删除文件插件
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');//css抽取插件
var autoprefixer = require('autoprefixer');
var pages = require('./pages.config');

var config = {
	entry:  {
		
	},
	output: {
		path: path.resolve(__dirname, '../target/static/js'),
		publicPath: 'static/js',
		filename: '[name].[hash].js',
	},
    module: {
	    loaders: [
	      {
	        test: /\.(css|less)$/,
	        loader: ExtractTextPlugin.extract({
	          fallback: 'style-loader',
	          use: "css-loader!less-loader!postcss-loader"
	        })
	      },
	      {
	        test: /\.(png|jpg|gif|svg)$/,
	        loader: 'url-loader',
	        options: {
	          limit: 10000,
	          name: '[name].[ext]?[hash]'
	        }
	      }
	    ]
	},
	
	plugins:[
		// 删除文件
		new CleanWebpackPlugin(['target'], {
            root: path.resolve(__dirname,"../"),
            verbose: true,
            dry: false,
        }),
		//抽取公共模块
		new webpack.optimize.CommonsChunkPlugin({
			name: 'commons', // 这公共代码的 chunk 名为 'commons'
 			filename: 'commons.js', // 生成后的文件名
 			//minChunks: 4 // 设定要有 4 个 chunk（即4个页面）加载的 js 模块才会被纳入公共代码
		}),

		// 提取css文件
	    new ExtractTextPlugin("../css/[name].[hash].css"),

	    // 自动添加样式前缀
	    new webpack.LoaderOptionsPlugin({
         options: {
           postcss:[
		    autoprefixer({
		      browsers: ['last 5 versions', 'ie >= 9', 'ie_mob >= 10',
		        'ff >= 30', 'chrome >= 34', 'safari >= 6', 'opera >= 12.1',
		        'ios >= 8', 'android >= 4.4', 'bb >= 10', 'and_uc >= 9.9']
		    })
		   ],
         }
        }),
	]
};

//导出html
pages.forEach((page) => {
  config.entry[page] = path.resolve(__dirname, '../src/'+page+'/entry.js');

  var initDataStr = fs.readFileSync(path.resolve(__dirname, '../data/'+page+'/init.json'));
  if(!initDataStr){ initDataStr ="{}"; }
  const htmlPlugin = new HtmlWebpackPlugin({
    filename: '../../'+page+'.html',
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
		    filename: '../template/'+item,
		    template: path.resolve(__dirname, '../src/'+page+'/template/'+item),
		});
		config.plugins.push(templatePlugin);
    });
  }catch(e){
  	
  }
  
});
module.exports = config;