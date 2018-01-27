import { normalizeNumber, debounce } from './util';
import { setElementsPrefix, button, select, input } from './elements';
import commands from './commands';
import icons from './icons';
import Selection from './selection';

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

          const callBack = () => {
            if (current.command) {
              this.execute(current.command, current.value);
            }
            if (typeof current.func === 'string') {
              this.align[current.func](current.value);
            }
            if (typeof current.func === 'function') {
              current.func(current.value);
            }
          }

          this.style[el].addEventListener('click', callBack);
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
    if (this.settings.mode === 'creator') this.initCreator();
  }

  initBubble() {
    this.styler.classList.add('is-hidden');
    this.reference = document.createElement('sapn');
    this.selection = '';
    window.addEventListener('scroll', debounce(this.updateBubblePosition.bind(this)));
  }

  initCreator() {}
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
    const marginRatio = 10;
    const selectionRect = this.selection.getBoundingClientRect();
    const editorRect = this.align.el.getBoundingClientRect();
    const stylerRect = this.styler.getBoundingClientRect();
    const scrolled = window.scrollY;
    const deltaY = selectionRect.y + scrolled - stylerRect.height - marginRatio;
    const deltaX = selectionRect.x + ((selectionRect.width - stylerRect.width) / 2);
    const startBoundary = editorRect.x;
    const endBoundary = editorRect.x + editorRect.width - stylerRect.width;
    const xPosition = normalizeNumber(deltaX, startBoundary, endBoundary);
    const yPosition = deltaY < scrolled + 50
      ? selectionRect.y + selectionRect.height + marginRatio 
      : selectionRect.y - stylerRect.height - marginRatio;

    this.styler.style.top = `${yPosition}px`;
    this.styler.style.left = `${xPosition}px`;
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
