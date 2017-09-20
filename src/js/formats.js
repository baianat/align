const formats = {
  bold: {
    type: 'button',
    command: 'bold'
  },

  italic: {
    type: 'button',
    command: 'italic'
  },

  underline: {
    type: 'button',
    command: 'underline'
  },

  strikeThrough: {
    type: 'button',
    command: 'strikeThrough'
  },

  justifyLeft: {
    type: 'button',
    command: 'justifyLeft'
  },

  justifyCenter: {
    type: 'button',
    command: 'justifyCenter'
  },

  justifyRight: {
    type: 'button',
    command: 'justifyRight'
  },

  justifyFull: {
    type: 'button',
    command: 'justifyFull'
  },

  h1: {
    type: 'button',
    command: 'formatblock',
    value: 'h1'
  },

  h2: {
    type: 'button',
    command: 'formatblock',
    value: 'h1'
  },

  quote: {
    type: 'button',
    command: 'formatblock',
    value: 'blockquote'
  },

  paragraph: {
    type: 'button',
    command: 'formatblock',
    value: 'p'
  },

  script: {
    type: 'button',
    command: 'formatblock',
    value: 'pre'
  },
  
  size: {
    type: 'select',
    command: 'fontsize',
    options: [
      { value: 1, text: 1 },
      { value: 2, text: 2 },
      { value: 3, text: 3 },
      { value: 4, text: 4 },
      { value: 5, text: 5 },
      { value: 6, text: 6 },
      { value: 7, text: 7 },
    ]
  },

  sperator: {
    type: 'styling',
    class: 'styler-separator'
  }
}

export default formats;


// initStylerActions() {


//   this.styler.color.addEventListener('input', () => this.execute('forecolor', this.styler.color.value))

//   this.styler.addImage.addEventListener('change', () => this.insertImage());

//   this.styler.html.addEventListener('click', () => {
//     this.toggleHTML();
//     this.styler.html.classList.toggle('is-active');
//   });
// }