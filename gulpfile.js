/**
 * 组件安装
 * npm install gulp-util gulp-imagemin gulp-less gulp-minify-css gulp-jshint gulp-uglify gulp-rename gulp-concat gulp-clean gulp-livereload tiny-lr gulp-autoprefixer gulp-rev-append gulp-shell amd-optimize fs path browser-sync del --save-dev
 */

// 引入 gulp及组件
var gulp = require('gulp'), //基础库
    imagemin = require('gulp-imagemin'), //图片压缩    
    spriter = require('gulp-css-spriter'),//控制图片大小自适应显示问题——background-position: 需要变成显示的一半，background-size:200% auto;---取消雪碧图
    spritesmith = require('gulp.spritesmith'), //图片精灵,取消使用
    imageResize = require('gulp-image-resize'), //取消使用--报错
    pngquant = require('imagemin-pngquant'), //取消使用
    buffer = require('vinyl-buffer'),//取消使用
    csso = require('gulp-csso'),//取消使用
    merge = require('merge-stream'),//取消使用

    less = require('gulp-less'), //less
    minifycss = require('gulp-minify-css'), //css压缩
    autoprefixer = require('gulp-autoprefixer'), //使用gulp-autoprefixer根据设置浏览器版本自动处理浏览器前缀
    postcss = require('gulp-postcss'), //单位转化px--rem
    px2rem = require('postcss-px2rem'), //单位转化px--rem
    base64 = require('gulp-base64'),//图片转base64编码

    jshint = require('gulp-jshint'), //js检查
    jscs = require('gulp-jscs'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'), //js压缩

    rename = require('gulp-rename'), //重命名
    concat = require('gulp-concat'), //合并文件
    clean = require('gulp-clean'), //清空文件夹--同del，本例取消clean
    del = require('del'), //删除文件
    header = require('gulp-header'), //给文件头部增加特殊内容
    replace = require('gulp-replace'), //替换str

    path = require('path'),
    runSequence = require('run-sequence'), //按顺序执行

    rev = require('gulp-rev'), //- 对文件名加MD5后缀
    revCollector = require('gulp-rev-collector'), //- 路径html替换
    connect = require('gulp-connect'), //搭建服务器并自动更新更改--本文件没用使用，而是用的browser-sync
    livereload = require('gulp-livereload'), //livereload,可以合上面配合使用（暂时没用）
    browserSync = require('browser-sync').create(), //页面实时刷新
    babel = require("gulp-babel"); //编译es6
var file_road = {
    cssSrc: './src/less/**/*.less',
    cssDst: './static/css',
    imgDst_sprite: './static/sprite/spritesheet.png',
    imgDst_sprite_css:'../sprite/spritesheet.png',

    imgSrc: './src/img/**/*',
    imgDst: './static/img',
    imgSrc_sprite: './src/img/**/*.png',

    jsLocal: './src/js/**/*.js',
    jsLocal_es6_no: ['./src/js/{plug,common}/**/*.js', './src/js/require.2.1.11.min.js', './src/js/require-config.js'],
    jsLocal_es6: ['./src/js/**/*.js', '!./src/js/require.2.1.11.min.js', '!./src/js/require-config.js', '!./src/js/plug/**/*.js'],
    jsDst: './static/js',
    // reqconjs_src: ['./src/js/require-config.js', './src/js/require-config2.js'],
    // jsSrc: ['./src/js/{common,plug}/*.js', './src/js/require.2.1.11.min.js'],
    // jsNum_src: ['./src/js/**/*.js', '!./src/js/common/*.js', '!./src/js/plug/**/*.js', '!./src/js/require.2.1.11.min.js', '!./src/js/require-config.js', '!./src/js/require-config2.js'],
    // jsDst_end: '../bin/static/new/js',

    htmlSrc: './html/**/*.html',
    // htmlDst_mid: './static_dest/template', //测试
    // htmlDst: '../bin/template',
    htmlSrc_test: './svg/**/*.html', //测试文件——仅供html实时更新

    w_cssSrc: 'src/less/**/*.less',
    w_imgSrc: 'src/img/**/*',
    w_jsLocalSrc: 'src/js/**/*',
    w_jsLocalSrc_es6: ['src/js/**/*.js', '!src/js/require.2.1.11.min.js', '!src/js/require-config.js', '!src/js/plug/**/*.js'],
    w_jsLocalSrc_es6_no: ['src/js/require.2.1.11.min.js', 'src/js/require-config.js', 'src/js/plug/**/*.js'],
    // w_jsrecon_Src: ['src/js/require-config.js', 'src/js/require-config2.js'],
    // w_jsSrc: ['src/js/common/*.js', 'src/js/plug/**/*.js', 'src/js/require.2.1.11.min.js'],
    // w_jsnum_Src: ['src/js/**/*.js', '!src/js/common/*.js', '!src/js/plug/**/*.js', '!src/js/require.2.1.11.min.js', '!src/js/require-config.js', '!src/js/require-config2.js'],
    w_htmlSrc: 'html/**/*.html',

    //w_cleanall: ['../bin/**/*', './static/**/*', './rev/**/*'],//原则情况全部
    //w_cleanall: ['../bin/static/new/**/*', '../bin/template/**/*.html', '!../bin/template/usercenter/*.html', '!../bin/template/recharge/result.html', './static_dest/static/', './static_dest/template/', './rev/'], //实际有些不能删除
    w_cleanall: './static/**/*',

    //src_source: './src/**/*',
    w_src_source: 'src/**/*',
    w_dst_source: './static/**/*',
    // w_dsthtml_source: '../bin/template/**/*',
};
var pkg = require('./package.json');
var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
].join('\n');
// connect启动本地服务------------------------------------------------------------------------------------------------------------------------------------------
gulp.task('webserver', function() {
    connect.server({
        livereload: true,
        port: 2333
    });
});
// 样式处理------------------------------------------------------------------------------------------------------------------------------------------
gulp.task('css', function() {
    var processors = [px2rem({ remUnit: 37.5 })];
    gulp.src(file_road.cssSrc)
        .pipe(less({ style: 'expanded' }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0', 'last 2 Explorer versions', 'last 3 Safari versions', 'Firefox >= 20', '> 5%'],
            cascade: true, //是否美化属性值 默认：true 像这样：//-webkit-transform: rotate(45deg);transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(postcss(processors)) //--变得有点小
        .pipe(base64({
            baseDir: './static/img',
            extensions: ['svg', 'png', /\.jpg#datauri$/i],
            exclude:    [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
            maxImageSize: 10*1024, // bytes 
            debug: true
        }))
        //.pipe(header(banner, { pkg: pkg })) //增加头部注释
        .pipe(gulp.dest(file_road.cssDst)) //本地目录
        // .pipe(rev()) //版本号
        // .pipe(minifycss()) //todo暂时隐藏压缩
        // .pipe(gulp.dest(file_road.cssDst_end)) //最终目录
        // .pipe(rev.manifest()) 
        // .pipe(gulp.dest('rev/css'))
        .pipe(browserSync.stream());

});
//语法检查------------------------------------------------------------------------------------------------------------------------------------------
gulp.task('jshint', function() {
    return gulp.src(file_road.jsLocal)
        //.pipe(jscs()) //检测JS风格
        .pipe(jshint({
            "undef": false,
            "unused": false
        }))
        //.pipe(jshint.reporter('default'))  //错误默认提示
        .pipe(jshint.reporter(stylish)) //高亮提示
        .pipe(jshint.reporter('fail'));
});
//js--转es6
gulp.task('js_local_es6', function() {
    gulp.src(file_road.jsLocal_es6)
        .pipe(jshint({
            "undef": true,
            "unused": false
        }))
        .pipe(jshint.reporter(stylish)) //代码检测
        .pipe(babel({
            presets: ['es2015'],
            // modules: "amd" // 默认是 common，也可以改成 umd
        }))
        .pipe(gulp.dest(file_road.jsDst)) //本地目录--未压缩
        .pipe(browserSync.stream())
});
//js--非转es6
gulp.task('jsLocal_es6_no', function() {
    gulp.src(file_road.jsLocal_es6_no)
        .pipe(jshint.reporter('default')) //代码检测
        .pipe(gulp.dest(file_road.jsDst)) //本地目录--未压缩
        .pipe(browserSync.stream())
});
// 图片处理------------------------------------------------------------------------------------------------------------------------------------------
gulp.task('images', function() {
    gulp.src(file_road.imgSrc)
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest(file_road.imgDst)) //本地目录
        .pipe(browserSync.stream());
});
//测试css精灵图，不使用——控制图片大小自适应显示问题——background-position: 需要变成显示的一半，background-size:200% auto;---取消雪碧图
gulp.task('sprite', function() {
    // gulp.src(file_road.imgSrc_sprite)
    //     // .pipe(imageResize({
    //     //     percentage: 10
    //     // }))
    //     // .pipe(imagemin({
    //     //     optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
    //     //     progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
    //     //     interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
    //     //     multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
    //     //     use: [pngquant({ quality: '35-60' })]
    //     // }))
    //     .pipe(spritesmith({
    //         imgName: 'sprite.png',
    //         cssName: 'sprite.css'
    //     }))
    //     .pipe(gulp.dest(file_road.imgDst_sprite));
    // var spriteData = gulp.src(file_road.imgSrc_sprite).pipe(spritesmith({
    //     imgName: 'sprite.png',
    //     cssName: 'sprite.css'
    // }));
    // return spriteData.pipe(gulp.dest(file_road.imgDst_sprite));
    // Generate our spritesheet 
    var spriteData = gulp.src(file_road.imgSrc_sprite).pipe(spritesmith({
        imgName: 'sprite1.png',
        cssName: 'sprite1.css',
        padding: 20
    }));

    // Pipe image stream through image optimizer and onto disk 
    var imgStream = spriteData.img
        // DEV: We must buffer our stream into a Buffer for `imagemin` 
        .pipe(buffer())
        .pipe(imagemin())
        .pipe(gulp.dest(file_road.imgDst_sprite));

    // Pipe CSS stream through CSS optimizer and onto disk 
    var cssStream = spriteData.css
        .pipe(csso())
        .pipe(gulp.dest(file_road.imgDst_sprite));

    // Return a merged stream to handle both `end` events 
    return merge(imgStream, cssStream);
});//替换css的问题还没有处理
gulp.task('css_sprite', function() {
    var processors = [px2rem({ remUnit: 37.5 })];
    gulp.src(file_road.cssSrc)
        .pipe(less({ style: 'expanded' }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0', 'last 2 Explorer versions', 'last 3 Safari versions', 'Firefox >= 20', '> 5%'],
            cascade: true, //是否美化属性值 默认：true 像这样：//-webkit-transform: rotate(45deg);transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(spriter({
            // The path and file name of where we will save the sprite sheet 
            'spriteSheet': file_road.imgDst_sprite,
            // Because we don't know where you will end up saving the CSS file at this point in the pipe, 
            // we need a litle help identifying where it will be. 
            'pathToSpriteSheetFromCSS': file_road.imgDst_sprite_css
        }))
        .pipe(postcss(processors)) //--变得有点小
        .pipe(gulp.dest(file_road.cssDst)) //本地目录

});
// 清空图片、样式、js---最终使用del------------------------------------------------------------------------------------------------------------------------------------------
gulp.task('del', function(cb) {
    del(file_road.w_cleanall, { force: true }, cb);
});


// js处理--本文档未使用--------------------------------------------------------------------------------------------------------------------------------
gulp.task('js', function() {
    gulp.src(file_road.jsSrc)
        .pipe(jshint.reporter('default')) //代码检测
        .pipe(gulp.dest(file_road.jsDst)) //本地目录--未压缩
        .pipe(uglify({ //todo暂时隐藏压缩
            mangle: false, //类型：Boolean 默认：true 是否修改变量名
            compress: true, //类型：Boolean 默认：true 是否完全压缩
            //preserveComments: 'all' //保留所有注释
            mangle: { except: ['require', 'exports', 'module', '$'] } //排除混淆关键字
        }))
        .pipe(header(banner, { pkg: pkg })) //增加头部注释
        .pipe(gulp.dest(file_road.jsDst_end)) //最终目录
        .pipe(browserSync.stream());
});
//替换显示require-config的路径
gulp.task('reqconjs', function() {
    gulp.src(file_road.reqconjs_src)
        .pipe(jshint.reporter('default')) //代码检测
        .pipe(gulp.dest(file_road.jsDst)) //本地目录--未压缩
        .pipe(replace('../../../static_dest/static', '/qudao/v1/static'))
        .pipe(replace('../../static_dest/static', '/qudao/v1/static'))
        .pipe(gulp.dest(file_road.jsDst_end))
        .pipe(browserSync.stream())
});
//生存版本号
gulp.task('jsnum', function() {
    gulp.src(file_road.jsNum_src)
        .pipe(jshint.reporter('default')) //代码检测
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(file_road.jsDst)) //本地目录--未压缩
        .pipe(rev()) //增加版本号
        .pipe(uglify({ //todo暂时隐藏压缩
            mangle: false, //类型：Boolean 默认：true 是否修改变量名
            compress: true, //类型：Boolean 默认：true 是否完全压缩
            //preserveComments: 'all' //保留所有注释
            mangle: { except: ['require', 'exports', 'module', '$'] } //排除混淆关键字
        }))
        .pipe(header(banner, { pkg: pkg })) //增加头部注释
        .pipe(gulp.dest(file_road.jsDst_end)) //最终目录
        .pipe(rev.manifest()) //生存json文件
        .pipe(gulp.dest('rev/js'))
        .pipe(browserSync.stream());
});
// HTML处理--init使用--本文档未使用-----------------------------------------------------------------------------------------------------------------------------------------
gulp.task('html', function() {
    gulp.src(['rev/**/*.json', file_road.htmlSrc])
        .pipe(revCollector({ replaceReved: true }))
        .pipe(header('# coding: utf-8 \n')) //增加头部代码
        .pipe(replace('../../../static_dest/static', '/qudao/v1/static'))
        .pipe(replace('../../static_dest/static', '/qudao/v1/static'))
        .pipe(gulp.dest(file_road.htmlDst))
        .pipe(browserSync.stream())
});
gulp.task('html_fresh', function() {
    gulp.src(file_road.htmlSrc)
        .pipe(browserSync.stream())
});
//测试文件html监听
gulp.task('test_html_fresh', function() {
    gulp.src(file_road.htmlSrc_test)
        .pipe(browserSync.stream())
});
// 监听任务 运行语句 gulp watch------------------------------------------------------------------------------------------------------------------------------------------
gulp.task('watch', function() {
    //livereload启用
    //livereload.listen();
    browserSync.init({
        server: {
            baseDir: "./",
        },
        port: 3002
    });

    // 监听css
    gulp.watch(file_road.w_cssSrc, ['css']);

    // 监听images
    gulp.watch(file_road.w_imgSrc, ['images']);

    // 监听js
    //gulp.watch(file_road.w_jsLocalSrc, ['js_local']);
    gulp.watch(file_road.w_jsLocalSrc_es6, ['js_local_es6']);
    gulp.watch(file_road.w_jsLocalSrc_es6_no, ['jsLocal_es6_no']);
    // 监听html变动
    gulp.watch(file_road.w_htmlSrc, ['html_fresh']);
    gulp.watch(file_road.test_html_fresh, ['test_html_fresh']);
    // gulp.watch(file_road.w_jsSrc, ['js']);
    // gulp.watch(file_road.w_jsrecon_Src, ['reqconjs']);
    // gulp.watch(file_road.w_jsnum_Src, ['jsnum']);

    //监听删除
    var watcher = gulp.watch([file_road.w_src_source]);
    watcher.on('change', function(event) {
        //console.log(event.type);
        if (event.type === 'deleted') {
            var src = path.relative(path.resolve('src'), event.path);
            src = src.replace(/.es6$/, '.js');
            console.log(src);
            var dest;
            if (src.split('/')[0] == 'less') {
                //src=src.split('.')[0]+'.css';
                src = src.replace(/less/g, 'css');
            }
            // if (src.split('/')[1] == 'html') {
            //     //src=src.split('.')[0]+'.css';
            //     src = src.replace(/\.\.\/html\//, '');
            //     dest = path.resolve(file_road.w_dsthtml_source, src);
            //     console.log(src);
            //     del.sync(dest);
            //     return false;
            // }
            console.log(src);
            dest = path.resolve(file_road.w_dst_source, src);
            del.sync(dest);
        }
    });
});

//暂时没有使用
gulp.task('init', function() {
    gulp.start('css', 'images', 'js', 'reqconjs', 'html', 'watch');
});
//初始化静态资源
gulp.task('static', function(done) {
    runSequence(
        ['images', 'css', 'js_local_es6', 'jsLocal_es6_no'],
        done);
});
// 默认任务 清空图片、样式、js并重建 运行语句 gulp
// gulp.task('default', function() {
//     gulp.start('css', 'images', 'js', 'watch');
// });

//#########################先执行 gulp del  清理文件,再执行gulp static编译文件,上传到服务器时，再执行一次 gulp html(增加上css版本号)//
//#########################先执行 gulp del  清理文件,再执行gulp static编译文件,上传到服务器时，再执行一次 gulp html(增加上css版本号)//
//#########################先执行 gulp del  清理文件,再执行gulp static编译文件,上传到服务器时，再执行一次 gulp html(增加上css版本号)//
//开发构建--未执行['jshint'],
// gulp.task('dev', function(done) {
//     runSequence(
//         ['webserver'], ['images', 'css'], ['js', 'reqconjs', 'jsnum'], ['html'], ['watch'],
//         done);
// });//执行--connect启用服务器及时刷新
gulp.task('dev', function(done) {
    runSequence(
        ['images', 'css', 'js_local_es6', 'jsLocal_es6_no'], ['watch'],
        done);
});
gulp.task('local', function(done) {
    runSequence(
        ['css', 'js_local_es6', 'jsLocal_es6_no'], ['watch'],
        done);
});
gulp.task('dev_test', function(done) {
    runSequence(
        ['images', 'css', 'js_local_es6', 'jsLocal_es6_no'], ['jshint'], ['watch'],
        done);
});
gulp.task('default', ['dev']);

//删除不可用

//重要备注：less文件名和路径中当中不能包含‘less’；html文件名当中不能包含‘.’
