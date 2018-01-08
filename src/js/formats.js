import Colorpicker from '@baianat/colorpicker';

let SELECTION = null;

const formats = {
  bold: {
    element: 'button',
    command: 'bold'
  },

  italic: {
    element: 'button',
    command: 'italic'
  },

  underline: {
    element: 'button',
    command: 'underline'
  },

  strikeThrough: {
    element: 'button',
    command: 'strikeThrough'
  },

  removeFormat: {
    element: 'button',
    command: 'removeFormat'
  },

  justifyLeft: {
    element: 'button',
    command: 'justifyLeft'
  },

  justifyCenter: {
    element: 'button',
    command: 'justifyCenter'
  },

  justifyRight: {
    element: 'button',
    command: 'justifyRight'
  },

  justifyFull: {
    element: 'button',
    command: 'justifyFull'
  },

  h1: {
    element: 'button',
    command: 'formatblock',
    value: 'h1'
  },

  h2: {
    element: 'button',
    command: 'formatblock',
    value: 'h2'
  },

  blockquote: {
    element: 'button',
    command: 'formatblock',
    value: 'blockquote'
  },

  p: {
    element: 'button',
    command: 'formatblock',
    value: 'p'
  },

  pre: {
    element: 'button',
    command: 'formatblock',
    value: 'pre'
  },

  html: {
    element: 'button',
    func: 'toggleHTML'
  },
  
  fontSize: {
    element: 'select',
    command: 'fontSize',
    options: [
      { value: '', text: 'Font size' },
      { value: 1, text: 1 },
      { value: 2, text: 2 },
      { value: 3, text: 3 },
      { value: 4, text: 4 },
      { value: 5, text: 5 },
      { value: 6, text: 6 },
      { value: 7, text: 7 }
    ]
  },

  fontName: {
    element: 'select',
    command: 'fontName',
    options: [
      { value: 'Times', text: 'Font name' },
      { value: 'Raleway', text: 'Raleway' },
      { value: 'Roboto', text: 'Roboto' },
      { value: 'Poppins', text: 'Poppins' },
      { value: 'Cairo', text: 'Cairo' }
    ]
  },

  separator: {
    element: 'styling',
    class: 'styler-separator'
  },

  color: {
    element: 'input',
    type: 'text',
    command: 'foreColor',
    init: Colorpicker,
    initConfig: {
      defaultColor: '#000000',
      mode: 'hex',
      events: {
        beforeSubmit() {
          if (!SELECTION) return;
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(SELECTION);
        },
        afterOpen() {
          if (!window.getSelection().rangeCount) return;
          SELECTION = window.getSelection().getRangeAt(0);
        }
      }
    }
  }
}

export default formats;