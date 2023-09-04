import { equal } from 'node:assert';
import test from 'node:test';
import * as TestRenderer from 'react-test-renderer';
import { useUpdate } from '../src';

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

    update();

    const updating = new Promise(resolve => setTimeout(resolve));
    await updating;

    equal(updateCount, 2);
  });
});
