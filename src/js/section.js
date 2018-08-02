import { stringToDOM, swapArrayItems } from './partial/util'
import icons from './partial/icons';
import Figure from './components/figure';
import Table from './components/table';
import Link from './components/link';
import Selection from './selection';

export default class Section {
  constructor (align, content, {
    position,
    type = 'text'
  } = {}) {
    if (content && content.nodeName === 'BR') {
      return;
    }
    this.id = Section.id++
    this.$align = align;
    this.elements = [];
    this.settings = {
      type: type,
      isHTMLView: false,
    }
    Section.activeSection = this;
    if (typeof content === 'string') {
      content = stringToDOM(content);
    }
    this._initWrapper(content);
    this._initContent(content);
    if (this.settings.type === 'text') {
      this._initControllers();
      this._initBackground();
      this.el.addEventListener('click', () => {
        this.active();
      });
    }

    if (typeof position === 'number') {
      const before = this.$align.sections[position];
      this.$align.editor.insertBefore(this.el, before.el);
      this.$align.sections.splice(position, 0, this);
      return;
    }
    this.$align.editor.appendChild(this.el);
    this.$align.sections.push(this);
    this.createLayout();
  }

  get content () {
    let output;
    if (this.settings.type === 'text') {
      output = this.el.cloneNode(true);
      const controllers = output.querySelector('.align-sectionControllers');
      const contentDiv = output.querySelector('.align-content');
      const figures = Array.from(contentDiv.querySelectorAll('figure'));
      if (this.settings.isHTMLView) {
        contentDiv.innerHTML = contentDiv.innerText;
      }
      figures.forEach(fig => Figure.render(fig));
      output.classList.remove('is-active');
      output.insertAdjacentHTML('beforeend', contentDiv.innerHTML);
      contentDiv.remove();
      controllers.remove();
    }
    if (this.settings.type === 'title') {
      return this.title.innerText;
    }
    return output.outerHTML;
  }

  _initWrapper (content) {
    this.el = document.createElement('div');
    this.el.classList.add('align-section');
    let classes = content ? content.classList : '';
    if (!classes) {
      return;
    }
    classes = Array.from(classes);
    classes.splice(classes.indexOf('align-section'), 1);
    this.classes = {
      modifiers: [],
      custom: []
    }
    classes.forEach(cls => {
      if (cls.startsWith('is-')) {
        this.classes.modifiers.push(cls);
        return;
      }
      if (cls.startsWith('has-')) {
        return;
      }
      this.classes.custom.push(cls);
    });
    const _self = this;
    this.el.classList.add(...this.classes.modifiers, ...this.classes.custom);
    this.classes = new Proxy(this.classes, {
      get (classes, type) {
        return classes[type] || '';
      },
      set (classes, type, value) {
        _self.el.classList.remove(...classes[type]);
        console.log(classes[type])
        classes[type] = value;
        console.log(classes[type])
        _self.el.classList.add(...classes[type]);
        return true;
      }
    });
    this.el.setAttribute('style', content.getAttribute('style'));
    this.bgColor = content.style.backgroundColor;
  }

  _initContent (content) {
    switch (this.settings.type) {
    case 'text':
      if (!this.contentDiv) {
        this.contentDiv = document.createElement('div');
        this.contentDiv.classList.add('align-content');
        this.contentDiv.contentEditable = true;
      }
      if (this.settings.isHTMLView) {
        content = content.innerText;
      }
      if (!this.settings.isHTMLView) {
        content = content ? content.innerHTML : '<p></p>';
      }
      this.contentDiv.innerHTML = content;
      this.el.appendChild(this.contentDiv);
      this._initElements();
      break;

    case 'title':
      this.title = this.el.querySelector('.align-title') || document.createElement('h1');
      this.title.classList.add('align-title');
      this.title.contentEditable = true;
      this.title.innerText = content;
      this.el.appendChild(this.title);
      this.title.addEventListener('blur', () => {
        this.title.innerHTML = this.title.innerText
      })
      break;

    default:
      break;
    }
  }

  _initElements () {
    const figures = Array.from(this.contentDiv.querySelectorAll('figure'));
    const tables = Array.from(this.contentDiv.querySelectorAll('table'));
    const links = Array.from(this.contentDiv.querySelectorAll('a'));

    figures.forEach(figure => new Figure(this.$align, figure));
    tables.forEach(table => new Table(this.$align, table));
    links.forEach(link => new Link(this.$align, link));
  }

