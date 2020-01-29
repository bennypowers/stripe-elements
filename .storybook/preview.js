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
    a11y: false,
    docs: {
      iframeHeight: '200px'
    }
  });
}

run();
