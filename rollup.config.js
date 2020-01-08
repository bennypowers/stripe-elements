import resolve from 'rollup-plugin-node-resolve';
// import litcss from 'rollup-plugin-lit-css';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/stripe-elements.js',
  external: id =>
    id.includes('lit-element') ||
    id.includes('lit-html') ||
    null,
  output: {
    dir: '.',
    format: 'es',
  },
  plugins: [
    resolve(),
    babel({
      presets: [
        ['@babel/preset-env', { 'targets': { 'browsers': [
          'last 1 chrome versions',
          'last 1 firefox versions',
          'last 1 safari versions',
        ] } }],
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
      ],
    }),
  ],
};
