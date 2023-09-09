import { Event, Listener } from './event';
import { ClearFn } from './utils';

export interface IEmitter {
  on(key: unknown, listener: (...args: any[]) => void): unknown;
  off(key: unknown, listener: (...args: any[]) => void): unknown;
  emit(key: unknown, ...args: unknown[]): unknown;
}

export class EmitterEvent<T = void> {
  private readonly events = new WeakMap<IEmitter, Event<T>>();

  constructor(readonly key: unknown) {}

  listen(emitter: IEmitter, listener: Listener<T>): ClearFn {
    if (!this.events.has(emitter)) {
      const event = new Event<T>();
      this.events.set(emitter, event);

      const scheduleEmitTask = event.emit.bind(event);
      emitter.on(this.key, scheduleEmitTask);
    }

    const event = this.events.get(emitter)!;
    event.listen(listener);

    return () => {
      this.unlisten(emitter, listener);
    };
  }

  unlisten(emitter: IEmitter, listener: Listener<T>) {
    const event = this.events.get(emitter);
    if (!event) return;

    event.unlisten(listener);
  }

  emit(emitter: IEmitter, value: T) {
    emitter.emit(this.key, value);
  }
}
