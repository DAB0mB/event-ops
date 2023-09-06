import { Event } from './event';
import { IListen, Listener } from './listener';
import { IValue, Value, getValue, getLazyValue, kValue, LazyValue } from './value';

export class State<T> implements IListen<T>, IValue<T> {
  private readonly event = new Event<T>();

  get [kValue]() {
    return this.value;
  }

  get value(): T {
    return getLazyValue(this._value);
  }

  set value(value: LazyValue<T> | Value<T> | T) {
    if (value === this._value) return;

    this._value = getValue(value);
    this.emit();
  }

  constructor(private _value: LazyValue<T> | T) {
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

  emit() {
    if (this.event.hasAnyListeners()) {
      this.event.emit(this.value);
    }
  }
}
