// 手写  file-loader 将文件原封不动输出出去;

/** 在 webpack 中是通过设置 type 属性为 asset/resource 或 asset ，来实现将文件原封不动的输出出去；
 * 例如：
 * {
    test: /\.(ttf|woff2?|mp3|mp4|avi)$/, // 匹配字体图标、音频、视频等不需要额外处理直接原封不动的打包输出的资源文件
    type: "asset/resource", // 将文件原封不动的打包输出
    generator: {
        // 设置打包输出的文件名字以及打包输出的文件所在的目录
        filename: 'static/media/[hash:6][ext][query]'
    },
},
 */
// 本次自己封装一个 file-loader 来实现同样的效果；

const loaderUtils = require('loader-utils');
module.exports = function (content) {
  /**
   * 分为三步实现：
   * 1、根据文件内容生成一个带有hash值的文件名称；
   * 2、把这个带有hash值的文件名输出出去；
   * 3、最后返回：module.exports = '这个文件路径（带有hash值的文件名）'；
   */
  // 1、根据文件内容生成一个带有hash值的文件名称；
  const interpolatedName = loaderUtils.interpolateName(
    this, // 上下文
    '[hash].[ext][query]', // 新生成的文件名称
    { content, } // 文件内容
  );
  // console.log(interpolatedName); // 带有hash值的文件名称
  interpolatedName = `image/${interpolatedName}`; // 修改打包后的文件路径

  // 2、把这个带有hash值的文件名输出出去；
  // emitFile(文件名，文件内容) // 常见的 loader API
  this.emitFile(interpolatedName, content);

  // 3、最后返回：`module.exports = '这个文件路径（带有hash值的文件名）`'
  return `module.exports = ${interpolatedName}`;
}

/**
 * 因为本次封装的loader主要用于处理图片、字体图标或者音频等文件，他们都是 buffer 二进制数据，
 * 因此需要用 raw loader 来实现；
 */
module.exports.raw = true;