const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const gitRev = require("git-rev-sync");
const webpack = require("webpack");
const path = require("path");
const marked = require("marked");
const fs = require("fs");
const os = require("os");
const markdownRenderer = new marked.Renderer();
markdownRenderer.link = function (href, title, text) {
  var out = '<a href="' + href + '" target="_blank"';
  if (title && title !== "newWindow") {
    out += ' title="' + title + '"';
  }
  out += ">" + text + "</a>";

  return out;
};

const html = [
  {
    loader: "ngtemplate-loader",
    options: {
      relativeTo: "app/",
      prefix: "app/",
    },
  },
  {
    loader: "html-loader",
    options: {
      esModule: false,
      root: path.resolve(__dirname, "src"),
    },
  },
];

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: "./app/app.js",
  devtool: "source-map",
  performance: {
    maxAssetSize: 2_000_000,
    maxEntrypointSize: 3_000_000,
  },
  output: {
    filename: "[name].[contenthash].js",
    clean: true,
  },
  resolve: {
    roots: [path.resolve(__dirname, "src")],
  },
  devServer: {
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|webp|webm|svg|otf|mp4|ogg|wav|svg|ico)$/i,
        type: "asset/resource",
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // Creates `style` nodes from JS strings
          //"style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.md$/,
        use: [
          ...html,
          {
            loader: "markdown-loader",
            options: {
              renderer: markdownRenderer,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        include: /src\/app\/(pages|shared)\//,
        use: html,
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      HELEN_WEBSOCKET_ENDPOINT: "ws://localhost:4001/websocket/",
      HELEN_ENDPOINT: "http://localhost:4001",
    }),
    new HtmlWebpackPlugin({
      template: "/index.html",
      templateParameters: {
        'configJson': JSON.stringify({
          websocket: process.env.HELEN_WEBSOCKET_ENDPOINT,
          api: process.env.HELEN_ENDPOINT,
          sentryDSN: process.env.SENTRY_DSN,
          discordLink: process.env.DISCORD_LINK,
        })
      },
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
    new webpack.DefinePlugin({
      __BUILD_STATS__: JSON.stringify({
        gitCommit: {
          hash: gitRev.long() + "",
          branch: gitRev.branch() + "",
        },
        host: os.hostname(),
        time: +new Date(),
      }),
    }),
  ],
};
