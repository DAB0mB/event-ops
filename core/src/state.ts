import { Event } from './event';
import { IListen, Listener } from './listener';
import { IValue, LazyValue, Value, getLazyValue, getValue, kValue } from './value';

export class State<T> implements IListen<State<T>>, IValue<T> {
  private valueCache?: T;
  private lazyValue: LazyValue<T> | T;
  private readonly event = new Event<State<T>>();

  get [kValue]() {
    return this.value;
  }

  get value(): T {
    return this.valueCache ??= getLazyValue(this.lazyValue);
  }

  set value(value: LazyValue<T> | Value<T> | T) {
    if (value === this.lazyValue) return;

    this.lazyValue = getValue(value);
    delete this.valueCache;
    this.emit();
  }

  constructor(value: T) {
    this.lazyValue = value;
    this.valueCache = value;
  }

  valueOf() {
    return this.value;
  }

  toString() {
    return this.value?.toString();
  }

  listen(listener: Listener<State<T>>) {
    return this.event.listen(listener);
  }

  unlisten(listener: Listener<State<T>>) {
    this.event.unlisten(listener);
  }

  emit() {
    this.event.emit(this);
  }
}
