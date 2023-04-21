export enum Events {

}

interface Listener<T> {
    (event: T): any;
}

// TODO: Добавить нормальные типы
export class EventEmitter {
    private events: any;

    constructor() {
        this.events = {};
    }

    on(type: string, listener: any) {
        this.events[type] = this.events[type] || [];
        this.events[type].push(listener);
    }

    emit(type: string, ...args: any[]) {
        if (this.events[type]) {
            this.events[type].forEach((listener: any) => listener(...args));
        }
    }
}
