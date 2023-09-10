import { equal } from 'node:assert';
import { EventEmitter } from 'node:events';
import test from 'node:test';
import { EmitterEvent, Task, scheduleTask } from '../src';

test('EmitterEvent', async (t) => {
  await t.test('EventEmitter.emit() triggers listeners', async () => {
    const emitter = new EventEmitter();
    const fooEvent = new EmitterEvent<'foo'>('foo');
    const barEvent = new EmitterEvent<'bar'>('bar');
    const bazEvent = new EmitterEvent<'baz'>('baz');
    let callCount = 0;

    fooEvent.listen(emitter, (value) => {
      callCount++;
      equal(value, 'foo');
    });

    barEvent.listen(emitter, (value) => {
      callCount++;
      equal(value, 'bar');
    });

    bazEvent.listen(emitter, (value) => {
      callCount++;
      equal(value, 'baz');
    });

    emitter.emit('foo', 'foo');
    emitter.emit('bar', 'bar');
    emitter.emit('baz', 'baz');

    equal(callCount, 3);
  });

  await t.test('EmitterEvent.emit() triggers listeners', async () => {
    const emitter = new EventEmitter();
    const fooEvent = new EmitterEvent<'foo'>('foo');
    let callCount = 0;

    fooEvent.listen(emitter, (value) => {
      callCount++;
      equal(value, 'foo');
    });

    emitter.on('foo', (value) => {
      callCount++;
      equal(value, 'foo');
    });

    fooEvent.emit(emitter, 'foo');

    equal(callCount, 2);
  });

  await t.test('cleared listeners are not triggered by emit()', async () => {
    const emitter = new EventEmitter();
    const fooEvent = new EmitterEvent<'foo'>('foo');
    let callCount = 0;

    fooEvent.listen(emitter, (value) => {
      callCount++;
      equal(value, 'foo');
    });

    fooEvent.listen(emitter, (value) => {
      callCount++;
      equal(value, 'foo');
    })();

    const fooListener = (value: 'foo') => {
      callCount++;
      equal(value, 'foo');
    };
    fooEvent.listen(emitter, fooListener);
    fooEvent.unlisten(emitter, fooListener);

    emitter.emit('foo', 'foo');

    equal(callCount, 1);
  });

  await t.test('unrelated emitters do not conflict', async () => {
    const emitter1 = new EventEmitter();
    const emitter2 = new EventEmitter();
    const fooEvent = new EmitterEvent<'foo'>('foo');
    let callCount = 0;

    fooEvent.listen(emitter1, (value) => {
      callCount++;
      equal(value, 'foo');
    });

    emitter2.emit('foo', 'foo');

    equal(callCount, 0);

    emitter1.emit('foo', 'foo');

    equal(callCount, 1);
  });

  await t.test('listeners are scheduled as a task', async () => {
    const emitter = new EventEmitter();
    const event = new EmitterEvent('event');
    let callCount = 0;

    event.listen(emitter, () => callCount++);

    scheduleTask(() => {
      event.emit(emitter);
      event.emit(emitter);
      event.emit(emitter);
    });

    equal(callCount, 1);
  });
});
