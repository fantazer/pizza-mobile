var gulp = require("gulp");
var autoprefixer = require('gulp-autoprefixer');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var stylus = require('gulp-stylus');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var ftp = require( 'vinyl-ftp' );
var reload = browserSync.reload;
var rupture = require('rupture');
var jeet = require('jeet');
var data = require('gulp-data');
var jade = require('gulp-jade');
var notify = require('gulp-notify');
var pngquant = require('imagemin-pngquant');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cached');
var newer = require('gulp-newer');
var remember = require('gulp-remember');
var spritesmith = require('gulp.spritesmith');
var runSequence = require('run-sequence');
var progeny = require('gulp-progeny');
var filter = require('gulp-filter');
var fs = require('fs');
var prettify = require('gulp-prettify');
var combineMq = require('gulp-combine-mq');
var webshot=require('gulp-webshot');
var createFile = require('create-file');
var jadeGlobbing  = require('gulp-jade-globbing');
var wiredep = require('wiredep').stream;
var clean = require('gulp-clean');
var shell  = require('gulp-shell');

// Build styleguide.
gulp.task('guide', shell.task([
    'kss --source app/css/ --destination template/ --css ../app/css/style.css'
  ]));


// ########## make img ###############
gulp.task('imagePng',function(){
 return gulp.src('app/img/**/*.png')
     .pipe(newer('dist/img/'))
     .pipe(imagemin({
         progressive: true,
         svgoPlugins: [{removeViewBox: false}],
         use: [pngquant({quality: '80', speed: 5})]
     }))
     .pipe(gulp.dest('dist/img/'));
 });

gulp.task('imageJpg',function(){
  return gulp.src('app/img/**/*.jpg')
  .pipe(newer('dist/img/'))
  .pipe(imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [imageminMozjpeg({quality: '80', speed: 5})]
      }))
  .pipe(gulp.dest('dist/img/'));
});

//Sprite
gulp.task('sprite', function () {
  var spriteData = gulp.src('app/img/sprites/*.png').pipe(spritesmith({
    imgName: '../img/sprite.png',
    cssName: 'sprite.css',
    cssOpts: {
        cssSelector: function (item) {
            // If this is a hover sprite, name it as a hover one (e.g. 'home-hover' -> 'home:hover')
            if (item.name.indexOf('-hover') !== -1) {
                return '.icon-' + item.name.replace('-hover', ':hover');
                // Otherwise, use the name as the selector (e.g. 'home' -> 'home')
            }
            else {
                return '.icon-' + item.name;
            }
        }
     }
  }));
  spriteData.img.pipe(gulp.dest('app/img/')); // путь, куда сохраняем картинку
  spriteData.css.pipe(gulp.dest('app/css/icon/')); // путь, куда сохраняем стили
});

//ScreenShot
gulp.task('screenshot', function() {
  return gulp.src('dist/*.html')
    .pipe(webshot(
      { 
        dest:'app/img',
        root:'.',
        windowSize:{
          width: 1920,
          height: 1024
        }
      }
    ));
})

// ########## make css ###############

//Prefix my css
gulp.task('prefix', function () {
    return gulp.src('app/css/style.css')
        .pipe(cache('prefix'))
        .pipe(autoprefixer({
            browsers: ['last 15 versions']
        }))
        .pipe(gulp.dest('app/css/'));
});

//Stylus
gulp.task('stylus', function () {
  return gulp.src(['app/css/**/*.styl','app/module/**/*.styl'])
    .pipe(cache('stylus'))
    .pipe(progeny({
            regexp: /^\s*@import\s*(?:\(\w+\)\s*)?['"]([^'"]+)['"]/
        }))
    .pipe(filter(['**/*.styl', '!**/_*.styl']))
    .pipe(stylus({
        use:[rupture(),jeet()],
        'include css': true
        })).on('error', errorhandler)
    .pipe(sourcemaps.write())

    .pipe(gulp.dest('app/css/'))
});

