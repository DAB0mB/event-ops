import { Event } from './event';
import { IListen, Listener } from './listener';
import { IValue, LazyValue, Value, getLazyValue, getValue, kValue } from './value';

export class State<T> implements IListen<T>, IValue<T> {
  private valueCache?: T;
  private lazyValue: LazyValue<T> | T;
  private listenersCount = 0;
  private readonly event = new Event<T>();

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
    return this.value?.valueOf();
  }

  toString() {
    return this.value?.toString();
  }

  listen(listener: Listener<T>) {
    this.listenersCount++;

    return this.event.listen(listener);
  }

  unlisten(listener: Listener<T>) {
    this.listenersCount--;

    this.event.unlisten(listener);
  }

  emit() {
    if (!this.listenersCount) return;

    this.event.emit(this.value);
  }
}
