import { LitElement, property } from 'lit-element';
import { LitNotify } from '@morbidick/lit-element-notify';

import bound from 'bound-decorator';

import { camel, dash } from './lib/strings';
import { isRepresentation } from './lib/predicates';
import { stripeMethod } from './stripe-method-decorator';

/**
 * @fires 'error-changed' - The new value of error
 * @fires 'has-error-changed' - The new value of has-error
 * @fires 'payment-intent-changed' - The new value of payment-intent
 * @fires 'payment-method-changed' - The new value of payment-method
 * @fires 'publishable-key-changed' - The new value of publishable-key
 * @fires 'source-changed' - The new value of source
 * @fires 'stripe-error' - The validation error, or the error returned from stripe.com
 * @fires 'stripe-payment-intent' - The PaymentIntent received from stripe.com
 * @fires 'stripe-payment-method' - The PaymentMethod received from stripe.com
 * @fires 'stripe-source' - The Source received from stripe.com
 * @fires 'stripe-token' - The Token received from stripe.com
 * @fires 'token-changed' - The new value of token
 */
export class StripeBase extends LitNotify(LitElement) {
  /* PUBLIC FIELDS */

  /**
   * The URL to the form action. Example '/charges'.
   * If blank or undefined will not submit charges immediately.
   * @type {String}
   */
  @property({ type: String }) action;

  /**
   * @type {stripe.BillingDetails}
   */
  billingDetails;

  /**
   * Stripe Publishable Key. EG. `pk_test_XXXXXXXXXXXXXXXXXXXXXXXX`
   * @type {String}
   */
  @property({
    type: String,
    attribute: 'publishable-key',
    reflect: true,
    notify: true,
  }) publishableKey;

  /** Whether to display the error message */
  @property({ type: Boolean, attribute: 'show-error', reflect: true }) showError = false;

  /**
   * Data passed to stripe.createSource. (optional)
   * @type {{ owner: stripe.OwnerData }}
   */
  sourceData;

  /**
   * Data passed to stripe.createToken. (optional)
   * @type {stripe.TokenOptions}
   */
  tokenData;

  /* READ-ONLY FIELDS */

  /**
   * Stripe Elements instance
   * @type {stripe.elements.Elements}
   */
  @property({ type: Object }) get elements() {
    return this.__elements;
  }

  /**
   * Stripe or validation error
   * @type {Error}
   */
  @property({ type: String, notify: true }) get error() {
    return this.__error;
  }

  /**
   * Whether the element has an error
   * @type {Boolean}
   */
  @property({ type: Boolean, attribute: 'has-error', reflect: true, notify: true }) get hasError() {
    return this.__hasError;
  }

  /**
   * Stripe Source
   * @type {stripe.Source}
   */
  @property({ type: Object, notify: true }) get source() {
    return this.__source;
  }

  /**
   * Stripe instance
   * @type {stripe.Stripe}
   */
  @property({ type: Object }) get stripe() {
    return this.__stripe;
  }

  /**
   * Stripe Token
   * @type {stripe.Token}
   */
  @property({ type: Object, notify: true }) get token() {
    return this.__token;
  }


  /* PRIVATE FIELDS */

  /**
   * The id for the stripe mount point
   * @type {string}
   * @private
   */
  stripeMountId;

  /** @type {stripe.elements.Elements} */
  __elements = null;

  /** @type {Error|stripe.Error} */
  __error = null;

  __hasError = false;

  /** @type {stripe.Source} */
  __source = null;

  /** @type {stripe.Stripe} */
  __stripe = null;

  /** @type {stripe.Token} */
  __token = null;

  /* LIFECYCLE */

  /** @inheritdoc */
  updated(changed) {
    if (changed.has('error')) this.errorChanged();
    if (changed.has('publishableKey')) this.init();
    [...changed.keys()].forEach(this.representationChanged);
  }

  /* PUBLIC API */

  /**
   * Submit credit card information to generate a source
   * @param {{ owner: stripe.OwnerInfo }} [sourceData={}]
   * @resolves {stripe.SourceResponse}
   */
  @stripeMethod async createSource(sourceData = this.sourceData) {
    const element = this.card;
    return this.stripe.createSource(element, sourceData);
  }

  /**
   * Submit credit card information to generate a token
   * @param {TokenData} [tokenData=this.tokenData]
   * @resolves {stripe.TokenResponse}
   */
  @stripeMethod async createToken(tokenData = this.tokenData) {
    return this.stripe.createToken(this.card, tokenData);
  }

  reset() {
    this.resetRepresentations();
    this.set({ error: null });
  }

  /* PRIVATE API */

  /** @private */
  errorChanged() {
    this.resetRepresentations();
    this.fireError(this.error);
  }

  /**
   * Fires an event.
   * @param  {String} type      event type
   * @param  {any}    detail    detail value
   * @param  {Object} [opts={}] event options
   * @private
   */
  fire(type, detail, opts = {}) {
    this.dispatchEvent(new CustomEvent(type, { detail, ...opts }));
  }

  /**
   * Fires an Error Event
   * @param  {Error} error
   * @private
   */
  fireError(error) {
    this.dispatchEvent(new ErrorEvent('stripe-error', { error }));
  }

  /**
   * Sets the token or error from the response.
   * @param  {PaymentResponse} response       Stripe Response
   * @return {PaymentResponse}
   * @private
   */
  @bound async handleResponse(response) {
    const {
      error = null,
      source = null,
      token = null,
    } = response;
    await this.set({
      error,
      source,
      token,
    });
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
   * Fires a Polymer-style prop-changed event.
   * @param {String} prop camelCased prop name.
   * @private
   */
  notify(prop) {
    const type = `${dash(prop)}-changed`;
    const value = this[camel(prop)];
    this.fire(type, { value });
  }

  /**
   * @param {String} name
   * @private
   */
  @bound representationChanged(name) {
    if (!isRepresentation(name)) return;
    const value = this[name];
    this.notify(name);
    if (!value) return;
    const eventType = `stripe-${dash(name)}`;
    this.fire(eventType, value);
    const selector = `[name=${camel(`stripe-${dash(name)}`)}]`;
    const formField = this.form.querySelector(selector);
    formField.removeAttribute('disabled');
    formField.value = value;
    if (this.action) this.form.submit();
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

  /**
   * Set read-only properties
   * @param  {Object<string, any>}  props
   * @return {Promise<this>}
   * @private
   */
  async set(props) {
    await Promise.all(Object.entries(props).map(this.setPropEntry));
    return this;
  }

  /**
   * @return {Promise<unknown>}
   * @private
   */
  @bound setPropEntry([name, newVal]) {
    const privateName = `__${name}`;
    const oldVal = this[privateName];
    this[privateName] = newVal;
    if (name === 'error') {
      const oldHasError = this.__hasError;
      this.__hasError = !!newVal;
      this.requestUpdate('hasError', oldHasError);
    }
    return this.requestUpdate(name, oldVal);
  }
}

/**
 * @typedef {stripe.PaymentIntentResponse|stripe.PaymentMethodResponse|stripe.SetupIntentResponse|stripe.TokenResponse|stripe.SourceResponse} PaymentResponse
 */
