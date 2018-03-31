(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Align = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/**
 * Utilities
 */
function select(element) {
  if (typeof element === 'string') {
    return document.querySelector(element);
  }
  return element;
}











/* eslint-disable */
function debounce(callback) {
  var immediate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var timeout = void 0;
  return function () {
    var _arguments = arguments;

    var later = function later() {
      timeout = null;
      if (!immediate) callback.apply(undefined, _arguments);
    };
    var callNow = immediate && !timeout;
    timeout = requestAnimationFrame(later);
    if (callNow) callback.apply(undefined, arguments);
  };
}

/* eslint-enable */




function normalizeNumber(number, min, max) {
  return Math.round(Math.max(Math.min(Number(number), max), min));
}

function userOS() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  var appVersion = navigator.appVersion;
  if (appVersion.indexOf('Win') !== -1) return 'Win';
  if (appVersion.indexOf('Mac') !== -1) return 'Mac';
  if (appVersion.indexOf('X11') !== -1) return 'UNIX';
  if (appVersion.indexOf('Linux') !== -1) return 'Linux';
  return 'Other';
}

function generateKeysSymbols() {
  var OS = userOS();
  return {
    cmdKey: OS === 'Mac' ? '⌘' : 'Ctrl',
    shift: OS === 'Mac' ? '⇧' : 'Shift',
    ctrl: OS === 'Mac' ? '⌃' : 'Ctrl',
    alt: OS === 'Mac' ? '⌥' : 'Alt',
    tab: OS === 'Mac' ? '⇥' : 'Tab'
  };
}

function cloneObject(object) {
  var output = {};
  Object.keys(object).forEach(function (key) {
    var tempValue = object[key];
    output[key] = (typeof tempValue === 'undefined' ? 'undefined' : _typeof(tempValue)) === 'object' ? cloneObject(tempValue) : tempValue;
  });
  return output;
}

function isElementClosest(element, wrapper) {
  while (element !== document && element !== null) {
    if (element === wrapper) return true;
    element = element.parentNode;
  }
  return false;
}

function camelCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function updatePosition(reference, element, align) {
  var mode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'middle-left';

  if (typeof reference.getBoundingClientRect !== 'function') return;
  var modes = mode.split('-');
  var elmRect = element.getBoundingClientRect();
  var refRect = reference.getBoundingClientRect();
  var alignRect = align.getBoundingClientRect();
  var positon = { left: 0, top: 0 };

  modes.forEach(function (mode) {
    switch (mode) {
      case 'center':
        positon.left = refRect.left - alignRect.left + refRect.width / 2;
        break;
      case 'left':
        positon.left = refRect.left - alignRect.left;
        break;
      case 'right':
        positon.left = refRect.left - alignRect.left - refRect.width;
        break;
      case 'middle':
        positon.top = refRect.top - alignRect.top + refRect.height / 2;
        break;
      case 'top':
        positon.top = refRect.top - alignRect.top - elmRect.height;
        break;
      case 'bottom':
        positon.top = alignRect.top - refRect.bottom + elmRect.height;
        break;
    }
  });
  element.style.left = positon.left + 'px';
  element.style.top = positon.top + 'px';
  return positon;
}

function launchFullscreen(element) {
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

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}



