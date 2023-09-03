import { Effect, EffectOptions } from './effect';
import { Event } from './event';
import { IValue, getValue, kValue } from './value';

export type MemoOptions = EffectOptions;

export class Memo<T> extends Effect implements IValue<T> {
  [kValue]!: T;
  private invalid = true;

  get value() {
    if (this.invalid) {
      this.invalid = false;
      this[kValue] = getValue(this.getter());
    }

    return this[kValue];
  }

  constructor(private readonly getter: () => IValue<T> | T, events: Event<unknown>[], options: MemoOptions) {
    super(events, options);
  }

  valueOf() {
    return this.value;
  }

  toString() {
    return this.value?.toString();
  }

  emit() {
    this.invalid = true;
    super.emit();
  }
}
