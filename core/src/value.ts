export const _kValue = Symbol('value');

export interface IValue<T> {
  [_kValue]: T
}

export class Value<T> implements IValue<T> {
  [_kValue]: T;

  constructor(value: T) {
    this[_kValue] = value;
  }
}

export function getValue<T>(value: IValue<T> | T) {
  return value != null && typeof value == 'object' && _kValue in value ? value[_kValue] : value as T;
}
