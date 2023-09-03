import { IEmitter, Listener, emitter } from './emitter';

export class Event {
  constructor(readonly emitter: IEmitter) {
  }

  emit() {
    this.emitter.emit(this);
  }

  on(listener: Listener) {
    return this.emitter.on(this, listener);
  }
}

export const noopEvent = createEvent();

export function createEvent() {
  return new Event(emitter);
}
