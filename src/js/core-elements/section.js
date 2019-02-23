import { stringToDOM, swapArrayItems } from '../partial/utils'
import {
  Figure,
  Grid,
  Line,
  Link,
  Separator,
  Table,
  Button,
  Script,
} from '../components/_index';
import Selection from '../partial/selection';
import Dep from '../partial/dep';

export default class Section {
  constructor (align, content, { position } = {}) {
    this.id = Section.id++
    this.$align = align;
    this.fields = [
      'backgroundImage',
      'backgroundVideo',
      'backgroundColor',
      'customClass',
      'layout'
    ];
    this.props = {
      customClass: [],
      modifiers: [],
      backgroundColor: '',
      backgroundVideo: '',
      backgroundImage: '',
      parallax: false,
      isHTMLView: false,
      layout: {}
    }
    if (typeof content === 'string') {
      content = stringToDOM(content);
    }
  
    this._initWrapper(content);
    this._initProps();
    this._initBackground(content);
    this._initContent(content);
    this._initControllers();
    this._initWatchers(); 
    this._initContent(content);
    this.el.addEventListener('click', (e) => this.active(e));

    if (typeof position === 'number') {
      const before = this.$align.sections[position];
      this.$align.editor.insertBefore(this.el, before.el);
      this.$align.sections.splice(position, 0, this);
      return;
    }
    this.$align.editor.appendChild(this.el);
    this.$align.sections.push(this);
  }

