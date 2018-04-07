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
    output[key] = (typeof tempValue === 'undefined' ? 'undefined' : _typeof(tempValue)) === 'object' && !Array.isArray(tempValue) ? cloneObject(tempValue) : tempValue;
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
  var refRect = reference.getBoundingClientRect();
  var elmRect = element.getBoundingClientRect();
  var alignRect = align.getBoundingClientRect();
  var positon = { x: 0, y: 0 };
  var startBoundary = alignRect.left;
  var endBoundary = alignRect.left + alignRect.width - elmRect.width;
  modes.forEach(function (mode) {
    switch (mode) {
      case 'center':
        positon.x = refRect.left - alignRect.left + refRect.width / 2 - elmRect.width / 2;
        break;
      case 'left':
        positon.x = refRect.left - alignRect.left;
        break;
      case 'right':
        positon.x = refRect.left - alignRect.left - refRect.width;
        break;
      case 'middle':
        positon.y = refRect.top - alignRect.top + refRect.height / 2 - elmRect.height / 2;
        break;
      case 'top':
        positon.y = refRect.top - alignRect.top - elmRect.height;
        break;
      case 'bottom':
        positon.y = refRect.bottom - alignRect.top;
        break;
    }
  });
  positon.x = normalizeNumber(positon.x, startBoundary, endBoundary);
  element.style.transform = 'translate(' + positon.x + 'px, ' + positon.y + 'px)';

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
  var regExp = hoster === 'youtube' ? /(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/ : hoster === 'vimeo' ? /vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/ : null;

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

/**
  * color-fns v0.0.1
  * (c) 2018 Baianat
  * @license MIT
  */
var _typeof$1 = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

var classCallCheck$1 = function classCallCheck$$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass$1 = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) {
        descriptor.writable = true;
      }
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) {
      defineProperties(Constructor.prototype, protoProps);
    }
    if (staticProps) {
      defineProperties(Constructor, staticProps);
    }
    return Constructor;
  };
}();

var get$1 = function get$$1(object, property, receiver) {
  if (object === null) {
    object = Function.prototype;
  }
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits$1 = function inherits$$1(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) {
    Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }
};

var possibleConstructorReturn$1 = function possibleConstructorReturn$$1(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
};

function getColorModel(color) {
  if ((typeof color === 'undefined' ? 'undefined' : _typeof$1(color)) === 'object' && color.model) {
    return color.model;
  }

  if (color.slice(0, 1) === '#' && (color.length === 4 || color.length === 7)) {
    return 'hex';
  }

  if (color.slice(0, 1) === '#' && (color.length === 6 || color.length === 9)) {
    return 'hex';
  }

  if (color.slice(0, 4).toUpperCase() === 'RGBA') {
    return 'rgb';
  }

  if (color.slice(0, 3).toUpperCase() === 'RGB') {
    return 'rgb';
  }

  if (color.slice(0, 4).toUpperCase() === 'HSLA') {
    return 'hsl';
  }

  if (color.slice(0, 3).toUpperCase() === 'HSL') {
    return 'hsl';
  }

  return false;
}

/**
 * Checks if the given color string is valid (parsable).
 *
 * @param {String} color The color string to be checked.
 */
function isAColor(color) {
  return !!getColorModel(color);
}

function hexNumToDec(hexNum) {
  if (isNaN(parseInt(hexNum, 16))) {
    return 0;
  }

  return parseInt(hexNum, 16);
}

function decNumToHex(decNum) {
  decNum = Math.floor(decNum);
  if (isNaN(decNum)) {
    return '00';
  }

  return ('0' + decNum.toString(16)).slice(-2);
}

function isBetween(lb, ub) {
  return function (value) {
    return value >= lb && value <= ub;
  };
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var Color = function () {
  function Color(components) {
    var _this = this;

    classCallCheck$1(this, Color);

    this.invalid = !this.validate(components);
    if (!this.invalid) {
      Object.keys(components).forEach(function (c) {
        _this[c] = components[c];
      });
    }
    this.init();
  }

  createClass$1(Color, [{
    key: 'init',
    value: function init() {}
  }, {
    key: 'validate',
    value: function validate(components) {
      return !!components && (typeof components === 'undefined' ? 'undefined' : _typeof$1(components)) === 'object';
    }
  }]);
  return Color;
}();

var RgbColor = function (_Color) {
  inherits$1(RgbColor, _Color);

  function RgbColor() {
    classCallCheck$1(this, RgbColor);
    return possibleConstructorReturn$1(this, (RgbColor.__proto__ || Object.getPrototypeOf(RgbColor)).apply(this, arguments));
  }

  createClass$1(RgbColor, [{
    key: 'validate',
    value: function validate(components) {
      if (!get$1(RgbColor.prototype.__proto__ || Object.getPrototypeOf(RgbColor.prototype), 'validate', this).call(this, components)) {
        return false;
      }

      var isInRange = isBetween(0, 255);

      return isInRange(components.red) && isInRange(components.green) && isInRange(components.blue);
    }
  }, {
    key: 'init',
    value: function init() {
      this.model = 'rgb';
      this.alpha = this.alpha || 1;
    }
  }, {
    key: 'toString',
    value: function toString() {
      if (this.invalid) {
        return 'Invalid Color';
      }
      if (isBetween(0, 0.999)(this.alpha)) {
        return 'rgba(' + this.red + ',' + this.green + ',' + this.blue + ',' + this.alpha + ')';
      }
      return 'rgb(' + this.red + ',' + this.green + ',' + this.blue + ')';
    }
  }]);
  return RgbColor;
}(Color);

var HslColor = function (_Color2) {
  inherits$1(HslColor, _Color2);

  function HslColor() {
    classCallCheck$1(this, HslColor);
    return possibleConstructorReturn$1(this, (HslColor.__proto__ || Object.getPrototypeOf(HslColor)).apply(this, arguments));
  }

  createClass$1(HslColor, [{
    key: 'validate',
    value: function validate(components) {
      if (!get$1(HslColor.prototype.__proto__ || Object.getPrototypeOf(HslColor.prototype), 'validate', this).call(this, components)) {
        return false;
      }

      var isPercentage = isBetween(0, 100);

      return isBetween(0, 360)(components.hue) && isPercentage(components.lum) && isPercentage(components.sat);
    }
  }, {
    key: 'init',
    value: function init() {
      this.model = 'hsl';
      this.alpha = this.alpha || 1;
    }
  }, {
    key: 'toString',
    value: function toString() {
      if (this.invalid) {
        return 'Invalid Color';
      }
      if (isBetween(0, 0.999)(this.alpha)) {
        return 'hsla(' + this.hue + ',' + this.sat + '%,' + this.lum + '%,' + this.alpha + ')';
      }
      return 'hsl(' + this.hue + ',' + this.sat + '%,' + this.lum + '%)';
    }
  }]);
  return HslColor;
}(Color);

var HexColor = function (_Color3) {
  inherits$1(HexColor, _Color3);

  function HexColor() {
    classCallCheck$1(this, HexColor);
    return possibleConstructorReturn$1(this, (HexColor.__proto__ || Object.getPrototypeOf(HexColor)).apply(this, arguments));
  }

  createClass$1(HexColor, [{
    key: 'validate',
    value: function validate(components) {
      if (!get$1(HexColor.prototype.__proto__ || Object.getPrototypeOf(HexColor.prototype), 'validate', this).call(this, components)) {
        return false;
      }

      return (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test('#' + components.red + components.green + components.blue)
      );
    }
  }, {
    key: 'init',
    value: function init() {
      this.model = 'hex';
      this.alpha = this.alpha || 'ff';
    }
  }, {
    key: 'toString',
    value: function toString() {
      if (this.invalid) {
        return 'Invalid Color';
      }
      if (isBetween(0, 0.999)(hexNumToDec(this.alpha) / 255)) {
        return '#' + this.red + this.green + this.blue + this.alpha;
      }
      return '#' + this.red + this.green + this.blue;
    }
  }]);
  return HexColor;
}(Color);

function rgbToHex(rgb) {
  var _ref = [decNumToHex(rgb.red), decNumToHex(rgb.green), decNumToHex(rgb.blue), rgb.alpha ? decNumToHex(rgb.alpha * 255) : null],
      rr = _ref[0],
      gg = _ref[1],
      bb = _ref[2],
      aa = _ref[3];

  return new HexColor({
    red: rr,
    green: gg,
    blue: bb,
    alpha: aa || 1
  });
}

function rgb2Hsl(rgb) {
  if (!rgb) {
    return new HslColor();
  }

  // Convert the RGB values to the range 0-1
  var _ref = [rgb.red / 255, rgb.green / 255, rgb.blue / 255, rgb.alpha],
      red = _ref[0],
      green = _ref[1],
      blue = _ref[2],
      alpha = _ref[3];
  var hue = 0,
      sat = 0,
      lum = 0;

  // Find the minimum and maximum values of R, G and B.

  var min = Math.min(red, green, blue);
  var max = Math.max(red, green, blue);

  // Calculate the lightness value
  lum = (min + max) / 2;

  // Calculate the saturation.
  if (min !== max) {
    sat = lum > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
  }

  // calculate the hue
  if (red >= max && min !== max) {
    hue = 60 * ((green - blue) / (max - min));
  }
  if (green >= max && min !== max) {
    hue = 60 * (2.0 + (blue - red) / (max - min));
  }
  if (blue >= max && min !== max) {
    hue = 60 * (4.0 + (red - green) / (max - min));
  }

  // normalize values
  hue = hue < 0 ? Math.floor(hue + 360) : Math.floor(hue);
  sat = Math.floor(sat * 100);
  lum = Math.floor(lum * 100);

  return new HslColor({
    hue: hue,
    sat: sat,
    lum: lum,
    alpha: alpha
  });
}

function hexToRgb(hex) {
  var red = hex.red,
      green = hex.green,
      blue = hex.blue,
      alpha = hex.alpha;

  return new RgbColor({
    red: hexNumToDec(red),
    green: hexNumToDec(green),
    blue: hexNumToDec(blue),
    alpha: alpha ? Number((hexNumToDec(alpha) / 255).toFixed(2)) : 1
  });
}

function normalizeDecNum(value) {
  return Math.min(Math.max(parseInt(value), 0), 255);
}

function hslToRgb(hsl) {
  if (!hsl) {
    return new RgbColor();
  }
  var _ref = [hsl.hue / 360, hsl.sat / 100, hsl.lum / 100, hsl.alpha],
      hue = _ref[0],
      sat = _ref[1],
      lgh = _ref[2],
      alpha = _ref[3];
  var red = 0,
      green = 0,
      blue = 0;

  if (sat === 0) {
    red = green = blue = normalizeDecNum(lgh * 255);
  }

  if (sat !== 0) {
    var temp1 = lgh >= 50 ? lgh + sat - lgh * sat : lgh * (1 + sat);
    var temp2 = 2 * lgh - temp1;

    var testHue = function testHue(test) {
      if (test < 0) {
        test += 1;
      }
      if (test > 1) {
        test -= 1;
      }
      if (test < 1 / 6) {
        return temp2 + (temp1 - temp2) * 6 * test;
      }
      if (test < 1 / 2) {
        return temp1;
      }
      if (test < 2 / 3) {
        return temp2 + (temp1 - temp2) * (2 / 3 - test) * 6;
      }
      return temp2;
    };

    red = normalizeDecNum(255 * testHue(hue + 1 / 3));
    green = normalizeDecNum(255 * testHue(hue));
    blue = normalizeDecNum(255 * testHue(hue - 1 / 3));
  }

  return new RgbColor({
    red: red,
    green: green,
    blue: blue,
    alpha: alpha
  });
}

function hexToHsl(hex) {
  return rgb2Hsl(hexToRgb(hex));
}

function hslToHex(hsl) {
  return rgbToHex(hslToRgb(hsl));
}

function parseRgb(rgb) {
  // will consider rgb/rgba color prefix as a valid input color
  // while the output will be a valid web colors
  // valid input colors examples 'rgb(100, 0, 0, 0.5)', 'rgba(0, 0, 0)'
  // the output for the inputted examples 'rgba(100, 0, 0, 0.5)', 'rgb(0, 0, 0)'
  var match = rgb.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,*\s*(\d*(?:\.\d+)*)*\)/i);
  if (!match || match.length < 4) {
    return new RgbColor();
  }

  return new RgbColor({
    red: Number(match[1]),
    green: Number(match[2]),
    blue: Number(match[3]),
    alpha: Number(match[4])
  });
}

