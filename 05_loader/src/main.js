alert('main')
console.log('自己写一个简单loader')
console.log('111')
console.log('222')
alert('main')

const sum = (...args) => {
  return args.reduce((p, c) => p + c, 0);
}