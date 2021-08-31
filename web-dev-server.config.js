// @ts-check
import { storybookPlugin } from '@web/dev-server-storybook';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';
import _json from '@rollup/plugin-json';

import _litcss from 'rollup-plugin-lit-css';

const litcss = fromRollup(_litcss);
const json = fromRollup(_json);


export default /** @type {import('@web/test-runner').TestRunnerConfig} */ {
  nodeResolve: {
    exportConditions: ['default', 'esbuild', 'import'],
    extensions: ['.mjs', '.js', '.ts', '.css', '.graphql'],
  },

  mimeTypes: {
    '**/*.json': 'js',
    '**/src/*.css': 'js',
  },

  plugins: [
    json(),
    litcss(),
    esbuildPlugin({ ts: true }),
    storybookPlugin({ type: 'web-components' }),
  ],
};
