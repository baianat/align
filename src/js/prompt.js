import { isElementClosest } from "./partial/util";

export default class Prompt {
  constructor (message = '', data = '', positon) {
    this._init(message, data, positon);
  }

  _init (message, data, positon) {
    this.el = document.createElement('div');
    this.message = document.createElement('label');
    this.input = document.createElement('input');
    this.submit = document.createElement('button');

    this.el.classList.add('prompt');
    this.message.classList.add('prompt-message');
    this.input.classList.add('prompt-input');
    this.submit.classList.add('prompt-submit');

    this.el.style.left = `${positon.left}px`;
    this.el.style.top = `${positon.top}px`;
    this.message.innerText = message;
    this.input.value = data;
    this.submit.innerText = 'Submit';

    this.el.appendChild(this.message);
    this.el.appendChild(this.input);
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
