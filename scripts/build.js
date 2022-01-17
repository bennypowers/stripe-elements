// @ts-check
import * as esbuild from 'esbuild';
import glob from 'glob';
import { litCssPlugin } from 'esbuild-plugin-lit-css';

export async function build({ watch = false } = {}) {
  await esbuild.build({
    entryPoints: [
      'src/stripe-elements.ts',
      'src/stripe-payment-request.ts',
      'src/index.ts',
      ...glob.sync('src/lib/*.ts'),
    ],
    outdir: '.',
    watch,
    sourcemap: true,
    bundle: true,
    external: ['lit', 'tslib', './lib/*', '@lavadrop/kebab-case', '@lavadrop/camel-case'],
    format: 'esm',
    plugins: [
      litCssPlugin(),
    ],
  });
}

build({ watch: process.argv.includes('--watch') });
