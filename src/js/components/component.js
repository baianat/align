export default class component {
  static add () {
    return false;
  }

  remove () {
    if (this.toolbar) {
      this.toolbar.remove();
    }
    this.el.remove();
  }
}
