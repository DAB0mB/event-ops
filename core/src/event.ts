export type Listener<T = unknown> = (value: T) => void;
export type Dropper = () => void;

export interface IListen<T> {
  listen(listener: Listener<T>): Dropper;
  drop(listener: Listener<T>): void;
}

export class Event<T = unknown> implements IListen<T> {
  private readonly listeners = new Set<Listener<T>>();

  constructor() {
  }

  emit(value: T) {
    this.listeners.forEach((listener) => {
      listener(value);
    });
  }

  listen(listener: Listener<T>): Dropper {
    this.listeners.add(listener);

    return () => {
      this.drop(listener);
    };
  }

  drop(listener: Listener<T>) {
    this.listeners.delete(listener);
  }
}

export const voidEvent = new Event<void>();
Reflect.set(voidEvent, 'emit', function emit() {});
Reflect.set(voidEvent, 'listen', function listen() {});
Reflect.set(voidEvent, 'drop', function drop() {});
