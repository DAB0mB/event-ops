import { execa } from 'execa';
import { resolve } from 'path';

async function test() {
  await execa('npm', ['run', 'test'], {
    cwd: resolve('packages/core'),
    stdio: 'inherit',
  });
  await execa('npm', ['run', 'test'], {
    cwd: resolve('packages/react'),
    stdio: 'inherit',
  });
}

void test();
