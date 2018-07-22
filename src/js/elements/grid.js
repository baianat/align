import Prompt from '../prompt';

export default class Grid {
  constructor (count) {
    this.el = document.createElement('div');
    this.el.classList.add('align-grid');
    this.el.insertAdjacentHTML(
      'afterbegin',
      '<div class="align-column"><p><br></p></div>'.repeat(count)
    );
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
        resolve(new Grid(count));
      });
    });
  }
}
