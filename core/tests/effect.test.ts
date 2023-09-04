import { test } from 'node:test';
import { Effect, Event } from '../src';
import { equal } from 'node:assert';

test('Effect', async (t) => {
  await t.test('emit() of one of the events triggers listeners', async () => {
    const event1 = new Event<void>();
    const event2 = new Event<void>();
    const event3 = new Event<void>();
    const effect = new Effect([event1, event2, event3]);
    let callCount = 0;

    effect.listen(() => callCount++);

    event1.emit();
    event2.emit();
    event3.emit();

    equal(callCount, 3);
  });

  await t.test('dropped listeners are not triggered by emit()', async () => {
    const event1 = new Event<void>();
    const event2 = new Event<void>();
    const event3 = new Event<void>();
    const effect = new Effect([event1, event2, event3]);
    let callCount = 0;

    const increaseCallCount = () => callCount++;

    effect.listen(() => callCount++);
    effect.listen(increaseCallCount);
    const dropIncreaseCallCount = effect.listen(() => callCount++);

    effect.drop(increaseCallCount);
    dropIncreaseCallCount();

    event1.emit();
    event2.emit();
    event3.emit();

    equal(callCount, 3);
  });
});
