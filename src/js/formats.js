import picker from '@baianat/colorpicker';

let SELECTED = null;

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
    value: 'h1'
  },

  quote: {
    element: 'button',
    command: 'formatblock',
    value: 'blockquote'
  },

  paragraph: {
    element: 'button',
    command: 'formatblock',
    value: 'p'
  },

  script: {
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
    command: 'fontsize',
    options: [
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
      { value: 'Raleway', text: 'Raleway' },
      { value: 'Roboto', text: 'Roboto' },
      { value: 'Poppins', text: 'Poppins' },
      { value: 'Cairo', text: 'Cairo' }
    ]
  },

  sperator: {
    element: 'styling',
    class: 'styler-separator'
  },

  color: {
    element: 'input',
    type: 'text',
    command: 'foreColor',
    init: picker,
    initConfig: {
      defaultColor: '#000000',
      mode: 'hex',
      events: {

      }
    }
  },

  addImage: {
    element: 'custom',
    data: {
      button: document.createElement('button'),
      input: document.createElement('input'),
      icon: 
        `<svg class="icon">
          <use xlink:href="dist/svg/symbols.svg#icon-image"></use>
        </svg>`
    },
    create() {
      const button = this.data.button;
      const input = this.data.input;
      const icon = this.data.icon;
      
      button.classList.add('styler-button');
      button.appendChild(input);
      button.insertAdjacentHTML('beforeend', icon);
      input.classList.add('styler-input');
      input.type = 'file';
      input.id = 'addImage';
      input.addEventListener('input', () => this.action());

      return button;
    },
    action() {
      const file = this.data.input.files[0];
      if (!file) return;
      const imageURL = URL.createObjectURL(file);
      const img = document.createElement('img');
      let selectedPosition;

      img.src = imageURL;
      img.classList.add('editor-image');
      selectedPosition = window.getSelection().getRangeAt(0);
      selectedPosition.insertNode(img);
    }
  }
}

export default formats;