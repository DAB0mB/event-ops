import { Effect } from './effect';
import { Listener, Unlistener } from './emitter';
import { Event, EventOptions, kEmitCount } from './event';
import { IValue, getValue, kValue } from './value';

export class Memo<T> extends Event<T> implements IValue<T> {
  [kValue]!: T;
  private readonly effect = new Effect(this.events, { key: this.key, emitter: this.emitter });
  private invalidKey = '';

  get value() {
    if (this.isInvalid()) {
      this[kValue] = getValue(this.getter());
    }

    return this[kValue];
  }

  constructor(private readonly getter: () => IValue<T> | T, private readonly events: Event<unknown>[], options: EventOptions) {
    super(options);
  }

  valueOf() {
    return this.value;
  }

  toString() {
    return this.value?.toString();
  }

  override on(listener: Listener<T>): Unlistener {
    return this.effect.on(() => {
      listener(this.value);
    });
  }

  private isInvalid() {
    let invalidKey = '';

    for (const event of this.events) {
      invalidKey += event[kEmitCount];
    }

    if (invalidKey !== this.invalidKey) {
      this.invalidKey = invalidKey;
      return true;
    }

    return false;
  }
}
