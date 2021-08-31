import { setCustomElements } from '@web/storybook-prebuilt/web-components.js';
import cem from '../custom-elements.json';

setCustomElements(cem);

export const parameters = {
  controls: { expanded: true },
  docs: {
    inlineStories: true,
    source: {
      type: 'dynamic',
      language: 'html',
    },
  },
};
