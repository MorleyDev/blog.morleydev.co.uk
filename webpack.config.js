const webpack = require('webpack');
const ClosureCompilerPlugin = require('webpack-closure-compiler');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProductionBuild = process.argv.indexOf("--env.prod") >= 0;

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
      { test: /\.tsx?$/, loader: 'ts-loader', options: { configFile: "./tsconfig.json" } }
    ]
  },
  devServer: {
    hot: true
  },
  plugins: [
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
