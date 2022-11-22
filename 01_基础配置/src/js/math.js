
// 被使用了，被打包
export function add (a, b) {
  return a + b;
}


// 导出后没有被使用，生产模式下自动配置了Tree Shaking，就不会被打包
export function mul (a, b) {
  return a * b;
}