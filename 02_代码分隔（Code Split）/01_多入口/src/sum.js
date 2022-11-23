export function sum (...args) {
  return args.reduce((current, all) => {
    return current + all;
  }, 0);
}