/**
 * Parses the given color string into a RGB color object.
 *
 * @param {String} color The color to be parsed and converted.
 */
function toRgb(color) {
  var model = getColorModel(color);

  if (model === 'hex') {
    return hexToRgb(color);
  }

  if (model === 'hsl') {
    return hslToRgb(color);
  }

  if (model === 'rgb' && typeof color === 'string') {
    return parseRgb(color);
  }

  if (model === 'rgb' && (typeof color === "undefined" ? "undefined" : _typeof(color)) === 'object') {
    return color;
  }

  return new Color();
}

function parseHsl(hsl) {
  // will consider hsl/hsla color prefix as a valid input color
  // while the output will be a valid web colors
  // valid input colors examples 'hsl(255, 100%, 50%, 0.5)', 'hsla(100, 100%, 50%)'
  // the output for the inputted examples 'hsla(255, 100%, 50%, 0.5)', 'hsl(100, 100%, 50%)'
  var match = hsl.match(/^hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,*\s*(\d*(?:\.\d+)*)*\)/i);
  if (!match || match.length < 4) {
    return new HslColor();
  }

  return new HslColor({
    hue: Number(match[1]),
    sat: Number(match[2]),
    lum: Number(match[3]),
    alpha: Number(match[4])
  });
}

/**
 * Parses the given color string into a HSL color object.
 *
 * @param {String} color The color to be parsed and converted.
 */
function toHsl(color) {
  var model = getColorModel(color);

  if (model === 'hex') {
    return hexToHsl(color);
  }

  if (model === 'rgb') {
    return rgb2Hsl(color);
  }

  if (model === 'hsl') {
    return parseHsl(color);
  }

  return new Color();
}

function expandHexShorthand(hex) {
  var regex = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])*$/i;
  if ((hex.length === 5 || hex.length === 4) && regex.test(hex)) {
    hex = hex.replace(regex, function (m, r, g, b, a) {
      return '#' + r + r + g + g + b + b + (a ? '' + a + a : '');
    });
  }

  return hex;
}

function parseHex(hex) {
  var expanded = expandHexShorthand(hex);
  var match = expanded.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})*/i);
  if (!match || match.length < 4) {
    return new HexColor();
  }

  return new HexColor({
    hex: expanded,
    red: match[1],
    green: match[2],
    blue: match[3],
    alpha: match[4]
  });
}

/**
 * Parses the given color string into a Hex color object.
 *
 * @param {String} color The color to be parsed and converted.
 */
function toHex(color) {
  var model = getColorModel(color);

  if (model === 'rgb') {
    return rgbToHex(color);
  }

  if (model === 'hsl') {
    return hslToHex(color);
  }

  if (model === 'hex' && typeof color === 'string') {
    return parseHex(color);
  }

  if (model === 'hex' && (typeof color === "undefined" ? "undefined" : _typeof(color)) === 'object') {
    return color;
  }

  return new Color();
}

function parseColor(color) {
  var model = getColorModel(color);
  if (model === 'rgb') {
    return parseRgb(color);
  }

  if (model === 'hex') {
    return parseHex(color);
  }

  if (model === 'hsl') {
    return parseHsl(color);
  }

  return new Color();
}

function getRandomColor() {
  return 'rgb(' + getRandomInt(0, 255) + ', ' + getRandomInt(0, 255) + ', ' + getRandomInt(0, 255) + ')';
}

function mixValue(color1, color2, ratio) {
  if (ratio === void 0) ratio = 0.5;

  return Number((color1 * (1 - ratio) + color2 * ratio).toFixed(2));
}

function mixColors(color1, color2, ratio) {
  color1 = toRgb(color1);
  color2 = toRgb(color2);
  var red = Math.floor(mixValue(color1.red, color2.red, ratio));
  var green = Math.floor(mixValue(color1.green, color2.green, ratio));
  var blue = Math.floor(mixValue(color1.blue, color2.blue, ratio));
  var alpha = mixValue(color1.alpha, color2.alpha, ratio);
  return new RgbColor({
    red: red,
    green: green,
    blue: blue,
    alpha: alpha
  });
}

function getCartesianCoords(r, theta) {
  return {
    x: r * Math.cos(theta * Math.PI * 2),
    y: r * Math.sin(theta * Math.PI * 2)
  };
}

/**
 * Utilities
 */
function select$1(element) {
  if (typeof element === 'string') {
    return document.querySelector(element);
  }
  return element;
}

function call(func, args) {
  if (args === void 0) args = null;

  if (typeof func === 'function') {
    func(args);
  }
}

function getArray$1(length, value) {
  var array = [];
  for (var i = 0; i < length; i++) {
    var temp = typeof value === 'function' ? value() : value;
    array.push(temp);
  }
  return array;
}

function wrap$1(el, wrapper) {
  // insert wrapper before el in the DOM tree
  el.parentNode.insertBefore(wrapper, el);

  // move el into wrapper
  wrapper.appendChild(el);
}

/**
 * Converts an array-like object to an array.
 */

function isElementClosest$1(element, wrapper) {
  while (element !== document && element !== null) {
    if (element === wrapper) {
      return true;
    }
    element = element.parentNode;
  }
  return false;
}

function stringToDOM$1(string) {
  return document.createRange().createContextualFragment(string).firstElementChild;
}

function getClosestValue(array, value) {
  return array.reduce(function (prev, curr) {
    return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
  });
}

function mouseDownHandler(event) {
  event.preventDefault();
  return function (func) {
    func(event);
    var tempFunc = function tempFunc(event) {
      window.requestAnimationFrame(function () {
        return func(event);
      });
    };
    var mouseupHandler = function mouseupHandler() {
      document.removeEventListener('mousemove', tempFunc);
      document.removeEventListener('mouseup', mouseupHandler);
    };
    document.addEventListener('mousemove', tempFunc);
    document.addEventListener('mouseup', mouseupHandler);
  };
}

/**
 * Slider class
 */
var Slider = function Slider(selector, ref) {
  if (ref === void 0) ref = {};
  var created = ref.created;if (created === void 0) created = {};
  var updated = ref.updated;if (updated === void 0) updated = {};
  var gradient = ref.gradient;if (gradient === void 0) gradient = null;
  var classes = ref.classes;if (classes === void 0) classes = null;
  var colorCode = ref.colorCode;if (colorCode === void 0) colorCode = false;
  var editable = ref.editable;if (editable === void 0) editable = false;
  var reverse = ref.reverse;if (reverse === void 0) reverse = false;
  var label = ref.label;if (label === void 0) label = true;
  var min = ref.min;if (min === void 0) min = 0;
  var max = ref.max;if (max === void 0) max = 10;
  var step = ref.step;if (step === void 0) step = 1;
  var value = ref.value;if (value === void 0) value = 0;
  var handles = ref.handles;if (handles === void 0) handles = [0];
  var trackSlide = ref.trackSlide;if (trackSlide === void 0) trackSlide = true;

  this.el = select$1(selector);
  this.settings = {
    created: created,
    updated: updated,
    gradient: gradient,
    classes: classes,
    colorCode: colorCode,
    editable: editable,
    reverse: reverse,
    label: label,
    min: min,
    max: max,
    step: step,
    value: value,
    handles: handles,
    trackSlide: trackSlide
  };
  this._init();
};

/**
 * create new rang slider element
 * @param {String|HTMLElement} selector
 * @param {Object}           settings
 */
Slider.create = function create(selector, settings) {
  Slider(selector, settings);
};

Slider.prototype._init = function _init() {
  var this$1 = this;

  this.values = [];
  this.percentages = [];
  this.multiple = this.settings.handles.length > 1;
  this.min = Number(this.el.min) || Number(this.settings.min);
  this.max = Number(this.el.max) || Number(this.settings.max);
  this.step = Number(this.el.step) || Number(this.settings.step);
  if (this.settings.handles.length === 1) {
    this.settings.handles[0] = Number(this.el.value) || Number(this.settings.value);
  }
  this.settings.handles.sort();
  if (this.settings.colorCode) {
    this.el.type = 'text';
  }

  this._initElements();
  if (this.settings.gradient) {
    this._initGradient();
  }
  this._initEvents();
  this.settings.handles.forEach(function (handle, index) {
    this$1.activeHandle = index;
    this$1.update(handle);
  });
  this.update();
};

