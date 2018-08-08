import Component from './component';
import Prompt from '../prompt';

export default class Facebook extends Component {
  constructor (link) {
    super();
    this.el = document.createElement('div');
    this._init(link);
  }

  static add () {
    const prompt = new Prompt(this.$align, {
      message: 'Enter post link:'
    });
    return new Promise((resolve, reject) => {
      prompt.onSubmit(() => {
        const postUrl = prompt.inputs[0].value;
        if (!postUrl) {
          reject('no link provided');
        };
        resolve(new Facebook(postUrl));
      });
    });
  }

  _init (link) {
    const iframe = document.createElement('iframe');

    iframe.width = 500;
    iframe.height = 200;
    iframe.scrolling = 'no';
    iframe.contentEditable = false;
    iframe.allowTransparency = true;
    iframe.src = `//www.facebook.com/plugins/post.php?href=${link}`;

    this.el.classList.add('align-post');
    this.el.appendChild(iframe);
  }

  static schema = {
    icon: 'facebook',
    tooltip: 'Facebook post'
  }
}
