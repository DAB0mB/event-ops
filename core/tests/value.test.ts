import { LazyValue } from 'event-ops';
import { equal } from 'node:assert';
import test, { describe } from 'node:test';

test('LazyValue', async (t) => {
  await t.test('Caches get() result', () => {
    let callCount = 0;

    const lazyValue = new LazyValue(() => {
      return ++callCount;
    });

    lazyValue.value;
    lazyValue.value;
    lazyValue.value;

    equal(lazyValue.value, 1);
    equal(callCount, 1);
  });
});
