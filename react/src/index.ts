import { Event, IValue, getValue } from 'event-ops';
import { useEffect, useInsertionEffect, useRef, useState } from 'react';

let renderCount = 0;

export function useEvent(event: Event) {
  const [, setState] = useState(renderCount);

  useEffect(() => {
    return event.on(() => {
      setState(++renderCount);
    });
  }, [event]);
}

export function useValue<T>(event: Event & IValue<T>) {
  useEvent(event);

  return getValue(event);
}

export function useListener(event: Event, fn: () => void) {
  const ref = useRef(null as typeof fn);

  useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]);

  useEffect(() => {
    return event.on((...args) => ref.current(...args));
  }, [event]);
}
