import resolve from 'rollup-plugin-node-resolve';
// import litcss from 'rollup-plugin-lit-css';
import babel from 'rollup-plugin-babel';

export default {
  preserveModules: true,
  input: 'src/stripe-elements.js',
  external: id =>
    id.includes('bound-decorator') ||
    id.includes('lit-element') ||
    id.includes('lit-html') ||
    null,
  output: {
    dir: '.',
    format: 'es',
  },
  plugins: [
    resolve({ browser: true, extensions: ['.js', '.css'] }),
    babel({ babelrc: true }),
  ],
};
