/**
 * raw loader
 * 注意：raw loader 接收到的 content 是一个 Buffer 数据（二进制数据）
 * 使用场景：处理图片、字体图标数据时采用这种 loader，因为这些数据是Buffer数据；而 js 和 css 文件一般不会使用这种 loader 
 */

/** 写法一：
 * 
 */
// module.exports = function (content) {
/**
 * 1、支持异步操作
 * 2、接收到的 content 是一个 Buffer 数据（二进制数据）
 * */
//   console.log(content); // 二进制数据（Buffer数据）
//   return content;
// }

// module.exports.raw = true;


/** 写法二：
 * 
 */
function rawLoader (content) {
  /**
   * 1、支持异步操作
   * 2、接收到的 content 是一个 Buffer 数据（二进制数据）
   * */
  return content;
}

rawLoader.raw = true;

module.exports = rawLoader;