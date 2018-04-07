import Prompt from './prompt';
import Selection from './selection';

export default class Link {
  constructor(link) {
    this._init(link);
  }

  static config(align) {
    this.$align = align;
  }

  _init(link) {
    this.el = link || document.createElement('a');
    if (!link) {
      this.el.appendChild(Selection.range.extractContents());
      Selection.range.insertNode(this.el);
    }
    this.el.addEventListener('click', this.edit.bind(this))
  }

  edit() {
    const prompt = new Prompt(
      'Enter link:', this.el.href,
      {
        wrapper: Link.$align.el
      }
    )
    prompt.onSubmit(() => {
      const link = prompt.inputs[0].value;
      if (!link) return;
      this.update(link);
    });
    if (this.el.href) {
      prompt.onDelete(() => {
        this.remove();
      });
    }
  }

  update(link) {
    this.el.href = link;
  };

  remove() {
    const content = this.el.innerHTML;
    this.el.insertAdjacentHTML('beforebegin', content);
    this.el.remove();
  }
}