export const $ = x => document.querySelector(x);
export const $$ = x => [...document.querySelectorAll(x)];

export const PK_LS_KEY = '__STRIPE_PUBLISHABLE_KEY__';

export const publishableKey = localStorage.getItem(PK_LS_KEY) || 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX';

const setKey = key => el =>
  (el.publishableKey = key);

export const setKeys = selector => ({ target: { value } }) => {
  localStorage.setItem(PK_LS_KEY, value);
  return $$(selector)
    .forEach(setKey(value));
};


const fieldEntry = field => [field.dataset.ownerProp, field.value];

export const ownerPropsIn = element =>
  Object.fromEntries([...element.querySelectorAll('[data-owner-prop]')].map(fieldEntry));

export const siblingSelector = (selector, element) =>
  element.parentElement.querySelector(selector);

const hide = el => el.style.display = 'none';

export function enableButton({ target: { isComplete, parentElement } }) {
  parentElement.querySelector('mwc-button').disabled = !isComplete;
}

export async function submitThenDisplayResult(event) {
  const parent = event.target.parentElement;
  const viewer = parent.querySelector('json-viewer');
  const element = parent.querySelector('stripe-elements');
  element.billingDetails = ownerPropsIn(parent);
  viewer.object = await element.submit();
  parent.querySelectorAll('mwc-textfield').forEach(hide);
  parent.querySelectorAll('mwc-button').forEach(hide);
}
