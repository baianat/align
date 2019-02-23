import Component from './component';
import Styler from '../core-elements/styler';
import Prompt from '../core-elements/prompt';
import { updatePosition } from '../partial/utils';

export default class Figure extends Component {
  constructor (align, figure) {
    super(...arguments);

    if (this.mode === 'create') {
      this.el = document.createElement('figure');
      this.caption = document.createElement('figcaption');
      this.img = document.createElement('img');
      this.readFileContent(figure);
    }

    if (this.mode === 'edit') {
      this.el = figure;
      this.caption = figure.querySelector('figcaption') || document.createElement('figcaption');
      this.img = figure.querySelector('img');
    }

    this._init();
  }

  static add (align) {
    const prompt = new Prompt(align, {
      message: 'Chose image figure:',
      inputsTypes: ['file']
    });
    return new Promise((resolve, reject) => {
      prompt.onSubmit(() => {
        const file = prompt.inputs[0].files[0];
        if (!file) {
          reject('no file provided');
        };
        resolve(new Figure(align, file));
      });
    });
  }

  static render (element) {
    const figure = element;
    const caption = element.querySelector('figcaption');
    const img = element.querySelector('img');
    figure.contentEditable = 'inherit';
    figure.classList.remove('is-active');
    caption.contentEditable = 'inherit';
    caption.removeAttribute('data-default-value');
    img.removeAttribute('data-align-filename');
    if (caption.innerText === '') {
      caption.remove();
    }
  }

  _init () {
    this.toolbar = new Styler(this.$align, Figure.toolbar);
    this.el.contentEditable = false;
    this.caption.contentEditable = true;
    this.caption.dataset.defaultValue = 'Figure caption';
    this.img.classList.add('align-image');
    this.el.classList.add('align-figure', 'is-center');
    this.el.appendChild(this.img);
    this.el.appendChild(this.caption);
    this.el.addEventListener('click', () => {
      this.toolbar.update(this);
    });
  }

  altText() {
     
    const prompt = new Prompt(this.$align, {
      message: 'Alt Text:',
      data: this.img.alt,
      inputsTypes: ['text'],
      inputsPlaceholders: ['Alt text'],
      position: {}
    });
    updatePosition(
      this.el,
      prompt.el,
      'middle-center'
    )
    prompt.onSubmit(() => { 
      this.img.alt = prompt.inputs[0].value;
    })
  }

  readFileContent (file) {
    if (!this.isImage(file.name)) {
      return {
        el: null
      };
    }

    this.img.src = URL.createObjectURL(file);

    const update = (src) => {
      this.img.src = src;
      this.$align.$bus.emit('changed');
    };

    this.$align.$bus.emit('imageAdded', {
      file,
      update
    });
  }

  isImage (filename) {
    const parts = filename.split('.');
    const ext = parts.slice(-1)[0];

    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
      case 'png':
        return true;
    }
  }

  static toolbar = {
    mode: 'bubble',
    hideWhenClickOut: true,
    addActiveClass: true,
    tooltip: true,
    commands: [
      { 
        element: 'classes',
        values: ['floatLeft', 'center', 'floatRight', 'full'],
        icons: ['figureLeft', 'figureCenter', 'figureRight', 'figureFull'],
      },
      'separator',
      {
        element: 'button',
        func: 'altText',
        icon: 'pencil'
      },
      'remove'
    ]
  }

  static schema = {
    icon: 'figure',
    tooltip: 'Add Figure'
  }
}
