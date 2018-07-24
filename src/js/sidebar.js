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
      <div class="align-layout-margin">
        <input class="align-layout-input is-top" data-align-margin-top type="number">
        <input class="align-layout-input is-left" data-align-margin-left type="number">
        <input class="align-layout-input is-right" data-align-margin-right type="number">
        <input class="align-layout-input is-bottom" data-align-margin-bottom type="number">
      </div>
      <div class="align-layout-padding">
        <input class="align-layout-input is-top" data-align-padding-top type="number">
        <input class="align-layout-input is-left" data-align-padding-left type="number">
        <input class="align-layout-input is-right" data-align-padding-right type="number">
        <input class="align-layout-input is-bottom" data-align-padding-bottom type="number">
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
  }

  update () {
    const currentLayout = Section.activeSection.layout;
    Object.keys(this.marginInputs).forEach(key => {
      const property = `margin-${key}`;
      this.marginInputs[key].value = currentLayout[property];
      this.marginInputs[key].addEventListener('input', (evnt) => {
        currentLayout[property] = evnt.target.value;
      });
    });
    Object.keys(this.paddingInputs).forEach(key => {
      const property = `padding-${key}`;
      this.paddingInputs[key].value = currentLayout[property];
      this.paddingInputs[key].addEventListener('input', (evnt) => {
        currentLayout[property] = evnt.target.value;
      });
    });
  }
}