//Source map
gulp.task('sourcemaps', function () {
  return gulp.src('./app/css/style.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus({
        use:[rupture()]
        }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/css/'))
});

// ########## make css end ###############

// ########## make html ###############

gulp.task('jade', function() {
  gulp.src(['app/html/*.jade','app/module/**/*.jade',])
    .pipe(progeny({
            regexp: /^\s*@import\s*(?:\(\w+\)\s*)?['"]([^'"]+)['"]/
        }))
    .pipe(filter(['**/*.jade', '!**/_*.jade']))
    .pipe(jadeGlobbing())
    .pipe(jade({
      pretty: '\t',
     cache:'true'
    })
    .on('error', errorhandler))
    .pipe(prettify({
            'unformatted': ['pre', 'code'],
            'indent_with_tabs': true,
            'preserve_newlines': true,
            'brace_style': 'expand',
            'end_with_newline': true
      }))
    .pipe(gulp.dest('app/'))
    .on('end', browserSync.reload);
});

//wiredep
gulp.task('bower', function () {
  gulp.src('app/html/block_html/*.jade')
    .pipe(wiredep({
      'directory' : "app/bower/",
        "overrides":{
            "bootstrap":{
                "main":[
                "./dist/css/bootstrap.min.css",
                "./dist/js/bootstrap.min.js"
                ]
            },
            "owl.carousel":{
                "main":[
                "dist/assets/owl.carousel.css",
                "dist/owl.carousel.min.js"
                ]
            }
        }
        }))
        .pipe(gulp.dest('app/html/block_html/'));
});


// ########## make html end###############

// ########## make backend template ###############
gulp.task('template-clean', function () {
 return gulp.src('dist/module/', {read: false})
    .pipe(clean());
});

gulp.task('template-style', function () {
  return gulp.src('app/module/**/*.styl')
    .pipe(cache('stylus'))
    .pipe(stylus({
        use:[rupture(),jeet()],
        'include css': true
        })).on('error', errorhandler)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/module/'))
});

gulp.task('template-file',function(){
          var FileCreate = JSON.parse(fs.readFileSync('./file.json'));
          for (var key in FileCreate) {
                  var obj = FileCreate[key];
                  if(key=="block"){
                      for (var prop in obj) {
                          createFile('dist/module/'+obj[prop]+'/_'+obj[prop]+'.jade' ,"include ../../../app/html/block_html/_const.jade\n"+"include ../../../app/module/**/*.jade\n"+"+" +obj[prop]+"()", function (err) { });
                }
           }
     }
})

gulp.task('template-module', function() {
  setTimeout(function() {
  gulp.src(['dist/module/**/*.jade'])
    .pipe(jadeGlobbing())
    .pipe(jade({
      pretty: '\t',
     cache:'true'
    }).on('error', errorhandler))
    .pipe(prettify({
            'unformatted': ['pre', 'code'],
            'indent_with_tabs': true,
            'preserve_newlines': true,
            'brace_style': 'expand',
            'end_with_newline': true
      }))
    .pipe(gulp.dest('dist/module/'))
    },2000);
});
// ########## make backend template  end###############

// ########## make service###############
//copy file
gulp.task('copy:font',function(){
  return gulp.src('./app/fonts/**/**.*')
        .pipe(newer('./dist/fonts/'))
        .pipe(gulp.dest('./dist/fonts/'))
  })

gulp.task('copy:js',function(){
  return gulp.src('./app/js/script.js')
         .pipe(gulp.dest('./dist/js/'))
  })

//Show error
function errorhandler(a) {
    var args = Array.prototype.slice.call(arguments);
    // Send error to notification center with gulp-notify
    notify.onError({
        title: 'Compile Error',
        message: a,
        // sound: true можно даже со звуком!
    }).apply(this, args);

    // Keep gulp from hanging on this task
    this.emit('end');
};

