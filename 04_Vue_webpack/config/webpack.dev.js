const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require("vue-loader");

// 抽离公共loader
function common_loader_fun (loader) {
  return [
    "vue-style-loader",
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            [
              "postcss-preset-env", // 能解决大多数样式兼容性问题
            ],
          ],
        },
      },
    },
    loader,
  ].filter(Boolean);
};

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: "static/js/[name].js",
    chunkFilename: "static/js/[name].chunk.js",
    assetModuleFilename: "static/media/[hash:6][ext][query]",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: common_loader_fun(),
      },
      {
        test: /\.less$/,
        use: common_loader_fun("less-loader"),
      },
      {
        test: /\.s[ac]ss$/,
        use: common_loader_fun("sass-loader"),
      },
      {
        test: /\.styl$/,
        use: common_loader_fun("stylus-loader"),
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 4kb
          }
        }
      },
      {
        test: /\.(ttf|woff2?|mp3|mp4)$/,
        type: "asset/resource",
      },
      {
        test: /\.js$/,
        exclude: /node_modules[\\/]/,
        // include: path.resolve(__dirname, "../src"), // 指定处理范围
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.vue$/,
        loader: "vue-loader", // 内部会给vue文件注入HMR功能代码
        options: {
          // 开启缓存
          cacheDirectory: path.resolve(
            __dirname,
            "node_modules/.cache/vue-loader"
          ),
        },
      },
    ]
  },
  plugins: [
    new ESLintPlugin({
      context: path.resolve(__dirname, '../src'),
      exclude: "node_modules",
      cache: true,
      cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache"),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // vue-loader 需要引用的插件
    new VueLoaderPlugin(),
  ],
  mode: "development",
  // webpack解析模块时加载的选项
  resolve: {
    // 模块引入时，不写后缀名时自动补全文件扩展名
    extensions: [".vue", ".js", ".json"],
  },
  devServer: {
    host: 'localhost',
    port: 3333,
    open: true,
    hot: true,
    historyApiFallback: true, // 解决vue-router刷新404问题
  },
}