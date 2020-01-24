import commonjs from '@rollup/plugin-commonjs';
import litcss from 'rollup-plugin-lit-css';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const deps = Object.keys(pkg.dependencies);
const external = id =>
  id !== '@morbidick/lit-element-notify' &&
  id.startsWith('lit-html') ||
  id.startsWith('@babel/runtime') ||
  deps.includes(id);

export default {
  input: [
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
    babel({ externalHelpers: true, runtimeHelpers: true, babelrc: true }),
    litcss(),
    commonjs(),
    resolve(),
  ],
};
