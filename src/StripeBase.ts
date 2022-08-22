import type { TemplateResult, PropertyValues, ComplexAttributeConverter } from 'lit';
import type * as Stripe from '@stripe/stripe-js';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';

import { ifDefined } from 'lit/directives/if-defined.js';

import { bound } from './lib/bound.js';

import { dash } from './lib/strings.js';
import { isRepresentation } from './lib/predicates.js';
import { throwBadResponse } from './lib/fetch.js';
import { BreadcrumbController } from './breadcrumb-controller.js';
import { readonly } from './lib/read-only.js';
import { notify } from './lib/notify.js';
import { loadStripe } from '@stripe/stripe-js/pure.js';
import { StripeElementLocale } from '@stripe/stripe-js';

export const enum SlotName {
  'stripe-elements' = 'stripe-elements-slot',
  'stripe-payment-request' = 'stripe-payment-request-slot',
}

export type PaymentRepresentation = 'payment-method'|'source'|'token'
export type StripePaymentResponse =
  | Stripe.PaymentIntentResult
  | Stripe.PaymentMethodResult
  | Stripe.SetupIntentResult
  | Stripe.TokenResult
  | Stripe.SourceResult

type StripeElementType = Stripe.StripeCardElement | Stripe.StripePaymentRequestButtonElement;
type AmbiguousError = Error|Stripe.StripeError|StripeElementsError;

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

function isStripeElementsError(error: AmbiguousError | null): error is StripeElementsError {
  return !!error && error instanceof StripeElementsError;
}

