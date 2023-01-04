/**
 * 同步loader
 * 注意：同步loader中不能执行异步操作
 */

/** 写法一：
 * 优点：如果文件只需要这一个loader处理，可以直接使用这个方法，比较简洁；
 * loader就是一个函数；
 * 当webpack解析资源时，会调用相应的loader去处理；
 * loader接收到文件内容作为参数，并将处理后的内容返回出去；
 * loader函数接收三个参数：content、map、meta；
 * content：文件内容；
 * map：跟sourceMap相关；
 * meta：别的loader函数传递的数据；
 */

// module.exports = function (content, map, meta) {
//   console.log(content);
//   return content;
// };

/** 写法二：
 * 优点：如果这个loader处理之后还要下一个loader接着处理，可以采用这个方法，它能够保证source-map不中断，而且可以传递其他参数meta给下一个loader
 */
module.exports = function (content, map, meta) {
  console.log('同步loader');
  /**
   * 第一个参数：err，代表是否有错误，可以自己定义错误信息并传递下去；没有错误传递null；
   * 第二个参数：content，代表处理后的内容，必须向下传递；
   * 第三个参数：source-map，如果上面有loader传递进来了source-map参数，也必须传递下去；
   * 第四个参数：meta，给下一个loader传递参数；
   */
  this.callback(null, content, map, meta);
}