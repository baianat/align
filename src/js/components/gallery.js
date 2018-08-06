import Component from './component';
import Selection from '../selection';

import { dropzone } from '../partial/elements';
import { stringToDOM } from '../partial/util';

export default class Gallery extends Component {
  constructor (align, images) {
    super();
    this.$align = align;
    this.el = document.createElement('div');
    this.el.classList.add('align-gallery');
    Array.from(images).forEach(img => {
      const url = URL.createObjectURL(img);
      const imgElm = stringToDOM('<img class="align-gallery-image"/>');
      const update = (newSrc) => {
        imgElm.src = newSrc;
      }
      imgElm.src = url;
      this.el.appendChild(imgElm);
      this.$align.$bus.emit('imageAdded', {
        file: img,
        update
      });
    });
  }

  static add (align) {
    const position = Selection.range.startContainer;
    const { el, input } = dropzone('gallery');
    position.appendChild(el, position);
    return new Promise((resolve, reject) => {
      input.addEventListener('change', () => {
        el.remove();
        resolve(new Gallery(align, input.files));
      });
    });
  }

  static schema = {
    icon: 'imageMultiple',
    tooltip: 'Add gallery'
  }
}
