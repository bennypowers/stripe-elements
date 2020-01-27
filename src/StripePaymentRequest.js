import { property } from 'lit-element';

import bound from 'bound-decorator';

import { StripeBase } from './StripeBase';
import { camel } from './lib/strings';
import { mapDataset, mapProps } from './lib/dom';
import { throwResponseError } from './lib/stripe';
import { unary } from './lib/functions';
import sharedStyles from './shared.css';
import style from './stripe-payment-request.css';

const parseAmount = mapProps({ amount: unary(parseInt) });
const parseDataset = mapDataset(parseAmount);

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
 * @cssprop [--stripe-payment-request-element-min-width] - min-width property of the container element. Default `300px`
 * @cssprop [--stripe-payment-request-element-padding] - padding property of the container element. Default `8px 12px`
 * @cssprop [--stripe-payment-request-element-background] - background property of the container element. Default `white`
 *
 * @element stripe-payment-request
 * @extends StripeBase
 *
 * @fires 'fail' - When a payment request fails
 * @fires 'cancel' - When a payment request is cancelled
 * @fires 'shippingaddresschange' - When the user chooses a different shipping address
 * @fires 'shippingoptionchange' - When the user chooses a different shipping option
 */
export class StripePaymentRequest extends StripeBase {
  static is = 'stripe-payment-request';

  static styles = [
    sharedStyles,
    style,
  ];

  /**
   * The amount in the currency's subunit (e.g. cents, yen, etc.)
   * @type {number}
   */
  @property({ type: Number, reflect: true }) amount;

  /**
   * Whether or not the device can make the payment request.
   * @type {object}
   * @readonly
   */
  @property({
    type: Boolean,
    attribute: 'can-make-payment',
    reflect: true,
    readOnly: true,
  }) canMakePayment = null;

  /**
   * The two-letter country code of your Stripe account (e.g., `US`)
   * @type {string}
   */
  @property({ type: String }) country;

  /**
   * Three character currency code (e.g., `usd`)
   * @type {string}
   */
  @property({ type: String }) currency;

  /**
   * An array of DisplayItem objects. These objects are shown as line items in the browser’s payment interface. Note that the sum of the line item amounts does not need to add up to the total amount above.
   * @type {stripe.paymentRequest.DisplayItem[]}
   */
  @property({ type: Array }) get displayItems() {
    const value = this.__displayItems;
    return Array.isArray(value) ? value : this.parseDatasets('stripe-display-item');
  }

  set displayItems(value) {
    const oldValue = this.displayItems;
    /** @private */
    this.__displayItems = value;
    this.requestUpdate('displayItems', oldValue);
  }

  /**
   * A name that the browser shows the customer in the payment interface.
   * @type {string}
   */
  @property({ type: String, reflect: true }) label;

  /**
   * Stripe PaymentIntent
   * @type {stripe.paymentIntents.PaymentIntent}
   * @readonly
   */
  @property({
    type: Object,
    notify: true,
    readOnly: true,
    attribute: 'payment-intent',
  }) paymentIntent = null;

  /**
   * Stripe PaymentRequest
   * @type {stripe.paymentRequest.StripePaymentRequest}
   */
  @property({ type: Object, attribute: 'payment-request', readOnly: true }) paymentRequest = null;

  /**
   * If you might change the payment amount later (for example, after you have calcluated shipping costs), set this to true. Note that browsers treat this as a hint for how to display things, and not necessarily as something that will prevent submission.
   * @type {boolean}
   */
  @property({ type: Boolean, reflect: true }) pending = false;

  /**
   * See the requestPayerName option.
   * @type {boolean}
   */
  @property({ type: Boolean, attribute: 'request-payer-email' }) requestPayerEmail;

  /**
   * By default, the browser‘s payment interface only asks the customer for actual payment information. A customer name can be collected by setting this option to true. This collected name will appears in the PaymentResponse object.
   *
   * We highly recommend you collect at least one of name, email, or phone as this also results in collection of billing address for Apple Pay. The billing address can be used to perform address verification and block fraudulent payments. For all other payment methods, the billing address is automatically collected when available.
   * @type {boolean}
   */
  @property({ type: Boolean, attribute: 'request-payer-name' }) requestPayerName;

