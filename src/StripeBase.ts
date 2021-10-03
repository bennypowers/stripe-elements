import type { TemplateResult, PropertyValues } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { LitNotify } from '@morbidick/lit-element-notify';

import { ifDefined } from 'lit/directives/if-defined.js';

import { bound } from './lib/bound.js';

import { ReadOnlyPropertiesMixin } from '@open-wc/lit-helpers';
import { appendTemplate, remove } from './lib/dom.js';
import { dash, generateRandomMountElementId } from './lib/strings.js';
import { isRepresentation } from './lib/predicates.js';
import { throwBadResponse } from './lib/fetch.js';

export const enum SlotName {
  'stripe-elements' = 'stripe-elements-slot',
  'stripe-payment-request' = 'stripe-payment-request-slot',
}

export type PaymentRepresentation = 'payment-method'|'source'|'token'

export type StripePaymentResponse =
    stripe.PaymentIntentResponse
  | stripe.PaymentMethodResponse
  | stripe.SetupIntentResponse
  | stripe.TokenResponse
  | stripe.SourceResponse

type AmbiguousError =
  Error|stripe.Error|StripeElementsError;

declare global {
  interface Node {
    getRootNode(options?: GetRootNodeOptions): Node|ShadowRoot;
  }
}

class StripeElementsError extends Error {
  originalMessage: string;

  constructor(tag: 'stripe-elements'|'stripe-payment-request', message: string) {
    super(`<${tag}>: ${message}`);
    this.originalMessage = message;
  }
}

function isStripeElementsError(error: AmbiguousError): error is StripeElementsError {
  return !!error && error instanceof StripeElementsError;
}

/* istanbul ignore next */
const removeAllMounts = (slotName: SlotName) => (host: Element): void =>
  host.querySelectorAll(`[slot="${slotName}"][name="${slotName}"]`)
    .forEach(remove);

const slotTemplate = (slotName: SlotName): TemplateResult =>
  html`<slot slot="${slotName}" name="${slotName}"></slot>`;

