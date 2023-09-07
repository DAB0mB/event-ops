import { Event } from './event';
import { IListen, Listener } from './listener';
import { IValue, Value, getValue, getLazyValue, kValue, LazyValue } from './value';

export class State<T> implements IListen<State<T>>, IValue<T> {
  private valueCache?: T;
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

  constructor(private lazyValue: LazyValue<T> | T) {
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

  drop(listener: Listener<State<T>>) {
    this.event.drop(listener);
  }

  emit() {
    this.event.emit(this);
  }
}
