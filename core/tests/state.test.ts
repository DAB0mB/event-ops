import { equal } from 'node:assert';
import { test } from 'node:test';
import { State, Value, scheduleTask } from '../src';

test('State', async (t) => {
  await t.test('state is initialized with provided value', async () => {
    const state = new State(1);

    equal(state.value, 1);
  });

  await t.test('value change triggers listeners with state value', async () => {
    const state = new State(1);

    state.listen((value) => {
      equal(value, 2);
      equal(state.value, 2);
    });

    state.value = 2;

    equal(state.value, 2);
  });

  await t.test('listeners are not triggered if value remains the same', async () => {
    const state = new State(1);

    state.listen(() => {
      throw new Error('Listener triggered');
    });

    state.value = 1;

    equal(state.value, 1);
  });

  await t.test('listeners are force-triggered by new value object', async () => {
    const state = new State(1);

    state.listen((value) => {
      equal(value, 1);
      equal(state.value, 1);
    });

    state.value = new Value(1);

    equal(state.value, 1);
  });

  await t.test('dropped listeners are not triggered by value change', async () => {
    const state = new State(1);
    let callCount = 0;

    const increaseCallCount = () => callCount++;

    state.listen(() => callCount++);
    state.listen(increaseCallCount);
    const dropIncreaseCallCount = state.listen(() => callCount++);

    state.drop(increaseCallCount);
    dropIncreaseCallCount();

    state.value = 2;

    equal(callCount, 1);
  });

  await t.test('listeners are scheduled as a task', async () => {
    const state = new State(1);

    state.listen((value) => {
      equal(value, 4);
      equal(state.value, 4);
    });

    scheduleTask(() => {
      state.value = 2;
      state.value = 3;
      state.value = 4;
    });

    equal(state.value, 4);
  });
});
