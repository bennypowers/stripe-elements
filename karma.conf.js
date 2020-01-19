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
      coverageExclude: [
        'src/*.test.js',
        'src/**/*.test.js',
        'node_modules',
        'stories/*',
        'test/*',
        'src/lib/strings.test.js',
      ],
    },
  }));
  return config;
};
