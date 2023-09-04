let currTaskIndex = 0;
let lastTaskIndex = 0;
const tasks = new Map<number, Task>();

export type TaskCallback<T> = (value: T) => void;

export class Task<T = unknown> {
  private value: T;
  private index: number | null = null;

  constructor(private readonly callback: TaskCallback<T>) {
  }

  schedule(value: T) {
    this.value = value;

    if (this.index == null) {
      this.index = lastTaskIndex++;
      tasks.set(this.index, this);
    }

    this.run();

    return () => {
      this.drop();
    };
  }

  drop() {
    if (this.index == null) return;

    tasks.delete(this.index);
    this.index = null;
  }

  private run() {
    if (this.index !== currTaskIndex) return;

    try {
      this.callback(this.value);
    }
    finally {
      this.drop();
      getNextTask()?.run();
    }
  }
}

function getNextTask() {
  const nextTaskIndex = ++currTaskIndex;
  if (!tasks.size) return;

  const task = tasks.get(nextTaskIndex);
  if (task) return task;

  return getNextTask();
}

export function scheduleTask(callback: TaskCallback<void>) {
  return new Task(callback).schedule();
}
