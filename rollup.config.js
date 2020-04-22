import commonjs from '@rollup/plugin-commonjs';
import litcss from 'rollup-plugin-lit-css';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import copy from 'rollup-plugin-copy';

const deps = Object.keys(pkg.dependencies);
const external = id =>
  id !== '@morbidick/lit-element-notify' &&
  id.startsWith('lit-html') ||
  id.startsWith('@babel/runtime') ||
  deps.includes(id);

export default {
  input: [
    'src/index.js',
    'src/stripe-elements.js',
    'src/stripe-payment-request.js',
  ],
  external,
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
