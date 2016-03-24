var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var webpack = require('webpack');
var ResolverPlugin = webpack.ResolverPlugin;
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

var path = require('path');
var fs = require('fs');

// This webpack config is known to be very anti-webpack in how it
// works. This is for legacy reasons and is being gradually updated.
//
// Lots of the angular dependencies are very slow to build, so they
// are manually configured to just be directly copied over from the
// pre-minimized files they are shipped with.

var SRC = __dirname + '/src';
var OUT = __dirname + '/dist';

function toPath(p) {
  return path.resolve(path.join(__dirname, p));
}

function fileExists(path) {
  try {
    return fs.statSync(path).isFile();
  } catch(err) {
    return !(err && err.code === 'ENOENT');
  }
}

var configFile = [
  toPath('src/app/app.config.js'),
  toPath('app.config.js'),
  toPath('app.config.json'),
  toPath('src/app/app.config.js.template'),
  toPath('app.config.js.template'),
  toPath('app.config.template.json'),
].find(fileExists);

console.log('Using config file:', configFile);

var babelSettings = {
	presets: ['es2015'],
	plugins: [
		// Include the Babel runtime functions once for all source
		// files
		'transform-runtime',
		// Breaks lodash imports into only using the needed
		// functions.
		'lodash'
	],
	cacheDirectory: true
};

var extractAppStyles = new ExtractTextPlugin('app.css');
var extractVendorStyles = new ExtractTextPlugin('vendor.css');

var min = '';

module.exports = {
  name: 'js',
	context: SRC,

  babelSettings: babelSettings,

  devtool: 'source-map',

  quiet: false,
  noInfo: false,
  stats: {
    assets: false,
    colors: false,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false
  },

	entry: {
    app: './app/app',
    vendor: [
      'angular',
      'angular-animate',
      'angular-ui-router',
      '../node_modules/angular-material/angular-material' + min + '.js',
      'angular-aria',
      'angular-material-data-table',
      'angular-messages',
      'angular-ui-validate',
      '../node_modules/ng-media-events/src/ng-media-events.js',
      'clipboard',
      'kefir',
      'moment',
      '../node_modules/angular-material/angular-material.min.css',
      '../node_modules/angular-material-data-table/dist/md-data-table.min.css'
    ]
  },

  noParse: [
      /node_modules\/angular/,
      /node_modules\/angular-material/,
      /node_modules\/angular-material-data-table/,
      /node_modules\/angular-animate/,
      /node_modules\/angular-aria/,
      /node_modules\/angular-ui-router/,
      /node_modules\/angular-ui-validate/,
      /node_modules\/angular-messages/,
      /node_modules\/moment/,
      /node_modules\/kefir/,
      /node_modules\/wsevent.js/,
      /node_modules\/clipboard/,
      /node_modules\/ng-media-events/
  ],

  resolve: {
    alias: {
      'app-config': configFile,

      angular: toPath('/node_modules/angular/angular' + min + '.js'),
      'angular-material':
      toPath('/node_modules/angular-material/angular-material.min.js'),
      'angular-material-data-table':
      toPath('/node_modules/angular-material-data-table/' +
             'dist/md-data-table.min.js'),
      'angular-aria':
      toPath('/node_modules/angular-aria/angular-aria.min.js'),
      'angular-animate':
      toPath('/node_modules/angular-animate/angular-animate.min.js'),
      'angular-ui-router':
      toPath('/node_modules/angular-ui-router/release/' +
             'angular-ui-router.min.js'),
      'angular-ui-validate':
      toPath('/node_modules/angular-ui-validate/dist/validate.min.js'),
      'angular-messages':
      toPath('/node_modules/angular-messages/angular-messages.min.js'),
      kefir: toPath('/node_modules/kefir/dist/kefir.min.js'),
      moment: toPath('/node_modules/moment/min/moment.min.js')
    }
  },

	output: {
		path: OUT,
		filename: 'app.js'
	},

	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /(moment|node_modules|bower_components|lib|angular|angular-material)/,
			loaders: [
        'ng-annotate',
        'babel?' + JSON.stringify(babelSettings)
      ]
		}, {
			test: /\.json$/,
			loader: 'json'
		}, {
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
      loader: 'file?name=[path][name].[ext]'
    }, {
      test: /\.html$/,
      include: [
        path.resolve(__dirname, "src/app/pages"),
        path.resolve(__dirname, "src/app/shared")
      ],
      loader: 'ngtemplate?relativeTo=app/&prefix=app/!html'
    }, {
      test: /\.css$/,
      include: /(angular|angular-material)/,
      loader: extractVendorStyles.extract('raw')
    }, {
      test: /\.css$/,
      exclude: /(angular|angular-material)/,
      loader: extractAppStyles.extract('style', 'css')
    }, {
      test: /\.scss$/,
      loader: extractAppStyles.extract('style', 'css!sass')
    }]
	},

	plugins: [
    extractAppStyles,
    extractVendorStyles,
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new HtmlWebpackPlugin({
			template: 'index.html',
			hash: true,
			minify: {
				collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
			}
		}),
    new webpack.optimize.UglifyJsPlugin({
      exclude: /vendor\.js/i,
      compress: {
        // I'm not a fan of hiding warnings, but UglifyJS's are often
        // both hard to avoid and rarely useful
        warnings: false
      }
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
		new CopyWebpackPlugin([{ from: 'assets/', to: 'assets/' }]),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
	]
};
