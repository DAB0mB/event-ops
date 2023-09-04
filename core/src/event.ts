import { IListen, Listener, _getListenerTask, _initListenerTask } from './listener';
import { Task } from './task';

export class Event<T = unknown> implements IListen<T> {
  private readonly tasks = new Set<Task<T>>();

  constructor() {
  }

  emit(value: T) {
    this.tasks.forEach((task) => {
      task.schedule(value);
    });
  }

  listen(listener: Listener<T>) {
    const task = _initListenerTask(listener);
    this.tasks.add(task);

    return () => {
      this.drop(listener);
    };
  }

  drop(listener: Listener<T>) {
    const task = _getListenerTask(listener);
    if (!task) return;

    this.tasks.delete(task);
  }
}

export const voidEvent = new Event<void>();
Reflect.set(voidEvent, 'emit', function emit() {});
Reflect.set(voidEvent, 'listen', function listen() {});
Reflect.set(voidEvent, 'drop', function drop() {});
