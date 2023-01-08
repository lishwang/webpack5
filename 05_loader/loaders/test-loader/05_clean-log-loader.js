
module.exports = function (content) {
  // 用来清除文件内容中的 console.log(xxx);
  return content.replace(/console\.log\(.*\);?/g, '');
}