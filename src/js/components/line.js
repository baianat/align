import Component from './component';
import Styler from '../core-elements/styler';

export default class Line extends Component {
  constructor (align, line) {
    super(...arguments);

    if (this.mode === 'create') {
      this.el = document.createElement('hr');
      this.el.classList.add('align-line');
    }
    if (this.mode === 'edit') {
      this.el = line;
    }
    this._init();
  }

  static add (align) {
    return new Promise((resolve, reject) => {
      resolve(new Line(align));
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
