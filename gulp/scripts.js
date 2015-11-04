'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

gulp.task('scripts', function () {

  var browserSync = require('browser-sync');

  return gulp.src(path.join(conf.paths.src, '/app/**/*.js'))
    .pipe($.jshint({ unused: 'vars',
                     predef: ['Clipboard', 'Socket', 'WebSocket'] }))
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe($.size());
});
