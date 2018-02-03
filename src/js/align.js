import hljs from 'highlight.js';
import { select, userOS } from './util';
import cmdsSchemas from './cmdsSchemas';
import icons from './icons';
import Styler from './styler';
import Selection from './selection';

class Align {
  constructor(selector, {
    toolbar = null,
    bubble = null,
    shortcuts = false
  } = {}) {
    this.el = select(selector);
    this.settings = {
      defaultText: this.el.innerHTML,
      toolbar,
      bubble,
      shortcuts
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
      this.settings.bubble.tooltip = false;
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
    this.cmdKey = userOS() === 'Mac' ? 'metaKey' : 'ctrlKey';
    this.cmdKeyPressed = false;
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

    window.addEventListener('keydown', (event) => {
      // Do nothing if the event was already processed
      if (event.defaultPrevented) {
        return;
      }
      this.updateStylers();

      if (event[this.cmdKey] && this.settings.shortcuts) {
        event.preventDefault();

        switch (event.key.toUpperCase()) {
          case 'B':
            this.execute('bold'); break;
          case 'I':
            this.execute('italic'); break;
          case 'U':
            this.execute('underline'); break;
          case 'E':
            this.execute('justifyCenter'); break;
          case 'R':
            this.execute('justifyRight'); break;
          case 'L':
            this.execute('justifyLeft'); break;
          case 'J':
            this.execute('justifyFull'); break;
          case 'A':
            this.execute('selectAll'); break;
          case '\\':
            this.execute('removeFormat'); break;
          case '=':
            if (event.shiftKey) {
              this.execute('superscript'); break;
            }
            this.execute('subscript'); break;
          default:
            break;
        }
      }

      switch (event.key) {
        case 'Tab':
          event.preventDefault();
          if (event.shiftKey) {
            this.execute('outdent', false, true); break;
          }
          this.execute('indent', false, true); break;
        default:
          break;
      }
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

  execute(cmd, value, useCSS = false) {
    if (this.HTML) return;
    document.execCommand('styleWithCSS', false, useCSS);
    document.execCommand(cmd, false, value);
    document.execCommand('styleWithCSS', false, false);
    this.el.focus();
    this.updateStylers();
  }
}

export default Align;
