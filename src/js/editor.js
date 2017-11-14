import hljs from 'highlight.js/lib/highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);

import { select } from './util';
import styler from './styler';


class Editor {
  constructor(selector, options = {}) {
    this.el = select(selector);
    this.options = options;
    this.init();
  }

  get content() {
    return document.createTextNode(this.el.innerHTML);
  }
  init() {
    this.HTML = false;
    this.initStyler();
    this.initEditor();
  }

  initEditor() {
    this.el.contentEditable = 'true';
    const text = document.createElement('p');
    text.innerText = 'Type here \n';
    this.el.appendChild(text);
    this.el.addEventListener('focus', () => {
      this.highlight();
    });

    this.el.addEventListener('click', () => {
      this.styler.updateStylerStates();
    });
    
    window.addEventListener("keydown", (event) => {
      if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
      }

      switch (event.key) {
        case "Tab":
          this.execute('indent');
          break;
        case "Enter":
          this.breakLine(event);
          break;  
        default:
          return; // Quit when this doesn't handle the key event.
      }

      // Cancel the default action to avoid it being handled twice
      event.preventDefault();
    }, true);
  }

  initStyler() {
    this.styler = new styler(this.el, this.options.styler.commands);
  }

  breakLine(event) {
    let doxExec = false;

    try {
      doxExec = document.execCommand('insertBrOnReturn', false, true);
    }
    catch (error) {
      // IE throws an error if it does not recognize the command...
    }

    if (doxExec) return true;
    
    // Standard
    if (window.getSelection) {
      event.stopPropagation();

      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const br = document.createElement('br');
      
      range.deleteContents();
      range.insertNode(br);
      range.setStartAfter(br);
      range.setEndAfter(br);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);

      return false;
    }

    // IE
    else if ($.browser.msie) {
      event.preventDefault();

      let range = document.selection.createRange();
      range.pasteHTML('<BR><SPAN class="--IE-BR-HACK"></SPAN>');
      range.moveStart('character', 1);
      return false;
    }

    return true;
  }

  

  highlight() {
    const code = Array.from(this.el.querySelectorAll('pre'));

    code.forEach((block) => {
      hljs.highlightBlock(block);
    })
  }

  getSelectedPosition() {
    return window.getSelection().getRangeAt(0);
  }


  updateCursorPosition(range) {
    this.selection.removeAllRanges();
    this.selection.addRange(range);
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
}

export default Editor;