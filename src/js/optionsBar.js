import { debounce, updatePosition, isElementClosest, camelCase } from './partial/util';
import { setElementsPrefix, button } from './partial/elements';
import icons from './partial/icons';

class optionsBar {
  constructor(align) {
    this.$align = align;
    this._init();
  }

  _init() {
    setElementsPrefix('creator-');
    this.el = document.createElement('ul');
    this.el.classList.add('creator-optionsBar', 'is-hidden');

    const options = ['normal', 'full', 'float'];
    options.forEach(option => {
      const menuItem = document.createElement('li');
      const currentButton = button(option, icons[`figure${camelCase(option)}`]);
      currentButton.addEventListener('click', () => this.toggleClass(`is-${option}`, options));
      menuItem.appendChild(currentButton);
      this.el.appendChild(menuItem);
    })

    const menuItem = document.createElement('li');
    const currentButton = button('delete', icons['delete']);
    currentButton.addEventListener('click', this.removeCurrentItem.bind(this));
    menuItem.appendChild(currentButton);
    this.el.appendChild(menuItem);

    this.$align.el.appendChild(this.el);
  }

  active(item) {
    if (this.el.classList.contains('is-visible')) return;

    this.currentItem = item;
    this.currentItem.classList.add('is-active');
    this.el.classList.add('is-visible');
    this.el.classList.remove('is-hidden');
    updatePosition(this.currentItem, this.el, 'top');
    this.scrollCallback = () => {
      debounce(updatePosition(this.currentItem, this.el, 'top'));
    };
    this.clickCallback = this.deactivate.bind(this);
    window.addEventListener('scroll', this.scrollCallback);
    document.addEventListener('click', this.clickCallback);
  }

  deactivate(event) {
    if (
      event &&
      (isElementClosest(event.target, this.currentItem) ||
       isElementClosest(event.target, this.el))
    ) return;

    this.currentItem.classList.remove('is-active');
    this.currentItem = null;
    this.el.classList.remove('is-visible');
    this.el.classList.add('is-hidden');
    window.removeEventListener('scroll', this.elScroll);
    document.removeEventListener('click', this.clickCallback);
  }

  toggleClass(className, otherClasses) {
    if (!this.currentItem) return;
    const prefixedClasses = otherClasses.map(cls => `is-${cls}`);
    this.currentItem.classList.remove(...prefixedClasses);
    this.currentItem.classList.add(className);
    this.$align.update();
  }

  removeCurrentItem() {
    this.currentItem.remove();
    this.deactivate();
  }
}

export default optionsBar;
