import Colorpicker from '@baianat/colorpicker';
import Selection from './selection';
import { generateKeysSymbols } from './util';

const symbols = generateKeysSymbols();

const cmdsSchemas = {
  bold: {
    element: 'button',
    command: 'bold',
    tooltip: `Bold (${symbols.cmdKey} B)`
  },

  italic: {
    element: 'button',
    command: 'italic',
    tooltip: `Italic (${symbols.cmdKey} I)`
  },

  underline: {
    element: 'button',
    command: 'underline',
    tooltip: `Underline (${symbols.cmdKey} U)`
  },

  strikeThrough: {
    element: 'button',
    command: 'strikeThrough',
    tooltip: `Strike through`
  },

  undo: {
    element: 'button',
    command: 'undo',
    tooltip: `Undo (${symbols.cmdKey} Z)`
  },

  redo: {
    element: 'button',
    command: 'redo',
    tooltip: `Redo (${symbols.cmdKey} ${symbols.shift} Z)`
  },

  removeFormat: {
    element: 'button',
    command: 'removeFormat',
    tooltip: `Remove format (${symbols.cmdKey} \\)`
  },

  justifyLeft: {
    element: 'button',
    command: 'justifyLeft',
    tooltip: `Align left (${symbols.cmdKey} L)`
  },

  justifyCenter: {
    element: 'button',
    command: 'justifyCenter',
    tooltip: `Align center (${symbols.cmdKey} E)`
  },

  justifyRight: {
    element: 'button',
    command: 'justifyRight',
    tooltip: `Align right (${symbols.cmdKey} R)`
  },

  selectAll: {
    element: 'button',
    command: 'selectAll',
    tooltip: `Select all (${symbols.cmdKey} A)`
  },

  justifyFull: {
    element: 'button',
    command: 'justifyFull',
    tooltip: `Justify full (${symbols.cmdKey} J)`
  },

  createLink: {
    element: 'button',
    tooltip: 'Hyperlink',
    func(styler) {
      var link = prompt('Write the URL here', ''); // eslint-disable-line
      if (link && link !== '') {
        styler.align.execute('createLink', link);
      }
    }
  },

  h1: {
    element: 'button',
    command: 'formatblock',
    value: 'h1',
    tooltip: 'Heading 1'
  },

  h2: {
    element: 'button',
    command: 'formatblock',
    value: 'h2',
    tooltip: 'Heading 2'
  },

  blockquote: {
    element: 'button',
    command: 'formatblock',
    value: 'blockquote',
    tooltip: 'Quote'
  },

  p: {
    element: 'button',
    command: 'formatblock',
    value: 'p',
    tooltip: 'Paragraph'
  },

  orderedList: {
    element: 'button',
    command: 'insertOrderedList',
    tooltip: 'Ordered list'
  },

  unorderedList: {
    element: 'button',
    command: 'insertUnorderedList',
    tooltip: 'Unordered list'
  },

  insertLine: {
    element: 'button',
    command: 'insertHorizontalRule',
    tooltip: `Insert line`
  },

  indent: {
    element: 'button',
    command: 'indent',
    useCSS: true,
    tooltip: `Indent (${symbols.tab})`
  },

  outdent: {
    element: 'button',
    command: 'outdent',
    useCSS: true,
    tooltip: `Outdent (${symbols.shift} ${symbols.tab})`
  },

  superscript: {
    element: 'button',
    command: 'superscript',
    tooltip: `Superscript (${symbols.cmdKey} ${symbols.shift} =)`
  },

  subscript: {
    element: 'button',
    command: 'subscript',
    tooltip: `Subscript (${symbols.cmdKey} =)`
  },

  pre: {
    element: 'button',
    command: 'formatblock',
    value: 'pre',
    func: 'highlight',
    tooltip: 'Script'
  },

  html: {
    element: 'button',
    func: 'toggleHTML',
    tooltip: 'Show HTML'
  },

  fontSize: {
    element: 'select',
    command: 'fontSize'
  },

  fontName: {
    element: 'select',
    init: 'applyFont',
    command: 'fontName',
    useCSS: true
  },

  separator: {
    element: 'styling',
    class: 'styler-separator'
  },

  color: {
    element: 'input',
    type: 'text',
    command: 'foreColor',
    useCSS: true,
    init: Colorpicker,
    initConfig: {
      defaultColor: '#000000',
      mode: 'hex',
      disableLum: true,
      guideIcon: `
        <svg viewBox="0 0 24 24">
          <path d="M0 20h24v4H0z"/>
          <path style="fill: currentColor" d="M11 3L5.5 17h2.25l1.12-3h6.25l1.12 3h2.25L13 3h-2zm-1.38 9L12 5.67 14.38 12H9.62z"/>
        </svg>
      `,
      events: {
        beforeSubmit() {
          Selection.updateSelection();
        },
        afterOpen() {
          Selection.updateSelectedRange();
        },
        afterSelect() {
          Selection.updateSelectedRange();
        }
      }
    }
  },

  backColor: {
    element: 'input',
    type: 'text',
    command: 'backColor',
    useCSS: true,
    init: Colorpicker,
    initConfig: {
      defaultColor: '#fdfdfd',
      mode: 'hex',
      disableLum: true,
      guideIcon: `
        <svg viewBox="0 0 24 24">
          <path style="fill: currentColor" d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z"/>
          <path d="M0 20h24v4H0z"/>
        </svg>
      `,
      events: {
        beforeSubmit() {
          Selection.updateSelection();
        },
        afterOpen() {
          Selection.updateSelectedRange();
        },
        afterSelect() {
          Selection.updateSelectedRange();
        }
      }
    }
  },

  addImage: {
    element: 'custom',
    data() {
      return {
        button: document.createElement('div'),
        input: document.createElement('input'),
        icon:
          `<svg class="icon" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path>
            </svg>`
      }
    },
    create() {
      this.$data = this.data;
      this.data = this.$data();
      const button = this.data.button;
      const input = this.data.input;
      const icon = this.data.icon;

      button.classList.add('styler-button');
      button.appendChild(input);
      button.insertAdjacentHTML('beforeend', icon);
      input.classList.add('styler-input');
      input.type = 'file';
      input.id = 'addImage';
      input.addEventListener('change', this.action.bind(this));

      return button;
    },
    action() {
      const file = this.data.input.files[0];
      if (!file) return;
      if (!window.getSelection().rangeCount) return;
      const img = document.createElement('img');

      const reader = new FileReader(); // eslint-disable-line
      reader.addEventListener('load', () => {
        img.src = reader.result;
        img.classList.add('align-image');
        img.dataset.alignFilename = file.name;
      });
      reader.readAsDataURL(file);
      Selection.selectedRange = window.getSelection().getRangeAt(0);
      Selection.selectedRange.insertNode(img);
      document.execCommand('enableObjectResizing', false, true);
      this.data.input.value = null;
    }
  }
}

export default cmdsSchemas;