  /**
   * See the requestPayerName option.
   * @type {boolean}
   */
  @property({ type: Boolean, attribute: 'request-payer-phone' }) requestPayerPhone;

  /**
   * Collect shipping address by setting this option to true. The address appears in the PaymentResponse.
   * You must also supply a valid [ShippingOptions] to the shippingOptions property. This can be up front at the time stripe.paymentRequest is called, or in response to a shippingaddresschange event using the updateWith callback.
   * @type {boolean}
   */
  @property({ type: Boolean, attribute: 'request-shipping' }) requestShipping;

  /**
   * An array of ShippingOption objects. The first shipping option listed appears in the browser payment interface as the default option.
   * @type {stripe.paymentRequest.ShippingOption[]}
   */
  @property({ type: Array }) get shippingOptions() {
    const value = this.__shippingOptions;
    return Array.isArray(value) ? value : this.parseDatasets('stripe-shipping-option');
  }

  set shippingOptions(value) {
    const oldValue = this.shippingOptions;
    /** @private */
    this.__shippingOptions = value;
    this.requestUpdate('shippingOptions', oldValue);
  }

  /**
   * @type {'default'|'book'|'buy'|'donate'}
   */
  @property({ type: String, attribute: 'button-type' }) buttonType = 'default';

  /**
   * @type {'dark'|'light'|'light-outline'}
   */
  @property({ type: String, attribute: 'button-theme' }) buttonTheme = 'dark';

  /* PUBLIC API */

  reset() {
    super.reset();
    this.set({ paymentIntent: null });
  }

  /* LIFECYCLE */

  /** @inheritdoc */
  updated(changed) {
    super.updated(changed);
    if (changed.has('generate')) this.initPaymentRequestListeners();
  }

  /* PRIVATE API */

