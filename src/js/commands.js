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
    value: 'pre',
    func: 'highlight'
  },

  html: {
    element: 'button',
    func: 'toggleHTML'
  },

  insertColumns: {
    element: 'button',
    func() {
      
    }
  },

  fontSize: {
    element: 'select',
    command: 'fontSize'
  },

  font: {
    element: 'select',
    classPrefix: 'font',
    init: 'applyFont',
    func(schema, selectedValue) {
      document.execCommand('styleWithCSS', false, true);
      document.execCommand('fontName', false, selectedValue);
      document.execCommand('styleWithCSS', false, false);
    }
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
  }
}

export default commands;
