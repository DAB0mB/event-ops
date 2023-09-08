import { IListen, IValue, Listener, getValue } from 'event-ops';
import { useCallback, useEffect, useInsertionEffect, useRef, useState } from 'react';

export function useUpdate() {
  const [, setUpdateKey] = useState(0);

  return useCallback(() => {
    setUpdateKey(updateKey => ++updateKey);
  }, []);
}

export function useListener<T>(event: IListen<T>, fn: Listener<T>) {
  const ref = useRef<Listener<T> | null>(null);

  useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]);

  useEffect(() => {
    return event.listen((value: T) => ref.current!(value));
  }, [event]);
}

export function useValue<T>(event: IListen<unknown> & IValue<T>): T {
  useListener(event, useUpdate());

  return getValue(event);
}