  _initControllers () {
    this.controllers = document.createElement('div');
    this.addButton = document.createElement('button');
    this.upButton = document.createElement('button');
    this.downButton = document.createElement('button');
    this.settingsButton = document.createElement('button');
    this.settingsButton.classList.add('align-sectionSettings');
    this.controllers.classList.add('align-sectionControllers');
    this.addButton.classList.add('align-sectionAdd');
    this.upButton.classList.add('align-sectionUp');
    this.downButton.classList.add('align-sectionDown');
    
    this.upButton.insertAdjacentHTML('afterbegin', icons.caretUp);
    this.downButton.insertAdjacentHTML('afterbegin', icons.caretDown);
    this.settingsButton.insertAdjacentHTML('afterbegin', icons.dotsVertical);

    this.addButton.addEventListener('click', () => {
      const newSection = new Section(this.$align, '', { position: this.getIndex() })
      setTimeout(() => {
        newSection.active();
        Selection.selectElement(newSection.contentDiv.querySelector('p'));
      }, 1);
    });
    this.upButton.addEventListener('click', this.moveUp.bind(this));
    this.downButton.addEventListener('click', this.moveDown.bind(this));
    this.settingsButton.addEventListener('click', () => {
      this.$align.toggleSidebar();
    });
    [this.addButton, this.upButton, this.downButton, this.settingsButton].forEach(btn => {
      this.controllers.appendChild(btn);
    });
    this.el.appendChild(this.controllers);
  }

  _initBackground () {
    this.bgImage = this.bgImage || this.contentDiv.querySelector('.align-bgImage');
    this.bgVideo = this.bgVideo || this.contentDiv.querySelector('.align-bgVideo');
    this.bgCol = this.bgVideo || this.contentDiv.querySelector('.align-bgVideo');
    if (this.bgImage) {
      this.el.classList.add('has-bgImage');
      this.el.insertAdjacentElement('afterBegin', this.bgImage);
    }
    if (this.bgVideo) {
      this.el.classList.add('has-bgVideo');
      this.el.insertAdjacentElement('afterBegin', this.bgVideo);
    }
    if (this.bgColor) {
      this.el.classList.add('has-bgColor');
      this.el.style.backgroundColor = this.bgColor;
    }
  }

  getIndex () {
    return this.$align.sections.findIndex(el => el === this);
  }

  createLayout () {
    const el = this.el;
    const styleObj = {};
    const handler = {
      get (style, name) {
        this.update();
        return style[name] || '';
      },
      set (style, name, val, receiver) {
        console.log(receiver)
        if (val) {
          style[name] = val;
          el.style[name] =  val;
          return true
        }
        delete style[name];
        el.style[name] =  '';
        return true
      },
      update () {
        const sectionStyle = window.getComputedStyle(el);
        [
          'margin-top',
          'margin-right',
          'margin-bottom',
          'margin-left',
          'padding-top',
          'padding-right',
          'padding-bottom',
          'padding-left'
        ].forEach(styl => {
          const value = el.style[styl] ||sectionStyle[styl];
          if (value) {
            styleObj[styl] = value;
          }
        });
      }
    }
    this.style = new Proxy(styleObj, handler);
  }


  toggleHTML () {
    if (!this.settings.isHTMLView) {
      this.settings.isHTMLView = true;
      const content = document.createTextNode(this.contentDiv.innerHTML);
      const pre = document.createElement('pre');

      this.contentDiv.innerHTML = '';
      pre.dataset.alignHtml = true;
      pre.appendChild(content);
      this.contentDiv.appendChild(pre);
      this.$align.highlight();
      return;
    }
    this._initContent(this.contentDiv);
    this.settings.isHTMLView = false;
  }


  backgroundColor (color) {
    this.el.style.backgroundColor = color;
    // color value maybe in hex, hsl or rgb model
    // so I have to check for background inline style value
    if (this.el.style.backgroundColor !== 'rgb(255, 255, 255)') {
      this.bgColor = color;
      this.el.classList.add('has-bgColor');
      return;
    }
    this.bgColor = null;
    this.el.style.backgroundColor = '';
    this.el.classList.remove('has-bgColor');

    // emit events
    const index = this.getIndex();
    this.$align.$bus.emit('sectionChanged', { from: index, to: index });
    this.$align.$bus.emit('changed');
  }

  removeBackground () {
    if (this.bgImage) {
      this.bgImage.remove();
      this.bgImage = null;
      this.el.classList.remove('has-bgImage');
    }
    if (this.bgVideo) {
      this.bgVideo.remove();
      this.bgVideo = null;
      this.el.classList.remove('has-bgVideo');
    }

    // emit events
    const index = this.getIndex();
    this.$align.$bus.emit('sectionChanged', { from: index, to: index });
    this.$align.$bus.emit('changed');
  }
  
