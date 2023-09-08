import { ClearFn } from './utils';

let currTaskIndex = 0;
let lastTaskIndex = 0;
const tasks = new Map<number, Task<unknown>>();

export type TaskCallback<T = void> = (value: T) => void;

export class Task<T = void> {
  private value: T;
  private index: number | null = null;

  constructor(private readonly callback: TaskCallback<T>) {
  }

  schedule(value: T): ClearFn {
    this.value = value;

    if (this.index == null) {
      this.index = lastTaskIndex++;
      tasks.set(this.index, this);
    }

    this.run();

    return () => {
      this.unlisten();
    };
  }

  unlisten() {
    if (this.index == null) return;

    tasks.delete(this.index);
    this.index = null;
  }

  private run() {
    const nextTask = getNextTask();
    if (nextTask !== this) return;

    try {
      this.callback(this.value);
    }
    finally {
      this.unlisten();
      getNextTask()?.run();
    }
  }
}

function getNextTask() {
  if (!tasks.size) return;

  while (currTaskIndex <= lastTaskIndex) {
    const task = tasks.get(currTaskIndex);
    if (task) return task;

    ++currTaskIndex;
  }

  console.warn(`currentTaskIndex (${currTaskIndex}) exceeded lastTaskIndex (${lastTaskIndex}); this is not right`);
}
