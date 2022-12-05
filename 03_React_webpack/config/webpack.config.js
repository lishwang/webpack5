// webpack的配置文件（包含生产环境和开发环境）
const path = require("path");
// eslint 插件
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
// html模板
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 拷贝public文件下的静态资源到dist目录下（index.html文件除外）
const CopyPlugin = require("copy-webpack-plugin");
// 提取css成单独文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 对 css 文件进行压缩
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
// 对 js 文件进行压缩
const TerserWebpackPlugin = require("terser-webpack-plugin");
// react js代码 热更新HMR
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

// 根据 cross-env 或者当前环境变量
const isProduction = process.env.NODE_ENV === 'production';

// loader 抽离出公共方法
const getStyleLoaders = (preProcessor) => {
  return [
    isProduction ? MiniCssExtractPlugin.loader : "style-loader", // css 样式经过 style-loader 的处理，已经具备 HMR 功能了，但是需要在webpack配置文件中开启hot
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
    path: isProduction ? path.resolve(__dirname, '../dist') : undefined,
    filename: isProduction ? "static/js/[name].[contenthash:10].js" : "static/js/[name].js",
    chunkFilename: isProduction ? "static/js/[name].[contenthash:10].chunk.js" : "static/js/[name].chunk.js", // 通过import函数动态导入的chunk输出文件命名
    assetModuleFilename: "static/media/[hash:6][ext][query]", // 图片、字体图片等资源输出文件命名
    clean: true, // 自动清空上次打包的内容
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
                !isProduction && "react-refresh/babel", // react开启js的HMR功能（@pmmmwh/react-refresh-webpack-plugin 这个插件的babel配置）
              ].filter(Boolean),
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

    // 提取css成单独文件
    isProduction && new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:10].css",
      chunkFilename: "static/css/[name].[contenthash:10].css",
    }),

    // 将public下面的资源复制到dist目录去（除了index.html）
    isProduction && new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"),
          to: path.resolve(__dirname, "../dist"),
          toType: "dir",
          noErrorOnMissing: true, // 不生成错误
          globOptions: {
            // 忽略index.html文件
            ignore: ["**/index.html"],
          },
          info: {
            // 跳过terser压缩js
            minimized: true,
          },
        },
      ],
    }),

    // react js代码 热更新HMR（解决js的HMR功能运行时全局变量的问题）
    !isProduction && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),

  optimization: {
    // 分包，代码分隔
    splitChunks: {
      chunks: "all",
      // 将匹配到的文件分组打包（react相关的分一组、antd UI组件库分为一组、剩余的node_modules包分为一组）
      cacheGroups: {
        react: { // 分组名，没有实际的意义
          // 将 react、react-dom、react-router-dom 一起打包成一个js文件
          test: /[\\/]node_modules[\\/]react(.*)?[\\/]/, // 匹配到的内容被打包到一个js文件内
          name: "react-chunk", // 打包后的名称
          priority: 40, // 优先级，数值越大，打包的优先级越高（各个分组之间可能有交叉，优先级越高，权重越高，可以为负值）
        },
        // antd UI组件库单独打包
        antd: {
          test: /[\\/]node_modules[\\/]antd[\\/]/,
          name: "antd-chunk",
          priority: 30,
        },
        // 剩下的node_modules一起打包成一个文件
        libs: {
          test: /[\\/]node_modules[\\/]/,
          name: "libs-chunk",
          priority: 20,
        },
      }
    },
    // 解决代码分隔导致的缓存失效，当只有一个文件资源发生变化，希望只有这一个文件的缓存失效，其他文件的缓存不要受到影响
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
    // 控制是否需要进行压缩
    minimize: isProduction, // 生产环境需要压缩，开发环境不需要压缩
    // 代码压缩(css、js、图片) （只有minimize为true时，执行minimizer中的压缩；minimize默认为true）
    // 图片的配置比较复杂，在笔记中有记载
    minimizer: [new CssMinimizerWebpackPlugin(), new TerserWebpackPlugin()],
  },

  // webpack解析模块时加载的选项
  resolve: {
    // 模块引入时，不写后缀名时自动补全文件扩展名
    extensions: [".jsx", ".js", ".json"],
  },

  mode: isProduction ? "production" : "development",
  // source-map，便于查找错误文件及位置，便于调试
  devtool: isProduction ? "source-map" : "cheap-module-source-map",

  // 开发服务器，自动化配置（由 webpack serve 指令驱动，因此在生产环境下不会执行，可以不删除）
  devServer: {
    open: true, // 自动打开浏览器
    host: "localhost",
    port: 3001,
    hot: true, // 开启热模块替换
    compress: true,
    historyApiFallback: true, // 解决react-router刷新404问题
  },
}