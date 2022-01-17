---
layout: layout-framework.njk
framework: lit
tags:
  - framework
---

## `<stripe-elements>`

{% sandbox "8m7uk" %}

```js
import '@power-elements/stripe-elements';
import '@power-elements/json-viewer';
import { LitElement, html } from 'lit';
import { PUBLISHABLE_KEY } from './config.js';

class PaymentForm extends LitElement {
  static get properties() {
    return {
      error: { type: Object },
      source: { type: Object },
    }
  }

  render() {
    return html`
      <mwc-button ?disabled="${this.submitDisabled}" @click="${this.onClick}">
        Submit
      </mwc-button>

      <stripe-elements
          publishable-key="${PUBLISHABLE_KEY}"
          @change="${this.onChange}"
          @source="${this.onSource}"
          @error="${this.onError}"
      ></stripe-elements>

      <json-viewer .object="${ifDefined(this.error || this.source)}"></json-viewer>
    `;
  }

  onChange({ target: { complete, hasError } }) {
    this.submitDisabled = !(complete && !hasError);
  }

  onClick() {
    this.shadowRoot.querySelector("stripe-elements").createSource();
  }

  onSource({ detail: source }) {
    this.source = source;
  }

  onError({ target: { error } }) {
    this.error = error;
  }
}
```

## `<stripe-payment-request>`

{% sandbox "8m7uk" %}

```js
import '@power-elements/json-viewer';
import { LitElement, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { PUBLISHABLE_KEY } from './config';

const displayItems = [
  { amount: '125', label: 'Double Double' },
  { amount: '199', label: 'Box of 10 Timbits' },
]

const shippingOptions = [
  { id: 'pick-up',  amount: 0,   label: 'Pick Up',  detail: "Pick Up at Your Local Timmy's" },
  { id: 'delivery', amount: 200, label: 'Delivery', detail: 'Timbits to Your Door' }
]

class PaymentForm extends LitElement {
  static get properties() {
    return {
      paymentMethod: { type: Object },
    };
  }

  render() {
    return html`
      <stripe-payment-request
          publishable-key="pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"
          .shippingOptions="${shippingOptions}"
          .displayItems="${displayItems}"
          @payment-method="${this.onPaymentMethod}"
          @error="${this.onError}"
          generate="payment-method"
          request-payer-name
          request-payer-email
          request-payer-phone
          amount="326"
          label="Double Double"
          country="CA"
          currency="cad">
      </stripe-payment-request>

      <json-viewer .object="${ifDefined(this.error || this.paymentMethod)}"></json-viewer>
    `;
  }

  onPaymentMethod({ detail: paymentMethod }) {
    this.paymentMethod = paymentMethod;
  }

  onError({ target: { error } }) {
    this.error = error;
  }
}
```