  get content () {
    const output = this.el.cloneNode(true);
    const controllers = output.querySelector('.align-sectionControllers');
    const contentDiv = output.querySelector('.align-content');
    const figures = Array.from(contentDiv.querySelectorAll('figure'));
    const scripts = Array.from(contentDiv.querySelectorAll('.align-codeEditor'));
    if (this.props.isHTMLView) {
      contentDiv.innerHTML = contentDiv.innerText;
    }
    figures.forEach(fig => Figure.render(fig));
    scripts.forEach(script => Script.render(script));
    output.classList.remove('is-active');
    output.insertAdjacentHTML('beforeend', contentDiv.innerHTML);
    contentDiv.remove();
    controllers.remove();

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
    classes.forEach(cls => {
      if (cls.startsWith('is-')) {
        this.props.modifiers.push(cls);
        return;
      }
      if (cls.startsWith('has-')) {
        return;
      }
      this.props.customClass.push(cls);
    });
    this.el.classList.add(...this.props.modifiers);
    this.el.setAttribute('style', content.getAttribute('style'));
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
      const value = this.el.style[styl];
      if (value) {
        this.props.layout[styl] = value;
        return;
      }
    });
  }

  _initContent (content) {
    if (!this.contentDiv) {
      this.contentDiv = document.createElement('div');
      this.contentDiv.classList.add('align-content');
      this.contentDiv.contentEditable = true;
      this.contentDiv.dataset.gramm = false;
    }
    if (this.props.isHTMLView) {
      content = content.innerText;
    }
    if (!this.props.isHTMLView) {
      content = content ? content.innerHTML : '<p></p>';
    }
    this.contentDiv.innerHTML = content;
    this.el.appendChild(this.contentDiv);
    this._initComponents();
  }

  _initComponents () {
    const separators = Array.from(this.contentDiv.querySelectorAll('.align-separator'));
    const buttons = Array.from(this.contentDiv.querySelectorAll('.align-button'));
    const grids = Array.from(this.contentDiv.querySelectorAll('.align-grid'));
    const lines = Array.from(this.contentDiv.querySelectorAll('.align-line'));
    const scripts = Array.from(this.contentDiv.querySelectorAll('.align-codeEditor'));
    const figures = Array.from(this.contentDiv.querySelectorAll('figure'));
    const tables = Array.from(this.contentDiv.querySelectorAll('table'));
    const links = Array.from(this.contentDiv.querySelectorAll('a'));

    separators.forEach(separator => new Separator(this.$align, separator));
    buttons.forEach(button => new Button(this.$align, button));
    grids.forEach(grid => new Grid(this.$align, grid));
    lines.forEach(line => new Line(this.$align, line));
    scripts.forEach(script => new Script(this.$align, script));
    figures.forEach(figure => new Figure(this.$align, figure));
    tables.forEach(table => new Table(this.$align, table));
    links.forEach(link => new Link(this.$align, link));
  }

  _initControllers () {
    this.controllers = document.createElement('div');
    this.addButton = document.createElement('button');
    this.controllers.classList.add('align-sectionControllers');
    this.addButton.classList.add('align-sectionAdd');

    this.addButton.addEventListener('click', () => {
      const newSection = new Section(this.$align, ' ', { position: this.getIndex() });
      setTimeout(() => {
        newSection.active();
        Selection.selectElement(newSection.contentDiv.querySelector('p'));
      }, 1);
    });
    this.controllers.appendChild(this.addButton);
    this.el.appendChild(this.controllers);
  }

  _initBackground (content) {
    if (!content) {
      return;
    }
    const bgImage = content.querySelector('.align-bgImage');
    const bgVideo = content.querySelector('.align-bgVideo');
    const bgColor = content.querySelector('.align-bgColor');

    if (bgImage) {
      this.props.backgroundImage = bgImage.style.backgroundImage;
      this.props.parallax = bgImage.classList.contains('is-parallax');
      bgImage.remove();
    }
    if (bgVideo) {
      this.props.backgroundVideo = bgVideo.querySelector('source').src;
      bgVideo.remove();
    }
    if (bgColor) {
      this.props.backgroundColor = bgColor.style.backgroundColor;
      bgColor.remove();
    }
  }

  _initProps () {
    Object.keys(this.props).forEach(key => {
      let internalValue = this.props[key]
      const dep = new Dep();
      
      Object.defineProperty(this.props, key, {
        get() {
          dep.depend();
          return internalValue;
        },
        set(newVal) {
          const oldVal = internalValue;
          internalValue = newVal;
          dep.notify(oldVal);
        }
      });
    });
  }

  _initWatchers () {
    Dep.watcher((oldVal) => {
      if (oldVal && oldVal.length > 0) {
        this.el.classList.remove(...oldVal);
      }
      if (this.props.customClass.length === 0) {
        return;
      }
      this.el.classList.add(...this.props.customClass);
    
      // emit events
      const index = this.getIndex();
      this.$align.$bus.emit('changed');
      this.$align.$bus.emit('sectionChanged', { 
        from: index,
        to: index,
        props: this.props
      });
    });
    Dep.watcher(() => {
      this.backgroundColor(this.props.backgroundColor);
    });
    Dep.watcher(() => {
      this.backgroundImage(this.props.backgroundImage);
    });
    Dep.watcher(() => {
      this.backgroundVideo(this.props.backgroundVideo);
    });
    Dep.watcher(() => {
      this.updateLayout(this.props.layout);
    });
    Dep.watcher(() => {
      const parallax = this.props.parallax;
      if (!this.bgImage) {
        return;
      }
      this.bgImage.classList.toggle('is-parallax', parallax);
    });
  }

  getIndex () {
    return this.$align.sections.findIndex(el => el === this);
  }

  updateLayout () {
    Object.keys(this.props.layout).forEach(styl => {
      const value = this.props.layout[styl];
      if (value) {
        this.props.layout[styl] = value;
        this.el.style[styl] = value;
        return;
      }
      delete this.props.layout[styl];
      this.el.style[styl] = '';
    });

    
    // emit events
    const index = this.getIndex();
    this.$align.$bus.emit('changed');
    this.$align.$bus.emit('sectionChanged', { 
      from: index,
      to: index,
      props: this.props
    });
  }


  toggleHTML () {
    if (!this.props.isHTMLView) {
      this.props.isHTMLView = true;
      const content = document.createTextNode(this.contentDiv.innerHTML);
      const pre = document.createElement('pre');

      this.contentDiv.innerHTML = '';
      pre.dataset.alignHtml = true;
      pre.appendChild(content);
      this.contentDiv.appendChild(pre);
      return;
    }
    this._initContent(this.contentDiv);
    this.props.isHTMLView = false;
  }


  backgroundColor (color) {
    if (!color || color === 'rgb(255,255,255)') {
      if (this.bgColor) {
        this.bgColor.remove();
        this.bgColor = null;
        this.el.classList.remove('has-bgColor');
      }
      return;
    }
    if (!this.bgColor) {
      this.bgColor = document.createElement('div');
      this.bgColor.classList.add('align-bgColor');
      this.el.insertBefore(this.bgColor, this.contentDiv);
    }

    this.bgColor.style.backgroundColor = color;
    this.el.classList.add('has-bgColor');
    this.$align.update();

    // emit events
    const index = this.getIndex();
    this.$align.$bus.emit('changed');
    this.$align.$bus.emit('sectionChanged', { 
      from: index,
      to: index,
      props: this.props
    });
  }

  backgroundImage (file) {
    if (!file) {
      if (this.bgImage) {
        this.bgImage.remove();
        this.bgImage = null;
        this.el.classList.remove('has-bgImage');
      }
      return;
    };
    let url = '';
    if (file instanceof File) {
      url = URL.createObjectURL(file);
    } else { 
      url = file.match(/url\("(.+)"\)/)[1] || file;
    }

    if (!this.bgImage) {
      this.bgImage = document.createElement('div');
      this.bgImage.classList.add('align-bgImage');
      this.el.insertAdjacentElement('afterBegin', this.bgImage);
    }
    const update = (src) => {
      this.bgImage.style.backgroundImage = `url(${src})`;
    };
    this.bgImage.style.backgroundImage = `url(${url})`;
    this.el.classList.add('has-bgImage');
    this.$align.update();

    // emit events
    const index = this.getIndex();
    this.$align.$bus.emit('imageAdded', { file, update });
    this.$align.$bus.emit('changed');
    this.$align.$bus.emit('sectionChanged', { 
      from: index,
      to: index,
      props: this.props
    });
  }

  backgroundVideo (file) {
    if (!file) {
      if (this.bgVideo) {
        this.bgVideo.remove();
        this.bgVideo = null;
        this.el.classList.remove('has-bgVideo');
      }
      return;
    }
    let url = '';
    if (file instanceof File) {
      url = URL.createObjectURL(file);
    } else { 
      url = file;
    }
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
    this.$align.update();

    // emit events
    const index = this.getIndex();
    this.$align.$bus.emit('videoAdded', { file, update });
    this.$align.$bus.emit('changed');
    this.$align.$bus.emit('sectionChanged', { 
      from: index,
      to: index,
      props: this.props
    });
  }

  moveUp () {
    const oldIndx = this.getIndex();
    if (
      !this.$align.sections[oldIndx - 1]
    ) return;

    this.$align.editor.insertBefore(this.el, this.$align.sections[oldIndx - 1].el);
    swapArrayItems(this.$align.sections, oldIndx, oldIndx - 1);

    // emit events
    this.$align.$bus.emit('changed');
    this.$align.$bus.emit('sectionChanged', { 
      from: oldIndx,
      to: this.getIndex(),
      props: this.props
    });
  }

  moveDown () {
    const oldIndx = this.getIndex();
    if (!this.$align.sections[oldIndx + 1]) return;
    this.$align.editor.insertBefore(this.el, this.$align.sections[oldIndx + 1].el.nextSibling);
    swapArrayItems(this.$align.sections, oldIndx, oldIndx + 1);

    // emit events
    this.$align.$bus.emit('changed');
    this.$align.$bus.emit('sectionChanged', { 
      from: oldIndx,
      to: this.getIndex(),
      props: this.props
    });
  }

  active () {
    if (Section.activeSection !== this) {
      this.contentDiv.focus();
    }
    if (Section.activeSection) {
      Section.activeSection.inactive();
    }
    Section.activeSection = this;
    this.el.classList.add('is-active');
    this.$align.$sectionToolbar.update(this);
    this.$align.sidebar.update();
    this.$align.update();
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
    this.$align.$bus.emit('changed');
    this.$align.$bus.emit('sectionChanged', {
      from: oldIndx,
      to: null
    });
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
      '_sectionUp',
      '_sectionDown',
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
