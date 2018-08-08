import Component from './component';

export default class Paragraph extends Component {
  constructor (line) {
    super(line);

    this.el = document.createElement('p');
  }

  static add () {
    return new Promise((resolve, reject) => {
      resolve(new Paragraph());
    });
  }

  static schema = {
    icon: 'p',
    tooltip: 'Line separator'
  }
}
