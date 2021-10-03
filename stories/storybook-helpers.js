import { html } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { camel } from '../src/lib/strings';
import { useEffect } from '@web/storybook-prebuilt/client-api.js';

import '@material/mwc-button';
import '@material/mwc-dialog';
import '@power-elements/json-viewer';
import '@material/mwc-textfield';

export const publishableKey =
  localStorage.getItem(`stripe-elements-demo-publishableKey`) || 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX';

export const clientSecret =
  localStorage.getItem(`stripe-elements-demo-clientSecret`) || 'seti_XXXXXXXXXXXXXXXXXXXXXXXX_secret_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

const display = ctx => {
  const parent = document.getElementById(`story--${ctx.id}`);
  const element = parent.querySelector(ctx.parameters.component);
  parent.querySelector('json-viewer').object = element[camel(element.generate)];
  parent.querySelector('mwc-dialog').show();
};

const diag = html`
<mwc-dialog>
  <json-viewer></json-viewer>
  <mwc-button slot="primaryAction" dialogAction="cancel">OK</mwc-button>
</mwc-dialog>
`;

const onSubmit = tagName => async e => {
  const parent = e.target.closest('[id*="story--"]');
  const element = parent.querySelector(tagName);
  element.billingDetails = Object.fromEntries(
    Array.from(
      parent.querySelectorAll('[data-owner-prop]'),
      ({ dataset, value }) => [dataset.ownerProp, value]
    )
  );

  try {
    e.target.disabled = true;
    await element.submit();
    display(ctx);
  } finally {
    e.target.disabled = false;
  }
};

export const CardholderInputs = ({
  label = 'Generate',
  cardholderName,
  cardholderEmail,
  cardholderPhone,
}, { parameters }) => {
  return html`
<div class="cardholder-inputs">
  <mwc-textfield outlined label="Cardholder Name" data-owner-prop="name" value="${ifDefined(cardholderName)}"></mwc-textfield>
  <mwc-textfield outlined label="Cardholder Email" data-owner-prop="email" value="${ifDefined(cardholderEmail)}"></mwc-textfield>
  <mwc-textfield outlined label="Cardholder Phone" data-owner-prop="phone" value="${ifDefined(cardholderPhone)}"></mwc-textfield>
  <mwc-button outlined @click="${onSubmit(parameters.component)}" label="${label}"></mwc-button>
</div>
  `;
};

export const cardholderDecorator = (story, ctx) =>
  html`${[
    story(),
    CardholderInputs(ctx.args, ctx),
    diag,
  ]}`;

export const paymentRequestDecorator = (story, ctx) => {
  useEffect(() => {
    const parent = document.getElementById(`story--${ctx.id}`) ?? document;
    const element = parent.querySelector(ctx.parameters.component);
    element.addEventListener('success', () => display(ctx));
    element.addEventListener('fail', () => display(ctx));
  });
  return html`${[story(), diag]}`;
};
