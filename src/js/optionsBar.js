import Colorpicker from '@baianat/colorpicker';
import { updatePosition, isElementClosest, camelCase } from './partial/util';
import { setElementsPrefix, menuButton, fileButton, input } from './partial/elements';

class OptionsBar {
  constructor(align, {
    element = 'figure',
    options = ['normal', 'full', 'float'],
    position = 'center-top',
    afterDelete = null,
    backgroundImage = false,
    backgroundColor = false,
    toggleHTML = false,
    sorting = false
  } = {}) {
    this.$align = align;
    this.element = element;
    this.options = options;
    this.afterDelete = afterDelete;
    this.settings = {
      position,
      backgroundImage,
      backgroundColor,
      toggleHTML,
      sorting
    }
    this.visiable = false;
    this._init();
  }

  _init() {
    setElementsPrefix('optionsBar-');
    this.el = document.createElement('ul');
    this.el.classList.add('optionsBar', 'is-hidden');

    if (this.settings.sorting) {
      this.el.appendChild(
        menuButton('arrowUp', () => this.sectionUp())
      );
      this.el.appendChild(
        menuButton('arrowDown', () => this.sectionDown())
      );
    }

    this.options.forEach(option => {
      this.el.appendChild(
        menuButton(`${this.element}${camelCase(option)}`, () => this.toggleClass(`is-${option}`))
      );
    });
    
    if (this.settings.backgroundImage) {
      const li = document.createElement('li');
      const bgImage = fileButton('image');
      bgImage.input.addEventListener('change', this.backgroundImage.bind(this));
      li.appendChild(bgImage.el)
      this.el.appendChild(li);
    }

    if (this.settings.backgroundColor) {
      const li = document.createElement('li');
      const bgColor = input('bgColor', 'text');
      const _self = this;
      li.appendChild(bgColor);
      this.el.appendChild(li);
    
      this.picker = new Colorpicker(bgColor, {
        defaultColor: '#000000',
        mode: 'hex',
        disableLum: true,
        guideIcon: `
          <svg viewBox="0 0 24 24">
            <path d="M0 20h24v4H0z"/>
            <path style="fill: #000" d="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z"/>
          </svg>
        `,
        events: {
          afterSelect() {
            if (!_self.currentContent) return;
            _self.currentContent.style.backgroundColor = bgColor.value;
          }
        }
      })
    }
  
    if (this.settings.toggleHTML) {
      this.el.appendChild(
        menuButton(`html`, () => this.toggleHTML())
      );
    }
    
    this.el.appendChild(menuButton('delete', this.removeCurrentItem.bind(this)));
    this.$align.el.appendChild(this.el);
  }

  active(item, index) {
    if (this.currentItem) {
      this.currentItem.classList.remove('is-active');
    }
    this.currentItem = item;
    this.currentIndex = index || 0;
    this.currentContent = item.querySelector('.align-content');
    this.currentItem.classList.add('is-active');
    
    updatePosition(this.currentItem, this.el, this.$align.el, this.settings.position);
    this.$align.update();
    if (this.visiable) return
    this.visiable = true;
    this.el.classList.add('is-visible');
    this.el.classList.remove('is-hidden');
    this.clickCallback = this.deactivate.bind(this);
    document.addEventListener('click', this.clickCallback);
  }

  deactivate(event) {
    if (
      event &&
      (isElementClosest(event.target, this.currentItem) ||
       isElementClosest(event.target, this.el))
    ) return;

    this.visiable = false;
    this.currentItem.classList.remove('is-active');
    this.currentItem = null;
    this.el.classList.remove('is-visible');
    this.el.classList.add('is-hidden');
    document.removeEventListener('click', this.clickCallback);
  }

  toggleClass(className) {
    if (!this.currentItem) return;
    const prefixedClasses = this.options.map(cls => `is-${cls}`);
    this.currentItem.classList.remove(...prefixedClasses);
    this.currentItem.classList.add(className);
    updatePosition(this.currentItem, this.el, this.$align.el, this.settings.position);
    this.$align.update();
  }

  toggleHTML() {
    if (this.currentContent.firstElementChild.tagName !== 'PRE') {
      const content = document.createTextNode(this.currentContent.innerHTML);
      const pre = document.createElement('pre');

      this.currentContent.innerHTML = '';
      pre.id = 'content';
      pre.style.whiteSpace = 'pre-wrap';
      pre.appendChild(content);
      this.currentContent.appendChild(pre);
      this.$align.highlight();
      return;
    }
    this.currentContent.innerHTML = this.currentContent.innerText;
    this.currentContent.contentEditable = true;
    this.currentContent.focus();
  }

  backgroundImage (event) {
    const input = event.target;
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader(); // eslint-disable-line
    const bg = this.currentContent.querySelector('.align-bgImage') ||
              document.createElement('div');
    if (!this.currentContent.querySelector('.align-bgImage')) {
      bg.classList.add('align-bgImage');
      this.currentContent.insertAdjacentElement('afterBegin', bg);
    }
    reader.addEventListener('load', () => {
      this.currentItem.classList.add('is-bgImage');
      bg.style.backgroundImage = `url(${reader.result})`;
      this.$align.update();
    });
    reader.readAsDataURL(file);
    input.value = null;
  }

  sectionUp () {
    if (!this.currentItem.previousSibling.classList.contains('align-section')) return;
    this.$align.editor.insertBefore(this.currentItem, this.currentItem.previousSibling);
    updatePosition(this.currentItem, this.el, this.$align.el, this.settings.position);
  }

  sectionDown () {
    if (!this.currentItem.nextSibling) return;
    this.$align.editor.insertBefore(this.currentItem, this.currentItem.nextSibling.nextSibling);
    updatePosition(this.currentItem, this.el, this.$align.el, this.settings.position);
  }
  removeCurrentItem () {
    this.currentItem.remove();
    this.deactivate();
  }
}

export default OptionsBar;
