/**
 * Utilities
 */
export function select(element) {
  if (typeof element === 'string') {
    return document.querySelector(element);
  }
  return element;
}

export function css(element, styles) {
  Object.keys(styles).forEach((key) => {
    element.style[key] = styles[key];
  });
}

export function sync(callback) {
  setTimeout(() => callback(), 1000 / 60);
}

export function callable(func) {
  if (typeof func === 'function') {
    func();
  }
}

export function getAverage(array, length) {
  let sum = 0;
  const elements = array.slice(Math.max(array.length - length, 1));
  elements.forEach((value) => sum = sum + value);
  return Math.ceil(sum / length);
}

export function getArray(length, value) {
  return new Array(length).fill(value);
}

export function debounce(callback, immediate = false) {
  let timeout;
  return function () {
    let later = () => {
      timeout = null;
      if (!immediate) callback(...arguments);
    };
    let callNow = immediate && !timeout;
    timeout = requestAnimationFrame(later);
    if (callNow) callback(...arguments);
  };
}

export function throttle(callback, limit) {
  let wait = false;
  return () => {
    if (!wait) {
      callback.apply(this, arguments);
      wait = true;
      setTimeout(() => {
        wait = false;
      }, limit);
    }
  };
}

export function wrap(el, wrapper) {
  // insert wrapper before el in the DOM tree
  el.parentNode.insertBefore(wrapper, el);

  // move el into wrapper
  wrapper.appendChild(el);
}

export function normalizeNumber(number, min, max) {
  return Math.round(Math.max(Math.min(Number(number), max), min));
}