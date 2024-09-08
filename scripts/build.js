// @ts-check
/* eslint-env node */
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';
import glob from 'glob';
import { litCssPlugin } from 'esbuild-plugin-lit-css';

export async function build({ watch = false } = {}) {
  /** @type{import('esbuild').BuildOptions} */
  const options = {
    entryPoints: [
      'src/stripe-elements.ts',
      'src/stripe-payment-request.ts',
      'src/index.ts',
      ...glob.sync('src/lib/*.ts'),
    ],
    outdir: '.',
    sourcemap: true,
    bundle: true,
    external: ['lit', 'tslib', './lib/*', '@lavadrop/kebab-case', '@lavadrop/camel-case'],
    format: 'esm',
    plugins: [
      litCssPlugin(),
    ],
  };
  if (watch) {
    const ctx = await esbuild.context(options);
    await ctx.watch();
  } else
    await esbuild.build(options);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) { // (B)
  await build({ watch: process.argv.includes('--watch') });
}
