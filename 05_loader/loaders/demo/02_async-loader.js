/**
 * 异步loader
 */

module.exports = function (content, map, meta) {
  const callback = this.async();

  setTimeout(() => {
    console.log('这个异步loader异步操作执行完成后，才会进入下一个loader');
    callback(null, content, map, meta);
  }, 1000);
}