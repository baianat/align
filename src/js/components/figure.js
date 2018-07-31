import Styler from '../styler';
import Prompt from '../prompt';

export default class Figure {
  constructor (align, figure) {
    if (!figure) {
      return {
        el: null
      };
    }
    this.$align = align;
    this._init(figure);
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
    caption.contentEditable = 'inherit';
    caption.removeAttribute('data-default-value');
    img.removeAttribute('data-align-filename');
    if (caption.innerText === '') {
      caption.remove();
    }
  }

  _init (figure) {
    // check if it's the figure element
    if (figure.nodeType === 1) {
      this.el = figure;
      this.caption = figure.querySelector('figcaption') || document.createElement('figcaption');
      this.img = figure.querySelector('img');
    }
    
    // check if it's the figure image url
    if (figure.nodeType !== 1) {
      this.el = document.createElement('figure');
      this.caption = document.createElement('figcaption');
      this.img = document.createElement('img');
      this.readFileContent(figure);
    }
    
    this.toolbar = new Styler(this.$align, Figure.defaults);
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

  readFileContent (file) {
    if (!this.isImage(file.name)) {
      return {
        el: null
      };
    }
    const reader = new FileReader(); // eslint-disable-line
    reader.addEventListener('load', () => {
      this.img.src = reader.result;

      this.img.dataset.alignFilename = file.name;
      this.$align.$bus.emit('imageAdded', {
        file,
        update: this.update.bind(this)
      });
    });
    reader.readAsDataURL(file);
  }

  isImage (filename) {
    const parts = filename.split('.');
    const ext = parts.slice(-1)[0];

    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpge':
      case 'gif':
      case 'bmp':
      case 'png':
        return true;
    }
    return false;
  }

  update (newSrc) {
    this.img.src = newSrc;
  }

  remove () {
    this.toolbar.remove();
    this.el.remove();
  }

  static defaults = {
    mode: 'bubble',
    hideWhenClickOut: true,
    addActiveClass: true,
    commands: [{ _figureClasses: ['floatLeft', 'center', 'floatRight', 'full'] }, '_remove'],
    tooltip: true
  }

  static schema = {
    icon: 'figure',
    tooltip: 'Add Figure'
  }
}
