import Colorpicker from '@baianat/colorpicker';
import Selection from '../selection';

const cmdsSchema = {
  sidebar: {
    element: 'button',
    tooltip: 'Show sidebar',
    func: 'toggleSidebar',
    icon: 'gear'
  },

  bold: {
    element: 'button',
    command: 'bold',
    tooltip: 'Bold',
    shortcut: {
      cmdKey: true,
      key: 'B'
    }
  },

  italic: {
    element: 'button',
    command: 'italic',
    tooltip: 'Italic',
    shortcut: {
      cmdKey: true,
      key: 'I'
    }
  },

  underline: {
    element: 'button',
    command: 'underline',
    tooltip: 'Underline',
    shortcut: {
      cmdKey: true,
      key: 'U'
    }
  },

  strikeThrough: {
    element: 'button',
    command: 'strikeThrough',
    tooltip: 'Strike through'
  },

  undo: {
    element: 'button',
    command: 'undo',
    tooltip: 'Undo',
    shortcut: {
      cmdKey: true,
      key: 'Z'
    }
  },

  redo: {
    element: 'button',
    command: 'redo',
    tooltip: 'Redo',
    shortcut: {
      cmdKey: true,
      shiftKey: true,
      key: 'Z'
    }
  },

  removeFormat: {
    element: 'button',
    command: 'removeFormat',
    tooltip: 'Remove format',
    shortcut: {
      cmdKey: true,
      key: '\\'
    }
  },

  justifyLeft: {
    element: 'button',
    command: 'justifyLeft',
    tooltip: 'Align left',
    shortcut: {
      cmdKey: true,
      key: 'L'
    }
  },

  justifyCenter: {
    element: 'button',
    command: 'justifyCenter',
    tooltip: 'Align center',
    shortcut: {
      cmdKey: true,
      key: 'E'
    }
  },

  justifyRight: {
    element: 'button',
    command: 'justifyRight',
    tooltip: 'Align right',
    shortcut: {
      cmdKey: true,
      key: 'R'
    }
  },

  selectContent: {
    element: 'button',
    tooltip: 'Select all content',
    shortcut: {
      cmdKey: true,
      shiftKey: true,
      key: 'A'
    },
    func (styler) {
      Selection.selectElement(styler.$align.editor);
    }
  },

  justifyFull: {
    element: 'button',
    command: 'justifyFull',
    tooltip: 'Justify full',
    shortcut: {
      cmdKey: true,
      key: 'J'
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

  h3: {
    element: 'button',
    command: 'formatblock',
    value: 'h3',
    tooltip: 'Heading 3'
  },

  h4: {
    element: 'button',
    command: 'formatblock',
    value: 'h4',
    tooltip: 'Heading 4'
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

  indent: {
    element: 'button',
    command: 'indent',
    useCSS: true,
    tooltip: 'Indent',
    shortcut: {
      key: 'TAB'
    }
  },

  outdent: {
    element: 'button',
    command: 'outdent',
    useCSS: true,
    tooltip: 'Outdent',
    shortcut: {
      shiftKey: true,
      key: 'TAB'
    }
  },

  superscript: {
    element: 'button',
    command: 'superscript',
    tooltip: 'Superscript',
    shortcut: {
      cmdKey: true,
      shiftKey: true,
      key: '+'
    }
  },

  subscript: {
    element: 'button',
    command: 'subscript',
    tooltip: 'Subscript',
    shortcut: {
      cmdKey: true,
      key: '='
    }
  },

  pre: {
    element: 'button',
    command: 'formatblock',
    value: 'pre',
    func: 'highlight',
    tooltip: 'Script'
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

  fullscreen: {
    element: 'button',
    func: 'toggleFullScreen',
    tooltip: 'Fullscreen',
    shortcut: {
      cmdKey: true,
      shiftKey: true,
      key: 'F'
    }
  },

  color: {
    element: 'input',
    type: 'text',
    command: 'foreColor',
    tooltip: 'Font color',
    useCSS: true,
    init: Colorpicker,
    initConfig: {
      defaultColor: '#fff',
      mode: 'hex',
      picker: { mode: 'square' },
      guideIcon: `
        <svg viewBox="0 0 24 24">
          <path d="M0 20h24v4H0z"/>
          <path style="fill: currentColor" d="M11 3L5.5 17h2.25l1.12-3h6.25l1.12 3h2.25L13 3h-2zm-1.38 9L12 5.67 14.38 12H9.62z"/>
        </svg>
      `,
      events: {
        beforeSubmit () {
          Selection.selectRange();
        },
        afterOpen () {
          Selection.update();
        },
        afterSelect () {
          Selection.update();
        }
      }
    }
  },

  backColor: {
    element: 'input',
    type: 'text',
    command: 'backColor',
    tooltip: 'Highlight color',
    useCSS: true,
    init: Colorpicker,
    initConfig: {
      defaultColor: '#fdfdfd',
      mode: 'hex',
      picker: { mode: 'square' },
      guideIcon: `
        <svg viewBox="0 0 24 24">
          <path style="fill: currentColor" d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z"/>
          <path d="M0 20h24v4H0z"/>
        </svg>
      `,
      events: {
        beforeSubmit () {
          Selection.selectRange();
        },
        afterOpen () {
          Selection.update();
        },
        afterSelect () {
          Selection.update();
        }
      }
    }
  },

  remove: {
    element: 'button',
    func: 'remove',
    tooltip: 'Remove section',
    icon: 'remove'
  },

  // internal functions don't override it

  _sectionToggleHTML: {
    element: 'button',
    func: 'toggleHTML',
    tooltip: 'Edit as HTMl',
    icon: 'toggleHTML'
  },

  _sectionDuplicate: {
    element: 'button',
    func: 'duplicate',
    tooltip: 'Duplicate section',
    icon: 'duplicate'
  },

  _sectionImage: {
    element: 'file',
    func: 'backgroundImage',
    tooltip: 'Add background image',
    active: 'currentItem.bgImage',
    icon: 'imagePlus'
  },

  _sectionVideo: {
    element: 'file',
    func: 'backgroundVideo',
    tooltip: 'Add background video',
    active: 'currentItem.bgVideo',
    icon: 'videoPlus'
  },

  _sectionRemoveBg: {
    element: 'button',
    func: 'removeBackground',
    tooltip: 'Remove backgrounds',
    icon: 'imageOff'
  },

  _sectionColor: {
    element: 'input',
    type: 'text',
    func: 'backgroundColor',
    tooltip: 'Change background color',
    init: Colorpicker,
    initConfig: {
      defaultColor: '#000000',
      picker: { mode: 'square' },
      mode: 'hex',
      guideIcon: `
        <svg viewBox="0 0 24 24">
          <path d="M0 20h24v4H0z"/>
          <path style="fill: currentColor" d="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z"/>
        </svg>
      `
    }
  }
};

export default cmdsSchema;
