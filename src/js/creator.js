import { updatePosition, getVideoId } from './partial/util';
import { setElementsPrefix, button, fileButton } from './partial/elements';
import Styler from './styler';
import Selection from './selection';
import Prompt from './prompt';
import Table from './table';

export default class Creator {
  constructor(align, {
    mode = 'toolbar',
    theme = 'light',
    items = ['figure', 'video', 'facebook', 'table', 'embed']
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

    this.figureOptions = new Styler(this.$align, {
      mode: 'bubble',
      hideWhenClickOut: true,
      commands: [
        { '_figureClasses': ['floatLeft', 'center', 'floatRight', 'full'] },
        '_remove'
      ],
      tooltip: true,
      theme: 'dark'
    });

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

  createFigure (event) {
    const input = event.target;
    const file = input.files[0];
    if (!file || !Selection.range) return;
    const reader = new FileReader(); // eslint-disable-line
    const figure = document.createElement('figure');
    const caption = document.createElement('figcaption');
    const img = document.createElement('img');
    const selectedElement = Selection.current.anchorNode;
    figure.contentEditable = false
    caption.contentEditable = true
    caption.dataset.defaultValue = 'Figure caption';
    img.classList.add('align-image');
    figure.classList.add('align-figure', 'is-center');
    figure.appendChild(img);
    figure.appendChild(caption);
    figure.addEventListener('click', () => this.figureOptions.show({
      el: figure,
      remove() {
        figure.remove();
      }
    }), false);
    reader.addEventListener('load', () => {
      img.src = reader.result;
      img.dataset.alignFilename = file.name;
      this.$align.update();
      const update = (src) => {
        img.src = src;
      };
      this.$align.$bus.emit('imageAdded', { file, update });
    });
    reader.readAsDataURL(file);
    input.value = null;
    selectedElement.parentNode.insertBefore(figure, selectedElement.nextSibling);
  }

  createVideo () {
    const selectedElement = Selection.current.anchorNode;
    new Prompt('Enter video link:', '', {
      wrapper: this.$align.el,
      position: this.position
    })
      .onSubmit(function () {
        const link = this.inputs[0].value
        if (!link) return;
        const videoHoster = link.includes('yout')
          ? 'youtube' : link.includes('vimeo')
            ? 'vimeo' : '';

        if (!videoHoster) {
          return;
        }

        const videoId = getVideoId(link, videoHoster);
        const iframe = document.createElement('iframe');

        iframe.width = 560;
        iframe.height = 315;
        iframe.allowfullscreen = true;
        iframe.contentEditable = false
        iframe.src = videoHoster === 'youtube'
          ? `//www.youtube.com/embed/${videoId}`
          : videoHoster === 'vimeo'
            ? `//player.vimeo.com/video/${videoId}`
            : ''
        selectedElement.parentNode.insertBefore(iframe, selectedElement.nextSibling);
      });
  }

  createTable () {
    const selectedElement = Selection.current.anchorNode;
    new Prompt('Enter post link:', '', {
      wrapper: this.$align.el,
      position: this.position,
      inputsCount: 2,
      inputsPlaceholders: ['rows', 'columns']
    }).onSubmit(function () {
      selectedElement.parentNode.insertBefore(
        new Table({
          rows: this.inputs[0].value,
          columns: this.inputs[1].value
        }).el,
        selectedElement.nextSibling
      );
    });
  }

  embedPost () {
    const selectedElement = Selection.current.anchorNode;
    new Prompt('Enter post link:', '', {
      wrapper: this.$align.el,
      position: this.position
    })
      .onSubmit(function () {
        const postUrl = this.inputs[0].value
        if (!postUrl) return;
        const iframe = document.createElement('iframe');

        iframe.width = 500;
        iframe.height = 200;
        iframe.scrolling = 'no';
        iframe.contentEditable = false;
        iframe.allowTransparency = true;
        iframe.src = `//www.facebook.com/plugins/post.php?href=${postUrl}`
        selectedElement.parentNode.insertBefore(iframe, selectedElement.nextSibling);
      });
  }

  embed () {
    const selectedElement = Selection.current.anchorNode;
    new Prompt('Add embeded:', '', {
      wrapper: this.$align.el,
      position: this.position
    })
      .onSubmit(function () {
        const data = this.inputs[0].value
        if (!data) return;
        const div = document.createElement('div');

        selectedElement.parentNode.insertBefore(div, selectedElement.nextSibling);
        div.insertAdjacentHTML('afterbegin', data);
      });
  }

  embedTweet () {
  }
}
