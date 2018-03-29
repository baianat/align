import { updatePosition, camelCase, getVideoId } from './partial/util';
import { setElementsPrefix, button, fileButton } from './partial/elements';
import Styler from './styler';
import Selection from './selection';
import Prompt from './prompt';

export default  class Creator {
  constructor(align, {
    theme = 'light',
    items = ['figure', 'video', 'facebook', 'table', 'embed']
  } = {}) {
    this.$align = align;
    this.settings = {
      theme,
      items
    };
    this._init();
  }

  _init() {
    setElementsPrefix('creator-');
    this.creator = document.createElement('div');
    this.creator.classList.add('creator', 'is-hidden', this.settings.theme);
    this.menu = document.createElement('ul');
    this.menu.classList.add('creator-menu');
    this.toggleButton = button('plus');
    this.toggleButton.addEventListener('click', this.toggleState.bind(this));
    this.optionsBar = new Styler(this.$align, {
      mode: 'bubble',
      hideWhenClickOut: true,
      commands: [
        { '_figureClasses': ['floatLeft', 'center', 'floatRight', 'full'] },
        '_remove'
      ],
      tooltip: false,
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

    this.creator.appendChild(this.toggleButton);
    this.creator.appendChild(this.menu);
    this.$align.el.appendChild(this.creator);
  }

  update() {
    if (
      Selection.current.isCollapsed &&
      Selection.current.anchorNode.nodeType === 1 &&
      Selection.current.anchorNode.childNodes.length <= 1 &&
      Selection.current.anchorNode.parentNode.classList.contains('align-content')
    ) {
      this.position = updatePosition(Selection.current.anchorNode, this.creator, this.$align.el, 'middle-left');
      this.show();
      return;
    }
    this.hide();
  }

  toggleState() {
    this.creator.classList.toggle('is-active');
  }

  show() {
    if (this.creator.classList.contains('is-visible')) return;
    this.creator.classList.add('is-visible');
    this.creator.classList.remove('is-hidden');
  }

  hide() {
    this.creator.classList.remove('is-visible');
    this.creator.classList.remove('is-active');
    this.creator.classList.add('is-hidden');
  }

  createFigure(event) {
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
    figure.addEventListener('click', () => this.optionsBar.show({ 
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
    selectedElement.parentNode.insertBefore(figure, selectedElement);
  }

  createVideo () {
    const selectedElement = Selection.current.anchorNode;
    new Prompt('Enter video link:', '', { position: this.position })
      .onSubmit(function () {
        const link = this.inputs[0].value
        console.log(link)
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
        selectedElement.parentNode.insertBefore(iframe, selectedElement);
      });
  }

  createTable () {
    const selectedElement = Selection.current.anchorNode;
    new Prompt('Enter post link:', '', { 
      position: this.position,
      inputsCount: 2,
      inputsPlaceholders: ['rows', 'columns']
    }).onSubmit(function () {
      const rows = Number(this.inputs[0].value);
      const columns = Number(this.inputs[1].value);
      if (isNaN(rows) || isNaN(columns)) return;
      const table = document.createElement('table');
      table.classList.add('align-table')
      table.insertAdjacentHTML('afterbegin', `
        <tr>
          ${'<td><br></td>'.repeat(columns)}
        </tr>
      `.repeat(rows))
      selectedElement.parentNode.insertBefore(table, selectedElement);
    });
  }

  embedPost () {
    const selectedElement = Selection.current.anchorNode;
    new Prompt('Enter post link:', '', { position: this.position })
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
        selectedElement.parentNode.insertBefore(iframe, selectedElement);
      });
  }

  embed () {
    const selectedElement = Selection.current.anchorNode;
    new Prompt('Add embeded:', '', { position: this.position })
      .onSubmit(function () {
        const data = this.inputs[0].value
        if (!data) return;
        const div = document.createElement('div');

        selectedElement.parentNode.insertBefore(div, selectedElement);
        div.insertAdjacentHTML('afterbegin', data);
      });
  }

  embedTweet () {
  }

}

