/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

var gutil = require('gulp-util');
var fs = require('fs');
var es = require('event-stream');
var path = require('path');
var toArray = require('stream-to-array');
var vfs = require('vinyl-fs');

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
  src: 'src',
  dist: 'dist',
  test: 'test',
  tmp: '.tmp',
  e2e: 'e2e'
};

/**
 *  Wiredep is the lib which inject bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
exports.wiredep = {
  exclude: [/foundation\.js/, /foundation\.css/],
  directory: 'bower_components'
};

var configFile = 'app.config.js';

exports.shouldReplace = function(fname) {
  return fname.indexOf(configFile) > -1;
};

function isFile(path) {
  try {
    return fs.statSync(path).isFile();
  } catch(err) {
    return !(err && err.code === 'ENOENT');
  }
}

/**
 *  Returns a stream creation function that creates streams to replace
 *  the config file with the config file + .override if the override
 *  file is present.
 *
 *  eg, this can be used on a stream: `.pipe(conf.replaceConfig())`
 *  and when that stream encounters the config file, it may be replaced with
 *  the .override file
 */
exports.replaceConfig = function() {
  var overrideFile =
        path.join(exports.paths.src, 'app', configFile) + '.override';

  if (isFile(overrideFile)) {
    return es.map(function (file, next) {
      if (exports.shouldReplace(file.path)) {
        toArray(vfs.src(overrideFile), function (err, arr) {
          if (err) {
            gutil.log('Error loading site-specific config', err);
          } else {
            gutil.log('Using site-specific config', arr[0].path);

            // We need to modify the original file; just doing
            // next(null, arr[0]) might trip up later stream processes
            // which rely on the filename to end in .js
            file.contents = arr[0].contents;
          }

          next(null, file);
        });
      } else {
        next(null, file);
      }
    });
  } else {
    return es.map(function (f, next) { next(null, f); });;
  }
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function(title) {
  'use strict';

  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
