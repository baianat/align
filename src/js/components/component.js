export default class Component {
  constructor (align, el) {
    this.$align = align;
    this.mode = el ? (el.nodeType === 1 ? 'edit' : 'create') : 'create';
  }

  static add () {
    return false;
  }

  remove () {
    const p = document.createElement('p');
    this.el.parentNode.replaceChild(p, this.el);
    this.el.remove();
    if (this.toolbar) {
      this.toolbar.remove();
    }
  }

  static list = [];
}