const errorConverter: ComplexAttributeConverter = {
  toAttribute: (error: AmbiguousError) =>
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
 * @csspart 'error' - container for the error message
 * @csspart 'stripe' - container for the stripe element
 */
export class StripeBase extends LitElement {
  static is: 'stripe-elements'|'stripe-payment-request';

  /* PAYMENT CONFIGURATION */

  /**
   * billing_details object sent to create the payment representation. (optional)
   */
  billingDetails?: Stripe.CreatePaymentMethodData['billing_details'];

  /**
   * Data passed to stripe.createPaymentMethod. (optional)
   */
  paymentMethodData?: Stripe.CreatePaymentMethodData;

  /**
   * Data passed to stripe.createSource. (optional)
   */
  sourceData?: Stripe.CreateSourceData;

  /**
   * Data passed to stripe.createToken. (optional)
   */
  tokenData?: Stripe.CreateTokenCardData;

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
  @property({ type: String }) action?: string;

  /**
   * The `client_secret` part of a Stripe `PaymentIntent`
   */
  @property({ type: String, attribute: 'client-secret' }) clientSecret?: string;

  /**
   * Type of payment representation to generate.
   */
  @property({ type: String }) generate: PaymentRepresentation = 'source';

  /**
   * Stripe Publishable Key. EG. `pk_test_XXXXXXXXXXXXXXXXXXXXXXXX`
   */
  @notify
  @property({ type: String, attribute: 'publishable-key', reflect: true }) publishableKey?: string;

  /** Whether to display the error message */
  @property({ type: Boolean, attribute: 'show-error', reflect: true }) showError = false;

  /** Stripe account to use (connect) */
  @property({ type: String, attribute: 'stripe-account' }) stripeAccount?: string;

  /** Stripe locale to use */
  @property({ type: String, attribute: 'locale' }) locale: StripeElementLocale = 'auto';

  /* READ-ONLY FIELDS */

  /* PAYMENT REPRESENTATIONS */

  /**
   * Stripe PaymentMethod
   */
  @readonly
  @notify
  @property({ type: Object, attribute: 'payment-method' })
  readonly paymentMethod: Stripe.PaymentMethod | null = null;

  /**
   * Stripe Source
   */
  @readonly
  @notify
  @property({ type: Object })
  readonly source: Stripe.Source | null = null;

  /**
   * Stripe Token
   */
  @readonly
  @notify
  @property({ type: Object })
  readonly token: Stripe.Token | null = null;

  /**
   * Stripe element instance
   */
  @readonly
  @property({ type: Object })
  readonly element: StripeElementType | null = null;

  /**
   * Stripe Elements instance
   */
  @readonly
  @property({ type: Object })
  readonly elements: Stripe.StripeElements | null = null;

  /**
   * Stripe or validation error
   */
  @readonly
  @notify
  @property({ type: Object, reflect: true, converter: errorConverter })
  readonly error: AmbiguousError | null = null;

  /**
   * If the element is focused.
   */
  @readonly
  @notify
  @property({ type: Boolean, reflect: true })
  readonly focused: boolean = false;

  /**
   * Whether the stripe element is ready to receive focus.
   */
  @readonly
  @notify
  @property({ type: Boolean, reflect: true })
  readonly ready: boolean = false;

  /**
   * Stripe instance
   */
  @readonly
  @property({ type: Object })
  readonly stripe: Stripe.Stripe | null = null;

  /**
   * Stripe appearance theme
   * @see https://stripe.com/docs/stripe-js/appearance-api#theme
   */
  @property() theme: 'stripe'|'night'|'flat'|'none' = 'none';

  @property({ attribute: 'border-radius' }) borderRadius?: string;
  @property({ attribute: 'color-background' }) colorBackground?: string;
  @property({ attribute: 'color-danger' }) colorDanger?: string;
  @property({ attribute: 'color-primary' }) colorPrimary?: string;
  @property({ attribute: 'color-text' }) colorText?: string;
  @property({ attribute: 'font-family' }) fontFamily?: string;
  @property({ attribute: 'spacing-unit' }) spacingUnit?: string;

  /* PRIVATE FIELDS */

  private precomputedStyle = getComputedStyle(this);

  private breadcrumb = new BreadcrumbController(this, {
    slotName: `${(this.constructor as typeof StripeBase).is}-slot`,
  });

  get stripeMountId() { return this.breadcrumb.mountId; }
  get stripeMount() { return this.breadcrumb.mount; }

  /* LIFECYCLE */

  /** @inheritdoc */
  render(): TemplateResult {
    const { error, showError } = this;
    const { slotName } = this.breadcrumb;
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
  protected updated(changed: PropertyValues): void {
    /* istanbul ignore next */
    super.updated?.(changed);
    if (changed.has('error')) this.errorChanged();
    if (changed.has('publishableKey')) this.init();
    [...changed.keys()].forEach(k => this.representationChanged(k));
  }

  /** @inheritdoc */
  async disconnectedCallback(): Promise<void> {
    super.disconnectedCallback();
    /* istanbul ignore next */
    await this.unmount?.();
  }

  /* PUBLIC API */

  /**
   * Resets and clears the stripe element.
   */
  public reset(): void {
    /* istanbul ignore next */
    this.element?.clear?.();
    this.resetRepresentations();
    readonly.set<StripeBase>(this, { error: null });
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
  private errorChanged(): void {
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
  private fireError(error: AmbiguousError | null): void {
    this.dispatchEvent(new ErrorEvent('error', { error }));
  }

  /**
   * Gets a CSS Custom Property value.
   * @param   propertyName    CSS Custom Property
   */
  protected getCSSCustomPropertyValue(propertyName: string): string {
    return this.precomputedStyle.getPropertyValue(propertyName);
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
    readonly.set<StripeBase>(this, { error, paymentMethod, source, token });
    await this.updateComplete;
    if (error) throw error;
    else return response;
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
    await this.initElement!();
    this.initElementListeners();
    this.breadcrumb.init();
    this.mount();
  }

  /**
   * Adds `ready`, `focus`, and `blur` listeners to the Stripe Element
   */
  private initElementListeners(): void {
    if (!this.element) return;
    // @ts-expect-error: should still work
    this.element.on('ready', this.onReady);
    // @ts-expect-error: should still work
    this.element.on('focus', this.onFocus);
    // @ts-expect-error: should still work
    this.element.on('blur', this.onBlur);
  }

  /**
   * Initializes Stripe and elements.
   */
  private async initStripe(): Promise<void> {
    const { publishableKey, stripeAccount, locale } = this;
    if (!publishableKey)
      readonly.set<StripeBase>(this, { elements: null, element: null, stripe: null });
    else {
      try {
        const options = { stripeAccount, locale };
        const stripe =
            (window.Stripe) ? window.Stripe(publishableKey, options)
          : await loadStripe(publishableKey, options);
        const elements = stripe?.elements();
        readonly.set<StripeBase>(this, { elements, error: null, stripe });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e);
        const error = this.createError('Stripe.js must be loaded first.');
        readonly.set<StripeBase>(this, { elements: null, error, stripe: null });
      } finally {
        await this.updateComplete;
      }
    }
  }

  /**
   * Mounts the Stripe Element
   */
  private mount(): void {
    /* istanbul ignore next */
    if (!this.breadcrumb.mount)
      throw this.createError('Stripe Mount missing');
    this.element?.mount(this.breadcrumb.mount as HTMLElement);
  }

  /**
   * Unmounts and nullifies the card.
   */
  private async unmount(): Promise<void> {
    this.element?.unmount?.();
    readonly.set<StripeBase>(this, { element: null });
    await this.updateComplete;
  }

  /**
   * Updates element state when Stripe Element is blurred.
   */
  @bound private async onBlur(): Promise<void> {
    readonly.set<StripeBase>(this, { focused: false });
    await this.updateComplete;
  }

  @bound private async onFocus(): Promise<void> {
    readonly.set<StripeBase>(this, { focused: true });
    await this.updateComplete;
  }

  /**
   * Sets the `ready` property when the stripe element is ready to receive focus.
   */
  @bound private async onReady(event: Stripe.StripeElementChangeEvent): Promise<void> {
    readonly.set<StripeBase>(this, { ready: true });
    await this.updateComplete;
    this.fire('ready', event);
  }

  /**
   * POSTs the payment info represenation to the endpoint at `/action`
   */
  private async postRepresentation(): Promise<void> {
    const onError = (error: Error): void => readonly.set<StripeBase>(this, { error });
    const onSuccess = (success: unknown): void => this.fire('success', success);
    const token = this.token || undefined;
    const source = this.source || undefined;
    const paymentMethod = this.paymentMethod || undefined;
    const body = JSON.stringify({ token, source, paymentMethod });
    const headers = { 'Content-Type': 'application/json' };
    const method = 'POST';
    return fetch(this.action!, { body, headers, method })
      .then(throwBadResponse)
      .then(onSuccess)
      .catch(onError);
  }

  /**
   * Updates the state and fires events when the token, source, or payment method is updated.
   */
  private representationChanged(name: PropertyKey): void {
    if (!isRepresentation(name as string))
      return;
    const value = this[name as keyof this];
    /* istanbul ignore if */
    if (!value)
      return;
    this.fire(`${dash(name as string)}`, value);
    if (this.action)
      this.postRepresentation();
  }

  /**
   * Resets the Payment Representations
   */
  private resetRepresentations(): void {
    readonly.set<StripeBase>(this, {
      paymentMethod: null,
      token: null,
      source: null,
    });
  }
}
