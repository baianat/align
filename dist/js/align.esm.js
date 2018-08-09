/**
    * v0.0.35
    * (c) 2018 Baianat
    * @license MIT
    */
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

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
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

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

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

function updatePosition(reference, element) {
  var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'middle-left';

  if (typeof reference.getBoundingClientRect !== 'function') return;
  var wrapper = element.parentNode;
  var modes = mode.split('-');
  var refRect = reference.getBoundingClientRect();
  var elmRect = element.getBoundingClientRect();
  var wrapperRect = wrapper.getBoundingClientRect();
  var wrapperScroll = wrapper.scrollTop;
  var position = { x: 0, y: 0 };
  var startBoundary = 0;
  var endBoundary = wrapperRect.width - elmRect.width;
  modes.forEach(function (mode) {
    switch (mode) {
      case 'center':
        position.x = refRect.left - wrapperRect.left + refRect.width / 2 - elmRect.width / 2;
        break;
      case 'left':
        position.x = refRect.left - wrapperRect.left;
        break;
      case 'right':
        position.x = refRect.left - wrapperRect.left - refRect.width;
        break;
      case 'middle':
        position.y = refRect.top - wrapperRect.top + wrapperScroll + refRect.height / 2 - elmRect.height / 2;
        break;
      case 'top':
        position.y = refRect.top - wrapperRect.top + wrapperScroll - elmRect.height;
        break;
      case 'bottom':
        position.y = refRect.bottom - wrapperRect.top + wrapperScroll;
        break;
    }
  });
  position.x = normalizeNumber(position.x, startBoundary, endBoundary);
  element.style.transform = 'translate(' + position.x + 'px, ' + position.y + 'px)';

  return position;
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
      var sel = Selection.current;
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, {
    key: 'selectElement',
    value: function selectElement(el) {
      if (!el) return;
      var range = document.createRange();
      range.selectNodeContents(el);
      var sel = Selection.current;
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, {
    key: 'clear',
    value: function clear() {
      var sel = Selection.current;
      sel.empty();
    }
  }, {
    key: 'update',
    value: function update() {
      var sel = Selection.current;
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
  }, {
    key: 'current',

    /* eslint-enable */

    get: function get$$1() {
      return Selection._current || window.getSelection();
    }
    /* eslint-disable */

  }]);
  return Selection;
}();

Selection._current = null;
Selection.textRange = null;
Selection.range = null;

var Component = function () {
  function Component(el) {
    classCallCheck(this, Component);

    this.$align = Component.$align;
    this.mode = el ? el.nodeType === 1 ? 'edit' : 'create' : 'create';
  }

  createClass(Component, [{
    key: 'remove',
    value: function remove() {
      var p = document.createElement('p');
      this.el.parentNode.replaceChild(p, this.el);
      this.el.remove();
      if (this.toolbar) {
        this.toolbar.remove();
      }
    }
  }], [{
    key: 'config',
    value: function config(align) {
      this.$align = align;
    }
  }, {
    key: 'add',
    value: function add() {
      return false;
    }
  }]);
  return Component;
}();

Component.list = [];

var Prompt = function () {
  function Prompt(align, settings) {
    classCallCheck(this, Prompt);

    this.settings = Object.assign({}, Prompt.defaults, settings);
    this.$align = align;
    this._init(this.settings.message, this.settings.data);
  }

  createClass(Prompt, [{
    key: '_init',
    value: function _init(message, data) {
      var _this = this;

      var position = this.settings.position;
      this.el = document.createElement('div');
      this.message = document.createElement('label');
      this.inputs = [];
      this.buttons = {};

      this.el.classList.add('prompt');
      this.message.classList.add('prompt-message');

      if (position) {
        this.el.style.left = position.left + 'px';
        this.el.style.top = position.top + 'px';
      }
      if (!position) {
        this.el.style.opacity = 0;
        if (Selection.range.startContainer.nodeType === 3) {
          this.selectionReference = Selection.range;
        }
        if (Selection.range.startContainer.nodeType === 1) {
          this.selectionReference = Selection.range.startContainer;
        }
        setTimeout(function () {
          updatePosition(_this.selectionReference, _this.el, 'left-top');
          _this.el.style.opacity = '';
        }, 1);
      }
      this.message.innerText = message;

      this.el.appendChild(this.message);
      for (var i = 0; i < this.settings.inputsCount; i++) {
        this.inputs[i] = document.createElement('input');
        this.inputs[i].type = this.settings.inputsTypes[i] || 'text';
        this.inputs[i].classList.add('prompt-input');
        if (this.settings.inputsPlaceholders[i]) {
          this.inputs[i].placeholder = this.settings.inputsPlaceholders[i];
        }
        this.el.appendChild(this.inputs[i]);
      }

      this.inputs[0].value = data;

      this.$align.wrapper.appendChild(this.el);
      this.callbackFunc = function (event) {
        if (isElementClosest(event.target, _this.el)) {
          return;
        }
        _this.remove();
      };
      setTimeout(function () {
        document.addEventListener('click', _this.callbackFunc);
      }, 1);
    }
  }, {
    key: 'on',
    value: function on(name, func, args) {
      var _this2 = this;

      this.buttons[name] = document.createElement('button');
      this.buttons[name].classList.add('prompt-button');
      this.buttons[name].innerText = name;
      this.buttons[name].addEventListener('click', function () {
        func(args);
        _this2.remove();
      });
      this.el.appendChild(this.buttons[name]);
      return this;
    }
  }, {
    key: 'onSubmit',
    value: function onSubmit(func, args) {
      return this.on('submit', func, args);
    }
  }, {
    key: 'onDelete',
    value: function onDelete(func, args) {
      return this.on('delete', func, args);
    }
  }, {
    key: 'onCancel',
    value: function onCancel(func, args) {
      return this.on('cancel', func, args);
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.el.remove();
      document.removeEventListener('click', this.callbackFunc);
    }
  }]);
  return Prompt;
}();

Prompt.defaults = {
  message: '',
  data: '',
  position: null,
  inputsCount: 1,
  inputsTypes: [],
  inputsPlaceholders: []
};

var Link = function (_Component) {
  inherits(Link, _Component);

  function Link(link) {
    classCallCheck(this, Link);

    var _this = possibleConstructorReturn(this, (Link.__proto__ || Object.getPrototypeOf(Link)).call(this, link));

    if (_this.mode === 'create') {
      _this.el = document.createElement('a');
      _this.el.appendChild(Selection.range.extractContents());
      Selection.range.insertNode(_this.el);
    }
    if (_this.mode === 'edit') {
      _this.el = link;
    }

    _this._init(link);
    return _this;
  }

  createClass(Link, [{
    key: '_init',
    value: function _init() {
      this.el.target = '_blank';
      this.el.addEventListener('click', this.edit.bind(this));
    }
  }, {
    key: 'edit',
    value: function edit() {
      var _this2 = this;

      var prompt = new Prompt(this.$align, {
        message: 'Enter link:',
        data: this.el.getAttribute('href')
      });
      prompt.on('save', function () {
        var link = prompt.inputs[0].value;
        if (!link) return;
        _this2.update(link);
      });
      if (this.el.href) {
        prompt.on('remove', function () {
          _this2.remove();
        });
      }
    }
  }, {
    key: 'update',
    value: function update(link) {
      this.el.href = link;
    }
  }, {
    key: 'remove',
    value: function remove() {
      var content = this.el.innerHTML;
      this.el.insertAdjacentHTML('beforebegin', content);
      get(Link.prototype.__proto__ || Object.getPrototypeOf(Link.prototype), 'remove', this).call(this);
    }
  }], [{
    key: 'add',
    value: function add() {
      return new Promise(function (resolve, reject) {
        var link = new Link();
        link.edit();
        // to stop align from adding element to DOM
        resolve({});
      });
    }
  }]);
  return Link;
}(Component);

Link.schema = {
  tooltip: 'Hyperlink',
  icon: 'link'
};

var cmdsSchema = {
  sidebar: {
    element: 'button',
    tooltip: 'Show sidebar',
    func: 'toggleSidebar',
    icon: 'gear'
  },

  bold: {
    element: 'button',
    command: 'bold',
    tooltip: 'Bold',
    shortcut: {
      cmdKey: true,
      key: 'B'
    }
  },

  italic: {
    element: 'button',
    command: 'italic',
    tooltip: 'Italic',
    shortcut: {
      cmdKey: true,
      key: 'I'
    }
  },

  underline: {
    element: 'button',
    command: 'underline',
    tooltip: 'Underline',
    shortcut: {
      cmdKey: true,
      key: 'U'
    }
  },

  strikeThrough: {
    element: 'button',
    command: 'strikeThrough',
    tooltip: 'Strike through'
  },

  undo: {
    element: 'button',
    command: 'undo',
    tooltip: 'Undo',
    shortcut: {
      cmdKey: true,
      key: 'Z'
    }
  },

  redo: {
    element: 'button',
    command: 'redo',
    tooltip: 'Redo',
    shortcut: {
      cmdKey: true,
      shiftKey: true,
      key: 'Z'
    }
  },

  removeFormat: {
    element: 'button',
    command: 'removeFormat',
    tooltip: 'Remove format',
    shortcut: {
      cmdKey: true,
      key: '\\'
    }
  },

  justifyLeft: {
    element: 'button',
    command: 'justifyLeft',
    tooltip: 'Align left',
    shortcut: {
      cmdKey: true,
      key: 'L'
    }
  },

  justifyCenter: {
    element: 'button',
    command: 'justifyCenter',
    tooltip: 'Align center',
    shortcut: {
      cmdKey: true,
      key: 'E'
    }
  },

  justifyRight: {
    element: 'button',
    command: 'justifyRight',
    tooltip: 'Align right',
    shortcut: {
      cmdKey: true,
      key: 'R'
    }
  },

  selectContent: {
    element: 'button',
    tooltip: 'Select all content',
    shortcut: {
      cmdKey: true,
      shiftKey: true,
      key: 'A'
    },
    func: function func(styler) {
      Selection.selectElement(styler.$align.editor);
    }
  },

  justifyFull: {
    element: 'button',
    command: 'justifyFull',
    tooltip: 'Justify full',
    shortcut: {
      cmdKey: true,
      key: 'J'
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

  indent: {
    element: 'button',
    command: 'indent',
    useCSS: true,
    tooltip: 'Indent',
    shortcut: {
      key: 'TAB'
    }
  },

  outdent: {
    element: 'button',
    command: 'outdent',
    useCSS: true,
    tooltip: 'Outdent',
    shortcut: {
      shiftKey: true,
      key: 'TAB'
    }
  },

  superscript: {
    element: 'button',
    command: 'superscript',
    tooltip: 'Superscript',
    shortcut: {
      cmdKey: true,
      shiftKey: true,
      key: '+'
    }
  },

  subscript: {
    element: 'button',
    command: 'subscript',
    tooltip: 'Subscript',
    shortcut: {
      cmdKey: true,
      key: '='
    }
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

  addLink: {
    element: 'button',
    icon: 'link',
    func: 'addElement',
    args: Link
  },

  fullscreen: {
    element: 'button',
    func: 'toggleFullScreen',
    tooltip: 'Fullscreen',
    shortcut: {
      cmdKey: true,
      shiftKey: true,
      key: 'F'
    }
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
      guideIcon: '\n        <svg viewBox="0 0 24 24">\n          <path d="M0 20h24v4H0z"/>\n          <path style="fill: currentColor" d="M11 3L5.5 17h2.25l1.12-3h6.25l1.12 3h2.25L13 3h-2zm-1.38 9L12 5.67 14.38 12H9.62z"/>\n        </svg>\n      ',
      events: {
        beforeSubmit: function beforeSubmit() {
          Selection.selectRange();
        },
        afterOpen: function afterOpen() {
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

  remove: {
    element: 'button',
    func: 'remove',
    tooltip: 'Remove element',
    icon: 'remove'
  },

  // internal functions don't override it
  _sectionUp: {
    element: 'button',
    func: 'moveUp',
    tooltip: 'Move up',
    icon: 'caretUp'
  },

  _sectionDown: {
    element: 'button',
    func: 'moveDown',
    tooltip: 'Move down',
    icon: 'caretDown'
  },

  _sectionToggleHTML: {
    element: 'button',
    func: 'toggleHTML',
    tooltip: 'Edit as HTMl',
    icon: 'toggleHTML'
  },

  _sectionDuplicate: {
    element: 'button',
    func: 'duplicate',
    tooltip: 'Duplicate section',
    icon: 'duplicate'
  },

  _columnColor: {
    element: 'input',
    type: 'text',
    func: 'columnColor',
    tooltip: 'Change background color',
    init: Colorpicker,
    initConfig: {
      defaultColor: '#000000',
      picker: { mode: 'square' },
      mode: 'hex',
      guideIcon: '\n        <svg viewBox="0 0 24 24">\n          <path d="M0 20h24v4H0z"/>\n          <path style="fill: currentColor" d="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z"/>\n        </svg>\n      '
    }
  }
};

var icons = new Proxy({
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

  link: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',

  selectContent: 'M9,9H15V15H9M7,17H17V7H7M15,5H17V3H15M15,21H17V19H15M19,17H21V15H19M19,9H21V7H19M19,21A2,2 0 0,0 21,19H19M19,13H21V11H19M11,21H13V19H11M9,3H7V5H9M3,17H5V15H3M5,21V19H3A2,2 0 0,0 5,21M19,3V5H21A2,2 0 0,0 19,3M13,3H11V5H13M3,9H5V7H3M7,21H9V19H7M3,13H5V11H3M3,5H5V3A2,2 0 0,0 3,5Z',

  line: 'M4 19h6v-2H4v2zM20 5H4v2h16V5zm-3 6H4v2h13.25c1.1 0 2 .9 2 2s-.9 2-2 2H15v-2l-3 3 3 3v-2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4z',

  undo: 'M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z',

  redo: 'M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z',

  plus: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',

  video: 'M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z',

  videoPlus: 'M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5M14,13H11V16H9V13H6V11H9V8H11V11H14V13Z',

  image: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',

  imageMultiple: 'M22,16V4A2,2 0 0,0 20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16M11,12L13.03,14.71L16,11L20,16H8M2,6V20A2,2 0 0,0 4,22H18V20H4V6',

  imagePlus: 'M5,3A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H14.09C14.03,20.67 14,20.34 14,20C14,19.32 14.12,18.64 14.35,18H5L8.5,13.5L11,16.5L14.5,12L16.73,14.97C17.7,14.34 18.84,14 20,14C20.34,14 20.67,14.03 21,14.09V5C21,3.89 20.1,3 19,3H5M19,16V19H16V21H19V24H21V21H24V19H21V16H19Z',

  imageBroken: 'M21,5V11.59L18,8.58L14,12.59L10,8.59L6,12.59L3,9.58V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5M18,11.42L21,14.43V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V12.42L6,15.41L10,11.41L14,15.41',

  imageOff: 'M2.28,3L1,4.27L3,6.27V19A2,2 0 0,0 5,21H17.73L19.73,23L21,21.72L2.28,3M4.83,3L21,19.17V5C21,3.89 20.1,3 19,3H4.83M8.5,13.5L11,16.5L12,15.25L14.73,18H5L8.5,13.5Z',

  figure: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',

  figureRight: 'M15,7H21V13H15V7M3,3H21V5H3V3M13,7V9H3V7H13M9,11V13H3V11H9M3,15H17V17H3V15M3,19H21V21H3V19Z',

  figureCenter: 'M9,7H15V13H9V7M3,3H21V5H3V3M3,15H21V17H3V15M3,19H17V21H3V19Z',

  figureLeft: 'M3,7H9V13H3V7M3,3H21V5H3V3M21,7V9H11V7H21M21,11V13H11V11H21M3,15H17V17H3V15M3,19H21V21H3V19Z',

  figureFull: 'M23 18V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zM8.5 12.5l2.5 3.01L14.5 11l4.5 6H5l3.5-4.5z',

  table: 'M5,4H19A2,2 0 0,1 21,6V18A2,2 0 0,1 19,20H5A2,2 0 0,1 3,18V6A2,2 0 0,1 5,4M5,8V12H11V8H5M13,8V12H19V8H13M5,14V18H11V14H5M13,14V18H19V14H13Z',

  sectionNormal: 'M12.5,19.5V3.47H14.53V19.5H12.5M9.5,19.5V3.47H11.53V19.5H9.5M4.5,7.5L8.53,11.5L4.5,15.47V12.47H1.5V10.5H4.5V7.5M19.5,15.47L15.5,11.5L19.5,7.5V10.5H22.5V12.47H19.5V15.47Z',

  sectionFull: 'M9,11H15V8L19,12L15,16V13H9V16L5,12L9,8V11M2,20V4H4V20H2M20,20V4H22V20H20Z',

  section: 'M2 21h19v-3H2v3zM20 8H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zM2 3v3h19V3H2z',

  fullscreen: 'M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z',

  column: 'M16,5V18H21V5M4,18H9V5H4M10,18H15V5H10V18Z',

  close: 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z',

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

  duplicate: 'M11,17H4A2,2 0 0,1 2,15V3A2,2 0 0,1 4,1H16V3H4V15H11V13L15,16L11,19V17M19,21V7H8V13H6V7A2,2 0 0,1 8,5H19A2,2 0 0,1 21,7V21A2,2 0 0,1 19,23H8A2,2 0 0,1 6,21V19H8V21H19Z',

  button: 'M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z',

  split: 'M8,18H11V15H2V13H22V15H13V18H16L12,22L8,18M12,2L8,6H11V9H2V11H22V9H13V6H16L12,2Z',

  'gear': 'M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z',

  dotsVertical: 'M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z',

  caretUp: 'M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z',

  caretDown: 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z',

  toggleHTML: 'M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z',

  'youtube': 'M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z',

  'vimeo': 'M22,7.42C21.91,9.37 20.55,12.04 17.92,15.44C15.2,19 12.9,20.75 11,20.75C9.85,20.75 8.86,19.67 8.05,17.5C7.5,15.54 7,13.56 6.44,11.58C5.84,9.42 5.2,8.34 4.5,8.34C4.36,8.34 3.84,8.66 2.94,9.29L2,8.07C3,7.2 3.96,6.33 4.92,5.46C6.24,4.32 7.23,3.72 7.88,3.66C9.44,3.5 10.4,4.58 10.76,6.86C11.15,9.33 11.42,10.86 11.57,11.46C12,13.5 12.5,14.5 13.05,14.5C13.47,14.5 14.1,13.86 14.94,12.53C15.78,11.21 16.23,10.2 16.29,9.5C16.41,8.36 15.96,7.79 14.94,7.79C14.46,7.79 13.97,7.9 13.46,8.12C14.44,4.89 16.32,3.32 19.09,3.41C21.15,3.47 22.12,4.81 22,7.42Z'
}, {
  get: function getIcon(list, name) {
    if (!list[name]) {
      return;
    }
    return '\n      <svg class="align-icon" viewBox="0 0 24 24">\n        <path d="' + list[name] + '"/>\n      </svg>';
  },
  set: function setIcon(list, name, val) {
    list[name] = val;
    return true;
  }
});

var Embed = function (_Component) {
  inherits(Embed, _Component);

  function Embed(data) {
    classCallCheck(this, Embed);

    var _this = possibleConstructorReturn(this, (Embed.__proto__ || Object.getPrototypeOf(Embed)).call(this));

    _this.el = document.createElement('div');
    _this.el.classList.add('align-embed');
    _this.el.insertAdjacentHTML('afterbegin', data);
    return _this;
  }

  createClass(Embed, null, [{
    key: 'add',
    value: function add() {
      var prompt = new Prompt(this.$align, {
        message: 'Add an embedded:'
      });
      return new Promise(function (resolve, reject) {
        prompt.onSubmit(function () {
          var data = prompt.inputs[0].value;
          if (!data) {
            reject('not a valid number');
          }          resolve(new Embed(data));
        });
      });
    }
  }]);
  return Embed;
}(Component);

Embed.schema = {
  icon: 'embed',
  tooltip: 'Add embed'
};

var Facebook = function (_Component) {
  inherits(Facebook, _Component);

  function Facebook(link) {
    classCallCheck(this, Facebook);

    var _this = possibleConstructorReturn(this, (Facebook.__proto__ || Object.getPrototypeOf(Facebook)).call(this));

    _this.el = document.createElement('div');
    _this._init(link);
    return _this;
  }

  createClass(Facebook, [{
    key: '_init',
    value: function _init(link) {
      var iframe = document.createElement('iframe');

      iframe.width = 500;
      iframe.height = 200;
      iframe.scrolling = 'no';
      iframe.contentEditable = false;
      iframe.allowTransparency = true;
      iframe.src = '//www.facebook.com/plugins/post.php?href=' + link;

      this.el.classList.add('align-post');
      this.el.appendChild(iframe);
    }
  }], [{
    key: 'add',
    value: function add() {
      var prompt = new Prompt(this.$align, {
        message: 'Enter post link:'
      });
      return new Promise(function (resolve, reject) {
        prompt.onSubmit(function () {
          var postUrl = prompt.inputs[0].value;
          if (!postUrl) {
            reject('no link provided');
          }          resolve(new Facebook(postUrl));
        });
      });
    }
  }]);
  return Facebook;
}(Component);

Facebook.schema = {
  icon: 'facebook',
  tooltip: 'Facebook post'
};

var NAMING_PREFIX = '';

function setElementsPrefix(prefix) {
  NAMING_PREFIX = prefix;
}
/**
  * Create button HTML element
  * @param {String} name
  */
function button(name, icon, tooltip) {
  var button = document.createElement('button');
  button.classList.add(NAMING_PREFIX + 'button');
  button.id = name;
  button.type = 'button';
  if (tooltip) {
    button.dataset.tooltip = tooltip;
  }
  button.insertAdjacentHTML('afterbegin', icons[icon] || icon);
  return button;
}

/**
 * Create select options HTML element
 * @param {String} name
 * @param {Object} options
 */
function select$2(name, options) {
  var wrapper = document.createElement('div');
  var select = document.createElement('select');
  var icon = '\n    <svg viewBox="0 0 24 24">\n      <polygon points="8,15 12,19 16,15 "/>\n      <polygon points="8,9 12,5 16,9 "/>\n    </svg>';

  wrapper.classList.add(NAMING_PREFIX + 'select');
  select.id = name;
  options.forEach(function (option) {
    var optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.innerText = option === false ? name : option;
    select.appendChild(optionElement);
  });
  wrapper.appendChild(select);
  wrapper.insertAdjacentHTML('beforeend', icon);
  return { wrapper: wrapper, el: select };
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
function fileButton(name, icon, tooltip) {
  var wrapper = document.createElement('div');
  var input = document.createElement('input');

  if (tooltip) {
    wrapper.dataset.tooltip = tooltip;
  }
  wrapper.classList.add(NAMING_PREFIX + 'button');
  wrapper.id = name;
  wrapper.appendChild(input);
  wrapper.insertAdjacentHTML('afterbegin', icon);
  input.classList.add(NAMING_PREFIX + 'input');
  input.id = name;
  input.type = 'file';
  return { input: input, el: wrapper };
}

function menuButton(name, icon, func, tooltip) {
  var menuItem = document.createElement('li');
  var currentButton = button(name, icon, tooltip);
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

function dropzone(name) {
  var wrapper = document.createElement('div');
  var input = document.createElement('input');
  var span = document.createElement('span');

  wrapper.classList.add('align-dropzone');
  wrapper.appendChild(input);
  wrapper.appendChild(span);
  input.classList.add('align-dropzone-input');
  input.type = 'file';
  input.multiple = true;
  span.classList.add('align-dropzone-description');
  span.innerHTML = 'Click here to upload your image';
  return { input: input, el: wrapper };
}

var symbols = generateKeysSymbols();

var Styler = function () {
  function Styler(align, settings) {
    classCallCheck(this, Styler);

    this.$align = align;
    this.settings = Object.assign({}, Styler.defaults, settings);
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
      this.visible = false;
      this.shortcuts = [];
      this.watchers = [];

      this.settings.commands.forEach(function (command) {
        _this._initCmdElement(command);
      });
      if (this.settings.mode === 'bubble') {
        this.el.classList.add('is-hidden');
        this.$align.wrapper.appendChild(this.el);
      }
      if (this.settings.mode === 'toolbar') {
        this.$align.el.insertAdjacentElement('afterbegin', this.el);
      }
      if (this.settings.mode === 'toolbar' && this.settings.shortcuts) {
        this.keyboardShortcuts();
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
    key: '_initClassesElement',
    value: function _initClassesElement(_ref) {
      var _this2 = this;

      var el = _ref.el,
          schema = _ref.schema;

      var values = schema.values;
      if (!Array.isArray(values)) {
        var element = input('counter', 'number');
        var min = values.min || 0;
        var max = values.max || 12;
        element.addEventListener('input', function () {
          if (!_this2.currentItem) {
            return;
          }
          var currentValue = Math.min(Math.max(element.value, min), max);
          var lastValue = _this2.currentItem.currentValue || 0;
          _this2.toggleClass(currentValue, [lastValue]);
          _this2.currentItem.currentValue = currentValue;
        });
        this.watchers.push(function () {
          if (!_this2.currentItem) {
            return;
          }
          element.value = _this2.currentItem.currentValue || '';
        });
        el.appendChild(element);
        return;
      }
      values.forEach(function (value, indx) {
        var className = value;
        var iconName = schema.icons ? schema.icons[indx] : value;
        var icon = icons[iconName] || value;
        var li = menuButton(className, icon, function () {
          _this2.toggleClass(className, values);
        }, className);
        el.appendChild(li);
      });
    }
  }, {
    key: '_initCmdElement',
    value: function _initCmdElement(command) {
      var _this3 = this;

      var cmd = typeof command === 'string' ? command : Object.keys(command)[0];
      var cmdSchema = this.cmdsSchema[cmd] || command;
      if (!cmdSchema) {
        console.warn(cmd + ' is not found');
        return;
      }

      var elementToAdd = '';
      var li = document.createElement('li');
      var icon = icons[cmdSchema.icon] || icons[cmd] || cmd;
      var tooltip = this.getTooltip(cmdSchema);
      var currentCmd = this.cmds[cmd] = { schema: cmdSchema };

      switch (cmdSchema.element) {
        case 'button':
          elementToAdd = currentCmd.el = button(cmd, icon, tooltip);
          var callback = function callback() {
            return _this3.cmdCallback(cmdSchema, cmdSchema.value);
          };
          currentCmd.el.addEventListener('click', callback);
          if (cmdSchema.shortcut) {
            this.shortcuts.push(Object.assign({}, cmdSchema.shortcut, { callback: callback }));
          }
          break;

        case 'file':
          var fileBtn = fileButton(cmd, icon, tooltip);
          elementToAdd = currentCmd.el = fileBtn.el;
          fileBtn.input.addEventListener('change', function (event) {
            _this3.cmdCallback(cmdSchema, event);
          });
          break;

        case 'input':
          elementToAdd = currentCmd.el = input(cmd, cmdSchema.type, tooltip);
          currentCmd.el.addEventListener('change', function () {
            _this3.cmdCallback(cmdSchema, currentCmd.el.value);
          });
          break;

        case 'select':
          var _select = select$2(cmd, command[cmd]),
              wrapper = _select.wrapper,
              el = _select.el;

          currentCmd.el = el;
          elementToAdd = wrapper;
          el.addEventListener('change', function () {
            return _this3.cmdCallback(cmdSchema, el[el.selectedIndex].value);
          });
          break;

        case 'dropdown':
          var ddown = dropdown(cmd, cmdSchema.items, function (value) {
            return _this3.cmdCallback(cmdSchema, value);
          });
          elementToAdd = currentCmd.el = ddown.dropdown;
          break;

        case 'styling':
          li.classList.add(cmdSchema.class);
          break;

        case 'custom':
          elementToAdd = cmdSchema.create(this);
          break;

        case 'classes':
          elementToAdd = currentCmd.el = document.createElement('ul');
          this._initClassesElement(currentCmd);
          break;

        default:
          console.warn(cmd, ' is not found');
      }

      if (elementToAdd) {
        li.appendChild(elementToAdd);
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
        // check if the cmd calls a function from align
        // otherwise it calls the function from the element itself
        var callbackFunc = null;
        if (this.$align[cmdSchema.func]) {
          callbackFunc = this.$align[cmdSchema.func].bind(this.$align);
        } else if (this.currentItem && this.currentItem[cmdSchema.func]) {
          callbackFunc = this.currentItem[cmdSchema.func].bind(this.currentItem);
        }
        if (!callbackFunc) {
          console.warn(cmdSchema.func, ' is not found');
          return;
        }
        callbackFunc(cmdSchema.args || value);
      }

      if (typeof cmdSchema.func === 'function') {
        cmdSchema.func(cmdSchema.args || value);
      }

      this.update();
    }
  }, {
    key: 'keyboardShortcuts',
    value: function keyboardShortcuts() {
      var _this4 = this;

      this.cmdKey = userOS() === 'Mac' ? 'metaKey' : 'ctrlKey';
      window.addEventListener('keydown', function (event) {
        // Do nothing if the event was already processed
        if (event.defaultPrevented) {
          return;
        }
        var keyPressed = event.key.toUpperCase();
        _this4.shortcuts.forEach(function (shortcut) {
          if (keyPressed === shortcut.key && event[_this4.cmdKey] === !!shortcut.cmdKey && event.shiftKey === !!shortcut.shiftKey) {
            event.preventDefault();
            shortcut.callback();
          }
        });
      });
    }
    /**
     * Execute command for the selected button
     * @param {String} cmd
     * @param {String|Number} value
     */

  }, {
    key: 'execute',
    value: function execute(cmd, value) {
      var useCSS = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      this.$align.editor.focus();
      document.execCommand('styleWithCSS', false, useCSS);
      document.execCommand(cmd, false, value);
      document.execCommand('styleWithCSS', false, false);
      this.$align.update();
    }
  }, {
    key: 'updateBubble',
    value: function updateBubble(newPosition) {
      if (Selection.range && !Selection.range.collapsed && Selection.range === Selection.current.getRangeAt(0) || this.currentItem) {
        var element = this.currentItem ? this.currentItem.el : Selection.range;
        this.currentPosition = updatePosition(element, this.el, newPosition || this.settings.position);
        this.show();
        return;
      }
      this.hide();
    }
  }, {
    key: 'show',
    value: function show() {
      var _this5 = this;

      if (this.visible) {
        return;
      }
      this.visible = true;
      this.el.style.transition = 'opacity 0.2s';
      this.el.classList.add('is-visible');
      this.el.classList.remove('is-hidden');
      var updateTemp = function updateTemp() {
        _this5.el.style.transition = '';
        _this5.el.removeEventListener('transitionend', updateTemp);
      };
      if (this.currentItem && this.currentItem.el) {
        this.currentItem.el.addEventListener('transitionend', updateTemp);
      }
      if (this.settings.hideWhenClickOut) {
        document.addEventListener('click', this.clickCallback);
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (this.currentItem && this.settings.addActiveClass) {
        this.currentItem.el.classList.remove('is-active');
      }
      if (this.currentItem) {
        this.currentItem = null;
      }
      this.el.classList.remove('is-visible');
      this.el.classList.remove('is-active');
      this.el.classList.add('is-hidden');
      this.visible = false;
      if (this.settings.hideWhenClickOut) {
        document.removeEventListener('click', this.clickCallback);
      }
    }
  }, {
    key: 'update',
    value: function update(item) {
      if (this.currentItem && this.settings.addActiveClass) {
        this.currentItem.el.classList.remove('is-active');
      }
      if (item && this.settings.addActiveClass) {
        item.el.classList.add('is-active');
      }
      if (item) {
        this.currentItem = item;
      }
      this.watchers.forEach(function (watch) {
        return watch();
      });
      this.updateCommandsStates();
      if (this.settings.mode === 'bubble') {
        this.updateBubble();
      }
    }
  }, {
    key: 'remove',
    value: function remove() {
      var _this6 = this;

      setTimeout(function () {
        _this6.el.remove();
      }, 1);
    }
  }, {
    key: 'getTooltip',
    value: function getTooltip(schema) {
      if (!schema.tooltip || !this.settings.tooltip) {
        return false;
      }
      if (this.settings.shortcuts && schema.shortcut) {
        var obj = schema.shortcut;
        var shortcut = [obj.cmdKey ? symbols.cmdKey : '', obj.shiftKey ? symbols.shift : '', obj.key === 'TAB' ? symbols.tab : obj.key].join(' ');
        return schema.tooltip + ' (' + shortcut + ')';
      }
      return schema.tooltip;
    }

    /**
     * Update the state of the active style
     */

  }, {
    key: 'updateCommandsStates',
    value: function updateCommandsStates() {
      var _this7 = this;

      Object.values(this.cmds).forEach(function (cmd) {
        var schema = cmd.schema;
        var command = schema.command;

        if (schema.active) {
          var path = schema.active.split('.');
          var condition = path.reduce(function (acc, current) {
            if (!acc) {
              return;
            }
            return acc[current];
          }, _this7);
          if (condition) {
            cmd.el.classList.add('is-active');
            return;
          }
          cmd.el.classList.remove('is-active');
        }

        if (!command) {
          return;
        }
        if (document.queryCommandState(command)) {
          cmd.el.classList.add('is-active');
          return;
        }
        if (document.queryCommandValue(command) === schema.value) {
          cmd.el.classList.add('is-active');
          return;
        }
        if (schema.init) {
          if (!Selection.current.anchorNode) {
            return;
          }
          var selectedElement = Selection.current.anchorNode.type === 1 ? Selection.current.anchorNode : Selection.current.anchorNode.parentNode;
          if (selectedElement.closest('.align-content')) {
            document.queryCommandValue(command);
            schema.init.selectColor(document.queryCommandValue(command), true);
          }
          return;
        }
        if (document.queryCommandValue(command)) {
          cmd.el.value = document.queryCommandValue(command);
        }
        cmd.el.classList.remove('is-active');
      });
    }
  }, {
    key: 'toggleClass',
    value: function toggleClass(currentClass, allClasses) {
      var _currentItem$el$class,
          _this8 = this;

      if (!this.currentItem) return;
      var prefixedClasses = allClasses.map(function (cls) {
        return 'is-' + cls;
      });
      (_currentItem$el$class = this.currentItem.el.classList).remove.apply(_currentItem$el$class, toConsumableArray(prefixedClasses));
      if (!currentClass) {
        return;
      }
      this.currentItem.el.classList.toggle('is-' + currentClass);
      var updateTemp = function updateTemp() {
        _this8.update();
        _this8.currentItem.el.removeEventListener('transitionend', updateTemp);
      };
      this.currentItem.el.addEventListener('transitionend', updateTemp);

      // emit events
      this.$align.$bus.emit('changed');
    }
  }]);
  return Styler;
}();

Styler.defaults = {
  mode: 'toolbar',
  commands: [],
  hideWhenClickOut: false,
  tooltip: false,
  theme: 'light',
  shortcuts: false,
  addActiveClass: false,
  position: 'center-top'
};

var Figure = function (_Component) {
  inherits(Figure, _Component);

  function Figure(figure) {
    classCallCheck(this, Figure);

    if (!figure) {
      var _ret;

      return _ret = {
        el: null
      }, possibleConstructorReturn(_this, _ret);
    }

    var _this = possibleConstructorReturn(this, (Figure.__proto__ || Object.getPrototypeOf(Figure)).call(this, figure));

    if (_this.mode === 'create') {
      _this.el = document.createElement('figure');
      _this.caption = document.createElement('figcaption');
      _this.img = document.createElement('img');
      _this.readFileContent(figure);
    }

    if (_this.mode === 'edit') {
      _this.el = figure;
      _this.caption = figure.querySelector('figcaption') || document.createElement('figcaption');
      _this.img = figure.querySelector('img');
    }

    _this._init();
    return _this;
  }

  createClass(Figure, [{
    key: '_init',
    value: function _init() {
      var _this2 = this;

      this.toolbar = new Styler(this.$align, Figure.toolbar);
      this.el.contentEditable = false;
      this.caption.contentEditable = true;
      this.caption.dataset.defaultValue = 'Figure caption';
      this.img.classList.add('align-image');
      this.el.classList.add('align-figure', 'is-center');
      this.el.appendChild(this.img);
      this.el.appendChild(this.caption);
      this.el.addEventListener('click', function () {
        _this2.toolbar.update(_this2);
      });
    }
  }, {
    key: 'readFileContent',
    value: function readFileContent(file) {
      var _this3 = this;

      if (!this.isImage(file.name)) {
        return {
          el: null
        };
      }

      this.img.src = URL.createObjectURL(file);

      var update = function update(src) {
        _this3.img.src = src;
      };

      this.$align.$bus.emit('imageAdded', {
        file: file,
        update: update
      });
    }
  }, {
    key: 'isImage',
    value: function isImage(filename) {
      var parts = filename.split('.');
      var ext = parts.slice(-1)[0];

      switch (ext.toLowerCase()) {
        case 'jpg':
        case 'jpge':
        case 'gif':
        case 'bmp':
        case 'png':
          return true;
      }
      return false;
    }
  }], [{
    key: 'add',
    value: function add() {
      var prompt = new Prompt(this.$align, {
        message: 'Chose image figure:',
        inputsTypes: ['file']
      });
      return new Promise(function (resolve, reject) {
        prompt.onSubmit(function () {
          var file = prompt.inputs[0].files[0];
          if (!file) {
            reject('no file provided');
          }          resolve(new Figure(file));
        });
      });
    }
  }, {
    key: 'render',
    value: function render(element) {
      var figure = element;
      var caption = element.querySelector('figcaption');
      var img = element.querySelector('img');
      figure.contentEditable = 'inherit';
      figure.classList.remove('is-active');
      caption.contentEditable = 'inherit';
      caption.removeAttribute('data-default-value');
      img.removeAttribute('data-align-filename');
      if (caption.innerText === '') {
        caption.remove();
      }
    }
  }]);
  return Figure;
}(Component);

Figure.toolbar = {
  mode: 'bubble',
  hideWhenClickOut: true,
  addActiveClass: true,
  tooltip: true,
  commands: [{
    element: 'classes',
    values: ['floatLeft', 'center', 'floatRight', 'full'],
    icons: ['figureLeft', 'figureCenter', 'figureRight', 'figureFull']
  }, 'remove']
};
Figure.schema = {
  icon: 'figure',
  tooltip: 'Add Figure'
};

var Gallery = function (_Component) {
  inherits(Gallery, _Component);

  function Gallery(images) {
    classCallCheck(this, Gallery);

    var _this = possibleConstructorReturn(this, (Gallery.__proto__ || Object.getPrototypeOf(Gallery)).call(this));

    _this.el = document.createElement('div');
    _this.el.classList.add('align-gallery');
    Array.from(images).forEach(function (img) {
      var url = URL.createObjectURL(img);
      var imgElm = stringToDOM('<img class="align-gallery-image"/>');
      var update = function update(newSrc) {
        imgElm.src = newSrc;
      };
      imgElm.src = url;
      _this.el.appendChild(imgElm);
      _this.$align.$bus.emit('imageAdded', {
        file: img,
        update: update
      });
    });
    return _this;
  }

  createClass(Gallery, null, [{
    key: 'add',
    value: function add() {
      var position = Selection.range.startContainer;

      var _dropzone = dropzone('gallery'),
          el = _dropzone.el,
          input$$1 = _dropzone.input;

      position.appendChild(el, position);
      return new Promise(function (resolve, reject) {
        input$$1.addEventListener('change', function () {
          el.remove();
          resolve(new Gallery(input$$1.files));
        });
      });
    }
  }]);
  return Gallery;
}(Component);

Gallery.schema = {
  icon: 'imageMultiple',
  tooltip: 'Add gallery'
};

var Grid = function (_Component) {
  inherits(Grid, _Component);

  function Grid(grid) {
    classCallCheck(this, Grid);

    var _this = possibleConstructorReturn(this, (Grid.__proto__ || Object.getPrototypeOf(Grid)).call(this, grid));

    if (_this.mode === 'create') {
      _this.el = document.createElement('div');
      _this.el.classList.add('align-grid');
      _this.el.insertAdjacentHTML('afterbegin', '<div class="align-column"><p></p></div>'.repeat(grid));
    }

    if (_this.mode === 'edit') {
      _this.el = grid;
    }
    _this._init();
    return _this;
  }

  createClass(Grid, [{
    key: '_init',
    value: function _init() {
      var _this2 = this;

      this.columns = Array.from(this.el.querySelectorAll('.align-column'));
      this.gridToolbar = new Styler(this.$align, Grid.gridToolbar);
      this.columnToolbar = new Styler(this.$align, Grid.columnToolbar);

      this.el.addEventListener('click', function () {
        _this2.gridToolbar.update(_this2);
      });
      this.columns.forEach(function (col) {
        var obj = {
          el: col,
          columnColor: _this2.columnColor.bind(_this2)
        };
        col.addEventListener('click', function () {
          _this2.columnToolbar.update(obj);
        });
      });
    }
  }, {
    key: 'columnColor',
    value: function columnColor(color) {
      var currentCol = this.columnToolbar.currentItem.el;
      currentCol.style.backgroundColor = color;

      // emit events
      this.$align.$bus.emit('changed');
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.gridToolbar.remove();
      this.columnToolbar.remove();
      get(Grid.prototype.__proto__ || Object.getPrototypeOf(Grid.prototype), 'remove', this).call(this);
    }
  }], [{
    key: 'add',
    value: function add() {
      var prompt = new Prompt(this.$align, {
        message: 'Enter columns count:',
        inputsCount: 1
      });
      return new Promise(function (resolve, reject) {
        prompt.onSubmit(function () {
          var count = prompt.inputs[0].value;
          if (isNaN(count)) {
            reject('not a valid number');
          }          resolve(new Grid(count));
        });
      });
    }
  }]);
  return Grid;
}(Component);

Grid.gridToolbar = {
  mode: 'bubble',
  hideWhenClickOut: true,
  commands: [{
    element: 'classes',
    values: ['center', 'shrink', 'relaxed']
  }, 'remove']
};
Grid.columnToolbar = {
  mode: 'bubble',
  position: 'center-bottom',
  hideWhenClickOut: true,
  commands: ['_columnColor', {
    element: 'classes',
    values: 'input'
  }]
};
Grid.schema = {
  icon: 'column',
  tooltip: 'Add columns'
};

var Paragraph = function (_Component) {
  inherits(Paragraph, _Component);

  function Paragraph(line) {
    classCallCheck(this, Paragraph);

    var _this = possibleConstructorReturn(this, (Paragraph.__proto__ || Object.getPrototypeOf(Paragraph)).call(this, line));

    _this.el = document.createElement('p');
    return _this;
  }

  createClass(Paragraph, null, [{
    key: 'add',
    value: function add() {
      return new Promise(function (resolve, reject) {
        resolve(new Paragraph());
      });
    }
  }]);
  return Paragraph;
}(Component);

Paragraph.schema = {
  icon: 'p',
  tooltip: 'Line separator'
};

var Line = function (_Component) {
  inherits(Line, _Component);

  function Line(line) {
    classCallCheck(this, Line);

    var _this = possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).call(this, line));

    if (_this.mode === 'create') {
      _this.el = document.createElement('hr');
      _this.el.classList.add('align-line');
    }
    if (_this.mode === 'edit') {
      _this.el = line;
    }
    _this._init();
    return _this;
  }

  createClass(Line, [{
    key: '_init',
    value: function _init() {
      var _this2 = this;

      this.toolbar = new Styler(this.$align, Line.toolbar);
      this.el.addEventListener('click', function () {
        _this2.toolbar.update(_this2);
      });
    }
  }], [{
    key: 'add',
    value: function add() {
      return new Promise(function (resolve, reject) {
        resolve(new Line());
      });
    }
  }]);
  return Line;
}(Component);

// addLine: {
//   element: 'dropdown',
//   items: [
//     '<hr class="align-line">',
//     '<hr class="align-line is-dashed">',
//     '<hr class="align-line is-dotted">',
//     '<hr class="align-line is-double">',
//     '<hr class="align-line is-dots">',
//     '<hr class="align-line is-bold">',
//     '<hr class="align-line is-bold is-dashed">',
//     '<hr class="align-line is-bold is-dotted">',
//     '<hr class="align-line is-bold is-double">'
//   ],
//   icon: 'insertLine',
//   func: 'addHTML',
//   tooltip: 'Add line'
// },


Line.toolbar = {
  mode: 'bubble',
  hideWhenClickOut: true,
  commands: [{
    element: 'classes',
    values: ['normal', 'dashed', 'dotted', 'double', 'dots', 'thick']
  }, 'remove']
};
Line.schema = {
  icon: 'line',
  tooltip: 'Line separator'
};

var Quote = function (_Component) {
  inherits(Quote, _Component);

  function Quote() {
    classCallCheck(this, Quote);

    var _this = possibleConstructorReturn(this, (Quote.__proto__ || Object.getPrototypeOf(Quote)).call(this));

    _this.el = document.createElement('blockquote');
    _this.quote = document.createElement('p');
    _this.author = document.createElement('cite');

    _this.el.classList.add('align-quote');
    _this.quote.dataset.defaultValue = 'Quote...';
    _this.author.dataset.defaultValue = 'author';

    _this.el.contentEditable = 'false';
    _this.quote.contentEditable = 'true';
    _this.author.contentEditable = 'true';

    _this.el.appendChild(_this.quote);
    _this.el.appendChild(_this.author);
    return _this;
  }

  createClass(Quote, null, [{
    key: 'add',
    value: function add() {
      return new Promise(function (resolve, reject) {
        resolve(new Quote());
      });
    }
  }]);
  return Quote;
}(Component);

Quote.schema = {
  icon: 'blockquote',
  tooltip: 'Quote'
};

var Separator = function (_Component) {
  inherits(Separator, _Component);

  function Separator(separator) {
    classCallCheck(this, Separator);

    var _this = possibleConstructorReturn(this, (Separator.__proto__ || Object.getPrototypeOf(Separator)).call(this, separator));

    if (_this.mode === 'create') {
      _this.el = document.createElement('div');
      _this.el.classList.add('align-separator');
      _this.currentHeigh = 50;
    }
    if (_this.mode === 'edit') {
      _this.el = separator;
      _this.currentHeigh = Number(_this.el.style.height.slice(0, -2));
    }

    _this._init();
    return _this;
  }

  createClass(Separator, [{
    key: '_init',
    value: function _init() {
      this.updateHeight(this.currentHeigh);
      this.el.addEventListener('mousedown', this.handleClick.bind(this));
    }
  }, {
    key: 'updateHeight',
    value: function updateHeight(height) {
      this.el.style.height = height + 'px';
    }
  }, {
    key: 'handleClick',
    value: function handleClick(event) {
      var _this2 = this;

      event.preventDefault();
      var startPosition = event.y;
      var handleDrag = function handleDrag(evnt) {
        var endPosition = evnt.y;
        _this2.delta = endPosition - startPosition;
        _this2.updateHeight(_this2.currentHeigh + _this2.delta);
      };
      var handleRelease = function handleRelease(evnt) {
        evnt.preventDefault();
        evnt.stopPropagation();
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleRelease);
        _this2.currentHeigh += _this2.delta;
      };
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleRelease);
    }
  }], [{
    key: 'add',
    value: function add() {
      return new Promise(function (resolve, reject) {
        resolve(new Separator());
      });
    }
  }]);
  return Separator;
}(Component);

Separator.schema = {
  tooltip: 'Vimeo',
  icon: 'split'
};

var Table = function (_Component) {
  inherits(Table, _Component);

  function Table(table) {
    classCallCheck(this, Table);

    var _this = possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this));

    if (!table) return possibleConstructorReturn(_this);
    _this._init(table);
    _this._initEvents();
    _this.activeCell = _this.el.rows[0].cells[0];
    return _this;
  }

  createClass(Table, [{
    key: '_init',
    value: function _init(table) {
      this.toolbar = new Styler(this.$align, Table.toolbar);
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
      var _this2 = this;

      this.el.addEventListener('click', function (event) {
        _this2.activeCell = event.target;
        _this2.toolbar.update(_this2);
      });
    }
  }, {
    key: 'insertRow',
    value: function insertRow(args) {
      var position = args[0];
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
    value: function insertColumn(args) {
      var position = args[0];
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
  }, {
    key: 'remove',
    value: function remove() {
      this.toolbar.remove();
      this.el.remove();
    }
  }], [{
    key: 'add',
    value: function add() {
      var prompt = new Prompt(this.$align, {
        message: 'Enter post link:',
        inputsCount: 2,
        inputsPlaceholders: ['rows', 'columns']
      });

      return new Promise(function (resolve, reject) {
        prompt.onSubmit(function () {
          var table = new Table({
            rows: prompt.inputs[0].value,
            columns: prompt.inputs[1].value
          });
          resolve(table);
        });
      });
    }
  }]);
  return Table;
}(Component);

Table.toolbar = {
  mode: 'bubble',
  hideWhenClickOut: true,
  addActiveClass: true,
  commands: [{
    element: 'button',
    func: 'insertRow',
    args: ['before'],
    icon: 'tableRowTop'
  }, {
    element: 'button',
    func: 'insertRow',
    args: ['after'],
    icon: 'tableRowBottom'
  }, {
    element: 'button',
    func: 'insertColumn',
    args: ['before'],
    icon: 'tableColumnBefore'
  }, {
    element: 'button',
    func: 'insertColumn',
    args: ['after'],
    icon: 'tableColumnAfter'
  }, 'separator', {
    element: 'button',
    func: 'deleteRow',
    icon: 'tableDeleteRow'
  }, {
    element: 'button',
    func: 'deleteColumn',
    icon: 'tableDeleteColumn'
  }, 'separator', 'remove'],
  tooltip: true
};
Table.schema = {
  icon: 'table',
  tooltip: 'Add Table'
};

var Button = function (_Component) {
  inherits(Button, _Component);

  function Button(button) {
    classCallCheck(this, Button);

    var _this = possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, button));

    if (_this.mode === 'create') {
      _this.el = document.createElement('a');
      _this.el.classList.add('align-button');
      _this.span = document.createElement('span');
      _this.span.dataset.defaultValue = 'Button text';
      _this.el.appendChild(_this.span);
    }

    if (_this.mode === 'edit') {
      _this.el = button;
    }

    _this._init();
    return _this;
  }

  createClass(Button, [{
    key: '_init',
    value: function _init() {
      var _this2 = this;

      this.toolbar = new Styler(this.$align, Button.toolbar);

      this.el.addEventListener('click', function () {
        _this2.editLink();
        _this2.toolbar.update(_this2);
      });
    }
  }, {
    key: 'editLink',
    value: function editLink() {
      var _this3 = this;

      var prompt = new Prompt(this.$align, {
        message: 'Enter link:',
        data: this.el.getAttribute('href')
      });
      prompt.on('save', function () {
        var link = prompt.inputs[0].value;
        if (!link) return;
        _this3.el.href = link;
      });
      if (this.el.href) {
        prompt.on('clear', function () {
          _this3.el.href = '';
        });
      }
    }
  }], [{
    key: 'add',
    value: function add() {
      return new Promise(function (resolve, reject) {
        resolve(new Button());
      });
    }
  }]);
  return Button;
}(Component);

Button.toolbar = {
  mode: 'bubble',
  hideWhenClickOut: true,
  addActiveClass: true,
  position: 'center-bottom',
  tooltip: true,
  commands: [{
    element: 'classes',
    values: ['small', 'normal', 'large']
  }, 'separator', {
    element: 'classes',
    values: ['primary', 'secondary', 'danger', 'success']
  }, 'separator', {
    element: 'classes',
    values: ['outline', 'default']
  }, 'separator', 'remove']
};
Button.schema = {
  icon: 'button'
};

var Vimeo = function (_Component) {
  inherits(Vimeo, _Component);

  function Vimeo(link) {
    classCallCheck(this, Vimeo);

    var _this = possibleConstructorReturn(this, (Vimeo.__proto__ || Object.getPrototypeOf(Vimeo)).call(this));

    _this.el = document.createElement('div');
    _this.el.classList.add('align-video');

    _this._init(link);
    return _this;
  }

  createClass(Vimeo, [{
    key: '_init',
    value: function _init(link) {
      var regExp = /vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/;
      var match = link.match(regExp);
      if (!match) {
        console.warn('wrong vimeo video url');
        return;
      }
      var videoId = match[1];
      var iframe = document.createElement('iframe');

      iframe.allowfullscreen = true;
      iframe.contentEditable = false;
      iframe.src = '//player.vimeo.com/video/' + videoId;

      this.el.appendChild(iframe);
    }
  }], [{
    key: 'add',
    value: function add() {
      var prompt = new Prompt(this.$align, {
        message: 'Enter video link:'
      });
      return new Promise(function (resolve, reject) {
        prompt.onSubmit(function () {
          var link = prompt.inputs[0].value;
          if (!link) {
            reject('no link provided');
          }          resolve(new Vimeo(link));
        });
      });
    }
  }]);
  return Vimeo;
}(Component);

Vimeo.schema = {
  tooltip: 'Vimeo',
  icon: 'vimeo'
};

var Youtube = function (_Component) {
  inherits(Youtube, _Component);

  function Youtube(link) {
    classCallCheck(this, Youtube);

    var _this = possibleConstructorReturn(this, (Youtube.__proto__ || Object.getPrototypeOf(Youtube)).call(this));

    _this.el = document.createElement('div');
    _this.el.classList.add('align-video');

    _this._init(link);
    return _this;
  }

  createClass(Youtube, [{
    key: '_init',
    value: function _init(link) {
      var regExp = /(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      var match = link.match(regExp);
      if (!match) {
        console.warn('wrong youtube video url');
        return;
      }
      var videoId = match[1];
      var iframe = document.createElement('iframe');

      iframe.allowfullscreen = true;
      iframe.contentEditable = false;
      iframe.src = '//www.youtube.com/embed/' + videoId;

      this.el.appendChild(iframe);
    }
  }], [{
    key: 'add',
    value: function add() {
      var prompt = new Prompt(this.$align, {
        message: 'Enter video link:'
      });
      return new Promise(function (resolve, reject) {
        prompt.onSubmit(function () {
          var link = prompt.inputs[0].value;
          if (!link) {
            reject('no link provided');
          }          resolve(new Youtube(link));
        });
      });
    }
  }]);
  return Youtube;
}(Component);

Youtube.schema = {
  tooltip: 'Youtube',
  icon: 'youtube'
};

var components = {
  Embed: Embed,
  Facebook: Facebook,
  Figure: Figure,
  Gallery: Gallery,
  Grid: Grid,
  Paragraph: Paragraph,
  Line: Line,
  Link: Link,
  Quote: Quote,
  Separator: Separator,
  Table: Table,
  Button: Button,
  Vimeo: Vimeo,
  Youtube: Youtube
};

var Dep = function () {
  createClass(Dep, null, [{
    key: "watcher",
    value: function watcher(func) {
      Dep.target = func;
      Dep.target();
      Dep.target = null;
    }
  }]);

  function Dep() {
    classCallCheck(this, Dep);

    this.subscribers = [];
  }

  createClass(Dep, [{
    key: "depend",
    value: function depend() {
      if (Dep.target && !this.subscribers.includes(Dep.target)) {
        this.subscribers.push(Dep.target);
      }
    }
  }, {
    key: "notify",
    value: function notify(oldVal) {
      this.subscribers.forEach(function (sub) {
        return sub(oldVal);
      });
    }
  }]);
  return Dep;
}();

Dep.target = null;

var Section = function () {
  function Section(align, content) {
    var _this = this;

    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        position = _ref.position,
        _ref$type = _ref.type,
        type = _ref$type === undefined ? 'text' : _ref$type;

    classCallCheck(this, Section);

    if (content && content.nodeName === 'BR') {
      return;
    }
    this.id = Section.id++;
    this.$align = align;
    this.fields = ['backgroundImage', 'backgroundVideo', 'backgroundColor', 'customClass', 'layout'];
    this.props = {
      customClass: [],
      modifiers: [],
      backgroundColor: '',
      backgroundVideo: '',
      backgroundImage: '',
      parallax: false,
      isHTMLView: false,
      layout: {},
      type: type
    };
    if (typeof content === 'string') {
      content = stringToDOM(content);
    }
    this._initWrapper(content);
    if (this.props.type === 'text') {
      this._initBackground(content);
      this._initContent(content);
      this._initProps();
      this._initControllers();
      this.el.addEventListener('click', function () {
        _this.active();
      });
    }
    this._initContent(content);
    this._initWatchers();

    if (typeof position === 'number') {
      var before = this.$align.sections[position];
      this.$align.editor.insertBefore(this.el, before.el);
      this.$align.sections.splice(position, 0, this);
      return;
    }
    this.$align.editor.appendChild(this.el);
    this.$align.sections.push(this);
  }

  createClass(Section, [{
    key: '_initWrapper',
    value: function _initWrapper(content) {
      var _this2 = this,
          _el$classList;

      this.el = document.createElement('div');
      this.el.classList.add('align-section');
      var classes = content ? content.classList : '';
      if (!classes) {
        return;
      }
      classes = Array.from(classes);
      classes.splice(classes.indexOf('align-section'), 1);
      classes.forEach(function (cls) {
        if (cls.startsWith('is-')) {
          _this2.props.modifiers.push(cls);
          return;
        }
        if (cls.startsWith('has-')) {
          return;
        }
        _this2.props.customClass.push(cls);
      });
      (_el$classList = this.el.classList).add.apply(_el$classList, toConsumableArray(this.props.modifiers));
      this.el.setAttribute('style', content.getAttribute('style'));
      ['margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left'].forEach(function (styl) {
        var value = _this2.el.style[styl];
        if (value) {
          _this2.props.layout[styl] = value;
          return;
        }
      });
    }
  }, {
    key: '_initContent',
    value: function _initContent(content) {
      var _this3 = this;

      switch (this.props.type) {
        case 'text':
          if (!this.contentDiv) {
            this.contentDiv = document.createElement('div');
            this.contentDiv.classList.add('align-content');
            this.contentDiv.contentEditable = true;
          }
          if (this.props.isHTMLView) {
            content = content.innerText;
          }
          if (!this.props.isHTMLView) {
            content = content ? content.innerHTML : '<p></p>';
          }
          this.contentDiv.innerHTML = content;
          this.el.appendChild(this.contentDiv);
          this._initComponents();
          break;

        case 'title':
          this.title = this.el.querySelector('.align-title') || document.createElement('h1');
          this.title.classList.add('align-title');
          this.title.contentEditable = true;
          this.title.innerText = content;
          this.el.appendChild(this.title);
          this.title.addEventListener('blur', function () {
            _this3.title.innerHTML = _this3.title.innerText;
          });
          break;

        default:
          break;
      }
    }
  }, {
    key: '_initComponents',
    value: function _initComponents() {
      var separators = Array.from(this.contentDiv.querySelectorAll('.align-separator'));
      var buttons = Array.from(this.contentDiv.querySelectorAll('.align-button'));
      var grids = Array.from(this.contentDiv.querySelectorAll('.align-grid'));
      var lines = Array.from(this.contentDiv.querySelectorAll('.align-line'));
      var figures = Array.from(this.contentDiv.querySelectorAll('figure'));
      var tables = Array.from(this.contentDiv.querySelectorAll('table'));
      var links = Array.from(this.contentDiv.querySelectorAll('a'));

      separators.forEach(function (separator) {
        return new Separator(separator);
      });
      buttons.forEach(function (button) {
        return new Button(button);
      });
      grids.forEach(function (grid) {
        return new Grid(grid);
      });
      lines.forEach(function (line) {
        return new Line(line);
      });
      figures.forEach(function (figure) {
        return new Figure(figure);
      });
      tables.forEach(function (table) {
        return new Table(table);
      });
      links.forEach(function (link) {
        return new Link(link);
      });
    }
  }, {
    key: '_initControllers',
    value: function _initControllers() {
      var _this4 = this;

      this.controllers = document.createElement('div');
      this.addButton = document.createElement('button');
      this.controllers.classList.add('align-sectionControllers');
      this.addButton.classList.add('align-sectionAdd');

      this.addButton.addEventListener('click', function () {
        var newSection = new Section(_this4.$align, '', { position: _this4.getIndex() });
        setTimeout(function () {
          newSection.active();
          Selection.selectElement(newSection.contentDiv.querySelector('p'));
        }, 1);
      });
      this.controllers.appendChild(this.addButton);
      this.el.appendChild(this.controllers);
    }
  }, {
    key: '_initBackground',
    value: function _initBackground(content) {
      if (!content) {
        return;
      }
      this.bgImage = content.querySelector('.align-bgImage');
      this.bgVideo = content.querySelector('.align-bgVideo');
      this.bgColor = content.style.backgroundColor;

      if (this.bgImage) {
        this.el.insertAdjacentElement('afterBegin', this.bgImage);
        this.props.backgroundImage = this.bgImage.style.backgroundImage;
        this.props.parallax = this.bgImage.classList.contains('is-parallax');
      }
      if (this.bgVideo) {
        this.el.insertAdjacentElement('afterBegin', this.bgVideo);
        this.props.backgroundVideo = this.bgVideo.querySelector('source').src;
      }
      if (this.bgColor) {
        this.props.backgroundColor = this.bgColor;
      }
    }
  }, {
    key: '_initProps',
    value: function _initProps() {
      var _this5 = this;

      Object.keys(this.props).forEach(function (key) {
        var internalValue = _this5.props[key];
        var dep = new Dep();

        Object.defineProperty(_this5.props, key, {
          get: function get$$1() {
            dep.depend();
            return internalValue;
          },
          set: function set$$1(newVal) {
            var oldVal = internalValue;
            internalValue = newVal;
            dep.notify(oldVal);
          }
        });
      });
    }
  }, {
    key: '_initWatchers',
    value: function _initWatchers() {
      var _this6 = this;

      Dep.watcher(function (oldVal) {
        var _el$classList3;

        if (oldVal && oldVal.length > 0) {
          var _el$classList2;

          (_el$classList2 = _this6.el.classList).remove.apply(_el$classList2, toConsumableArray(oldVal));
        }
        if (_this6.props.customClass.length === 0) {
          return;
        }
        (_el$classList3 = _this6.el.classList).add.apply(_el$classList3, toConsumableArray(_this6.props.customClass));

        // emit events
        var index = _this6.getIndex();
        _this6.$align.$bus.emit('changed');
        _this6.$align.$bus.emit('sectionChanged', {
          from: index,
          to: index,
          props: _this6.props
        });
      });
      Dep.watcher(function () {
        _this6.backgroundColor(_this6.props.backgroundColor);
      });
      Dep.watcher(function () {
        _this6.backgroundImage(_this6.props.backgroundImage);
      });
      Dep.watcher(function () {
        _this6.backgroundVideo(_this6.props.backgroundVideo);
      });
      Dep.watcher(function () {
        _this6.updateLayout(_this6.props.layout);
      });
      Dep.watcher(function () {
        var parallax = _this6.props.parallax;
        if (!_this6.bgImage) {
          return;
        }
        _this6.bgImage.classList.toggle('is-parallax', parallax);
      });
    }
  }, {
    key: 'getIndex',
    value: function getIndex() {
      var _this7 = this;

      return this.$align.sections.findIndex(function (el) {
        return el === _this7;
      });
    }
  }, {
    key: 'updateLayout',
    value: function updateLayout() {
      var _this8 = this;

      Object.keys(this.props.layout).forEach(function (styl) {
        var value = _this8.props.layout[styl];
        if (value) {
          _this8.props.layout[styl] = value;
          _this8.el.style[styl] = value;
          return;
        }
        delete _this8.props.layout[styl];
        _this8.el.style[styl] = '';
      });

      // emit events
      var index = this.getIndex();
      this.$align.$bus.emit('changed');
      this.$align.$bus.emit('sectionChanged', {
        from: index,
        to: index,
        props: this.props
      });
    }
  }, {
    key: 'toggleHTML',
    value: function toggleHTML() {
      if (!this.props.isHTMLView) {
        this.props.isHTMLView = true;
        var content = document.createTextNode(this.contentDiv.innerHTML);
        var pre = document.createElement('pre');

        this.contentDiv.innerHTML = '';
        pre.dataset.alignHtml = true;
        pre.appendChild(content);
        this.contentDiv.appendChild(pre);
        this.$align.highlight();
        return;
      }
      this._initContent(this.contentDiv);
      this.props.isHTMLView = false;
    }
  }, {
    key: 'backgroundColor',
    value: function backgroundColor(color) {
      if (!color) {
        this.bgColor = null;
        this.el.style.backgroundColor = '';
        this.el.classList.remove('has-bgColor');
        return;
      }
      this.el.style.backgroundColor = color;

      this.bgColor = color;
      this.el.classList.add('has-bgColor');

      // emit events
      var index = this.getIndex();
      this.$align.$bus.emit('changed');
      this.$align.$bus.emit('sectionChanged', {
        from: index,
        to: index,
        props: this.props
      });
    }
  }, {
    key: 'backgroundImage',
    value: function backgroundImage(file) {
      var _this9 = this;

      if (!file) {
        if (this.bgImage) {
          this.bgImage.remove();
          this.bgImage = null;
        }
        return;
      }      var url = '';
      if (file instanceof File) {
        url = URL.createObjectURL(file);
      } else {
        url = file;
      }

      if (!this.bgImage) {
        this.bgImage = document.createElement('div');
        this.bgImage.classList.add('align-bgImage');
        this.el.insertAdjacentElement('afterBegin', this.bgImage);
      }
      var update = function update(src) {
        _this9.bgImage.style.backgroundImage = 'url(' + src + ')';
      };
      this.bgImage.style.backgroundImage = 'url(' + url + ')';
      this.el.classList.add('has-bgImage');
      this.$align.update();

      // emit events
      var index = this.getIndex();
      this.$align.$bus.emit('imageAdded', { file: file, update: update });
      this.$align.$bus.emit('changed');
      this.$align.$bus.emit('sectionChanged', {
        from: index,
        to: index,
        props: this.props
      });
    }
  }, {
    key: 'backgroundVideo',
    value: function backgroundVideo(file) {
      if (!file) {
        if (this.bgVideo) {
          this.bgVideo.remove();
          this.bgVideo = null;
        }
        return;
      }
      var url = '';
      if (file instanceof File) {
        url = URL.createObjectURL(file);
      } else {
        url = file;
      }
      if (!this.bgVideo) {
        this.bgVideo = document.createElement('div');
        this.bgVideo.classList.add('align-bgVideo');
        this.bgVideo.insertAdjacentHTML('afterbegin', '<video autoplay muted loop></video>');
        this.el.insertAdjacentElement('afterbegin', this.bgVideo);
      }
      var source = this.bgVideo.querySelector('source') || document.createElement('source');
      var video = this.bgVideo.querySelector('video');
      video.appendChild(source);
      source.src = url;
      video.load();
      video.play();
      this.el.classList.add('has-bgVideo');
      var update = function update(src) {
        source.src = src;
      };
      this.$align.update();

      // emit events
      var index = this.getIndex();
      this.$align.$bus.emit('videoAdded', { file: file, update: update });
      this.$align.$bus.emit('changed');
      this.$align.$bus.emit('sectionChanged', {
        from: index,
        to: index,
        props: this.props
      });
    }
  }, {
    key: 'moveUp',
    value: function moveUp() {
      var oldIndx = this.getIndex();
      if (!this.$align.sections[oldIndx - 1] || this.$align.sections[oldIndx - 1].type === 'title') return;

      this.$align.editor.insertBefore(this.el, this.$align.sections[oldIndx - 1].el);
      swapArrayItems(this.$align.sections, oldIndx, oldIndx - 1);

      // emit events
      this.$align.$bus.emit('changed');
      this.$align.$bus.emit('sectionChanged', {
        from: oldIndx,
        to: this.getIndex(),
        props: this.props
      });
    }
  }, {
    key: 'moveDown',
    value: function moveDown() {
      var oldIndx = this.getIndex();
      if (!this.$align.sections[oldIndx + 1]) return;
      this.$align.editor.insertBefore(this.el, this.$align.sections[oldIndx + 1].el.nextSibling);
      swapArrayItems(this.$align.sections, oldIndx, oldIndx + 1);

      // emit events
      this.$align.$bus.emit('changed');
      this.$align.$bus.emit('sectionChanged', {
        from: oldIndx,
        to: this.getIndex(),
        props: this.props
      });
    }
  }, {
    key: 'active',
    value: function active() {
      if (Section.activeSection === this) {
        this.$align.$sectionToolbar.update(this);
        return;
      }
      if (Section.activeSection) {
        Section.activeSection.inactive();
      }
      Section.activeSection = this;
      this.el.classList.add('is-active');
      this.$align.$sectionToolbar.update(this);
      this.$align.sidebar.update();
      this.$align.update();
      this.contentDiv.focus();
    }
  }, {
    key: 'inactive',
    value: function inactive() {
      this.el.classList.remove('is-active');
    }
  }, {
    key: 'remove',
    value: function remove() {
      var oldIndx = this.getIndex();
      this.inactive();
      this.el.remove();
      this.$align.sections.splice(oldIndx, 1);
      this.$align.$sectionToolbar.hide();
      this.$align.update();

      // emit events
      this.$align.$bus.emit('changed');
      this.$align.$bus.emit('sectionChanged', {
        from: oldIndx,
        to: null
      });
    }
  }, {
    key: 'duplicate',
    value: function duplicate() {
      var content = this.content;
      var newSection = new Section(this.$align, content, { position: this.getIndex() });

      // emit events
      this.$align.$bus.emit('sectionChanged', {
        from: null, to: this.getIndex()
      });
      this.$align.$bus.emit('changed');
    }
  }, {
    key: 'content',
    get: function get$$1() {
      var output = void 0;
      if (this.props.type === 'text') {
        output = this.el.cloneNode(true);
        var controllers = output.querySelector('.align-sectionControllers');
        var contentDiv = output.querySelector('.align-content');
        var figures = Array.from(contentDiv.querySelectorAll('figure'));
        if (this.props.isHTMLView) {
          contentDiv.innerHTML = contentDiv.innerText;
        }
        figures.forEach(function (fig) {
          return Figure.render(fig);
        });
        output.classList.remove('is-active');
        output.insertAdjacentHTML('beforeend', contentDiv.innerHTML);
        contentDiv.remove();
        controllers.remove();
      }
      if (this.props.type === 'title') {
        return this.title.innerText;
      }
      return output.outerHTML;
    }
  }]);
  return Section;
}();

Section.id = 0;
Section.activeSection = null;
Section.defaults = {
  mode: 'bubble',
  hideWhenClickOut: true,
  commands: ['_sectionUp', '_sectionDown', '_sectionToggleHTML', '_sectionDuplicate', {
    element: 'classes',
    values: ['normal', 'full'],
    icons: ['sectionNormal', 'sectionFull']
  }, 'remove'],
  tooltip: true,
  position: 'left-top'
};

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

var Inserter = function () {
  function Inserter(align, settings) {
    classCallCheck(this, Inserter);

    this.$align = align;
    this.settings = Object.assign({}, settings);
    this._init();
    this.hide();
  }

  /**
   * Create the styler toolbar
   */


  createClass(Inserter, [{
    key: '_init',
    value: function _init() {
      setElementsPrefix('inserter-');
      this.el = document.createElement('div');
      this.menu = document.createElement('div');
      this.list = document.createElement('ul');
      this.toggleButton = button('inserter-toggle', 'plus');

      this.el.classList.add('inserter');
      this.menu.classList.add('inserter-menu');
      this.list.classList.add('inserter-list');
      this.toggleButton.classList.add('inserter-plus');

      this.menu.appendChild(this.list);
      this.el.appendChild(this.toggleButton);
      this.el.appendChild(this.menu);

      this.visible = false;

      this.$align.wrapper.appendChild(this.el);
      this.toggleButton.addEventListener('click', this.active.bind(this));
      this._initComponents();
    }
  }, {
    key: '_initComponents',
    value: function _initComponents() {
      var _this = this;

      this.components = Object.keys(components);
      this.components.forEach(function (name) {
        var li = document.createElement('li');
        var title = document.createElement('span');
        var cmdSchema = components[name].schema;
        var icon = cmdSchema.icon;
        var el = button(name, icon);
        el.addEventListener('click', function () {
          _this.$align.addElement(components[name]);
        });
        el.appendChild(title);
        li.appendChild(el);
        title.innerText = name;
        _this.list.appendChild(li);
      });
    }
  }, {
    key: 'update',
    value: function update(newPosition) {
      if (Selection.range && Selection.range.collapsed && Selection.range.startContainer.nodeType === 1 && Selection.range.startContainer.childNodes.length <= 1 && Selection.range.startContainer.closest('p')) {
        this.position = updatePosition(Selection.range.startContainer, this.el, newPosition || this.settings.position);
        this.show();
        return;
      }
      this.hide();
    }
  }, {
    key: 'active',
    value: function active() {
      this.el.classList.toggle('is-active');
    }
  }, {
    key: 'toggleVisibility',
    value: function toggleVisibility() {
      if (this.visible) {
        this.hide();
        return;
      }
      this.show();
    }
  }, {
    key: 'show',
    value: function show() {
      this.el.classList.add('is-visible');
      this.el.classList.remove('is-hidden');
      this.visible = true;
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.el.classList.remove('is-visible');
      this.el.classList.remove('is-active');
      this.el.classList.add('is-hidden');
      this.visible = false;
    }
  }, {
    key: 'remove',
    value: function remove() {
      var _this2 = this;

      setTimeout(function () {
        _this2.el.remove();
      }, 1);
    }
  }]);
  return Inserter;
}();

var Sidebar = function () {
  function Sidebar(align) {
    classCallCheck(this, Sidebar);

    this.$align = align;
    this._init();
  }

  createClass(Sidebar, [{
    key: '_init',
    value: function _init() {
      setElementsPrefix('align-sidebar-');
      this.el = document.createElement('div');
      this.el.classList.add('align-sidebar');
      this.watchers = [];
    }
  }, {
    key: '_initLayout',
    value: function _initLayout() {
      var _this = this;

      this.layout = this.generateElement('layout:', '\n      <div class="align-layout">\n        <div class="align-layout-margin">\n          <input class="align-layout-input is-top" placeholder="-" data-align-margin-top type="text">\n          <input class="align-layout-input is-left" placeholder="-" data-align-margin-left type="text">\n          <input class="align-layout-input is-right" placeholder="-" data-align-margin-right type="text">\n          <input class="align-layout-input is-bottom" placeholder="-" data-align-margin-bottom type="text">\n        </div>\n        <div class="align-layout-padding">\n          <input class="align-layout-input is-top" placeholder="-" data-align-padding-top type="text">\n          <input class="align-layout-input is-left" placeholder="-" data-align-padding-left type="text">\n          <input class="align-layout-input is-right" placeholder="-" data-align-padding-right type="text">\n          <input class="align-layout-input is-bottom" placeholder="-" data-align-padding-bottom type="text">\n        </div>\n      </div>\n    ');
      this.marginInputs = {
        top: this.layout.querySelector('[data-align-margin-top]'),
        right: this.layout.querySelector('[data-align-margin-right]'),
        bottom: this.layout.querySelector('[data-align-margin-bottom]'),
        left: this.layout.querySelector('[data-align-margin-left]')
      };
      this.paddingInputs = {
        top: this.layout.querySelector('[data-align-padding-top]'),
        right: this.layout.querySelector('[data-align-padding-right]'),
        bottom: this.layout.querySelector('[data-align-padding-bottom]'),
        left: this.layout.querySelector('[data-align-padding-left]')
      };
      Object.keys(this.marginInputs).forEach(function (key) {
        var prop = 'margin-' + key;
        _this.marginInputs[key].value = _this.currentProps.layout[prop] || '';
        _this.marginInputs[key].addEventListener('input', function (evnt) {
          var newObj = Object.assign(Section.activeSection.props.layout, defineProperty({}, prop, evnt.target.value));
          Section.activeSection.props.layout = newObj;
        });
      });
      Object.keys(this.paddingInputs).forEach(function (key) {
        var prop = 'padding-' + key;
        _this.paddingInputs[key].value = _this.currentProps.layout[prop] || '';
        _this.paddingInputs[key].addEventListener('input', function (evnt) {
          var newObj = Object.assign(Section.activeSection.props.layout, defineProperty({}, prop, evnt.target.value));
          Section.activeSection.props.layout = newObj;
        });
      });
    }
  }, {
    key: 'element',
    value: function element(name, type) {
      if (type === 'switcher') {
        var elm = stringToDOM('\n        <label class="align-switcher" for="' + name + '">\n          <span class="align-switcher-info">' + name + '</span>\n          <input class="align-switcher-input" id="' + name + '" type="checkbox">\n          <span class="align-switcher-body">\n            <span class="align-switcher-handle"></span>\n          </span>\n        </label>\n      ');
        var input$$1 = elm.querySelector('.align-switcher-input');
        return { input: input$$1, elm: elm };
      }
    }
  }, {
    key: 'field',
    value: function field$$1(name, desc, type) {
      var el = document.createElement('div');
      var labelEl = document.createElement('label');
      el.classList.add('align-sidebar-field');
      labelEl.classList.add('align-sidebar-label');
      labelEl.innerText = desc;
      el.appendChild(labelEl);
      this.el.appendChild(el);
      if (type === 'file') {
        var elm = stringToDOM('<div class="align-sidebar-file"></div>');
        var label = stringToDOM('<label class="align-sidebar-label" for="' + name + '"></label>');
        var input$$1 = stringToDOM('<input class="align-sidebar-input" id="' + name + '" type="file">');
        var close = stringToDOM('<button>' + icons['close'] + '</button>');
        [label, input$$1, close].forEach(function (comp) {
          elm.appendChild(comp);
        });
        el.appendChild(elm);
        close.addEventListener('click', function () {
          label.innerText = 'Add image';
          input$$1.value = '';
          input$$1.dispatchEvent(new window.Event('change'));
        });
        return { input: input$$1, label: label, close: close, el: el };
      }
      if (type === 'color') {
        var _elm = stringToDOM('<div class="align-sidebar-colors"></div>');
        var _input = stringToDOM('<input class="align-sidebar-input" id="' + name + '" type="text">');
        var colors = ['black', 'white', 'gray', 'clear'];
        colors = colors.map(function (color) {
          return {
            el: stringToDOM('<button class="align-sidebar-color is-' + color + '" type="text"><button>'),
            color: color
          };
        });
        colors.forEach(function (color) {
          _elm.appendChild(color.el);
        });
        _elm.appendChild(_input);
        var colorpikcer = new Colorpicker(_input, {
          defaultColor: '#fff',
          mode: 'hex',
          picker: { mode: 'square' },
          guideIcon: '\n          <svg viewBox="0 0 24 24">\n            <circle cx="12" cy="12" r="11"></circle>\n          </svg>\n        '
        });
        el.appendChild(_elm);
        return { input: _input, colorpikcer: colorpikcer, colors: colors };
      }
    }
  }, {
    key: 'generateElement',
    value: function generateElement(label, markup) {
      var el = document.createElement('div');
      var labelEl = document.createElement('label');
      el.classList.add('align-sidebar-field');
      labelEl.classList.add('align-sidebar-label');
      labelEl.innerText = label;
      this.el.appendChild(el);
      el.appendChild(labelEl);
      el.insertAdjacentHTML('beforeend', markup);
      return el;
    }
  }, {
    key: 'updateFields',
    value: function updateFields() {
      var _this2 = this;

      this.el.innerHTML = '';
      this.fields.forEach(function (field$$1) {
        switch (field$$1) {
          case 'backgroundImage':
            _this2.backgroundImage = _this2.field('background-image', 'Background image:', 'file');
            _this2.backgroundImage.input.addEventListener('change', function (evnt) {
              var active = Section.activeSection;
              active.props.backgroundImage = evnt.target.files[0];
            });
            _this2.backgroundImage.label.innerText = _this2.currentProps.backgroundImage ? _this2.currentProps.backgroundImage.name || _this2.currentProps.backgroundImage : 'Add image';

            _this2.parallax = _this2.element('parallax', 'switcher');
            _this2.backgroundImage.el.insertAdjacentElement('beforeend', _this2.parallax.elm);
            _this2.parallax.input.checked = _this2.currentProps.parallax;
            _this2.parallax.input.addEventListener('change', function (evnt) {
              var active = Section.activeSection;
              active.props.parallax = !!evnt.target.checked;
            });
            break;

          case 'backgroundVideo':
            _this2.backgroundVideo = _this2.field('background-video', 'Background video:', 'file');
            _this2.backgroundVideo.input.addEventListener('change', function (evnt) {
              var active = Section.activeSection;
              active.props.backgroundVideo = evnt.target.files[0];
            });
            _this2.backgroundVideo.label.innerText = _this2.currentProps.backgroundVideo ? _this2.currentProps.backgroundVideo.name || _this2.currentProps.backgroundVideo : 'Add video';
            break;

          case 'backgroundColor':
            _this2.backgroundColor = _this2.field('background-color', 'Background color:', 'color');
            _this2.backgroundColor.input.addEventListener('change', function (evnt) {
              var active = Section.activeSection;
              active.props.backgroundColor = evnt.target.value;
            });
            _this2.backgroundColor.colors.forEach(function (color) {
              color.el.addEventListener('click', function () {
                var active = Section.activeSection;
                if (color.color !== 'clear') {
                  active.props.backgroundColor = color.color;
                }
                if (color.color === 'clear') {
                  active.props.backgroundColor = null;
                }
              });
            });
            _this2.backgroundColor.colorpikcer.selectColor(_this2.currentProps.backgroundColor || '#fff', true);
            break;

          case 'customClass':
            _this2.customClass = _this2.generateElement('Custom class:', '<input class="align-sidebar-input" data-align-input type="text">');
            _this2.customClass = _this2.customClass.querySelector('[data-align-input]');
            _this2.customClass.value = _this2.currentProps.customClass;
            _this2.customClass.addEventListener('input', function () {
              var _this3 = this;

              var active = Section.activeSection;
              active.props.customClass = function () {
                var values = _this3.value.split(/[ ,]+/);
                return values.map(function (val) {
                  return val.trim();
                }).filter(function (val) {
                  return val !== '';
                });
              }();
            });
            break;

          case 'layout':
            _this2._initLayout();
        }
      });
    }
  }, {
    key: 'update',
    value: function update() {
      this.currentProps = Section.activeSection.props;
      this.fields = Section.activeSection.fields;
      this.updateFields();
    }
  }]);
  return Sidebar;
}();

var Align = function () {
  function Align(selector, settings) {
    classCallCheck(this, Align);

    this.el = select(selector);
    this.settings = Object.assign({}, Align.defaults, settings);
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
      Component.config(this);
      this.$bus = new EventBus();
      this.startContent = Array.from(this.el.children);
      this.el.innerText = '';
      document.execCommand('defaultParagraphSeparator', false, 'p');
      this.cmdKey = userOS() === 'Mac' ? 'metaKey' : 'ctrlKey';
      this.cmdKeyPressed = false;

      this._initEditor();
      this._initStylers();
      this._initSections();
      this._initEvents();
      this.sidebar = new Sidebar(this);
      this.el.appendChild(this.sidebar.el);
    }

    /**
     * create all stylers instances
     */

  }, {
    key: '_initStylers',
    value: function _initStylers() {
      this.$sectionToolbar = new Styler(this, Object.assign({}, Section.defaults, this.settings.section));

      if (this.settings.toolbar) {
        this.toolbar = new Styler(this, Object.assign({}, this.settings.toolbar, {
          mode: 'toolbar'
        }));
      }
      if (this.settings.bubble) {
        this.bubble = new Styler(this, Object.assign({}, this.settings.bubble, {
          mode: 'bubble',
          tooltip: false
        }));
      }
      this.inserter = new Inserter(this, {});
    }
    /**
     * Create the editor
     */

  }, {
    key: '_initEditor',
    value: function _initEditor() {
      this.wrapper = document.createElement('div');
      this.editor = document.createElement('div');
      this.wrapper.classList.add('align-wrapper');
      this.editor.classList.add('align-editor');

      this.wrapper.appendChild(this.editor);
      this.el.appendChild(this.wrapper);
      this.editor.focus();
      Selection.update();
    }
  }, {
    key: '_initSections',
    value: function _initSections() {
      var _this = this;

      this.sections = [];

      if (this.settings.postTitle !== false) {
        this.postTitle = new Section(this, this.settings.postTitle, {
          type: 'title'
        });
      }
      this.startContent.forEach(function (content) {
        return new Section(_this, content);
      });
      var addSection = document.createElement('button');
      addSection.classList.add('align-sectionAdd', 'is-main');
      this.wrapper.appendChild(addSection);
      addSection.addEventListener('click', function () {
        var newSection = new Section(_this);
        setTimeout(function () {
          newSection.active();
          Selection.selectElement(newSection.contentDiv.querySelector('p'));
        }, 1);
      });
    }

    /**
     * Add all events listeners
     */

  }, {
    key: '_initEvents',
    value: function _initEvents() {
      var _this2 = this;

      this.editor.addEventListener('focus', this.highlight.bind(this));
      this.editor.addEventListener('mouseup', this.update.bind(this), true);
      this.editor.addEventListener('input', function () {
        _this2.$bus.emit('changed');
      });
      window.addEventListener('keyup', this.update.bind(this), true);
    }
  }, {
    key: 'clearContent',
    value: function clearContent() {
      this.sections = [];
      this.editor.innerHTML = '';
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
      this.el.classList.toggle('is-fullscreen');
    }
  }, {
    key: 'toggleSidebar',
    value: function toggleSidebar() {
      this.el.classList.toggle('is-sidebar-active');
    }
  }, {
    key: 'update',
    value: function update() {
      var _this3 = this;

      Selection.update();
      setTimeout(function () {
        if (_this3.settings.toolbar) {
          _this3.toolbar.update();
        }
        if (_this3.settings.bubble) {
          _this3.bubble.update();
        }
        _this3.inserter.update();
      }, 1);
    }
  }, {
    key: 'applyFont',
    value: function applyFont(schema, cmd) {
      this.el.style.fontFamily = cmd.fontName[0];
    }
  }, {
    key: 'addHTML',
    value: function addHTML(args) {
      var elHTML = '';
      if (Array.isArray(args)) {
        elHTML = args[0];
      }
      if (typeof args === 'string') {
        elHTML = args;
      }
      var domElement = stringToDOM(elHTML);
      if (!domElement) return;
      var el = Selection.range.startContainer;
      el.parentNode.insertBefore(domElement, el);
      this.inserter.hide();
      this.update();
    }
  }, {
    key: 'addElement',
    value: function addElement(args) {
      var _this4 = this;

      var elClass = '';
      if (Array.isArray(args)) {
        elClass = args[0];
      }
      if (typeof args === 'function') {
        elClass = args;
      }
      elClass.add().then(function (newElement) {
        if (!newElement.el) return;
        var el = Selection.range.startContainer;
        el = el.closest('p');
        if (!el || !el.tagName) {
          return;
        }
        if (el.tagName === 'P') {
          el.parentNode.replaceChild(newElement.el, el);
        }
        if (el.tagName !== 'P') {
          el.appendChild(newElement.el);
        }
        _this4.inserter.hide();
        _this4.update();
      });
    }
  }, {
    key: 'content',
    get: function get$$1() {
      return this.sections.reduce(function (acc, section) {
        if (section.props.type !== 'text') {
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
        var title = this.sections.find(function (sec) {
          return sec.props.type === 'title';
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

Align.defaults = {
  toolbar: null,
  bubble: null,
  section: null,
  shortcuts: false,
  postTitle: false
};

export default Align;
