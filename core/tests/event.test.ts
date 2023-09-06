import { equal } from 'node:assert';
import { test } from 'node:test';
import { Event, Task } from '../src';

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

  await t.test('dropped listeners are not triggered by emit()', async () => {
    const event = new Event();
    let callCount = 0;

    const increaseCallCount = () => callCount++;

    event.listen(() => callCount++);
    event.listen(increaseCallCount);
    const dropIncreaseCallCount = event.listen(() => callCount++);

    event.drop(increaseCallCount);
    dropIncreaseCallCount();

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

    new Task(() => {
      event.emit();
      event.emit();
      event.emit();
    }).schedule();

    equal(callCount, 3);
  });

  await t.test('dropped listeners are not triggered by a task', async () => {
    const event = new Event();
    let callCount = 0;

    const drop1 = event.listen(() => callCount++);
    const drop2 = event.listen(() => callCount++);
    event.listen(() => callCount++);

    new Task(() => {
      drop1();

      event.emit();
      event.emit();
      event.emit();

      drop2();
    }).schedule();

    equal(callCount, 1);
  });
});
