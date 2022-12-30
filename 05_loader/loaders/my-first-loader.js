/**
 * loader就是一个函数；
 * 当webpack解析资源时，会调用相应的loader去处理；
 * loader接收到文件内容作为参数，并将处理后的内容返回出去；
 * loader函数接收三个参数：content、map、meta；
 * content：文件内容；
 * map：跟sourceMap相关；
 * meta：别的loader函数传递的数据；
 */

module.exports = function (content, map, meta) {
  console.log(content);
  return content;
};