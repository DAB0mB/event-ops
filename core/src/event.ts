import { IEmitter, Listener, defaultEmitter } from './emitter';

export type EventOptions = {
  key?: string,
  emitter?: IEmitter,
}

export type EmitOptions = {
  emitter?: IEmitter,
};

export type OnOptions = {
  emitter?: IEmitter,
};

export class Event<T = unknown> {
  readonly key = this.options.key ?? this;
  readonly emitter = this.options.emitter ?? defaultEmitter;

  constructor(private readonly options: EventOptions = {}) {
  }

  emit(value: T, { emitter = this.emitter }: EmitOptions = {}) {
    emitter.emit(this.key, value);
  }

  on(listener: Listener<T>, { emitter = this.emitter }: OnOptions = {}) {
    return emitter.on(this.key, listener);
  }
}

export const voidEvent = new Event<void>();
Reflect.set(voidEvent, 'emit', function emit() {});
Reflect.set(voidEvent, 'on', function on() {});
