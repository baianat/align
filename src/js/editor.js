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

  /**
   * Get editor's content
   */
  get content() {
    return document.createTextNode(this.el.innerHTML);
  }

  /**
   * Create all editor elements
   */
  init() {
    this.HTML = false;
    this.styler = new styler(this, this.options.styler);
    this.initEditor();
    this.initEvents();
  }

  /**
   * Create the editor
   */
  initEditor() {
    this.el.contentEditable = 'true';
    const text = document.createElement('p');
    text.innerText = this.options.defaultText + '\n';
    this.el.appendChild(text);
  }

  /**
   * Add all events listeners
   */
  initEvents() {
    this.el.addEventListener('focus', () => {
      this.highlight();
    });

    this.el.addEventListener('click', () => {
      this.styler.updateStylerStates();
    });

    window.addEventListener("keydown", (event) => {
      // Do nothing if the event was already processed
      if (event.defaultPrevented) {
        return;
      }

      switch (event.key) {
        case 'Tab':
          this.execute('indent');
          break;

        default:
          return;
      }

      // Cancel the default action to avoid it being handled twice
      event.preventDefault();
    }, true);
  }

  /**
   * Hightlight code text
   */
  highlight() {
    const code = Array.from(this.el.querySelectorAll('pre'));

    code.forEach((block) => {
      hljs.highlightBlock(block);
    })
  }

  /**
   * Toggle on/off HTML represntation
   */
  toggleHTML() {
    this.HTML = !this.HTML;
    if (this.HTML) {
      const content = document.createTextNode(this.el.innerHTML);
      const pre = document.createElement("pre");

      this.el.innerHTML = "";
      this.el.contentEditable = false;
      pre.id = "content";
      pre.contentEditable = false;
      pre.appendChild(content);
      this.el.appendChild(pre);
      return;
    }
    this.el.innerHTML = this.el.innerText;
    this.el.contentEditable = true;
    this.el.focus();
  }
}

export default Editor;