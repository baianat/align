import formats from './formats';

class styler {

  constructor(editor, options) {
    this.el = editor;
    this.options = options;
    this.init();
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

  static input(name, type) {
    const input = document.createElement('input');
    input.classList.add(`styler-${name}`);
    input.id = name;
    input.type = type;
    return input;
  }

  init() {
    this.container = document.createElement('ul');
    this.container.classList.add('styler');
    this.style = {};
    this.HTML = false;
    document.body.insertBefore(this.container, this.el);

    this.options.forEach((el) => {
      const li = document.createElement('li');
      const current = formats[el];
      if (!current) {
        console.warn(el + ' is not found');
        return;
      }

      if (current.element === 'button') {
        this.style[el] = styler.button(el);
        const callBack = current.command ? this.execute : this[current.func];
        this.style[el].addEventListener('click', () => {
          callBack.call(this, current.command, current.value);
        });
        li.appendChild(this.style[el]);
      }

      if (current.element === 'select') {
        this.style[el] = styler.select(el, current.options);
        this.style[el].addEventListener('change', () => {
          const selection = this.style[el];
          this.execute(current.command, selection[selection.selectedIndex].value);
        });
        li.appendChild(this.style[el]);
      }

      if (current.element === 'input') {
        this.style[el] = styler.input(el, current.type);
        this.style[el].addEventListener('input', () => {
          this.execute('forecolor', this.style[el].value)
        });
        li.appendChild(this.style[el]);
      }

      if (current.element === 'styling') {
        li.classList.add(current.class);
      }

      if (current.element === 'custom') {
        const markup = current.create();
        li.appendChild(markup);
      }

      this.container.appendChild(li);
    })
  }

  execute(cmd, value) {
    if (this.HTML) return;
    document.execCommand(cmd, false, value);
    this.el.focus();
    this.updateStylerStates();
  }

  updateStylerStates() {
    Object.keys(this.style).forEach((styl) => {
      console.log(document.queryCommandState('formatblock'));
      if (document.queryCommandState(String(styl))) {
        this.style[styl].classList.add('is-active');
      } else {
        this.style[styl].classList.remove('is-active');
      }
    })
  }

  toggleHTML() {
    this.HTML = !this.HTML;
    if (this.HTML) {
      const content = document.createTextNode(this.el.innerHTML);
      const pre = document.createElement("pre");

      this.el.innerHTML = "";
      this.el.contentEditable = false;
      pre.id = "content";
      pre.contentEditable = false;
      pre.appendChild(content);
      this.el.appendChild(pre);
      return;
    }
    this.el.innerHTML = this.el.innerText;
    this.el.contentEditable = true;
    this.el.focus();
  }
}

export default styler;