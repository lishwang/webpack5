/**
 * Pitching Loader
 * 注意1：多个 pitching loader 的执行顺序为：
 * 先从左到右执行 loader 链中的每个 loader 上的 pitch 方法（如果有），然后再从右到左执行 loader 链中的每个 loader 上的普通 loader 方法。
 * 例如：同时使用 '04_Pitching-Loader1'、'04_Pitching-Loader2'、'04_Pitching-Loader3' 这三个pitching loader，且这三个loader的pitch方法中没有返回值时，执行顺序如下：
 * 打印结果顺序：'pitch loader 1'、'pitch loader 2'、'pitch loader 3'、'normal loader 3'、'normal loader 2'、'normal loader 1';
 * 
 * 注意2：在这个过程中如果任何 pitch 有返回值，则 loader 链被阻断。webpack 会跳过后面所有的的 pitch 和 loader，直接进入上一个 loader 。
 * 例如：如果在 '04_Pitching-Loader2' 中的pitch方法中return了一个结果，执行顺序如下：
 * 打印结果顺序：'pitch loader 1'、'pitch loader 2'、'normal loader 1';
 */

module.exports = function (content) {
  console.log('normal loader 1');
  return content;
}

module.exports.pitch = function () {
  console.log('pitch loader 1');
}