import { equal } from 'node:assert';
import { Task, scheduleTask } from '../src';
import test from 'node:test';

test('Task', async (t) => {
  await t.test('scheduled tasks are executed based on their order', () => {
    let message = '';

    scheduleTask(() => {
      scheduleTask(() => {
        message += '2';
      });

      scheduleTask(() => {
        message += '3';
      });

      message += '1';
    });

    equal(message, '123');
  });

  await t.test('dropped tasks are not executed', () => {
    let message = '';

    scheduleTask(() => {
      scheduleTask(() => {
        message += '2';
      })();

      scheduleTask(() => {
        message += '3';
      });

      message += '1';
    });

    equal(message, '13');
  });

  await t.test('a task will be executed only once if it was scheduled multiple times before it was flushed', () => {
    let message = '';

    const task = new Task<void>(() => {
      message += '2';
    });

    scheduleTask(() => {
      task.schedule();
      task.schedule();
      message += '1';
    });

    task.schedule();

    equal(message, '122');
  });
});
