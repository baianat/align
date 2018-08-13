import Component from './component';
import Prompt from '../core-elements/prompt';

export default class Embed extends Component {
  constructor (data) {
    super();
    this.el = document.createElement('div');
    this.el.classList.add('align-embed');
    this.el.insertAdjacentHTML('afterbegin', data);
  }

  static add () {
    const prompt = new Prompt(this.$align, {
      message: 'Add an embedded:'
    });
    return new Promise((resolve, reject) => {
      prompt.onSubmit(() => {
        const data = prompt.inputs[0].value;
        if (!data) {
          reject('not a valid number');
        };
        resolve(new Embed(data));
      });
    });
  }

  static schema =  {
    icon: 'embed',
    tooltip: 'Add embed'
  }
}
