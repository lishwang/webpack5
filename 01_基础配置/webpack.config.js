const path = require('path'); // nodejs模块，专门用来处理路径问题

module.exports = {
  // 入口
  entry: './src/main.js', // 入口文件一般写 相对路径
  // 输出
  output: {
    /**
     * path.resolve() 返回一个绝对路径;
     * __dirname 是nodejs模块的一个变量，获取当前文件所在的文件夹的目录；
     * 'dist' 输出后的文件夹名称为 dist；
     */
    path: path.resolve(__dirname, 'dist'), // 输出文件路径一般是绝对路径
    filename: 'main.js', // 输出打包后的文件名
  },
  // 加载器
  module: {
    rules: [
      // loader的配置
    ]
  },
  // 插件
  plugins: [],
  // 模式
  mode: 'development',
}