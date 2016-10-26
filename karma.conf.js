/*global __dirname, module, process */

var path = require('path');

var babelSettings = {
  presets: ['es2015'],
  // For testing, especially useful for angular-style modules in the
  // process of being converted
  plugins: [
    'transform-flow-strip-types',
    'transform-runtime',
    'lodash',
    'rewire',
  ],
};

var browsers = ['PhantomJS'];
if (process.env.TEST_ENV === 'BROWSERS') {
  browsers.push('Firefox');
}

var webpackConfig = require('./webpack.config.js');
var webpack = require('webpack');
var DefinePlugin = webpack.DefinePlugin;

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
      'node_modules/babel-polyfill/dist/polyfill.js',
      'src/app/app.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'test/karma/**/*.js',
    ],

    preprocessors: {
      'src/app/**/*.js': ['webpack', 'sourcemap'],
      'test/karma/**/*.js': ['webpack', 'sourcemap'],
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
      plugins: [
        new DefinePlugin({
          'process.env': JSON.stringify({NODE_ENV: 'testing'}),
          '__BUILD_STATS__': JSON.stringify({
            gitCommit: {
              hash: 'githash',
              branch: 'gitbranch',
            },
            host: 'buildhost',
            time: +(new Date()),
          }),
        }),
      ],
    },
    webpackMiddleware: {
      noInfo: true,
    },
  });
};
