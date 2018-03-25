import { stringToDOM } from './partial/util'
import Styler from './styler';

let ID = 0;
let ALL_SECTIONS = [];

class Section {
  constructor (content, position, type = 'text') {
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

  static config (align) {
    this.$align = align;
    this.$optionsBar = new Styler(align, {
      mode: 'bubble',
      hideWhenClickOut: true,
      commands:  [
        '_sectionUp', '_sectionDown',
        '_sectionColor', '_sectionImage', '_sectionVideo', '_sectionToggleHTML',
        {'_sectionClasses': ['normal', 'full']},
        '_remove'
      ],
      tooltip:  false,
      theme:  'dark'
    });
  }

  static get allSections () {
    return ALL_SECTIONS;
  }

  get content () {
    let output;
    if (this.type === 'text') {
      output = this.contentDiv.cloneNode(true);
      output.classList.remove('align-content');
      output.classList.add('align-section');
      output.contentEditable = 'inherit';
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
        this.el.insertAdjacentElement('afterBegin', this.newSectionButton());
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

  newSectionButton () {
    const btn = document.createElement('button');
    btn.classList.add('align-newSection');
    btn.addEventListener('click', () => new Section('', this.el));
    btn.contentEditable = false;
    return btn
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
    this.contentDiv.style.backgroundColor = color;
  }

  backgroundImage (cmdSchema, event) {
    const input = event.target;
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader(); // eslint-disable-line
    const bg = this.contentDiv.querySelector('.align-bgImage') ||
              document.createElement('div');
    if (!this.contentDiv.querySelector('.align-bgImage')) {
      bg.classList.add('align-bgImage');
      this.contentDiv.insertAdjacentElement('afterBegin', bg);
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
    let video = this.contentDiv.querySelector('.align-bgVideo');
    let source = null;
    let blob = null;

    const url = URL.createObjectURL(event.target.files[0]);
    if (!video) {
      const video = stringToDOM(`<video autoplay muted loop class="align-bgVideo"></video>`);
      source = document.createElement('source');
      video.appendChild(source);
      this.contentDiv.insertAdjacentElement('afterBegin', video);
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
    if (
      !this.el.previousSibling ||
      !this.el.previousSibling.classList.contains('align-section')
    ) return;
    Section.$align.editor.insertBefore(this.el, this.el.previousSibling);
  }

  moveDown () {
    if (!this.el.nextSibling) return;
    Section.$align.editor.insertBefore(this.el, this.el.nextSibling.nextSibling);
  }
  
  active () {
    Section.$optionsBar.show(this);
    this.contentDiv.focus();
  }

  remove () {
    this.el.remove();
  }
}

export default Section;
