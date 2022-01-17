```js script
import { LitElement, html } from 'lit' ;
import { ifDefined } from 'lit/directives/if-defined.js';
import { cardholderDecorator, publishableKey } from './storybook-helpers.js';

import '../stripe-elements.js';

export default {
  title: 'Elements/Stripe Elements',
  component: 'stripe-elements',
  args: {
    publishableKey,
    cardholderName: 'Mr. Man',
    cardholderEmail: 'mr@man.email',
    cardholderPhone: '555 555 5555',
  },
}

```

# `<stripe-elements>` Web Component

The `<stripe-elements>` custom element is an easy way to use stripe.js in your web app,
across [frameworks](/?path=/docs/framework-examples-angular--stripe-elements), or inside shadow roots.
Add the element to your page with the `publishable-key` attribute set to your
[Stripe publishable key](https://dashboard.stripe.com/account/apikeys).
You can also set the `publishableKey` DOM property using JavaScript.

<mwc-textfield data-arg="publishableKey" label="Publishable Key" value={publishableKey}></mwc-textfield>

> **Careful!** never add your **secret key** to an HTML page, only publish your **publishable key**.

Once you've set the `publishable-key` attribute (or the `publishableKey` DOM property), Stripe will create a Stripe Card Element on your page.

## Create a PaymentMethod

```js preview-story
export const GenerateAPaymentMethod = args => {
  return html`
    <stripe-elements
        generate="payment-method"
        publishable-key="${ifDefined(args.publishableKey)}"
    ></stripe-elements>
  `;
}
GenerateAPaymentMethod.height = '220px';
GenerateAPaymentMethod.withSource = 'open';
GenerateAPaymentMethod.decorators = [cardholderDecorator];
GenerateAPaymentMethod.args = {
  label: 'Generate PaymentMethod',
};
```

<ArgsTable story="GenerateAPaymentMethod" />

## Create a Source

```js preview-story
export const GenerateASource = args => html`
  <stripe-elements
      generate="source"
      publishable-key="${ifDefined(args.publishableKey)}"
  ></stripe-elements>
`;
GenerateASource.height = '220px';
GenerateASource.decorators = [cardholderDecorator];
GenerateASource.args = {
  label: 'Generate a Source',
}
```

## Create a Token

Once you're set your publishable key and Stripe has instantiated (listen for the `stripe-ready` event if you need to know exactly when this happens),
you may generate a token from the filled-out form by calling the `createToken()` method.

```js preview-story
export const GenerateAToken = args => html`
  <stripe-elements generate="token" publishable-key="${ifDefined(args.publishableKey)}"> </stripe-elements>
`;
GenerateAToken.height = '220px';
GenerateAToken.decorators = [cardholderDecorator];
GenerateAToken.args = {
  label: 'Generate a Token'
}
```

## Validation and Styling

`<stripe-elements>` has a `show-error` boolean attribute which will display the error message for you.
This is useful for simple validation in cases where you don't need to build your own validation UI.

```js preview-story
export const Validation = args => html`
  <stripe-elements publishable-key="should-error-use-bad-key" show-error> </stripe-elements>
  <mwc-button slot="actions" outlined @click="${event => event.target.parentElement.querySelector('stripe-elements').validate()}">Validate</mwc-button>
`;
Validation.height = '120px';
```

### Custom Validation

`<stripe-elements>` comes with several properties, events, and methods for validation.
Listen for the `change` and `error` events and check the `complete`, `empty`, `error`, and `invalid`
properties to react to validation changes.

These states reflect as attributes, so you can use CSS to style your element in its various states.

Use the `stripe` and `error` [CSS Shadow Parts](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)
to style the element as needed. If your target browsers don't yet support shadow parts,
You can still configure the element somewhat using the exposed CSS Custom Properties,
see the README for more information.

```css
stripe-elements::part(stripe) {
  border-radius: 4px;
  border: 1px solid var(--mdc-button-outline-color, var(--mdc-theme-primary, #6200ee));
  box-shadow: none;
  height: 36px;
  display: flex;
  flex-flow: column;
  justify-content: center;
}

stripe-elements[complete]::part(stripe) {
  border-color: var(--material-green-a700, #00C853);
}

stripe-elements[invalid]::part(stripe) {
  border-color: var(--material-amber-a700, #FFAB00);
}

stripe-elements[error]::part(stripe) {
  border-color: var(--material-red-a700, #D50000);
}

stripe-elements::part(error) {
  text-align: right;
  color: var(--material-grey-800, #424242);
}
```

```js preview-story
export const CustomValidation = ({ publishableKey }) => {
  const onClickValidate = event =>
    event.target.parentElement.querySelector('stripe-elements')
      .validate()

  return html`
    <style>
      #states stripe-elements::part(stripe) {
        border-radius: 4px;
        border: 1px solid var(--mdc-button-outline-color, var(--mdc-theme-primary, #6200ee));
        box-shadow: none;
        height: 36px;
        display: flex;
        flex-flow: column;
        justify-content: center;
      }

      #states stripe-elements[complete]::part(stripe) {
        border-color: var(--material-green-a700, #00C853);
      }

      #states stripe-elements[invalid]::part(stripe) {
        border-color: var(--material-amber-a700, #FFAB00);
      }

      #states stripe-elements[error]::part(stripe) {
        border-color: var(--material-red-a700, #D50000);
      }

      #states stripe-elements::part(error) {
        text-align: right;
        color: var(--material-grey-800, #424242);
      }
    </style>

    <article id="states">
      <stripe-elements show-error publishable-key="${ifDefined(publishableKey)}"></stripe-elements>
      <mwc-button outlined @click="${onClickValidate}">Validate</mwc-button>
    </article>
  `;
};
CustomValidation.height = '120px';
```

## Automatically Posting the Payment Info

For simple integrations, you can automatically post the source or token to your backend by setting the `action` property

**NOTE**: For this demo, we've overridden `window.fetch` to return a mocked response with the text body "A-OK!".

```js preview-story
export const AutomaticallyPostingThePaymentInfo = ({ publishableKey }) => {
  const originalFetch =
    window.fetch;

  window.fetch =
    (url, ...args) =>
        url !== '/my-endpoint' ? originalFetch(url, ...args)
      : Promise.resolve(new Response('A-OK!'));

  const onClick =
    event =>
      event.target.parentElement.querySelector('stripe-elements').submit();

  const display =
    x =>
      $('#auto-post output').textContent = x;

  const onSuccess =
    ({ detail }) =>
      detail.text().then(display);

  return html`
    <article id="auto-post">
      <stripe-elements
          publishable-key="${ifDefined(publishableKey)}"
          generate="token"
          action="/my-endpoint"
          @success="${onSuccess}"
      ></stripe-elements>
      <mwc-button class="generate" outlined @click="${onClick}">Submit and POST</mwc-button>
      <output></output>
    </article>
  `;
};
```

## API

<sb-props of="stripe-elements"></sb-props>
