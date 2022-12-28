const path = require('path');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require("vue-loader");
// 用于定义环境变量，给代码使用的
const { DefinePlugin } = require('webpack');

// element-plus 按需引入的配置插件
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

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
    // 自定义主题配置，给sass-loader添加额外配置
    loader && {
      loader: loader,
      options: loader === 'sass-loader' ? {
        // element-plus自定义主题配置文件
        additionalData: `@use "@/styles/element/index.scss" as *;`,
      } : {},
    },
  ].filter(Boolean);
}

module.exports = {
  entry: './src/main.js',
  output: {
    path: undefined,
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
    new EslintWebpackPlugin({
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
    // package.json文件中采用cross-env定义的环境变量是给webpack等打包工具使用的；
    // DefinePlugin定义的环境变量是给源代码使用的，常用来vue3页面报警告问题；
    new DefinePlugin({
      "__VUE_OPTIONS_API__": true,
      "__VUE_PROD_DEVTOOLS__": false, // 在生产模式下开发工具要不要出现，不出现
    }),

    // element-plus 按需引入的配置插件
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver(
        // element-plus自定义主题配置
        {
          importStyle: "sass",
        }
      )],
    }),
  ],
  mode: "development",
  devtool: "cheap-module-source-map", // 没有列映射(column mapping)的 source map，将 loader source map 简化为每行一个映射(mapping)
  // webpack解析模块时加载的选项
  resolve: {
    // 模块引入时，不写后缀名时自动补全文件扩展名
    extensions: [".vue", ".js", ".json"],
    // 配置路径别名
    alias: {
      "@": path.resolve(__dirname, "../src")
    }
  },
  devServer: {
    host: 'localhost',
    port: 3333,
    open: true,
    hot: true,
    historyApiFallback: true, // 解决vue-router刷新404问题
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        // 将 vue 相关的包单独打包
        vue_chunk: {
          test: /[\\/]node_modules[\\/]vue(.*)?[\\/]/,
          name: "vue-chunk",
          priority: 40, // 优先级
        },
        // 将剩余的node_modules内容单独打包
        rest_node_modules: {
          test: /[\\/]node_modules[\\/]/,
          name: "rest-node_modules",
          priority: 30,
        }
      }
    },
    // 解决代码分隔导致的缓存失效，当只有一个文件资源发生变化，希望只有这一个文件的缓存失效，其他文件的缓存不要受到影响
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
  }
}