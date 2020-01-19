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
