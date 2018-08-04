import {
  cloneObject,
  isElementClosest,
  updatePosition,
  userOS,
  generateKeysSymbols
} from './partial/util';
import {
  setElementsPrefix,
  button,
  select,
  input,
  menuButton,
  fileButton,
  dropdown
} from './partial/elements';
import cmdsSchema from './partial/cmdsSchema';
import icons from './partial/icons';
import Selection from './selection';
const symbols = generateKeysSymbols();

export default class Styler {
  constructor (align, settings) {
    this.$align = align;
    this.settings = {
      ...Styler.defaults,
      ...settings
    };
    this._init();
  }

  /**
   * Create the styler toolbar
   */
  _init () {
    setElementsPrefix('styler-');
    this.cmdsSchema = cloneObject(cmdsSchema);
    this.el = document.createElement('div');
    this.menu = document.createElement('ul');
    this.el.classList.add('styler', `is-${this.settings.mode}`, `is-${this.settings.theme}`);
    this.el.appendChild(this.menu);
    this.menu.classList.add('styler-menu');
    this.cmds = {};
    this.visible = false;
    this.shortcuts = [];

    this.settings.commands.forEach((command) => {
      this._initCmdElement(command);
    });
    if (this.settings.mode === 'bubble') {
      this.el.classList.add('is-hidden');
      this.$align.wrapper.appendChild(this.el);
    }
    if (this.settings.mode === 'toolbar' && this.settings.shortcuts) {
      this.keyboardShortcuts();
      this.$align.el.insertAdjacentElement('afterbegin', this.el);
    }
    if (this.settings.hideWhenClickOut) {
      this.clickCallback = (event) => {
        if (
          isElementClosest(event.target, this.el) ||
          isElementClosest(event.target, this.currentItem.el)
        ) {
          return;
        }
        this.hide();
      };
    }
  }

  _initClassesElement ({ el, schema }) {
    const values = schema.values;
    if (!Array.isArray(values)) {
      const element = input('counter', 'number');
      element.addEventListener('input', () => {
        if (!this.currentItem) {
          return;
        }
        const lastValue = this.currentItem.currentValue || 0
        this.toggleClass(element.value, [...lastValue]);
        this.currentItem.currentValue = element.value;
      })
      el.appendChild(element);
      return;
    }
    values.forEach((value, indx) => {
      const className = value;
      const iconName = schema.icons ? schema.icons[indx] : value;
      const icon = icons[iconName] || value;
      const li = menuButton(
        className,
        icon,
        () => {
          this.toggleClass(className, values)
        },
        className
      );
      el.appendChild(li);
    });
  }

  _initCmdElement (command) {
    const cmd = typeof command === 'string' ? command : Object.keys(command)[0];
    const cmdSchema = this.cmdsSchema[cmd] || command;
    if (!cmdSchema) {
      console.warn(cmd + ' is not found');
      return;
    }

    let elementToAdd = '';
    const li = document.createElement('li');
    const icon = icons[cmdSchema.icon] || icons[cmd] || cmd;
    const tooltip = this.getTooltip(cmdSchema);
    const currentCmd = this.cmds[cmd] = { schema: cmdSchema };

    switch (cmdSchema.element) {
      case 'button':
        elementToAdd = currentCmd.el = button(cmd, icon, tooltip);
        const callback = () => this.cmdCallback(cmdSchema, cmdSchema.value);
        currentCmd.el.addEventListener('click', callback);
        if (cmdSchema.shortcut) {
          this.shortcuts.push({ ...cmdSchema.shortcut, callback });
        }
        break;

      case 'file':
        const fileBtn = fileButton(cmd, icon, tooltip);
        elementToAdd = currentCmd.el = fileBtn.el;
        fileBtn.input.addEventListener('change', (event) => {
          this.cmdCallback(cmdSchema, event);
        });
        break;

      case 'input':
        elementToAdd = currentCmd.el = input(cmd, cmdSchema.type, tooltip);
        currentCmd.el.addEventListener('change', () => {
          this.cmdCallback(cmdSchema, currentCmd.el.value);
        });
        break;

      case 'select':
        const { wrapper, el } = select(cmd, command[cmd]);
        currentCmd.el = el;
        elementToAdd = wrapper;
        el.addEventListener('change',
          () => this.cmdCallback(cmdSchema, el[el.selectedIndex].value)
        );
        break;

      case 'dropdown':
        const ddown = dropdown(
          cmd,
          cmdSchema.items,
          (value) => this.cmdCallback(cmdSchema, value)
        );
        elementToAdd = currentCmd.el = ddown.dropdown;
        break;

      case 'styling':
        li.classList.add(cmdSchema.class);
        break;

      case 'custom':
        elementToAdd = cmdSchema.create(this);
        break;

      case 'classes':
        elementToAdd = currentCmd.el = document.createElement('ul');
        this._initClassesElement(currentCmd)
        break;

      default:
        console.warn(cmd, ' is not found');
    }

    if (elementToAdd) {
      li.appendChild(elementToAdd);
    }

    if (typeof cmdSchema.init === 'function') {
      cmdSchema.init = new cmdSchema.init(currentCmd.el, cmdSchema.initConfig); // eslint-disable-line
    }

    if (typeof cmdSchema.init === 'string') {
      this.$align[cmdSchema.init](cmdSchema, command);
      cmdSchema.init = null;
    }

    this.menu.appendChild(li);
  }

