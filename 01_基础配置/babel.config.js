module.exports = {
  // 预设，智能预设，能够编译 ES6 语法
  "presets": [
    ["@babel/preset-env", {
      // 按需加载core-js的polyfill，彻底解决 js 兼容性问题
      "useBuiltIns": "usage",
      "corejs": {
        "version": "3", // core-js 包的版本
        "proposals": true
      }
    }]
  ]
}