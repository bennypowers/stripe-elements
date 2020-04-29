```js script
import '@power-elements/codesandbox-button';

import { html } from '@open-wc/demoing-storybook';

export default {
  title: 'Framework Examples/Vanilla',
  parameters: {
    options: {
      selectedPanel: 'storybookjs/docs/panel'
    }
  }
}
```

# `<stripe-elements>`

```js story
export const VanillaStripeElements = () => html`
  <codesandbox-button sandbox-id="y4h9n"></codesandbox-button>
`
```

```html
<script type="module" src="https://unpkg.com/@power-elements/stripe-elements?module"></script>
<script type="module" src="https://unpkg.com/@power-elements/json-viewer?module"></script>
<script type="module" src="https://unpkg.com/@material/mwc-button?module"></script>

<stripe-elements publishable-key="pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"></stripe-elements>

<mwc-button disabled>Submit</mwc-button>

<json-viewer></json-viewer>

<script>
  const viewer = document.querySelector("json-viewer");
  const stripe = document.querySelector("stripe-elements");
  const submit = document.querySelector("mwc-button");

  submit.addEventListener("click", onClickSubmit);
  stripe.addEventListener("source", onSource);
  stripe.addEventListener("change", onChange);

  function onClickSubmit() {
    stripe.createSource();
  }

  function onChange({ target }) {
    submit.disabled = !target.validate();
  }

  function onSource({ target: { source } }) {
    const handleAsJson = response => response.json();
    const viewJson = object => (viewer.object = object);

    const method = "POST";
    const body = JSON.stringify(source);
    const headers = { "Content-Type": "application/json" };

    fetch("/payments", { method, body, headers })
      .then(handleAsJson)
      .then(viewJson)
      .catch(viewJson);
  }
</script>
```

# `<stripe-payment-request>`

```js story
export const VanillaStripePaymentRequest = () => html`
 <codesandbox-button sandbox-id="5h7uy"></codesandbox-button>
`
```

```html
<stripe-payment-request
    publishable-key="pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"
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

<json-viewer></json-viewer>

<script>
  const viewer = document.querySelector("json-viewer");
  const stripe = document.querySelector("stripe-payment-request");

  stripe.addEventListener("payment-method", onPaymentMethod);

  function onPaymentMethod({ target: { paymentMethod } }) {
    const handleAsJson = response => response.json();
    const viewJson = object => (viewer.object = object);

    const method = "POST";
    const body = JSON.stringify(paymentMethod);
    const headers = { "Content-Type": "application/json" };

    fetch("/payments", { method, body, headers })
      .then(handleAsJson)
      .then(viewJson)
      .catch(viewJson);
  }
</script>
```
