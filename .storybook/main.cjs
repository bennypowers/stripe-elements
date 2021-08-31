const json = require('@rollup/plugin-json');

module.exports = {
  // Globs of all the stories in your project
  stories: [
    '../stories/*.stories.{js,md}',
    '../stories/frameworks/*.stories.{js,md}'
  ],

  rollupConfig(config) {
      // add a new plugin to the build
      config.plugins.push(json());

      return config;
  },
};
