var gulp = require('gulp');
var install = require("gulp-install");
var nodemon = require("gulp-nodemon");
var jshint = require('gulp-jshint');
var sass = require('gulp-ruby-sass');
var fse = require("fs-extra");
var exec = require('child_process').exec;
var wiredep = require('wiredep').stream;

gulp.task('install', function() {
  gulp.src(['./bower.json']).pipe(install());
  if(!fse.existsSync('./partials')) fse.mkdirSync('./partials');
});

gulp.task('bower', function () {
  gulp.src('layouts/main.hbs')
    .pipe(wiredep({}))
    .pipe(gulp.dest('layouts'));
});

gulp.task('sass', function() {
  sass('static/style/style.scss', {
      style   : "compact",
      compass : true,
      trace: false
  })
  .pipe(gulp.dest('static/style'));
});

gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint())
});

gulp.task('server', function() {
  nodemon({
    script: 'server.js',
    ext: 'html js hbs css scss json',
    ignore: ['ignored.js'],
    nodeArgs: ['--harmony'] 
  })
  .on('change', ['sass', 'lint'])
  .on('restart', function () {
    console.log('restarted!')
  })
});

gulp.task('default', ['server']);