Slider.prototype._initElements = function _initElements() {
  var this$1 = this;

  this.handles = [];
  this.labels = [];
  this.wrapper = document.createElement('div');
  this.track = document.createElement('div');

  this.wrapper.classList.add('slider');
  this.wrapper.classList.toggle('is-editable', this.settings.editable);
  this.wrapper.classList.toggle('is-reverse', this.settings.reverse);
  if (this.settings.classes) {
    (ref = this.wrapper.classList).add.apply(ref, this.settings.classes);
  }
  this.track.classList.add('slider-track');
  this.el.classList.add('slider-input');

  if (this.settings.handles.length === 1) {
    this.fill = document.createElement('div');
    this.fill.classList.add('slider-fill');
    this.track.appendChild(this.fill);
  }

  this.settings.handles.forEach(function (position, index) {
    this$1.handles[index] = stringToDOM$1("<div class=\"slider-handle\"></div>");
    if (this$1.settings.label) {
      this$1.labels[index] = stringToDOM$1("<div class=\"slider-label\"></div>");
      this$1.handles[index].appendChild(this$1.labels[index]);
    }
    this$1.handles[index].addEventListener('mousedown', this$1.select.bind(this$1), false);
    this$1.handles[index].addEventListener('touchstart', this$1.select.bind(this$1), false);
    this$1.track.appendChild(this$1.handles[index]);
  });

  wrap$1(this.el, this.wrapper);
  this.wrapper.appendChild(this.track);
  call(this.settings.created, this);
  var ref;
};

Slider.prototype._initGradient = function _initGradient() {
  var this$1 = this;

  if (this.settings.gradient.length > 1) {
    this.track.style.backgroundImage = "linear-gradient(90deg, " + this.settings.gradient + ")";
    this.gradient = this.settings.gradient.map(function (color) {
      return parseColor(color);
    });
    return;
  }
  this.track.style.backgroundImage = '';
  this.track.style.backgroundColor = this.settings.gradient[0];
  this.handles.forEach(function (handle) {
    handle.style.color = this$1.settings.gradient[0];
  });
  this.gradient = null;
};

Slider.prototype._initEvents = function _initEvents() {
  var this$1 = this;

  window.addEventListener('resize', function () {
    this$1.updateWidth();
    this$1.update(undefined, true);
  });
  if (this.settings.trackSlide) {
    this.track.addEventListener('mousedown', this.select.bind(this), false);
    this.track.addEventListener('touchstart', this.select.bind(this), false);
  }
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
  event.stopPropagation();
  // check ifleft mouse is clicked
  if (event.buttons !== 1) {
    return;
  }
  this.track.classList.add('is-dragging');
  this.ticking = false;

  var stepValue = this.getStepValue(event);

  if (this.multiple) {
    var closest = getClosestValue(this.values, stepValue);
    this.activeHandle = this.values.indexOf(closest);
  }
  this.update(stepValue);

  this.tempDrag = this.dragging.bind(this);
  this.tempRelease = this.release.bind(this);
  document.addEventListener('mousemove', this.tempDrag);
  document.addEventListener('touchmove', this.tempDrag);
  document.addEventListener('touchend', this.tempRelease);
  document.addEventListener('mouseup', this.tempRelease);
};

/**
 * dragging motion
 */
Slider.prototype.dragging = function dragging(event) {
  var this$1 = this;

  event.preventDefault();
  var stepValue = this.getStepValue(event);
  if (!this.ticking) {
    window.requestAnimationFrame(function () {
      this$1.update(stepValue);
      this$1.ticking = false;
    });

    this.ticking = true;
  }
};

/**
 * release handler
 */
Slider.prototype.release = function release() {
  this.track.classList.remove('is-dragging');
  document.removeEventListener('mousemove', this.tempDrag);
  document.removeEventListener('touchmove', this.tempDrag);
  document.removeEventListener('mouseup', this.tempRelease);
  document.removeEventListener('touchend', this.tempRelease);
};

Slider.prototype.getStepValue = function getStepValue(event) {
  var eventX = event.type.includes('mouse') ? event.clientX : event.type.includes('touch') ? event.touches[0].clientX : event;

  var mouseValue = eventX - this.currentX;
  var stepCount = parseInt(mouseValue / this.stepWidth + 0.5, 10);
  var stepValue = parseInt((stepCount + this.min) / this.step, 10) * this.step;
  return stepValue;
};

Slider.prototype.updateWidth = function updateWidth() {
  var trackRect = this.track.getBoundingClientRect();
  this.currentX = trackRect.left;
  this.width = trackRect.width;
  this.stepWidth = this.width / (this.max - this.min);
};

/**
 * get the filled area percentage
 * @param{Object} slider
 * @param{Number} value
 * @return {Number}
 */
Slider.prototype.getPositionPercentage = function getPositionPercentage(value) {
  return (value - this.min) / (this.max - this.min);
};

Slider.prototype.normalizeValue = function normalizeValue(value) {
  if (isNaN(Number(value))) {
    return this.value;
  }
  if (this.multiple) {
    var prevValue = this.values[this.activeHandle - 1] || this.min;
    var nextValue = this.values[this.activeHandle + 1] || this.max;
    value = Math.min(Math.max(Number(value), prevValue), nextValue);
  }
  return Math.min(Math.max(Number(value), this.min), this.max);
};

Slider.prototype.newGradient = function newGradient(newGradient$1) {
  this.settings.gradient = newGradient$1;
  this._initGradient();
  this.update(undefined, true);
};

Slider.prototype.addHandle = function addHandle(value) {
  var closest = getClosestValue(this.values, value);
  var closestIndex = this.values.indexOf(closest);
  var closestValue = this.values[closestIndex];
  var newIndex = closestValue <= value ? closestIndex + 1 : closestIndex;
  this.values.splice(newIndex, 0, value);
  this.percentages.splice(newIndex, 0, this.getPositionPercentage(value));
  this.handles.splice(newIndex, 0, stringToDOM$1("<div class=\"slider-handle\"></div>"));
  if (this.settings.label) {
    this.labels.splice(newIndex, 0, stringToDOM$1("<div class=\"slider-label\"></div>"));
    this.handles[newIndex].appendChild(this.labels[newIndex]);
  }
  this.handles[newIndex].addEventListener('mousedown', this.select.bind(this), false);
  this.handles[newIndex].addEventListener('touchstart', this.select.bind(this), false);
  this.track.appendChild(this.handles[newIndex]);
  this.activeHandle = newIndex;
  this.value = null;
  this.update(value);
  return this.handles[newIndex];
};

Slider.prototype.removeHandle = function removeHandle(index) {
  this.handles[index].remove();
  this.handles.splice(index, 1);
  this.values.splice(index, 1);
  this.percentages.splice(index, 1);
  if (this.settings.label) {
    this.labels.splice(index, 1);
  }
  this.activeHandle = index === 0 ? index + 1 : index - 1;
};

/**
 * get the handle color
 * @param{Number} positionPercentage
 * @return {Number}              handle hex color code
 */
Slider.prototype.getHandleColor = function getHandleColor(positionPercentage) {
  var this$1 = this;

  var colorCount = this.gradient.length - 1;
  var region = positionPercentage;
  for (var i = 1; i <= colorCount; i++) {
    // check the current zone
    if (region >= (i - 1) / colorCount && region <= i / colorCount) {
      // get the active color percentage
      var colorPercentage = (region - (i - 1) / colorCount) / (1 / colorCount);
      // return the mixed color based on the zone boundary colors
      return mixColors(this$1.gradient[i - 1], this$1.gradient[i], colorPercentage);
    }
  }
  return 'rgb(0, 0, 0)';
};

/**
 * update the slider fill, value and color
 * @param {Number} value
 */
Slider.prototype.update = function update(value, mute) {
  if (mute === void 0) mute = false;

  if (Number(value) === this.value) {
    return;
  }

  if (!this.width) {
    this.updateWidth();
  }
  var normalized = this.normalizeValue(value);
  var positionPercentage = this.getPositionPercentage(normalized);

  if (this.fill) {
    this.fill.style.transform = "translate(" + positionPercentage * this.width + "px, 0) scale(" + (1 - positionPercentage) + ", 1)";
  }
  this.handles[this.activeHandle].style.transform = "translate(" + positionPercentage * this.width + "px, 0)";
  this.value = normalized;
  this.values[this.activeHandle] = normalized;
  this.percentages[this.activeHandle] = positionPercentage;
  this.el.value = this.value;
  if (this.settings.label) {
    this.labels[this.activeHandle].innerHTML = this.value;
  }
  if (this.gradient) {
    var color = toHex(this.getHandleColor(positionPercentage));
    this.handles[this.activeHandle].style.color = color;
    if (this.settings.colorCode) {
      this.el.value = color;
      this.labels[this.activeHandle].innerHTML = color;
    }
  }
  if (mute) {
    return;
  }
  this.el.dispatchEvent(new Event('change')); // eslint-disable-line
  this.el.dispatchEvent(new Event('input')); // eslint-disable-line
  call(this.settings.updated);
};

var Colorpicker = function Colorpicker(selector, ref) {
  if (ref === void 0) ref = {};
  var defaultColor = ref.defaultColor;if (defaultColor === void 0) defaultColor = getRandomColor();
  var model = ref.model;if (model === void 0) model = 'rgb';
  var events = ref.events;if (events === void 0) events = {};
  var picker = ref.picker;if (picker === void 0) picker = {};
  var recentColors = ref.recentColors;if (recentColors === void 0) recentColors = {};
  var menu = ref.menu;if (menu === void 0) menu = {};
  var rgbSliders = ref.rgbSliders;if (rgbSliders === void 0) rgbSliders = true;
  var guideIcon = ref.guideIcon;if (guideIcon === void 0) guideIcon = "<svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"12\"/></svg>";

  this.el = select$1(selector);

  var pickerDefaults = {
    mode: 'wheel',
    radius: 200,
    saturation: true,
    edge: 190
  };

  var recentColorsDefaults = {
    max: 6,
    colors: getArray$1(6, getRandomColor)
  };

  var menuDefaults = {
    draggable: true,
    hideWhenSubmit: true
  };

  this.settings = {
    defaultColor: defaultColor,
    model: model,
    events: events,
    picker: picker ? Object.assign(pickerDefaults, picker) : false,
    recentColors: recentColors ? Object.assign(recentColorsDefaults, recentColors) : false,
    menu: Object.assign(menuDefaults, menu),
    rgbSliders: rgbSliders,
    guideIcon: guideIcon
  };
  this.init();
};

Colorpicker.prototype.init = function init() {
  this.currentColor = this.settings.defaultColor;
  this.lastMove = { x: 0, y: 0 };
  this.isMenuActive = false;
  this._initElements();
  this._initEvents();
  this.selectColor(this.settings.defaultColor, true);
  this.updateCursor();
};

