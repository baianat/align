import Component from './component';
import Selection from '../partial/selection';

import { dropzone } from '../partial/elements';
import { stringToDOM } from '../partial/util';

export default class Gallery extends Component {
  constructor (images) {
    super();
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

  static add () {
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
