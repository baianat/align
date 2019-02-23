import { stringToDOM } from '../partial/utils';

/**
 * Slider class
 */
export default class Slider {
  constructor (settings) {
    this.el = document.createElement('input');
    this.el.type = 'range';
    this.settings = {
      ...Slider.defaults,
      ...settings
    };
    this._init();
  }

  _init () {
    this.min = this.el.min = Number(this.settings.min);
    this.max = this.el.max = Number(this.settings.max);
    this.step = this.el.step = Number(this.settings.step);
    this.value = this.el.value = Number(this.settings.value);
    const stepSplitted = this.step.toString().split('.')[1]; 
    this.decimalsCount = stepSplitted ? stepSplitted.length : 0;

    this._initElements();
    this._initEvents();
  }

  _initElements () {
    this.wrapper = document.createElement('div');
    this.track = document.createElement('div');

    this.wrapper.classList.add('slider');
    if (this.settings.classes) {
      this.wrapper.classList.add(...this.settings.classes);
    }
    this.track.classList.add('slider-track');
    this.el.classList.add('slider-input');

    this.fill = document.createElement('div');
    this.fill.classList.add('slider-fill');
    this.track.appendChild(this.fill);
    this.handle = stringToDOM(`<div class="slider-handle"></div>`);
    this.handle.addEventListener('mousedown', this.select.bind(this), false);
    this.handle.addEventListener('touchstart', this.select.bind(this), { passive: true });
    this.track.appendChild(this.handle);

    this.wrapper.appendChild(this.el);
    this.wrapper.appendChild(this.track);
  }

  _initEvents () {
    window.addEventListener('resize', () => {
      this.updateWidth();
      this.update(undefined, true);
    });
    this.track.addEventListener('mousedown', this.select.bind(this), false);
    this.track.addEventListener('touchstart', this.select.bind(this), { passive: true });
  }

  /**
   * fire select events
   */
  select (event) {
    event.preventDefault();
    event.stopPropagation();
    // check if  left mouse is clicked
    if (event.buttons !== 1) return;
    this.updateWidth();
    this.track.classList.add('is-dragging');
    this.ticking = false;

    const stepValue = this.getStepValue(event);
    this.update(stepValue);

    this.tempDrag = this.dragging.bind(this);
    this.tempRelease = this.release.bind(this);
    document.addEventListener('mousemove', this.tempDrag);
    document.addEventListener('touchmove', this.tempDrag);
    document.addEventListener('touchend', this.tempRelease);
    document.addEventListener('mouseup', this.tempRelease);
  }

  /**
   * dragging motion
   */
  dragging (event) {
    event.preventDefault();
    const stepValue = this.getStepValue(event);
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.update(stepValue);
        this.ticking = false;
      });

      this.ticking = true;
    }
  }

  /**
   * release handler
   */
  release () {
    this.track.classList.remove('is-dragging');
    document.removeEventListener('mousemove', this.tempDrag);
    document.removeEventListener('touchmove', this.tempDrag);
    document.removeEventListener('mouseup', this.tempRelease);
    document.removeEventListener('touchend', this.tempRelease);
  }

  getStepValue (event) {
    const eventX = event.type.includes('mouse')
      ? event.clientX : event.type.includes('touch')
        ? event.touches[0].clientX : event;

    const mouseValue = (eventX - this.currentX);
    const stepCount = parseInt((mouseValue / this.stepWidth) + 0.5, 10);
    const stepValue = (stepCount * this.step) + this.min;
    if (!this.decimalsCount) {
      return stepValue;
    }
    return Number(stepValue.toFixed(this.decimalsCount));
  }

  updateWidth () {
    const trackRect = this.track.getBoundingClientRect();
    this.currentX = trackRect.left;
    this.width = trackRect.width;
    this.stepWidth = (this.width / (this.max - this.min)) * this.step;
  }

  /**
   * get the filled area percentage
   * @param  {Object} slider
   * @param  {Number} value
   * @return {Number}
   */
  getPositionPercentage (value) {
    return (value - this.min) / (this.max - this.min);
  }

  normalizeValue (value) {
    if (isNaN(Number(value))) {
      return this.value;
    }
    return Math.min(Math.max(Number(value), this.min), this.max);
  }


  /**
   * update the slider fill, value and color
   * @param {Number} value
   */
  update (value, mute = false) {
    const normalized = this.normalizeValue(value);
    const positionPercentage = this.getPositionPercentage(normalized);

    this.fill.style.transform = `translate(${positionPercentage * this.width}px, 0) scale(${1 - positionPercentage}, 1)`;
    this.handle.style.transform = `translate(${positionPercentage * this.width}px, 0)`;
    this.value = normalized;
    this.el.value = this.value;

    if (mute) return;
    this.el.dispatchEvent(new Event('change')); // eslint-disable-line
    this.el.dispatchEvent(new Event('input'));  // eslint-disable-line
  }

  // eslint-disable-next-line
  static defaults = {
    created: {},
    updated: {},
    gradient: null,
    classes: null,
    colorCode: false,
    editable: false,
    reverse: false,
    label: true,
    min: 0,
    max: 10,
    step: 1,
    value: 1,
    trackSlide: true
  }
}
