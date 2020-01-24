import { LitElement, property, html } from 'lit-element';
import { LitNotify } from '@morbidick/lit-element-notify';

import { ifDefined } from 'lit-html/directives/if-defined';
import bound from 'bound-decorator';

import { ReadOnlyPropertiesMixin } from './lib/read-only-properties';
import { appendTemplate, remove } from './lib/dom';
import { dash, generateRandomMountElementId } from './lib/strings';
import { isRepresentation } from './lib/predicates';
import { stripeMethod } from './lib/stripe-method-decorator';
import { throwBadResponse } from './lib/fetch';

class StripeElementsError extends Error {
  constructor(tag, message) {
    super(`<${tag}>: ${message}`);
  }
}

/* istanbul ignore next */
const removeAllMounts = host =>
  host.querySelectorAll('[slot="stripe-card"][name="stripe-card"]')
    .forEach(remove);

const slotTemplate =
  html`<slot slot="stripe-card" name="stripe-card"></slot>`;

const mountPointTemplate = ({ stripeMountId, tagName }) =>
  html`<div id="${ifDefined(stripeMountId)}" class="${tagName.toLowerCase()}-mount"></div>`;


/**
 * @fires 'error' - The validation error, or the error returned from stripe.com
 * @fires 'payment-method' - The PaymentMethod received from stripe.com
 * @fires 'source' - The Source received from stripe.com
 * @fires 'token' - The Token received from stripe.com
 * @fires 'success' - When a payment succeeds
 *
 * @fires 'stripe-error' - DEPRECATED. Will be removed in a future major version.
 * @fires 'stripe-payment-method' - DEPRECATED. Will be removed in a future major version.
 * @fires 'stripe-source' - DEPRECATED. Will be removed in a future major version
 * @fires 'stripe-token' - DEPRECATED. Will be removed in a future major version.
 *
 * @fires 'error-changed' - The new value of error
 * @fires 'has-error-changed' - The new value of has-error
 * @fires 'payment-method-changed' - The new value of payment-method
 * @fires 'publishable-key-changed' - The new value of publishable-key
 * @fires 'source-changed' - The new value of source
 * @fires 'token-changed' - The new value of token
 */
export class StripeBase extends ReadOnlyPropertiesMixin(LitNotify(LitElement)) {
  /** @private */
  static applyCustomCss() {
    const id = `${this.is}-custom-css-properties`;
    if (!document.getElementById(id)) {
      const globalStyles = this.globalStyles.cssText;
      appendTemplate(html`<style id="${id}">${globalStyles}</style>`, document.head);
    }
  }

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
   * @type {stripe.paymentMethod.PaymentMethod}
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
   * The `client_secret` part of a Stripe `PaymentIntent`
   * @type {String}
   */
  @property({ type: String, attribute: 'client-secret' }) clientSecret;

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
   * Breadcrumbs back up to the document.
   * @type {Node[]}
   * @private
   */
  shadowHosts = [];

  /**
   * Stripe.js mount point element. Due to limitations in the Stripe.js library, this element must be connected to the document.
   * @type {Element}
   */
  get stripeMount() { return document.getElementById(this.stripeMountId); }

  /**
   * Stripe.js mount point element id. Due to limitations in the Stripe.js library, this element must be connected to the document.
   * @type {string}
   * @protected
   */
  stripeMountId = generateRandomMountElementId();

  /* LIFECYCLE */

  /** @inheritdoc */
  connectedCallback() {
    super.connectedCallback();
    this.constructor.applyCustomCss();
  }

  /** @inheritdoc */
  render() {
    const { error, showError } = this;
    const { message: errorMessage = '' } = error || {};
    return html`
      <slot id="stripe-slot" name="stripe-card"></slot>
      <div id="error" part="error" ?hidden="${!showError}">${errorMessage || error}</div>
    `;
  }

  /** @inheritdoc */
  firstUpdated() {
    this.destroyMountPoints();
    this.initMountPoints();
  }

