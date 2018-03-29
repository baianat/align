import { isElementClosest } from "./partial/util";

export default class Prompt {
  constructor (message = '', data = '', {
    position = {left: 0, top: 0},
    inputsCount = 1,
    inputsPlaceholders = []
  } = {}) {
    this.settings = {
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
    this.submit = document.createElement('button');
    this.inputs = []
    
    this.el.classList.add('prompt');
    this.message.classList.add('prompt-message');
    this.submit.classList.add('prompt-submit');

    this.el.style.left = `${position.left}px`;
    this.el.style.top = `${position.top}px`;
    this.message.innerText = message;
    this.submit.innerText = 'Submit';
    
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
    this.el.appendChild(this.submit);

    document.body.appendChild(this.el);
    setTimeout(() => {
      document.addEventListener('click', (event) => {
        if (
          isElementClosest(event.target, this.el)
        ) return;
        this.remove();
      });
    }, 16);
  }

  onSubmit (func, args) {
    this.submit.addEventListener('click', () => func.call(this, args));
    this.submit.addEventListener('click', () => setTimeout(this.remove.bind(this), 16));
    return this;
  }

  remove () {
    this.el.remove();
  }
}
