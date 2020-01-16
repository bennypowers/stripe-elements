export const $ = x => document.querySelector(x);
export const $$ = x => [...document.querySelectorAll(x)];

const setKey = key => el =>
  (el.publishableKey = key);

export const setKeys = selector => ({ target: { value } }) =>
  $$(selector)
    .forEach(setKey(value));
