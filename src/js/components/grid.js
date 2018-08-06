import Component from './component';
import Prompt from '../prompt';
import Styler from '../styler';

export default class Grid extends Component {
  constructor (align, count) {
    super();

    this.$align = align;
    this.el = document.createElement('div');
    this.el.classList.add('align-grid');
    this.el.insertAdjacentHTML(
      'afterbegin',
      '<div class="align-column"><p></p></div>'.repeat(count)
    );
    this.columns = Array.from(this.el.querySelectorAll('.align-column'));
    this._init();
  }

  static add (align) {
    const prompt = new Prompt(align, {
      message: 'Enter columns count:',
      inputsCount: 1
    });
    return new Promise((resolve, reject) => {
      prompt.onSubmit(() => {
        const count = prompt.inputs[0].value;
        if (isNaN(count)) {
          reject('not a valid number');
        };
        resolve(new Grid(align, count));
      });
    });
  }

  _init () {
    this.gridToolbar = new Styler(this.$align, Grid.gridToolbar);
    this.columnToolbar = new Styler(this.$align, Grid.columnToolbar);

    this.el.addEventListener('click', () => {
      this.gridToolbar.update(this);
    });
    this.columns.forEach(col => {
      const obj = {
        el: col,
        columnColor: this.columnColor.bind(this)
      };
      col.addEventListener('click', () => {
        this.columnToolbar.update(obj);
      });
    })
  }

  columnColor (color) {
    const currentCol = this.columnToolbar.currentItem.el;
    currentCol.style.backgroundColor = color;

    // emit events
    this.$align.$bus.emit('changed');
  }

  remove () {
    this.gridToolbar.remove();
    this.columnToolbar.remove();
    super.remove();
  }

  static gridToolbar = {
    mode: 'bubble',
    hideWhenClickOut: true,
    commands: [
      {
        element: 'classes',
        values: ['center', 'shrink', 'relaxed']
      },
      'remove'
    ]
  }

  static columnToolbar = {
    mode: 'bubble',
    position: 'center-bottom',
    hideWhenClickOut: true,
    commands: [
      '_columnColor',
      {
        element: 'classes',
        values: 'input'
      }
    ]
  }

  static schema = {
    icon: 'column',
    tooltip: 'Add columns'
  }
}