Colorpicker.prototype._initElements = function _initElements() {
  this.sliders = {};
  this.mouse = { x: 0, y: 0 };
  // create colorpicker element
  this.picker = document.createElement('div');
  this.menu = stringToDOM$1('<div class="picker-menu" tabindex="-1"></div>');
  this.guide = stringToDOM$1("<button class=\"picker-guide\">" + this.settings.guideIcon + "</button>");

  this.submit = stringToDOM$1("\n    <button class=\"picker-submit\">\n      <svg class=\"icon\" viewBox=\"0 0 24 24\">\n        <path d=\"M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z\"/>\n      </svg>\n    </button>");
  this.menuInput = stringToDOM$1('<div class="picker-input"></div>');

  // append colorpicker elements
  this.picker.appendChild(this.menu);
  this.picker.appendChild(this.guide);
  if (this.settings.picker && this.settings.picker.mode === 'wheel') {
    this._initWheel();
  }
  if (this.settings.picker && this.settings.picker.mode === 'square') {
    this._initSquare();
  }
  if (this.settings.rgbSliders) {
    this._initRGBSliders();
  }
  this.menu.appendChild(this.menuInput);
  if (this.settings.recentColors) {
    this._initRecentColors();
  }

  this.el.parentNode.insertBefore(this.picker, this.el);
  this.el.classList.add('picker-value');
  this.picker.classList.add('picker');
  this.menuInput.appendChild(this.el);
  this.menuInput.appendChild(this.submit);
  this.guide.style.color = this.settings.defaultColor;
  this.guide.style.fill = this.settings.defaultColor;
  setTimeout(this.closePicker.bind(this), 1);
};

Colorpicker.prototype._initSquare = function _initSquare() {
  var this$1 = this;

  this.square = stringToDOM$1("\n      <div class=\"picker-square\">\n        <canvas class=\"picker-canvas\"></canvas>\n        <canvas class=\"picker-squareStrip\"></canvas>\n        <div class=\"picker-cursor\"></div>\n      </div>");

  this.currentHue = 'hsl(0, 100%, 50%)';
  this.canvas = this.square.querySelector('.picker-canvas');
  this.strip = this.square.querySelector('.picker-squareStrip');
  this.cursor = this.square.querySelector('.picker-cursor');
  this.menu.appendChild(this.square);

  // setup canvas
  var edge = this.settings.picker.edge;
  this.canvas.width = edge;
  this.canvas.height = edge;
  this.strip.width = this.settings.picker.edge / 10;
  this.strip.height = edge;
  this.ctx = this.canvas.getContext('2d');
  this.stripCtx = this.strip.getContext('2d');

  this.stripCtx.rect(0, 0, this.strip.width, this.strip.height);
  var hue = this.stripCtx.createLinearGradient(0, 0, 0, this.strip.height);
  for (var angle = 0; angle < 360; angle += 1) {
    hue.addColorStop(angle / 359, "hsl(" + angle + ", 100%, 50%)");
  }
  this.stripCtx.fillStyle = hue;
  this.stripCtx.fill();
  var squareThreshold = this.settings.picker.edge - 1;
  var updateColor = function updateColor(event) {
    if (event.target !== this$1.canvas) {
      return;
    }
    var ref = this$1.getMouseCords(event);
    var x = ref.x;
    var y = ref.y;
    this$1.mouse = { x: Math.min(x, squareThreshold), y: Math.min(y, squareThreshold) };
    var color = this$1.getColorCanvas(this$1.mouse, this$1.ctx);
    this$1.selectColor(color);
    this$1.updateCursor(this$1.mouse);
  };

  var updateHue = function updateHue(event) {
    if (event.target !== this$1.strip) {
      return;
    }
    var mouse = this$1.getMouseCords(event);
    this$1.currentHue = this$1.getColorCanvas(mouse, this$1.stripCtx);
    this$1.updateSquareColors();
    var color = this$1.getColorCanvas(this$1.mouse, this$1.ctx);
    this$1.selectColor(color);
  };

  this.updateSquareColors();

  // add event listener
  this.canvas.addEventListener('mousedown', function (event) {
    return mouseDownHandler(event)(updateColor);
  });
  this.strip.addEventListener('mousedown', function (event) {
    return mouseDownHandler(event)(updateHue);
  });
};

Colorpicker.prototype._initWheel = function _initWheel() {
  var this$1 = this;

  this.wheel = stringToDOM$1("\n      <div class=\"picker-wheel\">\n        <canvas class=\"picker-canvas\"></canvas>\n        <div class=\"picker-cursor\"></div>\n      </div>");
  this.saturation = stringToDOM$1('<input class="picker-saturation" type="number" min="0" max="100" value="0">');

  this.canvas = this.wheel.querySelector('.picker-canvas');
  this.cursor = this.wheel.querySelector('.picker-cursor');
  this.menu.appendChild(this.wheel);

  if (this.settings.picker.saturation) {
    this.menu.appendChild(this.saturation);
    this.sliders.saturation = new Slider(this.saturation, {
      gradient: ['#FFFFFF', '#000000'],
      label: false
    });
    this.saturation.addEventListener('change', function () {
      window.requestAnimationFrame(function () {
        this$1.updateWheelColors();
      });
    });
  }

  // setup canvas
  this.canvas.width = this.settings.picker.radius;
  this.canvas.height = this.settings.picker.radius;
  this.ctx = this.canvas.getContext('2d');

  // draw wheel circle path
  this.circle = {
    path: new Path2D(), // eslint-disable-line
    xCords: this.canvas.width / 2,
    yCords: this.canvas.height / 2,
    radius: this.canvas.width / 2
  };
  this.circle.path.moveTo(this.circle.xCords, this.circle.yCords);
  this.circle.path.arc(this.circle.xCords, this.circle.yCords, this.circle.radius, 0, 360);
  this.circle.path.closePath();

  var updateColor = function updateColor(event) {
    // check if mouse outside the wheel
    var mouse = this$1.getMouseCords(event);
    if (this$1.ctx.isPointInPath(this$1.circle.path, mouse.x, mouse.y)) {
      var color = this$1.getColorCanvas(mouse, this$1.ctx);
      this$1.selectColor(color);
      this$1.updateCursor(mouse);
    }
  };
  // add event listener
  this.wheel.addEventListener('mousedown', function (event) {
    return mouseDownHandler(event)(updateColor);
  });

  this.updateWheelColors();
  this.updateCursor();
};

Colorpicker.prototype._initRGBSliders = function _initRGBSliders() {
  var this$1 = this;

  this.rgbSliders = {
    red: stringToDOM$1('<input id="red" type="number" min="0" max="255" value="0">'),
    green: stringToDOM$1('<input id="green" type="number" min="0" max="255" value="0">'),
    blue: stringToDOM$1('<input id="blue" type="number" min="0" max="255" value="0">')
  };

  this.menu.appendChild(this.rgbSliders.red);
  this.menu.appendChild(this.rgbSliders.green);
  this.menu.appendChild(this.rgbSliders.blue);

  Object.keys(this.rgbSliders).forEach(function (key) {
    this$1.sliders[key] = new Slider(this$1.rgbSliders[key], {
      gradient: ['#000000', '#FFFFFF'],
      label: false,
      editable: true,
      reverse: true
    });
  });

  // add event listener
  Object.keys(this.rgbSliders).forEach(function (key) {
    this$1.rgbSliders[key].addEventListener('change', function () {
      window.requestAnimationFrame(function () {
        var color = this$1.getColorFromSliders();
        this$1.selectColor(color);
        this$1.updateCursor();
      });
    });
  });
};

Colorpicker.prototype._initRecentColors = function _initRecentColors() {
  var this$1 = this;

  this.recentColors = this.settings.recentColors.colors;
  this.recent = stringToDOM$1('<div class="picker-recent"></div>');

  this.menu.appendChild(this.recent);

  this.recentColors.forEach(function (color) {
    var recentColor = document.createElement('a');
    recentColor.classList.add('picker-color');
    recentColor.style.backgroundColor = color;
    this$1.recent.appendChild(recentColor);
    recentColor.addEventListener('mousedown', function (event) {
      return event.preventDefault();
    });
    recentColor.addEventListener('click', function (event) {
      this$1.selectColor(color);
      this$1.updateCursor();
    });
  });
};

Colorpicker.prototype._initEvents = function _initEvents() {
  var this$1 = this;

  // eslint-disable-next-line
  this.events = [new Event('input'), new Event('change')];

  this.guide.addEventListener('click', function () {
    call(this$1.settings.events.beforeOpen);
    this$1.togglePicker();
  });

  if (this.settings.menu.draggable) {
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
        window.requestAnimationFrame(function () {
          endPosition.x = evnt.clientX;
          endPosition.y = evnt.clientY;
          delta.x = this$1.lastMove.x + endPosition.x - startPosition.x;
          delta.y = this$1.lastMove.y + endPosition.y - startPosition.y;
          this$1.menu.style.transform = "translate(" + delta.x + "px, " + delta.y + "px)";
        });
      };
      var mouseupHandler = function mouseupHandler() {
        this$1.lastMove = delta;
        document.removeEventListener('mousemove', mousemoveHandler);
        document.removeEventListener('mouseup', mouseupHandler);
      };
      document.addEventListener('mousemove', mousemoveHandler);
      document.addEventListener('mouseup', mouseupHandler);
    });
  }

  this.el.addEventListener('focus', function (event) {
    var edit = function edit() {
      this$1.selectColor(this$1.el.value, true);
      this$1.updateCursor();
    };
    var release = function release() {
      this$1.el.removeEventListener('change', edit);
      this$1.el.removeEventListener('blur', release);
    };
    this$1.el.addEventListener('change', edit);
    this$1.el.addEventListener('blur', release);
  });

  this.submit.addEventListener('click', function (event) {
    call(this$1.settings.events.beforeSubmit);
    this$1.selectColor(this$1.el.value);
    this$1.updateCursor();
    if (this$1.settings.menu.hideWhenSubmit) {
      this$1.closePicker();
    }
    this$1.updateRecentColors(this$1.currentColor);
    call(this$1.settings.events.afterSubmit);
  });
};

Colorpicker.prototype.updateWheelColors = function updateWheelColors() {
  var this$1 = this;

  var x = this.circle.xCords;
  var y = this.circle.yCords;
  var radius = this.circle.radius;
  var saturation = this.settings.picker.saturation ? this.saturation.value : 100;
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  for (var angle = 0; angle < 360; angle += 1) {
    var gradient = this$1.ctx.createRadialGradient(x, y, 0, x, y, radius);
    var startAngle = (angle - 2) * Math.PI / 180;
    var endAngle = (angle + 2) * Math.PI / 180;

    this$1.ctx.beginPath();
    this$1.ctx.moveTo(x, y);
    this$1.ctx.arc(x, y, radius, startAngle, endAngle);
    this$1.ctx.closePath();

    gradient.addColorStop(0, "hsl(" + angle + ", " + saturation + "%, 100%)");
    gradient.addColorStop(0.5, "hsl(" + angle + ", " + saturation + "%, 50%)");
    gradient.addColorStop(1, "hsl(" + angle + ", " + saturation + "%, 0%)");
    this$1.ctx.fillStyle = gradient;
    this$1.ctx.fill();
  }
};

