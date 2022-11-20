import sumFun from './js/sum'
import countFun from './js/count'
import './css/index.css'
import './less/index.less'
import "./sass/index.sass";
import "./sass/index.scss";
import "./styl/index.styl";
import './css/iconfont.css';

console.log(sumFun(1, 2, 3, 4, 5));
countFun(55);

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