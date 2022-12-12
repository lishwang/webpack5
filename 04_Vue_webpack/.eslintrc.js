module.exports = {
  root: true,
  env: {
    node: true,
  },
  // 继承vue3官方的eslint规则以及eslint官方的规则
  extends: ["plugin:vue/vue3-essential", "eslint:recommended"],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
};