  /** @inheritdoc */
  updated(changed) {
    super.updated?.(changed);
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
        const error = this.createError(`cannot generate ${this.generate}`);
        await this.set({ error });
        throw error;
      }
    }
  }

  /* PRIVATE API */

  createError(message) {
    return new StripeElementsError(this.constructor.is, message);
  }

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
    this.dispatchEvent(new ErrorEvent('error', { error }));
    // DEPRECATED
    this.dispatchEvent(new ErrorEvent('stripe-error', { bubbles: true, error }));
  }

  /**
   * Gets a CSS Custom Property value, respecting ShadyCSS.
   * @param  {string} propertyName    CSS Custom Property
   * @param  {CSSStyleDeclaration}    [precomputedStyle] pre-computed style declaration
   * @return {any}
   */
  getCSSCustomPropertyValue(propertyName, precomputedStyle) {
    if (window.ShadyCSS) return ShadyCSS.getComputedStyleValue(this, propertyName);
    else return precomputedStyle.getPropertyValue(propertyName);
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
   * Reinitializes Stripe and mounts the element.
   * @private
   */
  async init() {
    this.destroyMountPoints();
    this.initMountPoints();
    await this.unmount();
    await this.initStripe();
    await this.initElement();
    await this.mount();
  }

  /** @private */
  destroyMountPoints() {
    this.shadowHosts.forEach(removeAllMounts);
    if (this.stripeMount) this.stripeMount.remove();
  }

  /** @private */
  initMountPoints() {
    this.stripeMountId = generateRandomMountElementId();
    if (window.ShadyDOM) appendTemplate(mountPointTemplate(this), this);
    else this.initShadowMountPoints();
  }

  /**
   * Prepares to mount Stripe Elements in light DOM.
   * @private
   */
  initShadowMountPoints() {
    // trace each shadow boundary between us and the document
    let host = this;
    this.shadowHosts = [this];
    while (host = host.getRootNode().host) this.shadowHosts.push(host); // eslint-disable-line prefer-destructuring, no-loops/no-loops

    const { shadowHosts } = this;

    // Prepare the shallowest breadcrumb slot at document level
    const hosts = [...shadowHosts];
    const root = hosts.pop();
    if (!root.querySelector('[slot="stripe-card"]')) {
      const div = document.createElement('div');
      div.slot = 'stripe-card';
      root.appendChild(div);
    }

    const container = root.querySelector('[slot="stripe-card"]');

    // Render the form to the document, so that Stripe.js can mount
    appendTemplate(mountPointTemplate(this), container);

    // Append breadcrumb slots to each shadowroot in turn,
    // from the document down to the <stripe-elements> instance.
    hosts.forEach(appendTemplate(slotTemplate));
  }

  /**
   * Initializes Stripe and elements.
   * @private
   */
  async initStripe() {
    const { publishableKey } = this;
    const stripe = (window.Stripe && publishableKey) ? Stripe(publishableKey) : null;
    const elements = stripe && stripe.elements();
    const error = stripe ? null : this.createError('requires Stripe.js to be loaded first.');
    if (error) console.warn(error.message); // eslint-disable-line no-console
    await this.set({ elements, error, stripe });
  }

  /**
   * Mounts the Stripe Element
   * @private
   */
  async mount() {
    /* istanbul ignore next */
    if (!this.stripeMount) throw this.createError('Stripe Mount missing');
    this.element?.mount(this.stripeMount);
  }

  /**
   * Unmounts and nullifies the card.
   * @private
   */
  async unmount() {
    this.element?.unmount();
    await this.set({ element: null });
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
      .then(success => {
        this.fire('success', success);
        // DEPRECATED
        this.fire('stripe-payment-success', success);
      })
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
    // DEPRECATED
    this.fire(`stripe-${dash(name)}`, value);
    this.fire(`${dash(name)}`, value);
    if (this.action) this.postRepresentation();
  }

  /** @private */
  resetRepresentations() {
    this.set({
      paymentMethod: null,
      token: null,
      source: null,
    });
  }
}

/** @typedef {stripe.PaymentIntentResponse|stripe.PaymentMethodResponse|stripe.SetupIntentResponse|stripe.TokenResponse|stripe.SourceResponse} PaymentResponse */
/** @typedef {{ owner: stripe.OwnerData }} SourceData */
