export type LazyGetter<T> = () => T;

export class LazyValue<T> {
  constructor(readonly get: LazyGetter<T>) {
  }
}

export function getLazyValue<T>(value: T) {
  return value instanceof LazyValue ? value.get() : value;
}
