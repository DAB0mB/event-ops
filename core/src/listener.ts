import { Task, TaskCallback } from './task';

const listenerTasks = new WeakMap<Listener, Task>();

export type Listener<T = unknown> = Task<T> | TaskCallback<T>;

export interface IListen<T> {
  listen(listener: Listener<T>): () => void;
  drop(listener: Listener<T>): void;
}

export function _initListenerTask<T>(listener: Listener<T>): Task<T> {
  if (listener instanceof Task) return listener;

  if (!listenerTasks.get(listener)) {
    const task = new Task<T>(listener);
    listenerTasks.set(listener, task);
  }

  return listenerTasks.get(listener) as Task<T>;
}

export function _getListenerTask<T>(listener: Listener<T>) {
  return listenerTasks.get(listener) as Task<T> | undefined;
}