function getVideoId(url, hoster) {
  var regExp = hoster === 'youtube' ? /(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/ : hoster === 'vimeo' ? /vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/ : null;

  if (!regExp) return;
  var match = url.match(regExp);
  return match[1];
}

function stringToDOM(string) {
  return document.createRange().createContextualFragment(string).firstElementChild;
}

function swapArrayItems(array, index1, index2) {
  var temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
  return array;
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var colorpicker = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
    module.exports = factory();
  })(commonjsGlobal, function () {
    'use strict';

    var commonjsGlobal$$1 = typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule$$1(fn, module) {
      return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var slider$1 = createCommonjsModule$$1(function (module, exports) {
      (function (global, factory) {
        module.exports = factory();
      })(commonjsGlobal$$1, function () {
        'use strict';

        /**
         * Utilities
         */

        function select(element) {
          if (typeof element === 'string') {
            return document.querySelector(element);
          }
          return element;
        }

        function getNumber(number1, number2) {
          return number1 ? parseInt(number1, 10) : parseInt(number2, 10);
        }

        function wrap(el, wrapper) {
          // insert wrapper before el in the DOM tree
          el.parentNode.insertBefore(wrapper, el);

          // move el into wrapper
          wrapper.appendChild(el);
        }

        /**
         * Converts an array-like object to an array.
         */

        /**
         * Slider class
         */
        var Slider = function Slider(selector, ref) {
          if (ref === void 0) {
            ref = {};
          }
          var gradient = ref.gradient;if (gradient === void 0) {
            gradient = null;
          }
          var classes = ref.classes;if (classes === void 0) {
            classes = null;
          }
          var colorCode = ref.colorCode;if (colorCode === void 0) {
            colorCode = false;
          }
          var editable = ref.editable;if (editable === void 0) {
            editable = false;
          }
          var reverse = ref.reverse;if (reverse === void 0) {
            reverse = false;
          }
          var label = ref.label;if (label === void 0) {
            label = true;
          }
          var min = ref.min;if (min === void 0) {
            min = 0;
          }
          var max = ref.max;if (max === void 0) {
            max = 10;
          }
          var step = ref.step;if (step === void 0) {
            step = 1;
          }
          var value = ref.value;if (value === void 0) {
            value = 0;
          }

          this.el = select(selector);
          this.settings = {
            gradient: gradient,
            classes: classes,
            colorCode: colorCode,
            editable: editable,
            reverse: reverse,
            label: label,
            min: min,
            max: max,
            step: step,
            value: value
          };
          this.init();
        };

        /**
         * create new rang slider element
         * @param {String|HTMLElement} selector
         * @param {Object}           settings
         */
        Slider.create = function create(selector, settings) {
          Slider(selector, settings);
        };

        Slider.prototype.init = function init() {
          this.initElements();

          this.min = getNumber(this.el.min, this.settings.min);
          this.max = getNumber(this.el.max, this.settings.max);
          this.step = getNumber(this.el.step, this.settings.step);
          this.callbacks = {};

          if (this.settings.gradient) {
            this.initGradient();
          }

          this.updateWidth();
          this.update(getNumber(this.el.value, this.settings.value));
          this.initEvents();
        };

        Slider.prototype.initElements = function initElements() {
          this.wrapper = document.createElement('div');
          this.track = document.createElement('div');
          this.handle = document.createElement('div');
          this.fill = document.createElement('div');

          this.wrapper.classList.add('slider');
          if (this.settings.editable) {
            this.wrapper.classList.add('is-editable');
          }
          if (this.settings.reverse) {
            this.wrapper.classList.add('is-reverse');
          }
          if (this.settings.classes) {
            this.wrapper.classList.add(this.settings.classes);
          }
          this.track.classList.add('slider-track');
          this.handle.classList.add('slider-handle');
          this.fill.classList.add('slider-fill');
          this.el.classList.add('slider-input');

          wrap(this.el, this.wrapper);
          this.track.appendChild(this.fill);
          this.track.appendChild(this.handle);
          this.wrapper.appendChild(this.track);
          if (this.settings.label) {
            this.label = document.createElement('div');
            this.label.classList.add('slider-label');
            this.handle.appendChild(this.label);
          }
        };

        Slider.prototype.initGradient = function initGradient() {
          if (this.settings.gradient.length > 1) {
            this.track.style.backgroundImage = "linear-gradient(90deg, " + this.settings.gradient + ")";
            this.gradient = this.settings.gradient;
            this.colorCode = this.settings.colorCode;
            return;
          }
          this.track.style.backgroundImage = 'none';
          this.track.style.backgroundColor = this.settings.gradient[0];
          this.handle.style.backgroundColor = this.settings.gradient[0];
          this.gradient = null;
        };

        Slider.prototype.initEvents = function initEvents() {
          var this$1 = this;

          this.track.addEventListener('mousedown', this.select.bind(this), false);
          this.track.addEventListener('touchstart', this.select.bind(this), false);
          if (this.settings.editable && !this.settings.colorCode) {
            this.el.addEventListener('change', function (evt) {
              this$1.update(this$1.el.value);
            }, false);
          }
        };

        /**
         * fire select events
         */
        Slider.prototype.select = function select$$1(event) {
          event.preventDefault();
          this.updateWidth();
          this.click(event);
          this.callbacks.tempDrag = this.dragging.bind(this);
          this.callbacks.tempRelease = this.release.bind(this);
          document.addEventListener('mousemove', this.callbacks.tempDrag, false);
          document.addEventListener('touchmove', this.callbacks.tempDrag, false);
          document.addEventListener('touchend', this.callbacks.tempRelease, false);
          document.addEventListener('mouseup', this.callbacks.tempRelease, false);
        };

        /**
         * dragging motion
         */
        Slider.prototype.dragging = function dragging(event) {
          event.preventDefault();
          // get drag change value
          var eventX = event.type === 'mousemove' ? event.clientX : event.touches[0].clientX;
          var mouseValue = eventX - this.currentX;

          // check ifleft mouse is clicked
          if (event.buttons !== 1 && event.type === 'mousemove') {
            return;
          }
          this.track.classList.add('is-dragging');
          var stepCount = parseInt(mouseValue / this.stepWidth + 0.5, 10);
          var stepValue = parseInt((stepCount + this.min) / this.step, 10) * this.step;
          if (stepValue !== this.currentValue) {
            this.update(stepValue);
          }
        };

        /**
         * release handler
         */
        Slider.prototype.release = function release() {
          this.track.classList.remove('is-dragging');
          document.removeEventListener('mousemove', this.callbacks.tempDrag);
          document.removeEventListener('touchmove', this.callbacks.tempDrag);
          document.removeEventListener('mouseup', this.callbacks.tempRelease);
          document.removeEventListener('touchend', this.callbacks.tempRelease);
        };

        Slider.prototype.click = function click(event) {
          event.preventDefault();
          var eventX = event.type === 'mousedown' ? event.clientX : event.touches[0].clientX;
          var mouseValue = eventX - this.currentX;

          // check ifleft mouse is clicked
          if (event.buttons !== 1 && event.type === 'mousemove') {
            return;
          }
          var stepCount = parseInt(mouseValue / this.stepWidth + 0.5, 10);
          var stepValue = parseInt((stepCount + this.min) / this.step, 10) * this.step;
          if (stepValue !== this.currentValue) {
            this.update(stepValue);
          }
        };

        Slider.prototype.updateWidth = function updateWidth() {
          this.currentX = this.track.getBoundingClientRect().left;
          this.width = this.track.clientWidth;
          this.stepWidth = this.width / (this.max - this.min);
        };

        /**
         * get the filled area percentage
         * @param{Object} slider
         * @param{Number} value
         * @return {Number}
         */
        Slider.prototype.getFillPercentage = function getFillPercentage(value) {
          return (value - this.min) * 100 / (this.max - this.min);
        };

        Slider.prototype.normalizeValue = function normalizeValue(value) {
          if (value >= this.max) {
            return this.max;
          }
          if (value <= this.min) {
            return this.min;
          }
          if (isNaN(Number(value))) {
            return this.value;
          }
          return Number(value);
        };

        Slider.prototype.newGradient = function newGradient(newGradient$1) {
          this.settings.gradient = newGradient$1;
          this.initGradient();
          this.update(undefined, true);
        };

        /**
         * get the handle color
         * @param{Number} fillPercentage
         * @return {Number}              handle hex color code
         */
        Slider.prototype.getHandleColor = function getHandleColor(fillPercentage) {
          var this$1 = this;

          var colorCount = this.gradient.length - 1;
          var region = fillPercentage / 100;
          for (var i = 1; i <= colorCount; i++) {
            // check the current zone
            if (region >= (i - 1) / colorCount && region <= i / colorCount) {
              // get the active color percentage
              var colorPercentage = (region - (i - 1) / colorCount) / (1 / colorCount);
              // return the mixed color based on the zone boundary colors
              return Slider.mixColors(this$1.gradient[i - 1], this$1.gradient[i], colorPercentage);
            }
          }
          return '#000000';
        };

        /**
         * update the slider fill, value and color
         * @param {Number} value
         */
        Slider.prototype.update = function update(value, mute) {
          if (mute === void 0) {
            mute = false;
          }

          if (Number(value) === this.value) {
            return;
          }
          var normalized = this.normalizeValue(value);

          var fillPercentage = this.getFillPercentage(normalized);

          this.handle.style.left = fillPercentage + "%";
          this.fill.style.left = fillPercentage + "%";

          this.value = normalized;
          this.el.value = this.value;
          if (this.settings.label) {
            this.label.innerHTML = this.value;
          }
          if (this.gradient) {
            var color = this.getHandleColor(fillPercentage);
            this.handle.style.backgroundColor = color;
            if (this.settings.colorCode) {
              this.el.value = color;
              this.label.innerHTML = color;
            }
          }
          if (mute) {
            return;
          }
          this.el.dispatchEvent(new Event('change'));
          this.el.dispatchEvent(new Event('input'));
        };

        /**
         * private functions
         */
        Slider.hexAverage = function hexAverage(color1, color2, ratio) {
          if (ratio === void 0) {
            ratio = 0.5;
          }

          var average = parseInt(color1, 16) * (1 - ratio) + parseInt(color2, 16) * ratio;
          return ("00" + Math.floor(average + 0.5).toString(16)).slice(-2);
        };

        Slider.mixColors = function mixColors(color1, color2, ratio) {
          color1 = color1.replace('#', '');
          color2 = color2.replace('#', '');
          var red = Slider.hexAverage(color1.slice(0, -4), color2.slice(0, -4), ratio);
          var green = Slider.hexAverage(color1.slice(2, -2), color2.slice(2, -2), ratio);
          var blue = Slider.hexAverage(color1.slice(-2), color2.slice(-2), ratio);
          return "#" + (red + green + blue).toUpperCase();
        };

        return Slider;
      });
    });

    function polyfill() {
      if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
      }

      if (!Element.prototype.closest) {
        Element.prototype.closest = function (s) {
          var el = this;
          if (!document.documentElement.contains(el)) {
            return null;
          }
          do {
            if (el.matches(s)) {
              return el;
            }
            el = el.parentElement;
          } while (el !== null);
          return null;
        };
      }
    }

    /**
     * Utilities
     */
    function select(element) {
      if (typeof element === 'string') {
        return document.querySelector(element);
      }
      return element;
    }

    function call(func) {
      if (typeof func === 'function') {
        func();
      }
    }

    function getArray(length, value) {
      var array = [];
      for (var i = 0; i < length; i++) {
        var temp = typeof value === 'function' ? value() : value;
        array.push(temp);
      }
      return array;
    }

    /**
     * Converts an array-like object to an array.
     */

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function isElementClosest(element, wrapper) {
      while (element !== document && element !== null) {
        if (element === wrapper) {
          return true;
        }
        element = element.parentNode;
      }
      return false;
    }

    function normalizeColorValue(value) {
      if (value > 255) {
        return 255;
      }
      if (value < 0) {
        return 0;
      }
      return value;
    }

    function getHexValue(value) {
      if (isNaN(Number(value))) {
        return '00';
      }
      return ('0' + Number(value).toString(16)).slice(-2);
    }

    function getDecimalValue(value) {
      if (isNaN(parseInt(value, 16))) {
        return '0';
      }
      return parseInt(value, 16);
    }

    function getRandomColor() {
      return "rgb(" + getRandomInt(0, 255) + ", " + getRandomInt(0, 255) + ", " + getRandomInt(0, 255) + ")";
    }

    function rgb2hex(rgb) {
      rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
      return rgb && rgb.length === 4 ? '#' + ('0' + parseInt(normalizeColorValue(rgb[1]), 10).toString(16)).slice(-2) + ('0' + parseInt(normalizeColorValue(rgb[2]), 10).toString(16)).slice(-2) + ('0' + parseInt(normalizeColorValue(rgb[3]), 10).toString(16)).slice(-2) : '';
    }

    function rgb2hsl(rgb) {
      rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
      if (!rgb || rgb.length !== 4) {
        return;
      }

      // Convert the RGB values to the range 0-1
      var red = rgb[1] / 255;
      var green = rgb[2] / 255;
      var blue = rgb[3] / 255;
      var Hue = 0;
      var Sat = 0;
      var Lum = 0;

      //Find the minimum and maximum values of R, G and B.
      var min = Math.min(red, green, blue);
      var max = Math.max(red, green, blue);

      //Calculate the Luminace value
      Lum = (min + max) / 2;

      //Calculate the Saturation.
      if (min !== max) {
        Sat = Lum > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
      }

      //calculate the Hue
      if (red >= max && min !== max) {
        Hue = 60 * ((green - blue) / (max - min));
      }
      if (green >= max && min !== max) {
        Hue = 60 * (2.0 + (blue - red) / (max - min));
      }
      if (blue >= max && min !== max) {
        Hue = 60 * (4.0 + (red - green) / (max - min));
      }

      // normalize values 
      Hue = Hue < 0 ? parseInt(Hue + 360) : parseInt(Hue);
      Sat = parseInt(Sat * 100);
      Lum = parseInt(Lum * 100);

      return "hsl(" + Hue + ", " + Sat + "%, " + Lum + "%)";
    }

    function getCartesianCoords(r, θ) {
      return { x: r * Math.cos(θ * Math.PI * 2), y: r * Math.sin(θ * Math.PI * 2) };
    }

    var Colorpicker = function Colorpicker(selector, ref) {
      if (ref === void 0) ref = {};
      var defaultColor = ref.defaultColor;if (defaultColor === void 0) defaultColor = getRandomColor();
      var radius = ref.radius;if (radius === void 0) radius = 200;
      var mode = ref.mode;if (mode === void 0) mode = 'rgb';
      var events = ref.events;if (events === void 0) events = {};
      var recentColors = ref.recentColors;if (recentColors === void 0) recentColors = getArray(6, getRandomColor);
      var disableLum = ref.disableLum;if (disableLum === void 0) disableLum = false;
      var guideIcon = ref.guideIcon;if (guideIcon === void 0) guideIcon = "<svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"12\"/></svg>";
      this.el = select(selector);
      this.options = {
        defaultColor: defaultColor,
        radius: radius,
        mode: mode,
        events: events,
        recentColors: recentColors,
        disableLum: disableLum,
        guideIcon: guideIcon
      };
      this.init();
    };

    Colorpicker.prototype.init = function init() {
      this.recentColors = this.options.recentColors;
      this.lastMove = { x: 0, y: 0 };
      this.isMenuActive = false;
      polyfill();
      this._initElements();
      this._initWheel();
      this._initEvents();
      this.selectColor(this.options.defaultColor, true);
    };

    Colorpicker.prototype._initElements = function _initElements() {
      var this$1 = this;

      // create elements and config them
      this.picker = document.createElement('div');
      this.picker.insertAdjacentHTML('afterbegin', "\n      <button class=\"picker-guide\">\n        " + this.options.guideIcon + "\n      </button>\n      <div class=\"picker-menu is-hidden\" tabindex=\"-1\">\n        <div class=\"picker-wheel\">\n          <canvas class=\"picker-canvas\"></canvas>\n          <div class=\"picker-cursor\"></div>\n        </div>\n        " + (this.options.disableLum ? '' : '<input class="picker-saturation" type="number" min="0" max="100" value="100">') + "\n        <input id=\"red\" type=\"number\" min=\"0\" max=\"255\" value=\"0\">\n        <input id=\"green\" type=\"number\" min=\"0\" max=\"255\" value=\"0\">\n        <input id=\"blue\" type=\"number\" min=\"0\" max=\"255\" value=\"0\">\n        <div class=\"picker-input\">\n          <button class=\"picker-submit\">\n            <svg class=\"icon\" viewBox=\"0 0 24 24\">\n              <path d=\"M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z\"/>\n            </svg>\n          </button>\n        </div>\n        <div class=\"picker-recent\"></div>\n      </div>\n    ");

      this.menu = this.picker.querySelector('.picker-menu');
      this.recent = this.picker.querySelector('.picker-recent');
      this.guide = this.picker.querySelector('.picker-guide');
      this.canvas = this.picker.querySelector('.picker-canvas');
      this.wheel = this.picker.querySelector('.picker-wheel');
      this.submit = this.picker.querySelector('.picker-submit');
      this.cursor = this.picker.querySelector('.picker-cursor');
      this.saturation = this.picker.querySelector('.picker-saturation');
      this.rgbSliders = {
        red: this.picker.querySelector('#red'),
        green: this.picker.querySelector('#green'),
        blue: this.picker.querySelector('#blue')
      };

      this.el.parentNode.insertBefore(this.picker, this.el);
      this.el.classList.add('picker-value');
      this.picker.classList.add('picker');
      this.submit.parentNode.insertBefore(this.el, this.submit);
      this.guide.style.color = this.options.defaultColor;
      this.guide.style.fill = this.options.defaultColor;

      this.sliders = {};
      if (!this.options.disableLum) {
        this.sliders.saturation = new slider$1(this.saturation, {
          gradient: ['#FFFFFF', '#000000'],
          label: false
        });
      }
      Object.keys(this.rgbSliders).forEach(function (key) {
        this$1.sliders[key] = new slider$1(this$1.rgbSliders[key], {
          gradient: ['#000000', '#FFFFFF'],
          label: false,
          editable: true,
          reverse: true
        });
      });

      this.recentColors.forEach(function (color) {
        var recentColor = document.createElement('a');
        recentColor.classList.add('picker-color');
        recentColor.style.backgroundColor = color;
        this$1.recent.appendChild(recentColor);
        recentColor.addEventListener('mousedown', function (event) {
          return event.preventDefault();
        });
        recentColor.addEventListener('click', function (event) {
          return this$1.selectColor(color);
        });
      });
    };

    Colorpicker.prototype._initWheel = function _initWheel() {
      // setup canvas
      this.canvas.width = this.options.radius;
      this.canvas.height = this.options.radius;
      this.context = this.canvas.getContext('2d');

      // draw wheel circle path
      this.circle = {
        path: new Path2D(),
        xCords: this.canvas.width / 2,
        yCords: this.canvas.height / 2,
        radius: this.canvas.width / 2
      };
      this.circle.path.moveTo(this.circle.xCords, this.circle.yCords);
      this.circle.path.arc(this.circle.xCords, this.circle.yCords, this.circle.radius, 0, 360);
      this.circle.path.closePath();
      this.updateWheelColors();
    };

    Colorpicker.prototype._initEvents = function _initEvents() {
      var this$1 = this;

      this.events = [new Event('input'), new Event('change')];

      this.guide.addEventListener('click', function () {
        call(this$1.options.events.beforerOpen);
        this$1.togglePicker();
      });

      this.menu.addEventListener('mousedown', function (event) {
        if (event.target !== this$1.menu || event.button !== 0) {
          return;
        }
        var startPosition = {};
        var endPosition = {};
        var delta = {};

        event.preventDefault();
        startPosition.x = event.clientX;
        startPosition.y = event.clientY;

        var mousemoveHandler = function mousemoveHandler(evnt) {
          endPosition.x = evnt.clientX;
          endPosition.y = evnt.clientY;
          delta.x = this$1.lastMove.x + endPosition.x - startPosition.x;
          delta.y = this$1.lastMove.y + endPosition.y - startPosition.y;
          this$1.menu.style.transform = "translate(" + delta.x + "px, " + delta.y + "px)";
        };
        var mouseupHandler = function mouseupHandler() {
          this$1.lastMove = delta;
          document.removeEventListener('mousemove', mousemoveHandler);
          document.removeEventListener('mouseup', mouseupHandler);
        };
        document.addEventListener('mousemove', mousemoveHandler);
        document.addEventListener('mouseup', mouseupHandler);
      });

      this.wheel.addEventListener('mousedown', function (event) {
        event.preventDefault();
        var updateColor = function updateColor(evnt) {
          // check if mouse outside the wheel
          var mouse = this$1.getMouseCords(evnt);
          if (this$1.context.isPointInPath(this$1.circle.path, mouse.x, mouse.y)) {
            var color = this$1.getColorFromWheel(mouse);
            this$1.selectColor(color, false, mouse);

            return color;
          }
          return this$1.el.value;
        };
        var mouseupHandler = function mouseupHandler(evnt) {
          var color = updateColor(evnt);
          if (color !== this$1.el.value) {
            this$1.updateRecentColors(color);
            this$1.selectColor(color, false, this$1.mouse);
          }
          document.removeEventListener('mousemove', updateColor);
          document.removeEventListener('mouseup', mouseupHandler);
        };
        document.addEventListener('mousemove', updateColor);
        document.addEventListener('mouseup', mouseupHandler);
      });

      if (!this.options.disableLum) {
        this.saturation.addEventListener('change', function () {
          this$1.updateWheelColors();
        });
      }

      Object.keys(this.rgbSliders).forEach(function (key) {
        this$1.rgbSliders[key].addEventListener('change', function (event) {
          var color = this$1.getColorFromSliders();
          this$1.selectColor(color);
        });
      });

      this.el.addEventListener('focus', function (event) {
        var edit = function edit() {
          this$1.selectColor(this$1.el.value, true);
        };
        var release = function release() {
          this$1.el.removeEventListener('change', edit);
          this$1.el.removeEventListener('blur', release);
        };
        this$1.el.addEventListener('change', edit);
        this$1.el.addEventListener('blur', release);
      });

      this.submit.addEventListener('click', function (event) {
        call(this$1.options.events.beforeSubmit);
        this$1.selectColor(this$1.el.value);
        this$1.closePicker();
        call(this$1.options.events.afterSubmit);
      });
    };

    Colorpicker.prototype.updateWheelColors = function updateWheelColors() {
      var this$1 = this;

      var x = this.circle.xCords;
      var y = this.circle.yCords;
      var radius = this.circle.radius;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (var angle = 0; angle < 360; angle += 1) {
        var gradient = this$1.context.createRadialGradient(x, y, 0, x, y, radius);
        var startAngle = (angle - 2) * Math.PI / 180;
        var endAngle = (angle + 2) * Math.PI / 180;

        this$1.context.beginPath();
        this$1.context.moveTo(x, y);
        this$1.context.arc(x, y, radius, startAngle, endAngle);
        this$1.context.closePath();
        gradient.addColorStop(0, "hsl(" + angle + ", " + (this$1.options.disableLum ? 100 : this$1.saturation.value) + "%, 100%)");
        gradient.addColorStop(0.5, "hsl(" + angle + ", " + (this$1.options.disableLum ? 100 : this$1.saturation.value) + "%, 50%)");
        gradient.addColorStop(1, "hsl(" + angle + ", " + (this$1.options.disableLum ? 100 : this$1.saturation.value) + "%, 0%)");
        this$1.context.fillStyle = gradient;
        this$1.context.fill();
      }
    };

    Colorpicker.prototype.updateRecentColors = function updateRecentColors(newColor) {
      var this$1 = this;

      // update recent color array
      if (this.recentColors.length >= 6) {
        this.recentColors.shift();
      }
      if (newColor) {
        this.recentColors.push(newColor);
      }

      // update recent colors buttons
      if (this.recent.childNodes.length >= 6) {
        this.recent.removeChild(this.recent.firstChild);
      }
      var recentColor = document.createElement('a');
      recentColor.classList.add('picker-color');
      recentColor.style.backgroundColor = newColor;
      this.recent.appendChild(recentColor);
      recentColor.addEventListener('click', function (event) {
        event.preventDefault();
        this$1.selectColor(newColor);
      });
    };

    Colorpicker.prototype.updateSlidersInputs = function updateSlidersInputs(slider) {
      var red = getHexValue(this.rgbSliders.red.value);
      var green = getHexValue(this.rgbSliders.green.value);
      var blue = getHexValue(this.rgbSliders.blue.value);
      this.sliders.red.newGradient(["#00" + green + blue, "#ff" + green + blue]);
      this.sliders.green.newGradient(["#" + red + "00" + blue, "#" + red + "ff" + blue]);
      this.sliders.blue.newGradient(["#" + red + green + "00", "#" + red + green + "ff"]);
    };

    Colorpicker.prototype.updateCursor = function updateCursor(mouse) {
      var rgbColor = this.getColorFromSliders();
      var hexColor = rgb2hex(rgbColor);
      var hslColor = rgb2hsl(rgbColor);
      var hsl = hslColor.match(/^hsl?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)\%[\s+]?,[\s+]?(\d+)\%[\s+]?/i);
      var r = (100 - hsl[3]) * (this.options.radius / 200);
      var coords = getCartesianCoords(r, hsl[1] / 360);
      var ratio = this.options.radius / 2;
      if (!this.options.disableLum) {
        this.sliders.saturation.update(hsl[2]);
        this.sliders.saturation.newGradient(['#FFFFFF', hexColor]);
      }
      this.cursor.style.backgroundColor = hslColor;
      if (mouse) {
        this.cursor.style.transform = "translate(" + mouse.x + "px, " + mouse.y + "px)";
        return;
      }
      this.cursor.style.transform = "translate(" + (coords.x + ratio) + "px, " + (coords.y + ratio) + "px)";
    };

    Colorpicker.prototype.selectColor = function selectColor(color, mute, mouse) {
      var this$1 = this;
      if (mute === void 0) mute = false;

      if (color.slice(0, 1) !== '#' && color.slice(0, 3).toUpperCase() !== 'RGB' && color.slice(0, 3).toUpperCase() !== 'HSL') {
        return;
      }
      call(this.options.events.beforeSelect);
      var hexColor = color.slice(0, 1) === '#' ? color : rgb2hex(color);
      var hslColor = rgb2hsl(color);
      this.el.value = this.options.mode === 'hex' ? hexColor : this.options.mode === 'hsl' ? hslColor : color;
      this.guide.style.color = color;
      this.guide.style.fill = color;
      this.sliders.red.update(getDecimalValue(hexColor.slice(1, 3)), true);
      this.sliders.green.update(getDecimalValue(hexColor.slice(3, 5)), true);
      this.sliders.blue.update(getDecimalValue(hexColor.slice(5, 7)), true);
      this.updateSlidersInputs();
      this.updateCursor(mouse);
      call(this.options.events.afterSelect);
      if (mute) {
        return;
      }
      this.events.forEach(function (event) {
        return this$1.el.dispatchEvent(event);
      });
    };

    Colorpicker.prototype.getColorFromSliders = function getColorFromSliders() {
      var red = this.rgbSliders.red.value;
      var green = this.rgbSliders.green.value;
      var blue = this.rgbSliders.blue.value;
      return "rgb(" + red + ", " + green + ", " + blue + ")";
    };

    Colorpicker.prototype.getColorFromWheel = function getColorFromWheel(mouse) {
      var imageData = this.context.getImageData(mouse.x, mouse.y, 1, 1).data;
      return "rgb(" + imageData[0] + ", " + imageData[1] + ", " + imageData[2] + ")";
    };

    Colorpicker.prototype.getMouseCords = function getMouseCords(evnt) {
      var rect = this.canvas.getBoundingClientRect();
      var mouse = {
        x: evnt.clientX - rect.left,
        y: evnt.clientY - rect.top
      };
      this.mouse = mouse;
      return mouse;
    };

    Colorpicker.prototype.togglePicker = function togglePicker() {

      if (this.isMenuActive) {
        this.closePicker();
        return;
      }
      this.openPiker();
    };

    Colorpicker.prototype.closePicker = function closePicker() {
      this.menu.classList.add('is-hidden');
      this.isMenuActive = false;
      document.removeEventListener('click', this.documentCallback);
    };

    Colorpicker.prototype.openPiker = function openPiker() {
      var this$1 = this;

      this.menu.classList.remove('is-hidden');
      this.isMenuActive = true;
      var documentCallback = function documentCallback(evnt) {
        if (!isElementClosest(evnt.target, this$1.menu) && !isElementClosest(evnt.target, this$1.guide)) {
          this$1.closePicker();
          return;
        }
        call(this$1.options.events.clicked);
      };
      this.documentCallback = documentCallback.bind(this);
      document.addEventListener('click', this.documentCallback);
      call(this.options.events.afterOpen);
    };

    return Colorpicker;
  });
});

