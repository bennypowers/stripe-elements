import { LitElement, property } from 'lit-element';
import { LitNotify } from '@morbidick/lit-element-notify';

import bound from 'bound-decorator';

import { ReadOnlyPropertiesMixin } from './lib/read-only-properties';
import { dash } from './lib/strings';
import { isRepresentation } from './lib/predicates';
import { stripeMethod } from './stripe-method-decorator';
import { throwBadResponse } from './lib/fetch';

/** @typedef {stripe.PaymentIntentResponse|stripe.PaymentMethodResponse|stripe.SetupIntentResponse|stripe.TokenResponse|stripe.SourceResponse} PaymentResponse */
/** @typedef {{ owner: stripe.OwnerData }} SourceData */

/**
 * @fires 'stripe-error' - The validation error, or the error returned from stripe.com
 * @fires 'stripe-payment-intent' - The PaymentIntent received from stripe.com
 * @fires 'stripe-payment-method' - The PaymentMethod received from stripe.com
 * @fires 'stripe-source' - The Source received from stripe.com
 * @fires 'stripe-token' - The Token received from stripe.com
 *
 * @fires 'error-changed' - The new value of error
 * @fires 'has-error-changed' - The new value of has-error
 * @fires 'payment-intent-changed' - The new value of payment-intent
 * @fires 'payment-method-changed' - The new value of payment-method
 * @fires 'publishable-key-changed' - The new value of publishable-key
 * @fires 'source-changed' - The new value of source
 * @fires 'token-changed' - The new value of token
 */
export class StripeBase extends ReadOnlyPropertiesMixin(LitNotify(LitElement)) {
  /* PAYMENT CONFIGURATION */

  /**
   * billing_details object sent to create the payment representation. (optional)
   * @type {stripe.BillingDetails}
   */
  billingDetails = {};

  /**
   * Data passed to stripe.createPaymentMethod. (optional)
   * @type {stripe.PaymentMethodData}
   */
  paymentMethodData = {};

  /**
   * Data passed to stripe.createSource. (optional)
   * @type {SourceData}
   */
  sourceData = {};

  /**
   * Data passed to stripe.createToken. (optional)
   * @type {stripe.TokenOptions}
   */
  tokenData = {};

  /* PAYMENT REPRESENTATIONS */

  /**
   * Stripe PaymentMethod
   * @type {stripe.PaymentMethod}
   * @readonly
   */
  @property({
    type: Object,
    notify: true,
    readOnly: true,
    attribute: 'payment-method',
  }) paymentMethod = null;

  /**
   * Stripe Source
   * @type {stripe.Source}
   * @readonly
   */
  @property({ type: Object, notify: true, readOnly: true }) source = null;

  /**
   * Stripe Token
   * @type {stripe.Token}
   * @readonly
   */
  @property({ type: Object, notify: true, readOnly: true }) token = null;

  /* SETTINGS */

  /**
   * If set, when Stripe returns the payment info (PaymentMethod, Source, or Token),
   * the element will POST JSON data to this URL with an object containing
   * a key equal to the value of the `generate` property.
   * @example
   * ```html
   * <stripe-elements
   *   publishable-key="pk_test_XXXXXXXXXXXXX"
   *   generate="token"
   *   action="/payment"
   * ></stripe-elements>
   * ```
   * will POST to `/payment` with JSON body `{ "token": { ... } }`
   * ```js
   * stripeElements.submit();
   * ```
   * @type {string}
   */
  @property({ type: String }) action;

  /**
   * Type of payment representation to generate.
   * @type {'payment-method'|'source'|'token'}
   * @required
   */
  @property({ type: String }) generate = 'source';

  /**
   * Stripe Publishable Key. EG. `pk_test_XXXXXXXXXXXXXXXXXXXXXXXX`
   * @type {string}
   */
  @property({
    type: String,
    attribute: 'publishable-key',
    reflect: true,
    notify: true,
  }) publishableKey;

  /** Whether to display the error message */
  @property({ type: Boolean, attribute: 'show-error', reflect: true }) showError = false;

  /* READ-ONLY FIELDS */

  /**
   * Stripe element instance
   * @type {stripe.elements.Element}
   * @readonly
   */
  @property({ type: Object, readOnly: true }) element = null;

  /**
   * Stripe Elements instance
   * @type {stripe.elements.Elements}
   * @readonly
   */
  @property({ type: Object, readOnly: true }) elements = null;

  /**
   * Stripe or validation error
   * @type {Error|stripe.Error}
   * @readonly
   */
  @property({ type: String, notify: true, readOnly: true }) error = null;

  /**
   * Whether the element has an error
   * @type {boolean}
   * @readonly
   */
  @property({
    type: Boolean,
    attribute: 'has-error',
    reflect: true,
    notify: true,
    readOnly: true,
  }) hasError = false;