  /**
   * Creates a StripePaymentRequestOptions object.
   * @return {stripe.paymentRequest.StripePaymentRequestOptions} [description]
   * @private
   */
  getStripePaymentRequestOptions() {
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
   * @private
   */
  async initElement() {
    await this.initPaymentRequest();
    await this.initPaymentRequestListeners();
    await this.initPaymentRequestButton();
  }

  /**
   * Initialized the `PaymentRequest` object.
   * @private
   */
  async initPaymentRequest() {
    if (!this.stripe) return;
    const stripePaymentRequestOptions = this.getStripePaymentRequestOptions();
    const paymentRequest = this.stripe.paymentRequest(stripePaymentRequestOptions);
    const canMakePayment = await paymentRequest.canMakePayment();
    await this.set({ paymentRequest, canMakePayment });
  }

  /**
   * Creates Stripe Payment Request Element.
   * @private
   */
  async initPaymentRequestButton() {
    const { buttonTheme: theme, buttonType: type, canMakePayment, paymentRequest } = this;
    if (!canMakePayment) return;
    const computedStyle = window.ShadyCSS ? undefined : getComputedStyle(this);
    const propertyName = '--stripe-payment-request-button-height';
    const height = this.getCSSCustomPropertyValue(propertyName, computedStyle) || '40px';
    const style = { paymentRequestButton: { height, theme, type } };
    const options = { paymentRequest, style };
    const element = this.elements.create('paymentRequestButton', options);
    await this.set({ element });
  }

  /**
   * Attaches listeners to the `PaymentRequest` object.
   * @private
   */
  async initPaymentRequestListeners() {
    if (!this.canMakePayment) return;
    const stripeEvent = camel(this.generate).toLowerCase();
    this.paymentRequest.on(stripeEvent, this.onPaymentResponse);
    this.paymentRequest.on('cancel', this.onCancel);
    this.paymentRequest.on('shippingaddresschange', this.onShippingaddresschange);
    this.paymentRequest.on('shippingoptionchange', this.onShippingoptionchange);
  }

  /**
   * Handle a `cancel` event
   * @param  {StripeCancelEvent} originalEvent
   * @private
   */
  @bound onCancel(originalEvent) {
    this.fire('cancel', originalEvent);
  }

  /**
   * Completes the PaymentRequest. If a confirmation error is passed in the second argument,
   * will throw that error
   * @param {PaymentResponse} paymentResponse
   * @param {stripe.Error} [confirmationError] error from Stripe#confirmCardPayment. Should be thrown so that element state remains sane.
   * @resolvees {PaymentResponse}
   * @sideeffect
   * @private
   */
  @bound async complete(paymentResponse, confirmationError) {
    const { error: paymentResponseError } = paymentResponse;
    const status = paymentResponseError || confirmationError ? 'fail' : 'success';
    paymentResponse.complete(status);
    this.fire(status, paymentResponse);
    return confirmationError ? { error: confirmationError } : paymentResponse;
  }

  /**
   * Handle a paymentResponse from Stripe
   * @param  {PaymentResponse}  paymentResponse stripe PaymentResponse paymentResponse
   * @resolves {PaymentResponse}
   * @rejects {stripe.Error|Error}
   * @private
   */
  @bound async onPaymentResponse(paymentResponse) {
    const { clientSecret, confirmPaymentIntent, complete } = this;
    const { error = null, paymentMethod = null, source = null, token = null } = paymentResponse;
    await this.set({ error, paymentMethod, source, token });
    const isPaymentIntent = clientSecret && !error;
    return isPaymentIntent ? confirmPaymentIntent(paymentResponse) : complete(paymentResponse);
  }

  /**
   * When a PaymentIntent client secret is set, confirm the payment
   * @param {PaymentResponse} paymentResponse
   * @private
   */
  @bound async confirmPaymentIntent(paymentResponse) {
    const confirmCardData = { payment_method: this.paymentMethod.id };
    const { error = null, paymentIntent = null } =
      await this.confirmCardPayment(confirmCardData, { handleActions: false })
        .then(({ error: confirmationError }) => this.complete(paymentResponse, confirmationError)) // throws if first confirm errors
        .then(throwResponseError)
        .then(() => this.confirmCardPayment())
        .then(throwResponseError)
        .catch(error => ({ error })); // catch error from first confirm

    await this.set({ error, paymentIntent });
  }

  /**
   * Stripe confirmCardPayment method
   * @param {stripe.ConfirmCardPaymentData} data
   * @param {stripe.ConfirmCardPaymentOptions} options
   * @private
   */
  @bound async confirmCardPayment(data, options) {
    return this.stripe.confirmCardPayment(this.clientSecret, data, options);
  }

  /**
   * @param {ShippingAddressChangeEvent} originalEvent
   * @private
   */
  @bound onShippingaddresschange(originalEvent) {
    this.fire('shippingaddresschange', originalEvent);
  }

  /**
   * @param {ShippingOptionChangeEvent} originalEvent
   * @private
   */
  @bound onShippingoptionchange(originalEvent) {
    this.fire('shippingoptionchange', originalEvent);
  }

  /**
   * Parses an element's dataset number props from string to number
   * @param {String} selector
   * @return {Object}
   * @private
   */
  parseDatasets(selector) {
    const elements = [...this.querySelectorAll(selector)];
    return !elements.length ? undefined : elements
      .map(parseDataset);
  }
}

/**
 * @typedef {Object} ShippingAddressChangeEvent
 * @param {(options: stripe.paymentRequest.UpdateDetails) => void} updateWith
 * @param {stripe.paymentRequest.ShippingAddress} shippingAddress
 */

/**
 * @typedef {Object} ShippingOptionChangeEvent
 * @param {(options: stripe.paymentRequest.UpdateDetails) => void} updateWith
 * @param {stripe.paymentRequest.ShippingOption} shippingOption
 */

/** @typedef {stripe.Error|stripe.PaymentIntentResponse|stripe.Token|stripe.Source} PaymentResponseOrError */
/** @typedef {(x: PaymentResponseOrError) => PaymentResponseOrError} PaymentResponseHandler */

/** @typedef {stripe.paymentRequest.StripeSourcePaymentResponse|stripe.paymentRequest.StripeTokenPaymentResponse|stripe.paymentRequest.StripePaymentMethodPaymentResponse} PaymentResponse */
