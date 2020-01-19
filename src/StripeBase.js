import { LitElement, property } from 'lit-element';
import { LitNotify } from '@morbidick/lit-element-notify';

import bound from 'bound-decorator';

import { ReadOnlyPropertiesMixin } from './lib/read-only-properties';
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
export class StripeBase extends ReadOnlyPropertiesMixin(LitNotify(LitElement)) {
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
   * @type {Boolean}
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
   * Stripe Source
   * @type {stripe.Source}
   * @readonly
   */
  @property({ type: Object, notify: true, readOnly: true }) source = null;

  /**
   * Stripe instance
   * @type {stripe.Stripe}
   * @readonly
   */
  @property({ type: Object, readOnly: true }) stripe = null;

  /**
   * Stripe Token
   * @type {stripe.Token}
   * @readonly
   */
  @property({ type: Object, notify: true, readOnly: true }) token = null;

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

  reset() {
    this.resetRepresentations();
    this.set({ error: null });
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
    const { error = null, source = null, token = null } = response;
    await this.set({ error, source, token });
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
}

/**
 * @typedef {stripe.PaymentIntentResponse|stripe.PaymentMethodResponse|stripe.SetupIntentResponse|stripe.TokenResponse|stripe.SourceResponse} PaymentResponse
 */
