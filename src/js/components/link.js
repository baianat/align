import Component from './component';
import Prompt from '../prompt';
import Selection from '../selection';

export default class Link extends Component {
  constructor (link) {
    super(link);
    if (this.mode === 'create') {
      this.el = document.createElement('a');
      this.el.appendChild(Selection.range.extractContents());
      Selection.range.insertNode(this.el);
    }
    if (this.mode === 'edit') {
      this.el = link;
    }

    this._init(link);
  }

  static add () {
    return new Promise((resolve, reject) => {
      const link = new Link();
      link.edit();
      // to stop align from adding element to DOM
      resolve({});
    });
  }

  _init () {
    this.el.target = '_blank';
    this.el.addEventListener('click', this.edit.bind(this));
  }

  edit () {
    const prompt = new Prompt(this.$align, {
      message: 'Enter link:',
      data: this.el.getAttribute('href')
    });
    prompt.on('save', () => {
      const link = prompt.inputs[0].value;
      if (!link) return;
      this.update(link);
    });
    if (this.el.href) {
      prompt.on('remove', () => {
        this.remove();
      });
    }
  }

  update (link) {
    this.el.href = link;
  };

  remove () {
    const content = this.el.innerHTML;
    this.el.insertAdjacentHTML('beforebegin', content);
    super.remove();
  }

  static schema = {
    tooltip: 'Hyperlink',
    icon: 'link'
  }
}
