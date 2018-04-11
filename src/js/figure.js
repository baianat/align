import Styler from './styler';

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

  static config (align) {
    align.$figureToolbar = new Styler(align, {
      mode: 'bubble',
      hideWhenClickOut: true,
      commands: [{ _figureClasses: ['floatLeft', 'center', 'floatRight', 'full'] }, '_remove'],
      tooltip: true,
      ...align.settings.figure
    });
  }

  _init (figure) {
    // check if it's the figure element
    if (figure.nodeType === 1) {
      this.el = figure;
      this.caption = figure.querySelector('figcaption');
      this.img = figure.querySelector('img');
    }

    // check if it's the figure image url
    if (figure.nodeType !== 1) {
      this.el = document.createElement('figure');
      this.caption = document.createElement('figcaption');
      this.img = document.createElement('img');
      this.readFileContent(figure);
    }

    this.el.contentEditable = false;
    this.caption.contentEditable = true;
    this.caption.dataset.defaultValue = 'Figure caption';
    this.img.classList.add('align-image');
    this.el.classList.add('align-figure', 'is-center');
    this.el.appendChild(this.img);
    this.el.appendChild(this.caption);
    this.el.addEventListener('click', () => {
      this.$align.$figureToolbar.update(this);
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
    this.$align.$figureToolbar.hide();
    this.el.remove();
  }
}
