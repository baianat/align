import { debounce, isElementClosest, camelCase } from './util';
import { setElementsPrefix, button, fileButton } from './elements';
import icons from './icons';
import Selection from './selection';

class Creator {
  constructor(align, {
    mode = 'default',
    items = ['figure']
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
    this.toggleButton = button('toggle', icons['plus']);
    this.toggleButton.addEventListener('click', this.toggleState.bind(this));

    this.settings.items.forEach(item => {
      const menuItem = document.createElement('li');
      const button = fileButton('figure', icons['figure']);
      button.input.addEventListener('change', this[`create${camelCase(item)}`].bind(this));
      menuItem.appendChild(button.el);
      this.menu.appendChild(menuItem);
      this._initOptionsBar();
    })

    this.creator.appendChild(this.toggleButton);
    this.creator.appendChild(this.menu);
    this.$align.el.appendChild(this.creator);
  }

  _initOptionsBar() {
    this.optionsBar = document.createElement('ul');
    this.optionsBar.classList.add('creator-optionsBar', 'is-hidden');

    const options = ['normal', 'full', 'float'];
    options.forEach(option => {
      const menuItem = document.createElement('li');
      const currentButton = button(option, icons[`figure${camelCase(option)}`]);
      currentButton.addEventListener('click', () => this.toggleClass(`is-${option}`, options));
      menuItem.appendChild(currentButton);
      this.optionsBar.appendChild(menuItem);
    })

    const menuItem = document.createElement('li');
    const currentButton = button('delete', icons[`delete`]);
    currentButton.addEventListener('click', () => {
      this.currentItem.remove();
      this.hideOptionsBar();
    });
    menuItem.appendChild(currentButton);
    this.optionsBar.appendChild(menuItem);

    this.$align.el.appendChild(this.optionsBar);
  }

  showOptionsBar(item) {
    if (this.optionsBar.classList.contains('is-visible')) return;

    this.currentItem = item;
    this.currentItem.classList.add('is-active');
    this.optionsBar.classList.add('is-visible');
    this.optionsBar.classList.remove('is-hidden');
    this.updatePosition(this.currentItem, this.optionsBar, 'top');
    this.optionsBarScroll = () => {
      this.updatePosition(this.currentItem, this.optionsBar, 'top');
    };
    this.optionsBarHide = this.hideOptionsBar.bind(this);
    window.addEventListener('scroll', this.optionsBarScroll);
    document.addEventListener('click', this.optionsBarHide);
  }

  hideOptionsBar(event) {
    if (
      event &&
      (isElementClosest(event.target, this.currentItem) ||
      isElementClosest(event.target, this.optionsBar))
    ) return;

    this.currentItem.classList.remove('is-active');
    this.currentItem = null;
    this.optionsBar.classList.remove('is-visible');
    this.optionsBar.classList.add('is-hidden');
    window.removeEventListener('scroll', this.optionsBarScroll);
    document.removeEventListener('click', this.optionsBarHide);
  }

  updateVisibility() {
    if (
      Selection.current.isCollapsed &&
      Selection.current.anchorNode.nodeType === 1 &&
      Selection.current.anchorNode.childNodes.length <= 1
    ) {
      if (this.creator.classList.contains('is-visible')) return;
      this.creatorCallback = () => {
        this.updatePosition(Selection.current.anchorNode, this.creator);
      };
      this.creator.classList.add('is-visible');
      this.creator.classList.remove('is-hidden');
      this.updatePosition(Selection.current.anchorNode, this.creator);
      window.addEventListener('scroll', this.creatorCallback);
      return;
    }
    this.creator.classList.remove('is-visible');
    this.creator.classList.remove('is-active');
    this.creator.classList.add('is-hidden');
    window.removeEventListener('scroll', this.creatorCallback);
  }

  updatePosition(reference, element, mode = 'center') {
    console.log(reference, element);
    debounce(
      (() => {
        if (typeof reference.getBoundingClientRect !== 'function') return;
        const rect = reference.getBoundingClientRect();
        element.style.top = mode === 'center'
          ? `${rect.top + (rect.height / 2)}px`
          : `${rect.top - 40}px`;
      })()
    );
  }

  toggleState() {
    this.creator.classList.toggle('is-active');
  }

  toggleClass(className, otherClasses) {
    console.log(this.currentItem);
    if (!this.currentItem) return;
    const prefixedClasses = otherClasses.map(cls => `is-${cls}`);
    this.currentItem.classList.remove(...prefixedClasses);
    this.currentItem.classList.add(className);
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
    img.classList.add('align-image');
    caption.innerText = 'Caption here';
    figure.classList.add('align-figure', 'is-normal');
    figure.appendChild(img);
    figure.appendChild(caption);
    figure.addEventListener('click', () => this.showOptionsBar(figure));
    reader.addEventListener('load', () => {
      img.src = reader.result;
      img.dataset.alignFilename = file.name;
    });
    selectedElement.parentNode.insertBefore(figure, selectedElement);
    reader.readAsDataURL(file);
    input.value = null;
  }
}

export default Creator;
