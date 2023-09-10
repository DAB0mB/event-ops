import { equal } from 'node:assert';
import { test } from 'node:test';
import { Event, Task, scheduleTask } from '../src';

test('Event', async (t) => {
  await t.test('emit() triggers listeners', async () => {
    const event = new Event();
    let callCount = 0;

    event.listen(() => callCount++);
    event.listen(() => callCount++);
    event.listen(() => callCount++);

    event.emit();

    equal(callCount, 3);
  });

  await t.test('cleared listeners are not triggered by emit()', async () => {
    const event = new Event();
    let callCount = 0;

    const increaseCallCount = () => callCount++;

    event.listen(() => callCount++);
    event.listen(increaseCallCount);
    const clearIncreaseCallCount = event.listen(() => callCount++);

    event.unlisten(increaseCallCount);
    clearIncreaseCallCount();

    event.emit();

    equal(callCount, 1);
  });

  await t.test('listeners receive value from emit(value)', async () => {
    const event = new Event<number>();
    let value = 0;

    event.listen((_value) => {
      value = _value
    });

    event.emit(1);

    equal(value, 1);
  });

  await t.test('listeners are scheduled as a task', async () => {
    const event = new Event();
    let callCount = 0;

    event.listen(() => callCount++);
    event.listen(() => callCount++);
    event.listen(() => callCount++);

    scheduleTask(() => {
      event.emit();
      event.emit();
      event.emit();
    });

    equal(callCount, 3);
  });

  await t.test('clearped listeners are not triggered by a task', async () => {
    const event = new Event();
    let callCount = 0;

    const clear1 = event.listen(() => callCount++);
    const clear2 = event.listen(() => callCount++);
    event.listen(() => callCount++);

    scheduleTask(() => {
      clear1();

      event.emit();
      event.emit();
      event.emit();

      clear2();
    });

    equal(callCount, 1);
  });
});
