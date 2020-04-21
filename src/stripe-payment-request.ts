import type { CountryCode } from './lib/countries';
import { customElement, property, PropertyValues } from 'lit-element';

import bound from 'bind-decorator';

import { StripeBase } from './StripeBase';
import { throwResponseError } from './lib/stripe';
import sharedStyles from './shared.css';
import style from './stripe-payment-request.css';

type DisplayItem = stripe.paymentRequest.DisplayItem;
type ShippingOption = stripe.paymentRequest.ShippingOption;
type StripePaymentRequestOptions = stripe.paymentRequest.StripePaymentRequestOptions;
type PaymentIntent = stripe.paymentIntents.PaymentIntent;
type PaymentRequestButtonStyleOptions = stripe.elements.PaymentRequestButtonStyleOptions;
type PaymentIntentResponse = stripe.PaymentIntentResponse

interface StripeDisplayItem extends HTMLElement {
  dataset: {
    amount: string;
    label: string;
    pending?: string;
  };
}

export const enum Events {
  success = 'success',
  fail = 'fail',
  cancel = 'cancel',
}

export function isStripeDisplayItem(el: Element): el is StripeDisplayItem {
  return el.tagName.toLowerCase() === 'stripe-display-item';
}

function datasetToStripeDisplayItem(
  { dataset: { amount, label, pending } }: StripeDisplayItem
): stripe.paymentRequest.DisplayItem {
  return {
    label,
    amount: parseInt(amount),
    ...pending !== undefined && { pending: pending === 'true' ? true : false },
  };
}

interface StripeShippingOption extends HTMLElement {
  dataset: {
    id: string;
    label: string;
    detail?: string;
    amount: string;
  };
}

export function isStripeShippingOption(el: Element): el is StripeShippingOption {
  return el.tagName.toLowerCase() === 'stripe-shipping-option';
}

function datasetToStripeShippingOption(
  { dataset: { amount, ...rest } }: StripeShippingOption
): stripe.paymentRequest.ShippingOption {
  return {
    amount: parseInt(amount),
    ...rest,
  };
}

function mapDataset(
  el: StripeDisplayItem|StripeShippingOption
): stripe.paymentRequest.DisplayItem|stripe.paymentRequest.ShippingOption {
  return (
      isStripeDisplayItem(el) ? datasetToStripeDisplayItem(el)
    : datasetToStripeShippingOption(el)
  );
}

type Await<T> = T extends Promise<infer U> ? U : T;

type StripePaymentRequestResponse =
    stripe.paymentRequest.StripeSourcePaymentResponse
  | stripe.paymentRequest.StripeTokenPaymentResponse
  | stripe.paymentRequest.StripePaymentMethodPaymentResponse

type PaymentResponseOrError =
    stripe.Error
  | stripe.PaymentIntentResponse
  | stripe.TokenResponse
  | stripe.SourceResponse

export type PaymentResponseHandler =
  (x: PaymentResponseOrError) => PaymentResponseOrError

interface ShippingAddressChangeEvent {
  updateWith: (options: stripe.paymentRequest.UpdateDetails) => void;
  shippingAddress: stripe.paymentRequest.ShippingAddress;
}

interface ShippingOptionChangeEvent {
  updateWith: (options: stripe.paymentRequest.UpdateDetails) => void;
  shippingOption: ShippingOption;
}

type CanMakePaymentType =
  Await<ReturnType<stripe.paymentRequest.StripePaymentRequest['canMakePayment']>>