Colorpicker.prototype.updateSquareColors = function updateSquareColors() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  this.ctx.fillStyle = this.currentHue;
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  var grdBlack = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
  grdBlack.addColorStop(0, "hsl(0, 0%, 50%)");
  grdBlack.addColorStop(1, "hsla(0, 0%, 50%, 0)");
  this.ctx.fillStyle = grdBlack;
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  var grdWhite = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
  grdWhite.addColorStop(0, "hsl(0, 0%, 100%)");
  grdWhite.addColorStop(0.5, "hsla(0, 0%, 100%, 0)");
  grdWhite.addColorStop(0.5, "hsla(0, 0%, 0%, 0)");
  grdWhite.addColorStop(1, "hsl(0, 0%, 0%) ");
  this.ctx.fillStyle = grdWhite;
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

Colorpicker.prototype.updateRecentColors = function updateRecentColors(newColor) {
  var this$1 = this;

  // update recent color array
  if (!newColor) {
    return;
  }
  if (this.recentColors.length >= this.settings.recentColors.max) {
    this.recentColors.shift();
    this.recent.removeChild(this.recent.firstChild);
  }

  this.recentColors.push(newColor);
  var recentColor = document.createElement('a');
  recentColor.classList.add('picker-color');
  recentColor.style.backgroundColor = newColor;
  this.recent.appendChild(recentColor);
  recentColor.addEventListener('click', function (event) {
    event.preventDefault();
    this$1.selectColor(newColor);
    this$1.updateCursor();
  });
};

Colorpicker.prototype.updateSlidersInputs = function updateSlidersInputs(slider) {
  var cl = this.currentColor;
  this.sliders.red.newGradient(["rgb(0," + cl.green + "," + cl.blue + ")", "rgb(255," + cl.green + "," + cl.blue + ")"]);
  this.sliders.green.newGradient(["rgb(" + cl.red + ",0," + cl.blue + ")", "rgb(" + cl.red + ",255," + cl.blue + ")"]);
  this.sliders.blue.newGradient(["rgb(" + cl.red + "," + cl.green + ",0)", "rgb(" + cl.red + "," + cl.green + ",255)"]);
};

Colorpicker.prototype.updateCursor = function updateCursor(mouse) {
  if (mouse) {
    this.cursor.style.transform = "translate3d(" + mouse.x + "px, " + mouse.y + "px, 0)";
    return;
  }

  var hslColor = toHsl(this.currentColor, true);
  if (this.settings.picker.mode === 'wheel') {
    var r = (100 - hslColor[3]) * (this.settings.picker.radius / 200);
    var ratio = this.settings.picker.radius / 2;
    this.mouse = getCartesianCoords(r, hslColor[1] / 360);
    this.cursor.style.transform = "translate3d(" + (this.mouse.x + ratio) + "px, " + (this.mouse.y + ratio) + "px, 0)";
  }
  if (this.settings.picker.mode === 'square') {
    var x = hslColor[2] / 100 * this.settings.picker.edge;
    var y = (100 - hslColor[3]) / 100 * this.settings.picker.edge;
    this.mouse = { x: x, y: y };
    this.cursor.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
  }
};

Colorpicker.prototype.selectColor = function selectColor(color, mute) {
  var this$1 = this;
  if (mute === void 0) mute = false;

  if (!isAColor(color)) {
    return;
  }
  if (!mute) {
    call(this.settings.events.beforeSelect);
  }

  color = parseColor(color);
  var rgbColor = toRgb(color);
  var hexColor = toHex(color);
  var hslColor = toHsl(color);
  this.el.value = this.settings.model === 'hex' ? hexColor : this.settings.model === 'hsl' ? hslColor : this.settings.model === 'rgb' ? rgbColor : '';

  this.currentColor = rgbColor;
  this.guide.style.color = color;
  this.guide.style.fill = color;
  if (this.settings.rgbSliders) {
    this.sliders.red.update(rgbColor.red, true);
    this.sliders.green.update(rgbColor.green, true);
    this.sliders.blue.update(rgbColor.blue, true);
    this.updateSlidersInputs();
  }
  if (this.settings.picker.mode === 'wheel' && this.settings.picker.saturation) {
    this.sliders.saturation.update(hslColor.sat);
    this.sliders.saturation.newGradient(['#FFFFFF', hexColor[0]]);
  }

  if (this.settings.picker.mode === 'square') {
    this.currentHue = "hsl(" + hslColor.hue + ", 100%, 50%)";
    this.updateSquareColors();
  }

  if (mute) {
    return;
  }
  call(this.settings.events.afterSelect);
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

Colorpicker.prototype.getColorCanvas = function getColorCanvas(mouse, ctx) {
  var imageData = ctx.getImageData(mouse.x, mouse.y, 1, 1).data;
  return "rgb(" + imageData[0] + ", " + imageData[1] + ", " + imageData[2] + ")";
};

Colorpicker.prototype.getMouseCords = function getMouseCords(event) {
  var mouse = {
    x: event.offsetX,
    y: event.offsetY
  };
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
    if (!isElementClosest$1(evnt.target, this$1.menu) && !isElementClosest$1(evnt.target, this$1.guide)) {
      this$1.closePicker();
      return;
    }
    call(this$1.settings.events.clicked);
  };
  this.documentCallback = documentCallback.bind(this);
  document.addEventListener('click', this.documentCallback);
  call(this.settings.events.afterOpen);
};

