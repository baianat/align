import Prism from 'prismjs';
import { select } from '../partial/elements';
import { removeClassByPrefix } from '../partial/utils';

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
    this.changeLanguage(this.settings.language);
  }

  _init () {
    this.textarea = document.createElement('textarea');
    this.wrapper = document.createElement('div');
    this.pre = document.createElement('pre');
    this.code = document.createElement('code');

    this.textarea.classList.add('align-codeEditor-textarea');
    this.wrapper.classList.add('align-codeEditor-wrapper');
    this.pre.classList.add('align-codeEditor-pre');
    this.code.classList.add('align-codeEditor-code');

    this.textarea.spellcheck = false;
    this.textarea.autocapitalize = false;
    this.textarea.autocomplete = false;
    this.textarea.autocorrect = false;

    this.wrapper.appendChild(this.textarea);
    this.wrapper.appendChild(this.pre);
    this.el.appendChild(this.wrapper);
    this.pre.appendChild(this.code);

    this.textarea.addEventListener('input', this.highlight.bind(this));
    this.textarea.addEventListener('scroll', this.handleScroll.bind(this));

    this._initLangSelector();
  }

  _initLangSelector () {
    const { wrapper, el } = select(
      'langSelector',
      ['javascript', 'html', 'css']
    );
    this.el.appendChild(wrapper);
    el.addEventListener('change', () => {
      this.changeLanguage(
        el[el.selectedIndex].value
      );
    });
  }

  changeLanguage (newLang) {
    this.settings.language = newLang;
    removeClassByPrefix(this.pre, 'language');
    this.pre.classList.add(`language-${this.settings.language}`);
    this.highlight();
  }

  highlight () {
    const highlighted = Prism.highlight(
      this.textarea.value,
      Prism.languages[this.settings.language]
    );
    this.code.innerHTML = highlighted;
  }

  handleScroll () {
    const scrolledY = this.textarea.scrollTop;
    const scrolledX = this.textarea.scrollLeft;
    this.pre.style.transform = `translate(${-1 * scrolledX}px, ${-1 * scrolledY}px)`
  }

  static defaults = {
    language: 'javascript'
  }
}
