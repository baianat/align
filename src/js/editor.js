import { select } from './util';
import { styler } from './html';

class Editor {
  constructor(selector, options = {}) {
    this.el = select(selector);
    this.init();
  }

  init() {
    this.initStyler();
    this.initStylerActions();
    this.initEditor();
  }

  initEditor() {
    this.el.contentEditable = 'true';
    const text = document.createElement('p');
    text.innerText = 'Type here';
    this.el.appendChild(text);
    this.el.addEventListener('focus', () => {
      this.styler.wrapper.classList.add('is-visiable');
    })
    this.el.addEventListener('click', () => {
      this.updateStylerStates();
    })
  }

  initStyler() {
    this.styler = {};
    this.el.insertAdjacentHTML('beforebegin', styler);
    this.styler.wrapper = select('.styler');
    this.styler.formating = select('#formating');
    this.styler.size = select('#size');
    this.styler.color = select('#color');
    this.styler.bold = select('#bold');
    this.styler.italic = select('#italic');
    this.styler.underline = select('#underline');
    this.styler.justifyLeft = select('#justifyLeft');
    this.styler.justifyCenter = select('#justifyCenter');
    this.styler.justifyRight = select('#justifyRight');
    this.styler.justifyFull = select('#justifyFull');
    this.styler.addImage = select('#addImage');


  }

  initStylerActions() {
    this.styler.formating.addEventListener('change', () => {
      const select = this.styler.formating;
      this.excute('formatblock', select[select.selectedIndex].value);
    });
    this.styler.size.addEventListener('change', () => {
      const select = this.styler.size;
      this.excute('fontsize', select[select.selectedIndex].value);
    });
    this.styler.color.addEventListener('input', () => this.excute('forecolor', this.styler.color.value))
    this.styler.bold.addEventListener('click', () => this.excute('bold'));
    this.styler.italic.addEventListener('click', () => this.excute('italic'));
    this.styler.underline.addEventListener('click', () => this.excute('underline'));
    this.styler.justifyLeft.addEventListener('click', () => this.excute('justifyLeft'));
    this.styler.justifyCenter.addEventListener('click', () => this.excute('justifyCenter'));
    this.styler.justifyRight.addEventListener('click', () => this.excute('justifyRight'));
    this.styler.justifyFull.addEventListener('click', () => this.excute('justifyFull'));
    this.styler.addImage.addEventListener('change', () => this.insertImage());
  }

  excute(cmd, value) {
    document.execCommand(cmd, false, value);
    this.el.focus();
    this.updateStylerStates();
  }

  updateStylerStates() {
    Object.keys(this.styler).forEach((el) => {
      if (document.queryCommandState(String(el))) {
        this.styler[el].classList.add('is-active');
      } else {
        this.styler[el].classList.remove('is-active');
      }
    })
  }

  getSelectedPosition() {
    return window.getSelection().getRangeAt(0);
  }

  updateStylerPositoin() {
    const selectedPosition = this.getSelectedPosition();
    const dummy = document.createElement('sapn');
    let dummyRect;

    selectedPosition.insertNode(dummy);
    dummyRect = dummy.getBoundingClientRect();
    dummy.parentNode.removeChild(dummy);
    this.styler.wrapper.style.top = `${dummyRect.top + window.scrollY - 80}px`;
    this.styler.wrapper.style.left = `${dummyRect.left}px`;
  }

  insertImage() {
    const file = this.styler.addImage.files[0];
    if (!file) return;
    const imageURL = URL.createObjectURL(file);
    const img = document.createElement('img');
    let selectedPosition;

    img.src = imageURL;
    img.classList.add('editor-image');
    selectedPosition = this.getSelectedPosition();
    selectedPosition.insertNode(img);
  }
}

export default Editor;