'use strict';

var path = require('path');
var runSequence = require('run-sequence');
var mainBowerFiles = require('main-bower-files');
var gulp = require('gulp');
var conf = require('./conf');
var karma = require('karma');
var toArray = require('stream-to-array');

var $ = require('gulp-load-plugins')();

function runUnitTestsOn(browsers, done) {
  var srcGlob = path.join(conf.paths.src, '/app/**/*.js');
  var src = gulp.src(srcGlob).pipe($.angularFilesort());

  var preprocessors = {};
  preprocessors[srcGlob] = ['coverage'];

  toArray(src, function (err, srcFiles) {
    var server = new karma.Server({
      browsers: browsers,
      frameworks: ['mocha', 'chai-sinon'],
      files:
      mainBowerFiles({ includeDev: true })
        .concat(
          // Note: es5-shim needed to fix some phantomjs issues,
          // including no Function.prototype.bind . This can be
          // removed (along with the es5-shim dependency) once an
          // upgrade to phantomjs2 is complete
          'node_modules/es5-shim/es5-shim.js',
          srcFiles.map(function (f) { return f.path; }),
          path.join(conf.paths.test, '/karma/**/*.js')),
      singleRun: true,
      reporters: ['progress', 'coverage'],
      preprocessors: preprocessors
    });

    server.on('run_complete', function (browsers, results) {
      // NB If the argument of done() is not null or not undefined,
      // e.g. a string, the next task in a series won't run.
      done(results.error ? 'There are test failures' : null);
    });
    server.start();
  });
}

gulp.task('test:unit', function (done) {
  runUnitTestsOn(['PhantomJS'], done)
});

gulp.task('test-browsers:unit', function (done) {
  runUnitTestsOn(['PhantomJS', 'Firefox', 'Chrome'], done)
});

gulp.task('test', function (cb) {
  runSequence('test:unit', cb);
});


gulp.task('test-browsers', function (cb) {
  runSequence('test-browsers:unit', cb);
});
