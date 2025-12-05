// 防抖和节流函数

//防抖
function debounce(fn, delay:number, immediate = false) {
  let timer = null;
  return function (...args:[any]) {
    if (timer) clearTimeout(timer);
    if (immediate && !timer) {
      fn.apply(this, args);
    }
    timer = setTimeout(() => {
      if (!immediate) {
        fn.apply(this, args);
      }
      timer = null;
    }, delay);
  };
}
// 节流
function throttle(fn, interval:number, leading = true, trailing = true) {
  let lastTime = 0;
  let timer = null;
  return function (...args) {
    const now = Date.now();
    if (!leading && lastTime === 0) {
      lastTime = now;
    }
    const remainingTime = interval - (now - lastTime);
    if (remainingTime <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn.apply(this, args);
      lastTime = now;
    }
    else if (trailing && !timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        lastTime = leading ? Date.now() : 0;
        timer = null;
      }, remainingTime);
    }
  };
}

export {
  debounce,
  throttle
}
