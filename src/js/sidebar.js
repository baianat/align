import { setElementsPrefix } from './partial/elements';
import { stringToDOM } from './partial/util';
import Colorpicker from '@baianat/colorpicker';
import Section from './section';
import icons from './partial/icons';

export default class Sidebar {
  constructor (align) {
    this.$align = align;
    this._init();
  }

  _init () {
    setElementsPrefix('align-sidebar-');
    this.el = document.createElement('div');
    this.el.classList.add('align-sidebar');
    this.backgroundImage = this.field('background-image', 'Background image:', 'file');
    this.backgroundVideo = this.field('background-video', 'Background video:', 'file');
    this.backgroundColor = this.field('background-color', 'Background color:', 'color');
    this.customClass = this.generateElement(
      'Custom class:',
      `<input class="align-sidebar-input" data-align-input type="text">`
    );
    this.customClass = this.customClass.querySelector('[data-align-input]');
    this.customClass.addEventListener('input', function () {
      const active = Section.activeSection;
      active.settings.customClass = (() => {
        let values = this.value.split(/[ ,]+/);
        return values.map(val => val.trim()).filter(val => val !== '');
      })();
    });
    this.backgroundImage.input.addEventListener('change', (evnt) => {
      const active = Section.activeSection;
      active.settings.backgroundImage = evnt.target.files[0];
      this.update();
    });
    this.backgroundVideo.input.addEventListener('change', (evnt) => {
      const active = Section.activeSection;
      active.settings.backgroundVideo = evnt.target.files[0];
      this.update();
    });
    this.backgroundColor.input.addEventListener('change', (evnt) => {
      const active = Section.activeSection;
      active.settings.backgroundColor = evnt.target.value;
      this.update();
    });
    this.backgroundColor.colors.forEach(color => {
      color.el.addEventListener('click', () => {
        const active = Section.activeSection;
        if (color.color !== 'clear') {
          active.settings.backgroundColor = color.color;
        }
        if (color.color === 'clear') {
          active.settings.backgroundColor = null;
        }
        this.update();
      });
    });
    this._initLayout();
  }

  _initLayout () {
    this.layout = this.generateElement('layout:', `
      <div class="align-layout">
        <div class="align-layout-margin">
          <input class="align-layout-input is-top" placeholder="-" data-align-margin-top type="text">
          <input class="align-layout-input is-left" placeholder="-" data-align-margin-left type="text">
          <input class="align-layout-input is-right" placeholder="-" data-align-margin-right type="text">
          <input class="align-layout-input is-bottom" placeholder="-" data-align-margin-bottom type="text">
        </div>
        <div class="align-layout-padding">
          <input class="align-layout-input is-top" placeholder="-" data-align-padding-top type="text">
          <input class="align-layout-input is-left" placeholder="-" data-align-padding-left type="text">
          <input class="align-layout-input is-right" placeholder="-" data-align-padding-right type="text">
          <input class="align-layout-input is-bottom" placeholder="-" data-align-padding-bottom type="text">
        </div>
      </div>
    `);
    this.marginInputs = {
      top: this.layout.querySelector('[data-align-margin-top]'),
      right: this.layout.querySelector('[data-align-margin-right]'),
      bottom: this.layout.querySelector('[data-align-margin-bottom]'),
      left: this.layout.querySelector('[data-align-margin-left]')
    };
    this.paddingInputs = {
      top: this.layout.querySelector('[data-align-padding-top]'),
      right: this.layout.querySelector('[data-align-padding-right]'),
      bottom: this.layout.querySelector('[data-align-padding-bottom]'),
      left: this.layout.querySelector('[data-align-padding-left]')
    };
    Object.keys(this.marginInputs).forEach(key => {
      const property = `margin-${key}`;
      this.marginInputs[key].addEventListener('input', (evnt) => {
        Section.activeSection.style[property] = evnt.target.value;
      });
    });
    Object.keys(this.paddingInputs).forEach(key => {
      const property = `padding-${key}`;
      this.paddingInputs[key].addEventListener('input', (evnt) => {
        Section.activeSection.style[property] = evnt.target.value;
      });
    });
  }

  field (name, desc, type) {
    const el = document.createElement('div');
    const labelEl = document.createElement('label');
    el.classList.add('align-sidebar-field');
    labelEl.classList.add('align-sidebar-label');
    labelEl.innerText = desc;
    el.appendChild(labelEl);
    this.el.appendChild(el);
    if (type === 'file') {
      const elm = stringToDOM('<div class="align-sidebar-file"></div>');
      const label = stringToDOM(`<label class="align-sidebar-label" for="${name}"></label>`);
      const input = stringToDOM(`<input class="align-sidebar-input" id="${name}" type="file">`);
      const close = stringToDOM(`<button>${icons['close']}</button>`);
      [label, input, close].forEach(comp => {
        elm.appendChild(comp);
      });
      el.appendChild(elm);
      close.addEventListener('click', () => {
        label.innerText = 'Add image';
        input.value = '';
        input.dispatchEvent(new window.Event('change'));
      });
      return { input, label, close };
    }
    if (type === 'color') {
      const elm = stringToDOM('<div class="align-sidebar-colors"></div>');
      const input = stringToDOM(`<input class="align-sidebar-input" id="${name}" type="text">`);
      let colors = ['black', 'white', 'gray', 'clear'];
      colors = colors.map(color => {
        return {
          el: stringToDOM(`<button class="align-sidebar-color is-${color}" type="text"><button>`),
          color
        };
      });
      colors.forEach(color => {
        elm.appendChild(color.el);
      })
      elm.appendChild(input);
      const colorpikcer = new Colorpicker(input, {
        defaultColor: '#fff',
        mode: 'hex',
        picker: { mode: 'square' },
        guideIcon: `
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="11"></circle>
          </svg>
        `
      });
      el.appendChild(elm);
      return { input, colorpikcer, colors: colors };
    }
  }

  generateElement (label, markup) {
    const el = document.createElement('div');
    const labelEl = document.createElement('label');
    el.classList.add('align-sidebar-field');
    labelEl.classList.add('align-sidebar-label');
    labelEl.innerText = label;
    this.el.appendChild(el);
    el.appendChild(labelEl);
    el.insertAdjacentHTML('beforeend', markup);
    return el;
  }

  update () {
    const current = Section.activeSection;
    Object.keys(this.marginInputs).forEach(key => {
      const property = `margin-${key}`;
      this.marginInputs[key].value = current.style[property];
    });
    Object.keys(this.paddingInputs).forEach(key => {
      const property = `padding-${key}`;
      this.paddingInputs[key].value = current.style[property];
    });
    this.customClass.value = current.settings.customClass;
    this.backgroundImage.label.innerText =
      current.settings.backgroundImage
        ? current.settings.backgroundImage.name || current.settings.backgroundImage
        : 'Add image';
    this.backgroundVideo.label.innerText =
      current.settings.backgroundVideo
        ? current.settings.backgroundVideo.name || current.settings.backgroundVideo
        : 'Add video';

    this.backgroundColor.colorpikcer.selectColor(current.settings.backgroundColor || '#fff', true);
  }
}
