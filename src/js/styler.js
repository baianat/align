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
    this.cmds = {};
    this.inits = {};

    this.settings.commands.forEach((el) => {
      const li = document.createElement('li');
      const cmd = typeof el === 'string' ? el : Object.keys(el)[0];
      const cmdSchema = commands[cmd];
      if (!cmdSchema) {
        console.warn(cmd + ' is not found');
        return;
      }

      const callBack = (cmdSchema, value) => {
        if (cmdSchema.command) {
          this.execute(cmdSchema.command, value);
        }
        if (typeof cmdSchema.func === 'string') {
          this.align[cmdSchema.func](this, value);
        }
        if (typeof cmdSchema.func === 'function') {
          cmdSchema.func(this, value);
        }
      }

      switch (cmdSchema.element) {
        case 'button':
          this.cmds[cmd] = button(cmd, icons[cmd]);
          this.cmds[cmd].addEventListener('click', () => callBack(cmdSchema, cmdSchema.value));
          li.appendChild(this.cmds[cmd]);
          break;

        case 'select':
          const selectWrapper = select(cmd, el[cmd]);
          const temp = this.cmds[cmd] = selectWrapper.querySelector('select');
          temp.addEventListener('change', 
            () => callBack(cmdSchema, temp[temp.selectedIndex].value)
          );
          li.appendChild(selectWrapper);
          break;

        case 'input':
          this.cmds[cmd] = input(cmd, cmdSchema.type);
          this.cmds[cmd].addEventListener('change', () => {
            callBack(cmdSchema, this.cmds[cmd].value)
          });
          li.appendChild(this.cmds[cmd]);
          break;

        case 'styling':
          li.classList.add(cmdSchema.class);
          break;

        case 'custom':
          const markup = cmdSchema.create();
          li.appendChild(markup);
          break;

        default:
          console.warn(cmd + ' element not found');
      }

      if (typeof cmdSchema.init === 'function') {
        this.inits[cmd] = cmdSchema.init = new cmdSchema.init(this.cmds[cmd], cmdSchema.initConfig);
      }

      if (typeof cmdSchema.init === 'string') {
        this.align[cmdSchema.init](cmdSchema, el);
      }

      this.styler.appendChild(li);
    })
    this.align.el.appendChild(this.styler);
    if (this.settings.mode === 'bubble') this.initBubble();
  }

  initBubble() {
    this.styler.classList.add('is-hidden');
    window.addEventListener('scroll', debounce(this.updateBubblePosition.bind(this)));
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
    Selection.updateSelectedRange();
    this.updateStylerStates();
  }

  updateBubblePosition() {
    if (!Selection.selectedRange) return;
    const marginRatio = 10;
    const selectionRect = Selection.selectedRange.getBoundingClientRect();
    const editorRect = this.align.el.getBoundingClientRect();
    const stylerRect = this.styler.getBoundingClientRect();

    const scrolled = window.scrollY;
    const deltaY = selectionRect.top + scrolled - stylerRect.height - marginRatio;
    const deltaX = selectionRect.left + ((selectionRect.width - stylerRect.width) / 2);
    const startBoundary = editorRect.left;
    const endBoundary = editorRect.left + editorRect.width - stylerRect.width;
    const xPosition = normalizeNumber(deltaX, startBoundary, endBoundary);
    const yPosition = deltaY < scrolled + 50
    ? selectionRect.top + selectionRect.height + marginRatio 
    : selectionRect.top - stylerRect.height - marginRatio;
    
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

    if (Selection.selectedRange.collapsed) {
      this.hideStyler();
      return;
    }
    this.showStyler();
  };

  /**
   * Update the state of the active style
   */
  updateStylerCommands() {
    Object.keys(this.cmds).forEach((cmd) => {
      const command = this.cmds;
      console.log(command);
      if (document.queryCommandState(command)) {
        this.cmds[cmd].classList.add('is-active');
        return;
      }
      if (document.queryCommandValue('formatBlock') === command) {
        this.cmds[cmd].classList.add('is-active');
        return;
      }
      this.cmds[cmd].classList.remove('is-active');
      if (document.queryCommandValue(command)) {
        this.cmds[cmd].value = document.queryCommandValue(cmd);
      }
    })
  }
}

export default Styler;
