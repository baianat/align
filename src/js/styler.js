import { normalizeNumber, debounce } from './util';
import { setElementsPrefix, button, select, input } from './elements';
import commands from './commands';
import icons from './icons';

class Styler {
  constructor(align, {
    mode = 'default',
    commands = ['bold', 'italic', 'underline']
  } = {}) {
    this.align = align;
    this.settings = {
      mode,
      commands
    };
    this.init();
  }

  /**
   * Create the styler toolbar
   */
  init() {
    setElementsPrefix('styler-');
    this.styler = document.createElement('ul');
    this.styler.classList.add('styler', `is-${this.settings.mode}`);
    this.style = {};
    this.inits = {};

    this.settings.commands.forEach((el) => {
      const li = document.createElement('li');
      const current = commands[el];
      if (!current) {
        console.warn(el + ' is not found');
        return;
      }

      switch (current.element) {
        case 'button':
          this.style[el] = button(el, icons[el]);
          // some buttons don't have commands
          // instead it use functions form align class
          // here we detect which callback should be use
          const callBack =
            current.command
              ? this.execute.bind(this)
              : this.align[current.func].bind(this.align);

          this.style[el].addEventListener('click', () => {
            callBack(current.command, current.value);
          });
          li.appendChild(this.style[el]);
          break;

        case 'select':
          this.style[el] = select(el, current.options);
          this.style[el].addEventListener('change', () => {
            const selection = this.style[el];
            this.execute(current.command, selection[selection.selectedIndex].value);
          });
          li.appendChild(this.style[el]);
          break;
        case 'input':
          this.style[el] = input(el, current.type);
          this.style[el].addEventListener('change', () => {
            this.execute(current.command, this.style[el].value);
          });
          li.appendChild(this.style[el]);
          break;

        case 'styling':
          li.classList.add(current.class);
          break;

        case 'custom':
          const markup = current.create();
          li.appendChild(markup);
          break;

        default:
          console.warn(el + ' is not found');
      }

      if (current.init) {
        this.inits[el] = new current.init(this.style[el], current.initConfig);
      }

      this.styler.appendChild(li);
    })
    this.align.el.appendChild(this.styler);
    if (this.settings.mode === 'bubble') this.initBubble();
  }

  initBubble() {
    this.styler.classList.add('is-hidden');
    this.reference = document.createElement('sapn');
    this.selection = '';
    window.addEventListener('scroll', debounce(this.updateBubblePosition.bind(this)))
  }
  /**
   * Execute command for the selected button
   * @param {String} cmd
   * @param {String|Number} value
   */
  execute(cmd, value) {
    if (this.align.HTML) return;
    document.execCommand(cmd, false, value);
    this.align.el.focus();
    this.updateStylerStates();
  }

  updateBubblePosition() {
    if (!this.selection) return;
    const selectionRect = this.selection.getBoundingClientRect();

    const editorRect = this.align.el.getBoundingClientRect();
    const stylerRect = this.styler.getBoundingClientRect();
    const scrolled = window.scrollY;
    const deltaY = selectionRect.y + ((selectionRect.height - stylerRect.height) / 2);
    const deltaX = selectionRect.x + ((selectionRect.width - stylerRect.width) / 2)

    this.styler.style.top = `${deltaY}px`;
    this.styler.style.transform = `translate3d(0, ${deltaY - 70 < scrolled ? 70 : -70}px, 0)`;
    this.styler.style.left = `${normalizeNumber(deltaX, editorRect.x, editorRect.width - stylerRect.width)}px`
  }

  showStyler() {
    this.styler.classList.add('is-visible');
    this.styler.classList.remove('is-hidden');
    this.updateBubblePosition();
  }

  hideStyler() {
    this.styler.classList.remove('is-visible');
    this.styler.classList.add('is-hidden');
  }

  updateStylerStates() {
    this.updateStylerCommands();
    if (this.settings.mode !== 'bubble') return;

    this.selection = window.getSelection().getRangeAt(0);
    if (this.selection.collapsed) {
      this.hideStyler();
      return;
    }
    this.showStyler();
  };

  /**
   * Update the state of the active style
   */
  updateStylerCommands() {
    Object.keys(this.style).forEach((styl) => {
      if (document.queryCommandState(styl)) {
        this.style[styl].classList.add('is-active');
        return;
      }
      if (document.queryCommandValue('formatBlock') === styl) {
        this.style[styl].classList.add('is-active');
        return;
      }
      if (document.queryCommandValue(styl) && document.queryCommandValue(styl) !== 'false') {
        this.style[styl].value = document.queryCommandValue(styl);
        return;
      }

      this.style[styl].classList.remove('is-active');
    })
  }
}

export default Styler;
