import Prompt from '../prompt';

export default class Youtube {
  constructor (link) {
    this.el = document.createElement('div');
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
        resolve(new Youtube(link));
      });
    });
  }

  _init (link) {
    const regExp = /(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = link.match(regExp);
    if (!match) {
      console.warn('wrong youtube video url');
      return;
    }
    const videoId = match[1];
    const iframe = document.createElement('iframe');

    iframe.allowfullscreen = true;
    iframe.contentEditable = false;
    iframe.src = `//www.youtube.com/embed/${videoId}`;

    this.el.classList.add('align-video');
    this.el.appendChild(iframe);
  }
}