var CURRENT_SELECTION = null;
var TEXT_RANGE = null;
var RANGE = null;

var Selection = function () {
  function Selection() {
    classCallCheck(this, Selection);
  }

  createClass(Selection, null, [{
    key: "selectTextRange",
    value: function selectTextRange() {
      var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Selection.textRange;

      if (!range) return;
      var sel = Selection.current = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, {
    key: "selectElement",
    value: function selectElement(el) {
      if (!el) return;
      var range = document.createRange();
      range.selectNodeContents(el);
      var sel = Selection.current = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, {
    key: "updateSelectedRange",
    value: function updateSelectedRange() {
      var sel = Selection.current = window.getSelection();
      if (sel.rangeCount && sel.anchorNode.nodeType === 3) {
        Selection.textRange = sel.getRangeAt(0);
      }
      if (sel.rangeCount) {
        Selection.range = sel.getRangeAt(0);
      }
    }
  }, {
    key: "textRange",
    set: function set$$1(range) {
      if (!range) return;
      TEXT_RANGE = range;
    },
    get: function get$$1() {
      return TEXT_RANGE;
    }
  }, {
    key: "range",
    set: function set$$1(range) {
      if (!range) return;
      RANGE = range;
    },
    get: function get$$1() {
      return RANGE;
    }
  }, {
    key: "current",
    set: function set$$1(selection) {
      CURRENT_SELECTION = selection;
    },
    get: function get$$1() {
      return CURRENT_SELECTION;
    }
  }]);
  return Selection;
}();

var Prompt = function () {
  function Prompt() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$wrapper = _ref.wrapper,
        wrapper = _ref$wrapper === undefined ? document.body : _ref$wrapper,
        _ref$position = _ref.position,
        position = _ref$position === undefined ? { left: 0, top: 0 } : _ref$position,
        _ref$inputsCount = _ref.inputsCount,
        inputsCount = _ref$inputsCount === undefined ? 1 : _ref$inputsCount,
        _ref$inputsPlaceholde = _ref.inputsPlaceholders,
        inputsPlaceholders = _ref$inputsPlaceholde === undefined ? [] : _ref$inputsPlaceholde;

    classCallCheck(this, Prompt);

    this.settings = {
      wrapper: wrapper,
      position: position,
      inputsCount: inputsCount,
      inputsPlaceholders: inputsPlaceholders
    };
    this._init(message, data);
  }

  createClass(Prompt, [{
    key: '_init',
    value: function _init(message, data) {
      var _this = this;

      var position = this.settings.position;
      this.el = document.createElement('div');
      this.message = document.createElement('label');
      this.submit = document.createElement('button');
      this.inputs = [];

      this.el.classList.add('prompt');
      this.message.classList.add('prompt-message');
      this.submit.classList.add('prompt-submit');

      if (position) {
        this.el.style.left = position.left + 'px';
        this.el.style.top = position.top + 'px';
      }
      if (!position) {
        if (myEditor.sel.range.startContainer.nodeType === 3) {
          this.selectionRefrance = Selection.range;
        }
        if (myEditor.sel.range.startContainer.nodeType === 1) {
          this.selectionRefrance = Selection.current.anchorNode;
        }
        updatePosition(this.selectionRefrance, this.el, this.settings.wrapper, 'left-middle');
      }
      this.message.innerText = message;
      this.submit.innerText = 'Submit';

      this.el.appendChild(this.message);
      for (var i = 0; i < this.settings.inputsCount; i++) {
        this.inputs[i] = document.createElement('input');
        this.inputs[i].classList.add('prompt-input');
        if (this.settings.inputsPlaceholders[i]) {
          this.inputs[i].placeholder = this.settings.inputsPlaceholders[i];
        }
        this.el.appendChild(this.inputs[i]);
      }

      this.inputs[0].value = data;
      this.el.appendChild(this.submit);

      this.settings.wrapper.appendChild(this.el);
      setTimeout(function () {
        document.addEventListener('click', function (event) {
          if (isElementClosest(event.target, _this.el)) return;
          _this.remove();
        });
      }, 16);
    }
  }, {
    key: 'onSubmit',
    value: function onSubmit(func, args) {
      var _this2 = this;

      this.submit.addEventListener('click', function () {
        return func.call(_this2, args);
      });
      this.submit.addEventListener('click', function () {
        return setTimeout(_this2.remove.bind(_this2), 16);
      });
      return this;
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.el.remove();
    }
  }]);
  return Prompt;
}();

var symbols = generateKeysSymbols();

var cmdsSchema = {
  bold: {
    element: 'button',
    command: 'bold',
    tooltip: 'Bold (' + symbols.cmdKey + ' B)'
  },

  italic: {
    element: 'button',
    command: 'italic',
    tooltip: 'Italic (' + symbols.cmdKey + ' I)'
  },

  underline: {
    element: 'button',
    command: 'underline',
    tooltip: 'Underline (' + symbols.cmdKey + ' U)'
  },

  strikeThrough: {
    element: 'button',
    command: 'strikeThrough',
    tooltip: 'Strike through'
  },

  undo: {
    element: 'button',
    command: 'undo',
    tooltip: 'Undo (' + symbols.cmdKey + ' Z)'
  },

  redo: {
    element: 'button',
    command: 'redo',
    tooltip: 'Redo (' + symbols.cmdKey + ' ' + symbols.shift + ' Z)'
  },

  removeFormat: {
    element: 'button',
    command: 'removeFormat',
    tooltip: 'Remove format (' + symbols.cmdKey + ' \\)'
  },

  justifyLeft: {
    element: 'button',
    command: 'justifyLeft',
    tooltip: 'Align left (' + symbols.cmdKey + ' L)'
  },

  justifyCenter: {
    element: 'button',
    command: 'justifyCenter',
    tooltip: 'Align center (' + symbols.cmdKey + ' E)'
  },

  justifyRight: {
    element: 'button',
    command: 'justifyRight',
    tooltip: 'Align right (' + symbols.cmdKey + ' R)'
  },

  selectContent: {
    element: 'button',
    tooltip: 'Select all content (' + symbols.cmdKey + ' ' + symbols.shift + ' A)',
    func: function func(styler) {
      Selection.selectElement(styler.$align.editor);
    }
  },

  justifyFull: {
    element: 'button',
    command: 'justifyFull',
    tooltip: 'Justify full (' + symbols.cmdKey + ' J)'
  },

  createLink: {
    element: 'button',
    tooltip: 'Hyperlink',
    func: function func(styler) {
      new Prompt('Enter link:', Selection.current.toString(), {
        wrapper: styler.$align.el,
        position: Selection.textRange.getBoundingClientRect()
      }).onSubmit(function () {
        var link = this.input.value;
        if (!link) return;
        Selection.selectTextRange();
        styler.$align.execute('createLink', link);
      }, [styler]);
    }
  },

  h1: {
    element: 'button',
    command: 'formatblock',
    value: 'h1',
    tooltip: 'Heading 1'
  },

  h2: {
    element: 'button',
    command: 'formatblock',
    value: 'h2',
    tooltip: 'Heading 2'
  },

  h3: {
    element: 'button',
    command: 'formatblock',
    value: 'h3',
    tooltip: 'Heading 3'
  },

  h4: {
    element: 'button',
    command: 'formatblock',
    value: 'h4',
    tooltip: 'Heading 4'
  },

  blockquote: {
    element: 'button',
    command: 'formatblock',
    value: 'blockquote',
    tooltip: 'Quote'
  },

  p: {
    element: 'button',
    command: 'formatblock',
    value: 'p',
    tooltip: 'Paragraph'
  },

  orderedList: {
    element: 'button',
    command: 'insertOrderedList',
    tooltip: 'Ordered list'
  },

  unorderedList: {
    element: 'button',
    command: 'insertUnorderedList',
    tooltip: 'Unordered list'
  },

  insertLine: {
    element: 'button',
    command: 'insertHorizontalRule',
    useCSS: true,
    tooltip: 'Insert line'
  },

  indent: {
    element: 'button',
    command: 'indent',
    useCSS: true,
    tooltip: 'Indent (' + symbols.tab + ')'
  },

  outdent: {
    element: 'button',
    command: 'outdent',
    useCSS: true,
    tooltip: 'Outdent (' + symbols.shift + ' ' + symbols.tab + ')'
  },

  superscript: {
    element: 'button',
    command: 'superscript',
    tooltip: 'Superscript (' + symbols.cmdKey + ' ' + symbols.shift + ' =)'
  },

  subscript: {
    element: 'button',
    command: 'subscript',
    tooltip: 'Subscript (' + symbols.cmdKey + ' =)'
  },

  pre: {
    element: 'button',
    command: 'formatblock',
    value: 'pre',
    func: 'highlight',
    tooltip: 'Script'
  },

  fontSize: {
    element: 'select',
    command: 'fontSize'
  },

  fontName: {
    element: 'select',
    init: 'applyFont',
    command: 'fontName',
    useCSS: true
  },

  separator: {
    element: 'styling',
    class: 'styler-separator'
  },

  fullscreen: {
    element: 'button',
    func: 'toggleFullScreen',
    tooltip: 'Fullscreen (' + symbols.cmdKey + ' ' + symbols.shift + ' F)'
  },

  color: {
    element: 'input',
    type: 'text',
    command: 'foreColor',
    tooltip: 'Font color',
    useCSS: true,
    init: colorpicker,
    initConfig: {
      defaultColor: '#000000',
      mode: 'hex',
      disableLum: true,
      guideIcon: '\n        <svg viewBox="0 0 24 24">\n          <path d="M0 20h24v4H0z"/>\n          <path style="fill: currentColor" d="M11 3L5.5 17h2.25l1.12-3h6.25l1.12 3h2.25L13 3h-2zm-1.38 9L12 5.67 14.38 12H9.62z"/>\n        </svg>\n      ',
      events: {
        beforeSubmit: function beforeSubmit() {
          Selection.selectTextRange();
        },
        afterOpen: function afterOpen() {
          Selection.updateSelectedRange();
        },
        afterSelect: function afterSelect() {
          Selection.updateSelectedRange();
        }
      }
    }
  },

  backColor: {
    element: 'input',
    type: 'text',
    command: 'backColor',
    tooltip: 'Hightlight color',
    useCSS: true,
    init: colorpicker,
    initConfig: {
      defaultColor: '#fdfdfd',
      mode: 'hex',
      disableLum: true,
      guideIcon: '\n        <svg viewBox="0 0 24 24">\n          <path style="fill: currentColor" d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z"/>\n          <path d="M0 20h24v4H0z"/>\n        </svg>\n      ',
      events: {
        beforeSubmit: function beforeSubmit() {
          Selection.selectTextRange();
        },
        afterOpen: function afterOpen() {
          Selection.updateSelectedRange();
        },
        afterSelect: function afterSelect() {
          Selection.updateSelectedRange();
        }
      }
    }
  },

  // internal functions don't use it

  _figureClasses: {
    element: 'classes',
    command: 'figure'
  },

  _sectionClasses: {
    element: 'classes',
    command: 'section'
  },

  _sectionToggleHTML: {
    element: 'button',
    func: 'toggleHTML',
    tooltip: 'Edit as HTMl'
  },

  _remove: {
    element: 'button',
    func: 'remove',
    tooltip: 'Remove section'
  },

  _sectionUp: {
    element: 'button',
    func: 'moveUp',
    tooltip: 'Move section up'
  },

  _sectionDown: {
    element: 'button',
    func: 'moveDown',
    tooltip: 'Move section down'
  },

  _sectionImage: {
    element: 'file',
    func: 'backgroundImage',
    tooltip: 'Add background image'
  },

  _sectionVideo: {
    element: 'file',
    func: 'backgroundVideo',
    tooltip: 'Add background video'
  },

  _sectionColor: {
    element: 'input',
    type: 'text',
    func: 'backgroundColor',
    tooltip: 'Change background color',
    init: colorpicker,
    initConfig: {
      defaultColor: '#000000',
      mode: 'hex',
      disableLum: true,
      guideIcon: '\n        <svg viewBox="0 0 24 24">\n          <path d="M0 20h24v4H0z"/>\n          <path style="fill: #fff" d="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z"/>\n        </svg>\n      '
    }
  },

  _tableRowTop: {
    element: 'button',
    func: 'insertRow',
    args: ['before']
  },
  _tableRowBottom: {
    element: 'button',
    func: 'insertRow',
    args: ['after']
  },
  _tableColumnBefore: {
    element: 'button',
    func: 'insertColumn',
    args: ['before']
  },
  _tableColumnAfter: {
    element: 'button',
    func: 'insertColumn',
    args: ['after']
  },
  _tableDeleteRow: {
    element: 'button',
    func: 'deleteRow'
  },
  _tableDeleteColumn: {
    element: 'button',
    func: 'deleteColumn'
  }
};

function icons(name) {
  return '\n    <svg class="icon" viewBox="0 0 24 24">\n      <path d="' + iconsPath[name] + '"/>\n    </svg>';
}

var iconsPath = {
  blockquote: 'M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z',

  bold: 'M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z',

  fontSize: 'M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z',

  h1: 'M3,4H5V10H9V4H11V18H9V12H5V18H3V4M14,18V16H16V6.31L13.5,7.75V5.44L16,4H18V16H20V18H14Z',

  h2: 'M3,4H5V10H9V4H11V18H9V12H5V18H3V4M21,18H15A2,2 0 0,1 13,16C13,15.47 13.2,15 13.54,14.64L18.41,9.41C18.78,9.05 19,8.55 19,8A2,2 0 0,0 17,6A2,2 0 0,0 15,8H13A4,4 0 0,1 17,4A4,4 0 0,1 21,8C21,9.1 20.55,10.1 19.83,10.83L15,16H21V18Z',

  h3: 'M3,4H5V10H9V4H11V18H9V12H5V18H3V4M15,4H19A2,2 0 0,1 21,6V16A2,2 0 0,1 19,18H15A2,2 0 0,1 13,16V15H15V16H19V12H15V10H19V6H15V7H13V6A2,2 0 0,1 15,4Z',

  h4: 'M3,4H5V10H9V4H11V18H9V12H5V18H3V4M18,18V13H13V11L18,4H20V11H21V13H20V18H18M18,11V7.42L15.45,11H18Z',

  html: 'M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z',

  image: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',

  italic: 'M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z',

  justifyCenter: 'M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z',

  justifyFull: 'M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z',

  justifyLeft: 'M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z',

  justifyRight: 'M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z',

  p: 'M13,4A4,4 0 0,1 17,8A4,4 0 0,1 13,12H11V18H9V4H13M13,10A2,2 0 0,0 15,8A2,2 0 0,0 13,6H11V10H13Z',

  pre: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',

  removeFormat: 'M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM14 5h-3l-1-1H6L5 5H2v2h12z',

  strikeThrough: 'M7.24 8.75c-.26-.48-.39-1.03-.39-1.67 0-.61.13-1.16.4-1.67.26-.5.63-.93 1.11-1.29.48-.35 1.05-.63 1.7-.83.66-.19 1.39-.29 2.18-.29.81 0 1.54.11 2.21.34.66.22 1.23.54 1.69.94.47.4.83.88 1.08 1.43.25.55.38 1.15.38 1.81h-3.01c0-.31-.05-.59-.15-.85-.09-.27-.24-.49-.44-.68-.2-.19-.45-.33-.75-.44-.3-.1-.66-.16-1.06-.16-.39 0-.74.04-1.03.13-.29.09-.53.21-.72.36-.19.16-.34.34-.44.55-.1.21-.15.43-.15.66 0 .48.25.88.74 1.21.38.25.77.48 1.41.7H7.39c-.05-.08-.11-.17-.15-.25zM21 12v-2H3v2h9.62c.18.07.4.14.55.2.37.17.66.34.87.51.21.17.35.36.43.57.07.2.11.43.11.69 0 .23-.05.45-.14.66-.09.2-.23.38-.42.53-.19.15-.42.26-.71.35-.29.08-.63.13-1.01.13-.43 0-.83-.04-1.18-.13s-.66-.23-.91-.42c-.25-.19-.45-.44-.59-.75-.14-.31-.25-.76-.25-1.21H6.4c0 .55.08 1.13.24 1.58.16.45.37.85.65 1.21.28.35.6.66.98.92.37.26.78.48 1.22.65.44.17.9.3 1.38.39.48.08.96.13 1.44.13.8 0 1.53-.09 2.18-.28s1.21-.45 1.67-.79c.46-.34.82-.77 1.07-1.27s.38-1.07.38-1.71c0-.6-.1-1.14-.31-1.61-.05-.11-.11-.23-.17-.33H21z',

  text: 'M5 17v2h14v-2H5zm4.5-4.2h5l.9 2.2h2.1L12.75 4h-1.5L6.5 15h2.1l.9-2.2zM12 5.98L13.87 11h-3.74L12 5.98z',

  underline: 'M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z',

  insertColumn: 'M13 12h7v1.5h-7zm0-2.5h7V11h-7zm0 5h7V16h-7zM21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 15h-9V6h9v13z',

  unorderedList: 'M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z',

  orderedList: 'M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z',

  indent: 'M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z',

  outdent: 'M11 17h10v-2H11v2zm-8-5l4 4V8l-4 4zm0 9h18v-2H3v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z',

  superscript: 'M16 18.6L14.6 20 9 14.4 3.4 20 2 18.6 7.6 13 2 7.4 3.4 6 9 11.6 14.6 6 16 7.4 10.4 13l5.6 5.6zm2.3-14.2c0-.2.1-.4.1-.6.1-.2.2-.3.3-.4.1-.1.3-.2.4-.3.2-.1.4-.1.5-.1.2 0 .3 0 .4.1.1.1.3.1.3.2.1.1.2.2.2.4.1.1.1.3.1.5s-.1.4-.2.6c-.1.2-.2.3-.4.5-.2.1-.4.3-.6.4-.2.1-.5.3-.7.4-.2.1-.5.3-.7.4s-.2.3-.4.5-.3.3-.4.5c-.1.2-.2.4-.2.7V9h5V8h-3.8c.1-.2.3-.4.5-.6.3-.2.6-.4.8-.6s.6-.4.9-.5c.3-.2.6-.4.8-.6s.4-.5.6-.7c.1-.3.2-.6.2-.9 0-.3 0-.5-.1-.8s-.2-.5-.4-.7c-.2-.2-.4-.3-.7-.5-.4 0-.7-.1-1.2-.1-.4 0-.7.1-1 .2s-.6.3-.8.5c-.2.2-.4.5-.5.8-.2.2-.3.5-.3.9h1.3z',

  subscript: 'M16 16.6L14.6 18 9 12.4 3.4 18 2 16.6 7.6 11 2 5.4 3.4 4 9 9.6 14.6 4 16 5.4 10.4 11l5.6 5.6zm2.3.8c0-.2.1-.4.1-.6.1-.2.2-.3.3-.4.1-.1.3-.2.4-.3s.3-.1.5-.1.3 0 .4.1c.1.1.3.1.3.2.1.1.2.2.2.4s.1.3.1.5-.1.4-.2.6c-.1.2-.2.3-.4.5-.2.1-.4.3-.6.4-.2.1-.5.3-.7.4-.2.1-.5.3-.7.4s-.4.3-.6.5c-.2.2-.3.3-.4.5-.1.2-.2.4-.2.6v.9h5v-1H18c.1-.2.3-.4.5-.6.2-.2.5-.4.8-.5s.6-.4.9-.5c.3-.2.6-.4.8-.6s.4-.5.6-.7c.2-.3.2-.6.2-.9 0-.3 0-.5-.1-.8s-.2-.5-.4-.7c-.2-.2-.4-.3-.7-.5-.3-.1-.7-.2-1.1-.2-.4 0-.7.1-1 .2-.3.1-.6.3-.8.5-.2.2-.4.5-.5.8-.1.3-.2.6-.3 1h1.4z',

  createLink: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',

  selectContent: 'M19.51 3.08L3.08 19.51c.09.34.27.65.51.9.25.24.56.42.9.51L20.93 4.49c-.19-.69-.73-1.23-1.42-1.41zM11.88 3L3 11.88v2.83L14.71 3h-2.83zM5 3c-1.1 0-2 .9-2 2v2l4-4H5zm14 18c.55 0 1.05-.22 1.41-.59.37-.36.59-.86.59-1.41v-2l-4 4h2zm-9.71 0h2.83L21 12.12V9.29L9.29 21z',

  insertLine: 'M4 19h6v-2H4v2zM20 5H4v2h16V5zm-3 6H4v2h13.25c1.1 0 2 .9 2 2s-.9 2-2 2H15v-2l-3 3 3 3v-2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4z',

  undo: 'M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z',

  redo: 'M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z',

  plus: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',

  figure: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',

  figureFloatRight: 'M15,7H21V13H15V7M3,3H21V5H3V3M13,7V9H3V7H13M9,11V13H3V11H9M3,15H17V17H3V15M3,19H21V21H3V19Z',

  figureCenter: 'M9,7H15V13H9V7M3,3H21V5H3V3M3,15H21V17H3V15M3,19H17V21H3V19Z',

  figureFloatLeft: 'M3,7H9V13H3V7M3,3H21V5H3V3M21,7V9H11V7H21M21,11V13H11V11H21M3,15H17V17H3V15M3,19H21V21H3V19Z',

  figureFull: 'M23 18V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zM8.5 12.5l2.5 3.01L14.5 11l4.5 6H5l3.5-4.5z',

  table: 'M5,4H19A2,2 0 0,1 21,6V18A2,2 0 0,1 19,20H5A2,2 0 0,1 3,18V6A2,2 0 0,1 5,4M5,8V12H11V8H5M13,8V12H19V8H13M5,14V18H11V14H5M13,14V18H19V14H13Z',

  sectionNormal: 'M12.5,19.5V3.47H14.53V19.5H12.5M9.5,19.5V3.47H11.53V19.5H9.5M4.5,7.5L8.53,11.5L4.5,15.47V12.47H1.5V10.5H4.5V7.5M19.5,15.47L15.5,11.5L19.5,7.5V10.5H22.5V12.47H19.5V15.47Z',

  sectionFull: 'M9,11H15V8L19,12L15,16V13H9V16L5,12L9,8V11M2,20V4H4V20H2M20,20V4H22V20H20Z',

  section: 'M2 21h19v-3H2v3zM20 8H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zM2 3v3h19V3H2z',

  fullscreen: 'M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z',

  video: 'M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z',

  delete: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z',

  facebook: 'M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M18,5H15.5A3.5,3.5 0 0,0 12,8.5V11H10V14H12V21H15V14H18V11H15V9A1,1 0 0,1 16,8H18V5Z',

  twitter: '"M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M17.71,9.33C18.19,8.93 18.75,8.45 19,7.92C18.59,8.13 18.1,8.26 17.56,8.33C18.06,7.97 18.47,7.5 18.68,6.86C18.16,7.14 17.63,7.38 16.97,7.5C15.42,5.63 11.71,7.15 12.37,9.95C9.76,9.79 8.17,8.61 6.85,7.16C6.1,8.38 6.75,10.23 7.64,10.74C7.18,10.71 6.83,10.57 6.5,10.41C6.54,11.95 7.39,12.69 8.58,13.09C8.22,13.16 7.82,13.18 7.44,13.12C7.81,14.19 8.58,14.86 9.9,15C9,15.76 7.34,16.29 6,16.08C7.15,16.81 8.46,17.39 10.28,17.31C14.69,17.11 17.64,13.95 17.71,9.33Z',

  embed: 'M12.89,3L14.85,3.4L11.11,21L9.15,20.6L12.89,3M19.59,12L16,8.41V5.58L22.42,12L16,18.41V15.58L19.59,12M1.58,12L8,5.58V8.41L4.41,12L8,15.58V18.41L1.58,12',

  _tableRowTop: 'M22,14A2,2 0 0,0 20,12H4A2,2 0 0,0 2,14V21H4V19H8V21H10V19H14V21H16V19H20V21H22V14M4,14H8V17H4V14M10,14H14V17H10V14M20,14V17H16V14H20M11,10H13V7H16V5H13V2H11V5H8V7H11V10Z',

  _tableRowBottom: 'M22,10A2,2 0 0,1 20,12H4A2,2 0 0,1 2,10V3H4V5H8V3H10V5H14V3H16V5H20V3H22V10M4,10H8V7H4V10M10,10H14V7H10V10M20,10V7H16V10H20M11,14H13V17H16V19H13V22H11V19H8V17H11V14Z',

  _tableColumnBefore: 'M13,2A2,2 0 0,0 11,4V20A2,2 0 0,0 13,22H22V2H13M20,10V14H13V10H20M20,16V20H13V16H20M20,4V8H13V4H20M9,11H6V8H4V11H1V13H4V16H6V13H9V11Z',

  _tableColumnAfter: 'M11,2A2,2 0 0,1 13,4V20A2,2 0 0,1 11,22H2V2H11M4,10V14H11V10H4M4,16V20H11V16H4M4,4V8H11V4H4M15,11H18V8H20V11H23V13H20V16H18V13H15V11Z',

  _tableDeleteColumn: 'M4,2H11A2,2 0 0,1 13,4V20A2,2 0 0,1 11,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2M4,10V14H11V10H4M4,16V20H11V16H4M4,4V8H11V4H4M17.59,12L15,9.41L16.41,8L19,10.59L21.59,8L23,9.41L20.41,12L23,14.59L21.59,16L19,13.41L16.41,16L15,14.59L17.59,12Z',

  _tableDeleteRow: 'M9.41,13L12,15.59L14.59,13L16,14.41L13.41,17L16,19.59L14.59,21L12,18.41L9.41,21L8,19.59L10.59,17L8,14.41L9.41,13M22,9A2,2 0 0,1 20,11H4A2,2 0 0,1 2,9V6A2,2 0 0,1 4,4H20A2,2 0 0,1 22,6V9M4,9H8V6H4V9M10,9H14V6H10V9M16,9H20V6H16V9Z',

  _remove: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z',

  _sectionUp: 'M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z',

  _sectionDown: 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z',

  _sectionImage: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',

  _sectionVideo: 'M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z',

  _sectionToggleHTML: 'M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z'
};

var NAMING_PREFIX = '';

function setElementsPrefix(prefix) {
  NAMING_PREFIX = prefix;
}
/**
  * Create button HTML element
  * @param {String} name
  */
function button(name, tooltip) {
  var button = document.createElement('button');
  button.classList.add(NAMING_PREFIX + 'button');
  button.id = name;
  if (tooltip) {
    button.dataset.tooltip = tooltip;
  }
  button.insertAdjacentHTML('afterbegin', icons(name));
  return button;
}

/**
 * Create select options HTML element
 * @param {String} name
 * @param {Object} options
 */
function select$1(name, options) {
  var selectWrapper = document.createElement('div');
  var select = document.createElement('select');
  var icon = '\n    <svg viewBox="0 0 24 24">\n      <polygon points="8,15 12,19 16,15 "/>\n      <polygon points="8,9 12,5 16,9 "/>\n    </svg>';

  selectWrapper.classList.add(NAMING_PREFIX + 'select');
  select.id = name;
  options.forEach(function (option) {
    var optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.innerText = option === false ? name : option;
    select.appendChild(optionElement);
  });
  selectWrapper.appendChild(select);
  selectWrapper.insertAdjacentHTML('beforeend', icon);
  return selectWrapper;
}

/**
 * Create input HTML element
 * @param {String} name
 * @param {String} type
 */
function input(name, type) {
  var input = document.createElement('input');
  input.classList.add('' + NAMING_PREFIX + name);
  input.id = name;
  input.type = type;
  return input;
}

/**
 * Create input HTML element
 * @param {String} name
 * @param {String} type
 */
function fileButton(name, tooltip) {
  var wrapper = document.createElement('div');
  var input = document.createElement('input');

  if (tooltip) {
    wrapper.dataset.tooltip = tooltip;
  }
  wrapper.classList.add(NAMING_PREFIX + 'button');
  wrapper.id = name;
  wrapper.appendChild(input);
  wrapper.insertAdjacentHTML('afterbegin', icons(name));
  input.classList.add(NAMING_PREFIX + 'input');
  input.id = name;
  input.type = 'file';
  return { input: input, el: wrapper };
}

function menuButton(name, func, tooltip) {
  var menuItem = document.createElement('li');
  var currentButton = button(name, tooltip);
  currentButton.addEventListener('click', func);
  menuItem.appendChild(currentButton);
  return menuItem;
}

var Styler = function () {
  function Styler(align) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$mode = _ref.mode,
        mode = _ref$mode === undefined ? 'toolbar' : _ref$mode,
        _ref$commands = _ref.commands,
        commands = _ref$commands === undefined ? ['bold', 'italic', 'underline'] : _ref$commands,
        _ref$hideWhenClickOut = _ref.hideWhenClickOut,
        hideWhenClickOut = _ref$hideWhenClickOut === undefined ? false : _ref$hideWhenClickOut,
        _ref$tooltip = _ref.tooltip,
        tooltip = _ref$tooltip === undefined ? false : _ref$tooltip,
        _ref$theme = _ref.theme,
        theme = _ref$theme === undefined ? 'light' : _ref$theme;

    classCallCheck(this, Styler);

    this.$align = align;
    this.settings = {
      mode: mode,
      commands: commands,
      hideWhenClickOut: hideWhenClickOut,
      tooltip: tooltip,
      theme: theme
    };
    this._init();
  }

  /**
   * Create the styler toolbar
   */


  createClass(Styler, [{
    key: '_init',
    value: function _init() {
      var _this = this;

      setElementsPrefix('styler-');
      this.cmdsSchema = cloneObject(cmdsSchema);
      this.el = document.createElement('ul');
      this.el.classList.add('styler', 'is-' + this.settings.mode, 'is-' + this.settings.theme);
      this.cmds = {};
      this.visiable = false;

      this.settings.commands.forEach(function (command) {
        _this.generateCmdElement(command);
      });
      this.$align.el.appendChild(this.el);
      if (this.settings.mode === 'bubble') this._initBubble();
    }
  }, {
    key: '_initBubble',
    value: function _initBubble() {
      this.el.classList.add('is-hidden');
      this.bubbleScrollCallback = debounce(this.updateBubblePosition.bind(this));
    }
  }, {
    key: 'generateCmdElement',
    value: function generateCmdElement(command) {
      var _this2 = this;

      var li = document.createElement('li');
      var cmd = typeof command === 'string' ? command : Object.keys(command)[0];
      var cmdSchema = this.cmdsSchema[cmd];
      if (!cmdSchema) {
        console.warn(cmd + ' is not found');
        return;
      }

      var currentCmd = this.cmds[cmd] = { schema: cmdSchema };

      switch (cmdSchema.element) {
        case 'button':
          currentCmd.el = button(cmd, this.getTooltip(cmdSchema));
          currentCmd.el.addEventListener('click', function () {
            return _this2.cmdCallback(cmdSchema, cmdSchema.value);
          });
          li.appendChild(currentCmd.el);
          break;

        case 'classes':
          currentCmd.el = document.createElement('ul');
          command[cmd].forEach(function (className) {
            var li = menuButton('' + cmdSchema.command + camelCase(className), function () {
              _this2.toggleClass('is-' + className, command[cmd]);
            }, camelCase(cmdSchema.command) + ' ' + className);
            currentCmd.el.appendChild(li);
          });
          li.appendChild(currentCmd.el);
          break;

        case 'file':
          var fileBtn = fileButton(cmd, this.getTooltip(cmdSchema));
          currentCmd.el = fileBtn.input;
          currentCmd.el.addEventListener('change', function (event) {
            _this2.cmdCallback(cmdSchema, event);
          });
          li.appendChild(fileBtn.el);
          break;

        case 'select':
          var selectWrapper = select$1(cmd, command[cmd]);
          var temp = currentCmd.el = selectWrapper.querySelector('select');
          temp.addEventListener('change', function () {
            return _this2.cmdCallback(cmdSchema, temp[temp.selectedIndex].value);
          });
          li.appendChild(selectWrapper);
          break;

        case 'input':
          currentCmd.el = input(cmd, cmdSchema.type, this.getTooltip(cmdSchema));
          currentCmd.el.addEventListener('change', function () {
            _this2.cmdCallback(cmdSchema, currentCmd.el.value);
          });
          li.appendChild(currentCmd.el);
          break;

        case 'styling':
          li.classList.add(cmdSchema.class);
          break;

        case 'custom':
          var markup = cmdSchema.create(this);
          li.appendChild(markup);
          break;

        default:
          console.warn(cmd + ' element not found');
      }

      if (typeof cmdSchema.init === 'function') {
        cmdSchema.init = new cmdSchema.init(currentCmd.el, cmdSchema.initConfig); // eslint-disable-line
      }

      if (typeof cmdSchema.init === 'string') {
        this.$align[cmdSchema.init](cmdSchema, command);
        cmdSchema.init = null;
      }

      this.el.appendChild(li);
    }
  }, {
    key: 'cmdCallback',
    value: function cmdCallback(cmdSchema, value) {
      if (cmdSchema.command) {
        this.execute(cmdSchema.command, value, cmdSchema.useCSS);
      }
      if (typeof cmdSchema.func === 'string') {
        var callback = this.$align[cmdSchema.func] || this.currentItem[cmdSchema.func].bind(this.currentItem);
        callback(this, value || cmdSchema);
      }
      if (typeof cmdSchema.func === 'function') {
        cmdSchema.func(this, value || cmdSchema);
      }
      if (this.settings.mode === 'bubble') {
        this.updateBubblePosition();
      }
    }

    /**
     * Execute command for the selected button
     * @param {String} cmd
     * @param {String|Number} value
     */

  }, {
    key: 'execute',
    value: function execute(cmd, value) {
      var _$align;

      (_$align = this.$align).execute.apply(_$align, arguments);
    }
  }, {
    key: 'updateBubblePosition',
    value: function updateBubblePosition() {
      if (!Selection.textRange && !this.currentItem) return;
      var marginRatio = 10;
      var threshold = 70;
      var element = this.currentItem ? this.currentItem.el : Selection.textRange;
      var elementRect = element.getBoundingClientRect();
      var editorRect = this.$align.el.getBoundingClientRect();
      var stylerRect = this.el.getBoundingClientRect();

      var deltaY = elementRect.top - stylerRect.height - marginRatio;
      var deltaX = elementRect.left + (elementRect.width - stylerRect.width) / 2;
      var startBoundary = editorRect.left;
      var endBoundary = editorRect.left + editorRect.width - stylerRect.width;
      var xPosition = normalizeNumber(deltaX, startBoundary, endBoundary);
      var yPosition = deltaY < threshold ? elementRect.top + elementRect.height + marginRatio : deltaY;

      if (yPosition < threshold) {
        this.el.style.opacity = 0;
        return;
      }
      this.el.style.opacity = 1;
      this.el.style.top = yPosition + 'px';
      this.el.style.left = xPosition + 'px';
    }
  }, {
    key: 'show',
    value: function show(item) {
      var _this3 = this;

      if (this.currentItem) {
        this.currentItem.el.classList.remove('is-active');
      }
      if (item) {
        this.currentItem = item;
        this.currentContent = item.contentDiv;
        this.currentItem.el.classList.add('is-active');
      }
      if (this.settings.mode === 'bubble') {
        this.updateBubblePosition();
      }
      if (this.visiable) return;
      this.visiable = true;
      this.el.classList.add('is-visible');
      this.el.classList.remove('is-hidden');
      if (this.settings.mode === 'bubble') {
        window.addEventListener('scroll', this.bubbleScrollCallback);
      }
      if (this.settings.hideWhenClickOut) {
        document.addEventListener('click', function (event) {
          if (isElementClosest(event.target, _this3.currentItem.el) || isElementClosest(event.target, _this3.el)) return;
          _this3.hide();
        });
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (this.currentItem) {
        this.currentItem.el.classList.remove('is-active');
      }
      this.el.classList.remove('is-visible');
      this.el.classList.add('is-hidden');
      this.visiable = false;
      if (this.settings.mode === 'bubble') {
        window.removeEventListener('scroll', this.bubbleScrollCallback);
      }
      if (this.settings.hideWhenClickOut) {
        document.removeEventListener('click', this.clickCallback);
      }
    }
  }, {
    key: 'update',
    value: function update() {
      this.updateCommandsStates();
      if (this.settings.mode !== 'bubble' || !Selection.textRange) return;
      if (Selection.textRange.collapsed || Selection.range.collapsed) {
        this.hide();
        return;
      }
      this.show();
    }
  }, {
    key: 'getTooltip',
    value: function getTooltip(schema) {
      if (!schema.tooltip || !this.settings.tooltip) {
        return false;
      }
      return this.$align.settings.shortcuts ? schema.tooltip : schema.tooltip.replace(/(\([^)]+\))/g, '');
    }

    /**
     * Update the state of the active style
     */

  }, {
    key: 'updateCommandsStates',
    value: function updateCommandsStates() {
      var _this4 = this;

      Object.keys(this.cmds).forEach(function (cmd) {
        var currentCmd = _this4.cmds[cmd];
        var command = currentCmd.schema.command;
        var value = currentCmd.schema.value;
        var init = currentCmd.schema.init;
        if (!command) {
          return;
        }
        if (document.queryCommandState(command)) {
          currentCmd.el.classList.add('is-active');
          return;
        }
        if (document.queryCommandValue(command) === value) {
          currentCmd.el.classList.add('is-active');
          return;
        }
        if (init) {
          if (Selection.range === Selection.textRange) {
            init.selectColor(document.queryCommandValue(command), true);
          }
          return;
        }
        if (document.queryCommandValue(command)) {
          currentCmd.el.value = document.queryCommandValue(command);
        }
        currentCmd.el.classList.remove('is-active');
      });
    }
  }, {
    key: 'toggleClass',
    value: function toggleClass(currentClass, allClasses) {
      var _currentItem$el$class;

      if (!this.currentItem) return;
      var prefixedClasses = allClasses.map(function (cls) {
        return 'is-' + cls;
      });
      (_currentItem$el$class = this.currentItem.el.classList).remove.apply(_currentItem$el$class, toConsumableArray(prefixedClasses));
      this.currentItem.el.classList.toggle(currentClass);
      if (this.settings.mode === 'bubble') {
        this.updateBubblePosition();
      }
    }
  }]);
  return Styler;
}();

var Table = function () {
  function Table(table) {
    classCallCheck(this, Table);

    if (!table) return;
    this._init(table);
    this._initEvents();
    this.activeCell = this.el.rows[0].cells[0];
  }

  createClass(Table, [{
    key: '_init',
    value: function _init(table) {
      if (table.nodeName === 'TABLE') {
        this.el = table;
        this.el.classList.add('align-table');
        return;
      }
      var rows = Number(table.rows);
      var columns = Number(table.columns);
      if (isNaN(rows) || isNaN(columns)) {
        return;
      }
      this.el = document.createElement('table');
      this.el.classList.add('align-table');
      this.el.insertAdjacentHTML('afterbegin', ('\n        <tr>\n          ' + '<td><br></td>'.repeat(columns) + '\n        </tr>\n      ').repeat(rows));
    }
  }, {
    key: '_initEvents',
    value: function _initEvents() {
      var _this = this;

      this.el.addEventListener('click', function (event) {
        _this.activeCell = event.target;
        Table.$optionsBar.show(_this);
      });
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.el.remove();
    }
  }, {
    key: 'insertRow',
    value: function insertRow($styler, $schema) {
      var position = $schema.args[0];
      var columnsLength = this.el.rows[0].cells.length;
      var newIndex = +this.activeCell.parentNode.rowIndex + (position === 'after' ? 1 : 0);
      var row = this.el.insertRow(newIndex);
      for (var i = 0; i < columnsLength; i++) {
        var cell = row.insertCell(i);
        cell.insertAdjacentHTML('afterbegin', '<br>');
      }
    }
  }, {
    key: 'deleteRow',
    value: function deleteRow() {
      this.el.deleteRow(this.activeCell.parentNode.rowIndex);
    }
  }, {
    key: 'insertColumn',
    value: function insertColumn($styler, $schema) {
      var position = $schema.args[0];
      var rowsLength = this.el.rows.length;
      var columnIndex = this.activeCell.cellIndex + (position === 'after' ? 1 : 0);
      for (var i = 0; i < rowsLength; i++) {
        var cell = this.el.rows[i].insertCell(columnIndex);
        cell.insertAdjacentHTML('afterbegin', '<br>');
      }
    }
  }, {
    key: 'deleteColumn',
    value: function deleteColumn() {
      var rowsLength = this.el.rows.length;
      var columnIndex = this.activeCell.cellIndex;
      for (var i = 0; i < rowsLength; i++) {
        this.el.rows[i].deleteCell(columnIndex);
      }
    }
  }], [{
    key: 'config',
    value: function config(align, settings) {
      var config = Object.assign({
        mode: 'bubble',
        hideWhenClickOut: true,
        commands: ['_tableRowTop', '_tableRowBottom', '_tableColumnBefore', '_tableColumnAfter', 'separator', '_tableDeleteRow', '_tableDeleteColumn', 'separator', '_remove'],
        tooltip: true,
        theme: 'dark'
      }, settings);
      this.$align = align;
      this.$optionsBar = new Styler(align, config);
    }
  }]);
  return Table;
}();

var ID = 0;
var ALL_SECTIONS = [];

var Section = function () {
  function Section(content, position) {
    var _this = this;

    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'text';
    classCallCheck(this, Section);

    if (content && content.nodeName === 'BR') {
      return;
    }
    this.id = ID++;
    this.type = type;
    this.generateEl(content);
    if (type === 'text') {
      this.el.addEventListener('click', function () {
        Section.$align.activeSection = _this.el;
        Section.$optionsBar.show(_this);
      });
    }
    if ((typeof position === 'undefined' ? 'undefined' : _typeof(position)) === 'object') {
      Section.$align.editor.insertBefore(this.el, position);
      return;
    }
    Section.$align.editor.appendChild(this.el);
    ALL_SECTIONS.push(this);
  }

  createClass(Section, [{
    key: 'generateEl',
    value: function generateEl(content) {
      this.el = content && content.nodeName === 'DIV' ? content : document.createElement('div');
      this.el.classList.add('align-section');

      switch (this.type) {
        case 'text':
          this.contentDiv = this.el.querySelector('.align-content') || document.createElement('div');
          this.contentDiv.classList.add('align-content');
          this.contentDiv.contentEditable = true;
          content = content ? this.contentDiv.innerHTML || this.el.innerHTML || content.outerHTML : '<p></p>';

          this.el.innerHTML = '';
          this.el.appendChild(this.contentDiv);
          this.contentDiv.innerHTML = content;
          var tables = Array.from(this.contentDiv.querySelectorAll('table'));
          tables.forEach(function (table) {
            return new Table(table);
          });
          this.generateAddSectionButton();
          this.el.insertAdjacentElement('afterBegin', this.addSectionButton);
          break;

        case 'title':
          this.titleDiv = this.el.querySelector('.align-title') || document.createElement('div');
          this.titleDiv.classList.add('align-title');
          this.titleDiv.contentEditable = true;
          this.title = document.createElement('h1');
          this.title.innerHTML = content;
          this.titleDiv.appendChild(this.title);
          this.el.appendChild(this.titleDiv);
          break;

        default:
          break;
      }
    }
  }, {
    key: 'generateAddSectionButton',
    value: function generateAddSectionButton() {
      var _this2 = this;

      this.addSectionButton = document.createElement('button');
      this.addSectionButton.classList.add('align-newSection');
      this.addSectionButton.addEventListener('click', function () {
        return new Section('', _this2.el);
      });
      this.addSectionButton.contentEditable = false;
      return this.addSectionButton;
    }
  }, {
    key: 'getIndex',
    value: function getIndex() {
      var _this3 = this;

      return ALL_SECTIONS.findIndex(function (el) {
        return el === _this3;
      });
    }
  }, {
    key: 'toggleHTML',
    value: function toggleHTML() {
      if (this.contentDiv.firstElementChild.tagName !== 'PRE') {
        var content = document.createTextNode(this.contentDiv.innerHTML);
        var pre = document.createElement('pre');

        this.contentDiv.innerHTML = '';
        pre.id = 'content';
        pre.style.whiteSpace = 'pre-wrap';
        pre.appendChild(content);
        this.contentDiv.appendChild(pre);
        Section.$align.highlight();
        return;
      }
      this.contentDiv.innerHTML = this.contentDiv.innerText;
      this.contentDiv.contentEditable = true;
      this.contentDiv.focus();
    }
  }, {
    key: 'backgroundColor',
    value: function backgroundColor(cmdSchema, color) {
      this.el.style.backgroundColor = color;
    }
  }, {
    key: 'backgroundImage',
    value: function backgroundImage(cmdSchema, event) {
      var _this4 = this;

      var input = event.target;
      var file = input.files[0];
      if (!file) return;
      var reader = new FileReader(); // eslint-disable-line
      var bg = this.el.querySelector('.align-bgImage') || document.createElement('div');
      if (!this.el.querySelector('.align-bgImage')) {
        bg.classList.add('align-bgImage');
        this.el.insertAdjacentElement('afterBegin', bg);
      }
      reader.addEventListener('load', function () {
        _this4.el.classList.add('is-bgImage');
        bg.style.backgroundImage = 'url(' + reader.result + ')';
        var update = function update(src) {
          bg.style.backgroundImage = 'url(' + src + ')';
        };
        Section.$align.update();
        Section.$align.$bus.emit('imageAdded', { file: file, update: update });
      });
      reader.readAsDataURL(file);
      input.value = null;
    }
  }, {
    key: 'backgroundVideo',
    value: function backgroundVideo(cmdSchema, event) {
      var input = event.target;
      var file = input.files[0];
      if (!file) return;
      var video = this.el.querySelector('.align-bgVideo');
      var source = null;
      var url = URL.createObjectURL(event.target.files[0]);
      if (!video) {
        var _video = stringToDOM('<video autoplay muted loop class="align-bgVideo"></video>');
        source = document.createElement('source');
        _video.appendChild(source);
        this.el.insertAdjacentElement('afterBegin', _video);
      }
      if (video) {
        source = video.querySelector('source');
      }
      this.el.classList.add('is-bgVideo');
      source.src = url;
      var update = function update(src) {
        source.src = src;
      };
      Section.$align.update();
      Section.$align.$bus.emit('videoAdded', { file: file, update: update });
      input.value = null;
    }
  }, {
    key: 'moveUp',
    value: function moveUp() {
      var index = this.getIndex();
      if (!this.el.previousSibling || ALL_SECTIONS[index - 1].type === 'title') return;

      Section.$align.editor.insertBefore(this.el, ALL_SECTIONS[index - 1].el);
      swapArrayItems(ALL_SECTIONS, index, index - 1);
    }
  }, {
    key: 'moveDown',
    value: function moveDown() {
      var index = this.getIndex();
      if (!this.el.nextSibling) return;
      Section.$align.editor.insertBefore(this.el, ALL_SECTIONS[index + 1].el.nextSibling);
      swapArrayItems(ALL_SECTIONS, index, index + 1);
    }
  }, {
    key: 'active',
    value: function active() {
      Section.$optionsBar.show(this);
      this.el.focus();
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.el.remove();
      ALL_SECTIONS.splice(this.getIndex(), 1);
    }
  }, {
    key: 'content',
    get: function get$$1() {
      var output = void 0;
      if (this.type === 'text') {
        output = this.el.cloneNode(true);
        var addButton = output.querySelector('.align-newSection');
        var contentDiv = output.querySelector('.align-content');
        output.insertAdjacentHTML('beforeend', contentDiv.innerHTML);
        contentDiv.remove();
        addButton.remove();
      }
      if (this.type === 'title') {
        return this.title.innerText;
      }
      return output.outerHTML;
    }
  }], [{
    key: 'config',
    value: function config(align, settings) {
      var config = Object.assign({
        mode: 'bubble',
        hideWhenClickOut: true,
        commands: ['_sectionUp', '_sectionDown', '_sectionColor', '_sectionImage', '_sectionVideo', '_sectionToggleHTML', { '_sectionClasses': ['normal', 'full'] }, '_remove'],
        tooltip: true,
        theme: 'dark'
      }, settings);
      this.$align = align;
      this.$optionsBar = new Styler(align, config);
    }
  }, {
    key: 'allSections',
    get: function get$$1() {
      return ALL_SECTIONS;
    }
  }]);
  return Section;
}();

var Creator = function () {
  function Creator(align) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$mode = _ref.mode,
        mode = _ref$mode === undefined ? 'toolbar' : _ref$mode,
        _ref$theme = _ref.theme,
        theme = _ref$theme === undefined ? 'light' : _ref$theme,
        _ref$items = _ref.items,
        items = _ref$items === undefined ? ['figure', 'video', 'facebook', 'table', 'embed'] : _ref$items;

    classCallCheck(this, Creator);

    this.$align = align;
    this.settings = {
      mode: mode,
      theme: theme,
      items: items
    };
    this._init();
  }

  createClass(Creator, [{
    key: '_init',
    value: function _init() {
      var _this = this;

      setElementsPrefix('creator-');
      this.el = document.createElement('div');
      this.el.classList.add('creator', 'is-' + this.settings.theme, 'is-' + this.settings.mode);
      this.menu = document.createElement('ul');
      this.menu.classList.add('creator-menu');

      this.figureOptions = new Styler(this.$align, {
        mode: 'bubble',
        hideWhenClickOut: true,
        commands: [{ '_figureClasses': ['floatLeft', 'center', 'floatRight', 'full'] }, '_remove'],
        tooltip: true,
        theme: 'dark'
      });

      this.settings.items.forEach(function (item) {
        var li = document.createElement('li');
        var el = null;

        switch (item) {
          case 'figure':
            var btn = fileButton('figure');
            btn.input.addEventListener('change', _this.createFigure.bind(_this));
            el = btn.el;
            break;

          case 'video':
            el = button('video');
            el.addEventListener('click', _this.createVideo.bind(_this));
            break;

          case 'table':
            el = button('table');
            el.addEventListener('click', _this.createTable.bind(_this));
            break;

          case 'facebook':
            el = button('facebook');
            el.addEventListener('click', _this.embedPost.bind(_this));
            break;

          case 'embed':
            el = button('embed');
            el.addEventListener('click', _this.embed.bind(_this));
            break;
          default:
            return;
        }
        li.appendChild(el);
        _this.menu.appendChild(li);
      });

      this.el.appendChild(this.menu);
      if (this.settings.mode === 'inline') {
        this.toggleButton = button('plus');
        this.toggleButton.addEventListener('click', this.toggleState.bind(this));
        this.el.appendChild(this.toggleButton);
        this.$align.el.appendChild(this.el);
      }
      if (this.settings.mode === 'toolbar' && this.$align.toolbar) {
        this.$align.toolbar.el.appendChild(this.el);
      }
      if (this.settings.mode === 'toolbar' && !this.$align.toolbar) {
        this.$align.toolbar = new Styler(this.$align, {
          mode: 'toolbar',
          commands: []
        });
        this.$align.toolbar.el.appendChild(this.el);
      }
    }
  }, {
    key: 'update',
    value: function update() {
      if (this.settings.mode !== 'inline') {
        this.position = null;
        return;
      }
      if (Selection.current.isCollapsed && Selection.current.anchorNode.nodeType === 1 && Selection.current.anchorNode.childNodes.length <= 1 && Selection.current.anchorNode.parentNode.classList.contains('align-content')) {
        this.position = updatePosition(Selection.current.anchorNode, this.el, this.$align.el, 'middle-left');
        this.show();
        return;
      }
      this.hide();
    }
  }, {
    key: 'toggleState',
    value: function toggleState() {
      this.el.classList.toggle('is-active');
    }
  }, {
    key: 'show',
    value: function show() {
      if (this.el.classList.contains('is-visible')) return;
      this.el.classList.add('is-visible');
      this.el.classList.remove('is-hidden');
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.el.classList.remove('is-visible');
      this.el.classList.remove('is-active');
      this.el.classList.add('is-hidden');
    }
  }, {
    key: 'createFigure',
    value: function createFigure(event) {
      var _this2 = this;

      var input$$1 = event.target;
      var file = input$$1.files[0];
      if (!file || !Selection.range) return;
      var reader = new FileReader(); // eslint-disable-line
      var figure = document.createElement('figure');
      var caption = document.createElement('figcaption');
      var img = document.createElement('img');
      var selectedElement = Selection.current.anchorNode;
      figure.contentEditable = false;
      caption.contentEditable = true;
      caption.dataset.defaultValue = 'Figure caption';
      img.classList.add('align-image');
      figure.classList.add('align-figure', 'is-center');
      figure.appendChild(img);
      figure.appendChild(caption);
      figure.addEventListener('click', function () {
        return _this2.figureOptions.show({
          el: figure,
          remove: function remove() {
            figure.remove();
          }
        });
      }, false);
      reader.addEventListener('load', function () {
        img.src = reader.result;
        img.dataset.alignFilename = file.name;
        _this2.$align.update();
        var update = function update(src) {
          img.src = src;
        };
        _this2.$align.$bus.emit('imageAdded', { file: file, update: update });
      });
      reader.readAsDataURL(file);
      input$$1.value = null;
      selectedElement.parentNode.insertBefore(figure, selectedElement.nextSibling);
    }
  }, {
    key: 'createVideo',
    value: function createVideo() {
      var selectedElement = Selection.current.anchorNode;
      new Prompt('Enter video link:', '', {
        wrapper: this.$align.el,
        position: this.position
      }).onSubmit(function () {
        var link = this.inputs[0].value;
        if (!link) return;
        var videoHoster = link.includes('yout') ? 'youtube' : link.includes('vimeo') ? 'vimeo' : '';

        if (!videoHoster) {
          return;
        }

        var videoId = getVideoId(link, videoHoster);
        var iframe = document.createElement('iframe');

        iframe.width = 560;
        iframe.height = 315;
        iframe.allowfullscreen = true;
        iframe.contentEditable = false;
        iframe.src = videoHoster === 'youtube' ? '//www.youtube.com/embed/' + videoId : videoHoster === 'vimeo' ? '//player.vimeo.com/video/' + videoId : '';
        selectedElement.parentNode.insertBefore(iframe, selectedElement.nextSibling);
      });
    }
  }, {
    key: 'createTable',
    value: function createTable() {
      var selectedElement = Selection.current.anchorNode;
      new Prompt('Enter post link:', '', {
        wrapper: this.$align.el,
        position: this.position,
        inputsCount: 2,
        inputsPlaceholders: ['rows', 'columns']
      }).onSubmit(function () {
        selectedElement.parentNode.insertBefore(new Table({
          rows: this.inputs[0].value,
          columns: this.inputs[1].value
        }).el, selectedElement.nextSibling);
      });
    }
  }, {
    key: 'embedPost',
    value: function embedPost() {
      var selectedElement = Selection.current.anchorNode;
      new Prompt('Enter post link:', '', {
        wrapper: this.$align.el,
        position: this.position
      }).onSubmit(function () {
        var postUrl = this.inputs[0].value;
        if (!postUrl) return;
        var iframe = document.createElement('iframe');

        iframe.width = 500;
        iframe.height = 200;
        iframe.scrolling = 'no';
        iframe.contentEditable = false;
        iframe.allowTransparency = true;
        iframe.src = '//www.facebook.com/plugins/post.php?href=' + postUrl;
        selectedElement.parentNode.insertBefore(iframe, selectedElement.nextSibling);
      });
    }
  }, {
    key: 'embed',
    value: function embed() {
      var selectedElement = Selection.current.anchorNode;
      new Prompt('Add embeded:', '', {
        wrapper: this.$align.el,
        position: this.position
      }).onSubmit(function () {
        var data = this.inputs[0].value;
        if (!data) return;
        var div = document.createElement('div');

        selectedElement.parentNode.insertBefore(div, selectedElement.nextSibling);
        div.insertAdjacentHTML('afterbegin', data);
      });
    }
  }, {
    key: 'embedTweet',
    value: function embedTweet() {}
  }]);
  return Creator;
}();

var EventBus = function () {
  function EventBus() {
    classCallCheck(this, EventBus);

    this.events = {};
  }

  createClass(EventBus, [{
    key: "on",
    value: function on(eventName, callback) {
      var _this = this;

      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }

      var idx = this.events[eventName].length;
      this.events[eventName].push(callback);

      return function () {
        _this.events[eventName].splice(idx, 1);
      };
    }
  }, {
    key: "once",
    value: function once(eventName, callback) {
      var _this2 = this;

      var idx = this.events.eventName ? this.events[eventName].length : 0;
      var cb = function cb() {
        callback.apply(undefined, arguments);
        _this2.events[eventName].splice(idx, 1);
      };

      this.on(eventName, cb);
    }
  }, {
    key: "emit",
    value: function emit(eventName, args) {
      var _this3 = this;

      if (!this.events[eventName] || !this.events[eventName].length) {
        return;
      }

      setTimeout(function () {
        _this3.events[eventName].forEach(function (cb) {
          return cb(args);
        });
      }, 0);
    }
  }]);
  return EventBus;
}();

