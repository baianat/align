/**
 * Utilities
 */
export function select (element) {
  if (typeof element === 'string') {
    return document.querySelector(element);
  }
  return element;
}

export function css (element, styles) {
  Object.keys(styles).forEach((key) => {
    element.style[key] = styles[key];
  });
}

export function sync (callback) {
  setTimeout(() => callback(), 1000 / 60);
}

export function callable (func) {
  if (typeof func === 'function') {
    func();
  }
}

export function getAverage (array, length) {
  let sum = 0;
  const elements = array.slice(Math.max(array.length - length, 1));
  elements.forEach((value) => { sum = sum + value });
  return Math.ceil(sum / length);
}

export function getArray(length, value) {
  return new Array(length).fill(value);
}

/* eslint-disable */
export function debounce (callback, immediate = false) {
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

/* eslint-enable */
export function throttle (callback, limit) {
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

export function wrap (el, wrapper) {
  // insert wrapper before el in the DOM tree
  el.parentNode.insertBefore(wrapper, el);

  // move el into wrapper
  wrapper.appendChild(el);
}

export function normalizeNumber(number, min, max) {
  return Math.round(Math.max(Math.min(Number(number), max), min));
}

export function userOS () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const appVersion = navigator.appVersion;
  if (appVersion.indexOf('Win') !== -1) return 'Win';
  if (appVersion.indexOf('Mac') !== -1) return 'Mac';
  if (appVersion.indexOf('X11') !== -1) return 'UNIX';
  if (appVersion.indexOf('Linux') !== -1) return 'Linux';
  return 'Other';
}

export function generateKeysSymbols () {
  const OS = userOS();
  return {
    cmdKey: OS === 'Mac' ? '⌘' : 'Ctrl',
    shift: OS === 'Mac' ? '⇧' : 'Shift',
    ctrl: OS === 'Mac' ? '⌃' : 'Ctrl',
    alt: OS === 'Mac' ? '⌥' : 'Alt',
    tab: OS === 'Mac' ? '⇥' : 'Tab'
  }
}

export function cloneObject (object) {
  let output = {};
  Object.keys(object).forEach((key) => {
    let tempValue = object[key];
    output[key] = (typeof tempValue === 'object') ? cloneObject(tempValue) : tempValue;
  });
  return output;
}

export function isElementClosest (element, wrapper) {
  while (element !== document && element !== null) {
    if (element === wrapper) return true;
    element = element.parentNode;
  }
  return false;
}

export function camelCase (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function updatePosition (reference, element, align, mode = 'middle-left') {
  if (typeof reference.getBoundingClientRect !== 'function') return;
  const modes = mode.split('-');
  const elmRect = element.getBoundingClientRect();
  const refRect = reference.getBoundingClientRect();
  const alignRect = align.getBoundingClientRect();

  modes.forEach(mode => {
    switch (mode) {
      case 'center':
        element.style.left = `${refRect.left - alignRect.left + (refRect.width / 2)}px`
        break;
      case 'left':
        element.style.left = `${refRect.left - alignRect.left}px`
        break;
      case 'right':
        element.style.left = `${refRect.left - alignRect.left - refRect.width}px`
        break;
      case 'middle':
        element.style.top = `${refRect.top - alignRect.top + (refRect.height / 2)}px`
        break;
      case 'top':
        element.style.top = `${refRect.top - alignRect.top - elmRect.height}px`;
        break;
      case 'bottom':
        element.style.top = `${alignRect.top - refRect.bottom + elmRect.height}px`;
        break;
    }
  })
}

export function launchFullscreen (element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

export function exitFullscreen () {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

export function uploadeImage (input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader(); // eslint-disable-line
  reader.readAsDataURL(file);
  return new Promise(resolve => {
    reader.addEventListener('load', () => {
      resolve(reader.result);
    });
  });
}

export function getYoutubeVideoId (url) {
  let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  let match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  }
  return '';
}