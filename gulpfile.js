var gulp = require('gulp');
var install = require("gulp-install");
var nodemon = require("gulp-nodemon");
var jshint = require('gulp-jshint');
var sass = require('gulp-ruby-sass');
var fse = require("fs-extra");
var exec = require('child_process').exec;
var wiredep = require('wiredep').stream;
var rename = require('gulp-rename');

gulp.task('install', function() {
  gulp.src(['./bower.json']).pipe(install());
  if(!fse.existsSync('./app/partials')) fse.mkdirSync('./app/partials');
});

gulp.task('bower', function () {
  gulp.src('app/layouts/main.hbs')
    .pipe(wiredep({}))
    .pipe(gulp.dest('app/layouts'));
});

gulp.task('sass', function() {
  sass('app/static/style/style.scss', {
      style   : "compact",
      compass : true,
      trace: false
  })
  .pipe(gulp.dest('app/static/style'));
});

gulp.task('lint', function () {
  gulp.src('./app/**/*.js')
    .pipe(jshint())
});

gulp.task('desktop', ['sass', 'lint'], function () {

});

gulp.task('mobile', ['sass', 'lint'], function () {

});

gulp.task('server', ['sass', 'lint'], function() {
  nodemon({
    script: 'app/server.js',
    ext: 'html js hbs scss json',
    ignore: ['ignored.js'],
    nodeArgs: ['--harmony'] 
  })
  .on('change', ['sass', 'lint'])
  .on('restart', function () {
    console.log('restarted!')
  })
});

gulp.task('default', ['server']);