import OptionsBar from './optionsBar';

let ID = 0;

class Section {
  constructor (content, position) {
    this.generateEl(content);
    this.id = ID++;
    this.el.addEventListener('click', () => {
      Section.optionsBar.active(this.el, this.id);
    });
    if (position) {
      Section.$align.editor.insertBefore(this.el, position)
      return;
    }
    Section.$align.editor.appendChild(this.el);
  }

  static config (align, optionsBar) {
    this.$align = align;
    this.optionsBar = new OptionsBar(align, {
      element: 'section',
      options: ['normal', 'full'],
      position: 'center-top',
      backgroundImage: true,
      backgroundColor: true,
      sorting: true,
      toggleHTML: true
    });
  }

  generateEl (content) {
    if (content && content.classList.contains('align-section')) {
      const contentDiv = content.querySelector('.align-content') || document.createElement('div')
      contentDiv.classList.add('align-content');
      contentDiv.contentEditable = true;
      this.el = content;
      contentDiv.innerHTML = this.el.innerHTML;
      this.el.innerHTML = '';
      this.el.appendChild(contentDiv);
      if (!content.querySelector('.align-newSection')) {
        this.el.insertAdjacentElement('afterBegin', this.newSectionButton());
      }
      return;
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('align-content');
    contentDiv.contentEditable = true;

    this.el = document.createElement('div');
    this.el.classList.add('align-section');
    this.el.appendChild(this.newSectionButton());
    this.el.appendChild(contentDiv);
    if (content) {
      contentDiv.appendChild(content);
    }
    if (!content) {
      contentDiv.insertAdjacentHTML('afterBegin', '<p></p>');
    }
   
  }

  newSectionButton () {
    const btn = document.createElement('button');
    btn.classList.add('align-newSection');
    btn.addEventListener('click', () => new Section('', this.el));
    btn.contentEditable = false;
    return btn
  }
}

export default Section;