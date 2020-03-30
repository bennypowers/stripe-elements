/* eslint-disable valid-jsdoc */
const { createDefaultConfig } = require('@open-wc/testing-karma');

const merge = require('deepmerge');

/**
 * @param  {import('@types/karma').Config} config
 * @return  {import('@types/karma').Config}
 */
module.exports = config => {
  config.set(merge(createDefaultConfig(config), {
    ...config.autoWatch ? { mochaReporter: { output: 'autowatch' } } : {},
    files: [
      { pattern: config.grep ? config.grep : 'src/**/*.test.js', type: 'module' },
      { pattern: config.grep ? config.grep : 'test/*.test.js', type: 'module' },
    ],
    esm: {
      nodeResolve: true,
      babel: true,
    },
    coverageIstanbulReporter: {
      thresholds: {
        global: {
          statements: 100,
          lines: 100,
          branches: 100,
          functions: 100,
        },
      },
    },
  }));
  return config;
};
