
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
      // {
      //   test: /\.js$/,
      //   // loader的执行顺序是：从下到上，从右到左，从后到前（上一个loader是异步loader时也要等这个异步loader执行完再执行下一个loader）
      //   use: [
      //     './loaders/demo/01_sync-loader', // 同步loader
      //     './loaders/demo/02_async-loader', // 异步loader
      //   ]
      // },
      // {
      //   test: /\.js$/,
      //   // loader的执行顺序是：从下到上，从右到左，从后到前（上一个loader是异步loader时也要等这个异步loader执行完再执行下一个loader）
      //   use: [
      //     './loaders/demo/04_Pitching-Loader1', // Pitching-Loader
      //     './loaders/demo/04_Pitching-Loader2', // Pitching-Loader
      //     './loaders/demo/04_Pitching-Loader3', // Pitching-Loader
      //   ]
      // },
      // {
      //   test: /\.js$/,
      //   // loader的执行顺序是：从下到上，从右到左，从后到前（上一个loader是异步loader时也要等这个异步loader执行完再执行下一个loader）
      //   use: [
      //     './loaders/test-loader/05_clean-log-loader', // clean-log-loader 自己写的loader，用于清除文件内容中的 console.log(xxx); 可以在打包后文件中查看打包内容；
      //   ]
      // },
      // {
      //   test: /\.js$/,
      //   loader: './loaders/test-loader/banner-loader',
      //   options: {
      //     author: '老王',
      //     // age: 18, // 报错：因为 loaders\banner-loader\schema.json 文件中只对author属性做了校验，且不允许新增其他属性；
      //   }
      // },
      {
        test: /\.js$/,
        loader: './loaders/test-loader/my-babel-loader', // babel-loader功能简单实现
        options: {
          presets: ['@babel/preset-env']
        }
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
    })
  ],
  mode: 'development',
}