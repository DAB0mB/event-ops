import { IEmitter, Listener, defaultEmitter } from './emitter';

export type EventOptions = {
  key?: string,
  emitter?: IEmitter,
}

export const kEmitCount = Symbol('value');

export class Event<T = unknown> {
  [kEmitCount] = 0;
  readonly key = this.options.key ?? this;
  readonly emitter = this.options.emitter ?? defaultEmitter;

  constructor(private readonly options: EventOptions = {}) {
  }

  emit(value: T) {
    this.emitter.emit(this.key, value);
    this[kEmitCount]++;
  }

  on(listener: Listener<T>) {
    return this.emitter.on(this.key, listener);
  }
}

export const voidEvent = new Event<void>();
Reflect.set(voidEvent, 'emit', function emit() {});
Reflect.set(voidEvent, 'on', function on() {});