//useref
gulp.task('make', function () {
   
  var assets = useref.assets();
  gulp.src('app/js/*.js')
  .pipe(gulp.dest('dist/js/'));
   gulp.src('app/css/style.css')
  .pipe(combineMq({
          beautify: true
  }))
  .pipe(gulp.dest('dist/css/'));
  return gulp.src('app/*.html')
      .pipe(cache('make'))
      .pipe(assets)
      .pipe(remember('make'))
      .pipe(gulpif('*.js', uglify()))
      .pipe(gulpif('*.css', minifyCss()))
      .pipe(assets.restore())
      .pipe(useref())
      .pipe(gulp.dest('dist'));
});

// beauty html
gulp.task('beauty',function(){
  return gulp.src('app/*.html')
    .pipe(prettify({
            'unformatted': ['pre', 'code'],
            'indent_with_tabs': true,
            'preserve_newlines': true,
            'brace_style': 'expand',
            'end_with_newline': true
      }))
     .pipe(gulp.dest('dist'));
})

//Ftp
gulp.task( 'ftp', function() {
    var ftpConf = JSON.parse(fs.readFileSync('./ftp.json'));
    var conn = ftp.create( {
        host:     'kuznetcov.org',
        user:     ftpConf.user,
        password: ftpConf.pass,
        parallel: 1,
        maxConnections:1
    } );
    var globs = [
        'dist/**/**.*'
    ];
   return gulp.src(globs, {buffer: false})
        .pipe( conn.newer( 'kuznetcov.org/'+ftpConf.name) )
        .pipe( conn.dest( 'kuznetcov.org/'+ftpConf.name) );

} );

//LiveReload
gulp.task('serve', function () {
    browserSync.init({
        notify: false,
        reloadDelay: 300,
        //tunnel: true,
        //tunnel: "webpage",
        server: {
            baseDir: "app/",
        }
    });
    browserSync.watch(["app/css/**/*.css" ,"app/js/**.*"]).on("change", browserSync.reload);
});

// ########## make service end ###############

//create File
gulp.task('create',function(){
       fs.writeFileSync('app/css/include/_'+ fileName+'.styl','');
       fs.writeFileSync('app/html/block_html/elements/_'+ fileName+'.jade','');
})

//create File
gulp.task('file',function(){
  var FileCreate = JSON.parse(fs.readFileSync('./file.json'));
  for (var key in FileCreate) {
        var obj = FileCreate[key];
        if(key=="block"){
          for (var prop in obj) {
              createFile('app/module/'+obj[prop]+'/_'+obj[prop]+'.jade' ,"mixin " +obj[prop]+"()"+"\n\t//block "+obj[prop]+"\n\t//block "+obj[prop]+' end', function (err) { });
              createFile('app/module/'+obj[prop]+'/_'+obj[prop]+'.styl' , "//! block "+obj[prop]+"\n//!block "+obj[prop]+' end', function (err) { });
          }
        }
        if(key=="page"){
          for (var prop in obj) {
              createFile('app/html/'+ obj[prop]+'.jade'  ,"", function (err) { });
          }
        }
  }
})


//Watcher
gulp.task('see',function(){
        gulp.watch(['app/html/**/*.jade','app/module/**/*.jade',], ['jade']);
        gulp.watch(['app/css/**/*.styl','app/module/**/*.styl'],['stylus']);
        //gulp.watch(['app/css/**/*.styl','app/module/**/*.styl'],['guide']);
        gulp.watch(['./file.json'],['file']);
})

//default
gulp.task('img',['imagePng' , 'imageJpg']);
gulp.task('default',['see','serve'] );

gulp.task('build-ftp',function(){
  runSequence('jade','stylus','copy:font','prefix','img','make','guide','ftp')
});

gulp.task('build',function(){
    runSequence('jade','stylus','copy:font','prefix','img','make')
});

gulp.task('template',function(){
  runSequence('template-clean','template-style','template-file','template-module')
});


gulp.task('fast-see',function(){
        gulp.watch(["./app/css/**/**.styl","./app/html/**.jade","./app/js/**.*"] ,gulp.series('fast-build'))
})



