export const $$ = x => document.querySelectorAll(x);
export const $ = x => document.querySelector(x);
export const setPublishableKey = ({ target: { value: publishableKey } }) =>
  $$('stripe-elements:not(#should-error)').forEach(el => el.publishableKey = publishableKey);
