import Colorpicker from '@baianat/colorpicker';
import Selection from './selection';

const commands = {
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
      disableLum: true,
      events: {
        beforeSubmit() {
          console.log('submit', Selection.selectedRange);
          Selection.updateSelection(Selection.selectedRange);
        },
        afterOpen() {
          Selection.selectedRange = window.getSelection().getRangeAt(0);
        },
        afterSelect() {
          if (window.getSelection().rangeCount && window.getSelection().anchorNode.nodeType === 3) {
            Selection.selectedRange = window.getSelection().getRangeAt(0);
          }
        }
      }
    }
  }
}

export default commands;
