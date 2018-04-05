import {
  debounce,
  cloneObject,
  camelCase,
  isElementClosest,
  updatePosition
} from './partial/util';
import { 
  setElementsPrefix,
  button,
  select,
  input,
  menuButton,
  fileButton
} from './partial/elements';
import cmdsSchema from './partial/cmdsSchema';
import Selection from './selection';

export default class Styler {
  constructor(align, {
    mode = 'toolbar',
    commands = ['bold', 'italic', 'underline'],
    hideWhenClickOut = false,
    tooltip = false,
    theme = 'light',
    position = 'center-top'
  } = {}) {
    this.$align = align;
    this.settings = {
      mode,
      commands,
      hideWhenClickOut,
      tooltip,
      theme,
      position
    }
    this._init();
  }

  /**
   * Create the styler toolbar
   */
  _init () {
    setElementsPrefix('styler-');
    this.cmdsSchema = cloneObject(cmdsSchema);
    this.el = document.createElement('ul');
    this.el.classList.add('styler', `is-${this.settings.mode}`, `is-${this.settings.theme}`);
    this.cmds = {};
    this.visiable = false;

    this.settings.commands.forEach((command) => {
      this.generateCmdElement(command);
    })
    this.$align.el.appendChild(this.el);
    if (this.settings.mode === 'bubble') this._initBubble();
  }

  _initBubble () {
    this.el.classList.add('is-hidden');
    this.currentPosition = null;
    let ticking = false;
    this.bubbleScrollCallback = () => {
      this.scrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!this.currentPosition) {
            this.updateBubblePosition('center-top');
          }
          ticking = false;
        });
        ticking = true;
      }
    }
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
      cmdSchema.init = new cmdSchema.init(currentCmd.el, cmdSchema.initConfig); // eslint-disable-line
    }

    if (typeof cmdSchema.init === 'string') {
      this.$align[cmdSchema.init](cmdSchema, command);
      cmdSchema.init = null;
    }

    this.el.appendChild(li);
  }

  cmdCallback(cmdSchema, value) {
    if (cmdSchema.command) {
      this.execute(cmdSchema.command, value, cmdSchema.useCSS);
    }
    if (typeof cmdSchema.func === 'string') {
      let callbackFunc = this.$align[cmdSchema.func]
        ? this.$align[cmdSchema.func].bind(this.$align)
        : this.currentItem[cmdSchema.func].bind(this.currentItem);
      callbackFunc(this, value || cmdSchema);
    }
    if (typeof cmdSchema.func === 'function') {
      cmdSchema.func(this, value || cmdSchema);
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

  updateBubblePosition (newPosition) {
    if (!Selection.textRange && !this.currentItem) return;
    const element = this.currentItem ? this.currentItem.el : Selection.textRange;
    this.currentPosition = updatePosition(
      element,
      this.el,
      this.$align.el,
      newPosition || this.settings.position
    );
  }

  show (item) {
    if (this.currentItem) {
      this.currentItem.el.classList.remove('is-active');
    }
    if (item) {
      this.currentItem = item;
      this.currentItem.el.classList.add('is-active');
    }
    if (this.settings.mode === 'bubble') {
      this.updateBubblePosition();
    }
    if (this.visiable) {
      return;
    }
    this.visiable = true;
    this.el.classList.add('is-visible');
    this.el.classList.remove('is-hidden');
    if (this.settings.hideWhenClickOut) {
      document.addEventListener('click', (event) => {
        if (
          isElementClosest(event.target, this.currentItem.el) ||
          isElementClosest(event.target, this.el)
        ) return;
        this.hide();
      });
    }
  }

  hide () {
    if (this.currentItem) {
      this.currentItem.el.classList.remove('is-active');
    }
    this.el.classList.remove('is-visible');
    this.el.classList.add('is-hidden');
    if (this.settings.hideWhenClickOut) {
      document.removeEventListener('click', this.clickCallback);
    }
    this.visiable = false;
  }

  update () {
    this.updateCommandsStates();
    if (this.settings.mode !== 'bubble' || !Selection.textRange) return;
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
        const selectedElement = Selection.current.anchorNode.type === 1
          ? Selection.current.anchorNode
          : Selection.current.anchorNode.parentNode
        if (selectedElement.closest('.align-content')) {
          document.queryCommandValue(command)
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
