import { setCustomElementsManifest } from '@web/storybook-prebuilt/web-components.js';
import { useArgs, useEffect } from '@web/storybook-prebuilt/client-api.js';
import cem from '../custom-elements.json';

setCustomElementsManifest(cem);

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

const listeners = new WeakSet();

export const decorators = [
  story => {
    const [, updateArgs] = useArgs();
    useEffect(() => {
      for (const input of document.querySelectorAll('[data-arg]')) {
        if (listeners.has(input))
          return;
        // prevent storybook ui from responding to keyevents in this input
        input.addEventListener('keyup', e => e.stopPropagation());
        input.addEventListener('keydown', e => e.stopPropagation());
        // update the args
        input.addEventListener('change', e => {
          updateArgs({ [e.target.dataset.arg]: e.target.value });
          localStorage.setItem(`stripe-elements-demo-${e.target.dataset.arg}`, e.target.value);
        });
        listeners.add(input);
      }
    });
    return story();
  },
];
