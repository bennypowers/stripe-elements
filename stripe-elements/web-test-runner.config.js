// @ts-check
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';

import _litcss from 'rollup-plugin-lit-css';

const litcss = fromRollup(_litcss);

/** @type {import('@web/test-runner').TestRunnerConfig} */
const config = {
  nodeResolve: {
    exportConditions: ['esbuild', 'default', 'import'],
    extensions: ['.ts', '.mjs', '.js', '.css', '.graphql'],
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
    litcss(),
    esbuildPlugin({ ts: true }),
  ],
};

export default config;
