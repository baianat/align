import hljs from 'highlight.js';
import { select } from './util';
import commands from './commands';
import icons from './icons';
import Styler from './styler';

class Align {
  constructor(selector, {
    defaultText = 'Type here',
    toolbar = null,
    bubble = null
  } = {}) {
    this.el = select(selector);
    this.settings = {
      defaultText: this.el.innerHTML ? this.el.innerHTML : defaultText,
      toolbar,
      bubble
    };
    this.el.innerText = '';
    this.init();
  }

  /**
   * Get editor's content
   */
  get content() {
    return document.createTextNode(this.text.innerHTML);
  }

  static extend(name, extension) {
    commands[name] = extension;
  }

  static extendIcons(name, path) {
    icons[name] = path;
  }
  /**
   * Create all editor elements
   */
  init() {
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
  initEditor() {
    document.execCommand('defaultParagraphSeparator', false, 'p');
    this.text = document.createElement('div');
    this.paragraph = document.createElement('p');

    this.text.contentEditable = 'true';
    this.text.classList.add('align-content');
    this.paragraph.innerHTML = this.settings.defaultText + '\n';

    this.el.appendChild(this.text);
    this.text.appendChild(this.paragraph);
  }

  /**
   * Add all events listeners
   */
  initEvents() {
    this.text.addEventListener('focus', () => {
      this.highlight();
    });

    this.text.addEventListener('mouseup', this.updateStylers.bind(this));

    window.addEventListener('keyup', (event) => {
      // Do nothing if the event was already processed
      if (event.defaultPrevented) {
        return;
      }

      
      switch (event.key) {
        case 'ArrowDown':
          this.updateStylers();
          break;
        case 'ArrowUp':
          this.updateStylers();
          break;
        case 'ArrowLeft':
          this.bubble.updateStylerStates();
          break;
        case 'ArrowRight':
          this.bubble.updateStylerStates();
          break;
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
    const code = Array.from(this.text.querySelectorAll('pre'));
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
      const content = document.createTextNode(this.text.innerHTML);
      const pre = document.createElement('pre');

      this.text.innerHTML = '';
      this.text.contentEditable = false;
      pre.id = 'content';
      pre.contentEditable = false;
      pre.style.whiteSpace = 'pre-wrap';
      pre.appendChild(content);
      this.text.appendChild(pre);
      this.highlight();
      return;
    }
    this.text.innerHTML = this.text.innerText;
    this.text.contentEditable = true;
    this.text.focus();
  }

  updateStylers() {
    if (this.settings.toolbar) {
      this.toolbar.updateStylerStates();
    }
    if (this.settings.bubble) {
      this.bubble.updateStylerStates();
    }
  }
}

export default Align;
