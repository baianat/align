import { isElementClosest, updatePosition } from './partial/util';
import Selection from './selection';

export default class Prompt {
  constructor (message = '', data = '', {
    wrapper = document.body,
    position = null,
    inputsCount = 1,
    inputsPlaceholders = []
  } = {}) {
    this.settings = {
      wrapper,
      position,
      inputsCount,
      inputsPlaceholders
    };
    this._init(message, data);
  }

  _init (message, data) {
    const position = this.settings.position;
    this.el = document.createElement('div');
    this.message = document.createElement('label');
    this.inputs = []

    this.el.classList.add('prompt');
    this.message.classList.add('prompt-message');

    if (position) {
      this.el.style.left = `${position.left}px`;
      this.el.style.top = `${position.top}px`;
    }
    if (!position) {
      if (Selection.range.startContainer.nodeType === 3) {
        this.selectionReference = Selection.range;
      }
      if (Selection.range.startContainer.nodeType === 1) {
        this.selectionReference = Selection.range.startContainer;
      }
      setTimeout(() => {
        updatePosition(this.selectionReference, this.el, this.settings.wrapper, 'left-top');
      }, 1);
    }
    this.message.innerText = message;

    this.el.appendChild(this.message);
    for (let i = 0; i < this.settings.inputsCount; i++) {
      this.inputs[i] = document.createElement('input');
      this.inputs[i].classList.add('prompt-input');
      if (this.settings.inputsPlaceholders[i]) {
        this.inputs[i].placeholder = this.settings.inputsPlaceholders[i];
      }
      this.el.appendChild(this.inputs[i]);
    }

    this.inputs[0].value = data;

    this.settings.wrapper.appendChild(this.el);
    setTimeout(() => {
      document.addEventListener('click', (event) => {
        if (
          isElementClosest(event.target, this.el)
        ) return;
        this.remove();
      });
    }, 1);
  }

  _generateButton(name) {
    this[name] = document.createElement('button');
    this[name].classList.add(`prompt-button`);
    this[name].innerText = name;
    this[name].addEventListener('click', this.remove.bind(this));
    this.el.appendChild(this[name]);
  }

  onSubmit (func, args) {
    this._generateButton('submit');
    this.submit.addEventListener('click', () => func(args));
    return this;
  }

  onDelete(func, args) {
    this._generateButton('delete');
    this.delete.addEventListener('click', () => func(args));
    return this;
  }
  

  onCancel(func, args) {
    this._generateButton('cancel');
    this.cancel.addEventListener('click', () => func(args));
    return this;
  }


  remove () {
    setTimeout(() => {
      this.el.remove();
    }, 1)
  }
}
