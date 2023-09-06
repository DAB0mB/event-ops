import { equal } from 'node:assert';
import { test } from 'node:test';
import { LazyValue, State, Value } from '../src';

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

  await t.test('computes value lazily if LazyValue was used', async () => {
    const num1State = new State(0);
    const num2State = new State(0);
    let callCount = 0;

    const getSum = () => new LazyValue(() => {
      callCount++;
      return num1State.value + num2State.value;
    });

    const sumState=  new State(getSum());
    num1State.value = 100;
    num2State.value = 200;

    sumState.value;
    sumState.value;
    sumState.value;

    equal(sumState.value, 300);
    equal(callCount, 1);

    sumState.value = getSum();
    num1State.value = 200;
    num2State.value = 300;

    sumState.value;
    sumState.value;
    sumState.value;

    equal(sumState.value, 500);
    equal(callCount, 2);
  });
});
