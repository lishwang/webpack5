const path = require('path'); // nodejs模块，专门用来处理路径问题
// 用于处理Eslint的插件
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
// 配置 HTML 模板，可以借助插件来实现打包后 js 文件的自动引入到 html 文件中
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 打包时将 CSS 提取到单独的文件中，并结合 HtmlWebpackPlugin 插件，可以实现 css 自动通过 link 标签引入到 html 文件中；
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// css压缩
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// 压缩 js 代码的插件，不需要安装，内置模块
const TerserPlugin = require("terser-webpack-plugin");
// 设置浏览器闲时加载后续需要的资源还是立即加载资源
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
// 压缩图片
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
// PWA（渐进式网络应用程序），实现离线(offline) 时应用程序能够继续运行功能
const WorkboxPlugin = require("workbox-webpack-plugin");

// nodejs核心模块，直接使用
const os = require("os");
// 获取cpu核数
const threads = os.cpus().length;

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
    path: path.resolve(__dirname, '../dist'), // 输出文件路径一般是绝对路径，所有打包后的文件都在这个路径下
    // [contenthash:8]使用contenthash，取8位长度
    filename: 'static/js/[name].[contenthash:8].js', // 入口文件输出打包后的文件名，其他文件打包后输出在其同级目录下
    // chunkFilename给打包生成的非入口文件命名（包括动态导入输出的文件的命名）
    // [name] 取值为按需加载时 webpackChunkName 设置的值
    chunkFilename: "static/js/[name].[contenthash:8].chunk.js", // 动态导入输出资源命名方式
    // 通过 type: asset 处理的资源的统一命名方式（例如 图片、字体，这里配置之后可以删掉单独的配置generator属性）
    assetModuleFilename: "static/media/[name].[hash:6][ext][query]", // 图片、字体等资源命名方式（注意用hash）
    // 自动清空上次打包的内容
    clean: true,
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
              // 'style-loader', // 这个loader会动态创建style标签，将 js 中的css代码通过创建的style标签添加到html文件中使样式生效；
              MiniCssExtractPlugin.loader, // 把css文件提取成单独的文件，所以不需要引入style-loader来创建style标签了；
              'css-loader', // 将 css 资源编译成 commonjs 的模块到js 中；
              // postcss-loader 必须使用在  "css-loader"  之前，且在  "less-loader"  等loader之后；
              // 如果loader需要额外的配置，需要将该loader写成对象的形式；
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: [
                      "postcss-preset-env", // 能解决大多数样式兼容性问题
                    ],
                  },
                },
              },
            ]
          },
          // 处理less样式文件
          {
            test: /\.less$/,
            use: [
              // "style-loader",
              MiniCssExtractPlugin.loader, // 把css文件提取成单独的文件，所以不需要引入style-loader来创建style标签了；
              "css-loader",
              // postcss-loader 必须使用在  "css-loader"  之前，且在  "less-loader"  等loader之后；
              // 如果loader需要额外的配置，需要将该loader写成对象的形式；
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: [
                      "postcss-preset-env", // 能解决大多数样式兼容性问题
                    ],
                  },
                },
              },
              "less-loader", // 将less文件处理成css文件
            ],
          },
          // 处理sass样式文件
          {
            test: /\.s[ac]ss$/,
            use: [
              // "style-loader",
              MiniCssExtractPlugin.loader, // 把css文件提取成单独的文件，所以不需要引入style-loader来创建style标签了；
              "css-loader",
              // postcss-loader 必须使用在  "css-loader"  之前，且在  "less-loader"  等loader之后；
              // 如果loader需要额外的配置，需要将该loader写成对象的形式；
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: [
                      "postcss-preset-env", // 能解决大多数样式兼容性问题
                    ],
                  },
                },
              },
              "sass-loader", // 负责将 Sass 文件编译成 css 文件
            ],
          },
          {
            test: /\.styl$/,
            use: [
              // "style-loader", 
              MiniCssExtractPlugin.loader, // 把css文件提取成单独的文件，所以不需要引入style-loader来创建style标签了；
              "css-loader",
              // postcss-loader 必须使用在  "css-loader"  之前，且在  "less-loader"  等loader之后；
              // 如果loader需要额外的配置，需要将该loader写成对象的形式；
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: [
                      "postcss-preset-env", // 能解决大多数样式兼容性问题
                    ],
                  },
                },
              },
              "stylus-loader"
            ],
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
            // 在出口中通过assetModuleFilename属性来统一配置 通过type: "asset"处理的资源文件，这里可以删掉generator的配置
            // generator: {
            //   // 设置生成的图片名字以及打包输出的图片所在的目录
            //   // hash 图片打包后会有一个唯一的id（图片默认情况下打包后的名字），这个id在webpack中被称为hash值；
            //   // [hash:6] 表示取hash值的前六位最为图片的名字；
            //   // ext 文件扩展名，之前是 .png 打包后 ext 还是 .png；
            //   // query 查询参数，如果在url地址中写了其他参数，这里会携带上；
            //   filename: 'static/images/[hash:6][ext][query]'
            // },
          },
          // 处理字体图标、音频、视频等不需要额外处理直接原封不动的打包输出的资源文件；
          {
            test: /\.(ttf|woff2?|mp3|mp4|avi)$/, // 匹配字体图标、音频、视频等不需要额外处理直接原封不动的打包输出的资源文件
            type: "asset/resource", // 将文件原封不动的打包输出
            // 在出口中通过assetModuleFilename属性来统一配置 通过type: "asset"处理的资源文件，这里可以删掉generator的配置
            // generator: {
            //   // 设置打包输出的文件名字以及打包输出的文件所在的目录
            //   filename: 'static/media/[hash:6][ext][query]'
            // },
          },
          // webpack5 用 loader 处理 Babel 代码
          {
            test: /\.js$/,
            // exclude: /node_modules/, // 排除 node_modules 代码不编译；include、exclude不能同时使用；
            include: path.resolve(__dirname, '../src'), // 只处理 src 下的文件；include、exclude不能同时使用；
            use: [
              {
                loader: "thread-loader", // 开启多进程
                options: {
                  workers: threads, // 开启多线程的数量，就是 CPU 的核数；
                },
              },
              {
                loader: "babel-loader",
                options: {
                  // presets: ["@babel/preset-env"], // 如果在 webpack 的配置文件中添加了babel预设的配置，就不需要在 外面的 babel 配置文件中再配置了；
                  cacheDirectory: true, // 开启babel编译缓存
                  cacheCompression: false, // 缓存文件不要压缩
                  plugins: ["@babel/plugin-transform-runtime"], // Babel 插件配置，减少代码体积
                }
              }
            ],
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
      exclude: "node_modules", // （默认值）排除 node_modules 代码不编译；include、exclude不能同时使用；
      // include: path.resolve(__dirname, '../src'), // 只处理 src 下的文件；include、exclude不能同时使用；
      cache: true, // 开启缓存
      // 缓存目录
      cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache"),
      threads, // 开启多进程
    }),

    // 配置 HTML 模板，可以借助插件来实现打包后 js 文件的自动引入到 html 文件中
    new HtmlWebpackPlugin({
      // 模板：以 public/index.html 为模板，创建新的html文件，并打包到 dist 文件下；
      // 这个新的html文件有两个特点：1、DOM结构与模板中的一致；2、会自动引入打包后的资源；
      template: path.resolve(__dirname, '../public/index.html'), // html模板路径可以为相对路径或者绝对路径；
    }),
    // 提取css成单独文件，并结合 HtmlWebpackPlugin 插件，可以实现 css 自动通过 link 标签引入到 html 文件中；
    new MiniCssExtractPlugin({
      // 定义输出文件名和目录
      // [contenthash:8]使用contenthash，取8位长度
      filename: "static/css/[name].[contenthash:8].css", // 适配多入口，可以写 动态名称[name]
      // 定义动态导入（按需加载）的css文件的文件名
      chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
    }),

    // css压缩 （可以写到optimization.minimizer里面，效果一样的）
    // new CssMinimizerPlugin(),

    // js压缩
    // 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
    // （可以写到optimization.minimizer里面，效果一样的）
    // new TerserPlugin({
    //   parallel: threads // 开启多进程
    // })

    // 设置浏览器闲时加载后续需要的资源还是立即加载资源
    new PreloadWebpackPlugin({
      rel: "preload", // 把后续需要使用的js文件采用 preload 的方式加载，立即加载，需要设置as属性配置加载的优先级
      as: "script", // 把后续需要使用的js文件当做 script 标签的优先级来加载，其中 style 的优先级最高
      // rel: 'prefetch' // 把后续需要使用的js文件采用 prefetch 的方式加载，浏览器空闲时加载，不用设置as属性
    }),

    // PWA（渐进式网络应用程序），实现离线(offline) 时应用程序能够继续运行功能
    new WorkboxPlugin.GenerateSW({
      // 这些选项帮助快速启用 ServiceWorkers
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],

  // 一般压缩的内容放在这里
  optimization: {
    minimize: true,
    minimizer: [
      // css压缩 （可以写在插件plugins里面，效果一样的）
      new CssMinimizerPlugin(),
      // js压缩
      // 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
      // （可以写在插件plugins里面，效果一样的）
      new TerserPlugin({
        parallel: threads // 开启多进程
      }),
      // 压缩图片
      // new ImageMinimizerPlugin({
      //   minimizer: {
      //     implementation: ImageMinimizerPlugin.imageminGenerate,
      //     options: {
      //       plugins: [
      //         ["gifsicle", { interlaced: true }],
      //         ["jpegtran", { progressive: true }],
      //         ["optipng", { optimizationLevel: 5 }],
      //         [
      //           "svgo",
      //           {
      //             plugins: [
      //               "preset-default",
      //               "prefixIds",
      //               {
      //                 name: "sortAttrs",
      //                 params: {
      //                   xmlnsOrder: "alphabetical",
      //                 },
      //               },
      //             ],
      //           },
      //         ],
      //       ],
      //     },
      //   },
      // }),
    ],

    // 代码分隔配置（动态加载的文件自动会被分隔成单独的文件打包）
    splitChunks: {
      chunks: "all", // 单入口时，代码分隔配置只需要这一个属性即可，其他配置一般都是用默认值，如果有特殊需求，可参考  02_代码分隔（Code Split） 文件中的配置；
    },
    // 提取runtime文件，会将文件之间依赖的hash值提取成单独的文件来保管；
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime文件命名规则，打包后生成的单独文件的文件名
    },
  },
  // 生产模式不需要devServer，要删掉
  // 开发服务器，需要运行 npx webpack serve 才能启动开发服务器，不会生成打包后的文件，而是在内存中编译打包的，而且修改完代码后自动打包且更新浏览器展示
  // devServer: {
  //   host: "localhost", // 启动服务器域名
  //   port: "3000", // 启动服务器端口号
  //   open: true, // 是否自动打开浏览器
  // },
  // 模式
  mode: 'production',
  // SourceMap（源代码映射）
  devtool: "source-map",
}