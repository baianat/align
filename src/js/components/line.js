import Component from './component';
import Styler from '../core-elements/styler';

export default class Line extends Component {
  constructor (line) {
    super(line);

    if (this.mode === 'create') {
      this.el = document.createElement('hr');
      this.el.classList.add('align-line');
    }
    if (this.mode === 'edit') {
      this.el = line;
    }
    this._init();
  }

  static add () {
    return new Promise((resolve, reject) => {
      resolve(new Line());
    });
  }

  _init () {
    this.toolbar = new Styler(this.$align, Line.toolbar);
    this.el.addEventListener('click', () => {
      this.toolbar.update(this);
    });
  }

  static toolbar = {
    mode: 'bubble',
    hideWhenClickOut: true,
    commands: [
      {
        element: 'classes',
        values: ['normal', 'dashed', 'dotted', 'double', 'dots', 'thick']
      },
      'remove'
    ]
  }

  static schema = {
    icon: 'line',
    tooltip: 'Line separator'
  }
}

// addLine: {
//   element: 'dropdown',
//   items: [
//     '<hr class="align-line">',
//     '<hr class="align-line is-dashed">',
//     '<hr class="align-line is-dotted">',
//     '<hr class="align-line is-double">',
//     '<hr class="align-line is-dots">',
//     '<hr class="align-line is-bold">',
//     '<hr class="align-line is-bold is-dashed">',
//     '<hr class="align-line is-bold is-dotted">',
//     '<hr class="align-line is-bold is-double">'
//   ],
//   icon: 'insertLine',
//   func: 'addHTML',
//   tooltip: 'Add line'
// },