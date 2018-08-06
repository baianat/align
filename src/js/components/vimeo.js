import Component from './component';
import Prompt from '../prompt';

export default class Vimeo extends Component {
  constructor (link) {
    this.el = document.createElement('div');
    this.el.classList.add('align-video');

    this._init(link);
  }

  static add (align) {
    const prompt = new Prompt(align, {
      message: 'Enter video link:'
    });
    return new Promise((resolve, reject) => {
      prompt.onSubmit(() => {
        const link = prompt.inputs[0].value;
        if (!link) {
          reject('no link provided');
        };
        resolve(new Vimeo(link));
      });
    });
  }

  _init (link) {
    const regExp = /vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/
    const match = link.match(regExp);
    if (!match) {
      console.warn('wrong vimeo video url');
      return;
    }
    const videoId = match[1];
    const iframe = document.createElement('iframe');

    iframe.allowfullscreen = true;
    iframe.contentEditable = false;
    iframe.src = `//player.vimeo.com/video/${videoId}`;

    this.el.appendChild(iframe);
  }

  static schema = {
    tooltip: 'Vimeo',
    icon: 'vimeo'
  }
}
