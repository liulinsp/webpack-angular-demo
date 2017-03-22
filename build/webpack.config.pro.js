var path = require('path');
var fs = require('fs'); 
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
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


 //module.exports = config;

webpack(config, function(err, stats) {
    if(err){console.log("err========",err);}
    if(stats){console.log("stats========",stats);}

    var imagePath = path.resolve(__dirname , '../imgs');
    //遍历复制
    travel(imagePath,function(srcFile){
      var srcPath = path.dirname(srcFile);
      var srcFileName = getFileName(srcFile);
      console.log("srcFileName=",srcFileName);
      var toPath = path.resolve(__dirname, "../target/static/imgs");
      var toFile = toPath+"/"+ srcFileName;
      if(!fs.existsSync(toPath)){
        fs.mkdirSync(toPath);
      }
      copy(srcFile,toFile);
    });
    
    //删除
    rmdirSync(imagePath,function(e){
      if(e){
        console.log("删除"+imagePath+"目录失败！"+e);
        fs.stat(imagePath, function (err, stats) {
            console.log(imagePath + "[stats]=",stats);
        })
      }else{
        console.log("删除"+imagePath+"目录以及子目录成功！");
      }
    });
});


//获得文件名称
function getFileName(file){
    var pos=file.lastIndexOf("\\");
    return file.substring(pos+1);  
}

//复制文件
function copy(src, dst) {
  fs.createReadStream(src).pipe(fs.createWriteStream(dst));
}

// 文件遍历
function travel(dir, callback) {
  fs.readdirSync(dir).forEach(function(file) {
    var pathname = path.join(dir, file);
 
    if(fs.statSync(pathname).isDirectory()) {
      travel(pathname, callback);
    }else {
      callback(pathname);
    }
  });
}

//删除文件夹
var rmdirSync = (function(){
    function iterator(url,dirs){
        var stat = fs.statSync(url);
        if(stat.isDirectory()){
            dirs.unshift(url);//收集目录
            inner(url,dirs);
        }else if(stat.isFile()){
            fs.unlinkSync(url);//直接删除文件
        }
    }
    function inner(path,dirs){
        var arr = fs.readdirSync(path);
        for(var i = 0, el ; el = arr[i++];){
            iterator(path+"/"+el,dirs);
        }
    }
    return function(dir,cb){
        cb = cb || function(){};
        var dirs = [];
 
        try{
            iterator(dir,dirs);
            for(var i = 0, el ; el = dirs[i++];){
                fs.rmdirSync(el);//一次性删除所有收集到的目录
            }
            cb()
        }catch(e){//如果文件或目录本来就不存在，fs.statSync会报错，不过我们还是当成没有异常发生
            e.code === "ENOENT" ? cb() : cb(e);
        }
    }
})();