import { LitElement, property, html } from 'lit-element';
import { LitNotify } from '@morbidick/lit-element-notify';

import { ifDefined } from 'lit-html/directives/if-defined';
import bound from 'bound-decorator';

import { ReadOnlyPropertiesMixin } from './lib/read-only-properties';
import { appendTemplate, remove } from './lib/dom';
import { dash, generateRandomMountElementId } from './lib/strings';
import { isRepresentation } from './lib/predicates';
import { throwBadResponse } from './lib/fetch';

class StripeElementsError extends Error {
  constructor(tag, message) {
    super(`<${tag}>: ${message}`);
    this.originalMessage = message;
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
 * @fires 'ready' - Stripe has been initialized and mounted
 *
 * @fires 'stripe-ready' - **DEPRECATED**. Will be removed in a future major version. Use `ready` instead
 * @fires 'stripe-error' - **DEPRECATED**. Will be removed in a future major version. Use `error` instead
 * @fires 'stripe-payment-method' - **DEPRECATED**. Will be removed in a future major version. Use `payment-method` instead
 * @fires 'stripe-source' - **DEPRECATED**. Will be removed in a future major version. Use `source` instead
 * @fires 'stripe-token' - **DEPRECATED**. Will be removed in a future major version. Use `token` instead
 *
 * @csspart 'error' - container for the error message
 * @csspart 'stripe' - container for the stripe element
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
   * @type {string}
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
  @property({ type: Object, notify: true, readOnly: true, reflect: true, converter: {
    toAttribute: error => !error ? null : error.originalMessage || error.message || '',
  } }) error = null;

  /**
   * If the element is focused.
   * @type {boolean}
   * @readonly
   */
  @property({ type: Boolean, reflect: true, notify: true, readOnly: true }) focused = false;

  /**
   * Whether the stripe element is ready to receive focus.
   * @type {boolean}
   * @readonly
   */
  @property({ type: Boolean, reflect: true, notify: true, readOnly: true }) ready = false;

  /**
   * Stripe instance
   * @type {stripe.Stripe}
   * @readonly
   */
  @property({ type: Object, readOnly: true }) stripe = null;

  // DEPRECATED

  /**
   * Whether the element has an error
   * **DEPRECATED**. Will be removed in a future version. Use `error` instead
   * @type {boolean}
   * @readonly
   * @deprecated
   */
  @property({
    type: Boolean,
    attribute: 'has-error',
    reflect: true,
    notify: true,
    readOnly: true,
  }) hasError = false;

  /**
   * Whether the stripe element is ready to receive focus.
   * **DEPRECATED**. Will be removed in a future version. use `ready` instead.
   * @deprecated
   * @type {boolean}
   */
  @property({
    type: Boolean,
    attribute: 'stripe-ready',
    reflect: true,
    notify: true,
    readOnly: true,
  }) stripeReady = false;

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
   * @protected
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
  render() {
    const { error, showError } = this;
    const errorMessage = error?.originalMessage || error?.message;
    return html`
      <div id="stripe" part="stripe">
        <slot id="stripe-slot" name="stripe-card"></slot>
      </div>

      <output id="error"
          for="stripe"
          part="error"
          ?hidden="${!showError}">
        ${ifDefined(errorMessage)}
      </output>
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
   * Resets and clears the stripe element.
   */
  reset() {
    this.element?.clear?.();
    this.resetRepresentations();
    this.set({ error: null });
  }

  /** Blurs the element. */
  blur() {
    this.element?.blur();
  }

  /** Focuses the element. */
  focus() {
    this.element?.focus();
  }

  /* PRIVATE API */

  /**
   * Creates a new StripeElementsError
   * @param  {string} message
   * @return {StripeElementsError}
   * @private
   */
  createError(message) {
    return new StripeElementsError(this.constructor.is, message);
  }

  /**
   * Clears the Payment Representation and fires an error event
   * @private
   */
  async errorChanged() {
    // DEPRECATED
    const hasError = !!this.error;
    await this.set({ hasError });
    // END DEPRECATED
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
    this.dispatchEvent(new CustomEvent(type, { detail, ...opts }));
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
   * @private
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
    await this.unmount();
    this.destroyMountPoints();
    this.initMountPoints();
    await this.initStripe();
    await this.initElement();
    this.initElementListeners();
    this.mount();
  }

  /**
   * Removes all mount points from the DOM
   * @private
   */
  destroyMountPoints() {
    this.shadowHosts.forEach(removeAllMounts);
    if (this.stripeMount) this.stripeMount.remove();
  }

  /**
   * Adds `ready`, `focus`, and `blur` listeners to the Stripe Element
   * @private
   */
  initElementListeners() {
    this.element.addEventListener('ready', this.onReady);
    this.element.addEventListener('focus', this.onFocus);
    this.element.addEventListener('blur', this.onBlur);
  }

  /**
   * Creates mount points for the Stripe Element
   * @private
   */
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
  mount() {
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
   * @param  {StripeFocusEvent} event
   * @private
   */
  @bound async onBlur() {
    await this.set({ focused: false });
  }

  /**
   * @param  {StripeFocusEvent} event
   * @private
   */
  @bound async onFocus() {
    await this.set({ focused: true });
  }

  /**
   * Sets the `ready` property when the stripe element is ready to receive focus.
   * @param  {Event} event
   * @private
   */
  @bound async onReady(event) {
    await this.set({ ready: true, stripeReady: true });
    this.fire('ready', event);
    // DEPRECATED
    this.fire('stripe-ready', event);
  }

  /**
   * POSTs the payment info represenation to the endpoint at `/action`
   * @resolves {void}
   * @private
   */
  async postRepresentation() {
    const onError = error => this.set({ error });
    const onSuccess = success => {
      this.fire('success', success);
      // DEPRECATED
      this.fire('stripe-payment-success', success);
    };
    const token = this.token || undefined;
    const source = this.source || undefined;
    const paymentMethod = this.paymentMethod || undefined;
    const body = JSON.stringify({ token, source, paymentMethod });
    const headers = { 'Content-Type': 'application/json' };
    const method = 'POST';
    return fetch(this.action, { body, headers, method })
      .then(throwBadResponse)
      .then(onSuccess)
      .catch(onError);
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

  /**
   * Resets the Payment Representations
   * @private
   */
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
/** @typedef {{ elementType: stripe.elements.elementsType }} StripeFocusEvent */
