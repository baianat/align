import Selection from '../selection';

import { dropzone } from '../partial/elements';
export default class Gallery {
  constructor (images) {
    this.el = document.createElement('div');
    this.el.classList.add('align-gallery');
    Array.from(images).forEach(img => {
      const reader = new FileReader();
      reader.onload = (evnt) => {
        const imgElm = `<img class="align-gallery-image" src="${evnt.target.result}"/>`;
        this.el.insertAdjacentHTML('beforeend', imgElm);
      };
      reader.readAsDataURL(img);
    });
  }

  static add (align) {
    const position = Selection.range.startContainer;
    const { el, input } = dropzone('gallery');
    position.appendChild(el, position);
    return new Promise((resolve, reject) => {
      input.addEventListener('change', () => {
        el.remove();
        resolve(new Gallery(input.files));
      });
    });
  }

  static schema = {
    icon: 'imageMultiple',
    tooltip: 'Add gallery'
  }
}
