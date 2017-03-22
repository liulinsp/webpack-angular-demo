var gulp=require("gulp"),
spritesmith=require('gulp.spritesmith');
var path = require('path');
const del = require('del');

gulp.task('clean', function(cb) {
    del(['sprite'], cb)
});

gulp.task('sprite', function () {
    return gulp.src('src/index/img/*.png')//需要合并的图片地址
        .pipe(spritesmith({
            imgName: 'img/sprite.png',//保存合并后图片的地址
            cssName: 'css/sprite.css',//保存合并后对于css样式的地址
            padding:5,//合并时两个图片的间距
            algorithm: 'top-down',//图片排序：top-down left-right  diagonal    alt-diagonal    binary-tree
            //cssTemplate:"../src/index/img/template.css"//注释2
            cssTemplate: function (data) {
                var arr=[];
                data.sprites.forEach(function (sprite) {
                    arr.push(".icon-"+sprite.name+
                    "{\n" +
                    "  background-image: url('"+sprite.escaped_image+"');\n"+
                    "  background-position: "+sprite.px.offset_x+" "+sprite.px.offset_y+";\n"+
                    "  width:"+sprite.px.width+";\n"+
                    "  height:"+sprite.px.height+";\n"+
                    "}\n");
                });
                return arr.join("");
            }
        }))
        .pipe(gulp.dest('sprite'));
});

gulp.task('default', ['clean', 'sprite']); 

