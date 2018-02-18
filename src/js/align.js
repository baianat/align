import hljs from 'highlight.js';
import { select, userOS } from './partial/util';
import cmdsSchema from './partial/cmdsSchema';
import icons from './partial/icons';
import Selection from './selection';
import Creator from './creator';
import Styler from './styler';

class Align {
  constructor(selector, {
    toolbar = null,
    bubble = null,
    creator = null,
    shortcuts = false,
    postTitle = false
  } = {}) {
    this.el = select(selector);
    this.settings = {
      defaultText: this.el.innerHTML,
      toolbar,
      bubble,
      creator,
      shortcuts,
      postTitle
    };
    this.init();
  }

  /**
   * Get editor's content
   */
  get content() {
    return this.editor.innerHTML;
  }

  get title() {
    if (this.postTitle) {
      return this.postTitle.value;
    }
  }

  static extend(name, extension) {
    cmdsSchema[name] = extension;
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
    if (this.settings.creator) {
      this.creator = new Creator(this, this.settings.creator);
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
    if (this.settings.postTitle) {
      this.postTitle = document.createElement('textarea');
      this.postTitle.placeholder = this.settings.postTitle;
      this.postTitle.classList.add('align-title');
      this.el.insertBefore(this.postTitle, this.editor);
    }
  }

  /**
   * Add all events listeners
   */
  initEvents() {
    this.editor.addEventListener('focus', () => {
      this.highlight();
    });

    document.addEventListener('mouseup', this.update.bind(this), true);

    document.addEventListener('keydown', (event) => {
      // Do nothing if the event was already processed
      if (event.defaultPrevented) {
        return;
      }

      this.update();
      if (event[this.cmdKey] && this.settings.shortcuts) {
        switch (event.key.toUpperCase()) {
          case 'B':
            event.preventDefault();
            this.execute('bold'); break;
          case 'I':
            event.preventDefault();
            this.execute('italic'); break;
          case 'U':
            event.preventDefault();
            this.execute('underline'); break;
          case 'E':
            event.preventDefault();
            this.execute('justifyCenter'); break;
          case 'R':
            event.preventDefault();
            this.execute('justifyRight'); break;
          case 'L':
            event.preventDefault();
            this.execute('justifyLeft'); break;
          case 'J':
            event.preventDefault();
            this.execute('justifyFull'); break;
          case 'A':
            event.preventDefault();
            this.execute('selectAll'); break;
          case 'Z':
            event.preventDefault();
            if (event.shiftKey) {
              this.execute('redo'); break;
            }
            this.execute('undo'); break;
          case '\\':
            event.preventDefault();
            this.execute('removeFormat'); break;
          case '=':
            event.preventDefault();
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

  update() {
    Selection.updateSelectedRange();
    setTimeout(() => {
      if (this.settings.toolbar) {
        this.toolbar.updateStyler();
      }
      if (this.settings.bubble) {
        this.bubble.updateStyler();
      }
      if (this.settings.creator) {
        this.creator.update();
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
    this.update();
  }
}

export default Align;
