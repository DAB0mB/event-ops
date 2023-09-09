import { Task } from './task';
import { ClearFn } from './utils';

export type Listener<T = void> = (value: T) => void;

export interface IListen<T> {
  listen(listener: Listener<T>): ClearFn;
  unlisten(listener: Listener<T>): void;
}

export class Event<T = void> implements IListen<T> {
  private readonly tasks = new Map<Listener<T>, Task<T>>();

  constructor() {
  }

  emit(value: T) {
    this.tasks.forEach((task) => {
      task.schedule(value);
    });
  }

  listen(listener: Listener<T>): ClearFn {
    if (!this.tasks.has(listener)) {
      const task = new Task(listener);
      this.tasks.set(listener, task);
    }

    return () => {
      this.unlisten(listener);
    };
  }

  unlisten(listener: Listener<T>) {
    const task = this.tasks.get(listener);
    if (!task) return;

    this.tasks.delete(listener);
    task.unschedule();
  }
}

export const voidEvent = new Event<void>();
Reflect.set(voidEvent, 'emit', function emit() {});
Reflect.set(voidEvent, 'listen', function listen() {});
Reflect.set(voidEvent, 'unlisten', function unlisten() {});
