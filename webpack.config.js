const webpack = require('webpack');
const ClosureCompilerPlugin = require('webpack-closure-compiler');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const isProductionBuild = process.argv.indexOf("--env.prod") >= 0;

const extractSassPlugin = new ExtractTextPlugin({
  filename: "[name].[contenthash].css",
  disable: !isProductionBuild
});

module.exports = {
  devtool: 'inline-source-map',
  entry: './src/www/index.ts',
  output: {
    path: __dirname + '/dist/www',
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      { test: /\.scss$/, use: extractSassPlugin.extract({ use: [{ loader: "css-loader" }, { loader: "sass-loader" }], fallback: "style-loader" }) },
      { test: /\.css$/, use: extractSassPlugin.extract({ use: [{ loader: "css-loader" }], fallback: "style-loader" }) },
      { test: /\.tsx?$/, use: [{ loader: 'ts-loader', options: { configFile: "./tsconfig.json" } }] },
      { test: /\.(eot|svg|ttf|woff|woff2)$/, use: [ { loader: 'file-loader' } ]}
    ]
  },
  devServer: {
    hot: true
  },
  plugins: [
    extractSassPlugin,
    new HtmlWebpackPlugin({
      title: "Jason's Development Blog",
      template: "./src/www/index.html"
    })
  ].concat((isProductionBuild
    ? [new ClosureCompilerPlugin({ jsCompiler: true, compiler: { warning_level: "QUIET" } })]
    : [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin()
    ]
  ))
}