var Align = function () {
  function Align(selector) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$toolbar = _ref.toolbar,
        toolbar = _ref$toolbar === undefined ? null : _ref$toolbar,
        _ref$bubble = _ref.bubble,
        bubble = _ref$bubble === undefined ? null : _ref$bubble,
        _ref$creator = _ref.creator,
        creator = _ref$creator === undefined ? null : _ref$creator,
        _ref$section = _ref.section,
        section = _ref$section === undefined ? null : _ref$section,
        _ref$shortcuts = _ref.shortcuts,
        shortcuts = _ref$shortcuts === undefined ? false : _ref$shortcuts,
        _ref$postTitle = _ref.postTitle,
        postTitle = _ref$postTitle === undefined ? false : _ref$postTitle;

    classCallCheck(this, Align);

    this.el = select(selector);
    this.settings = {
      toolbar: toolbar,
      bubble: bubble,
      creator: creator,
      section: section,
      shortcuts: shortcuts,
      postTitle: postTitle
    };
    this.sel = Selection;
    this._init();
  }

  /**
   * Get editor's content
   */


  createClass(Align, [{
    key: '_init',

    /**
     * Create all editor elements
     */
    value: function _init() {
      this.$bus = new EventBus();
      this.startContent = Array.from(this.el.children);
      this.el.innerText = '';
      Section.config(this, this.settings.section);
      Table.config(this, this.settings.table);

      if (this.settings.toolbar) {
        this.settings.toolbar.mode = 'toolbar';
        this.toolbar = new Styler(this, this.settings.toolbar);
      }
      if (this.settings.bubble) {
        this.settings.bubble.mode = 'bubble';
        this.settings.bubble.tooltip = false;
        this.bubble = new Styler(this, this.settings.bubble);
      }
      if (this.settings.creator) {
        this.creator = new Creator(this, this.settings.creator);
      }
      this._initEditor();
      this._initSections();
      this._initEvents();
    }

    /**
     * Create the editor
     */

  }, {
    key: '_initEditor',
    value: function _initEditor() {
      document.execCommand('defaultParagraphSeparator', false, 'p');

      this.editor = document.createElement('div');
      this.editor.classList.add('align-editor');
      this.cmdKey = userOS() === 'Mac' ? 'metaKey' : 'ctrlKey';
      this.cmdKeyPressed = false;
      this.el.appendChild(this.editor);
      this.editor.focus();
      Selection.updateSelectedRange();
    }
  }, {
    key: '_initSections',
    value: function _initSections() {
      var _this = this;

      this.activeSection = '';

      if (this.settings.postTitle !== false) {
        this.postTitle = new Section(this.settings.postTitle, '', 'title');
      }
      this.startContent.forEach(function (e) {
        return new Section(e);
      });
      this.newSectionButton = document.createElement('button');
      this.newSectionButton.classList.add('align-addButton');
      this.el.appendChild(this.newSectionButton);
      this.newSectionButton.addEventListener('click', function () {
        var newSection = new Section();
        newSection.active();
        Selection.selectElement(newSection.contentDiv.querySelector('p'));
        _this.update();
      });
    }

    /**
     * Add all events listeners
     */

  }, {
    key: '_initEvents',
    value: function _initEvents() {
      var _this2 = this;

      this.editor.addEventListener('focus', function () {
        _this2.highlight();
      });

      this.editor.addEventListener('mouseup', this.update.bind(this), true);

      window.addEventListener('keydown', function (event) {
        // Do nothing if the event was already processed
        if (event.defaultPrevented) {
          return;
        }

        _this2.update();
        if (event[_this2.cmdKey] && _this2.settings.shortcuts) {
          switch (event.key.toUpperCase()) {
            case 'B':
              event.preventDefault();
              _this2.execute('bold');break;
            case 'I':
              event.preventDefault();
              _this2.execute('italic');break;
            case 'U':
              event.preventDefault();
              _this2.execute('underline');break;
            case 'E':
              event.preventDefault();
              _this2.execute('justifyCenter');break;
            case 'R':
              event.preventDefault();
              _this2.execute('justifyRight');break;
            case 'L':
              event.preventDefault();
              _this2.execute('justifyLeft');break;
            case 'J':
              event.preventDefault();
              _this2.execute('justifyFull');break;
            case 'A':
              if (event.shiftKey) {
                event.preventDefault();
                Selection.selectElement(_this2.editor);
              }
              break;
            case 'F':
              event.preventDefault();
              if (event.shiftKey) {
                _this2.toggleFullScreen();
              }
              break;
            case 'Z':
              event.preventDefault();
              if (event.shiftKey) {
                _this2.execute('redo');break;
              }
              _this2.execute('undo');break;
            case '\\':
              event.preventDefault();
              _this2.execute('removeFormat');break;
            case '=':
              event.preventDefault();
              if (event.shiftKey) {
                _this2.execute('superscript');break;
              }
              _this2.execute('subscript');break;
            default:
              break;
          }
        }

        switch (event.key) {
          case 'Tab':
            event.preventDefault();
            if (event.shiftKey) {
              _this2.execute('outdent', false, true);break;
            }
            _this2.execute('indent', false, true);break;
          case 'Escape':
            _this2.el.classList.remove('is-fullscreen');
            exitFullscreen();
            break;
          default:
            break;
        }
      }, true);
    }

    /**
     * Hight light code text
     */

  }, {
    key: 'highlight',
    value: function highlight() {
      if (typeof hljs === 'undefined') {
        return;
      }
      var code = Array.from(this.editor.querySelectorAll('pre'));
      code.forEach(function (block) {
        hljs.highlightBlock(block);
      });
    }

    /**
     * Toggle on/off HTML
     */

  }, {
    key: 'toggleFullScreen',
    value: function toggleFullScreen() {
      var state = document.fullscreenElement || document.webkitIsFullScreen;
      if (!state) {
        launchFullscreen(this.el);
        this.el.classList.add('is-fullscreen');
        return;
      }
      this.el.classList.remove('is-fullscreen');
      exitFullscreen();
    }
  }, {
    key: 'update',
    value: function update() {
      var _this3 = this;

      Selection.updateSelectedRange();
      setTimeout(function () {
        if (_this3.settings.toolbar) {
          _this3.toolbar.update();
        }
        if (_this3.settings.bubble) {
          _this3.bubble.update();
        }
        if (_this3.settings.creator) {
          _this3.creator.update();
        }
      }, 16);
    }
  }, {
    key: 'applyFont',
    value: function applyFont(schema, cmd) {
      this.el.style.fontFamily = cmd.fontName[0];
    }
  }, {
    key: 'execute',
    value: function execute(cmd, value) {
      var useCSS = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      this.editor.focus();
      document.execCommand('styleWithCSS', false, useCSS);
      document.execCommand(cmd, false, value);
      document.execCommand('styleWithCSS', false, false);
      this.update();
    }
  }, {
    key: 'content',
    get: function get$$1() {
      return Section.allSections.reduce(function (acc, section) {
        if (section.type !== 'text') {
          return acc;
        }
        return acc += section.content;
      }, '');
    }
  }, {
    key: 'title',
    get: function get$$1() {
      if (this.postTitle) {
        var title = Section.allSections.find(function (sec) {
          return sec.type === 'title';
        });
        return title.content;
      }
    }
  }], [{
    key: 'extend',
    value: function extend(name, extension) {
      cmdsSchema[name] = extension;
    }
  }, {
    key: 'extendIcons',
    value: function extendIcons(name, path) {
      icons[name] = path;
    }
  }]);
  return Align;
}();

return Align;

})));
