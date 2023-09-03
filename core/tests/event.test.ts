import { test } from 'node:test';
import { Emitter, Event } from '../src';
import { equal } from 'node:assert';

test('Event', async (t) => {
  await t.test('emit() triggers listeners', async () => {
    const event = new Event<void>();
    let callCount = 0;

    event.on(() => callCount++);
    event.on(() => callCount++);
    event.on(() => callCount++);

    event.emit();

    equal(callCount, 3);
  });

  await t.test('disposed listeners are not triggered by emit()', async () => {
    const event = new Event<void>();
    let callCount = 0;

    event.on(() => callCount++);
    event.on(() => callCount++)();
    event.on(() => callCount++)();

    event.emit();

    equal(callCount, 1);
  });

  await t.test('listeners receive value from emit(value)', async () => {
    const event = new Event<number>();
    let value = 0;

    event.on((_value) => {
      value = _value
    });

    event.emit(1);

    equal(value, 1);
  });
});
