// @ts-check
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';

import _commonjs from '@rollup/plugin-commonjs';
import _litcss from 'rollup-plugin-lit-css';

const litcss = fromRollup(_litcss);
const commonjs = fromRollup(_commonjs);

/** @type {import('@web/test-runner').TestRunnerConfig} */
const config = {
  nodeResolve: {
    exportConditions: ['default', 'esbuild', 'import'],
    extensions: ['.mjs', '.js', '.ts', '.css', '.graphql'],
  },

  files: [
    'test/**/*.test.ts',
  ],

  mimeTypes: {
    '**/*.json': 'js',
    '**/src/*.css': 'js',
  },

  coverageConfig: {
    thresholds: {
      global: {
        statements: 100,
        lines: 100,
        branches: 100,
        functions: 100,
      },
    },
  },

  plugins: [
    commonjs({ include: [
      '**/bind-decorator/**/*.js',
      '**/credit-card-type/**/*.js',
    ] }),
    litcss(),
    esbuildPlugin({ ts: true }),
  ],
};

export default config;
