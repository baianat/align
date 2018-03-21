import { updatePosition, camelCase, getYoutubeVideoId } from './partial/util';
import { setElementsPrefix, button, fileButton, menuButton } from './partial/elements';
import OptionsBar from './optionsBar';
import Selection from './selection';

class Creator {
  constructor(align, {
    mode = 'default',
    items = ['figure', 'video']
  } = {}) {
    this.$align = align;
    this.settings = {
      mode,
      items
    };
    this._init();
  }

  _init() {
    setElementsPrefix('creator-');
    this.creator = document.createElement('div');
    this.creator.classList.add('creator', 'is-hidden');
    this.menu = document.createElement('ul');
    this.menu.classList.add('creator-menu');
    this.toggleButton = button('plus');
    this.toggleButton.addEventListener('click', this.toggleState.bind(this));
    this.optionsBar = new OptionsBar(this.$align);

    {
      const menuItem = document.createElement('li');
      const button = fileButton('figure');
      button.input.addEventListener('change', this.createFigure.bind(this));
      menuItem.appendChild(button.el);
      this.menu.appendChild(menuItem);
    }

    {
      const button = menuButton('video');
      button.addEventListener('click', this.createVideo.bind(this));
      this.menu.appendChild(button);
    }


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
      updatePosition(Selection.current.anchorNode, this.creator, this.$align.el, 'middle-left');
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
    figure.classList.add('align-figure', 'is-normal');
    figure.appendChild(img);
    figure.appendChild(caption);
    figure.addEventListener('click', () => this.optionsBar.active(figure));
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
  
    let link = prompt('Write video URL here', ''); // eslint-disable-line
    if (!link && link === '') return;
    console.log(link)
    const videoId = getYoutubeVideoId(link);
    const iframe = document.createElement('iframe');
    const selectedElement = Selection.current.anchorNode;

    iframe.width = 560;
    iframe.height = 315;
    iframe.allowfullscreen = true;
    iframe.contentEditable = false
    iframe.src = `//www.youtube.com/embed/${videoId}`;
    selectedElement.parentNode.insertBefore(iframe, selectedElement);
  }
}

export default Creator;
