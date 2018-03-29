import { select, userOS, launchFullscreen, exitFullscreen } from './partial/util';
import cmdsSchema from './partial/cmdsSchema';
import icons from './partial/icons';
import Selection from './selection';
import Section from './section';
import Creator from './creator';
import Styler from './styler';
import EventBus from './events';

export default class Align {
  constructor (selector, {
    toolbar = null,
    bubble = null,
    creator = null,
    shortcuts = false,
    postTitle = false
  } = {}) {
    this.el = select(selector);
    this.settings = {
      toolbar,
      bubble,
      creator,
      shortcuts,
      postTitle
    };
    this._init();
  }

  /**
   * Get editor's content
   */
  get content () {
    return Section.allSections.reduce((acc, section) => {
      if (section.type !== 'text') {
        return acc;
      }
      return acc += section.content;
    }, '')
  }

  get title () {
    if (this.postTitle) {
      const title = Section.allSections.find((sec) => sec.type === 'title');
      return title.content;
    }
  }

  static extend (name, extension) {
    cmdsSchema[name] = extension;
  }

  static extendIcons (name, path) {
    icons[name] = path;
  }
  /**
   * Create all editor elements
   */
  _init () {
    this.$bus = new EventBus();
    this.startContent = Array.from(this.el.children);
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
    this._initEditor();
    this._initSections();
    this._initEvents();
  }

  /**
   * Create the editor
   */
  _initEditor () {
    document.execCommand('defaultParagraphSeparator', false, 'p');

    this.editor = document.createElement('div');
    this.editor.classList.add('align-editor');
    this.cmdKey = userOS() === 'Mac' ? 'metaKey' : 'ctrlKey';
    this.cmdKeyPressed = false;
    this.el.appendChild(this.editor);
    this.editor.focus();
    Selection.updateSelectedRange();
  }

  _initSections () {
    this.activeSection = '';
    Section.config(this);

    if (this.settings.postTitle !== false) {
      this.postTitle = new Section(this.settings.postTitle, '', 'title');
    }
    this.startContent.forEach(e => new Section(e));
    this.newSectionButton = document.createElement('button');
    this.newSectionButton.classList.add('align-addButton');
    this.el.appendChild(this.newSectionButton);
    this.newSectionButton.addEventListener('click', () => new Section().active());
  }

  /**
   * Add all events listeners
   */
  _initEvents () {
    this.editor.addEventListener('focus', () => {
      this.highlight();
    });

    this.editor.addEventListener('mouseup', this.update.bind(this), true);

    this.editor.addEventListener('keydown', (event) => {
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
          case 'F':
            event.preventDefault();
            if (event.shiftKey) {
              this.toggleFullScreen();
            }
            break;
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
        case 'Escape':
          this.el.classList.remove('is-fullscreen');
          exitFullscreen();
          break;
        default:
          break;
      }
    }, true);
  }

  /**
   * Hight light code text
   */
  highlight() {
    if (typeof hljs === 'undefined') {
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

  toggleFullScreen() {
    const state = document.fullscreenElement || document.webkitIsFullScreen;
    if (!state) {
      launchFullscreen(this.el);
      this.el.classList.add('is-fullscreen');
      return;
    }
    this.el.classList.remove('is-fullscreen');
    exitFullscreen();
  }

  update() {
    Selection.updateSelectedRange();
    setTimeout(() => {
      if (this.settings.toolbar) {
        this.toolbar.update();
      }
      if (this.settings.bubble) {
        this.bubble.update();
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
    this.editor.focus();
    document.execCommand('styleWithCSS', false, useCSS);
    document.execCommand(cmd, false, value);
    document.execCommand('styleWithCSS', false, false);
    this.update();
  }

}
