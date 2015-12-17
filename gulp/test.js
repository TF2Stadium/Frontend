'use strict';

var path = require('path');
var runSequence = require('run-sequence');
var mainBowerFiles = require('main-bower-files');
var gulp = require('gulp');
var conf = require('./conf');
var karma = require('karma');

var $ = require('gulp-load-plugins')();

gulp.task('test:unit', function (done) {
  var src_files = [];
  gulp.src(path.join(conf.paths.src, '/app/**/*.js'))
    .pipe($.angularFilesort())
    .on('data', function (file) {
      src_files.push(file.path);
    }).on('end', function () {
      var server = new karma.Server({
        browsers: ['PhantomJS'],
        frameworks: ['mocha', 'chai-sinon'],
        files:
        mainBowerFiles({ includeDev: true })
          .concat(
            // Note: es5-shim needed to fix some phantomjs issues,
            // including no Function.prototype.bind . This can be
            // removed (along with the es5-shim dependency) once an
            // upgrade to phantomjs2 is complete
            'node_modules/es5-shim/es5-shim.js',
            src_files,
            'test/karma/**/*.js'),
        singleRun: true
      });

      server.on('run_complete', function (browsers, results) {
        // NB If the argument of done() is not null or not undefined,
        // e.g. a string, the next task in a series won't run.
        done(results.error ? 'There are test failures' : null);
      });
      server.start();
    });
});

gulp.task('test', function (cb) {
  runSequence('test:unit', cb);
});
