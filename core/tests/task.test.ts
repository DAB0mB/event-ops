import { equal } from 'node:assert';
import test from 'node:test';
import { Task, scheduleTask } from '../src';

test('Task', async (t) => {
  await t.test('scheduled tasks are executed based on their order', () => {
    let message = '';

    new Task(() => {
      scheduleTask(() => {
        message += '2';
      });

      scheduleTask(() => {
        message += '3';
      });

      message += '1';
    }).schedule();

    equal(message, '123');
  });

  await t.test('cleared tasks are not executed', () => {
    let message = '';

    new Task(() => {
      new Task(() => {
        message += '2';
      }).schedule()();

      new Task(() => {
        message += '3';
      }).schedule();

      message += '1';
    }).schedule();

    equal(message, '13');
  });

  await t.test('a task will be executed only once if it was scheduled multiple times before it was flushed', () => {
    let message = '';

    const task = new Task(() => {
      message += '2';
    });

    new Task(() => {
      task.schedule();
      task.schedule();
      message += '1';
    }).schedule();

    task.schedule();

    equal(message, '122');
  });
});
