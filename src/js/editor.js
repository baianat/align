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
      this.updateStylerPositoin();
    })
  }

  initStyler() {
    this.styler = {};
    this.el.insertAdjacentHTML('beforebegin', styler);
    this.styler.wrapper = select('.styler');
    this.styler.size = select('#size');
    this.styler.color = select('#color');
    this.styler.bold = select('#bold');
    this.styler.italic = select('#italic');
    this.styler.underline = select('#underline');
    this.styler.alignLeft = select('#alignLeft');
    this.styler.alignCenter = select('#alignCenter');
    this.styler.alignRight = select('#alignRight');
    this.styler.addImage = select('#addImage');


  }

  initStylerActions() {
    this.styler.size.addEventListener('change', () => {
      const select = this.styler.size;
      this.excute('fontsize', select[select.selectedIndex].value);
    });
    this.styler.color.addEventListener('change', () => this.excute('forecolor', this.styler.color.value))
    this.styler.bold.addEventListener('click', () => this.excute('bold'));
    this.styler.italic.addEventListener('click', () => this.excute('italic'));
    this.styler.underline.addEventListener('click', () => this.excute('underline'));
    this.styler.alignLeft.addEventListener('click', () => this.excute('justifyleft'));
    this.styler.alignCenter.addEventListener('click', () => this.excute('justifycenter'));
    this.styler.alignRight.addEventListener('click', () => this.excute('justifyright'));
    this.styler.addImage.addEventListener('change', () => this.insertImage());
  }

  excute(cmd, value) {
    document.execCommand(cmd, false, value);
    this.el.focus();
    this.updateStylerPositoin();
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