// @ts-check
import { readmePlugin } from 'cem-plugin-readme';
import { moduleFileExtensionsPlugin } from 'cem-plugin-module-file-extensions';

export default {
  globs: ['src/stripe-*.ts', 'src/index.ts'],
  exclude: ['**/*.d.ts'],
  plugins: [
    moduleFileExtensionsPlugin({
      from: /(?:\.?\/)?src\/(?<pathname>.*)\.(?:t|j)sx?$/,
      to: './$<pathname>.js',
    }),
    readmePlugin({
      head: 'src/README.template.md',
      headerLevel: 3,
    }),
  ],
};
