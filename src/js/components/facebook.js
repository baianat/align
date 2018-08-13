import Component from './component';
import Prompt from '../core-elements/prompt';
import { stringToDOM } from '../partial/util';

export default class Facebook extends Component {
  constructor (link) {
    super();
    this.el = document.createElement('div');
    this.el.classList.add('align-post');
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
    this.addFacebookSDK();
    let post = stringToDOM(`<div class="fb-post" data-width="600px" data-href="${link}"></div>`);
    this.el.appendChild(post);

    setTimeout(() => {
      FB.init({
        appId: 'align',
        xfbml: true,
        version: 'v3.1'
      });
    }, 300);
  }

  addFacebookSDK () {
    const id = 'facebook-jssdk';
    if (document.getElementById(id)) return;
    let js = document.createElement('script');
    let fjs = document.getElementsByTagName('script')[0];
    js.id = id;
    js.src = "https://connect.facebook.net/es_LA/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }

  static schema = {
    icon: 'facebook',
    tooltip: 'Facebook post'
  }
}
