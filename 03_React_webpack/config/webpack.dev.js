// webpack.dev.js
const path = require("path");
// eslint 插件
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
// html模板
const HtmlWebpackPlugin = require("html-webpack-plugin");
// react js代码 热更新HMR
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

// loader 抽离出公共方法
const getStyleLoaders = (preProcessor) => {
  return [
    "style-loader", // css 样式经过 style-loader 的处理，已经具备 HMR 功能了，但是需要在webpack配置文件中开启hot
    "css-loader",
    {
      // 处理样式兼容性问题
      // 需要配合 package.json 文件内的 browserslist 来指定兼容哪些浏览器以及兼容哪些版本
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    preProcessor,
  ].filter(Boolean); // 过滤数组中为空的项（preProcessor没传的项）
};

module.exports = {
  entry: "./src/main.js",
  output: {
    path: undefined, // 配置了开发服务器，输出的文件都在内存中，没有真实的打包文件输出，因此路径不需要设置
    filename: "static/js/[name].js",
    chunkFilename: "static/js/[name].chunk.js", // 通过import函数动态导入的chunk输出文件命名
    assetModuleFilename: "static/media/[hash:6][ext][query]", // 图片、字体图片等资源输出文件命名
  },

  module: {
    rules: [
      {
        oneOf: [
          {
            // 用来匹配 .css 结尾的文件
            test: /\.css$/,
            // use 数组里面 Loader 执行顺序是从右到左
            use: getStyleLoaders(),
          },
          {
            test: /\.less$/,
            use: getStyleLoaders("less-loader"),
          },
          {
            test: /\.s[ac]ss$/,
            use: getStyleLoaders("sass-loader"),
          },
          {
            test: /\.styl$/,
            use: getStyleLoaders("stylus-loader"),
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/,
            // 将符合条件的资源按照条件进行处理后在打包输出
            type: "asset",
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
              },
            },
          },
          {
            test: /\.(ttf|woff2?)$/,
            // 将资源原封不动的打包输出
            type: "asset/resource",
          },
          {
            test: /\.(jsx|js)$/,
            include: path.resolve(__dirname, "../src"), // 指定处理范围
            loader: "babel-loader",
            options: {
              // babel 缓存
              cacheDirectory: true,
              // 缓存内容不压缩
              cacheCompression: false,
              plugins: [
                // "@babel/plugin-transform-runtime", // presets中包含了
                "react-refresh/babel", // react开启js的HMR功能（@pmmmwh/react-refresh-webpack-plugin 这个插件的babel配置）
              ],
            },
          },
        ],
      },
    ],
  },

  plugins: [
    // eslit
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname, "../src"), // 处理那些文件
      exclude: "node_modules", // 指定处理范围
      cache: true, // 开启缓存
      // eslint 缓存存放目录
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
    }),

    // 配置模板
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),

    // react js代码 热更新HMR（解决js的HMR功能运行时全局变量的问题）
    new ReactRefreshWebpackPlugin(),

    // 将public下面的资源复制到dist目录去（除了index.html）
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"),
          to: path.resolve(__dirname, "../dist"),
          toType: "dir",
          noErrorOnMissing: true, // 不生成错误
          globOptions: {
            // 忽略文件
            ignore: ["**/index.html"],
          },
          info: {
            // 跳过terser压缩js
            minimized: true,
          },
        },
      ],
    }),
  ],

  optimization: {
    // 分包，代码分隔
    splitChunks: {
      chunks: "all",
    },
    // 解决代码分隔导致的缓存失效，当只有一个文件资源发生变化，希望只有这一个文件的缓存失效，其他文件的缓存不要受到影响
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
  },

  // webpack解析模块时加载的选项
  resolve: {
    // 模块引入时，不写后缀名时自动补全文件扩展名
    extensions: [".jsx", ".js", ".json"],
  },

  // 开发服务器，自动化配置
  devServer: {
    open: true, // 自动打开浏览器
    host: "localhost",
    port: 3001,
    hot: true, // 开启热模块替换
    compress: true,
    historyApiFallback: true, // 解决react-router刷新404问题
  },

  mode: "development",
  // source-map，便于查找错误文件及位置，便于调试
  devtool: "cheap-module-source-map",
}