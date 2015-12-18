'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

function isFixed(file) {
  // Has ESLint fixed the file contents?
  return file.eslint != null && file.eslint.fixed;
}

function runLinter(tryToFix) {
  var codePath = path.join(conf.paths.src, 'app');
  return gulp.src([path.join(codePath, '**/*.js'),
                   path.join(conf.paths.test, '**/*.js')])
    .pipe($.eslint({ fix: tryToFix }))
    .pipe($.eslint.format())
    .pipe($.if(isFixed, gulp.dest(codePath)))
    .pipe($.eslint.failAfterError());
}

gulp.task('lint', function () {
  return runLinter(false);
});

gulp.task('lint-fix', function () {
  return runLinter(true);
});