  cmdCallback (cmdSchema, value) {
    if (cmdSchema.command) {
      this.execute(cmdSchema.command, value, cmdSchema.useCSS);
    }

    if (typeof cmdSchema.func === 'string') {
      // check if the cmd calls a function from align
      // otherwise it calls the function from the element itself
      let callbackFunc = null;
      if (this.$align[cmdSchema.func]) {
        callbackFunc = this.$align[cmdSchema.func].bind(this.$align);
      } else if (this.currentItem && this.currentItem[cmdSchema.func]) {
        callbackFunc = this.currentItem[cmdSchema.func].bind(this.currentItem);
      }
      if (!callbackFunc) {
        console.warn(cmdSchema.func, ' is not found');
        return;
      }
      callbackFunc(cmdSchema.args || value);
    }

    if (typeof cmdSchema.func === 'function') {
      cmdSchema.func(cmdSchema.args || value);
    }

    this.update();
  }

  keyboardShortcuts () {
    this.cmdKey = userOS() === 'Mac' ? 'metaKey' : 'ctrlKey';
    window.addEventListener(
      'keydown',
      (event) => {
        // Do nothing if the event was already processed
        if (event.defaultPrevented) {
          return;
        }
        const keyPressed = event.key.toUpperCase();
        this.shortcuts.forEach(shortcut => {
          if (
            keyPressed === shortcut.key &&
            event[this.cmdKey] === !!shortcut.cmdKey &&
            event.shiftKey === !!shortcut.shiftKey
          ) {
            event.preventDefault();
            shortcut.callback();
          }
        });
      }
    );
  }
  /**
   * Execute command for the selected button
   * @param {String} cmd
   * @param {String|Number} value
   */
  execute (cmd, value, useCSS = false) {
    this.$align.editor.focus();
    document.execCommand('styleWithCSS', false, useCSS);
    document.execCommand(cmd, false, value);
    document.execCommand('styleWithCSS', false, false);
    this.$align.update();
  }

  updateBubble (newPosition) {
    if ((
      Selection.range &&
      !Selection.range.collapsed &&
      Selection.range === Selection.current.getRangeAt(0)
    ) || this.currentItem) {
      const element = this.currentItem ? this.currentItem.el : Selection.range;
      this.currentPosition = updatePosition(
        element,
        this.el,
        newPosition || this.settings.position
      );
      this.show();
      return;
    }
    this.hide();
  }

