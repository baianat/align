import { select, userOS, stringToDOM } from './partial/utils';
import cmdsSchema from './partial/cmdsSchema';
import icons from './partial/icons';
import Selection from './partial/selection';
import Section from './core-elements/section';
import EventBus from './partial/events';
import Styler from './core-elements/styler';
import Inserter from './core-elements/inserter';
import Sidebar from './core-elements/sidebar';

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
      acc += section.content;
      return acc;
    }, '');
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

    if (this.settings.toolbar) {
      this.toolbar = new Styler(this, {
        ...this.settings.toolbar,
        mode: 'toolbar'
      });
    }
    if (this.settings.bubble) {
      this.bubble = new Styler(this, {
        ...this.settings.bubble,
        mode: 'bubble',
        tooltip: false
      });
    }
    this.inserter = new Inserter(this, {});
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

    this.startContent.forEach((content) => new Section(this, content));
    const addSection = document.createElement('button');
    addSection.classList.add('align-sectionAdd', 'is-main');
    this.wrapper.appendChild(addSection);
    addSection.addEventListener('click', () => {
      const newSection = new Section(this);
      setTimeout(() => {
        newSection.active();
        Selection.selectElement(newSection.contentDiv.querySelector('p'));
      }, 1);
    });
  }

  /**
   * Add all events listeners
   */
  _initEvents () {
    this.editor.addEventListener('mouseup', this.update.bind(this), true);
    this.editor.addEventListener('input', () => {
      this.$bus.emit('changed');
    });
    window.addEventListener('keyup', this.update.bind(this), true);
  }

  clearContent () {
    this.sections = [];
    this.editor.innerHTML = '';
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
      this.inserter.update();
    }, 1);
  }

  applyFont (schema, cmd) {
    this.el.style.fontFamily = cmd.fontName[0];
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
    this.inserter.hide();
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
    elClass
      .add(this)
      .then((newElement) => {
        if (!newElement.el) return;
        let el = Selection.range.startContainer;
        el = el.closest('p');
        if (!el || !el.tagName) {
          return;
        }
        if (el.tagName === 'P') {
          el.parentNode.replaceChild(newElement.el, el);
        }
        if (el.tagName !== 'P') {
          el.appendChild(newElement.el);
        }
        this.inserter.hide();
        this.update();
      });
  }

  static defaults = {
    toolbar: null,
    bubble: null,
    section: null,
    shortcuts: false,
    postTitle: false
  }
}
