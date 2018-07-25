import { field, setElementsPrefix } from './partial/elements';
import Section from './section';

export default class Sidebar {
  constructor (align) {
    this.$align = align;
    this._init();
  }

  _init () {
    setElementsPrefix('align-sidebar-');
    this.el = document.createElement('div');
    this.el.classList.add('align-sidebar');
    this.layout = document.createElement('div');
    this.layout.classList.add('align-layout');
    this.layout.insertAdjacentHTML('afterbegin', `
      <label>Section layout</label>
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
    `);
    this.el.appendChild(this.layout);
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

  update () {
    Object.keys(this.marginInputs).forEach(key => {
      const property = `margin-${key}`;
      this.marginInputs[key].value = Section.activeSection.style[property];
    });
    Object.keys(this.paddingInputs).forEach(key => {
      const property = `padding-${key}`;
      this.paddingInputs[key].value = Section.activeSection.style[property];
    });
  }
}
