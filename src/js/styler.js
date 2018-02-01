import { normalizeNumber, debounce } from './util';
import { setElementsPrefix, button, select, input } from './elements';
import cmdsSchemas from './cmdsSchemas';
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

    this.settings.commands.forEach((el) => {
      const li = document.createElement('li');
      const cmd = typeof el === 'string' ? el : Object.keys(el)[0];
      const cmdSchema = cmdsSchemas[cmd];
      if (!cmdSchema) {
        console.warn(cmd + ' is not found');
        return;
      }

      const currentCmd = this.cmds[cmd] = { schema: cmdSchema };

      switch (cmdSchema.element) {
        case 'button':
          currentCmd.el = button(cmd, icons[cmd]);
          currentCmd.el.addEventListener('click', () => this.cmdCallback(cmdSchema, cmdSchema.value));
          li.appendChild(currentCmd.el);
          break;

        case 'select':
          const selectWrapper = select(cmd, el[cmd]);
          const temp = currentCmd.el = selectWrapper.querySelector('select');
          temp.addEventListener('change', 
            () => this.cmdCallback(cmdSchema, temp[temp.selectedIndex].value)
          );
          li.appendChild(selectWrapper);
          break;

        case 'input':
          currentCmd.el = input(cmd, cmdSchema.type);
          currentCmd.el.addEventListener('change', () => {
            this.cmdCallback(cmdSchema, currentCmd.el.value)
          });
          li.appendChild(currentCmd.el);
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
        cmdSchema.init = new cmdSchema.init(currentCmd.el, cmdSchema.initConfig);
      }

      if (typeof cmdSchema.init === 'string') {
        this.align[cmdSchema.init](cmdSchema, el);
        cmdSchema.init = null;
      }

      this.styler.appendChild(li);
    })
    this.align.el.appendChild(this.styler);
    if (this.settings.mode === 'bubble') this.initBubble();
  }

  cmdCallback(cmdSchema, value) {
    if (cmdSchema.command) {
      this.execute(cmdSchema.command, value, cmdSchema.useCSS);
    }
    if (typeof cmdSchema.func === 'string') {
      this.align[cmdSchema.func](this, value);
    }
    if (typeof cmdSchema.func === 'function') {
      cmdSchema.func(this, value);
    }
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
  execute(cmd, value, useCSS = false) {
    this.align.execute(...arguments);
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
      const currentCmd = this.cmds[cmd];
      const command = currentCmd.schema.command;
      const value = currentCmd.schema.value;
      const init = currentCmd.schema.init;
      if (!command) {
        return;
      }
      if (document.queryCommandState(command)) {
        currentCmd.el.classList.add('is-active');
        return;
      }
      if (document.queryCommandValue(command) === value) {
        currentCmd.el.classList.add('is-active');
        return;
      }
      if (init) {
        init.selectColor(document.queryCommandValue(command), true);
        return;
      }
      if (document.queryCommandValue(command)) {
        currentCmd.el.value = document.queryCommandValue(command);
      }
      currentCmd.el.classList.remove('is-active');
    })
  }
}

export default Styler;
