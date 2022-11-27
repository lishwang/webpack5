import sumFun from './js/sum'
import countFun from './js/count'
import { add } from './js/math'
import './css/index.css'
import './less/index.less'
import "./sass/index.sass";
import "./sass/index.scss";
import "./styl/index.styl";
import './css/iconfont.css';

console.log(sumFun(1, 2, 3, 4, 5));
countFun(55);
console.log(add(1, 1));

// 判断是否支持HMR功能
// 各个文件模块的监听的回调不会相互影响；哪一个模块发生变化，就执行哪一个回调；
if (module.hot) {
  // 回调函数可以不写，也会只更新这个count.js文件模块
  module.hot.accept("./js/count.js", function () {
    // count.js 文件修改后，要执行的回调函数
    console.log('count.js文件热替换');
  });
  // 回调函数可以不写，也会只更新这个sum.js文件模块
  module.hot.accept("./js/sum.js", function () {
    console.log('sum.js文件热替换');
  });
}

// import函数 按需加载
document.getElementById('after_load').onclick = function () {
  // eslint不能识别 import 函数的动态导入语法，需要在 .eslintrc.js 中做额外配置
  // 给按需加载的after_load.js文件命名为after_load
  // webpackChunkName: "after_load"：这是webpack动态导入模块命名的方式
  // "after_load"将来就会作为下面chunkFilename的属性值[name]的值显示。
  import(/* webpackChunkName: "after_load" */ './js/after_load').then(({ mul, del }) => {
    console.log(mul(3, 5));
    console.log(del(5, 3));
  })
}


// 添加promise代码，测试Core-js 彻底解决 js 兼容性问题
const promise = Promise.resolve();
promise.then(() => {
  console.log("hello promise");
});