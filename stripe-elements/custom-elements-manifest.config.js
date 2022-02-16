// @ts-check
import { moduleFileExtensionsPlugin } from 'cem-plugin-module-file-extensions';

export default {
  litelement: true,
  globs: ['src/stripe-*.ts', 'src/index.ts'],
  exclude: ['**/*.d.ts'],
  plugins: [
    moduleFileExtensionsPlugin({
      from: /(?:\.?\/)?src\/(?<pathname>.*)\.(?:t|j)sx?$/,
      to: './$<pathname>.js',
    }),
  ],
};

