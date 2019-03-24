const defaultSettings = require('@open-wc/testing-karma/default-settings.js');
const merge = require('webpack-merge');
const path = require('path');
const { readFileSync } = require('fs');
const babelrc = JSON.parse(readFileSync(path.resolve('./.babelrc'), 'utf-8'));
module.exports = config => {
  const newConf = merge(defaultSettings(config), {
    files: config.grep ? [config.grep] : ['src/*.test.js'],
    webpack: {
      devtool: 'inline-source-map',
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
          },
        ],
      },
    },
  });

  newConf.webpack.module.rules = newConf.webpack.module.rules
    .filter(({ loader }) => !loader.includes('import-meta'));

  newConf.webpack.module.rules
    .find(({ loader }) => loader === 'istanbul-instrumenter-loader')
    .exclude = /node_modules|bower_components|_virtual|\.(spec|test)\.js$/;

  config.set(newConf);

  // console.log(JSON.stringify(newConf, null, 2));

  return config;
};
