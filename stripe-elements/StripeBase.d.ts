import type { TemplateResult, PropertyValues } from 'lit';
import type * as Stripe from '@stripe/stripe-js';
import { LitElement } from 'lit';
import { StripeElementLocale } from '@stripe/stripe-js';
export declare const enum SlotName {
    'stripe-elements' = "stripe-elements-slot",
    'stripe-payment-request' = "stripe-payment-request-slot"
}
export declare type PaymentRepresentation = 'payment-method' | 'source' | 'token';
export declare type StripePaymentResponse = Stripe.PaymentIntentResult | Stripe.PaymentMethodResult | Stripe.SetupIntentResult | Stripe.TokenResult | Stripe.SourceResult;
declare type StripeElementType = Stripe.StripeCardElement | Stripe.StripePaymentRequestButtonElement;
declare type AmbiguousError = Error | Stripe.StripeError | StripeElementsError;
declare global {
    interface Node {
        getRootNode(options?: GetRootNodeOptions): Node | ShadowRoot;
    }
}
declare class StripeElementsError extends Error {
    originalMessage: string;
    constructor(tag: 'stripe-elements' | 'stripe-payment-request', message: string);
}
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
export declare class StripeBase extends LitElement {
    static is: 'stripe-elements' | 'stripe-payment-request';
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
    action?: string;
    /**
     * The `client_secret` part of a Stripe `PaymentIntent`
     */
    clientSecret?: string;
    /**
     * Type of payment representation to generate.
     */
    generate: PaymentRepresentation;
    /**
     * Stripe Publishable Key. EG. `pk_test_XXXXXXXXXXXXXXXXXXXXXXXX`
     */
    publishableKey?: string;
    /** Whether to display the error message */
    showError: boolean;
    /** Stripe account to use (connect) */
    stripeAccount?: string;
    /** Stripe locale to use */
    locale: StripeElementLocale;
    /**
     * Stripe PaymentMethod
     */
    readonly paymentMethod: Stripe.PaymentMethod | null;
    /**
     * Stripe Source
     */
    readonly source: Stripe.Source | null;
    /**
     * Stripe Token
     */
    readonly token: Stripe.Token | null;
    /**
     * Stripe element instance
     */
    readonly element: StripeElementType | null;
    /**
     * Stripe Elements instance
     */
    readonly elements: Stripe.StripeElements | null;
    /**
     * Stripe or validation error
     */
    readonly error: AmbiguousError | null;
    /**
     * If the element is focused.
     */
    readonly focused: boolean;
    /**
     * Whether the stripe element is ready to receive focus.
     */
    readonly ready: boolean;
    /**
     * Stripe instance
     */
    readonly stripe: Stripe.Stripe | null;
    /**
     * Stripe appearance theme
     * @see https://stripe.com/docs/stripe-js/appearance-api#theme
     */
    theme: 'stripe' | 'night' | 'flat' | 'none';
    borderRadius?: string;
    colorBackground?: string;
    colorDanger?: string;
    colorPrimary?: string;
    colorText?: string;
    fontFamily?: string;
    spacingUnit?: string;
    private precomputedStyle;
    private breadcrumb;
    get stripeMountId(): string;
    get stripeMount(): Element | null;
    /** @inheritdoc */
    render(): TemplateResult;
    /** @inheritdoc */
    protected updated(changed: PropertyValues): void;
    /** @inheritdoc */
    disconnectedCallback(): Promise<void>;
    /**
     * Resets and clears the stripe element.
     */
    reset(): void;
    /** Blurs the element. */
    blur(): void;
    /** Focuses the element. */
    focus(): void;
    /**
     * Creates a new StripeElementsError
     */
    protected createError(message: string): StripeElementsError;
    /**
     * Clears the Payment Representation and fires an error event
     */
    private errorChanged;
    /**
     * Fires an event.
     * @param type      event type
     * @param detail    detail value
     * @param [opts={}]
     */
    protected fire(type: string, detail?: unknown, opts?: EventInit): void;
    /**
     * Fires an Error Event
     */
    private fireError;
    /**
     * Gets a CSS Custom Property value.
     * @param   propertyName    CSS Custom Property
     */
    protected getCSSCustomPropertyValue(propertyName: string): string;
    /**
     * Sets the token or error from the response.
     * @param   response       Stripe Response
     * @return
     */
    protected handleResponse(response: StripePaymentResponse): Promise<StripePaymentResponse>;
    /** @abstract */
    protected initElement?(): void | Promise<void>;
    /**
     * Reinitializes Stripe and mounts the element.
     */
    private init;
    /**
     * Adds `ready`, `focus`, and `blur` listeners to the Stripe Element
     */
    private initElementListeners;
    /**
     * Initializes Stripe and elements.
     */
    private initStripe;
    /**
     * Mounts the Stripe Element
     */
    private mount;
    /**
     * Unmounts and nullifies the card.
     */
    private unmount;
    /**
     * Updates element state when Stripe Element is blurred.
     */
    private onBlur;
    private onFocus;
    /**
     * Sets the `ready` property when the stripe element is ready to receive focus.
     */
    private onReady;
    /**
     * POSTs the payment info represenation to the endpoint at `/action`
     */
    private postRepresentation;
    /**
     * Updates the state and fires events when the token, source, or payment method is updated.
     */
    private representationChanged;
    /**
     * Resets the Payment Representations
     */
    private resetRepresentations;
}
export {};
