// @ts-check
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';
import { storybookPlugin } from '@web/dev-server-storybook';

import _litcss from 'rollup-plugin-lit-css';

const litcss = fromRollup(_litcss);

/** @type {import('@web/test-runner').TestRunnerConfig} */
const config = {
  nodeResolve: {
    exportConditions: ['default', 'esbuild', 'import'],
    extensions: ['.mjs', '.js', '.ts', '.css', '.graphql'],
  },

  mimeTypes: {
    '**/*.json': 'js',
    '**/src/*.css': 'js',
  },

  plugins: [
    litcss(),
    esbuildPlugin({ ts: true }),
    storybookPlugin({ type: 'web-components' }),
  ],
};

export default config;
