
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
      // {
      //   test: /\.js$/,
      //   loader: './loaders/my-first-loader', // 使用自定义的 同步loader
      // },
      // {
      //   test: /\.js$/,
      //   loader: './loaders/demo/01_sync-loader', // 使用自定义的 同步loader
      // },
      {
        test: /\.js$/,
        // loader的执行顺序是：从下到上，从右到左，从后到前（上一个loader是异步loader时也要等这个异步loader执行完再执行下一个loader）
        use: [
          './loaders/demo/01_sync-loader', // 同步loader
          './loaders/demo/02_async-loader', // 异步loader
        ]
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