```js script
import '@power-elements/codesandbox-button';
import '@power-elements/json-viewer';
import '../index.js';

import { ifDefined } from 'lit-html/directives/if-defined';

import { LitElement, html, css } from 'lit-element';
import { publishableKey, clientSecret } from './storybook-helpers.js';

export default {
  title: 'Fallback to Stripe Elements',
  parameters: {
    options: {
      selectedPanel: 'storybookjs/docs/panel'
    }
  },
  args: {
    publishableKey,
    clientSecret,
    cardholderName: 'Mr. Man',
    cardholderEmail: 'mr@man.email',
    cardholderPhone: '555 555 5555',
  }
}
```

# Fallback to Stripe Elements

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

<mwc-textfield data-arg="publishableKey" label="Publishable Key" value={publishableKey}></mwc-textfield>
<mwc-textfield data-arg="clientSecret" label="Client Secret" value={clientSecret}></mwc-textfield>

```js preview-story
export const FallingBackToStripeElementsWhenPaymentRequestIsNotSupported = ({ publishableKey, clientSecret }) => {
  class PaymentForm extends LitElement {
    static get properties() {
      return {
        error: { type: Object },
        output: { type: Object },
        unsupported: { type: Boolean },
        publishableKey: { type: String, attribute: 'publishable-key' },
        submitDisabled: { type: Boolean },
      }
    }

    static get styles() {
      return css`
        [hidden] { display: none !important; }

        :host {
          font-family: "Nunito Sans", -apple-system, ".SFNSText-Regular", "San Francisco", BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;
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

  if (!customElements.get('fallback-form'))
    customElements.define('fallback-form', PaymentForm);

  return html`
    <fallback-form publishable-key="${publishableKey}"></fallback-form>
  `;
}
```
