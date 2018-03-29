import { normalizeNumber, debounce, cloneObject, camelCase, isElementClosest } from './partial/util';
import { setElementsPrefix, button, select, input, menuButton, fileButton } from './partial/elements';
import cmdsSchema from './partial/cmdsSchema';
import Selection from './selection';

export default class Styler {
  constructor(align, {
    mode = 'default',
    commands = ['bold', 'italic', 'underline'],
    hideWhenClickOut = false,
    tooltip = false,
    theme = 'light'
  } = {}) {
    this.$align = align;
    this.settings = {
      mode,
      commands,
      hideWhenClickOut,
      tooltip,
      theme
    }
    this._init();
  }

  /**
   * Create the styler toolbar
   */
  _init () {
    setElementsPrefix('styler-');
    this.cmdsSchema = cloneObject(cmdsSchema);
    this.styler = document.createElement('ul');
    this.styler.classList.add('styler', `is-${this.settings.mode}`, `is-${this.settings.theme}`);
    this.cmds = {};
    this.visiable = false;

    this.settings.commands.forEach((command) => {
      this.generateCmdElement(command);
    })
    this.$align.el.appendChild(this.styler);
    if (this.settings.mode === 'bubble') this._initBubble();
  }

  _initBubble () {
    this.styler.classList.add('is-hidden');
    this.bubbleScrollCallback = debounce(this.updateBubblePosition.bind(this));
  }

  generateCmdElement(command) {
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

      case 'classes':
        currentCmd.el = document.createElement('ul');
        command[cmd].forEach(className => {
          const li = menuButton(`${cmdSchema.command}${camelCase(className)}`,
            () => { this.toggleClass(`is-${className}`, command[cmd]) },
            `${camelCase(cmdSchema.command)} ${className}`
          )
          currentCmd.el.appendChild(li);
        });
        li.appendChild(currentCmd.el);
        break;

      case 'file':
        const fileBtn = fileButton(cmd, this.getTooltip(cmdSchema));
        currentCmd.el = fileBtn.input;
        currentCmd.el.addEventListener('change', (event) => {
          this.cmdCallback(cmdSchema, event);
        })
        li.appendChild(fileBtn.el);
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
        currentCmd.el = input(cmd, cmdSchema.type, this.getTooltip(cmdSchema));
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
      const _self = this;
      cmdSchema.init = new cmdSchema.init(currentCmd.el, cmdSchema.initConfig); // eslint-disable-line
    }

    if (typeof cmdSchema.init === 'string') {
      this.$align[cmdSchema.init](cmdSchema, command);
      cmdSchema.init = null;
    }

    this.styler.appendChild(li);
  }

  cmdCallback(cmdSchema, value) {
    if (cmdSchema.command) {
      this.execute(cmdSchema.command, value, cmdSchema.useCSS);
    }
    if (typeof cmdSchema.func === 'string') {
      const callback = this.$align[cmdSchema.func] || this.currentItem[cmdSchema.func].bind(this.currentItem);
      callback(this, value);
    }
    if (typeof cmdSchema.func === 'function') {
      cmdSchema.func(this, value);
    }
    if (this.settings.mode === 'bubble') {
      this.updateBubblePosition();
    }
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
    if (!Selection.textRange && !this.currentItem) return;
    const marginRatio = 10;
    const threshold = 70;
    const element = this.currentItem ? this.currentItem.el : Selection.textRange;
    const elementRect = element.getBoundingClientRect();
    const editorRect = this.$align.el.getBoundingClientRect();
    const stylerRect = this.styler.getBoundingClientRect();

    const deltaY = elementRect.top - stylerRect.height - marginRatio;
    const deltaX = elementRect.left + ((elementRect.width - stylerRect.width) / 2);
    const startBoundary = editorRect.left;
    const endBoundary = editorRect.left + editorRect.width - stylerRect.width;
    const xPosition = normalizeNumber(deltaX, startBoundary, endBoundary);
    const yPosition = deltaY < threshold
      ? elementRect.top + elementRect.height + marginRatio : deltaY;

    if (yPosition < threshold) {
      this.styler.style.opacity = 0;
      return;
    }
    this.styler.style.opacity = 1;
    this.styler.style.top = `${yPosition}px`;
    this.styler.style.left = `${xPosition}px`;
  }

  show (item) {
    if (this.currentItem) {
      this.currentItem.el.classList.remove('is-active');
    }
    if (item) {
      this.currentItem = item;
      this.currentContent = item.contentDiv;
      this.currentItem.el.classList.add('is-active');
    }
    if (this.settings.mode === 'bubble') {
      this.updateBubblePosition();
    }
    if (this.visiable) return
    this.visiable = true;
    this.styler.classList.add('is-visible');
    this.styler.classList.remove('is-hidden');
    if (this.settings.mode === 'bubble') {
      window.addEventListener('scroll', this.bubbleScrollCallback);
    }
    if (this.settings.hideWhenClickOut) {
      document.addEventListener('click', (event) => {
        if (
          isElementClosest(event.target, this.currentItem.el) ||
          isElementClosest(event.target, this.styler)
        ) return;
        this.hide();
      });
    }
  }

  hide () {
    if (this.currentItem) {
      this.currentItem.el.classList.remove('is-active');
    }
    this.styler.classList.remove('is-visible');
    this.styler.classList.add('is-hidden');
    this.visiable = false;
    if (this.settings.mode === 'bubble') {
      window.removeEventListener('scroll', this.bubbleScrollCallback);
    }
    if (this.settings.hideWhenClickOut) {
      document.removeEventListener('click', this.clickCallback);
    }
  }

  update () {
    this.updateCommandsStates();
    if (this.settings.mode !== 'bubble') return;

    if (Selection.textRange.collapsed || Selection.range.collapsed) {
      this.hide();
      return;
    }
    this.show();
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
  updateCommandsStates () {
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

  toggleClass (currentClass, allClasses) {
    if (!this.currentItem) return;
    const prefixedClasses = allClasses.map(cls => `is-${cls}`);
    this.currentItem.el.classList.remove(...prefixedClasses);
    this.currentItem.el.classList.toggle(currentClass);
    if (this.settings.mode === 'bubble') {
      this.updateBubblePosition();
    }
  }
}

