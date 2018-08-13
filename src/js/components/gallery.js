import Component from './component';
import Selection from '../partial/selection';

import { dropzone } from '../partial/elements';
import { stringToDOM } from '../partial/utils';

export default class Gallery extends Component {
  constructor (align, images) {
    super(...arguments);

    this.el = document.createElement('div');
    this.el.classList.add('align-gallery');
    this._init();
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

  _init () {
    Array.from(this.images).forEach(img => {
      const url = URL.createObjectURL(img);
      const imgElm = stringToDOM('<img class="align-gallery-image"/>');
      const update = (newSrc) => {
        imgElm.src = newSrc;
        this.$align.$bus.emit('changed');
      }
      imgElm.src = url;
      this.el.appendChild(imgElm);
      this.$align.$bus.emit('imageAdded', {
        file: img,
        update
      });
    });
  }

  static schema = {
    icon: 'imageMultiple',
    tooltip: 'Add gallery'
  }
}