const errorConverter = {
  toAttribute: (error: AmbiguousError): string =>
        !error ? null
      : isStripeElementsError(error) ? error.originalMessage
      : error.message || '',
};

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
  static is: 'stripe-elements'|'stripe-payment-request'

  /* PAYMENT CONFIGURATION */

  /**
   * billing_details object sent to create the payment representation. (optional)
   */
  billingDetails: stripe.BillingDetails;

  /**
   * Data passed to stripe.createPaymentMethod. (optional)
   */
  paymentMethodData: stripe.PaymentMethodData;

  /**
   * Data passed to stripe.createSource. (optional)
   */
  sourceData: stripe.SourceOptions;

  /**
   * Data passed to stripe.createToken. (optional)
   */
  tokenData: stripe.TokenOptions;

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
   */
  @property({ type: String })
  action: string;

  /**
   * The `client_secret` part of a Stripe `PaymentIntent`
   */
  @property({ type: String, attribute: 'client-secret' })
  clientSecret: string;

  /**
   * Type of payment representation to generate.
   */
  @property({ type: String })
  generate: PaymentRepresentation = 'source';

  /**
   * Stripe Publishable Key. EG. `pk_test_XXXXXXXXXXXXXXXXXXXXXXXX`
   */
  @property({ type: String, attribute: 'publishable-key', reflect: true, notify: true })
  publishableKey: string;

  /** Whether to display the error message */
  @property({ type: Boolean, attribute: 'show-error', reflect: true })
  showError = false;

  /* READ-ONLY FIELDS */

  /* PAYMENT REPRESENTATIONS */

  /**
   * Stripe PaymentMethod
   */
  @property({ type: Object, notify: true, readOnly: true, attribute: 'payment-method' })
  readonly paymentMethod: stripe.paymentMethod.PaymentMethod = null;

  /**
   * Stripe Source
   */
  @property({ type: Object, notify: true, readOnly: true })
  readonly source: stripe.Source = null;

  /**
   * Stripe Token
   */
  @property({ type: Object, notify: true, readOnly: true })
  readonly token: stripe.Token = null;

  /**
   * Stripe element instance
   */
  @property({ type: Object, readOnly: true })
  readonly element: stripe.elements.Element = null;

  /**
   * Stripe Elements instance
   */
  @property({ type: Object, readOnly: true })
  readonly elements: stripe.elements.Elements = null;

  /**
   * Stripe or validation error
   */
  @property({
    type: Object,
    notify: true,
    readOnly: true,
    reflect: true,
    converter: errorConverter,
  })
  readonly error: AmbiguousError = null;

  /**
   * If the element is focused.
   */
  @property({ type: Boolean, reflect: true, notify: true, readOnly: true })
  readonly focused = false;

  /**
   * Whether the stripe element is ready to receive focus.
   */
  @property({ type: Boolean, reflect: true, notify: true, readOnly: true })
  readonly ready = false;

  /**
   * Stripe instance
   */
  @property({ type: Object, readOnly: true })
  readonly stripe: stripe.Stripe = null;

  // DEPRECATED

  /**
   * Whether the element has an error
   * **DEPRECATED**. Will be removed in a future version. Use `error` instead
   * @deprecated
   */
  @property({ type: Boolean, attribute: 'has-error', reflect: true, notify: true, readOnly: true })
  readonly hasError = false;

  /**
   * Whether the stripe element is ready to receive focus.
   * **DEPRECATED**. Will be removed in a future version. use `ready` instead.
   * @deprecated
   */
  @property({
    type: Boolean,
    attribute: 'stripe-ready',
    reflect: true,
    notify: true,
    readOnly: true,
  })
  readonly stripeReady = false;

  /* PRIVATE FIELDS */

  /**
   * Breadcrumbs back up to the document.
   */
  protected shadowHosts: (Element|ShadowRoot)[] = [];

  /**
   * Stripe.js mount point element. Due to limitations in the Stripe.js library, this element must be connected to the document.
   */
  protected get stripeMount(): Element { return document.getElementById(this.stripeMountId); }

  /**
   * Stripe.js mount point element id. Due to limitations in the Stripe.js library, this element must be connected to the document.
   */
  stripeMountId: string;

  /**
   * Name for breadcrumb slots. Derived from tagName
   */
  declare protected slotName: SlotName;

  /* LIFECYCLE */

  /** @inheritdoc */
  render(): TemplateResult {
    const { error, showError, slotName } = this;
    const errorMessage = isStripeElementsError(error) ? error.originalMessage : error?.message;
    return html`
      <div id="stripe" part="stripe">
        <slot id="stripe-slot" name="${slotName}"></slot>
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
  protected firstUpdated(): void {
    this.destroyMountPoints();
    this.initMountPoints();
  }

  /** @inheritdoc */
  protected updated(changed: PropertyValues): void {
    /* istanbul ignore next */
    super.updated?.(changed);
    if (changed.has('error')) this.errorChanged();
    if (changed.has('publishableKey')) this.init();
    [...changed.keys()].forEach(this.representationChanged);
  }

  /** @inheritdoc */
  async disconnectedCallback(): Promise<void> {
    super.disconnectedCallback();
    /* istanbul ignore next */
    await this.unmount?.();
    this.destroyMountPoints();
  }

  /* PUBLIC API */

  /**
   * Resets and clears the stripe element.
   */
  public reset(): void {
    /* istanbul ignore next */
    this.element?.clear?.();
    this.resetRepresentations();
    this.setReadOnlyProperties({ error: null });
  }

  /** Blurs the element. */
  public blur(): void {
    /* istanbul ignore next */
    this.element?.blur();
  }

  /** Focuses the element. */
  public focus(): void {
    /* istanbul ignore next */
    this.element?.focus();
  }

  /* PRIVATE API */

  /**
   * Creates a new StripeElementsError
   */
  protected createError(message: string): StripeElementsError {
    return new StripeElementsError((this.constructor as typeof StripeBase).is, message);
  }

  /**
   * Clears the Payment Representation and fires an error event
   */
  private async errorChanged(): Promise<void> {
    // DEPRECATED
    const hasError = !!this.error;
    await this.setReadOnlyProperties({ hasError });
    // END DEPRECATED
    this.resetRepresentations();
    this.fireError(this.error);
  }

  /**
   * Fires an event.
   * @param type      event type
   * @param detail    detail value
   * @param [opts={}]
   */
  protected fire(type: string, detail?: unknown, opts?: EventInit): void {
    this.dispatchEvent(new CustomEvent(type, { detail, ...opts }));
  }

  /**
   * Fires an Error Event
   */
  private fireError(error: AmbiguousError): void {
    this.dispatchEvent(new ErrorEvent('error', { error }));
    // DEPRECATED
    this.dispatchEvent(new ErrorEvent('stripe-error', { bubbles: true, error }));
  }

  /**
   * Gets a CSS Custom Property value, respecting ShadyCSS.
   * @param   propertyName    CSS Custom Property
   * @param   precomputedStyle pre-computed style declaration
   */
  protected getCSSCustomPropertyValue(
    propertyName: string,
    precomputedStyle?: CSSStyleDeclaration
  ): string {
    if (window.ShadyCSS) return window.ShadyCSS.getComputedStyleValue(this, propertyName);
    else return precomputedStyle.getPropertyValue(propertyName);
  }

  /**
   * Sets the token or error from the response.
   * @param   response       Stripe Response
   * @return
   */
  @bound protected async handleResponse(
    response: StripePaymentResponse
  ): Promise<StripePaymentResponse> {
    const { error = null, paymentMethod = null, source = null, token = null } = { ...response };
    await this.setReadOnlyProperties({ error, paymentMethod, source, token });
    if (error) throw error;
    else return response;
  }

  /**
   * Removes all mount points from the DOM
   */
  private destroyMountPoints(): void {
    this.shadowHosts.forEach(removeAllMounts(this.slotName));
    if (this.stripeMount) this.stripeMount.remove();
  }

  /** @abstract */
  /* istanbul ignore next */
  protected initElement?(): void | Promise<void> { 'abstract'; }

  /**
   * Reinitializes Stripe and mounts the element.
   */
  private async init(): Promise<void> {
    await this.unmount();
    await this.initStripe();
    await this.initElement();
    this.initElementListeners();
    this.destroyMountPoints();
    this.initMountPoints();
    this.mount();
  }

  /**
   * Adds `ready`, `focus`, and `blur` listeners to the Stripe Element
   */
  private initElementListeners(): void {
    if (!this.element) return;
    this.element.addEventListener('ready', this.onReady);
    this.element.addEventListener('focus', this.onFocus);
    this.element.addEventListener('blur', this.onBlur);
  }

  /**
   * Creates mount points for the Stripe Element
   */
  private initMountPoints(): void {
    this.stripeMountId = generateRandomMountElementId(this.tagName);
    if (window.ShadyDOM) appendTemplate(this.mountPointTemplate(), this);
    else this.initShadowMountPoints();
  }

  /**
   * Prepares to mount Stripe Elements in light DOM.
   */
  private initShadowMountPoints(): void {
    // trace each shadow boundary between us and the document
    let host = this as Element;
    this.shadowHosts = [this];
    while (host = (host.getRootNode() as ShadowRoot).host) // eslint-disable-line easy-loops/easy-loops, no-cond-assign, prefer-destructuring
      this.shadowHosts.push(host);

    const { shadowHosts, slotName } = this;

    // Prepare the shallowest breadcrumb slot at document level
    const hosts = [...shadowHosts];
    const root = hosts.pop();
    if (!root.querySelector(`[slot="${slotName}"]`)) {
      const div = document.createElement('div');
      div.slot = slotName;
      root.appendChild(div);
    }

    const container = root.querySelector(`[slot="${slotName}"]`);

    // Render the form to the document, so that Stripe.js can mount
    appendTemplate(this.mountPointTemplate(), container);

    // Append breadcrumb slots to each shadowroot in turn,
    // from the document down to the <stripe-elements> instance.
    hosts.forEach(appendTemplate(slotTemplate(slotName)));
  }

  /**
   * Initializes Stripe and elements.
   */
  private async initStripe(): Promise<void> {
    const { publishableKey } = this;
    const stripe = (window.Stripe && publishableKey) ? Stripe(publishableKey) : null;
    const elements = stripe && stripe.elements();
    const error = stripe ? null : this.createError('requires Stripe.js to be loaded first.');
    if (error) console.warn(error.message); // eslint-disable-line no-console
    await this.setReadOnlyProperties({ elements, error, stripe });
  }

  /**
   * Mounts the Stripe Element
   */
  private mount(): void {
    /* istanbul ignore next */
    if (!this.stripeMount) throw this.createError('Stripe Mount missing');
    this.element?.mount(this.stripeMount);
  }

  private mountPointTemplate(): TemplateResult {
    const { stripeMountId, tagName } = this;
    return html`<div id="${ifDefined(stripeMountId)}" class="${tagName.toLowerCase()}-mount"></div>`;
  }

  /**
   * Unmounts and nullifies the card.
   */
  private async unmount(): Promise<void> {
    this.element?.unmount?.();
    await this.setReadOnlyProperties({ element: null });
  }

  /**
   * Updates element state when Stripe Element is blurred.
   */
  @bound private async onBlur(): Promise<void> {
    await this.setReadOnlyProperties({ focused: false });
  }

  /**
   * @param  {StripeFocusEvent} event
   * @private
   */
  @bound private async onFocus(): Promise<void> {
    await this.setReadOnlyProperties({ focused: true });
  }

  /**
   * Sets the `ready` property when the stripe element is ready to receive focus.
   */
  @bound private async onReady(event: stripe.elements.ElementChangeResponse): Promise<void> {
    await this.setReadOnlyProperties({ ready: true, stripeReady: true });
    this.fire('ready', event);
    // DEPRECATED
    this.fire('stripe-ready', event);
  }

  /**
   * POSTs the payment info represenation to the endpoint at `/action`
   */
  private async postRepresentation(): Promise<void> {
    const onError = (error: Error): Promise<void> =>
      this.setReadOnlyProperties({ error });
    const onSuccess = (success: unknown): void => {
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
   * Updates the state and fires events when the token, source, or payment method is updated.
   */
  @bound private representationChanged(name: string): void {
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
   */
  private resetRepresentations(): void {
    this.setReadOnlyProperties({
      paymentMethod: null,
      token: null,
      source: null,
    });
  }
}
