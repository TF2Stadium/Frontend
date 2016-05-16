/*global __dirname, module, process */

var path = require('path');

var babelSettings = {
  presets: ['es2015'],
  extends: path.join(__dirname, '/.babelrc'),
  // For testing, especially useful for angular-style modules in the
  // process of being converted
  plugins: ['rewire'],
};

var browsers = ['PhantomJS'];
if (process.env.TEST_ENV === 'BROWSERS') {
  browsers.push('Firefox');
}

var webpackConfig = require('./webpack.config.js');

function toPath(p) {
  return path.resolve(path.join(__dirname, p));
}

module.exports = function (config) {
  config.set({
    browsers: browsers,
    frameworks: ['mocha', 'chai-sinon'],

    singleRun: true,
    reporters: ['progress', 'coverage'],

    files: [
      'src/app/app.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'test/karma/**/*.js',
    ],

    preprocessors: {
      'src/app/**/*.js': ['webpack', 'sourcemap'],
      'test/karma/**/*.js': ['webpack'],
    },

    webpack: {
      context: webpackConfig.context,
      devtool: 'inline-source-map',
      resolve: {
        alias: {
          'app-config': toPath('test/app.config.test.json'),
        },
      },
      module: {
        loaders: [{
          test: /\.svg$/,
          loaders: [
            'file?name=[path][name].[ext]',
            'svgo',
          ],
        }, {
          test: /\.(png|jpg|jpeg|gif|woff|woff2|ttf|eot|otf|webm|mp4|ogg|wav)$/,
          loader: 'file?name=[path][name].[ext]',
        }, {
          test: /\.js$/,
          exclude: /(node_modules|vendor\.js)/,
          loader: 'babel?' + JSON.stringify(babelSettings),
        }, {
          test: /\.json$/,
          loader: 'json',
        }, {
          test: /\.(s?[ac]ss|html?|md)$/,
          include: [
            path.resolve(__dirname, 'src/'),
            path.resolve(__dirname, 'src/app/pages'),
            path.resolve(__dirname, 'src/app/shared'),
          ],
          loader: 'null',
        }],
      },
    },
    webpackMiddleware: {
      noInfo: true,
    },
  });
};
