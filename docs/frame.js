import '@power-elements/stripe-elements';

window.$ = x => document.querySelector(x);
window.$$ = x => document.querySelectorAll(x);

const isLight = matchMedia('(prefers-color-scheme: light)');
const isDark = matchMedia('(prefers-color-scheme: dark)');
const updateStyles = e => se?.updateStyle(e);
isLight.addEventListener('change', updateStyles);
isDark.addEventListener('change', updateStyles);

const PR_UNSUPPORTED = document.createElement('template')
PR_UNSUPPORTED.innerHTML = `
  <p>This browser does not support <a href="https://developer.mozilla.org/en-US/docs/Web/API/Payment_Request_API" target="_blank">Payment Request API</a></p>
`;

const fb = $('fallback-element');
const se = $('stripe-elements');
const spr = $('stripe-payment-request');

addEventListener('message', event => {
  if (event.origin !== window.origin)
    return;

  switch (event.data.action) {
    case 'publishable-key':
      if (se) se.publishableKey = event.data.publishableKey;
      if (fb) fb.publishableKey = event.data.publishableKey;
      if (spr) spr.publishableKey = event.data.publishableKey;
      break;
  }
});

spr?.addEventListener('unsupported', () => {
  document.body.append(window.parent.PR_UNSUPPORTED.content.cloneNode(true));
  spr.hidden = true;
});

for (const el of [se, spr, fb].filter(Boolean)) {
  await el.updateComplete;
  window.parent.postMessage({ action: 'ready' });
}
