'use strict';

var async = require('async');
var gulp = require('gulp');
var install = require("gulp-install");
var nodemon = require("gulp-nodemon");
var jshint = require('gulp-jshint');
var sass = require('gulp-ruby-sass');
var fse = require("fs-extra");
var exec = require('child_process').exec;
var wiredep = require('wiredep').stream;
var rename = require('gulp-rename');
var nwb = require('nw-builder');
var gutil = require('gulp-util');
var browserify = require('gulp-browserify');
var debowerify = require("debowerify");
var find = require('all-requires');
var gcallback = require('gulp-callback');

gulp.task('install', function() {
  gulp.src(['./bower.json']).pipe(install());
  if(!fse.existsSync('./app/partials')) fse.mkdirSync('./app/partials');
});

gulp.task('bower', function () {
  gulp.src('app/layouts/index.hbs')
    .pipe(wiredep({
      ignorePath: '..'
    }))
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
  var theReturn = undefined;

  async.series([
    function(callback) {
      fse.removeSync('./app/gui/node_modules/');
      fse.ensureDirSync('./app/gui/node_modules/');

      callback();
    },
    function(callback) {
      find({ path: './app/lib', onlyLocal: false }, function (err, requires) {
        requires.forEach(function(module) {
          fse.copySync('./node_modules/' + module, './app/gui/node_modules/' + module);
        });

        callback();
      });
    },
    function(callback) {
      fse.copySync('./app/lib/', './app/gui/lib/');

      gulp.src('./app/static/script/index.js')
      .pipe(browserify({
        transform: ['debowerify']
      }))
      .pipe(rename('static.js'))
      .pipe(gulp.dest('./app/gui'))
      .pipe(gcallback(function() {
        callback();
      }));
    },
  ], function(err, results) {
    var nw = new nwb({
        version: '0.12.2',
        files: './app/gui/**',
        macPlist: { mac_bundle_id: 'myPkg' },
        platforms: ['win32', 'win64', 'osx32', 'osx64']
    });

    nw.on('log', function (msg) {
      gutil.log('node-webkit-builder', msg);
    });

    return nw.build().catch(function (err) {
      gutil.log('node-webkit-builder', err);
    });
  });
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