/**
 * Custom element wrapper for Stripe.js v3 Payment Request Buttons.
 *
 * 👨‍🎨 [Live Demo](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-payment-request--enter-a-stripe-publishable-key) 👀
 *
 * ### 🧙‍♂️ Usage
 * If you prebuilt with Snowpack, load the module from your `web_modules` directory
 *
 * ```html
 * <script type="module" src="/web_modules/@power-elements/stripe-elements/stripe-payment-request.js"></script>
 * ```
 *
 * Alternatively, load the module from the unpkg CDN
 * ```html
 * <script type="module" src="https://unpkg.com/@power-elements/stripe-elements/stripe-payment-request.js?module"></script>
 * ```
 *
 * Then you can add the element to your page.
 *
 * ```html
 *
 * <stripe-payment-request id="payment-request"
 *     publishable-key="pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"
 *     generate="token"
 *     action="/charges"
 *     country="CA"
 *     currency="cad"
 *     amount="1000"
 *     label="Ten Bones"
 *     request-payer-name
 *     request-payer-email
 *     request-payer-phone
 * ></stripe-payment-request>
 * ```
 *
 * See the demos for more comprehensive examples.
 *   - Using `<stripe-payment-request>` with [plain HTML and JavaScript](https://bennypowers.dev/stripe-elements/?path=/docs/framework-examples-vanilla--stripe-payment-request).
 *   - Using `<stripe-payment-request>` in a [LitElement](https://bennypowers.dev/stripe-elements/?path=/docs/framework-examples-litelement--stripe-payment-request).
 *   - Using `<stripe-payment-request>` in a [Vue Component](https://bennypowers.dev/stripe-elements/?path=/docs/framework-examples-vue--stripe-payment-request).
 *   - Using `<stripe-payment-request>` in an [Angular component](https://bennypowers.dev/stripe-elements/?path=/docs/framework-examples-angular--stripe-payment-request).
 *   - Using `<stripe-payment-request>` in a [React component](https://bennypowers.dev/stripe-elements/?path=/docs/framework-examples-react--stripe-payment-request).
 *   - Using `<stripe-payment-request>` in a [Preact component](https://bennypowers.dev/stripe-elements/?path=/docs/framework-examples-preact--stripe-payment-request).
 *
 * @cssprop [--stripe-payment-request-element-min-width=`300px`] - min-width property of the container element
 * @cssprop [--stripe-payment-request-element-padding=`8px 12px`] - padding property of the container element
 * @cssprop [--stripe-payment-request-element-background=`white`] - background property of the container element
 *
 * @element stripe-payment-request
 * @extends StripeBase
 *
 * @fires 'unsupported' - When the element detects that the user agent cannot make a payment
 * @fires 'fail' - When a payment request fails
 * @fires 'cancel' - When a payment request is cancelled
 * @fires 'shippingaddresschange' - When the user chooses a different shipping address
 * @fires 'shippingoptionchange' - When the user chooses a different shipping option
 */
@customElement('stripe-payment-request')
export class StripePaymentRequest extends StripeBase {
  static readonly is = 'stripe-payment-request';

  static readonly styles = [
    sharedStyles,
    style,
  ];

  /**
   * The amount in the currency's subunit (e.g. cents, yen, etc.)
   */
  @property({ type: Number, reflect: true })
  amount: number;

  /**
   * Whether or not the device can make the payment request.
   * @readonly
   */
  @property({
    type: Boolean,
    attribute: 'can-make-payment',
    reflect: true,
    readOnly: true,
    notify: true,
  })
  readonly canMakePayment: CanMakePaymentType = null;

  /**
   * The two-letter country code of your Stripe account
   * @example CA
   */
  @property({ type: String })
  country: CountryCode;

  /**
   * Three character currency code
   * @example usd
   */
  @property({ type: String })
  currency: StripePaymentRequestOptions['currency'];

  #displayItems: DisplayItem[];

  /**
   * An array of DisplayItem objects. These objects are shown as line items in the browser’s payment interface. Note that the sum of the line item amounts does not need to add up to the total amount above.
   */
  @property({ type: Array })
  get displayItems(): DisplayItem[] {
    const value = this.#displayItems;
    return (
        Array.isArray(value) ? value
      : this.parseDatasets('stripe-display-item')
    );
  }

  set displayItems(value) {
    const oldValue = this.displayItems;
    this.#displayItems = value;
    this.requestUpdate('displayItems', oldValue);
  }

  /**
   * A name that the browser shows the customer in the payment interface.
   */
  @property({ type: String, reflect: true })
  label: string;

  /**
   * Stripe PaymentIntent
   */
  @property({ type: Object, notify: true, readOnly: true, attribute: 'payment-intent' })
  readonly paymentIntent: PaymentIntent = null;

  /**
   * Stripe PaymentRequest
   */
  @property({ type: Object, attribute: 'payment-request', readOnly: true })
  readonly paymentRequest: stripe.paymentRequest.StripePaymentRequest = null;

  /**
   * If you might change the payment amount later (for example, after you have calcluated shipping costs), set this to true. Note that browsers treat this as a hint for how to display things, and not necessarily as something that will prevent submission.
   */
  @property({ type: Boolean, reflect: true })
  pending = false;

