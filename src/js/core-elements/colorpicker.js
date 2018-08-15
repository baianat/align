import Slider from './slider';
import Dep from '../partial/dep'; 
import {
  call,
  select,
  getArray,
  stringToDOM,
  isElementClosest,
  updatePosition
} from '../partial/utils';
import {
  getRandomColor,
  toHex,
  toRgb,
  toHsl
} from 'color-fns';

export default class Colorpicker {
  constructor (selector, settings) {
    this.el = select(selector);
    this.settings = {
      ...Colorpicker.defaults,
      ...settings
    };
    this.init();
  }

  init () {
    this.events = [new Event('input'), new Event('change')];
    this.colors = {
      current: this.settings.defaultColor,
      model: this.settings.model,
      rgb: '',
      hsl: '',
      hex: ''
    }
    this._initElements();
    this._initWatchers();
    this._initInputs();
    this._initEvents();
    this.selectColor(this.settings.defaultColor, true);
  }

  _initWatchers () {
    Object.keys(this.colors).forEach(key => {
      let internalValue = this.colors[key]
      const dep = new Dep();
      
      Object.defineProperty(this.colors, key, {
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
    Dep.watcher(() => {
      this.colors.rgb = toRgb(this.colors.current);
    });
    Dep.watcher(() => {
      this.colors.hsl = toHsl(this.colors.current);
    });
    Dep.watcher(() => {
      this.colors.hex = toHex(this.colors.current);
    });
    Dep.watcher(() => {
      this.strip.update(this.colors.hsl.hue, true);
    });

  }
  _initElements () {
    this.mouse = { x: 0, y: 0 };
    this.lastMove = { x: 0, y: 0 };
    this.isMenuActive = false;
    // create colorpicker element
    this.picker = document.createElement('div');
    this.menu = stringToDOM('<div class="picker-menu is-hidden" tabindex="-1"></div>');
    this.guide = stringToDOM(`<button class="picker-guide">${this.settings.guideIcon}</button>`);
    this.controllers = stringToDOM(`<div class="picker-controllers"></div>`);

    // append colorpicker elements
    this.picker.appendChild(this.menu);
    this.picker.appendChild(this.guide);
    this._initPicker();
    this.menu.appendChild(this.controllers);

    this.el.parentNode.insertBefore(this.picker, this.el);
    this.el.classList.add('picker-value');
    this.picker.classList.add('picker');
    this.picker.appendChild(this.el);
    this.guide.style.color = this.settings.defaultColor;
    this.guide.style.fill = this.settings.defaultColor;
  }

  _initPicker () {
    this.square = stringToDOM(`
      <div class="picker-square">
        <canvas class="picker-canvas"></canvas>
        <div class="picker-cursor"></div>
      </div>`);

    this.canvas = this.square.querySelector('.picker-canvas');
    this.strip = this.square.querySelector('.picker-squareStrip');
    this.cursor = this.square.querySelector('.picker-cursor');
    this.ctx = this.canvas.getContext('2d');
    this.strip = new Slider({ min: 0, max: 360, step: 1, classes: ['is-strip'] });

    this.menu.appendChild(this.square);
    this.controllers.appendChild(this.strip.wrapper);

    // setup canvas
    this.canvas.width = 250;
    this.canvas.height = 150;
    this.pickerRect = this.canvas.getBoundingClientRect();

    const updateColor = (event) => {
      const { x, y } = event;
      const { left, top } = this.pickerRect;
      const normalized = {
        x: Math.min(Math.max(x - left, 0), this.canvas.width - 1),
        y: Math.min(Math.max(y - top, 0), this.canvas.height)
      }
      this.mouse = { x: normalized.x, y: normalized.y };
      const color = this.getColorCanvas(this.mouse, this.ctx);
      this.selectColor(color);
      this.updateCursor(this.mouse);
    }

    const updateHue = (event) => {
      this.colors.hsl.hue = event.target.value;
      this.selectColor(this.colors.hsl);
    }

    
    const mouseDownHandler = (event) => {
      event.preventDefault();
      this.pickerRect = this.canvas.getBoundingClientRect();
      return function (func) {
        func(event);
        let tempFunc = (event) => {
          window.requestAnimationFrame(() => func(event));
        }
        const mouseupHandler = () => {
          document.removeEventListener('mousemove', tempFunc);
          document.removeEventListener('mouseup', mouseupHandler);
        }
        document.addEventListener('mousemove', tempFunc);
        document.addEventListener('mouseup', mouseupHandler);
      }
}
    this.updateSquareColors();

    // add event listener
    this.canvas.addEventListener('mousedown', (event) => mouseDownHandler(event)(updateColor));
    this.strip.el.addEventListener('input', updateHue);
  }

  _initInputs () {
    this.inputsWrapper = stringToDOM('<div class="picker-inputs"></div>');
    this.modelSwitcher = stringToDOM('<button class="picker-model"></button>');
    this.submit = stringToDOM(`
    <button class="picker-submit">
      <svg class="icon" viewBox="0 0 24 24">
        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
      </svg>
    </button>`);
    

    this.updateInputsModel();
    this.controllers.appendChild(this.inputsWrapper);

    this.modelSwitcher.addEventListener('click', (event) => {
      const models = ['hex', 'rgb', 'hsl'];
      const indx = models.indexOf(this.colors.model);
      this.colors.model = models[indx + 1] || models[0];
      this.updateInputsModel();
    });
    this.submit.addEventListener('click', (event) => {
      call(this.settings.events.beforeSubmit);
      this.selectColor(this.el.value);
      if (this.settings.menu.hideWhenSubmit) {
        this.closePicker();
      }
      call(this.settings.events.afterSubmit);
    });
  }

  updateInputsModel () {
    this.inputsWrapper.innerHTML = '';
    this.modelSwitcher.innerText = this.colors.model + ': ';
    this.inputsWrapper.appendChild(this.modelSwitcher);
    if (this.colors.model === 'hsl') {
      this.inputs = {
        hue: stringToDOM('<input type="number" min="0" max="360" class="picker-input"/>'),
        sat: stringToDOM('<input type="number" min="0" max="100" class="picker-input"/>'),
        lum: stringToDOM('<input type="number" min="0" max="100" class="picker-input"/>')
      };
      Object.keys(this.inputs).forEach(key => {
        const current = this.inputs[key];
        this.inputsWrapper.appendChild(current);
        current.addEventListener('input', () => {
          this.selectColor(`hsl(
            ${this.inputs.hue.value},
            ${this.inputs.sat.value}%,
            ${this.inputs.lum.value}%)`
          );
          this.updateCursor();
        });
        Dep.watcher(() => {
          current.value = this.colors.hsl[key];
        })
      });
    }

    if (this.colors.model === 'rgb') {
      this.inputs = {
        red: stringToDOM('<input type="number" min="0" max="255" class="picker-input"/>'),
        green: stringToDOM('<input type="number" min="0" max="255" class="picker-input"/>'),
        blue: stringToDOM('<input type="number" min="0" max="255" class="picker-input"/>')
      };
      Object.keys(this.inputs).forEach(key => {
        const current = this.inputs[key];
        this.inputsWrapper.appendChild(current);
        current.addEventListener('input', () => {
          this.selectColor(`rgb(
            ${this.inputs.red.value},
            ${this.inputs.green.value},
            ${this.inputs.blue.value})`
          );
          this.updateCursor();
        });
        Dep.watcher(() => {
          current.value = this.colors.rgb[key];
        })
      });
    }

    if (this.colors.model === 'hex') {
      this.inputs = {
        hex: stringToDOM('<input type="text" class="picker-input"/>'),
      };
      const current = this.inputs['hex'];
      this.inputsWrapper.appendChild(current);
      current.addEventListener('input', () => {
        this.selectColor(current.value);
        this.updateCursor();
      });
      Dep.watcher(() => {
        current.value = this.colors.hex.toString();
      });
    }

    this.inputsWrapper.appendChild(this.submit);
  }

  _initEvents () {
    // eslint-disable-next-line

    this.guide.addEventListener('click', () => {
      call(this.settings.events.beforeOpen);
      this.togglePicker();
    });

    if (this.settings.menu.draggable) {
      this.menu.addEventListener('mousedown', (event) => {
        if (event.target !== this.menu || event.button !== 0) return;
        let startPosition = {}
        let endPosition = {}
        let delta = {}

        event.preventDefault();
        startPosition.x = event.clientX;
        startPosition.y = event.clientY;

        const mousemoveHandler = (evnt) => {
          window.requestAnimationFrame(() => {
            endPosition.x = evnt.clientX;
            endPosition.y = evnt.clientY;
            delta.x = this.lastMove.x + endPosition.x - startPosition.x;
            delta.y = this.lastMove.y + endPosition.y - startPosition.y;
            this.menu.style.transform = `translate(${delta.x}px, ${delta.y}px)`;
          });
        }
        const mouseupHandler = () => {
          this.lastMove = delta;
          document.removeEventListener('mousemove', mousemoveHandler);
          document.removeEventListener('mouseup', mouseupHandler);
        }
        document.addEventListener('mousemove', mousemoveHandler);
        document.addEventListener('mouseup', mouseupHandler);
      });
    }
  }

  updateSquareColors () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = `hsl(${this.colors.hsl.hue}, 100%, 50%)`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    let grdBlack = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
    grdBlack.addColorStop(0, `hsl(0, 0%, 50%)`);
    grdBlack.addColorStop(1, `hsla(0, 0%, 50%, 0)`);
    this.ctx.fillStyle = grdBlack;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    let grdWhite = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    grdWhite.addColorStop(0, `hsl(0, 0%, 100%)`);
    grdWhite.addColorStop(0.5, `hsla(0, 0%, 100%, 0)`);
    grdWhite.addColorStop(0.5, `hsla(0, 0%, 0%, 0)`);
    grdWhite.addColorStop(1, `hsl(0, 0%, 0%) `);
    this.ctx.fillStyle = grdWhite;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }


  updateCursor (mouse) {
    if (mouse) {
      this.cursor.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      return;
    }

    const x = (this.colors.hsl.sat / 100) * (this.canvas.width);
    const y = ((100 - this.colors.hsl.lum) / 100) * (this.canvas.height);
    this.mouse = { x: x, y: y };
    this.cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  selectColor (color, mute = false) {
    if (!mute) call(this.settings.events.beforeSelect);
    this.colors.current = color;
    this.el.value = this.colors[this.colors.model];

    this.guide.style.color = color;
    this.guide.style.fill = color;
   
    this.updateSquareColors()

    if (mute) return;
    call(this.settings.events.afterSelect);
    this.events.forEach((event) => this.el.dispatchEvent(event));
  }


  getColorCanvas (mouse, ctx) {
    console.log(mouse, this.canvas.width, this.canvas.height);
    const imageData = ctx.getImageData(mouse.x, mouse.y, 1, 1).data;
    return `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
  }


  togglePicker () {
    if (this.isMenuActive) {
      this.closePicker();
      return;
    }
    this.openPiker();
  }

  closePicker () {
    this.menu.classList.add('is-hidden');
    this.isMenuActive = false;
    document.removeEventListener('mousedown', this.documentCallback)
  }

  openPiker () {
    this.menu.classList.remove('is-hidden');
    this.isMenuActive = true;
    
    const documentCallback = (evnt) => {
      if (!isElementClosest(evnt.target, this.menu) && !isElementClosest(evnt.target, this.guide)) {
        this.closePicker();
        return;
      }
      call(this.settings.events.clicked);
    };
    this.documentCallback = documentCallback.bind(this);
    document.addEventListener('mousedown', this.documentCallback);
    call(this.settings.events.afterOpen);
  }
  static defaults = {
    defaultColor: getRandomColor(),
    model: 'rgb',
    events: {},
    menu: {
      draggable: true,
      hideWhenSubmit: true
    },
    rgbSliders: false,
    guideIcon: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12"/></svg>`
  }
}
