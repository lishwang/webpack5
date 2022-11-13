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
      // 处理css样式文件
      {
        test: /\.css$/, // 检测css文件
        // loader 的执行顺序：从右到左（从下到上）
        use: [
          'style-loader', // 将 js 中的css代码通过创建style标签添加到html文件中使样式生效；
          'css-loader', // 将 css 资源编译成 commonjs 的模块到js 中；
        ]
      },
      // 处理less样式文件
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          "less-loader", // 将less文件处理成css文件
        ],
      },
      // 处理sass样式文件
      {
        test: /\.s[ac]ss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader", // 负责将 Sass 文件编译成 css 文件
        ],
      },
      {
        test: /\.styl$/,
        use: ["style-loader", "css-loader", "stylus-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        type: "asset",
        parser: {
          // 如果图片不大于100kb，将会被转化成base64格式的图片字符串
          dataUrlCondition: {
            maxSize: 100 * 1024 // 100kb
          }
        }
      },
    ]
  },
  // 插件
  plugins: [],
  // 模式
  mode: 'development',
}