import Component from './component';
import Prompt from '../core-elements/prompt';

export default class Embed extends Component {
  constructor (align, data) {
    super(...arguments);

    this.el = document.createElement('div');
    this.el.classList.add('align-embed');
    this.el.insertAdjacentHTML('afterbegin', data);
  }

  static add (align) {
    const prompt = new Prompt(align, {
      message: 'Add an embedded:'
    });
    return new Promise((resolve, reject) => {
      prompt.onSubmit(() => {
        const data = prompt.inputs[0].value;
        if (!data) {
          reject('not a valid number');
        };
        resolve(new Embed(align, data));
      });
    });
  }

  static schema =  {
    icon: 'embed',
    tooltip: 'Add embed'
  }
}