var Selection = function () {
  function Selection() {
    classCallCheck(this, Selection);
  }

  createClass(Selection, null, [{
    key: 'selectRange',
    value: function selectRange() {
      var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Selection.textRange;

      if (!range) return;
      var sel = Selection.current = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, {
    key: 'selectElement',
    value: function selectElement(el) {
      if (!el) return;
      var range = document.createRange();
      range.selectNodeContents(el);
      var sel = Selection.current = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, {
    key: 'update',
    value: function update() {
      var sel = Selection.current = window.getSelection();
      // check if the range is inside a section
      if (sel.anchorNode && !sel.anchorNode.parentNode.closest('.align-content')) {
        return;
      }
      if (sel.rangeCount && sel.anchorNode.nodeType === 3) {
        Selection.textRange = sel.getRangeAt(0);
      }
      if (sel.rangeCount) {
        Selection.range = sel.getRangeAt(0);
      }
    }
  }]);
  return Selection;
}();

Selection.current = null;
Selection.textRange = null;
Selection.range = null;

var Prompt = function () {
  function Prompt() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$wrapper = _ref.wrapper,
        wrapper = _ref$wrapper === undefined ? document.body : _ref$wrapper,
        _ref$position = _ref.position,
        position = _ref$position === undefined ? null : _ref$position,
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
        if (Selection.range.startContainer.nodeType === 3) {
          this.selectionRefrance = Selection.range;
        }
        if (Selection.range.startContainer.nodeType === 1) {
          this.selectionRefrance = Selection.range.startContainer;
        }
        setTimeout(function () {
          updatePosition(_this.selectionRefrance, _this.el, _this.settings.wrapper, 'left-top');
        }, 1);
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
      }, 1);
    }
  }, {
    key: 'onSubmit',
    value: function onSubmit(func, args) {
      var _this2 = this;

      this.submit.addEventListener('click', function () {
        return func(args);
      });
      this.submit.addEventListener('click', function () {
        return setTimeout(_this2.remove.bind(_this2), 1);
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
    init: Colorpicker,
    initConfig: {
      defaultColor: '#fff',
      mode: 'hex',
      picker: { mode: 'square' },
      disableLum: true,
      guideIcon: '\n        <svg viewBox="0 0 24 24">\n          <path d="M0 20h24v4H0z"/>\n          <path style="fill: currentColor" d="M11 3L5.5 17h2.25l1.12-3h6.25l1.12 3h2.25L13 3h-2zm-1.38 9L12 5.67 14.38 12H9.62z"/>\n        </svg>\n      ',
      events: {
        beforeSubmit: function beforeSubmit() {
          Selection.selectRange();
        },
        afterOpen: function afterOpen() {
          Selection.update();
        },
        afterSelect: function afterSelect() {
          Selection.update();
        }
      }
    }
  },

  backColor: {
    element: 'input',
    type: 'text',
    command: 'backColor',
    tooltip: 'Highlight color',
    useCSS: true,
    init: Colorpicker,
    initConfig: {
      defaultColor: '#fdfdfd',
      mode: 'hex',
      picker: { mode: 'square' },
      disableLum: true,
      guideIcon: '\n        <svg viewBox="0 0 24 24">\n          <path style="fill: currentColor" d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z"/>\n          <path d="M0 20h24v4H0z"/>\n        </svg>\n      ',
      events: {
        beforeSubmit: function beforeSubmit() {
          Selection.selectRange();
        },
        afterOpen: function afterOpen() {
          Selection.update();
        },
        afterSelect: function afterSelect() {
          Selection.update();
        }
      }
    }
  },

  createTable: {
    element: 'button',
    func: 'createTable',
    icon: 'table',
    tooltip: 'Add Table'
  },

  createFigure: {
    element: 'file',
    icon: 'figure',
    func: 'createFigure',
    tooltip: 'Add Figure'
  },

  createPost: {
    element: 'button',
    icon: 'facebook',
    func: 'createPost',
    tooltip: 'Add post'
  },

  createEmbed: {
    element: 'button',
    icon: 'embed',
    func: 'createEmbed',
    tooltip: 'Add embed'
  },

  createColumn: {
    element: 'button',
    icon: 'column',
    func: 'createColumn',
    tooltip: 'Add columns'
  },

  createVideo: {
    element: 'button',
    icon: 'video',
    func: 'createVideo',
    tooltip: 'Add video'
  },

  createLine: {
    element: 'dropdown',
    items: ['<hr class="align-line">', '<hr class="align-line is-dashed">', '<hr class="align-line is-dotted">', '<hr class="align-line is-double">', '<hr class="align-line is-dots">', '<hr class="align-line is-bold">', '<hr class="align-line is-bold is-dashed">', '<hr class="align-line is-bold is-dotted">', '<hr class="align-line is-bold is-double">'],
    icon: 'insertLine',
    func: 'createLine',
    tooltip: 'Add line'
  },

  createLink: {
    element: 'button',
    tooltip: 'Hyperlink',
    func: 'createLink'
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
    tooltip: 'Edit as HTMl',
    icon: 'toggleHTML'
  },

  _remove: {
    element: 'button',
    func: 'remove',
    tooltip: 'Remove section',
    icon: 'remove'
  },

  _sectionUp: {
    element: 'button',
    func: 'moveUp',
    tooltip: 'Move section up',
    icon: 'caretUp'
  },

  _sectionDown: {
    element: 'button',
    func: 'moveDown',
    tooltip: 'Move section down',
    icon: 'caretDown'
  },

  _sectionImage: {
    element: 'file',
    func: 'backgroundImage',
    tooltip: 'Add background image',
    icon: 'image'
  },

  _sectionVideo: {
    element: 'file',
    func: 'backgroundVideo',
    tooltip: 'Add background video',
    icon: 'video'
  },

  _sectionColor: {
    element: 'input',
    type: 'text',
    func: 'backgroundColor',
    tooltip: 'Change background color',
    init: Colorpicker,
    initConfig: {
      defaultColor: '#000000',
      picker: { mode: 'square' },
      mode: 'hex',
      disableLum: true,
      guideIcon: '\n        <svg viewBox="0 0 24 24">\n          <path d="M0 20h24v4H0z"/>\n          <path style="fill: currentColor" d="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z"/>\n        </svg>\n      '
    }
  },

  _tableRowTop: {
    element: 'button',
    func: 'insertRow',
    args: ['before'],
    icon: 'tableRowTop'
  },
  _tableRowBottom: {
    element: 'button',
    func: 'insertRow',
    args: ['after'],
    icon: 'tableRowBottom'
  },
  _tableColumnBefore: {
    element: 'button',
    func: 'insertColumn',
    args: ['before'],
    icon: 'tableColumnBefore'
  },
  _tableColumnAfter: {
    element: 'button',
    func: 'insertColumn',
    args: ['after'],
    icon: 'tableColumnAfter'
  },
  _tableDeleteRow: {
    element: 'button',
    func: 'deleteRow',
    icon: 'tableDeleteRow'
  },
  _tableDeleteColumn: {
    element: 'button',
    func: 'deleteColumn',
    icon: 'tableDeleteColumn'
  }
};

function icons(name) {
  return '\n    <svg class="icon" viewBox="0 0 24 24">\n      <path d="' + iconsPath[name] + '"/>\n    </svg>';
}

var iconsPath = {
  blockquote: 'M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z',

  bold: 'M13.5,15.5H10V12.5H13.5A1.5,1.5 0 0,1 15,14A1.5,1.5 0 0,1 13.5,15.5M10,6.5H13A1.5,1.5 0 0,1 14.5,8A1.5,1.5 0 0,1 13,9.5H10M15.6,10.79C16.57,10.11 17.25,9 17.25,8C17.25,5.74 15.5,4 13.25,4H7V18H14.04C16.14,18 17.75,16.3 17.75,14.21C17.75,12.69 16.89,11.39 15.6,10.79Z',

  fontSize: 'M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z',

  h1: 'M3,4H5V10H9V4H11V18H9V12H5V18H3V4M14,18V16H16V6.31L13.5,7.75V5.44L16,4H18V16H20V18H14Z',

  h2: 'M3,4H5V10H9V4H11V18H9V12H5V18H3V4M21,18H15A2,2 0 0,1 13,16C13,15.47 13.2,15 13.54,14.64L18.41,9.41C18.78,9.05 19,8.55 19,8A2,2 0 0,0 17,6A2,2 0 0,0 15,8H13A4,4 0 0,1 17,4A4,4 0 0,1 21,8C21,9.1 20.55,10.1 19.83,10.83L15,16H21V18Z',

  h3: 'M3,4H5V10H9V4H11V18H9V12H5V18H3V4M15,4H19A2,2 0 0,1 21,6V16A2,2 0 0,1 19,18H15A2,2 0 0,1 13,16V15H15V16H19V12H15V10H19V6H15V7H13V6A2,2 0 0,1 15,4Z',

  h4: 'M3,4H5V10H9V4H11V18H9V12H5V18H3V4M18,18V13H13V11L18,4H20V11H21V13H20V18H18M18,11V7.42L15.45,11H18Z',

  html: 'M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z',

  italic: 'M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z',

  justifyCenter: 'M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z',

  justifyFull: 'M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z',

  justifyLeft: 'M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z',

  justifyRight: 'M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z',

  p: 'M13,4A4,4 0 0,1 17,8A4,4 0 0,1 13,12H11V18H9V4H13M13,10A2,2 0 0,0 15,8A2,2 0 0,0 13,6H11V10H13Z',

  pre: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',

  removeFormat: 'M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM14 5h-3l-1-1H6L5 5H2v2h12z',

  strikeThrough: 'M23,12V14H18.61C19.61,16.14 19.56,22 12.38,22C4.05,22.05 4.37,15.5 4.37,15.5L8.34,15.55C8.37,18.92 11.5,18.92 12.12,18.88C12.76,18.83 15.15,18.84 15.34,16.5C15.42,15.41 14.32,14.58 13.12,14H1V12H23M19.41,7.89L15.43,7.86C15.43,7.86 15.6,5.09 12.15,5.08C8.7,5.06 9,7.28 9,7.56C9.04,7.84 9.34,9.22 12,9.88H5.71C5.71,9.88 2.22,3.15 10.74,2C19.45,0.8 19.43,7.91 19.41,7.89Z',

  text: 'M5 17v2h14v-2H5zm4.5-4.2h5l.9 2.2h2.1L12.75 4h-1.5L6.5 15h2.1l.9-2.2zM12 5.98L13.87 11h-3.74L12 5.98z',

  underline: 'M5,21H19V19H5V21M12,17A6,6 0 0,0 18,11V3H15.5V11A3.5,3.5 0 0,1 12,14.5A3.5,3.5 0 0,1 8.5,11V3H6V11A6,6 0 0,0 12,17Z',

  unorderedList: 'M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z',

  orderedList: 'M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z',

  indent: 'M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z',

  outdent: 'M11 17h10v-2H11v2zm-8-5l4 4V8l-4 4zm0 9h18v-2H3v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z',

  superscript: 'M16 18.6L14.6 20 9 14.4 3.4 20 2 18.6 7.6 13 2 7.4 3.4 6 9 11.6 14.6 6 16 7.4 10.4 13l5.6 5.6zm2.3-14.2c0-.2.1-.4.1-.6.1-.2.2-.3.3-.4.1-.1.3-.2.4-.3.2-.1.4-.1.5-.1.2 0 .3 0 .4.1.1.1.3.1.3.2.1.1.2.2.2.4.1.1.1.3.1.5s-.1.4-.2.6c-.1.2-.2.3-.4.5-.2.1-.4.3-.6.4-.2.1-.5.3-.7.4-.2.1-.5.3-.7.4s-.2.3-.4.5-.3.3-.4.5c-.1.2-.2.4-.2.7V9h5V8h-3.8c.1-.2.3-.4.5-.6.3-.2.6-.4.8-.6s.6-.4.9-.5c.3-.2.6-.4.8-.6s.4-.5.6-.7c.1-.3.2-.6.2-.9 0-.3 0-.5-.1-.8s-.2-.5-.4-.7c-.2-.2-.4-.3-.7-.5-.4 0-.7-.1-1.2-.1-.4 0-.7.1-1 .2s-.6.3-.8.5c-.2.2-.4.5-.5.8-.2.2-.3.5-.3.9h1.3z',

  subscript: 'M16 16.6L14.6 18 9 12.4 3.4 18 2 16.6 7.6 11 2 5.4 3.4 4 9 9.6 14.6 4 16 5.4 10.4 11l5.6 5.6zm2.3.8c0-.2.1-.4.1-.6.1-.2.2-.3.3-.4.1-.1.3-.2.4-.3s.3-.1.5-.1.3 0 .4.1c.1.1.3.1.3.2.1.1.2.2.2.4s.1.3.1.5-.1.4-.2.6c-.1.2-.2.3-.4.5-.2.1-.4.3-.6.4-.2.1-.5.3-.7.4-.2.1-.5.3-.7.4s-.4.3-.6.5c-.2.2-.3.3-.4.5-.1.2-.2.4-.2.6v.9h5v-1H18c.1-.2.3-.4.5-.6.2-.2.5-.4.8-.5s.6-.4.9-.5c.3-.2.6-.4.8-.6s.4-.5.6-.7c.2-.3.2-.6.2-.9 0-.3 0-.5-.1-.8s-.2-.5-.4-.7c-.2-.2-.4-.3-.7-.5-.3-.1-.7-.2-1.1-.2-.4 0-.7.1-1 .2-.3.1-.6.3-.8.5-.2.2-.4.5-.5.8-.1.3-.2.6-.3 1h1.4z',

  createLink: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',

  selectContent: 'M9,9H15V15H9M7,17H17V7H7M15,5H17V3H15M15,21H17V19H15M19,17H21V15H19M19,9H21V7H19M19,21A2,2 0 0,0 21,19H19M19,13H21V11H19M11,21H13V19H11M9,3H7V5H9M3,17H5V15H3M5,21V19H3A2,2 0 0,0 5,21M19,3V5H21A2,2 0 0,0 19,3M13,3H11V5H13M3,9H5V7H3M7,21H9V19H7M3,13H5V11H3M3,5H5V3A2,2 0 0,0 3,5Z',

  insertLine: 'M4 19h6v-2H4v2zM20 5H4v2h16V5zm-3 6H4v2h13.25c1.1 0 2 .9 2 2s-.9 2-2 2H15v-2l-3 3 3 3v-2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4z',

  undo: 'M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z',

  redo: 'M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z',

  plus: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',

  video: 'M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z',

  image: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',

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

  column: 'M16,5V18H21V5M4,18H9V5H4M10,18H15V5H10V18Z',

  delete: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z',

  facebook: 'M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M18,5H15.5A3.5,3.5 0 0,0 12,8.5V11H10V14H12V21H15V14H18V11H15V9A1,1 0 0,1 16,8H18V5Z',

  twitter: '"M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M17.71,9.33C18.19,8.93 18.75,8.45 19,7.92C18.59,8.13 18.1,8.26 17.56,8.33C18.06,7.97 18.47,7.5 18.68,6.86C18.16,7.14 17.63,7.38 16.97,7.5C15.42,5.63 11.71,7.15 12.37,9.95C9.76,9.79 8.17,8.61 6.85,7.16C6.1,8.38 6.75,10.23 7.64,10.74C7.18,10.71 6.83,10.57 6.5,10.41C6.54,11.95 7.39,12.69 8.58,13.09C8.22,13.16 7.82,13.18 7.44,13.12C7.81,14.19 8.58,14.86 9.9,15C9,15.76 7.34,16.29 6,16.08C7.15,16.81 8.46,17.39 10.28,17.31C14.69,17.11 17.64,13.95 17.71,9.33Z',

  embed: 'M12.89,3L14.85,3.4L11.11,21L9.15,20.6L12.89,3M19.59,12L16,8.41V5.58L22.42,12L16,18.41V15.58L19.59,12M1.58,12L8,5.58V8.41L4.41,12L8,15.58V18.41L1.58,12',

  tableRowTop: 'M22,14A2,2 0 0,0 20,12H4A2,2 0 0,0 2,14V21H4V19H8V21H10V19H14V21H16V19H20V21H22V14M4,14H8V17H4V14M10,14H14V17H10V14M20,14V17H16V14H20M11,10H13V7H16V5H13V2H11V5H8V7H11V10Z',

  tableRowBottom: 'M22,10A2,2 0 0,1 20,12H4A2,2 0 0,1 2,10V3H4V5H8V3H10V5H14V3H16V5H20V3H22V10M4,10H8V7H4V10M10,10H14V7H10V10M20,10V7H16V10H20M11,14H13V17H16V19H13V22H11V19H8V17H11V14Z',

  tableColumnBefore: 'M13,2A2,2 0 0,0 11,4V20A2,2 0 0,0 13,22H22V2H13M20,10V14H13V10H20M20,16V20H13V16H20M20,4V8H13V4H20M9,11H6V8H4V11H1V13H4V16H6V13H9V11Z',

  tableColumnAfter: 'M11,2A2,2 0 0,1 13,4V20A2,2 0 0,1 11,22H2V2H11M4,10V14H11V10H4M4,16V20H11V16H4M4,4V8H11V4H4M15,11H18V8H20V11H23V13H20V16H18V13H15V11Z',

  tableDeleteColumn: 'M4,2H11A2,2 0 0,1 13,4V20A2,2 0 0,1 11,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2M4,10V14H11V10H4M4,16V20H11V16H4M4,4V8H11V4H4M17.59,12L15,9.41L16.41,8L19,10.59L21.59,8L23,9.41L20.41,12L23,14.59L21.59,16L19,13.41L16.41,16L15,14.59L17.59,12Z',

  tableDeleteRow: 'M9.41,13L12,15.59L14.59,13L16,14.41L13.41,17L16,19.59L14.59,21L12,18.41L9.41,21L8,19.59L10.59,17L8,14.41L9.41,13M22,9A2,2 0 0,1 20,11H4A2,2 0 0,1 2,9V6A2,2 0 0,1 4,4H20A2,2 0 0,1 22,6V9M4,9H8V6H4V9M10,9H14V6H10V9M16,9H20V6H16V9Z',

  remove: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z',

  caretUp: 'M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z',

  caretDown: 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z',

  toggleHTML: 'M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z'
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
function select$2(name, options) {
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

function dropdown(name, itemsContent, callbackFunc) {
  var dropdown = document.createElement('div');
  var menu = document.createElement('div');
  var tempPrefix = NAMING_PREFIX;
  NAMING_PREFIX = 'dropdown-';
  var dropdownButton = button(name);
  NAMING_PREFIX = tempPrefix;
  var items = [];
  var icon = '\n    <svg viewBox="0 0 24 24" class="dropdown-caret">\n      <polygon points="6,10 12,17 18,10 "/>\n    </svg>';

  dropdown.classList.add('dropdown');
  dropdown.id = name;
  menu.classList.add('dropdown-menu');
  itemsContent.forEach(function (content) {
    var itemElement = document.createElement('a');
    itemElement.classList.add('dropdown-item');
    itemElement.addEventListener('click', function () {
      return callbackFunc(content);
    });
    items.push(itemElement);
    itemElement.innerHTML = content;
    menu.appendChild(itemElement);
  });
  dropdownButton.insertAdjacentHTML('beforeend', icon);
  dropdownButton.addEventListener('click', function () {
    return dropdown.classList.toggle('is-active');
  });
  dropdown.appendChild(dropdownButton);
  dropdown.appendChild(menu);
  return {
    dropdown: dropdown,
    items: items
  };
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
        theme = _ref$theme === undefined ? 'light' : _ref$theme,
        _ref$position = _ref.position,
        position = _ref$position === undefined ? 'center-top' : _ref$position;

    classCallCheck(this, Styler);

    this.$align = align;
    this.settings = {
      mode: mode,
      commands: commands,
      hideWhenClickOut: hideWhenClickOut,
      tooltip: tooltip,
      theme: theme,
      position: position
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
      this.el = document.createElement('div');
      this.menu = document.createElement('ul');
      this.el.classList.add('styler', 'is-' + this.settings.mode, 'is-' + this.settings.theme);
      this.el.appendChild(this.menu);
      this.menu.classList.add('styler-menu');
      this.cmds = {};
      this.visiable = false;

      this.settings.commands.forEach(function (command) {
        _this.generateCmdElement(command);
      });
      this.$align.el.appendChild(this.el);
      if (this.settings.mode === 'bubble') {
        this._initBubble();
      }
      if (this.settings.mode === 'creator') {
        this._initCreator();
      }
      if (this.settings.hideWhenClickOut) {
        this.clickCallback = function (event) {
          if (isElementClosest(event.target, _this.el) || isElementClosest(event.target, _this.currentItem.el)) {
            return;
          }
          _this.hide();
        };
      }
    }
  }, {
    key: '_initBubble',
    value: function _initBubble() {
      var _this2 = this;

      this.el.classList.add('is-hidden');
      this.currentPosition = null;
      var ticking = false;
      this.bubbleScrollCallback = function () {
        _this2.scrollY = window.scrollY;
        if (!ticking) {
          window.requestAnimationFrame(function () {
            if (!_this2.currentPosition) {
              _this2.updateBubble();
            }
            ticking = false;
          });
          ticking = true;
        }
      };
    }
  }, {
    key: '_initCreator',
    value: function _initCreator() {
      var _this3 = this;

      this.toggleButton = button('plus');
      this.toggleButton.addEventListener('click', function () {
        _this3.el.classList.toggle('is-active');
      });
      this.el.insertBefore(this.toggleButton, this.menu);
      this.hide();
    }
  }, {
    key: 'generateCmdElement',
    value: function generateCmdElement(command) {
      var _this4 = this;

      var li = document.createElement('li');
      var cmd = typeof command === 'string' ? command : Object.keys(command)[0];
      var cmdSchema = this.cmdsSchema[cmd];
      if (!cmdSchema) {
        console.warn(cmd + ' is not found');
        return;
      }

      var currentCmd = this.cmds[cmd] = { schema: cmdSchema };
      var icon = cmdSchema.icon || cmd;
      switch (cmdSchema.element) {
        case 'button':
          currentCmd.el = button(icon, this.getTooltip(cmdSchema));
          currentCmd.el.addEventListener('click', function () {
            return _this4.cmdCallback(cmdSchema, cmdSchema.value);
          });
          li.appendChild(currentCmd.el);
          break;

        case 'file':
          var fileBtn = fileButton(icon, this.getTooltip(cmdSchema));
          currentCmd.el = fileBtn.input;
          currentCmd.el.addEventListener('change', function (event) {
            _this4.cmdCallback(cmdSchema, event);
          });
          li.appendChild(fileBtn.el);
          break;

        case 'input':
          currentCmd.el = input(icon, cmdSchema.type, this.getTooltip(cmdSchema));
          currentCmd.el.addEventListener('change', function () {
            _this4.cmdCallback(cmdSchema, currentCmd.el.value);
          });
          li.appendChild(currentCmd.el);
          break;

        case 'select':
          var selectWrapper = select$2(icon, command[cmd]);
          var temp = currentCmd.el = selectWrapper.querySelector('select');
          temp.addEventListener('change', function () {
            return _this4.cmdCallback(cmdSchema, temp[temp.selectedIndex].value);
          });
          li.appendChild(selectWrapper);
          break;

        case 'dropdown':
          var ddown = dropdown(icon, cmdSchema.items, function (value) {
            return _this4.cmdCallback(cmdSchema, value);
          });
          li.appendChild(ddown.dropdown);

          break;

        case 'styling':
          li.classList.add(cmdSchema.class);
          break;

        case 'custom':
          var markup = cmdSchema.create(this);
          li.appendChild(markup);
          break;

        case 'classes':
          currentCmd.el = document.createElement('ul');
          command[cmd].forEach(function (className) {
            var li = menuButton('' + cmdSchema.command + camelCase(className), function () {
              _this4.toggleClass('is-' + className, command[cmd]);
            }, camelCase(cmdSchema.command) + ' ' + className);
            currentCmd.el.appendChild(li);
          });
          li.appendChild(currentCmd.el);
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

      this.menu.appendChild(li);
    }
  }, {
    key: 'cmdCallback',
    value: function cmdCallback(cmdSchema, value) {
      if (cmdSchema.command) {
        this.execute(cmdSchema.command, value, cmdSchema.useCSS);
      }
      if (typeof cmdSchema.func === 'string') {
        var callbackFunc = this.$align[cmdSchema.func] ? this.$align[cmdSchema.func].bind(this.$align) : this.currentItem[cmdSchema.func].bind(this.currentItem);
        callbackFunc(this, value || cmdSchema);
      }
      if (typeof cmdSchema.func === 'function') {
        cmdSchema.func(this, value || cmdSchema);
      }
      this.update();
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
    key: 'updateBubble',
    value: function updateBubble(newPosition) {
      if (Selection.range && !Selection.range.collapsed && Selection.range === Selection.current.getRangeAt(0) || this.currentItem) {
        var element = this.currentItem ? this.currentItem.el : Selection.range;
        this.currentPosition = updatePosition(element, this.el, this.$align.el, newPosition || this.settings.position);
        this.show();
        return;
      }
      this.hide();
    }
  }, {
    key: 'updateCreator',
    value: function updateCreator(newPosition) {
      if (Selection.range && Selection.range.collapsed && Selection.range.startContainer.nodeType === 1 && Selection.range.startContainer.childNodes.length <= 1) {
        this.position = updatePosition(Selection.range.startContainer, this.el, this.$align.el, newPosition || this.settings.position);
        this.show();
        return;
      }
      this.hide();
    }
  }, {
    key: 'show',
    value: function show() {
      var _this5 = this;

      if (this.visiable) {
        return;
      }
      this.visiable = true;
      this.el.style.transition = 'opacity 0.2s';
      this.el.classList.add('is-visible');
      this.el.classList.remove('is-hidden');
      setTimeout(function () {
        _this5.el.style.transition = '';
      });
      if (this.settings.hideWhenClickOut) {
        document.addEventListener('click', this.clickCallback);
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (this.currentItem) {
        this.currentItem.el.classList.remove('is-active');
        this.currentItem = null;
      }
      this.el.classList.remove('is-visible');
      this.el.classList.remove('is-active');
      this.el.classList.add('is-hidden');
      this.visiable = false;
      if (this.settings.hideWhenClickOut) {
        document.removeEventListener('click', this.clickCallback);
      }
    }
  }, {
    key: 'update',
    value: function update(item) {
      if (this.currentItem) {
        this.currentItem.el.classList.remove('is-active');
      }
      if (item) {
        this.currentItem = item;
        this.currentItem.el.classList.add('is-active');
      }
      this.updateCommandsStates();
      if (this.settings.mode === 'bubble') {
        this.updateBubble();
      }
      if (this.settings.mode === 'creator') {
        this.updateCreator();
      }
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
      var _this6 = this;

      Object.keys(this.cmds).forEach(function (cmd) {
        var currentCmd = _this6.cmds[cmd];
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
          var selectedElement = Selection.current.anchorNode.type === 1 ? Selection.current.anchorNode : Selection.current.anchorNode.parentNode;
          if (selectedElement.closest('.align-content')) {
            document.queryCommandValue(command);
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
      this.update();
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
        Table.$optionsBar.update(_this);
      });
    }
  }, {
    key: 'remove',
    value: function remove() {
      Table.$optionsBar.hide();
      this.el.remove();
    }
  }, {
    key: 'insertRow',
    value: function insertRow($styler, $schema) {
      var position = $schema.args[0];
      var columnsLength = this.el.rows[0].cells.length;
      var newIndex = this.activeCell.parentNode.rowIndex + (position === 'after' ? 1 : 0);
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
      this.$align = align;
      this.$optionsBar = new Styler(align, Object.assign({
        mode: 'bubble',
        hideWhenClickOut: true,
        commands: ['_tableRowTop', '_tableRowBottom', '_tableColumnBefore', '_tableColumnAfter', 'separator', '_tableDeleteRow', '_tableDeleteColumn', 'separator', '_remove'],
        tooltip: true
      }, settings));
    }
  }]);
  return Table;
}();

var Section = function () {
  function Section(content, position) {
    var _this = this;

    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'text';
    classCallCheck(this, Section);

    if (content && content.nodeName === 'BR') {
      return;
    }
    this.id = Section.id++;
    this.type = type;
    this.isHTMLView = false;
    this.generateEl(content);
    if (type === 'text') {
      this.el.addEventListener('click', function () {
        Section.$align.activeSection = _this.el;
        Section.$optionsBar.update(_this);
      });
    }
    if ((typeof position === 'undefined' ? 'undefined' : _typeof(position)) === 'object') {
      Section.$align.editor.insertBefore(this.el, position);
      return;
    }
    Section.$align.editor.appendChild(this.el);
    Section.allSections.push(this);
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
          if (this.contentDiv.querySelector('pre[data-align-html]')) {
            content = this.contentDiv.innerText;
          }
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

      return Section.allSections.findIndex(function (el) {
        return el === _this3;
      });
    }
  }, {
    key: 'toggleHTML',
    value: function toggleHTML() {
      if (!this.isHTMLView) {
        this.isHTMLView = true;
        var content = document.createTextNode(this.contentDiv.innerHTML);
        var pre = document.createElement('pre');

        this.contentDiv.innerHTML = '';
        pre.dataset.alignHtml = true;
        pre.appendChild(content);
        this.contentDiv.appendChild(pre);
        Section.$align.highlight();
        return;
      }
      this.generateEl(this.el);
      this.contentDiv.focus();
      this.isHTMLView = false;
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

      var url = window.URL.createObjectURL(event.target.files[0]);
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
      if (!this.el.previousSibling || Section.allSections[index - 1].type === 'title') return;

      Section.$align.editor.insertBefore(this.el, Section.allSections[index - 1].el);
      swapArrayItems(Section.allSections, index, index - 1);
    }
  }, {
    key: 'moveDown',
    value: function moveDown() {
      var index = this.getIndex();
      if (!this.el.nextSibling) return;
      Section.$align.editor.insertBefore(this.el, Section.allSections[index + 1].el.nextSibling);
      swapArrayItems(Section.allSections, index, index + 1);
    }
  }, {
    key: 'active',
    value: function active() {
      Section.$optionsBar.update(this);
      this.el.focus();
    }
  }, {
    key: 'remove',
    value: function remove() {
      Section.$optionsBar.hide();
      this.el.remove();
      Section.allSections.splice(this.getIndex(), 1);
    }
  }, {
    key: 'content',
    get: function get$$1() {
      var output = void 0;
      if (this.type === 'text') {
        output = this.el.cloneNode(true);
        var addButton = output.querySelector('.align-newSection');
        var contentDiv = output.querySelector('.align-content');
        if (this.isHTMLView) {
          contentDiv.innerHTML = contentDiv.innerText;
        }
        output.classList.remove('is-active');
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
      this.$align = align;
      this.$optionsBar = new Styler(align, Object.assign({
        mode: 'bubble',
        hideWhenClickOut: true,
        commands: ['_sectionUp', '_sectionDown', '_sectionColor', '_sectionImage', '_sectionVideo', '_sectionToggleHTML', { '_sectionClasses': ['normal', 'full'] }, '_remove'],
        tooltip: true,
        position: 'left-top'
      }, settings));
    }
  }]);
  return Section;
}();

Section.id = 0;
Section.allSections = [];

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
    value: function once(eventName, callbackFunc) {
      var _this2 = this;

      var idx = this.events.eventName ? this.events[eventName].length : 0;
      var cb = function cb() {
        callbackFunc.apply(undefined, arguments);
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
      this.figureOptions = new Styler(this, {
        mode: 'bubble',
        hideWhenClickOut: true,
        commands: [{ '_figureClasses': ['floatLeft', 'center', 'floatRight', 'full'] }, '_remove'],
        tooltip: true
      });
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
        this.settings.creator.mode = 'creator';
        this.settings.creator.position = 'middle-left';
        this.creator = new Styler(this, this.settings.creator);
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
      Selection.update();
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
        setTimeout(_this2.update.bind(_this2), 1);
      }, true);
    }

    /**
     * Hight light code text
     */
    /* eslint-disable */

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
    /* eslint-enable */

    /**
     * Toggle on/off HTML
     */

  }, {
    key: 'toggleFullScreen',
    value: function toggleFullScreen() {
      var state = document.fullscreenElement || document.webkitIsFullScreen;
      console.log(this);
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
    value: function update(evet) {
      var _this3 = this;

      Selection.update();
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
    key: 'createFigure',
    value: function createFigure(styler, event) {
      var _this4 = this;

      var input = event.target;
      var file = input.files[0];
      if (!file || !Selection.range) return;
      var reader = new FileReader(); // eslint-disable-line
      var figure = document.createElement('figure');
      var caption = document.createElement('figcaption');
      var img = document.createElement('img');

      figure.contentEditable = false;
      caption.contentEditable = true;
      caption.dataset.defaultValue = 'Figure caption';
      img.classList.add('align-image');
      figure.classList.add('align-figure', 'is-center');
      figure.appendChild(img);
      figure.appendChild(caption);
      figure.addEventListener('click', function () {
        return _this4.figureOptions.update({
          el: figure,
          remove: function remove() {
            figure.remove();
          }
        });
      }, false);
      reader.addEventListener('load', function () {
        img.src = reader.result;
        img.dataset.alignFilename = file.name;
        var update = function update(src) {
          img.src = src;
        };
        _this4.$bus.emit('imageAdded', { file: file, update: update });
      });
      reader.readAsDataURL(file);
      input.value = null;
      Selection.range.insertNode(figure);
    }
  }, {
    key: 'createVideo',
    value: function createVideo() {
      var prompt = new Prompt('Enter video link:', '', {
        wrapper: this.el,
        position: this.position
      });
      prompt.onSubmit(function () {
        var link = prompt.inputs[0].value;
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

        Selection.range.insertNode(iframe);
      });
    }
  }, {
    key: 'createColumn',
    value: function createColumn() {
      var prompt = new Prompt('Enter columns count:', '', {
        wrapper: this.el,
        position: this.position,
        inputsCount: 1
      });
      prompt.onSubmit(function () {
        var grid = stringToDOM('<div class="align-grid">\n        ' + '<div class="align-column"><br></div>'.repeat(prompt.inputs[0].value) + '\n      </div>');
        console.log(Selection.range);
        Selection.range.insertNode(grid);
      });
    }
  }, {
    key: 'createTable',
    value: function createTable() {
      var prompt = new Prompt('Enter post link:', '', {
        wrapper: this.el,
        inputsCount: 2,
        inputsPlaceholders: ['rows', 'columns']
      });
      prompt.onSubmit(function () {
        var table = new Table({
          rows: prompt.inputs[0].value,
          columns: prompt.inputs[1].value
        }).el;
        Selection.range.insertNode(table);
      });
    }
  }, {
    key: 'createLine',
    value: function createLine(styler, line) {
      Selection.range.insertNode(stringToDOM(line));
    }
  }, {
    key: 'createPost',
    value: function createPost() {
      var prompt = new Prompt('Enter post link:', '', {
        wrapper: this.el,
        position: this.position
      });
      prompt.onSubmit(function () {
        var postUrl = prompt.inputs[0].value;
        if (!postUrl) return;
        var iframe = document.createElement('iframe');

        iframe.width = 500;
        iframe.height = 200;
        iframe.scrolling = 'no';
        iframe.contentEditable = false;
        iframe.allowTransparency = true;
        iframe.src = '//www.facebook.com/plugins/post.php?href=' + postUrl;
        Selection.range.insertNode(iframe);
      });
    }
  }, {
    key: 'createEmbed',
    value: function createEmbed() {
      var prompt = new Prompt('Add embeded:', '', {
        wrapper: this.el,
        position: this.position
      });
      prompt.onSubmit(function () {
        var data = prompt.inputs[0].value;
        if (!data) return;
        var div = document.createElement('div');
        div.insertAdjacentHTML('afterbegin', data);

        Selection.range.insertNode(div);
      });
    }
  }, {
    key: 'createLink',
    value: function createLink() {
      var _this5 = this;

      var prompt = new Prompt('Enter link:', Selection.current.toString(), {
        wrapper: this.el,
        position: this.position
      });
      prompt.onSubmit(function () {
        var link = prompt.inputs[0].value;
        if (!link) return;
        Selection.selectRange();
        _this5.execute('createLink', link);
      });
    }
  }, {
    key: 'content',
    get: function get$$1() {
      return Section.allSections.reduce(function (acc, section) {
        if (section.type !== 'text') {
          return acc;
        }
        acc += section.content;
        return acc;
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
