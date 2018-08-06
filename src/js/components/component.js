export default class Component {
  static add () {
    return false;
  }

  remove () {
    if (this.toolbar) {
      this.toolbar.remove();
    }
    this.el.remove();
  }

  static list = []
}
