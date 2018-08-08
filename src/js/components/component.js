export default class Component {
  constructor (el) {
    this.$align = Component.$align;
    this.mode = el ? (el.nodeType === 1 ? 'edit' : 'create') : 'create';
  }

  static config (align) {
    this.$align = align;
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
