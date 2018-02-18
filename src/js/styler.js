import { normalizeNumber, debounce, cloneObject } from './partial/util';
import { setElementsPrefix, button, select, input } from './partial/elements';
import cmdsSchema from './partial/cmdsSchema';
import Selection from './selection';

class Styler {
  constructor(align, {
    mode = 'default',
    commands = ['bold', 'italic', 'underline'],
    tooltip = false,
    theme = 'light'
  } = {}) {
    this.$align = align;
    this.settings = {
      mode,
      commands,
      tooltip,
      theme
    }
    this.init();
  }

  /**
   * Create the styler toolbar
   */
  init() {
    setElementsPrefix('styler-');
    this.cmdsSchema = cloneObject(cmdsSchema);
    this.styler = document.createElement('ul');
    this.styler.classList.add('styler', `is-${this.settings.mode}`, `is-${this.settings.theme}`);
    this.cmds = {};

    this.settings.commands.forEach((command) => {
      const li = document.createElement('li');
      const cmd = typeof command === 'string' ? command : Object.keys(command)[0];
      const cmdSchema = this.cmdsSchema[cmd];
      if (!cmdSchema) {
        console.warn(cmd + ' is not found');
        return;
      }

      const currentCmd = this.cmds[cmd] = { schema: cmdSchema };

      switch (cmdSchema.element) {
        case 'button':
          currentCmd.el = button(cmd, this.getTooltip(cmdSchema));
          currentCmd.el.addEventListener('click', () => this.cmdCallback(cmdSchema, cmdSchema.value));
          li.appendChild(currentCmd.el);
          break;

        case 'select':
          const selectWrapper = select(cmd, command[cmd]);
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
          const markup = cmdSchema.create(this);
          li.appendChild(markup);
          break;

        default:
          console.warn(cmd + ' element not found');
      }

      if (typeof cmdSchema.init === 'function') {
        cmdSchema.init = new cmdSchema.init(currentCmd.el, cmdSchema.initConfig); // eslint-disable-line
      }

      if (typeof cmdSchema.init === 'string') {
        this.$align[cmdSchema.init](cmdSchema, command);
        cmdSchema.init = null;
      }

      this.styler.appendChild(li);
    })
    this.$align.el.appendChild(this.styler);
    if (this.settings.mode === 'bubble') this.initBubble();
  }

  cmdCallback(cmdSchema, value) {
    if (cmdSchema.command) {
      this.execute(cmdSchema.command, value, cmdSchema.useCSS);
    }
    if (typeof cmdSchema.func === 'string') {
      this.$align[cmdSchema.func](this, value);
    }
    if (typeof cmdSchema.func === 'function') {
      cmdSchema.func(this, value);
    }
  }

  initBubble() {
    this.styler.classList.add('is-hidden');
    this.bubbleScrollCallback = debounce(this.updateBubblePosition.bind(this));
  }

  /**
   * Execute command for the selected button
   * @param {String} cmd
   * @param {String|Number} value
   */
  execute(cmd, value, useCSS = false) {
    this.$align.execute(...arguments);
  }

  updateBubblePosition() {
    if (!Selection.textRange) return;
    const marginRatio = 10;
    const threshold = 70;
    const selectionRect = Selection.textRange.getBoundingClientRect();
    const editorRect = this.$align.el.getBoundingClientRect();
    const stylerRect = this.styler.getBoundingClientRect();

    const deltaY = selectionRect.top - stylerRect.height - marginRatio;
    const deltaX = selectionRect.left + ((selectionRect.width - stylerRect.width) / 2);
    const startBoundary = editorRect.left;
    const endBoundary = editorRect.left + editorRect.width - stylerRect.width;
    const xPosition = normalizeNumber(deltaX, startBoundary, endBoundary);
    const yPosition = deltaY < threshold
      ? selectionRect.top + selectionRect.height + marginRatio : deltaY;

    if (yPosition < threshold) {
      this.styler.style.opacity = 0;
      return;
    }
    this.styler.style.opacity = 1;
    this.styler.style.top = `${yPosition}px`;
    this.styler.style.left = `${xPosition}px`;
  }

  showStyler() {
    this.styler.classList.add('is-visible');
    this.styler.classList.remove('is-hidden');
    if (this.settings.mode === 'bubble') {
      this.updateBubblePosition();
      window.addEventListener('scroll', this.bubbleScrollCallback);
    }
  }

  hideStyler() {
    this.styler.classList.remove('is-visible');
    this.styler.classList.add('is-hidden');
    if (this.settings.mode === 'bubble') {
      window.removeEventListener('scroll', this.bubbleScrollCallback);
    }
  }

  updateStyler() {
    this.updateStylerCommandsStates();
    if (this.settings.mode !== 'bubble') return;

    if (Selection.textRange.collapsed || Selection.range.collapsed) {
      this.hideStyler();
      return;
    }
    this.showStyler();
  };

  getTooltip(schema) {
    if (!schema.tooltip || !this.settings.tooltip) {
      return false;
    }
    return this.$align.settings.shortcuts ? schema.tooltip : schema.tooltip.replace(/(\([^)]+\))/g, '');
  }

  /**
   * Update the state of the active style
   */
  updateStylerCommandsStates() {
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
        if (Selection.range === Selection.textRange) {
          init.selectColor(document.queryCommandValue(command), true);
        }
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
