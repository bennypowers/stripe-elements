import '@material/mwc-button';
import '@material/mwc-dialog';
import '@power-elements/json-viewer';
import '@material/mwc-textfield';

import '@power-elements/stripe-elements';

window.$ = x => document.querySelector(x);
window.$$ = x => document.querySelectorAll(x);

const FALLBACKS = Object.freeze({
  publishableKey: 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX',
  clientSecret: 'seti_XXXXXXXXXXXXXXXXXXXXXXXX_secret_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
});

const parameters = Object.fromEntries(Array.from($$('meta[data-parameter]'), x => [x.dataset.parameter, x.dataset.value]));
const args = Object.fromEntries(Array.from($$('meta[data-arg]'), x => [x.dataset.arg, x.dataset.value]));

/** @param  {'publishableKey'|'clientSecret'} key */
const get = key => localStorage.getItem(`stripe-elements-demo-${key}`) || args[key] || FALLBACKS[key];
/** @param  {'publishableKey'|'clientSecret'} key */
const set = (key, val) => localStorage.setItem(`stripe-elements-demo-${key}`, val);

const se = $('stripe-elements');
const spr = $('stripe-payment-request');
const viewer = $('json-viewer');
const dialog = $('mwc-dialog');

const isLight = matchMedia('(prefers-color-scheme: light)');
const isDark = matchMedia('(prefers-color-scheme: dark)');
const updateStyles = e => se.updateStyle(e);
isLight.addEventListener('change', updateStyles);
isDark.addEventListener('change', updateStyles);

function update(...iframes) {
  const publishableKey = get('publishableKey');
  const clientSecret = get('clientSecret');

  if (se)
    se.publishableKey = publishableKey;

  if (spr) {
    spr.publishableKey = publishableKey;
    spr.clientSecret = clientSecret;
  }

  for (const iframe of iframes)
    iframe.contentWindow.postMessage({ action: 'publishable-key', publishableKey, clientSecret });
}

for (const input of $$('#inputs mwc-textfield')) {
  const { arg } = input.dataset;
  input.value = get(arg);
  input.addEventListener('change', e => {
    set(arg, e.target.value);
    update(...$$(`[data-update*="${arg}"]`));
  })
}

addEventListener('message', event => {
  if (event.origin !== window.origin)
    return;

  switch (event.data.action) {
    case 'json':
      viewer.object = event.data.jsonViewer;
      dialog.show();
      break;
    case 'ready':
      update(event.source.frameElement);
      break;
  }
});

spr?.addEventListener('unsupported', () => {
  spr.parentNode.insertBefore(PR_UNSUPPORTED.content.cloneNode(true), spr.nextSibling);
  spr.hidden = true;
});

update(...$$('[data-update-key],[data-update-secret]'));
