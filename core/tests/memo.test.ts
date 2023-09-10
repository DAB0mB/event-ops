import { Memo, State, Task, scheduleTask } from 'event-ops';
import { equal } from 'node:assert';
import { test } from 'node:test';

test('Memo', async (t) => {
  await t.test('runs lazy computation based on given states', () => {
    const num1 = new State(0);
    const num2 = new State(0);
    let callCount = 0;

    const sum = new Memo(() => {
      callCount++;
      return num1.value + num2.value;
    }, [num1, num2]);

    equal(callCount, 0);
    equal(sum.value, 0);
    equal(callCount, 1);

    num1.value = 100;
    num2.value = 200;

    equal(callCount, 1);
    equal(sum.value, 300);
    equal(callCount, 2);
  });

  await t.test('stops running computation if effect listener cleared', () => {
    const num1 = new State(0);
    const num2 = new State(0);
    let callCount = 0;

    const sum = new Memo(() => {
      callCount++;
      return num1.value + num2.value;
    }, [num1, num2]);

    equal(callCount, 0);
    equal(sum.value, 0);
    equal(callCount, 1);

    sum.clearEffectListener();

    num1.value = 100;
    num2.value = 200;

    equal(callCount, 1);
    equal(sum.value, 0);
    equal(callCount, 1);
  });

  await t.test('emits value to listeners on change', () => {
    const num1 = new State(0);
    const num2 = new State(0);
    let callCount = 0;

    const sum = new Memo(() => {
      return num1.value + num2.value;
    }, [num1, num2]);

    const clearSumListener = sum.listen((value) => {
      callCount++;
      equal(value, 300);
    });

    scheduleTask(() => {
      num1.value = 100;
      num2.value = 200;
    });

    equal(callCount, 1);

    clearSumListener();

    scheduleTask(() => {
      num1.value = 400;
      num2.value = 300;
    });

    equal(callCount, 1);
    equal(sum.value, 700);
  });
});
