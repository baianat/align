import Prism from 'prismjs';

export default class CodeEditor {
  constructor (el, content, settings) {
    this.settings = {
      ...CodeEditor.defaults,
      ...settings
    };
    this.el = el;
    this.el.contentEditable = false;
    this.el.classList.add('align-codeEditor');
    this._init();

    this.textarea.value = content;
    this.highlight();
  }

  _init () {
    this.wrapper = document.createElement('div');
    this.textarea = document.createElement('textarea');
    this.pre = document.createElement('pre');
    this.code = document.createElement('code');

    this.wrapper.classList.add('align-codeEditor-wrapper');
    this.textarea.classList.add('align-codeEditor-textarea');
    this.pre.classList.add('align-codeEditor-pre');
    this.code.classList.add('align-codeEditor-code');

    this.wrapper.appendChild(this.textarea);
    this.wrapper.appendChild(this.pre);
    this.pre.appendChild(this.code);
    this.el.appendChild(this.wrapper);
    this.textarea.addEventListener('input', this.highlight.bind(this));
  }

  highlight () {
    console.log('ff');
    const highlighted = Prism.highlight(
      this.textarea.value,
      Prism.languages[this.settings.language]
    );
    this.code.innerHTML = highlighted;
  }

  static defaults = {
    language: 'javascript'
  }
}
