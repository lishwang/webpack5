/**
 * schema.json 文件的作用：
 * 1、校验webpack中使用的 banner-loader 的 options 配置的 属性名 以及 属性值，包括属性值的类型；以及属性的个数；如果校验失败会报错；
 */
const schema = require('./schema.json');

module.exports = function (content) {
  // getOptions()方法 获取loader的options配置内容，同时对options内容进行校验；
  // schema是options的校验规则（符合 JSON schema 规则）
  const options = this.getOptions(schema);
  const prefix = `
    /*
    * Author: ${options.author}
    */
  `;
  return `${prefix} \n ${content}`;
}