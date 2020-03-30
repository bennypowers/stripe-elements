/**
 * `stripe-payment`
 * `Payment broker for stripe`
 *
 * @element `stripe-payment`
 */
import { LitElement, html } from "lit-element/lit-element.js";
import { ifDefined } from "lit-html/directives/if-defined.js";
import sharedStyles from './shared.css';
import style from './stripe-payment.css';
class StripePayment extends LitElement {
  static is = 'stripe-payment';
  static properties = {
    /**
     * Publishing key from Stripe
     * @type {String}
     */
    publishableKey: { type: String, attribute: "publishable-key" },
    /**
     * List of shipping options
     * @type {Array}
     */
    shippingOptions: { type: Array },
    /**
     * List of items to display being purchased
     * @type {Array}
     */
    displayItems: { type: Array },
    /**
     * dollar amount in cents
     * @type {Number}
     */
    amount: { type: Number },
    /**
     * Label to list for the currency
     * @type {String}
     */
    label: { type: String },
    /**
     * Country code
     * @type {String}
     */
    country: { type: String },
    /**
     * Currency to accept payment in
     * @type {String}
     */
    currency: { type: String },
    /**
     * Payment data coming back as response from Stripe API
     * @type {Object}
     * @readonly
     */
    paymentMethod: { type: Object },
    /**
     * Error data from response
     * @type {Object}
     * @readonly
     */
    error: { type: Object },
    output: { type: Object },
    /**
     * If Stripe doesn't support the nicer payment request method
     * @type {Boolean}
     * @readonly
     */
    unsupported: { type: Boolean },
    /**
     * Disable submit button
     * @type {Boolean}
     * @readonly
     */
    submitDisabled: { type: Boolean },
    /**
     * Text to use on the payment button
     * @type {String}
     */
    paymentText: { type: String, attribute: "payment-text" },
    /**
     * Debug mode for displaying error and response data when testing
     * @type {Boolean}
     */
    debug: { type: Boolean }
  };
  
  static styles = [
    sharedStyles,
    style,
  ];

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.submitDisabled = true;
    this.debug = false;
    this.displayItems = [];
    this.shippingOptions = [];
    this.amount = 0;
    this.paymentText = "Submit";
    this.label = "Purchase";
    this.country = "US";
    this.currency = "usd";
    import("@power-elements/stripe-elements/stripe-payment-request.js");
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <stripe-payment-request
        ?hidden="${this.output || this.unsupported}"
        publishable-key="${ifDefined(
          this.publishableKey ? this.publishableKey : undefined
        )}"
        .shippingOptions="${this.shippingOptions}"
        .displayItems="${this.displayItems}"
        amount="${this.amount}"
        label="${this.label}"
        country="${this.country}"
        currency="${this.currency}"
        @payment-method="${this.onPaymentMethod}"
        @error="${this.onError}"
        @success="${this.onSuccess}"
        @fail="${this.onFail}"
        @ready="${this.onReady}"
        @unsupported="${this.onUnsupported}"
        generate="source"
        request-payer-name
        request-payer-email
        request-payer-phone
      >
        ${this.displayItems.map(
          item => html`
            <stripe-display-item
              data-amount="${item.amount}"
              data-label="${item.label}"
            ></stripe-display-item>
          `
        )}
        ${this.shippingOptions.map(
          ship => html`
            <stripe-shipping-option
              data-id="${ship.id}"
              data-label="${ship.label}"
              data-detail="${ship.detail}"
              data-amount="${ship.amount}"
            ></stripe-shipping-option>
          `
        )}
      </stripe-payment-request>
      ${this.debug
        ? html`
            <json-viewer
              .object="${ifDefined(
                this.error ? this.error : this.paymentMethod
              )}"
            ></json-viewer>
          `
        : ``}
      ${this.unsupported
        ? html`
            <stripe-elements
              ?hidden="${this.output || !this.unsupported}"
              generate="source"
              publishable-key="${ifDefined(
                this.unsupported ? this.publishableKey : undefined
              )}"
              @change="${this.onChange}"
              @source="${this.onSuccess}"
              @error="${this.onError}"
            >
            </stripe-elements>
            <mwc-button
              tabindex="0"
              ?hidden="${this.output || !this.unsupported}"
              ?disabled="${this.submitDisabled}"
              @click="${this.onClick}"
              >${this.paymentText}</mwc-button
            >
          `
        : ``}
    `;
  }
  /**
   * LitElement property change record
   */
  updated(changedProperties) {
    changedProperties.forEach((oldvalue, propName) => {
      if (propName == "debug" && this[propName]) {
        // import json viewer if we are debugging
        import("@power-elements/json-viewer/json-viewer.js");
      }
    });
  }

  onPaymentMethod({ detail: paymentMethod }) {
    this.paymentMethod = paymentMethod;
  }
  onChange({ target: { complete, hasError } }) {
    this.submitDisabled = !(complete && !hasError);
  }
  onError({ target: { error } }) {
    this.error = error;
    if (this.debug && this.error) {
      console.error(error);
    }
  }
  onClick() {
    this.shadowRoot.querySelector("stripe-elements").submit();
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
    // import form when we fail our first check
    import("@power-elements/stripe-elements/stripe-elements.js");
    import("@material/mwc-button/mwc-button.js");
  }
}
customElements.define(StripePayment.tag, StripePayment);
export { StripePayment };
