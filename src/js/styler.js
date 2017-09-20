import formats from './formats';

class styler {
  constructor(editor, options) {
    this.el = editor;
    this.options = options;
    this.init();
  }

  init() {
    this.container = document.createElement('ul');
    this.container.classList.add('styler');
    this.style = {};
    document.body.insertBefore(this.container, this.el);
    this.options.forEach((format) => {
      const li = document.createElement('li');
      const current = formats[format];
      if (!current) return;

      if (current.type === 'button') {
        this.style[format] = styler.button(format);
        this.style[format].addEventListener('click', () => {
          this.execute(current.command, current.value);
        });
      }

      if (current.type === 'select') {
        this.style[format] = styler.select(format, current.options);
        this.style[format].addEventListener('change', () => {
          const selection = this.style[format];
          this.execute(current.command, selection[selection.selectedIndex].value);
        });
      }

      if (current.type === 'styling') {
        li.classList.add(current.class);
        this.container.appendChild(li);
        return;
      }

      li.appendChild(this.style[format]);
      this.container.appendChild(li);
    })
  }

  execute(cmd, value) {
    // if (this.HTML) return;
    document.execCommand(cmd, false, value);
    this.el.focus();
    this.updateStylerStates();
  }

  updateStylerStates() {
    Object.keys(this.style).forEach((styl) => {
      if (document.queryCommandState(String(styl))) {
        this.style[styl].classList.add('is-active');
      } else {
        this.style[styl].classList.remove('is-active');
      }
    })
  }

  static button(name) {
    const button = document.createElement('button');
    button.classList.add('styler-button');
    button.id = name;
    button.insertAdjacentHTML('afterbegin', `
      <svg class="icon">
        <use xlink:href="dist/svg/symbols.svg#icon-${name}"></use>
      </svg>
    `);
    return button;
  }

  static select(name, options) {
    const select = document.createElement('select');
    const defaultOption = document.createElement('option');
    select.classList.add('styler-select');
    select.id = name;
    select.appendChild(defaultOption);
    defaultOption.innerText = name;
    options.forEach((option) => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.innerText = option.text;
      select.appendChild(optionElement);
    })
    return select;
  }
}

export default styler;