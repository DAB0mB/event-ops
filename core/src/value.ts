export const kValue = Symbol('value');

export interface IValue<T> {
  [kValue]: T
}

export class Value<T> implements IValue<T> {
  [kValue]: T;

  constructor(value: T) {
    this[kValue] = value;
  }
}

export class LazyValue<T> {
  private _value: T;

  get value() {
    return this._value ??= getValue(this.get());
  }

  constructor(private readonly get: () => IValue<T> | T) {
  }
}

export function getValue<T>(value: IValue<T> | T) {
  return value != null && typeof value == 'object' && kValue in value ? value[kValue] : value as T;
}

export function getLazyValue<T>(value: IValue<T> | T) {
  return value instanceof LazyValue ? value.value : value;
}
