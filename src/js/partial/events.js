export default class EventBus {
  constructor () {
    this.events = {};
  }

  on (eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    const idx = this.events[eventName].length;
    this.events[eventName].push(callback);

    return () => {
      this.events[eventName].splice(idx, 1);
    };
  }

  once (eventName, callbackFunc) {
    const idx = this.events.eventName ? this.events[eventName].length : 0;
    const cb = (...args) => {
      callbackFunc(...args);
      this.events[eventName].splice(idx, 1);
    };

    this.on(eventName, cb);
  }

  emit (eventName, args) {
    if (!this.events[eventName] || !this.events[eventName].length) {
      return;
    }

    setTimeout(() => {
      this.events[eventName].forEach(cb => cb(args));
    }, 0);
  }
};
