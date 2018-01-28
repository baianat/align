(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('highlight.js')) :
	typeof define === 'function' && define.amd ? define(['highlight.js'], factory) :
	(global.Align = factory(global.hljs));
}(this, (function (hljs) { 'use strict';

hljs = hljs && hljs.hasOwnProperty('default') ? hljs['default'] : hljs;

/**
 * Utilities
 */
function select(element) {
  if (typeof element === 'string') {
    return document.querySelector(element);
  }
  return element;
}











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





/**
 * Converts an array-like object to an array.
 */


function normalizeNumber(number, min, max) {
  return Math.round(Math.max(Math.min(Number(number), max), min));
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

      this.el = select(selector);
      this.options = {
        defaultColor: defaultColor,
        radius: radius,
        mode: mode,
        events: events,
        recentColors: recentColors,
        disableLum: disableLum
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
      this.picker.insertAdjacentHTML('afterbegin', "\n      <button class=\"picker-guide\"></button>\n      <div class=\"picker-menu is-hidden\" tabindex=\"-1\">\n        <div class=\"picker-wheel\">\n          <canvas class=\"picker-canvas\"></canvas>\n          <div class=\"picker-cursor\"></div>\n        </div>\n        " + (this.options.disableLum ? '' : '<input class="picker-saturation" type="number" min="0" max="100" value="100">') + "\n        <input id=\"red\" type=\"number\" min=\"0\" max=\"255\" value=\"0\">\n        <input id=\"green\" type=\"number\" min=\"0\" max=\"255\" value=\"0\">\n        <input id=\"blue\" type=\"number\" min=\"0\" max=\"255\" value=\"0\">\n        <div class=\"picker-input\">\n          <button class=\"picker-submit\">\n            <svg class=\"icon\" viewBox=\"0 0 24 24\">\n              <path d=\"M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z\"/>\n            </svg>\n          </button>\n        </div>\n        <div class=\"picker-recent\"></div>\n      </div>\n    ");

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
      this.guide.style.backgroundColor = this.options.defaultColor;

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
      this.guide.style.backgroundColor = color;
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
      document.onclick = '';
    };

    Colorpicker.prototype.openPiker = function openPiker() {
      var this$1 = this;

      this.menu.classList.remove('is-hidden');
      this.isMenuActive = true;
      document.onclick = function (evnt) {
        if (!evnt.target.closest('.picker-menu') && evnt.target !== this$1.guide) {
          this$1.closePicker();
          return;
        }
        call(this$1.options.events.clicked);
      };
      call(this.options.events.afterOpen);
    };

    return Colorpicker;
  });
});

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

var SELECTED_RANGE = null;

