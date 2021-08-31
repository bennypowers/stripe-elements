import commonjs from '@rollup/plugin-commonjs';
import litcss from 'rollup-plugin-lit-css';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import copy from 'rollup-plugin-copy';

// TODO: remove after https://github.com/morbidick/lit-element-notify/issues/30
const d = { ...pkg.dependencies };
delete d['@morbidick/lit-element-notify'];
const deps = Object.keys(d);

export default {
  input: [
    'src/index.js',
    'src/stripe-elements.js',
    'src/stripe-payment-request.js',
  ],
  external: id => deps.some(dep => id.startsWith(dep)),
  output: {
    dir: '.',
    format: 'es',
    chunkFileNames: '[name].js',
    sourcemap: true,
  },
  plugins: [
    resolve({ extensions: ['.js', '.css', '.html'], dedupe: id => id.includes('lit') }),
    copy({ targets: [{ src: 'src/*.d.ts', dest: '.' }] }),
    litcss(),
    commonjs(),
  ],
};
