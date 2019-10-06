export default class Dep {
  static target = null;

  static watcher (func) {
    Dep.target = func;
    Dep.target();
    Dep.target = null;
  }

  constructor () {
    this.subscribers = [];
  }

  depend () {
    if (Dep.target && !this.subscribers.includes(Dep.target)) {
      this.subscribers.push(Dep.target);
    }
  }

  notify (oldVal) {
    this.subscribers.forEach(sub => sub(oldVal));
  }
}
