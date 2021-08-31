```js script
import { html } from 'lit-html' ;
import { ifDefined } from 'lit-html/directives/if-defined';

import '../stripe-payment-request.js';

import '@power-elements/json-viewer';
import '@material/mwc-textfield';

export default {
  title: 'Elements/Stripe Payment Request',
  component: 'stripe-payment-request',
  args: {
    publishableKey: 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX',
    clientSecret: 'seti_XXXXXXXXXXXXXXXXXXXXXXXX_secret_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
  }
}
```

# `<stripe-payment-request>` Web Component

The `<stripe-payment-request>` custom element is an easy way to use stripe.js in your web app,
across [frameworks](/?path=/docs/framework-examples-angular--stripe-elements), or inside shadow roots.
Add the element to your page with the `publishable-key` attribute set to your
[Stripe publishable key](https://dashboard.stripe.com/account/apikeys).
You can also set the `publishableKey` DOM property using JavaScript.

> 👉 Set your publishable key in this demo by adding `&args=publishableKey:pk_test_xxxxx` to the URL 👈

> 👉 Likewise, set your client secret with `&args=clientSecret:seti_XXXXXXXXXXXXXXXXXXXXXXXX_secret_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` 👈

Unlike the `<stripe-elements>` element, `<stripe-payment-request>` has a number of up-front requirements.
The first of those is browser support.
Listen for the `unsupported` event to handle the case when the user agent cannot make the payment.
Listen for the `ready` event to be sure that the browser is able to make payment.

You also need to preload the element with information about the payment request in order for it to render to the page.

> **Careful!** never add your **secret key** to an HTML page, only publish your **publishable key**.

For example, to display a payment request button to request a payment to a Canadian Stripe account
for a purchase labelled "Double Double" that costs $1.25 Canadian, add this element to your page:

```js preview-story
export const SimplePaymentRequest = ({ publishableKey, clientSecret }) => {
  console.log({ publishableKey, clientSecret });
  return  html`
    <payment-request-demo>
      <stripe-payment-request
          publishable-key="${ifDefined(publishableKey)}"
          client-secret="${ifDefined(clientSecret)}"
          generate="source"
          amount="125"
          label="Double Double"
          country="CA"
          currency="cad">
      </stripe-payment-request>
    </payment-request-demo>
  `;
}
```

You can also display multiple line-items with the `<stripe-payment-item>` element:

```js preview-story
export const PaymentRequestWithDisplayItems = ({ publishableKey }) => html`
  <payment-request-demo>
    <stripe-payment-request
        publishable-key="${ifDefined(publishableKey)}"
        generate="token"
        amount="326"
        label="Double Double"
        country="CA"
        currency="cad">
      <stripe-display-item data-amount="125" data-label="Double Double"> </stripe-display-item>
      <stripe-display-item data-amount="199" data-label="Box of 10 Timbits"> </stripe-display-item>
    </stripe-payment-request>
  </payment-request-demo>
`;
```

To add multiple shipping options, you can use the `<stripe-shipping-option>` element:

```js preview-story
export const PaymentRequestWithDisplayItemsAndShippingOptions = ({ publishableKey }) => html`
  <payment-request-demo>
    <stripe-payment-request
        publishable-key="${ifDefined(publishableKey)}"
        generate="payment-method"
        request-payer-name
        request-payer-email
        request-payer-phone
        amount="326"
        label="Double Double"
        country="CA"
        currency="cad">
      <stripe-display-item data-amount="125" data-label="Double Double"> </stripe-display-item>
      <stripe-display-item data-amount="199" data-label="Box of 10 Timbits"> </stripe-display-item>
      <stripe-shipping-option data-id="pick-up" data-label="Pick Up" data-detail="Pick Up at Your Local Timmy's" data-amount="0"> </stripe-shipping-option>
      <stripe-shipping-option data-id="delivery" data-label="Delivery" data-detail="Timbits to Your Door" data-amount="200"> </stripe-shipping-option>
    </stripe-payment-request>
  </payment-request-demo>
`;
PaymentRequestWithDisplayItemsAndShippingOptions.withSource = 'open';
```

You may also set the payment request options using JavaScript:

```js
const el = document.querySelector('stripe-payment-request');

el.displayItems = [
  { amount: '125', label: 'Double Double' },
  { amount: '199', label: 'Box of 10 Timbits' },
]

el.shippingOptions = [
  { id: 'pick-up',  amount: 0,   label: 'Pick Up',  detail: "Pick Up at Your Local Timmy's" },
  { id: 'delivery', amount: 200, label: 'Delivery', detail: 'Timbits to Your Door' }
]
```

If you update the element's `amount` or `label` properties, it will update the payment requestUpdate

```js preview-story
export const UpdatingPaymentRequestOptions = ({ publishableKey }) => html`
  <payment-request-demo>
    <stripe-payment-request
        publishable-key="${ifDefined(publishableKey)}"
        generate="payment-method"
        request-payer-name
        request-payer-email
        request-payer-phone
        country="CA"
        currency="cad">
    </stripe-payment-request>
    <mwc-textfield label="Amount (CAD)" type="number" @input="${event => {
      const spr = event.target.parentElement.querySelector("stripe-payment-request");
      spr.amount = parseFloat(event.target.value) * 100;
    }}"></mwc-textfield>
    <mwc-textfield label="Label" @input="${event => {
      const spr = event.target.parentElement.querySelector("stripe-payment-request");
      spr.label = event.target.value;
    }}"></mwc-textfield>
  </payment-request-demo>
`;
UpdatingPaymentRequestOptions.withSource = 'open';
```

## PaymentIntents

Stripe provides a PaymentIntent API which is both more secure and more compatible with EU regulations.
To take advantage of those features, generate a `PaymentIntent` object on your server and
pass it's `client_secret` property to the `<stripe-payment-request>` element.

You can generate one quickly using the stripe cli:

```bash
stripe payment_intents create --amount=326 --currency=cad | jq -r '.client_secret'
```

Enter your client secret to run the examples.

```js story
export const EnterAClientSecret = ({ publishableKey, clientSecret }) => {
  return html`
  <mwc-textfield id="client-secret-input"
      outlined
      label="Client Secret"
  ></mwc-textfield>
  `;
};
EnterAClientSecret.height = '80px';
```

```js preview-story
export const PaymentRequestWithPaymentIntent = ({ publishableKey }) => html`
  <payment-request-demo class="uses-client-secret">
    <stripe-payment-request
        publishable-key="${ifDefined(publishableKey)}"
        generate="payment-method"
        client-secret="pi_XXXXXXXXXXXXXXXXXXXXXXXX_secret_XXXXXXXXXXXXXXXXXXXXXXXXX"
        request-payer-name
        request-payer-email
        request-payer-phone
        amount="326"
        label="Double Double"
        country="CA"
        currency="cad">
    </stripe-payment-request>
  </payment-request-demo>
`;
PaymentRequestWithPaymentIntent.withSource = 'open';
```

## API

<sb-props of="stripe-payment-request"></sb-props>
