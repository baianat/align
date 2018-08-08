import Component from './component';
import Prompt from '../prompt';

export default class Separator extends Component {
  constructor (height) {
    super();

    this.el = document.createElement('div');
    this.el.classList.add('align-separator');
    this._init(height);
  }

  static add () {
    const prompt = new Prompt(this.$align, {
      message: 'Enter separator height:'
    });
    return new Promise((resolve, reject) => {
      prompt.onSubmit(() => {
        const data = prompt.inputs[0].value;
        if (!data) {
          reject('not a valid number');
        };
        resolve(new Separator(data));
      });
    });
  }

  _init (height) {
    this.currentHeigh = Number(height);
    this.updateHeight(height);
    this.el.addEventListener('mousedown', this.handleClick.bind(this));
  }

  updateHeight (height) {
    this.el.style.height = `${height}px`;
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

  static schema = {
    tooltip: 'Vimeo',
    icon: 'split'
  }
}
