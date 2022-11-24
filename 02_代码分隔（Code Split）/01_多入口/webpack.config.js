
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  // 单入口
  // entry: './src/main.js',

  // 多入口，有几个入口就一定会有几个及以上的文件输出，至于会不会有多个以上文件的输出，需在optimization中配置splitChunks；
  entry: {
    name_app: './src/app.js',
    name_main: './src/main.js',
  },

  // [name]是webpack命名规则，使用chunk的name作为输出的文件名。
  // 什么是chunk？打包的资源就是chunk，输出出去叫bundle。
  // chunk的name是啥呢？ 比如： entry中xxx: "./src/xxx.js", name就是xxx。注意是前面的xxx，和文件名无关。
  // 为什么需要这样命名呢？如果还是之前写法main.js，那么打包生成两个js文件都会叫做main.js会发生覆盖。(实际上会直接报错的)
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].js", // 取入口中配置的文件名称
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
    })
  ],

  mode: "production",

  optimization: {
    // 代码分割配置
    splitChunks: {
      chunks: "all", // 对所有模块都进行分割，必填配置；如果为单入口，一般情况下只写这一个配置即可满足大部分情况；
      // 以下是默认值
      // minSize: 20000, // 分割代码最小的大小，文件体积小于设定值时不会被分隔单独打包；
      // minRemainingSize: 0, // 类似于minSize，最后确保提取的文件大小不能为0；
      // minChunks: 1, // 被打包输出的文件引用的最少次数，满足条件才会代码分割（这里打包输出的文件只会在多入口时，且这些入口文件中引入某文件的次数大于等于设定值时，会将引入的该文件打包成单独的模块）
      // maxAsyncRequests: 30, // 按需加载时并行加载的文件的最大数量，超过设置的30个文件后就不会再抽取成模块额外打包了，虽然把文件提取出来可以做到每个文件体积都减小，但是请求数量会变多，对服务器压力增大，因此最好设置临界值；
      // maxInitialRequests: 30, // 入口js文件最大并行请求数量；
      // enforceSizeThreshold: 50000, // 超过50kb一定会单独打包（此时会忽略minRemainingSize、maxAsyncRequests、maxInitialRequests）
      // cacheGroups: { // 组，哪些模块要打包到一个组
      //   defaultVendors: { // 组名
      //     test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块，例如 node_modules 会打包到 defaultVendors 这个组中；
      //     priority: -10, // 优先级，权重（越大越高）
      //     reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
      //   },
      //   default: { // 其他没有写的配置会使用上面的默认值
      //     minChunks: 2, // 至少有两个入口文件，且入口文件中至少有两个引用了该文件，才会被打包到 default 这个组中，这里的minChunks权重更大，会覆盖掉上面的默认配置；
      //     priority: -20, // （-20 < -10 因此 default 权重 小于 defaultVendors，打包时会有限匹配defaultVendors的规则）；
      //     reuseExistingChunk: true,
      //   },
      // },

      // 修改配置，以下这个配置组仅为当前文件有用，适配当前文件做代码分隔
      cacheGroups: {
        // 组，哪些模块要打包到一个组
        // defaultVendors: { // 组名
        //   test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
        //   priority: -10, // 权重（越大越高）
        //   reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
        // },
        default: {
          // 其他没有写的配置会使用上面的默认值
          minSize: 0, // 我们定义的文件体积太小了，所以要改打包的最小文件体积
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  }
}