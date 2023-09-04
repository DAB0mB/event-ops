import { Dropper, Event, IListen, Listener } from './event';
import { IValue, Value, getValue, kValue } from './value';

export class State<T> implements IListen<T>, IValue<T> {
  [kValue]: T;
  readonly event = new Event<T>();

  get value(): T {
    return this[kValue];
  }

  set value(value: Value<T> | T) {
    if (value === this.value) return;

    this[kValue] = getValue(value);
    this.event.emit(this.value);
  }

  constructor(value: T) {
    this[kValue] = value;
  }

  valueOf() {
    return this.value;
  }

  toString() {
    return this.value?.toString();
  }

  listen(listener: Listener<T>): Dropper {
    return this.event.listen(listener);
  }

  drop(listener: Listener<T>): void {
    this.event.drop(listener);
  }
}
