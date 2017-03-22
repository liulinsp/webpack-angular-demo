var gulp = require("gulp");
var path = require('path');
var del = require('del');
var webpack = require('webpack');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var config = require('./webpack.config.pro');

gulp.task('default', ['webpack'], function(){
    gulp.start('clean');
}); 

gulp.task('webpack', function(callback) {
    config.output.path = path.resolve(__dirname, '../gulptemp/target');
    webpack(config, function(err, stats) {
        if(err){console.log(err);}
        callback(); //异步任务的关键之处，如果没有这行，任务会一直阻塞
    });
});

gulp.task('clean', ['copy-images','copy-css','copy-js','copy-jsp'], function(callback) {
  //del([path.resolve(__dirname, '../gulptemp/**/*')], callback);
  del([path.resolve(__dirname, '../gulptemp/**/*'),
       path.resolve(__dirname, '../gulptemp')]
       ,{force: true})
  .then(function (paths) { 
    callback();
  }, function (reason) {
    callback("Failed to delete files " + reason);
  });
});

//复制图片
gulp.task('copy-images',  function(callback) {
  return gulp.src([path.resolve(__dirname, '../gulptemp/imgs/**/*')])
    .pipe(gulp.dest(path.resolve(__dirname, '../target/static/imgs/')));
});

//压缩css文件
gulp.task('copy-css',  function(callback) {
  return gulp.src([path.resolve(__dirname, '../gulptemp/target/static/css/**/*')])
    .pipe(minifyCSS())
    .pipe(gulp.dest(path.resolve(__dirname, '../target/static/css/')));
});

//压缩js文件
gulp.task('copy-js',  function(callback) {
  return gulp.src([path.resolve(__dirname, '../gulptemp/target/static/js/**/*')])
    .pipe(uglify())
    .pipe(gulp.dest(path.resolve(__dirname, '../target/static/js/')));
});

//复制jsp文件
gulp.task('copy-jsp',  function(callback) {
  return gulp.src([path.resolve(__dirname, '../gulptemp/target/WEB-INF/**/*')])
    .pipe(gulp.dest(path.resolve(__dirname, '../target/WEB-INF/')));
});



