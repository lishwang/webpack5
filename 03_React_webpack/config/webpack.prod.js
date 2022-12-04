// webpack.dev.js
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

// loader 抽离出公共方法
const getStyleLoaders = (preProcessor) => {
  return [
    MiniCssExtractPlugin.loader, // css 样式经过 style-loader 的处理，已经具备 HMR 功能了，但是需要在webpack配置文件中开启hot
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
    path: path.resolve(__dirname, '../dist'),
    filename: "static/js/[name].[contenthash:10].js",
    chunkFilename: "static/js/[name].[contenthash:10].chunk.js", // 通过import函数动态导入的chunk输出文件命名
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
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:10].css",
      chunkFilename: "static/css/[name].[contenthash:10].css",
    }),

    // 将public下面的资源复制到dist目录去（除了index.html）
    new CopyPlugin({
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
    // 代码压缩(css、js)
    minimizer: [new CssMinimizerWebpackPlugin(), new TerserWebpackPlugin()],
  },

  // webpack解析模块时加载的选项
  resolve: {
    // 模块引入时，不写后缀名时自动补全文件扩展名
    extensions: [".jsx", ".js", ".json"],
  },

  mode: "production",
  // source-map，便于查找错误文件及位置，便于调试
  devtool: "source-map",
}