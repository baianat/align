import hljs from 'highlight.js/lib/highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);

import { select } from './util';
import styler from './styler';


class Editor {
  constructor(selector, {
    defaultText = 'Type here',
    styler = null,
  } = {}) {
    this.el = select(selector);
    this.options = {
      defaultText,
      styler
    };
    this.init();
  }

  get content() {
    return document.createTextNode(this.el.innerHTML);
  }

  init() {
    this.HTML = false;
    this.initStyler();
    this.initEditor();
  }

  initEditor() {
    this.el.contentEditable = 'true';
    const text = document.createElement('p');
    text.innerText = this.options.defaultText + '\n';
    this.el.appendChild(text);
    this.el.addEventListener('focus', () => {
      this.highlight();
    });

    this.el.addEventListener('click', () => {
      this.styler.updateStylerStates();
    });
    
    window.addEventListener("keydown", (event) => {
      if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
      }

      switch (event.key) {
        case "Tab":
          this.execute('indent');
          break;
        default:
          return; // Quit when this doesn't handle the key event.
      }

      // Cancel the default action to avoid it being handled twice
      event.preventDefault();
    }, true);
  }

  initStyler() {
    this.styler = new styler(this.el, this.options.styler);
  }

  highlight() {
    const code = Array.from(this.el.querySelectorAll('pre'));

    code.forEach((block) => {
      hljs.highlightBlock(block);
    })
  }
}

export default Editor;