(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Editor = factory());
}(this, (function () { 'use strict';

/**
 * Utilities
 */
function select(element) {
  if (typeof element === 'string') {
    return document.querySelector(element);
  }
  return element;
}















/**
 * Converts an array-like object to an array.
 */

var styler = "\n  <ul class=\"styler\">\n    <li>\n      <select class=\"styler-select\" id=\"formating\">\n        <option selected>- formatting -</option>\n        <option value=\"h1\">Title 1</option>\n        <option value=\"h2\">Title 2</option>\n        <option value=\"h3\">Title 3</option>\n        <option value=\"h4\">Title 4</option>\n        <option value=\"h5\">Title 5</option>\n        <option value=\"h6\">Title 6</option>\n        <option value=\"p\">Paragraph</option>\n        <option value=\"pre\">Preformatted</option>\n      </select>\n    </li>\n    <li>\n      <select class=\"styler-select\" id=\"size\">\n        <option selected>\n          size\n        </option>\n        <option value=\"1\">1</option>\n        <option value=\"2\">2</option>\n        <option value=\"3\">3</option>\n        <option value=\"4\">4</option>\n        <option value=\"5\">5</option>\n        <option value=\"6\">6</option>\n        <option value=\"7\">7</option>\n      </select>\n    </li>\n    <li>\n      <input class=\"styler-color\" id=\"color\" type=\"color\"/>\n    </li>\n    <li>\n      <button class=\"styler-button\" id=\"bold\">\n        <svg class=\"icon\">\n          <use xlink:href=\"dist/svg/symbols.svg#icon-bold\"></use>\n        </svg>\n      </button>\n    </li>\n    <li>\n      <button class=\"styler-button\" id=\"italic\">\n        <svg class=\"icon\">\n          <use xlink:href=\"dist/svg/symbols.svg#icon-italic\"></use>\n        </svg>\n      </button>\n    </li>\n    <li>\n      <button class=\"styler-button\" id=\"underline\">\n        <svg class=\"icon\">\n          <use xlink:href=\"dist/svg/symbols.svg#icon-underline\"></use>\n        </svg>\n      </button>\n    </li>\n    <li>\n      <button class=\"styler-button\" id=\"alignLeft\">\n        <svg class=\"icon\">\n          <use xlink:href=\"dist/svg/symbols.svg#icon-alignLeft\"></use>\n        </svg>\n      </button>\n    </li>\n    <li>\n      <button class=\"styler-button\" id=\"alignCenter\">\n        <svg class=\"icon\">\n          <use xlink:href=\"dist/svg/symbols.svg#icon-alignCenter\"></use>\n        </svg>\n      </button>\n    </li>\n    <li>\n      <button class=\"styler-button\" id=\"alignRight\">\n        <svg class=\"icon\">\n          <use xlink:href=\"dist/svg/symbols.svg#icon-alignRight\"></use>\n        </svg>\n      </button>\n    </li>\n    <li>\n      <button class=\"styler-button\">\n        <input class=\"styler-input\" type=\"file\" id=\"addImage\">\n        <svg class=\"icon\">\n          <use xlink:href=\"dist/svg/symbols.svg#icon-image\"></use>\n        </svg>\n      </button>\n    </li>\n  </ul>\n";

var Editor = function Editor(selector, options) {
  if ( options === void 0 ) options = {};

  this.el = select(selector);
  this.init();
};

Editor.prototype.init = function init () {
  this.initStyler();
  this.initStylerActions();
  this.initEditor();
};

Editor.prototype.initEditor = function initEditor () {
    var this$1 = this;

  this.el.contentEditable = 'true';
  var text = document.createElement('p');
  text.innerText = 'Type here';
  this.el.appendChild(text);
  this.el.addEventListener('focus', function () {
    this$1.styler.wrapper.classList.add('is-visiable');
  });
  this.el.addEventListener('click', function () {
    this$1.updateStylerPositoin();
  });
};

Editor.prototype.initStyler = function initStyler () {
  this.styler = {};
  this.el.insertAdjacentHTML('beforebegin', styler);
  this.styler.wrapper = select('.styler');
  this.styler.formating = select('#formating');
  this.styler.size = select('#size');
  this.styler.color = select('#color');
  this.styler.bold = select('#bold');
  this.styler.italic = select('#italic');
  this.styler.underline = select('#underline');
  this.styler.alignLeft = select('#alignLeft');
    this.styler.alignCenter = select('#alignCenter');
    this.styler.alignRight = select('#alignRight');
    this.styler.addImage = select('#addImage');


  };

  Editor.prototype.initStylerActions = function initStylerActions () {
    var this$1 = this;

    this.styler.formating.addEventListener('change', function () {
      var select$$1 = this$1.styler.formating;
      this$1.excute('formatblock', select$$1[select$$1.selectedIndex].value);
    });
    this.styler.size.addEventListener('change', function () {
      var select$$1 = this$1.styler.size;
      this$1.excute('fontsize', select$$1[select$$1.selectedIndex].value);
    });
    this.styler.color.addEventListener('input', function () { return this$1.excute('forecolor', this$1.styler.color.value); });
    this.styler.bold.addEventListener('click', function () { return this$1.excute('bold'); });
    this.styler.italic.addEventListener('click', function () { return this$1.excute('italic'); });
    this.styler.underline.addEventListener('click', function () { return this$1.excute('underline'); });
    this.styler.alignLeft.addEventListener('click', function () { return this$1.excute('justifyleft'); });
    this.styler.alignCenter.addEventListener('click', function () { return this$1.excute('justifycenter'); });
    this.styler.alignRight.addEventListener('click', function () { return this$1.excute('justifyright'); });
    this.styler.addImage.addEventListener('change', function () { return this$1.insertImage(); });
  };

  Editor.prototype.excute = function excute (cmd, value) {
    document.execCommand(cmd, false, value);
    this.el.focus();
    this.updateStylerPositoin();
  };

  Editor.prototype.getSelectedPosition = function getSelectedPosition () {
    return window.getSelection().getRangeAt(0);
  };

  Editor.prototype.updateStylerPositoin = function updateStylerPositoin () {
    var selectedPosition = this.getSelectedPosition();
    var dummy = document.createElement('sapn');
    var dummyRect;

    selectedPosition.insertNode(dummy);
    dummyRect = dummy.getBoundingClientRect();
    dummy.parentNode.removeChild(dummy);
    this.styler.wrapper.style.top = (dummyRect.top + window.scrollY - 80) + "px";
    this.styler.wrapper.style.left = (dummyRect.left) + "px";
  };

  Editor.prototype.insertImage = function insertImage () {
    var file = this.styler.addImage.files[0];
    if (!file) return;
    var imageURL = URL.createObjectURL(file);
    var img = document.createElement('img');
    var selectedPosition;

    img.src = imageURL;
    img.classList.add('editor-image');
    selectedPosition = this.getSelectedPosition();
    selectedPosition.insertNode(img);
  };

return Editor;

})));
