import { EmitterEvent, IEmitter, IListen, IValue, Listener, getValue } from 'event-ops';
import { useCallback, useEffect, useInsertionEffect, useRef, useState } from 'react';

export function useUpdate() {
  const [, setUpdateKey] = useState(0);

  return useCallback(() => {
    setUpdateKey(updateKey => ++updateKey);
  }, []);
}

export function useListener<T>(event: IListen<T>, listener: Listener<T>) {
  const ref = useRef<Listener<T> | null>(null);

  useInsertionEffect(() => {
    ref.current = listener;
  }, [listener]);

  useEffect(() => {
    return event.listen((value: T) => ref.current!(value));
  }, [event]);
}

export function useEmitterListener<T>(emitterEvent: EmitterEvent<T>, emitter: IEmitter, listener: Listener<T>) {
  const ref = useRef<Listener<T> | null>(null);

  useInsertionEffect(() => {
    ref.current = listener;
  }, [listener]);

  useEffect(() => {
    return emitterEvent.listen(emitter, (value: T) => ref.current!(value));
  }, [emitterEvent, emitter]);
}

export function useValue<T>(event: IListen<unknown> & IValue<T>): T {
  useListener(event, useUpdate());

  return getValue(event);
}
