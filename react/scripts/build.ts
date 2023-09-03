import * as esbuild from 'esbuild';
import { resolve } from 'path';
import * as ts from 'typescript';

async function build() {
  try {
    const program = ts.createProgram([resolve(__dirname, '../src/index.ts')], {
      declaration: true,
      emitDeclarationOnly: true,
      declarationDir: resolve(__dirname, '../build'),
    });

    program.emit();

    await esbuild.build({
      entryPoints: [resolve(__dirname, '../src/index.ts')],
      outfile: resolve(__dirname, '../build/index.js'),
      bundle: true,
      sourcemap: true,
      platform: 'node',
      packages: 'external',
      target: 'es6',
    });
  }
  catch (err) {
    console.error(err);
  }
}

void build();
