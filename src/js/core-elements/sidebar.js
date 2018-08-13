import Section from './section';
import Colorpicker from './colorpicker';

import icons from '../partial/icons';
import { setElementsPrefix } from '../partial/elements';
import { stringToDOM } from '../partial/utils';

export default class Sidebar {
  constructor (align) {
    this.$align = align;
    this._init();
  }

  _init () {
    setElementsPrefix('align-sidebar-');
    this.el = document.createElement('div');
    this.el.classList.add('align-sidebar');
    this.watchers = [];
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
      const prop = `margin-${key}`;
      this.marginInputs[key].value = this.currentProps.layout[prop] || '';
      this.marginInputs[key].addEventListener('input', (evnt) => {
        const newObj = Object.assign(
          Section.activeSection.props.layout,
          { [prop]: evnt.target.value }
        );
        Section.activeSection.props.layout = newObj;
      });
    });
    Object.keys(this.paddingInputs).forEach(key => {
      const prop = `padding-${key}`;
      this.paddingInputs[key].value = this.currentProps.layout[prop] || '';
      this.paddingInputs[key].addEventListener('input', (evnt) => {
        const newObj = Object.assign(
          Section.activeSection.props.layout,
          { [prop]: evnt.target.value }
        );
        Section.activeSection.props.layout = newObj;
      });
    });
  }

  element (name, type) {
    if (type === 'switcher') {
      const elm = stringToDOM(`
        <label class="align-switcher" for="${name}">
          <span class="align-switcher-info">${name}</span>
          <input class="align-switcher-input" id="${name}" type="checkbox">
          <span class="align-switcher-body">
            <span class="align-switcher-handle"></span>
          </span>
        </label>
      `);
      const input = elm.querySelector('.align-switcher-input');
      return { input, elm };
    }
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
      return { input, label, close, el };
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

  updateFields () {
    this.el.innerHTML = '';
    this.fields.forEach(field => {
      switch (field) {
        case 'backgroundImage':
          this.backgroundImage = this.field('background-image', 'Background image:', 'file');
          this.backgroundImage.input.addEventListener('change', (evnt) => {
            const active = Section.activeSection;
            active.props.backgroundImage = evnt.target.files[0];
          });
          this.backgroundImage.label.innerText =
          this.currentProps.backgroundImage
            ? this.currentProps.backgroundImage.name || this.currentProps.backgroundImage
            : 'Add image';

          this.parallax = this.element('parallax', 'switcher');
          this.backgroundImage.el.insertAdjacentElement('beforeend', this.parallax.elm);
          this.parallax.input.checked = this.currentProps.parallax;
          this.parallax.input.addEventListener('change', (evnt) => {
            const active = Section.activeSection;
            active.props.parallax = !!evnt.target.checked;
          });
          break;

        case 'backgroundVideo':
          this.backgroundVideo = this.field('background-video', 'Background video:', 'file');
          this.backgroundVideo.input.addEventListener('change', (evnt) => {
            const active = Section.activeSection;
            active.props.backgroundVideo = evnt.target.files[0];
          });
          this.backgroundVideo.label.innerText =
          this.currentProps.backgroundVideo
            ? this.currentProps.backgroundVideo.name || this.currentProps.backgroundVideo
            : 'Add video';
          break;

        case 'backgroundColor':
          this.backgroundColor = this.field('background-color', 'Background color:', 'color');
          this.backgroundColor.input.addEventListener('change', (evnt) => {
            const active = Section.activeSection;
            active.props.backgroundColor = evnt.target.value;
          });
          this.backgroundColor.colors.forEach(color => {
            color.el.addEventListener('click', () => {
              const active = Section.activeSection;
              if (color.color !== 'clear') {
                active.props.backgroundColor = color.color;
              }
              if (color.color === 'clear') {
                active.props.backgroundColor = null;
              }
            });
          });
          this.backgroundColor.colorpikcer.selectColor(this.currentProps.backgroundColor || '#fff', true);
          break;

        case 'customClass':
          this.customClass = this.generateElement(
            'Custom class:',
            `<input class="align-sidebar-input" data-align-input type="text">`
          );
          this.customClass = this.customClass.querySelector('[data-align-input]');
          this.customClass.value = this.currentProps.customClass;
          this.customClass.addEventListener('input', function () {
            const active = Section.activeSection;
            active.props.customClass = (() => {
              let values = this.value.split(/[ ,]+/);
              return values.map(val => val.trim()).filter(val => val !== '');
            })();
          });
          break;

        case 'layout':
          this._initLayout();
      }
    });
  }

  update () {
    this.currentProps = Section.activeSection.props;
    this.fields = Section.activeSection.fields;
    this.updateFields();
  }
}