  /**
   * See the requestPayerName option.
   */
  @property({ type: Boolean, attribute: 'request-payer-email' })
  requestPayerEmail: boolean;

  /**
   * By default, the browser‘s payment interface only asks the customer for actual payment information. A customer name can be collected by setting this option to true. This collected name will appears in the PaymentResponse object.
   *
   * We highly recommend you collect at least one of name, email, or phone as this also results in collection of billing address for Apple Pay. The billing address can be used to perform address verification and block fraudulent payments. For all other payment methods, the billing address is automatically collected when available.
   */
  @property({ type: Boolean, attribute: 'request-payer-name' })
  requestPayerName: boolean;

  /**
   * See the requestPayerName option.
   */
  @property({ type: Boolean, attribute: 'request-payer-phone' })
  requestPayerPhone: boolean;

  /**
   * Collect shipping address by setting this option to true. The address appears in the PaymentResponse.
   * You must also supply a valid [ShippingOptions] to the shippingOptions property. This can be up front at the time stripe.paymentRequest is called, or in response to a shippingaddresschange event using the updateWith callback.
   */
  @property({ type: Boolean, attribute: 'request-shipping' })
  requestShipping: boolean;

  #shippingOptions: ShippingOption[]

  /**
   * An array of ShippingOption objects. The first shipping option listed appears in the browser payment interface as the default option.
   */
  @property({ type: Array }) get shippingOptions(): ShippingOption[] {
    const value = this.#shippingOptions;
    return Array.isArray(value) ? value : this.parseDatasets('stripe-shipping-option');
  }

  set shippingOptions(value) {
    const oldValue = this.shippingOptions;
    this.#shippingOptions = value;
    this.requestUpdate('shippingOptions', oldValue);
  }

  @property({ type: String, attribute: 'button-type' })
  buttonType: PaymentRequestButtonStyleOptions['type'] = 'default';

  @property({ type: String, attribute: 'button-theme' })
  buttonTheme: PaymentRequestButtonStyleOptions['theme'] = 'dark';

  /* PUBLIC API */

  public reset(): void {
    super.reset();
    this.setReadOnlyProperties({ paymentIntent: null });
  }

  /* LIFECYCLE */

