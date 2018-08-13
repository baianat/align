import Component from './component';

export default class Quote extends Component {
  constructor (align) {
    super(...arguments);

    this.el = document.createElement('blockquote');
    this.quote = document.createElement('p');
    this.author = document.createElement('cite');

    this.el.classList.add('align-quote');
    this.quote.dataset.defaultValue = 'Quote...';
    this.author.dataset.defaultValue = 'author';

    this.el.contentEditable = 'false';
    this.quote.contentEditable = 'true';
    this.author.contentEditable = 'true';

    this.el.appendChild(this.quote)
    this.el.appendChild(this.author);
  }

  static add (align) {
    return new Promise((resolve, reject) => {
      resolve(new Quote(align));
    });
  }

  static schema = {
    icon: 'blockquote',
    tooltip: 'Quote'
  }
}
