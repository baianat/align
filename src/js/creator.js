import commands from './commands';
import icons from './icons';
import { setElementsPrefix, button } from './elements';

class Creator {
  constructor(align, {
    mode = 'default',
    commands = []
  } = {}) {
    this.align = align;
    this.settings = {
      mode,
      commands
    };
    this.init();
  }

  init() {
    setElementsPrefix('creator-');
    this.creator = document.createElement('ul');
    this.creator.classList.add('creator', 'is-hidden', `is-${this.settings.mode}`);
    this.create = {};
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
          this.create[el] = button(el, icons[el]);
          // some buttons don't have commands
          // instead it use functions form align class
          // here we detect which callback should be use
          const callBack =
            current.command
              ? this.execute.bind(this)
              : this.align[current.func].bind(this.align);

          this.create[el].addEventListener('click', () => {
            callBack(current.command, current.value);
          });
          li.appendChild(this.create[el]);
          break;

        case 'select':
          this.create[el] = select(el, current.options);
          this.create[el].addEventListener('change', () => {
            const selection = this.create[el];
            this.execute(current.command, selection[selection.selectedIndex].value);
          });
          li.appendChild(this.create[el]);
          break;
        case 'input':
          this.create[el] = input(el, current.type);
          this.create[el].addEventListener('change', () => {
            this.execute(current.command, this.create[el].value);
          });
          li.appendChild(this.create[el]);
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
        this.inits[el] = new current.init(this.create[el], current.initConfig);
      }
      this.creator.appendChild(li);
    });
    this.align.el.appendChild(this.creator);

  }

  updateCreatorStates() {
    const selection = window.getSelection();
    const scrolled = window.scrollY;
    const anchorNode = selection.anchorNode;
    const element = anchorNode.nodeType === 1 ? anchorNode : anchorNode.parentElement;
    const selectionRect = element.getBoundingClientRect();
    this.creator.style.top = `${selectionRect.top + scrolled}px`;
    this.creator.classList.add('is-visible');
    this.creator.classList.remove('is-hidden');
  }

  execute(cmd, value) {
    if (this.align.HTML) return;
    document.execCommand(cmd, false, value);
    this.align.el.focus();
    this.updateStylerStates();
  }
}

export default Creator;