import { updatePosition, isElementClosest } from './partial/util';
import { setElementsPrefix, menuButton } from './partial/elements';

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
    this.el.appendChild(
      menuButton('figureNormal', () => this.toggleClass('is-normal', options))
    );
    this.el.appendChild(
      menuButton('figureFull', () => this.toggleClass('is-full', options))
    );
    this.el.appendChild(
      menuButton('figureFloat', () => this.toggleClass('is-float', options))
    );
    this.el.appendChild(menuButton('delete', this.removeCurrentItem.bind(this)));
    this.$align.el.appendChild(this.el);
  }

  active(item) {
    // if (this.el.classList.contains('is-visible')) return;

    this.currentItem = item;
    this.currentItem.classList.add('is-active');
    this.el.classList.add('is-visible');
    this.el.classList.remove('is-hidden');
    updatePosition(this.currentItem, this.el, this.$align.el, 'center-top');
    this.clickCallback = this.deactivate.bind(this);
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
    document.removeEventListener('click', this.clickCallback);
  }

  toggleClass(className, otherClasses) {
    if (!this.currentItem) return;
    const prefixedClasses = otherClasses.map(cls => `is-${cls}`);
    this.currentItem.classList.remove(...prefixedClasses);
    this.currentItem.classList.add(className);
    updatePosition(this.currentItem, this.el, 'center-top');
    this.$align.update();
  }

  removeCurrentItem() {
    this.currentItem.remove();
    this.deactivate();
  }
}

export default optionsBar;
