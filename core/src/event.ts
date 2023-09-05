import { IListen, Listener, ListenerDropFn } from './listener';
import { Task } from './task';

export class Event<T = unknown> implements IListen<T> {
  private readonly tasks = new Map<Listener<T>, Task<T>>();

  constructor() {
  }

  emit(value: T) {
    this.tasks.forEach((task) => {
      task.schedule(value);
    });
  }

  listen(listener: Listener<T>): ListenerDropFn {
    if (!this.tasks.has(listener)) {
      const task = new Task(listener);
      this.tasks.set(listener, task);
    }

    return () => {
      this.drop(listener);
    };
  }

  drop(listener: Listener<T>) {
    const task = this.tasks.get(listener);
    if (!task) return;

    this.tasks.delete(listener);
    task.drop();
  }
}

export const voidEvent = new Event<void>();
Reflect.set(voidEvent, 'emit', function emit() {});
Reflect.set(voidEvent, 'listen', function listen() {});
Reflect.set(voidEvent, 'drop', function drop() {});
