// 引入babel的核心库，调用其中的transform方法对js代码进行编译转换
const babel = require("@babel/core");
// 校验options配置
const schema = require('./schema.json');

module.exports = function (content) {
  // 是一个异步loader
  const callback = this.async();
  // 校验options
  const options = this.getOptions(schema);

  /** 使用babel对代码进行编译
   * content: 需要处理的代码；
   * options: 对代码进行怎样处理；（比如：想把es6+的语法转换成es5语法，就需要用到@babel/preset-env这个预设，配置在webpack文件内；）
   * function(err,result){} : 处理好之后调用的函数；err：表示处理失败的原因；result：表示最终处理的结果；
   * result === { code, map, ast };  code：最终处理后的代码； map：source-map； ast：抽象语法树；
   */
  babel.transform(content, options, function (err, result) {
    if (err) callback(err); // 有错误，传递错误信息；
    else callback(null, result.code); // 没有错误，传递处理后的代码；
  });
}