
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  // 多入口
  entry: {
    name1: './src/app.js',
    name2: './src/main.js',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].js", // 取入口中配置的文件名称
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
    })
  ],

  mode: "production",
}