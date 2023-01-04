
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: './loaders/my-first-loader', // 使用自定义的 同步loader
      },
      {
        test: /\.js$/,
        loader: './loaders/demo/sync-loader', // 使用自定义的 同步loader
      },
      {
        test: /\.js$/,
        loader: './loaders/my-first-loader',
      }
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
    })
  ],
  mode: 'development',
}