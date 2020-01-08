import {
  addParameters,
  addDecorator,
  setCustomElements,
  withA11y
} from '@open-wc/demoing-storybook';

const handleAsJson = r => r.json();

async function run() {

  await fetch(new URL('../custom-elements.json', import.meta.url))
    .then(handleAsJson)
    .then(setCustomElements);

  addDecorator(withA11y);

  addParameters({
    a11y: {
      config: {},
      options: {
        checks: { 'color-contrast': { options: { noScroll: true } } },
        restoreScroll: true
      }
    },
    docs: {
      iframeHeight: '200px'
    }
  });
}

run();