var Selection = function () {
  function Selection() {
    classCallCheck(this, Selection);
  }

  createClass(Selection, [{
    key: "selectedRange",
    set: function set$$1(range) {
      if (!range) return;
      SELECTED_RANGE = range;
    },
    get: function get$$1() {
      return SELECTED_RANGE;
    }
  }, {
    key: "selection",
    get: function get$$1() {
      return window.getSelection();
    }
  }], [{
    key: "updateSelection",
    value: function updateSelection() {
      var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Selection.selectedRange;

      if (!range) return;
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, {
    key: "updateSelectedRange",
    value: function updateSelectedRange() {
      var sel = window.getSelection();
      if (sel.rangeCount && sel.anchorNode.nodeType === 3) {
        Selection.selectedRange = sel.getRangeAt(0);
      }
    }
  }]);
  return Selection;
}();

var commands = {
  bold: {
    element: 'button',
    command: 'bold'
  },

  italic: {
    element: 'button',
    command: 'italic'
  },

  underline: {
    element: 'button',
    command: 'underline'
  },

  strikeThrough: {
    element: 'button',
    command: 'strikeThrough'
  },

  removeFormat: {
    element: 'button',
    command: 'removeFormat'
  },

  justifyLeft: {
    element: 'button',
    command: 'justifyLeft'
  },

  justifyCenter: {
    element: 'button',
    command: 'justifyCenter'
  },

  justifyRight: {
    element: 'button',
    command: 'justifyRight'
  },

  justifyFull: {
    element: 'button',
    command: 'justifyFull'
  },

  h1: {
    element: 'button',
    command: 'formatblock',
    value: 'h1'
  },

  h2: {
    element: 'button',
    command: 'formatblock',
    value: 'h2'
  },

  blockquote: {
    element: 'button',
    command: 'formatblock',
    value: 'blockquote'
  },

  p: {
    element: 'button',
    command: 'formatblock',
    value: 'p'
  },

  pre: {
    element: 'button',
    command: 'formatblock',
    value: 'pre',
    func: 'highlight'
  },

  html: {
    element: 'button',
    func: 'toggleHTML'
  },

  insertColumns: {
    element: 'button',
    func: function func() {}
  },

  fontSize: {
    element: 'select',
    command: 'fontSize'
  },

  font: {
    element: 'select',
    classPrefix: 'font',
    func: 'surroundContents'
  },

  separator: {
    element: 'styling',
    class: 'styler-separator'
  },

  color: {
    element: 'input',
    type: 'text',
    command: 'foreColor',
    init: colorpicker,
    initConfig: {
      defaultColor: '#000000',
      mode: 'hex',
      disableLum: true,
      events: {
        beforeSubmit: function beforeSubmit() {
          Selection.updateSelection();
        },
        afterOpen: function afterOpen() {
          Selection.updateSelectedRange();
        },
        afterSelect: function afterSelect() {
          Selection.updateSelectedRange();
        }
      }
    }
  }
};

var icons = {
  blockquote: 'M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z',

  bold: 'M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z',

  fontSize: 'M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z',

  h1: 'M19.1 5.1c-2 .2-2.2.3-2.2 2.3v9.3c0 2 .2 2.1 2.2 2.3v.7h-6.6V19c2.1-.2 2.3-.3 2.3-2.3v-4.6H6.5v4.6c0 2 .2 2.1 2.2 2.3v.7H2.1V19c1.9-.2 2.1-.3 2.1-2.3V7.4c0-2-.2-2.1-2.2-2.3v-.7h6.5v.7c-1.9.2-2 .3-2 2.3V11h8.2V7.4c0-2-.2-2.1-2.1-2.3v-.7h6.5v.7zm2.8 14.5h-1.1v-5c-.4.5-.9.8-1.4 1v-1.2c.3-.1.6-.3.9-.7.3-.3.5-.7.7-1.1h.9v7z',

  h2: 'M18.2 5.1c-2 .2-2.2.3-2.2 2.3v9.3c0 2 .2 2.1 2.2 2.3v.7h-6.6V19c2.1-.2 2.3-.3 2.3-2.3v-4.6H5.6v4.6c0 2 .2 2.1 2.2 2.3v.7H1.3V19c1.9-.2 2.1-.3 2.1-2.3V7.4c0-2-.2-2.1-2.2-2.3v-.7h6.5v.7c-1.9.2-2 .3-2 2.3V11h8.2V7.4c0-2-.2-2.1-2.1-2.3v-.7h6.5v.7zm4.6 13.3v1.2H19c0-.5.2-.9.4-1.3s.6-1 1.2-1.6c.5-.5.8-.9.9-1.1.2-.3.2-.6.2-.8 0-.3-.1-.5-.2-.7s-.3-.2-.5-.2c-.5 0-.7.4-.8 1.1l-1.1-.1c.1-.7.3-1.2.6-1.5.3-.3.8-.5 1.3-.5.6 0 1 .2 1.3.6.3.4.5.8.5 1.3 0 .3 0 .6-.1.8-.1.3-.2.5-.4.8-.2.3-.4.6-.8 1-.3.4-.6.6-.7.8s-.2.2-.2.4h2.2z',

  html: 'M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z',

  image: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',

  indent: 'M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z',

  italic: 'M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z',

  justifyCenter: 'M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z',

  justifyFull: 'M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z',

  justifyLeft: 'M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z',

  justifyRight: 'M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z',

  p: 'M12.3 4.3c1.7 0 3.1.3 4.1 1S18 7.1 18 8.7c0 3.1-2.4 4.6-4.7 4.8h-1.1l-1.8-.5v3.6c0 2 .2 2.1 2.4 2.3v.7H6V19c1.9-.2 2.1-.4 2.1-2.3V7.4c0-2.1-.2-2.2-2-2.3v-.8h6.2zm-2 8c.3.1 1 .3 1.7.3 1.5 0 3.4-.8 3.4-3.8 0-2.6-1.6-3.6-3.5-3.6-.7 0-1.2.1-1.3.3-.2.2-.3.4-.3 1.1v5.7z',

  pre: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',

  removeFormat: 'M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM14 5h-3l-1-1H6L5 5H2v2h12z',

  strikeThrough: 'M7.24 8.75c-.26-.48-.39-1.03-.39-1.67 0-.61.13-1.16.4-1.67.26-.5.63-.93 1.11-1.29.48-.35 1.05-.63 1.7-.83.66-.19 1.39-.29 2.18-.29.81 0 1.54.11 2.21.34.66.22 1.23.54 1.69.94.47.4.83.88 1.08 1.43.25.55.38 1.15.38 1.81h-3.01c0-.31-.05-.59-.15-.85-.09-.27-.24-.49-.44-.68-.2-.19-.45-.33-.75-.44-.3-.1-.66-.16-1.06-.16-.39 0-.74.04-1.03.13-.29.09-.53.21-.72.36-.19.16-.34.34-.44.55-.1.21-.15.43-.15.66 0 .48.25.88.74 1.21.38.25.77.48 1.41.7H7.39c-.05-.08-.11-.17-.15-.25zM21 12v-2H3v2h9.62c.18.07.4.14.55.2.37.17.66.34.87.51.21.17.35.36.43.57.07.2.11.43.11.69 0 .23-.05.45-.14.66-.09.2-.23.38-.42.53-.19.15-.42.26-.71.35-.29.08-.63.13-1.01.13-.43 0-.83-.04-1.18-.13s-.66-.23-.91-.42c-.25-.19-.45-.44-.59-.75-.14-.31-.25-.76-.25-1.21H6.4c0 .55.08 1.13.24 1.58.16.45.37.85.65 1.21.28.35.6.66.98.92.37.26.78.48 1.22.65.44.17.9.3 1.38.39.48.08.96.13 1.44.13.8 0 1.53-.09 2.18-.28s1.21-.45 1.67-.79c.46-.34.82-.77 1.07-1.27s.38-1.07.38-1.71c0-.6-.1-1.14-.31-1.61-.05-.11-.11-.23-.17-.33H21z',

  text: 'M5 17v2h14v-2H5zm4.5-4.2h5l.9 2.2h2.1L12.75 4h-1.5L6.5 15h2.1l.9-2.2zM12 5.98L13.87 11h-3.74L12 5.98z',

  underline: 'M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z',

  insertColumn: 'M13 12h7v1.5h-7zm0-2.5h7V11h-7zm0 5h7V16h-7zM21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 15h-9V6h9v13z'
};

var NAMING_PREFIX = '';

function setElementsPrefix(prefix) {
  NAMING_PREFIX = prefix;
}
/**
  * Create button HTML element
  * @param {String} name
  */
function button(name, icon) {
  var button = document.createElement('button');
  button.classList.add(NAMING_PREFIX + 'button');
  button.id = name;
  button.insertAdjacentHTML('afterbegin', '\n      <svg class="icon" viewBox="0 0 24 24">\n        <path d="' + icon + '"/>\n      </svg>\n    ');
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

var Styler = function () {
  function Styler(align) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$mode = _ref.mode,
        mode = _ref$mode === undefined ? 'default' : _ref$mode,
        _ref$commands = _ref.commands,
        commands$$1 = _ref$commands === undefined ? ['bold', 'italic', 'underline'] : _ref$commands;

    classCallCheck(this, Styler);

    this.align = align;
    this.settings = {
      mode: mode,
      commands: commands$$1
    };
    this.init();
  }

  /**
   * Create the styler toolbar
   */


  createClass(Styler, [{
    key: 'init',
    value: function init() {
      var _this = this;

      setElementsPrefix('styler-');
      this.cmd = document.createElement('ul');
      this.cmd.classList.add('styler', 'is-' + this.settings.mode);
      this.cmds = {};
      this.inits = {};

      this.settings.commands.forEach(function (el) {
        var li = document.createElement('li');
        var cmd = typeof el === 'string' ? el : Object.keys(el)[0];
        var cmdSchema = commands[cmd];
        if (!cmd) {
          console.warn(cmd + ' is not found');
          return;
        }
        var callBack = function callBack(cmdSchema, value) {
          if (cmdSchema.command) {
            _this.execute(cmdSchema.command, value);
          }
          if (typeof cmdSchema.func === 'string') {
            _this.align[cmdSchema.func](cmdSchema, value);
          }
          if (typeof cmdSchema.func === 'function') {
            cmdSchema.func(cmdSchema, value);
          }
        };

        switch (cmdSchema.element) {
          case 'button':
            _this.cmds[cmd] = button(cmd, icons[cmd]);
            _this.cmds[cmd].addEventListener('click', function () {
              return callBack(cmdSchema, cmdSchema.value);
            });
            li.appendChild(_this.cmds[cmd]);
            break;

          case 'select':
            var selectWrapper = select$1(cmd, el[cmd]);
            var temp = _this.cmds[cmd] = selectWrapper.querySelector('select');
            temp.addEventListener('change', function () {
              return callBack(cmdSchema, temp[temp.selectedIndex].value);
            });
            li.appendChild(selectWrapper);
            break;

          case 'input':
            _this.cmds[cmd] = input(cmd, cmdSchema.type);
            _this.cmds[cmd].addEventListener('change', function () {
              _this.execute(cmdSchema.command, _this.cmds[cmd].value);
            });
            li.appendChild(_this.cmds[cmd]);
            break;

          case 'styling':
            li.classList.add(cmdSchema.class);
            break;

          case 'custom':
            var markup = cmdSchema.create();
            li.appendChild(markup);
            break;

          default:
            console.warn(cmd + ' is not found');
        }

        if (cmdSchema.init) {
          _this.inits[cmd] = new cmdSchema.init(_this.cmds[cmd], cmdSchema.initConfig);
        }

        _this.cmd.appendChild(li);
      });
      this.align.el.appendChild(this.cmd);
      if (this.settings.mode === 'bubble') this.initBubble();
    }
  }, {
    key: 'initBubble',
    value: function initBubble() {
      this.cmd.classList.add('is-hidden');
      window.addEventListener('scroll', debounce(this.updateBubblePosition.bind(this)));
    }

    /**
     * Execute command for the selected button
     * @param {String} cmd
     * @param {String|Number} value
     */

  }, {
    key: 'execute',
    value: function execute(cmd, value) {
      if (this.align.HTML) return;
      document.execCommand(cmd, false, value);
      this.align.el.focus();
      Selection.updateSelectedRange();
      this.updateStylerStates();
    }
  }, {
    key: 'updateBubblePosition',
    value: function updateBubblePosition() {
      if (!Selection.selectedRange) return;
      var marginRatio = 10;
      var selectionRect = Selection.selectedRange.getBoundingClientRect();
      var editorRect = this.align.el.getBoundingClientRect();
      var stylerRect = this.cmd.getBoundingClientRect();
      var scrolled = window.scrollY;
      var deltaY = selectionRect.y + scrolled - stylerRect.height - marginRatio;
      var deltaX = selectionRect.x + (selectionRect.width - stylerRect.width) / 2;
      var startBoundary = editorRect.x;
      var endBoundary = editorRect.x + editorRect.width - stylerRect.width;
      var xPosition = normalizeNumber(deltaX, startBoundary, endBoundary);
      var yPosition = deltaY < scrolled + 50 ? selectionRect.y + selectionRect.height + marginRatio : selectionRect.y - stylerRect.height - marginRatio;

      this.cmd.style.top = yPosition + 'px';
      this.cmd.style.left = xPosition + 'px';
    }
  }, {
    key: 'showStyler',
    value: function showStyler() {
      this.cmd.classList.add('is-visible');
      this.cmd.classList.remove('is-hidden');
      this.updateBubblePosition();
    }
  }, {
    key: 'hideStyler',
    value: function hideStyler() {
      this.cmd.classList.remove('is-visible');
      this.cmd.classList.add('is-hidden');
    }
  }, {
    key: 'updateStylerStates',
    value: function updateStylerStates() {
      this.updateStylerCommands();
      if (this.settings.mode !== 'bubble') return;

      if (Selection.selectedRange.collapsed) {
        this.hideStyler();
        return;
      }
      this.showStyler();
    }
  }, {
    key: 'updateStylerCommands',


    /**
     * Update the state of the active style
     */
    value: function updateStylerCommands() {
      var _this2 = this;

      Object.keys(this.cmds).forEach(function (styl) {
        if (document.queryCommandState(styl)) {
          _this2.cmds[styl].classList.add('is-active');
          return;
        }
        if (document.queryCommandValue('formatBlock') === styl) {
          _this2.cmds[styl].classList.add('is-active');
          return;
        }
        _this2.cmds[styl].classList.remove('is-active');
        if (document.queryCommandValue(styl)) {
          _this2.cmds[styl].value = document.queryCommandValue(styl);
        }
      });
    }
  }]);
  return Styler;
}();

var Align = function () {
  function Align(selector) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$defaultText = _ref.defaultText,
        defaultText = _ref$defaultText === undefined ? 'Type here' : _ref$defaultText,
        _ref$toolbar = _ref.toolbar,
        toolbar = _ref$toolbar === undefined ? null : _ref$toolbar,
        _ref$bubble = _ref.bubble,
        bubble = _ref$bubble === undefined ? null : _ref$bubble;

    classCallCheck(this, Align);

    this.el = select(selector);
    this.settings = {
      defaultText: this.el.innerHTML ? this.el.innerHTML : defaultText,
      toolbar: toolbar,
      bubble: bubble
    };
    this.el.innerText = '';
    this.init();
  }

  /**
   * Get editor's content
   */


  createClass(Align, [{
    key: 'init',

    /**
     * Create all editor elements
     */
    value: function init() {
      this.HTML = false;
      if (this.settings.toolbar) {
        this.settings.toolbar.mode = 'toolbar';
        this.toolbar = new Styler(this, this.settings.toolbar);
      }
      if (this.settings.bubble) {
        this.settings.bubble.mode = 'bubble';
        this.bubble = new Styler(this, this.settings.bubble);
      }
      this.initEditor();
      this.initEvents();
    }

    /**
     * Create the editor
     */

  }, {
    key: 'initEditor',
    value: function initEditor() {
      document.execCommand('defaultParagraphSeparator', false, 'p');
      this.editor = document.createElement('div');
      this.paragraph = document.createElement('p');

      this.editor.contentEditable = 'true';
      this.editor.classList.add('align-content');
      this.paragraph.innerHTML = this.settings.defaultText + '\n';

      this.el.appendChild(this.editor);
      this.editor.appendChild(this.paragraph);
    }

    /**
     * Add all events listeners
     */

  }, {
    key: 'initEvents',
    value: function initEvents() {
      var _this = this;

      this.editor.addEventListener('focus', function () {
        _this.highlight();
      });

      window.addEventListener('mouseup', this.updateStylers.bind(this));

      window.addEventListener('keyup', function (event) {
        // Do nothing if the event was already processed
        if (event.defaultPrevented) {
          return;
        }

        switch (event.key) {
          case 'ArrowDown':
            _this.updateStylers();
            break;
          case 'ArrowUp':
            _this.updateStylers();
            break;
          case 'ArrowLeft':
            _this.updateStylers();
            break;
          case 'ArrowRight':
            _this.updateStylers();
            break;
          case 'Tab':
            _this.styler.execute('indent');
            break;

          default:
        }

        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
      }, true);
    }

    /**
     * Hight light code text
     */

  }, {
    key: 'highlight',
    value: function highlight() {
      if (!hljs) {
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
    key: 'toggleHTML',
    value: function toggleHTML() {
      this.HTML = !this.HTML;
      if (this.HTML) {
        var content = document.createTextNode(this.editor.innerHTML);
        var pre = document.createElement('pre');

        this.editor.innerHTML = '';
        this.editor.contentEditable = false;
        pre.id = 'content';
        pre.contentEditable = false;
        pre.style.whiteSpace = 'pre-wrap';
        pre.appendChild(content);
        this.editor.appendChild(pre);
        this.highlight();
        return;
      }
      this.editor.innerHTML = this.editor.innerText;
      this.editor.contentEditable = true;
      this.editor.focus();
    }
  }, {
    key: 'updateStylers',
    value: function updateStylers() {
      var _this2 = this;

      Selection.updateSelectedRange();
      setTimeout(function () {
        if (_this2.settings.toolbar) {
          _this2.toolbar.updateStylerStates();
        }
        if (_this2.settings.bubble) {
          _this2.bubble.updateStylerStates();
        }
      }, 16);
    }
  }, {
    key: 'surroundContents',
    value: function surroundContents(schema, className) {
      if (!Selection.selectedRange) return;
      var container = Selection.selectedRange.commonAncestorContainer;
      var selectedElements = [];

      if (container.nodeType === 3) {
        selectedElements.push(container.parentNode);
      }

      if (container.nodeType !== 3) {
        var allElements = Array.from(container.querySelectorAll(':scope >*'));
        allElements.map(function (el) {
          if (window.getSelection().containsNode(el, true)) {
            selectedElements.push(el);
          }
        });
      }

      selectedElements.map(function (el, index) {
        var range = document.createRange();
        range.selectNodeContents(el);
        if (index === 0) {
          range.setStart(el.firstChild, Selection.selectedRange.startOffset);
        }
        if (index === selectedElements.length - 1) {
          range.setEnd(el.firstChild, Selection.selectedRange.endOffset);
        }

        var span = document.createElement('span');
        span.classList.add('align-' + schema.classPrefix + '-' + className.toLowerCase());
        range.surroundContents(span);
      });
    }
  }, {
    key: 'content',
    get: function get$$1() {
      return document.createTextNode(this.editor.innerHTML);
    }
  }], [{
    key: 'extend',
    value: function extend(name, extension) {
      commands[name] = extension;
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
