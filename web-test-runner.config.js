// @ts-check
import { playwrightLauncher } from '@web/test-runner-playwright';
import { esbuildPlugin } from '@web/dev-server-esbuild';

import { litCss } from 'web-dev-server-plugin-lit-css';

/** @type {import('@web/test-runner').TestRunnerConfig} */
const config = {
  browsers: [
    playwrightLauncher({ product: 'chromium' })
  ],
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
    threshold: {
      statements: 100,
      lines: 100,
      branches: 100,
      functions: 100,
    },
  },

  plugins: [
    litCss(),
    esbuildPlugin({ ts: true }),
  ],
};

export default config;
