import { execa } from 'execa';
import { resolve } from 'path';

async function test() {
  await execa('npm', ['run', 'test'], {
    cwd: resolve('core'),
    stdio: 'inherit',
  });
  await execa('npm', ['run', 'test'], {
    cwd: resolve('react'),
    stdio: 'inherit',
  });
}

void test();
