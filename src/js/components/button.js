import Component from './component';
import Styler from '../core-elements/styler';
import Prompt from '../core-elements/prompt';

export default class Button extends Component {
  constructor (align, button) {
    super(...arguments);

    if (this.mode === 'create') {
      this.el = document.createElement('a');
      this.el.classList.add('align-button');
      this.span = document.createElement('span');
      this.span.dataset.defaultValue = 'Button text';
      this.el.appendChild(this.span);
    }

    if (this.mode === 'edit') {
      this.el = button;
    }

    this._init();
  }

  static add (align) {
    return new Promise((resolve, reject) => {
      resolve(new Button(align));
    });
  }

  _init () {
    this.toolbar = new Styler(this.$align, Button.toolbar);

    this.el.addEventListener('click', () => {
      this.editLink();
      this.toolbar.update(this);
    });
  }

  editLink () {
    const prompt = new Prompt(this.$align, {
      message: 'Enter link:',
      data: this.el.getAttribute('href')
    });
    prompt.on('save', () => {
      const link = prompt.inputs[0].value;
      if (!link) return;
      this.el.href = link;
    });
    if (this.el.href) {
      prompt.on('clear', () => {
        this.el.href = '';
      });
    }
  }


  static toolbar = {
    mode: 'bubble',
    hideWhenClickOut: true,
    addActiveClass: true,
    position: 'center-bottom',
    tooltip: true,
    commands: [
      { 
        element: 'classes',
        values: ['small', 'normal', 'large'],
      },
      'separator',
      { 
        element: 'classes',
        values: ['primary', 'secondary', 'danger', 'success'],
      },
      'separator',
      { 
        element: 'classes',
        values: ['outline', 'default'],
      },
      'separator',
      'remove'
    ]
  }

  static schema = {
    icon: 'button'
  }
}
