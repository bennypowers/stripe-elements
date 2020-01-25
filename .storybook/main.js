module.exports = {
  // Globs of all the stories in your project
  stories: ['../stories/*.stories.{js,mdx}', '../stories/frameworks/*.stories.{js,mdx}'],

  // Configuration for es-dev-server (start-storybook only)
  esDevServer: {
    nodeResolve: true,
    open: true,
  },

  // Rollup build output directory (build-storybook only)
  outputDir: '../storybook-static',

  // Configuration for rollup (build-storybook only)
  rollup: config => {
    return config;
  },
};
