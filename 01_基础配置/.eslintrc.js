module.exports = {
  // 继承 Eslint 规则
  extends: ["eslint:recommended"], // 继承 Eslint 官方的规则
  // 环境变量
  env: {
    node: true, // 启用node中全局变量
    browser: true, // 启用浏览器中全局变量，比如：window、console等
  },
  parserOptions: {
    ecmaVersion: 6, // 语法环境：ES6
    sourceType: "module", // ES module
  },
  rules: {
    "no-var": 2, // 不能使用 var 定义变量，否则报错误级别的错误，2 等同于 error
  },
  plugins: ["import"], // 解决eslint不识别 import 函数动态导入的语法的报错；
};