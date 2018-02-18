import { updatePosition, camelCase } from './partial/util';
import { setElementsPrefix, button, fileButton, menuButton } from './partial/elements';
import OptionsBar from './optionsBar';
import Selection from './selection';

class Creator {
  constructor(align, {
    mode = 'default',
    items = ['figure', 'section']
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

    this.settings.items.forEach(item => {
      const menuItem = document.createElement('li');
      const button = fileButton(item);
      button.input.addEventListener('change', this[`create${camelCase(item)}`].bind(this));
      menuItem.appendChild(button.el);
      this.menu.appendChild(menuItem);
    })

    this.creator.appendChild(this.toggleButton);
    this.creator.appendChild(this.menu);
    this.$align.el.appendChild(this.creator);
  }

  update() {
    if (
      Selection.current.isCollapsed &&
      Selection.current.anchorNode.nodeType === 1 &&
      Selection.current.anchorNode.childNodes.length <= 1
    ) {
      updatePosition(Selection.current.anchorNode, this.creator, 'middle-left');
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
    });
    reader.readAsDataURL(file);
    input.value = null;
    selectedElement.parentNode.insertBefore(figure, selectedElement);
  }

  getPreviousSiblings(element) {
    let results = []
    while (element.previousSibling) {
      element = element.previousSibling;
      results.push(element);
    }
    return results;
  }

  getNextSiblings(element) {
    let results = []
    while (element.nextSibling) {
      element = element.nextSibling;
      results.push(element);
    }
    return results;
  }

  createSection(event) {
    const input = event.target;
    const file = input.files[0];
    if (!file || !Selection.current) return;
    const reader = new FileReader(); // eslint-disable-line

    const selectedElement = Selection.current.anchorNode;
    const nextDiv = document.createElement('div');
    const section = document.createElement('div');
    const sectionContent = document.createElement('p');
    const next = this.getNextSiblings(selectedElement);

    sectionContent.dataset.defaultValue = 'Write content';
    section.classList.add('align-section', 'is-full', 'is-image');
    nextDiv.classList.add('align-section');
    section.appendChild(sectionContent);
    nextDiv.append(...next);

    reader.addEventListener('load', () => {
      section.style.backgroundImage = `url(${reader.result})`;
      this.$align.update();
    });
    reader.readAsDataURL(file);
    input.value = null;
    this.$align.editor.appendChild(section);
    this.$align.editor.appendChild(nextDiv);
  }
}

export default Creator;
