'use strict';

var fs = require('fs');
var es = require('event-stream');
var lazypipe = require('lazypipe');
var glob = require('glob');
var path = require('path');
var _ = require('lodash');
var runSequence = require('run-sequence');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
  pattern: [
    'gulp-angular-templatecache',
    'gulp-change',
    'gulp-if',
    'gulp-csso',
    'gulp-filter',
    'gulp-flatten',
    'gulp-inject',
    'gulp-load-plugins',
    'gulp-minify-html',
    'gulp-ng-annotate',
    'gulp-rev',
    'gulp-rev-replace',
    'gulp-size',
    'gulp-sass',
    'gulp-sourcemaps',
    'gulp-uglify',
    'gulp-useref',
    'gulp-util',
    'main-bower-files',
    'uglify-save-license',
    'del']
});

gulp.task('partials', function () {
  return gulp.src([
    path.join(conf.paths.src, '/app/**/*.html'),
    path.join(conf.paths.tmp, '/serve/app/**/*.html')
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'tf2stadium',
      root: 'app'
    }))
    .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html', ['build:inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(conf.paths.tmp, '/partials'),
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');

  var injectTransforms = function (name) {
    return lazypipe().pipe(conf.replaceConfig)();
  };

  return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe($.useref({}, injectTransforms))
    .pipe(jsFilter)
    .pipe($.rev())
    .pipe($.ngAnnotate())
    .pipe($.uglify({ preserveComments: $.uglifySaveLicense }))
    .on('error', conf.errorHandler('Uglify'))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.rev())
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true,
      conditionals: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

gulp.task('other', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
    path.join(conf.paths.src, '/**/*'),
    path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('clean', function (done) {
  $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')], done);
});

// Return only base file name without dir
function getMostRecentMtimeSync(dir) {
  var files = glob.sync(path.join(dir, '**/*'));

  return _.max(_.map(files, function (f) {
    return fs.statSync(f).mtime;
  }));
}

gulp.task('rebuild', function (cb) {
  runSequence('clean', ['html', 'fonts', 'other'], cb);
});

gulp.task('build', function (cb) {
  if (getMostRecentMtimeSync(conf.paths.src) <= getMostRecentMtimeSync(conf.paths.dist)) {
    $.util.log('No modified files: not building');
    cb();
  } else {
    runSequence('rebuild', cb);
  }
});
