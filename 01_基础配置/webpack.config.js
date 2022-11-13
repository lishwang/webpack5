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
    path: path.resolve(__dirname, 'dist'), // 输出文件路径一般是绝对路径，所有打包后的文件都在这个路径下
    filename: 'static/js/main.js', // 入口文件输出打包后的文件名，其他文件打包后输出在其同级目录下
    // 自动清空上次打包的内容
    clean: true,
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
        },
        generator: {
          // 设置生成的图片名字以及打包输出的图片所在的目录
          // hash 图片打包后会有一个唯一的id（图片默认情况下打包后的名字），这个id在webpack中被称为hash值；
          // [hash:6] 表示取hash值的前六位最为图片的名字；
          // ext 文件扩展名，之前是 .png 打包后 ext 还是 .png；
          // query 查询参数，如果在url地址中写了其他参数，这里会携带上；
          filename: 'static/images/[hash:6][ext][query]'
        },
      },
    ]
  },
  // 插件
  plugins: [],
  // 模式
  mode: 'development',
}