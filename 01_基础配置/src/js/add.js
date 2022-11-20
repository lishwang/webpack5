export default function addFun (...args) {
  return args.reduce((sum, current) => sum + current, 0);
}