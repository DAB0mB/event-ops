import { Event } from './event';
import { IListen, Listener } from './listener';
import { IValue, Value, getValue, _kValue } from './value';

export class State<T> implements IListen<T>, IValue<T> {
  [_kValue]: T;
  private readonly event = new Event<T>();

  get value(): T {
    return this[_kValue];
  }

  set value(value: Value<T> | T) {
    if (value === this.value) return;

    this[_kValue] = getValue(value);
    this.event.emit(this.value);
  }

  constructor(value: T) {
    this[_kValue] = value;
  }

  valueOf() {
    return this.value;
  }

  toString() {
    return this.value?.toString();
  }

  listen(listener: Listener<T>) {
    return this.event.listen(listener);
  }

  drop(listener: Listener<T>) {
    this.event.drop(listener);
  }
}
