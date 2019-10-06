import {
  updatePosition
} from '../partial/utils';
import {
  setElementsPrefix,
  button
} from '../partial/elements';
import components from '../components/_index';
import Selection from '../partial/selection';

export default class Inserter {
  constructor (align, settings) {
    this.$align = align;
    this.settings = {
      ...settings
    };
    this._init();
    this.hide();
  }

  /**
   * Create the styler toolbar
   */
  _init () {
    setElementsPrefix('inserter-');
    this.el = document.createElement('div');
    this.menu = document.createElement('div');
    this.list = document.createElement('ul');
    this.toggleButton = button('inserter-toggle', 'plus');

    this.el.classList.add('inserter');
    this.menu.classList.add('inserter-menu');
    this.list.classList.add('inserter-list');
    this.toggleButton.classList.add('inserter-plus');

    this.menu.appendChild(this.list);
    this.el.appendChild(this.toggleButton);
    this.el.appendChild(this.menu);

    this.visible = false;

    this.$align.wrapper.appendChild(this.el);
    this.toggleButton.addEventListener('click', this.active.bind(this));
    this._initComponents();
  }

  _initComponents () {
    this.components = Object.keys(components);
    this.components.forEach(name => {
      const li = document.createElement('li');
      const title = document.createElement('span');
      const cmdSchema = components[name].schema;
      const icon = cmdSchema.icon;
      const el = button(name, icon);
      el.addEventListener('click', () => {
        this.$align.addElement(components[name]);
      });
      el.appendChild(title);
      li.appendChild(el);
      title.innerText = name;
      this.list.appendChild(li);
    });
  }

  update (newPosition) {
    if (
      Selection.range &&
      Selection.range.collapsed &&
      Selection.range.startContainer.nodeType === 1 &&
      Selection.range.startContainer.childNodes.length <= 1 &&
      Selection.range.startContainer.closest('p')
    ) {
      this.position = updatePosition(
        Selection.range.startContainer,
        this.el,
        newPosition || this.settings.position);
      this.show();
      this.updateDirection();
      return;
    }
    this.hide();
  }

  active () {
    this.el.classList.toggle('is-active');
    this.updateDirection();
  }

  toggleVisibility () {
    if (this.visible) {
      this.hide();
      return;
    }
    this.show();
  }

  updateDirection () {
    this.menu.classList.remove('is-down');
    const top = this.menu.getBoundingClientRect().top;
    if (top <= 0) {
      this.menu.classList.add('is-down');
    }
  }

  show () {
    this.el.classList.add('is-visible');
    this.el.classList.remove('is-hidden');
    this.visible = true;
  }

  hide () {
    this.el.classList.remove('is-visible');
    this.el.classList.remove('is-active');
    this.el.classList.add('is-hidden');
    this.visible = false;
  }

  remove () {
    setTimeout(() => {
      this.el.remove();
    }, 1);
  }
}
