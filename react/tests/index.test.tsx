import { EmitterEvent, Event, Memo, State, scheduleTask } from 'event-ops';
import { equal } from 'node:assert';
import { EventEmitter } from 'node:events';
import test from 'node:test';
import * as TestRenderer from 'react-test-renderer';
import { useEmitterListener, useListener, useUpdate, useValue } from '../src';

test('useUpdate()', async (t) => {
  await t.test('tirggers component update', async () => {
    let update: ReturnType<typeof useUpdate>;
    let updateCount = 0;

    const TestComponent = () => {
      update = useUpdate();
      updateCount++;

      return null;
    };

    TestRenderer.create(<TestComponent />);

    const mounting = new Promise(resolve => setTimeout(resolve));
    await mounting;

    update!();

    const updating = new Promise(resolve => setTimeout(resolve));
    await updating;

    equal(updateCount, 2);
  });
});

test('useListener()', async (t) => {
  await t.test('tirggers listener on emit()', async () => {
    const event = new Event<string>();
    let updateCount = 0;

    const TestComponent = () => {
      const update = useUpdate();

      useListener(event, (value) => {
        equal(value, 'test');
        update();
      });

      updateCount++;

      return null;
    };

    TestRenderer.create(<TestComponent />);

    const mounting = new Promise(resolve => setTimeout(resolve));
    await mounting;

    event.emit('test');

    const updating = new Promise(resolve => setTimeout(resolve));
    await updating;

    equal(updateCount, 2);
  });

  await t.test('listener is cleared on unmount', async () => {
    const event = new Event<void>();
    let updateCount = 0;

    const TestComponent = () => {
      useListener(event, useUpdate());
      updateCount++;

      return null;
    };

    const renderer = TestRenderer.create(<TestComponent />);

    const mounting = new Promise(resolve => setTimeout(resolve));
    await mounting;

    renderer.unmount();

    const unmounting = new Promise(resolve => setTimeout(resolve));
    await unmounting;

    event.emit();

    const updating = new Promise(resolve => setTimeout(resolve));
    await updating;

    equal(updateCount, 1);
  });
});

test('useEmitterListener()', async (t) => {
  await t.test('tirggers listener on emit()', async () => {
    const emitter = new EventEmitter();
    const event = new EmitterEvent<string>('test');
    let updateCount = 0;

    const TestComponent = () => {
      const update = useUpdate();

      useEmitterListener(event, emitter, (value) => {
        equal(value, 'test');
        update();
      });

      updateCount++;

      return null;
    };

    TestRenderer.create(<TestComponent />);

    const mounting = new Promise(resolve => setTimeout(resolve));
    await mounting;

    event.emit(emitter, 'test');

    const updating = new Promise(resolve => setTimeout(resolve));
    await updating;

    equal(updateCount, 2);
  });

  await t.test('listener is cleared on unmount', async () => {
    const emitter = new EventEmitter();
    const event = new EmitterEvent<void>('test');
    let updateCount = 0;

    const TestComponent = () => {
      useEmitterListener(event, emitter, useUpdate());
      updateCount++;

      return null;
    };

    const renderer = TestRenderer.create(<TestComponent />);

    const mounting = new Promise(resolve => setTimeout(resolve));
    await mounting;

    renderer.unmount();

    const unmounting = new Promise(resolve => setTimeout(resolve));
    await unmounting;

    event.emit(emitter);

    const updating = new Promise(resolve => setTimeout(resolve));
    await updating;

    equal(updateCount, 1);
  });
});

test('useValue()', async (t) => {
  await t.test('yields initial state value', async () => {
    const state = new State(1);
    let value: number;

    const TestComponent = () => {
      value = useValue(state);

      return null;
    };

    TestRenderer.create(<TestComponent />);

    const mounting = new Promise(resolve => setTimeout(resolve));
    await mounting;

    equal(value!, 1);
  });

  await t.test('updates component on state value change', async () => {
    const state = new State(1);
    let value: number;

    const TestComponent = () => {
      value = useValue(state);

      return null;
    };

    TestRenderer.create(<TestComponent />);

    const mounting = new Promise(resolve => setTimeout(resolve));
    await mounting;

    state.value = 2;

    const updating = new Promise(resolve => setTimeout(resolve));
    await updating;

    equal(value!, 2);
  });

  await t.test('works with memo', async () => {
    const num1 = new State(0);
    const num2 = new State(0);
    const sum = new Memo(() => {
      return num1.value + num2.value;
    }, [num1, num2]);
    let value = 0;

    const TestComponent = () => {
      value = useValue(sum);

      return null;
    };

    TestRenderer.create(<TestComponent />);

    const mounting = new Promise(resolve => setTimeout(resolve));
    await mounting;

    scheduleTask(() => {
      num1.value = 100;
      num2.value = 200;
    });

    const updating = new Promise(resolve => setTimeout(resolve));
    await updating;

    equal(value, 300);
  });
});
