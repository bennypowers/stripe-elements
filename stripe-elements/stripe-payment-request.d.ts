import type * as Stripe from '@stripe/stripe-js';
import type { CountryCode } from './lib/countries.js';
import type { PropertyValues } from 'lit';
import { StripeBase } from './StripeBase.js';
interface StripeDisplayItem extends HTMLElement {
    dataset: {
        amount: string;
        label: string;
        pending?: string;
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
declare type StripePaymentRequestButtonType = Stripe.StripePaymentRequestButtonElementOptions['style']['paymentRequestButton']['type'];
declare type StripePaymentRequestButtonTheme = Stripe.StripePaymentRequestButtonElementOptions['style']['paymentRequestButton']['theme'];
declare type PaymentResponseOrError = Stripe.StripeError | Stripe.PaymentIntentResult | Stripe.TokenResult | Stripe.SourceResult;
export declare type PaymentResponseHandler = (x: PaymentResponseOrError) => PaymentResponseOrError;
export declare const enum Events {
    success = "success",
    fail = "fail",
    cancel = "cancel"
}
export declare function isStripeDisplayItem(el: Element): el is StripeDisplayItem;
export declare function isStripeShippingOption(el: Element): el is StripeShippingOption;
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
export declare class StripePaymentRequest extends StripeBase {
    #private;
    static readonly is = "stripe-payment-request";
    static readonly styles: import("lit").CSSResult[];
    /**
     * The amount in the currency's subunit (e.g. cents, yen, etc.)
     */
    amount: number;
    /**
     * Whether or not the device can make the payment request.
     * @readonly
     */
    readonly canMakePayment: Stripe.CanMakePaymentResult;
    /**
     * The two-letter country code of your Stripe account
     * @example CA
     */
    country: CountryCode;
    /**
     * Three character currency code
     * @example usd
     */
    currency: Stripe.PaymentRequestOptions['currency'];
    /**
     * An array of PaymentRequestItem objects. These objects are shown as line items in the browser’s payment interface. Note that the sum of the line item amounts does not need to add up to the total amount above.
     */
    get displayItems(): Stripe.PaymentRequestItem[];
    set displayItems(value: Stripe.PaymentRequestItem[]);
    /**
     * A name that the browser shows the customer in the payment interface.
     */
    label: string;
    /**
     * Stripe PaymentIntent
     */
    readonly paymentIntent: Stripe.PaymentIntent;
    /**
     * Stripe PaymentRequest
     */
    readonly paymentRequest: Stripe.PaymentRequest;
    /**
     * If you might change the payment amount later (for example, after you have calcluated shipping costs), set this to true. Note that browsers treat this as a hint for how to display things, and not necessarily as something that will prevent submission.
     */
    pending: boolean;
    /**
     * See the requestPayerName option.
     */
    requestPayerEmail: boolean;
    /**
     * By default, the browser‘s payment interface only asks the customer for actual payment information. A customer name can be collected by setting this option to true. This collected name will appears in the PaymentResponse object.
     *
     * We highly recommend you collect at least one of name, email, or phone as this also results in collection of billing address for Apple Pay. The billing address can be used to perform address verification and block fraudulent payments. For all other payment methods, the billing address is automatically collected when available.
     */
    requestPayerName: boolean;
    /**
     * See the requestPayerName option.
     */
    requestPayerPhone: boolean;
    /**
     * Collect shipping address by setting this option to true. The address appears in the PaymentResponse.
     * You must also supply a valid [ShippingOptions] to the shippingOptions property. This can be up front at the time stripe.paymentRequest is called, or in response to a shippingaddresschange event using the updateWith callback.
     */
    requestShipping: boolean;
    /**
     * An array of PaymentRequestShippingOption objects. The first shipping option listed appears in the browser payment interface as the default option.
     */
    get shippingOptions(): Stripe.PaymentRequestShippingOption[];
    set shippingOptions(value: Stripe.PaymentRequestShippingOption[]);
    buttonType: StripePaymentRequestButtonType;
    buttonTheme: StripePaymentRequestButtonTheme;
    reset(): void;
    /** @inheritdoc */
    protected updated(changed: PropertyValues): void;
    /**
     * Creates a PaymentRequestOptions object.
     */
    private getStripePaymentRequestOptions;
    /**
     * Initializes the PaymentRequest Object.
     */
    protected initElement(): Promise<void>;
    /**
     * Initialized the `PaymentRequest` object.
     */
    private initPaymentRequest;
    /**
     * Creates Stripe Payment Request Element.
     */
    private initPaymentRequestButton;
    /**
     * Attaches listeners to the `PaymentRequest` object.
     */
    private initPaymentRequestListeners;
    /**
     * Updates the PaymentRequests's values
     */
    private updatePaymentRequest;
    /**
     * Handle a `cancel` event
     */
    private onCancel;
    /**
     * Completes the PaymentRequest.
     */
    private complete;
    /**
     * Handle a paymentResponse from Stripe
     */
    private onPaymentResponse;
    /**
     * When a PaymentIntent client secret is set, confirm the payment
     */
    private confirmPaymentIntent;
    /**
     * Stripe confirmCardPayment method
     */
    private confirmCardPayment;
    private onShippingaddresschange;
    private onShippingoptionchange;
    /**
     * Parses an element's dataset number props from string to number
     */
    private parseDatasets;
}
export {};