  show () {
    if (this.visible) {
      return;
    }
    this.visible = true;
    this.el.style.transition = 'opacity 0.2s';
    this.el.classList.add('is-visible');
    this.el.classList.remove('is-hidden');
    const updateTemp = () => {
      this.el.style.transition = '';
      this.el.removeEventListener('transitionend', updateTemp);
    };
    this.currentItem.el.addEventListener('transitionend', updateTemp);
    if (this.settings.hideWhenClickOut) {
      document.addEventListener('click', this.clickCallback);
    }
  }

  hide () {
    if (this.currentItem && this.settings.addActiveClass) {
      this.currentItem.el.classList.remove('is-active');
    }
    if (this.currentItem) {
      this.currentItem = null;
    }
    this.el.classList.remove('is-visible');
    this.el.classList.remove('is-active');
    this.el.classList.add('is-hidden');
    this.visible = false;
    if (this.settings.hideWhenClickOut) {
      document.removeEventListener('click', this.clickCallback);
    }
  }

  update (item) {
    if (this.currentItem && this.settings.addActiveClass) {
      this.currentItem.el.classList.remove('is-active');
    }
    if (item && this.settings.addActiveClass) {
      item.el.classList.add('is-active');
    }
    if (item) {
      this.currentItem = item;
    }
    this.updateCommandsStates();
    if (this.settings.mode === 'bubble') {
      this.updateBubble();
    }
  };

  remove () {
    setTimeout(() => {
      this.el.remove();
    }, 1);
  }

  getTooltip (schema) {
    if (!schema.tooltip || !this.settings.tooltip) {
      return false;
    }
    if (this.settings.shortcuts && schema.shortcut) {
      const obj = schema.shortcut;
      const shortcut = [
        obj.cmdKey ? symbols.cmdKey : '',
        obj.shiftKey ? symbols.shift : '',
        obj.key === 'TAB' ? symbols.tab : obj.key
      ].join(' ');
      return `${schema.tooltip} (${shortcut})`;
    }
    return schema.tooltip;
  }

  /**
   * Update the state of the active style
   */
  updateCommandsStates () {
    Object.values(this.cmds).forEach((cmd) => {
      const schema = cmd.schema;
      const command = schema.command;

      if (schema.active) {
        const path = schema.active.split('.');
        const condition = path.reduce((acc, current) => {
          if (!acc) {
            return;
          }
          return acc[current];
        }, this);
        if (condition) {
          cmd.el.classList.add('is-active');
          return;
        }
        cmd.el.classList.remove('is-active');
      }

      if (!command) {
        return;
      }
      if (document.queryCommandState(command)) {
        cmd.el.classList.add('is-active');
        return;
      }
      if (document.queryCommandValue(command) === schema.value) {
        cmd.el.classList.add('is-active');
        return;
      }
      if (schema.init) {
        if (!Selection.current.anchorNode) {
          return;
        }
        const selectedElement = Selection.current.anchorNode.type === 1
          ? Selection.current.anchorNode
          : Selection.current.anchorNode.parentNode;
        if (selectedElement.closest('.align-content')) {
          document.queryCommandValue(command);
          schema.init.selectColor(document.queryCommandValue(command), true);
        }
        return;
      }
      if (document.queryCommandValue(command)) {
        cmd.el.value = document.queryCommandValue(command);
      }
      cmd.el.classList.remove('is-active');
    });
  }

  toggleClass (currentClass, allClasses) {
    if (!this.currentItem) return;
    const prefixedClasses = allClasses.map(cls => `is-${cls}`);
    this.currentItem.el.classList.remove(...prefixedClasses);
    if (!currentClass) {
      return;
    }
    this.currentItem.el.classList.toggle(`is-${currentClass}`);
    const updateTemp = () => {
      this.update();
      this.currentItem.el.removeEventListener('transitionend', updateTemp);
    };
    this.currentItem.el.addEventListener('transitionend', updateTemp);

    // emit events
    this.$align.$bus.emit('changed');
  }

  static defaults = {
    mode: 'toolbar',
    commands: [],
    hideWhenClickOut: false,
    tooltip: false,
    theme: 'light',
    shortcuts: false,
    addActiveClass: false,
    position: 'center-top'
  }
}
