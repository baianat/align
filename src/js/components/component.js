export default class Component {
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
