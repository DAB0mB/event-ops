export class LazyValue<T> {
  constructor(readonly get: () => T) {
  }
}

export function getLazyValue<T>(value: T) {
  return value instanceof LazyValue ? value.get() : value;
}
