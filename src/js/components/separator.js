import Component from './component';
import Styler from '../core-elements/styler';

export default class Separator extends Component {
  constructor (align, separator) {
    super(...arguments);

    if (this.mode === 'create') {
      this.el = document.createElement('div');
      this.el.classList.add('align-separator');
      this.currentHeigh = 50;
    }
    if (this.mode === 'edit') {
      this.el = separator;
      this.currentHeigh = Number(this.el.style.height.slice(0, -2));
    }


    this._init();
  }

  static add (align) {;
    return new Promise((resolve, reject) => {
      resolve(new Separator(align));
    });
  }

  _init () {
    this.updateHeight(this.currentHeigh);
    this.el.addEventListener('mousedown', this.handleClick.bind(this));
    this.toolbar = new Styler(this.$align, Separator.toolbar);
    this.el.addEventListener('mousedown', () => {
      this.toolbar.update(this);
    });
  }

  updateHeight (height) {
    this.el.style.height = `${height}px`;
    this.$align.$bus.emit('changed');
  }

  handleClick (event) {
    event.preventDefault();
    const startPosition = event.y;
    const handleDrag = (evnt) => {
      const endPosition = evnt.y;
      this.delta = endPosition - startPosition;
      this.updateHeight(this.currentHeigh + this.delta);
    };
    const handleRelease = (evnt) => {
      evnt.preventDefault();
      evnt.stopPropagation();
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleRelease);
      this.currentHeigh += this.delta;
    };
    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', handleRelease);
  }

  
  static toolbar = {
    mode: 'bubble',
    hideWhenClickOut: true,
    commands: [
      'remove'
    ]
  }

  static schema = {
    tooltip: 'separator',
    icon: 'split'
  }
}
