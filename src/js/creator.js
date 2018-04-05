import { updatePosition, camelCase, getVideoId, stringToDOM } from './partial/util';
import { setElementsPrefix, button, fileButton, dropdown } from './partial/elements';
import Styler from './styler';
import Selection from './selection';
import Prompt from './prompt';
import Table from './table';

export default class Creator {
  constructor(align, {
    mode = 'toolbar',
    theme = 'light',
    items = ['figure', 'video', 'facebook', 'table', 'embed', 'column', 'line']
  } = {}) {
    this.$align = align;
    this.settings = {
      mode,
      theme,
      items
    };
    this._init();
  }

  _init() {
    setElementsPrefix('creator-');
    this.el = document.createElement('div');
    this.el.classList.add('creator', `is-${this.settings.theme}`, `is-${this.settings.mode}`);
    this.menu = document.createElement('ul');
    this.menu.classList.add('creator-menu');

    this.settings.items.forEach((item) => {
      const li = document.createElement('li');
      let el = null;

      switch (item) {
        case 'figure':
          const btn = fileButton('figure');
          btn.input.addEventListener('change', this.createFigure.bind(this));
          el = btn.el;
          break;

        case 'video':
          el = button('video');
          el.addEventListener('click', this.createVideo.bind(this));
          break;

        case 'table':
          el = button('table');
          el.addEventListener('click', this.createTable.bind(this));
          break;

        case 'facebook':
          el = button('facebook');
          el.addEventListener('click', this.embedPost.bind(this));
          break;
  
        case 'embed':
          el = button('embed');
          el.addEventListener('click', this.embed.bind(this));
          break;

        case 'column':
          el = button('column');
          el.addEventListener('click', this.createGrid.bind(this));
          break;

        case 'line':
          const ddown = dropdown('insertLine', [
            '<hr class="align-line">',
            '<hr class="align-line is-dashed">',
            '<hr class="align-line is-dotted">',
            '<hr class="align-line is-double">',
            '<hr class="align-line is-dots">',
            '<hr class="align-line is-bold">',
            '<hr class="align-line is-bold is-dashed">',
            '<hr class="align-line is-bold is-dotted">',
            '<hr class="align-line is-bold is-double">'
          ], (line) => {
            this.insertElement(stringToDOM(line));
          });
          el = ddown.dropdown
          break;
        default:
          return;
      }
      li.appendChild(el);
      this.menu.appendChild(li);
    })
    this.el.appendChild(this.menu);
    if (this.settings.mode === 'inline') {
      this.toggleButton = button('plus');
      this.toggleButton.addEventListener('click', this.toggleState.bind(this));
      this.el.appendChild(this.toggleButton);
      this.$align.el.appendChild(this.el);
    }
    if (this.settings.mode === 'toolbar' && this.$align.toolbar) {
      this.$align.toolbar.el.appendChild(this.el);
    }
    if (this.settings.mode === 'toolbar' && !this.$align.toolbar) {
      this.$align.toolbar = new Styler(this.$align, {
        mode: 'toolbar',
        commands: []
      });
      this.$align.toolbar.el.appendChild(this.el);
    }
  }

  update () {
    if (this.settings.mode !== 'inline') {
      this.position = null;
      return;
    }
    if (
      Selection.current.isCollapsed &&
      Selection.current.anchorNode.nodeType === 1 &&
      Selection.current.anchorNode.childNodes.length <= 1 &&
      Selection.current.anchorNode.parentNode.classList.contains('align-content')
    ) {
      this.position = updatePosition(Selection.current.anchorNode, this.el, this.$align.el, 'middle-left');
      this.show();
      return;
    }
    this.hide();
  }

  toggleState () {
    this.el.classList.toggle('is-active');
  }

  show () {
    if (this.el.classList.contains('is-visible')) return;
    this.el.classList.add('is-visible');
    this.el.classList.remove('is-hidden');
  }

  hide () {
    this.el.classList.remove('is-visible');
    this.el.classList.remove('is-active');
    this.el.classList.add('is-hidden');
  }
  
}
