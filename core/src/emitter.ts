export type Listener<T = unknown> = (value: T) => void;
export type Unlistener = () => void;

export interface IEmitter {
  emit(key: unknown, value?: unknown): void;
  on(key: unknown, listener: Listener): Unlistener;
}

export class Emitter implements IEmitter {
  private readonly listeners = new Map<unknown, Set<Listener>>();

  emit(key: unknown, value?: unknown) {
    const listeners = this.listeners.get(key);
    if (!listeners) return;

    for (const listener of Array.from(listeners)) {
      listener(value);
    }
  }

  on(key: unknown, listener: Listener): Unlistener {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }

    const listeners = this.listeners.get(key)!;
    listeners.add(listener);

    return () => {
      listeners.delete(listener);

      if (!listeners.size) {
        this.listeners.delete(key);
      }
    };
  }
}

export const defaultEmitter = new Emitter();
