const path = require('path'); // nodejs模块，专门用来处理路径问题
// 用于处理Eslint的插件
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
// 配置 HTML 模板，可以借助插件来实现打包后 js 文件的自动引入到 html 文件中
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    // 配置了开发服务器后，不会真正的有文件输出，而是在内存中打包的，因此可以不写输出路径，也不需要配置clean来清空上次打包内容，但是输出文件名要写
    path: undefined,
    // path: path.resolve(__dirname, '../dist'), // 输出文件路径一般是绝对路径，所有打包后的文件都在这个路径下
    filename: 'static/js/main.js', // 入口文件输出打包后的文件名，其他文件打包后输出在其同级目录下
    // 自动清空上次打包的内容（配置了开发服务器）
    // clean: true,
  },
  // 加载器
  module: {
    rules: [
      {
        oneOf: [
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
            type: "asset", // 将符合条件的文件转换成base64格式的字符串，然后打包输出；
            // 需要转换成base64格式的文件的条件
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
          // 处理字体图标、音频、视频等不需要额外处理直接原封不动的打包输出的资源文件；
          {
            test: /\.(ttf|woff2?|mp3|mp4|avi)$/, // 匹配字体图标、音频、视频等不需要额外处理直接原封不动的打包输出的资源文件
            type: "asset/resource", // 将文件原封不动的打包输出
            generator: {
              // 设置打包输出的文件名字以及打包输出的文件所在的目录
              filename: 'static/media/[hash:6][ext][query]'
            },
          },
          // webpack5 用 loader 处理 Babel 代码
          {
            test: /\.js$/,
            // exclude: /node_modules/, // 排除 node_modules 代码不编译；include、exclude不能同时使用；
            include: path.resolve(__dirname, '../src'), // 只处理 src 下的文件；include、exclude不能同时使用；
            loader: "babel-loader",
            // options: {
            //   presets: ["@babel/preset-env"], // 如果在 webpack 的配置文件中添加了babel预设的配置，就不需要在 外面的 babel 配置文件中再配置了；
            // }
          }
        ]
      }
    ]
  },
  // 插件
  plugins: [
    // 用于处理 Eslint 的插件
    new ESLintWebpackPlugin({
      // Eslint的配置选项，指定检查文件的根目录
      context: path.resolve(__dirname, "../src"), // 哪些文件要做Eslint检查，检查src文件下的所有文件
      exclude: "node_modules", // 排除 node_modules 代码不编译；include、exclude不能同时使用；
      // include: path.resolve(__dirname, '../src'), // 只处理 src 下的文件；include、exclude不能同时使用；
    }),

    // 配置 HTML 模板，可以借助插件来实现打包后 js 文件的自动引入到 html 文件中
    new HtmlWebpackPlugin({
      // 模板：以 public/index.html 为模板，创建新的html文件，并打包到 dist 文件下；
      // 这个新的html文件有两个特点：1、DOM结构与模板中的一致；2、会自动引入打包后的资源；
      template: path.resolve(__dirname, '../public/index.html'), // html模板路径可以为相对路径或者绝对路径；
    }),
  ],
  // 开发服务器，需要运行 npx webpack serve 才能启动开发服务器，不会生成打包后的文件，而是在内存中编译打包的，而且修改完代码后自动打包且更新浏览器展示
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "3000", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
    hot: true, // 开启 HMR 热替换
  },
  // 模式
  mode: 'development',
  // SourceMap（源代码映射）
  devtool: "cheap-module-source-map",
}