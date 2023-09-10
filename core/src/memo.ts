import { Effect } from './effect';
import { IListen, Listener } from './event';
import { LazyGetter, LazyValue } from './lazy_value';
import { State } from './state';
import { ClearFn } from './utils';
import { IValue, kValue } from './value';

export class Memo<T> implements IListen<T>, IValue<T> {
  private readonly state = new State<T>(null as T);
  private readonly effect = new Effect(this.events);

  readonly clearEffectListener = this.effect.listen(() => {
    this.state.value = new LazyValue(this.get);
  });

  get [kValue]() {
    return this.value;
  }

  get value(): T {
    return this.state.value;
  }

  constructor(
    private readonly get: LazyGetter<T>,
    private readonly events: IListen<unknown>[],
  ) {
    this.effect.emit();
  }

  valueOf() {
    return this.value?.valueOf();
  }

  toString() {
    return this.value?.toString();
  }

  listen(listener: Listener<T>): ClearFn {
    this.state.listen(listener);

    return () => {
      this.unlisten(listener);
    };
  }

  unlisten(listener: Listener<T>) {
    this.state.unlisten(listener);
  }

  emit() {
    this.state.emit();
  }
}
