import Component from './component';

export default class Paragraph extends Component {
  constructor (align, line) {
    super(...arguments);

    this.el = document.createElement('p');
  }

  static add (align) {
    return new Promise((resolve, reject) => {
      resolve(new Paragraph(align));
    });
  }

  static schema = {
    icon: 'p',
    tooltip: 'Line separator'
  }
}
