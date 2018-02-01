import hljs from 'highlight.js';
import { select } from './util';
import cmdsSchemas from './cmdsSchemas';
import icons from './icons';
import Styler from './styler';
import Selection from './selection';
import selection from './selection';

class Align {
  constructor(selector, {
    toolbar = null,
    bubble = null
  } = {}) {
    this.el = select(selector);
    this.settings = {
      defaultText: this.el.innerHTML,
      toolbar,
      bubble
    };
    this.init();
  }

  /**
   * Get editor's content
   */
  get content() {
    return document.createTextNode(this.editor.innerHTML);
  }

  static extend(name, extension) {
    cmdsSchemas[name] = extension;
  }

  static extendIcons(name, path) {
    icons[name] = path;
  }
  /**
   * Create all editor elements
   */
  init() {
    this.HTML = false;
    this.el.innerText = '';
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
  initEditor() {
    document.execCommand('defaultParagraphSeparator', false, 'p');

    this.editor = document.createElement('div');
    this.editor.contentEditable = 'true';
    this.editor.classList.add('align-content');
    this.editor.innerHTML = this.settings.defaultText + '\n';

    this.el.appendChild(this.editor);
    this.editor.focus();
    Selection.updateSelectedRange();
  }

  /**
   * Add all events listeners
   */
  initEvents() {
    this.editor.addEventListener('focus', () => {
      this.highlight();
    });

    window.addEventListener('mouseup', this.updateStylers.bind(this));

    window.addEventListener('keyup', (event) => {
      // Do nothing if the event was already processed
      if (event.defaultPrevented) {
        return;
      }
      this.updateStylers();

      switch (event.key) {
        case 'Tab':
          this.styler.execute('indent');
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
  highlight() {
    if (!hljs) {
      return;
    }
    const code = Array.from(this.editor.querySelectorAll('pre'));
    code.forEach((block) => {
      hljs.highlightBlock(block);
    })
  }


  /**
   * Toggle on/off HTML
   */
  toggleHTML() {
    this.HTML = !this.HTML;
    if (this.HTML) {
      const content = document.createTextNode(this.editor.innerHTML);
      const pre = document.createElement('pre');

      this.editor.innerHTML = '';
      pre.id = 'content';
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

  updateStylers() {
    Selection.updateSelectedRange();
    setTimeout(() => {
      if (this.settings.toolbar) {
        this.toolbar.updateStylerStates();
      }
      if (this.settings.bubble) {
        this.bubble.updateStylerStates();
      }
    }, 16);
  }

  applyFont(schema, cmd) {
    this.el.style.fontFamily = cmd.fontName[0];
  }
}

export default Align;
