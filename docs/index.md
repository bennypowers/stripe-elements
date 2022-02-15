---
layout: layout-docs.njk
title: Stripe Elements Web Components
publishableKey: pk_test_XXXXXXXXXXXXXXXXXXXXXXXX
clientSecret: pk_test_XXXXXXXXXXXXXXXXXXXXXXXX
parameters:
  component: stripe-elements
---

The `<stripe-elements>` custom element is an easy way to use stripe.js in your web app,
across [frameworks](/?path=/docs/framework-examples-angular--stripe-elements),
or inside [shadow roots](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).

## Installation
You don't need to set up node and npm to use stripe elements web components. You can simply load the definitions directly in HTML via a CDN.

``` html
<script type="module" src="https://unpkg.com/@power-elements/stripe-elements?module"></script>
```

If you would like to bundle the components, install using NPM and import as usual:

``` shell
npm i @power-elements/stripe-elements
```
``` js
import '@power-elements/stripe-elements';
```

## `<stripe-elements>` Web Component

### Usage

Add the element to your page with the `publishable-key` attribute set to your
[Stripe publishable key](https://dashboard.stripe.com/account/apikeys).
You can also set the `publishableKey` DOM property using JavaScript.

Enter a valid _testing_ publishable key in the input below to activate the examples on this page.

<div id="inputs">
  <mwc-textfield id="set-publishable-key" outlined data-arg="publishableKey" label="Publishable Key" value="{{ publishableKey }}"></mwc-textfield>
  <mwc-textfield id="set-client-secret" outlined data-arg="clientSecret" label="Client Secret" value="{{ clientSecret }}"></mwc-textfield>
</div>

> **Careful!** never add your **secret key** to an HTML page, only publish your **publishable key**.

Once you've set the `publishable-key` attribute (or the `publishableKey` DOM property), Stripe will create a Stripe Card Element on your page.

### Accepting Payments

Fill out some payment information here, then choose the type of payment object you'd like to generate.

Once you're set your publishable key and Stripe has instantiated (listen for the `ready` event if you need to know exactly when this happens),
you may generate a token from the filled-out form by calling the `createToken()` method.

<mwc-textfield outlined label="Cardholder Name" value="Mr. Man"></mwc-textfield>
<mwc-textfield outlined label="Cardholder Email" value="mr@man.email"></mwc-textfield>
<mwc-textfield outlined label="Cardholder Phone" value="555 555 5555"></mwc-textfield>

<stripe-elements publishable-key="{{ publishableKey }}"></stripe-elements>

<mwc-button data-generate="payment-method" label="Generate a PaymentMethod"></mwc-button>
<mwc-button data-generate="source" label="Generate a Source"></mwc-button>
<mwc-button data-generate="token" label="Generate a Token"></mwc-button>

<mwc-dialog>
  <json-viewer></json-viewer>
  <mwc-button slot="primaryAction" dialogAction="cancel">OK</mwc-button>
</mwc-dialog>

### Validation and Styling

`<stripe-elements>` has a `show-error` boolean attribute which will display the error message for you.
This is useful for simple validation in cases where you don't need to build your own validation UI.

```html
<stripe-elements publishable-key="should-error-use-bad-key"
                 show-error></stripe-elements>
```

<iframe loading="lazy" src="/frames/elements/show-error/"></iframe>

#### Custom Validation

`<stripe-elements>` comes with several properties, events, and methods for validation.
Listen for the `change` and `error` events and check the `complete`, `empty`, `error`, and `invalid`
properties to react to validation changes.

These states reflect as attributes, so you can use CSS to style your element in its various states.

Use the `stripe` and `error` [CSS Shadow Parts](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)
to style the element as needed. If your target browsers don't yet support shadow parts,
You can still configure the element somewhat using the exposed CSS Custom Properties,
see the README for more information.

``` css
stripe-elements::part(stripe) {
  border-radius: 4px;
  border: 1px solid var(--theme-primary);
  box-shadow: none;
  height: 36px;
  display: flex;
  flex-flow: column;
  justify-content: center;
}

stripe-elements[complete]::part(stripe) {
  border-color: var(--success);
}

stripe-elements[invalid]::part(stripe) {
  border-color: var(--warning);
}

stripe-elements[error]::part(stripe) {
  border-color: var(--error);
}

stripe-elements::part(error) {
  text-align: right;
  color: var(--text);
}
```

<iframe data-update="publishableKey" loading="lazy" src="/frames/elements/custom-validation/" height="120px"></iframe>

### Automatically Posting the Payment Info

For simple integrations, you can automatically post the source or token to your backend by setting the `action` property

**NOTE**: For this demo, we've overridden `window.fetch` to return a mocked response with the text body "A-OK!".

```html
<stripe-elements publishable-key="{{ publishableKey }}"
    generate="token"
    action="/my-endpoint"
></stripe-elements>
```
<iframe data-update="publishableKey" loading="lazy" src="/frames/elements/automatically-posting/"></iframe>

## `<stripe-payment-request>` Web Component

The `<stripe-payment-request>` custom element is an easy way to use stripe.js in your web app,
across [frameworks](/?path=/docs/framework-examples-angular--stripe-elements), or inside shadow roots.
Add the element to your page with the `publishable-key` attribute set to your
[Stripe publishable key](https://dashboard.stripe.com/account/apikeys).
You can also set the `publishableKey` DOM property using JavaScript.

Unlike the `<stripe-elements>` element, `<stripe-payment-request>` has a number of up-front requirements.
The first of those is browser support.
Listen for the `unsupported` event to handle the case when the user agent cannot make the payment.
Listen for the `ready` event to be sure that the browser is able to make payment.

You also need to preload the element with information about the payment request in order for it to render to the page.
Like with the `publishable-key` attribute, paste a valid _testing_ client secret into the
[input above](#inputs) to activate the payment-request demos on this page.

For example, to display a payment request button to request a payment to a Canadian Stripe account
for a purchase labelled "Double Double" that costs $1.25 Canadian, add this element to your page:

``` html
<stripe-payment-request
    publishable-key="{{ publishableKey }}"
    client-secret="{{ clientSecret }}"
    generate="source"
    amount="125"
    label="Double Double"
    country="CA"
    currency="cad">
</stripe-payment-request>
```

<stripe-payment-request
    publishable-key="{{ publishableKey }}"
    client-secret="{{ clientSecret }}"
    generate="source"
    amount="125"
    label="Double Double"
    country="CA"
    currency="cad">
</stripe-payment-request>

You can also display multiple line-items with the `<stripe-payment-item>` element:

``` html
<stripe-payment-request
    publishable-key="{{ publishableKey }}"
    generate="token"
    amount="326"
    label="Double Double"
    country="CA"
    currency="cad">
  <stripe-display-item data-amount="125" data-label="Double Double"></stripe-display-item>
  <stripe-display-item data-amount="199" data-label="Box of 10 Timbits"></stripe-display-item>
</stripe-payment-request>
```

<iframe data-update="publishableKey,clientSecret" loading="lazy" src="/frames/payment-request/with-display-items/"></iframe>

To add multiple shipping options, you can use the `<stripe-shipping-option>` element:

``` html
<stripe-payment-request
    publishable-key="{{ publishableKey }}"
    generate="payment-method"
    request-payer-name
    request-payer-email
    request-payer-phone
    amount="326"
    label="Double Double"
    country="CA"
    currency="cad">
  <stripe-display-item data-amount="125" data-label="Double Double"></stripe-display-item>
  <stripe-display-item data-amount="199" data-label="Box of 10 Timbits"></stripe-display-item>
  <stripe-shipping-option data-id="pick-up" data-label="Pick Up" data-detail="Pick Up at Your Local Timmy's" data-amount="0"></stripe-shipping-option>
  <stripe-shipping-option data-id="delivery" data-label="Delivery" data-detail="Timbits to Your Door" data-amount="200"></stripe-shipping-option>
</stripe-payment-request>
```

<iframe data-update="publishableKey,clientSecret" loading="lazy" src="/frames/payment-request/with-display-items-and-shipping-options/"></iframe>

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

``` html
<stripe-payment-request
    publishable-key="{{ publishableKey }}"
    generate="payment-method"
    request-payer-name
    request-payer-email
    request-payer-phone
    country="CA"
    currency="cad">
</stripe-payment-request>
<mwc-textfield label="Amount (CAD)" type="number" data-prop="amount"></mwc-textfield>
<mwc-textfield label="Label" data-prop="label"></mwc-textfield>

<script type="module">
const spr = document.querySelector("stripe-payment-request");
for (const textfield of document.querySelectorAll('mwc-textfield')) {
  textfield.addEventListener('input', event => {
    switch (event.target.dataset.prop) {
      case 'amount':
        spr.amount = parseFloat(event.target.value) * 100;
        break;
      case 'label':
        spr.label = event.target.value;
        break;
    }
  })
}
</script>
```

<iframe data-update="publishableKey,clientSecret" loading="lazy" src="/frames/payment-request/updating-options/"></iframe>

### Payment Intents

Stripe provides a PaymentIntent API which is both more secure and more compatible with EU regulations.
To take advantage of those features, generate a `PaymentIntent` object on your server and
pass it's `client_secret` property to the `<stripe-payment-request>` element.

You can generate one quickly using the stripe cli:

```bash
stripe payment_intents create --amount=326 --currency=cad | jq -r '.client_secret'
```

``` html
<stripe-payment-request
    generate="payment-method"
    publishable-key="{{ publishableKey }}"
    client-secret="{{ clientSecret }}"
    request-payer-name
    request-payer-email
    request-payer-phone
    amount="326"
    label="Double Double"
    country="CA"
    currency="cad">
</stripe-payment-request>
```

<iframe data-update="publishableKey,clientSecret" loading="lazy" src="/frames/payment-request/with-payment-intent/"></iframe>

### Fallback to Stripe Elements

You might often want to show users a `<stripe-payment-request>` button if they
are able (i.e. if `canMakePayment` is true), but fall back to a
`<stripe-elements>` card form if they are not.

To accomplish this, listen for the `unsupported` and `ready` events on
`<stripe-payment-request>`, which fire when the element is finally unable or
able to display a Payment Request button, respectively.

We recommend that you don't set `publishable-key` on `<stripe-elements>` until
`unsupported` fires from `<stripe-payment-request>`, as setting the publishable
key will kick off the element's initialization, even if payment request is
supported.

<iframe data-update="publishableKey,clientSecret" loading="lazy" src="/frames/payment-request/fallback-to-elements/"></iframe>

``` js
class PaymentForm extends LitElement {
  static get properties() {
    return {
      error: { type: Object },
      output: { type: Object },
      unsupported: { type: Boolean, reflect: true },
      publishableKey: { type: String, attribute: 'publishable-key', reflect: true },
      submitDisabled: { type: Boolean },
    }
  }

  static get styles() {
    return css`
      [hidden] { display: none !important; }

      :host {
        align-items: center;
        display: grid;
        grid-gap: 12px;
        grid-template-areas:
          'support support'
          'stripe submit'
          'output output';
      }

      stripe-elements { grid-area: stripe; }

      stripe-payment-request { grid-area: submit/stripe/stripe/submit; }

      mwc-button { grid-area: submit; }

      json-viewer { grid-area: output; }
    `;
  }

  constructor() {
    super();
    this.submitDisabled = true;
  }

  render() {
    return html`
      <output ?hidden="${this.unsupported === undefined}">
        Payment Request is ${this.unsupported ? 'un' : ''}supported on this Browser
      </output>

      <stripe-payment-request
          ?hidden="${this.output || this.unsupported}"
          @success="${this.onSuccess}"
          @fail="${this.onFail}"
          @error="${this.onError}"
          @unsupported="${this.onUnsupported}"
          @ready="${this.onReady}"
          publishable-key="${ifDefined(this.publishableKey)}"
          generate="source"
          request-payer-name
          request-payer-email
          request-payer-phone
          amount="326"
          label="Double Double"
          country="CA"
          currency="cad">
        <stripe-display-item data-amount="125" data-label="Double Double"></stripe-display-item>
        <stripe-display-item data-amount="199" data-label="Box of 10 Timbits"></stripe-display-item>
        <stripe-shipping-option data-id="pick-up" data-label="Pick Up" data-detail="Pick Up at Your Local Timmy's" data-amount="0"></stripe-shipping-option>
        <stripe-shipping-option data-id="delivery" data-label="Delivery" data-detail="Timbits to Your Door" data-amount="200"></stripe-shipping-option>
      </stripe-payment-request>

      <stripe-elements
          ?hidden="${this.output || !this.unsupported}"
          generate="source"
          publishable-key="${ifDefined(this.unsupported ? this.publishableKey : undefined)}"
          @change="${this.onChange}"
          @source="${this.onSuccess}"
          @error="${this.onError}"
      ></stripe-elements>

      <mwc-button
          ?hidden="${this.output || !this.unsupported}"
          ?disabled="${this.submitDisabled}"
          @click="${this.onClick}"
      >Submit</mwc-button>

      <json-viewer .object="${this.output}"></json-viewer>
    `;
  }

  onChange({ target: { complete, hasError } }) {
    this.submitDisabled = !(complete && !hasError);
  }

  onClick() {
    this.shadowRoot.querySelector('stripe-elements').submit();
  }

  onError({ target: { error } }) {
    this.error = error;
  }

  onFail(event) {
    this.output = event.detail;
  }

  onReady() {
    this.unsupported = false;
  }

  onSuccess(event) {
    this.output = event.detail;
  }

  onUnsupported() {
    this.unsupported = true;
  }
}
```

## Usage in Frameworks

<ul>
{% for f in collections.framework %}
  <li><a href="{{ f.data.page.url }}">{{ f.data.framework | capitalize }}</a></li>
{% endfor %}
</ul>

<template id="PR_UNSUPPORTED">
  <p>This browser does not support <a href="https://developer.mozilla.org/en-US/docs/Web/API/Payment_Request_API" target="_blank">Payment Request API</a></p>
</template>

## API

The following API tables are automatically generated.

{% cem %}