  /**
   * Stripe instance
   * @type {stripe.Stripe}
   * @readonly
   */
  @property({ type: Object, readOnly: true }) stripe = null;

  /* PRIVATE FIELDS */

  /**
   * The id for the stripe mount point
   * @type {string}
   * @private
   */
  stripeMountId;

  /* LIFECYCLE */

  /** @inheritdoc */
  updated(changed) {
    if (changed.has('error')) this.errorChanged();
    if (changed.has('publishableKey')) this.init();
    [...changed.keys()].forEach(this.representationChanged);
  }

  /* PUBLIC API */

  /**
   * Submit payment information to generate a paymentMethod
   * @param {stripe.PaymentMethodData} [paymentMethodData={}]
   * @resolves {stripe.PaymentMethodResponse}
   */
  @stripeMethod async createPaymentMethod(paymentMethodData = this.getPaymentMethodData()) {
    return this.stripe.createPaymentMethod(paymentMethodData);
  }

  /**
   * Submit payment information to generate a source
   * @param {{ owner: stripe.OwnerInfo }} [sourceData={}]
   * @resolves {stripe.SourceResponse}
   */
  @stripeMethod async createSource(sourceData = this.sourceData) {
    return this.stripe.createSource(this.element, sourceData);
  }

  /**
   * Submit payment information to generate a token
   * @param {TokenData} [tokenData=this.tokenData]
   * @resolves {stripe.TokenResponse}
   */
  @stripeMethod async createToken(tokenData = this.tokenData) {
    return this.stripe.createToken(this.element, tokenData);
  }

  /**
   * Reset the stripe element
   */
  reset() {
    this.resetRepresentations();
    this.set({ error: null });
  }

  /**
   * Generates a payment representation of the type specified by `generate`.
   * @resolves {PaymentResponse}
   */
  async submit() {
    switch (this.generate) {
      case 'payment-method': return this.createPaymentMethod();
      case 'source': return this.createSource();
      case 'token': return this.createToken();
      default: {
        const error = new Error(`<${this.constructor.is}>: cannot generate ${this.generate}`);
        await this.set({ error });
        throw error;
      }
    }
  }

  /* PRIVATE API */

  /** @private */
  async errorChanged() {
    const hasError = !!this.error;
    await this.set({ hasError });
    this.resetRepresentations();
    this.fireError(this.error);
  }

  /**
   * Fires an event.
   * @param  {string} type      event type
   * @param  {any}    detail    detail value
   * @param  {EventInit} [opts={}]
   * @private
   */
  fire(type, detail, opts = {}) {
    this.dispatchEvent(new CustomEvent(type, { bubbles: true, detail, ...opts }));
  }

  /**
   * Fires an Error Event
   * @param  {Error} error
   * @private
   */
  fireError(error) {
    this.dispatchEvent(new ErrorEvent('stripe-error', { bubbles: true, error }));
  }

  /**
   * Sets the token or error from the response.
   * @param  {PaymentResponse} response       Stripe Response
   * @return {PaymentResponse}
   * @private
   */
  @bound async handleResponse(response) {
    const { error = null, paymentMethod = null, source = null, token = null } = response;
    await this.set({ error, paymentMethod, source, token });
    if (error) throw error;
    else return response;
  }

  /**
   * Initializes Stripe and elements.
   * @private
   */
  async initStripe() {
    const { publishableKey } = this;
    const stripe = (window.Stripe && publishableKey) ? Stripe(publishableKey) : null;
    const elements = stripe && stripe.elements();
    const error = stripe ? null : new Error(`<${this.constructor.is}> requires Stripe.js to be loaded first.`);
    if (error) console.warn(error.message); // eslint-disable-line no-console
    await this.set({ elements, error, stripe });
  }

  /**
   * POSTs the payment info represenation to the endpoint at `/action`
   * @private
   */
  async postRepresentation() {
    const token = this.token || undefined;
    const source = this.source || undefined;
    const paymentMethod = this.paymentMethod || undefined;
    const body = JSON.stringify({ token, source, paymentMethod });
    const headers = { 'Content-Type': 'application/json' };
    const method = 'POST';
    return fetch(this.action, { body, headers, method })
      .then(throwBadResponse)
      .then(success => this.fire('stripe-payment-success', success))
      .catch(error => this.set({ error }));
  }

  /**
   * @param {string} name
   * @private
   */
  @bound representationChanged(name) {
    if (!isRepresentation(name)) return;
    const value = this[name];
    /* istanbul ignore if */
    if (!value) return;
    this.fire(`stripe-${dash(name)}`, value);
    if (this.action) this.postRepresentation();
  }

  /** @private */
  resetRepresentations() {
    this.set({
      paymentIntent: null,
      paymentMethod: null,
      token: null,
      source: null,
      setupIntent: null,
    });
  }
}
