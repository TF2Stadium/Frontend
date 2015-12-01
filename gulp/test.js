'use strict';

var path = require('path');
var runSequence = require('run-sequence');
var mainBowerFiles = require('main-bower-files');
var gulp = require('gulp');
var conf = require('./conf');
var karma = require('karma');

var $ = require('gulp-load-plugins')();

gulp.task('test:unit', function (done) {
  var server = new karma.Server({
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'chai-sinon'],
    files: mainBowerFiles({ includeDev: true }).concat([
      'dist/scripts/app-*.js',
      'test/karma/**/*.js'
    ]),
    logLevel: 'DEBUG',
    singleRun: true
  });

  server.on('run_complete', function (browsers, results) {
    // NB If the argument of done() is not null or not undefined,
    // e.g. a string, the next task in a series won't run.
    done(results.error ? 'There are test failures' : null);
  });

  server.start();
});

gulp.task('test', function (cb) {
  runSequence('build', 'test:unit', cb);
});
