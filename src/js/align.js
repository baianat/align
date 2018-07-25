import { select, userOS, stringToDOM } from './partial/util';
import cmdsSchema from './partial/cmdsSchema';
import icons from './partial/icons';
import Figure from './elements/figure';
import Table from './elements/table';
import Selection from './selection';
import Section from './section';
import EventBus from './events';
import Styler from './styler';
import Sidebar from './sidebar';

export default class Align {
  constructor (selector, settings) {
    this.el = select(selector);
    this.settings = {
      ...Align.defaults,
      ...settings
    };
    this._init();
  }

  /**
   * Get editor's content
   */
  get content () {
    return this.sections.reduce((acc, section) => {
      if (section.settings.type !== 'text') {
        return acc;
      }
      acc += section.content;
      return acc;
    }, '');
  }

  get title () {
    if (this.postTitle) {
      const title = this.sections.find((sec) => sec.type === 'title');
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
    document.execCommand('defaultParagraphSeparator', false, 'p');
    this.cmdKey = userOS() === 'Mac' ? 'metaKey' : 'ctrlKey';
    this.cmdKeyPressed = false;

    this._initEditor();
    this._initStylers();
    this._initSections();
    this._initEvents();
    this.sidebar = new Sidebar(this);
    this.el.appendChild(this.sidebar.el);
  }

  /**
   * create all stylers instances
   */
  _initStylers () {
    this.$sectionToolbar = new Styler(this, {
      ...Section.defaults,
      ...this.settings.section
    });
    this.$figureToolbar = new Styler(this, {
      ...Figure.defaults,
      ...this.settings.figure
    });
    this.$tableToolbar = new Styler(this, {
      ...Table.defaults,
      ...this.settings.table
    });
    [this.$sectionToolbar, this.$figureToolbar, this.$tableToolbar].forEach(obj => {
      this.wrapper.appendChild(obj.el);
    })


    if (this.settings.toolbar) {
      this.toolbar = new Styler(this, {
        ...this.settings.toolbar,
        mode: 'toolbar'
      });
      this.el.insertAdjacentElement('afterbegin', this.toolbar.el);
    }
    if (this.settings.bubble) {
      this.bubble = new Styler(this, {
        ...this.settings.bubble,
        mode: 'bubble',
        tooltip: false
      });
      this.wrapper.appendChild(this.bubble.el);
    }
    if (this.settings.creator) {
      this.creator = new Styler(this, {
        ...this.settings.creator,
        mode: 'creator',
        position: 'middle-left'
      });
      this.wrapper.appendChild(this.creator.el);
    }
  }
  /**
   * Create the editor
   */
  _initEditor () {
    this.wrapper = document.createElement('div');
    this.editor = document.createElement('div');
    this.wrapper.classList.add('align-wrapper');
    this.editor.classList.add('align-editor');

    this.wrapper.appendChild(this.editor);
    this.el.appendChild(this.wrapper);
    this.editor.focus();
    Selection.update();
  }

  _initSections () {
    this.sections = [];

    if (this.settings.postTitle !== false) {
      this.postTitle = new Section(this, this.settings.postTitle, {
        type: 'title'
      });
    }
    this.startContent.forEach((content) => new Section(this, content));
    const addSection = document.createElement('button');
    addSection.classList.add('align-sectionAdd', 'is-main');
    this.wrapper.appendChild(addSection);
    addSection.addEventListener('click', () => new Section(this));
  }

  /**
   * Add all events listeners
   */
  _initEvents () {
    this.editor.addEventListener('focus', this.highlight.bind(this));
    this.editor.addEventListener('mouseup', this.update.bind(this), true);
    this.editor.addEventListener('input', () => {
      console.log('input')
      this.$bus.emit('changed');
    });
    window.addEventListener('keyup', this.update.bind(this), true);
  }

  clearContent () {
    this.sections = [];
    this.editor.innerHTML = '';
  }

  /**
   * Hight light code text
   */
  /* eslint-disable */
  highlight () {
    if (typeof hljs === 'undefined') {
      return;
    }
    const code = Array.from(this.editor.querySelectorAll('pre'));
    code.forEach((block) => {
      hljs.highlightBlock(block);
    });
  }
  /* eslint-enable */

  /**
   * Toggle on/off HTML
   */
  toggleFullScreen () {
    this.el.classList.toggle('is-fullscreen');
  }

  toggleSidebar () {
    this.el.classList.toggle('is-sidebar-active');
  }

  update () {
    Selection.update();
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
    }, 1);
  }

  applyFont (schema, cmd) {
    this.el.style.fontFamily = cmd.fontName[0];
  }

  execute (cmd, value, useCSS = false) {
    this.editor.focus();
    document.execCommand('styleWithCSS', false, useCSS);
    document.execCommand(cmd, false, value);
    document.execCommand('styleWithCSS', false, false);
    this.update();
  }

  createFigure (event) {
    const input = event.target;
    const file = input.files[0];
    if (!file || !Selection.range) return;
    const figure = new Figure(this, file);
    input.value = null;
    if (figure.el) {
      const el = Selection.range.startContainer;
      el.parentNode.insertBefore(figure.el, el);
    }
    this.update();
  }

  addHTML (args) {
    let elHTML = '';
    if (Array.isArray(args)) {
      elHTML = args[0];
    }
    if (typeof args === 'string') {
      elHTML = args;
    }
    const domElement = stringToDOM(elHTML);
    if (!domElement) return;
    const el = Selection.range.startContainer;
    el.parentNode.insertBefore(domElement, el);
    this.update();
  }

  addElement (args) {
    let elClass = '';
    if (Array.isArray(args)) {
      elClass = args[0];
    }
    if (typeof args === 'function') {
      elClass = args;
    }
    elClass.add(this).then((newElement) => {
      console.log(newElement)
      if (!newElement.el) return;
      const el = Selection.range.startContainer;
      el.parentNode.insertBefore(newElement.el, el);
      Section.activeSection.elements.push(newElement);
      this.update();
    });
  }

  static defaults = {
    toolbar: null,
    bubble: null,
    creator: null,
    section: null,
    shortcuts: false,
    postTitle: false
  }
}
