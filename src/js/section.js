import { stringToDOM, swapArrayItems } from './partial/util'
import Styler from './styler';

let ID = 0;
let ALL_SECTIONS = [];

export default class Section {
  constructor (content, position, type = 'text') {
    if (content && content.nodeName === 'BR') {
      return;
    }
    this.id = ID++;
    this.type = type;
    this.generateEl(content);
    if (type === 'text') {
      this.el.addEventListener('click', () => {
        Section.$align.activeSection = this.el;
        Section.$optionsBar.show(this);
      });
    }
    if (typeof position === 'object') {
      Section.$align.editor.insertBefore(this.el, position)
      return;
    }
    Section.$align.editor.appendChild(this.el);
    ALL_SECTIONS.push(this);
  }

  static config (align, settings) {
    const config = Object.assign({
      mode: 'bubble',
      hideWhenClickOut: true,
      commands: ['_sectionUp', '_sectionDown',
        '_sectionColor', '_sectionImage', '_sectionVideo', '_sectionToggleHTML',
        { '_sectionClasses': ['normal', 'full'] },
        '_remove'
      ],
      tooltip: true,
      theme: 'dark'
    }, settings);
    this.$align = align;
    this.$optionsBar = new Styler(align, config);
  }

  static get allSections () {
    return ALL_SECTIONS;
  }

  get content () {
    let output;
    if (this.type === 'text') {
      output = this.el.cloneNode(true);
      const addButton = output.querySelector('.align-newSection');
      const contentDiv = output.querySelector('.align-content');
      output.insertAdjacentHTML('beforeend', contentDiv.innerHTML);
      contentDiv.remove();
      addButton.remove();
    }
    if (this.type === 'title') {
      return this.title.innerText;
    }
    return output.outerHTML;
  }

  generateEl (content) {
    this.el = (content && content.nodeName === 'DIV') ? content : document.createElement('div');
    this.el.classList.add('align-section');
    
    switch (this.type) {
      case 'text':
        this.contentDiv = this.el.querySelector('.align-content') || document.createElement('div');
        this.contentDiv.classList.add('align-content');
        this.contentDiv.contentEditable = true;
        content = content ? this.contentDiv.innerHTML || this.el.innerHTML || content.outerHTML : '<p></p>';

        this.el.innerHTML = '';
        this.el.appendChild(this.contentDiv);
        this.contentDiv.innerHTML = content;
        this.generateAddSectionButton();
        this.el.insertAdjacentElement('afterBegin', this.addSectionButton);
        break;
    
      case 'title':
        this.titleDiv = this.el.querySelector('.align-title') || document.createElement('div');
        this.titleDiv.classList.add('align-title');
        this.titleDiv.contentEditable = true;
        this.title = document.createElement('h1');
        this.title.innerHTML = content;
        this.titleDiv.appendChild(this.title);
        this.el.appendChild(this.titleDiv);
        break;

      default:
        break;
    }
  }

  generateAddSectionButton () {
    this.addSectionButton = document.createElement('button');
    this.addSectionButton.classList.add('align-newSection');
    this.addSectionButton.addEventListener('click', () => new Section('', this.el));
    this.addSectionButton.contentEditable = false;
    return this.addSectionButton
  }

  getIndex () {
    return ALL_SECTIONS.findIndex(el => el === this);
  }

  toggleHTML () {
    if (this.contentDiv.firstElementChild.tagName !== 'PRE') {
      const content = document.createTextNode(this.contentDiv.innerHTML);
      const pre = document.createElement('pre');

      this.contentDiv.innerHTML = '';
      pre.id = 'content';
      pre.style.whiteSpace = 'pre-wrap';
      pre.appendChild(content);
      this.contentDiv.appendChild(pre);
      Section.$align.highlight();
      return;
    }
    this.contentDiv.innerHTML = this.contentDiv.innerText;
    this.contentDiv.contentEditable = true;
    this.contentDiv.focus();
  }

  backgroundColor (cmdSchema, color) {
    this.el.style.backgroundColor = color;
  }

  backgroundImage (cmdSchema, event) {
    const input = event.target;
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader(); // eslint-disable-line
    const bg = this.el.querySelector('.align-bgImage') ||
              document.createElement('div');
    if (!this.el.querySelector('.align-bgImage')) {
      bg.classList.add('align-bgImage');
      this.el.insertAdjacentElement('afterBegin', bg);
    }
    reader.addEventListener('load', () => {
      this.el.classList.add('is-bgImage');
      bg.style.backgroundImage = `url(${reader.result})`;
      const update = (src) => {
        bg.style.backgroundImage = `url(${src})`;
      };
      Section.$align.update();
      Section.$align.$bus.emit('imageAdded', { file, update });
    });
    reader.readAsDataURL(file);
    input.value = null;
  }

  backgroundVideo (cmdSchema, event) {
    const input = event.target;
    const file = input.files[0];
    if (!file) return;
    let video = this.el.querySelector('.align-bgVideo');
    let source = null;
    let blob = null;

    const url = URL.createObjectURL(event.target.files[0]);
    if (!video) {
      const video = stringToDOM(`<video autoplay muted loop class="align-bgVideo"></video>`);
      source = document.createElement('source');
      video.appendChild(source);
      this.el.insertAdjacentElement('afterBegin', video);
    }
    if (video) {
      source = video.querySelector('source');
    }
    this.el.classList.add('is-bgVideo');
    source.src = url;
    const update = (src) => {
      source.src = src;
    };
    Section.$align.update();
    Section.$align.$bus.emit('videoAdded', { file, update });
    input.value = null;
  }

  moveUp () {
    const index = this.getIndex();
    if (
      !this.el.previousSibling ||
      ALL_SECTIONS[index - 1].type === 'title'
    ) return;

    Section.$align.editor.insertBefore(this.el, ALL_SECTIONS[index - 1].el);
    swapArrayItems(ALL_SECTIONS, index, index - 1);
  }

  moveDown () {
    const index = this.getIndex();
    if (!this.el.nextSibling) return;
    Section.$align.editor.insertBefore(this.el, ALL_SECTIONS[index + 1].el.nextSibling);
    swapArrayItems(ALL_SECTIONS, index, index + 1);
  }
  
  active () {
    Section.$optionsBar.show(this);
    this.el.focus();
  }

  remove () {
    this.el.remove();
    ALL_SECTIONS.splice(this.getIndex(), 1)
  }
}

