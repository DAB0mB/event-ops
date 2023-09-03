import { Event, EventOptions } from './event';
import { IValue, Value, getValue, kValue } from './value';

export type StateOptions = EventOptions;

export class State<T> extends Event<void> implements IValue<T> {
  [kValue]: T;

  get value(): T {
    return this[kValue];
  }

  set value(value: Value<T> | T) {
    if (value === this.value) return;

    this[kValue] = getValue(value);
    this.emit();
  }

  constructor(value: T, options: StateOptions) {
    super(options);

    this[kValue] = value;
  }

  valueOf() {
    return this.value;
  }

  toString() {
    return this.value?.toString();
  }
}
