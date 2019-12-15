const { createDefaultConfig } = require('@open-wc/testing-karma');

const merge = require('deepmerge');

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: config.grep ? [config.grep] : ['src/*.test.js'],
      esm: {
        nodeResolve: true,
        babel: true,
      }
    })
  );

  return config;
};
