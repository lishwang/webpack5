import { sum } from './sum';
// import { load } from './afterLoad';

console.log('入口一：main.js');
console.log(sum(1, 2, 3));

document.getElementById('loadBtn').onclick = function () {
  // console.log(load(3, 3)); // 直接触发，打包时直接将结果打包进main中

  // 按需加载
  import('./afterLoad').then(res => {
    console.log('按需加载文件成功');
    console.log(res.load_mul(3, 3));
    console.log(res.load_sub(3, 1));
  }).catch(err => {
    console.log('按需加载文件失败');
  })
}