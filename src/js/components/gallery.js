import Component from './component';
import Selection from '../partial/selection';
import { dropzone } from '../partial/elements';
import { stringToDOM } from '../partial/utils';
import fixedPartition from '../partial/fixed-partition';

export default class Gallery extends Component {
  constructor (align, images) {
    super(...arguments);

    this.el = document.createElement('div');
    this.el.classList.add('align-gallery');
    this.images = images;
    this._init();
  }

  static add (align) {
    const position = Selection.range.startContainer;
    const { el, input } = dropzone('gallery');
    position.appendChild(el, position);
    let elem = position.parentNode;
    elem.contentEditable = false;
    return new Promise((resolve, reject) => {
      input.addEventListener('change', () => {
        elem.contentEditable = true;
        el.remove();
        resolve(new Gallery(align, input.files));
      });
    });
    }

  loadImagePromise(src){
      return new Promise(function(resolve,reject) {
        var image = new Image();
        image.src = src; 
        image.onload = function() {
          resolve(image);
        };
        image.onerror = function(e) {
          reject(e);
        };
      })
  }  

  generateImageGrid(options, images) {
      // calculate positioning
    var photoset = document.createElement('div');
    photoset.className = 'imageGrid';
    var result = fixedPartition(images, options);
    // build html
    var elements = [];
    var positions = result.positions;
    for (var i = 0, n = positions.length; i < n; i++) {
      elements.push('<div style="width:' + positions[i].width + 'px;"><img src="'+images[i].src+'" /></div>');
    }
    photoset.innerHTML = elements.join('');
    photoset.style.width = result.width + 'px';
    photoset.style.height = result.height + 'px';
  
    var container = document.createElement('div');
    container.appendChild(photoset);
    this.el.appendChild(container);
  };

  _init () {
    let items = [];
    let loadedImages = [];
    Array.from(this.images).forEach(img => { 
      let url = URL.createObjectURL(img);
      items.push(this.loadImagePromise(url));
      let update = () => {
        this.$align.$bus.emit('changed');
      }
      this.$align.$bus.emit('imageAdded', {
        file: img,
        update
      });
    });

    Promise.all(items).then((results) => {
      results.forEach((image) => {
        loadedImages.push({
          src: image.src,
          width: image.width ,
          height: image.height 
        });
      });
 
      this.generateImageGrid({ 
        containerWidth: this.el.offsetWidth,
        spacing: 20
      }, loadedImages);

    });
    // Array.from(this.images).forEach(img => {
    //   const url = URL.createObjectURL(img);
    //   const imgElm = stringToDOM('<img class="align-gallery-image"/>');
    //   const update = (newSrc) => {
    //     imgElm.src = newSrc;
    //     this.$align.$bus.emit('changed');
    //   }
    //   imgElm.src = url;
    //   imgElm.onload = function(){ console.log(this.width);};
    //   this.el.appendChild(imgElm);
    //   this.$align.$bus.emit('imageAdded', {
    //     file: img,
    //     update
    //   });
    // });
  }

  static schema = {
    icon: 'imageMultiple',
    tooltip: 'Add gallery'
  }
}
