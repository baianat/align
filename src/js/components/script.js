import Component from './component';
import Styler from '../core-elements/styler';
import CodeEditor from '../core-elements/codeEditor';

export default class Script extends Component {
  constructor (align, script) {
    super(...arguments);

    if (this.mode === 'create') {
      this.el = document.createElement('div');
      this.content = 'hello world,';
      this.language = 'javascript';
    }

    if (this.mode === 'edit') {
      this.el = script;
      this.content = this.el.querySelector('pre').innerText;
      this.el.innerHTML = '';
    }

    this._init();
  }

  static add (align) {
    return new Promise((resolve, reject) => {
      resolve(new Script(align));
    });
  }

  static render (script) {
    const elPre = script.querySelector('pre');
    const elCode = script.querySelector('code');
    script.innerText = '';
    script.contentEditable = 'inherit';
    elCode.innerHTML = elCode.innerText;
    script.appendChild(elPre);
  }

  _init () {
    this.codeEditor = new CodeEditor(this.el, this.content, {
      language: 'javascript'
    });
  }

  

  static toolbar = {
    mode: 'bubble',
    hideWhenClickOut: true,
    commands: [
      {
        element: 'classes',
        values: ['js', 'css', 'html']
      },
      'remove'
    ]
  }
  static schema = {
    icon: 'script',
    tooltip: 'Add Table'
  }
}