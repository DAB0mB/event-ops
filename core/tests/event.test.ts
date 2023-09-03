import { test } from 'node:test';
import { Emitter, Event } from '../src';
import { equal } from 'node:assert';

test('Event', async (t) => {
  await t.test('emit() triggers listeners', async () => {
    const emitter = new Emitter();
    const event = new Event(emitter);
    let callCount = 0;

    event.on(() => callCount++);
    event.on(() => callCount++);
    event.on(() => callCount++);

    emitter.emit(event);

    equal(callCount, 3);
  });

  await t.test('disposed listeners are not triggered by emit()', async () => {
    const emitter = new Emitter();
    const event = new Event(emitter);
    let callCount = 0;

    event.on(() => callCount++);
    event.on(() => callCount++)();
    event.on(() => callCount++)();

    emitter.emit(event);

    equal(callCount, 1);
  });

  await t.test('listeners are not triggered by irrelevant emit()', async () => {
    const emitter = new Emitter();
    const event = new Event(emitter);
    let callCount = 0;

    event.on(() => callCount++);
    event.on(() => callCount++);
    event.on(() => callCount++);

    emitter.emit('event');

    equal(callCount, 0);
  });
});