  backgroundImage (event) {
    const input = event.target;
    const file = input.files[0];
    if (!file) return;
    if (!this.bgImage) {
      this.bgImage = document.createElement('div');
      this.bgImage.classList.add('align-bgImage');
      this.el.insertAdjacentElement('afterBegin', this.bgImage);
    }
    const update = (src) => {
      this.bgImage.style.backgroundImage = `url(${src})`;
    };
    this.bgImage.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
    this.el.classList.add('has-bgImage');
    input.value = null;
    this.$align.update();

    // emit events
    const index = this.getIndex();
    this.$align.$bus.emit('imageAdded', { file, update });
    this.$align.$bus.emit('sectionChanged', { from: index, to: index });
    this.$align.$bus.emit('changed');
  }

  backgroundVideo (event) {
    const input = event.target;
    const file = input.files[0];
    if (!file) return;
    const url = window.URL.createObjectURL(event.target.files[0]);

    if (!this.bgVideo) {
      this.bgVideo = document.createElement('div');
      this.bgVideo.classList.add('align-bgVideo');
      this.bgVideo.insertAdjacentHTML('afterbegin', `<video autoplay muted loop></video>`);
      this.el.insertAdjacentElement('afterbegin', this.bgVideo);
    }
    const source = 
      this.bgVideo.querySelector('source') ||
      document.createElement('source');
    const video = this.bgVideo.querySelector('video');
    video.appendChild(source);
    source.src = url;
    video.load();
    video.play();
    this.el.classList.add('has-bgVideo');
    const update = (src) => {
      source.src = src;
    };
    input.value = null;
    this.$align.update();

    // emit events
    const index = this.getIndex();
    this.$align.$bus.emit('videoAdded', { file, update });
    this.$align.$bus.emit('sectionChanged', { from: index, to: index });
    this.$align.$bus.emit('changed');
  }

  moveUp () {
    const oldIndx = this.getIndex();
    if (
      !this.$align.sections[oldIndx - 1] ||
      this.$align.sections[oldIndx - 1].type === 'title'
    ) return;

    this.$align.editor.insertBefore(this.el, this.$align.sections[oldIndx - 1].el);
    swapArrayItems(this.$align.sections, oldIndx, oldIndx - 1);

    // emit events
    this.$align.$bus.emit('sectionChanged', { 
      from: oldIndx, to: this.getIndex()
    });
    this.$align.$bus.emit('changed');
  }

  moveDown () {
    const oldIndx = this.getIndex();
    if (!this.$align.sections[oldIndx + 1]) return;
    this.$align.editor.insertBefore(this.el, this.$align.sections[oldIndx + 1].el.nextSibling);
    swapArrayItems(this.$align.sections, oldIndx, oldIndx + 1);

    // emit events
    this.$align.$bus.emit('sectionChanged', { 
      from: oldIndx, to: this.getIndex()
    });
    this.$align.$bus.emit('changed');
  }

  active () {
    if (Section.activeSection === this) {
      this.$align.$sectionToolbar.update(this);
      return;
    }
    if (Section.activeSection) {
      Section.activeSection.inactive();
    }
    Section.activeSection = this;
    this.el.classList.add('is-active');
    this.$align.$sectionToolbar.update(this);
    this.$align.sidebar.update();
    this.$align.update();
    this.contentDiv.focus();
  }

  inactive () {
    this.el.classList.remove('is-active');
  }

  remove () {
    const oldIndx = this.getIndex();
    this.inactive();
    this.el.remove();
    this.$align.sections.splice(oldIndx, 1);
    this.$align.$sectionToolbar.hide();
    this.$align.update();

    // emit events
    this.$align.$bus.emit('sectionChanged', {
      from: oldIndx, to: null
    });
    this.$align.$bus.emit('changed');
  }

  duplicate () {
    const content = this.content;
    const newSection = new Section(this.$align, content, { position: this.getIndex() });

    // emit events
    this.$align.$bus.emit('sectionChanged', {
      from: null, to: this.getIndex()
    });
    this.$align.$bus.emit('changed');
  }

  static id = 0;
  static activeSection = null;
  static defaults = {
    mode: 'bubble',
    hideWhenClickOut: true,
    commands: [
      '_sectionColor',
      '_sectionImage',
      '_sectionVideo',
      '_sectionRemoveBg',
      '_sectionToggleHTML',
      '_sectionDuplicate',
      { 
        element: 'classes',
        values: ['normal', 'full'],
        icons: ['sectionNormal', 'sectionFull']
      },
      'remove'
    ],
    tooltip: true,
    position: 'left-top'
  }
  
}