  /** @inheritdoc */
  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('generate')) this.initPaymentRequestListeners();
  }

  /* PRIVATE API */

  /**
   * Creates a StripePaymentRequestOptions object.
   */
  private getStripePaymentRequestOptions(): StripePaymentRequestOptions {
    const {
      country,
      currency,
      displayItems,
      shippingOptions,
      requestPayerEmail,
      requestPayerName,
      requestPayerPhone,
      label,
      amount,
    } = this;
    const total = { label, amount };
    return {
      country,
      currency,
      displayItems,
      requestPayerEmail,
      requestPayerName,
      requestPayerPhone,
      shippingOptions,
      total,
    };
  }

  /**
   * Initializes the PaymentRequest Object.
   */
  protected async initElement(): Promise<void> {
    await this.initPaymentRequest();
    await this.initPaymentRequestListeners();
    await this.initPaymentRequestButton();
  }

  /**
   * Initialized the `PaymentRequest` object.
   */
  private async initPaymentRequest(): Promise<void> {
    if (!this.stripe) return;
    const stripePaymentRequestOptions = this.getStripePaymentRequestOptions();
    const paymentRequest = this.stripe.paymentRequest(stripePaymentRequestOptions);
    const canMakePayment = await paymentRequest.canMakePayment();
    await this.setReadOnlyProperties({ paymentRequest, canMakePayment });
    if (!this.canMakePayment) this.fire('unsupported');
  }

  /**
   * Creates Stripe Payment Request Element.
   */
  private async initPaymentRequestButton(): Promise<void> {
    const { buttonTheme: theme, buttonType: type, canMakePayment, paymentRequest } = this;
    if (!canMakePayment) return;
    const computedStyle = window.ShadyCSS ? undefined : getComputedStyle(this);
    const propertyName = '--stripe-payment-request-button-height';
    const height = this.getCSSCustomPropertyValue(propertyName, computedStyle) || '40px';
    const style = { paymentRequestButton: { height, theme, type } };
    const options = { paymentRequest, style };
    const element = this.elements.create('paymentRequestButton', options);
    await this.setReadOnlyProperties({ element });
  }

  /**
   * Attaches listeners to the `PaymentRequest` object.
   */
  private async initPaymentRequestListeners(): Promise<void> {
    if (!this.canMakePayment) return;
    this.paymentRequest.on('cancel', this.onCancel);
    this.paymentRequest.on('shippingaddresschange', this.onShippingaddresschange);
    this.paymentRequest.on('shippingoptionchange', this.onShippingoptionchange);
    switch (this.generate) {
      case 'payment-method': this.paymentRequest.on('paymentmethod', this.onPaymentResponse); break;
      case 'source': this.paymentRequest.on('source', this.onPaymentResponse); break;
      case 'token': this.paymentRequest.on('token', this.onPaymentResponse); break;
    }
  }

  /**
   * Handle a `cancel` event
   */
  @bound private onCancel(): void {
    this.fire(Events.cancel);
  }

  /**
   * Completes the PaymentRequest.
   */
  @bound private async complete(
    paymentResponse: StripePaymentRequestResponse,
    confirmationError?: stripe.Error
  ): Promise<StripePaymentRequestResponse | { error: stripe.Error | null }> {
    const { error: paymentResponseError = null } = { ...paymentResponse };
    const status = (paymentResponseError || confirmationError) ? Events.fail : Events.success;
    paymentResponse.complete(status);
    this.fire(status, paymentResponse);
    return confirmationError ? { error: confirmationError } : paymentResponse;
  }

  /**
   * Handle a paymentResponse from Stripe
   */
  @bound private async onPaymentResponse(
    paymentResponse: StripePaymentRequestResponse
  ): Promise<void> {
    const { clientSecret, confirmPaymentIntent, complete } = this;
    const {
      error = null,
      paymentMethod = null,
      source = null,
      token = null,
    } = { ...paymentResponse };

    await this.setReadOnlyProperties({ error, paymentMethod, source, token });

    const isPaymentIntent = clientSecret && !error;
    if (isPaymentIntent) confirmPaymentIntent(paymentResponse);
    else complete(paymentResponse);
  }

  /**
   * When a PaymentIntent client secret is set, confirm the payment
   */
  @bound private async confirmPaymentIntent(
    paymentResponse: StripePaymentRequestResponse
  ): Promise<void> {
    const confirmCardData = { payment_method: this.paymentMethod.id }; // eslint-disable-line @typescript-eslint/camelcase
    const { error = null, paymentIntent = null } =
      await this.confirmCardPayment(confirmCardData, { handleActions: false })
        .then(({ error: confirmationError }) => this.complete(paymentResponse, confirmationError)) // throws if first confirm errors
        .then(throwResponseError)
        .then(() => this.confirmCardPayment())
        .then(throwResponseError)
        .catch(error => ({ error })); // catch error from first confirm

    await this.setReadOnlyProperties({ error, paymentIntent });
  }

  /**
   * Stripe confirmCardPayment method
   */
  @bound private async confirmCardPayment(
    data?: stripe.ConfirmCardPaymentData,
    options?: stripe.ConfirmCardPaymentOptions
  ): Promise<PaymentIntentResponse> {
    return this.stripe.confirmCardPayment(this.clientSecret, data, options);
  }

  @bound private onShippingaddresschange(originalEvent: ShippingAddressChangeEvent): void {
    this.fire('shippingaddresschange', originalEvent);
  }

  @bound private onShippingoptionchange(originalEvent: ShippingOptionChangeEvent): void {
    this.fire('shippingoptionchange', originalEvent);
  }

  /**
   * Parses an element's dataset number props from string to number
   */
  private parseDatasets(selector: 'stripe-shipping-option'): ShippingOption[]

  private parseDatasets(selector: 'stripe-display-item'): DisplayItem[]

  private parseDatasets(
    selector: 'stripe-display-item'|'stripe-shipping-option'
  ): (stripe.paymentRequest.DisplayItem|stripe.paymentRequest.ShippingOption)[] {
    const elements =
      [...this.querySelectorAll(selector)] as (StripeDisplayItem|StripeShippingOption)[];

    return (
        !elements.length ? []
      : elements.map(mapDataset)
    );
  }
}
