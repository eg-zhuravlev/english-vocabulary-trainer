type Listener = (...args: any[]) => any;

type Events = {
  [key: string]: Listener[];
};

export class EventEmitter {
  private events: Events;

  constructor() {
    this.events = {};
  }

  on(type: string, listener: Listener) {
    this.events[type] = this.events[type] || [];
    this.events[type].push(listener);
  }

  emit(type: string, ...args: any[]) {
    if (this.events[type]) {
      this.events[type].forEach((listener: Listener) => listener(...args));
    }
  }
}
