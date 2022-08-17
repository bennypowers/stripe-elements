import type * as Stripe from '@stripe/stripe-js';
import { StripeBase, StripePaymentResponse } from './StripeBase.js';
/**
 * [Stripe.js v3 Card Elements](https://stripe.com/docs/elements), but it's a Web Component!
 * Supports Shadow DOM.
 *
 * 👨‍🎨 [Live Demo](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-elements--enter-a-stripe-publishable-key) 👀
 *
 * ### 🧙‍♂️ Usage
 * If you prebuilt with Snowpack, load the module from your `web_modules` directory
 *
 * ```html
 * <script type="module" src="/web_modules/@power-elements/stripe-elements/stripe-elements.js"></script>
 * ```
 *
 * Alternatively, load the module from the unpkg CDN
 * ```html
 * <script type="module" src="https://unpkg.com/@power-elements/stripe-elements/stripe-elements.js?module"></script>
 * ```
 *
 * Then you can add the element to your page.
 *
 * ```html
 * <stripe-elements id="stripe"
 *     action="/payment"
 *     publishable-key="pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"
 * ></stripe-elements>
 * ```
 *
 * See the demos for more comprehensive examples.
 *   - Using `<stripe-elements>` with [plain HTML and JavaScript](https://bennypowers.dev/stripe-elements/?path=/docs/framework-examples-html--stripe-elements).
 *   - Using `<stripe-elements>` in a [LitElement](https://bennypowers.dev/stripe-elements/?path=/docs/framework-examples-litelement--stripe-elements).
 *   - Using `<stripe-elements>` in a [Vue Component](https://bennypowers.dev/stripe-elements/?path=/docs/framework-examples-vue--stripe-elements).
 *   - Using `<stripe-elements>` in an [Angular component](https://bennypowers.dev/stripe-elements/?path=/docs/framework-examples-angular--stripe-elements).
 *   - Using `<stripe-elements>` in a [React component](https://bennypowers.dev/stripe-elements/?path=/docs/framework-examples-react--stripe-elements).
 *   - Using `<stripe-elements>` in a [Preact component](https://bennypowers.dev/stripe-elements/?path=/docs/framework-examples-preact--stripe-elements).
 *
 * ## Styling
 *
 * Stripe v3's 'Stripe Elements' are not custom elements, but rather forms
 * hosted by stripe and injected into your page via an iFrame. When we refer to the
 * 'Stripe Element' in this document, we are referring to the hosted Stripe form,
 * not the `<stripe-element>` custom element. But when I mention the 'element', I mean the custom element.
 *
 * When you apply CSS to the custom properties available, they're parsed and sent to Stripe, who should apply them to the Stripe Element they return in the iFrame.
 *
 * - `base` styles are inherited by all other variants.
 * - `complete` styles are applied when the Stripe Element has valid input.
 * - `empty` styles are applied when the Stripe Element has no user input.
 * - `invalid` styles are applied when the Stripe Element has invalid input.
 *
 * There are 11 properties for each state that you can set which will be read into the Stripe Element iFrame:
 *
 * - `color`
 * - `font-family`
 * - `font-size`
 * - `font-smoothing`
 * - `font-variant`
 * - `icon-color`
 * - `line-height`
 * - `letter-spacing`
 * - `text-decoration`
 * - `text-shadow`
 * - `text-transform`
 *
 * @cssprop [--stripe-elements-border-radius=`4px`] - border radius of the element container
 * @cssprop [--stripe-elements-border=`1px solid transparent`] - border property of the element container
 * @cssprop [--stripe-elements-box-shadow=`0 1px 3px 0 #e6ebf1`] - box shadow for the element container
 * @cssprop [--stripe-elements-transition=`box-shadow 150ms ease`] - transition property for the element container
 *
 * @cssprop [--stripe-elements-base-color] - `color` property for the element in its base state
 * @cssprop [--stripe-elements-base-font-family] - `font-family` property for the element in its base state
 * @cssprop [--stripe-elements-base-font-size] - `font-size` property for the element in its base state
 * @cssprop [--stripe-elements-base-font-smoothing] - `font-smoothing` property for the element in its base state
 * @cssprop [--stripe-elements-base-font-variant] - `font-variant` property for the element in its base state
 * @cssprop [--stripe-elements-base-icon-color] - `icon-color` property for the element in its base state
 * @cssprop [--stripe-elements-base-line-height] - `line-height` property for the element in its base state
 * @cssprop [--stripe-elements-base-letter-spacing] - `letter-spacing` property for the element in its base state
 * @cssprop [--stripe-elements-base-text-decoration] - `text-decoration` property for the element in its base state
 * @cssprop [--stripe-elements-base-text-shadow] - `text-shadow` property for the element in its base state
 * @cssprop [--stripe-elements-base-text-transform] - `text-transform` property for the element in its base state
 *
 * @cssprop [--stripe-elements-complete-color] - `color` property for the element in its complete state
 * @cssprop [--stripe-elements-complete-font-family] - `font-family` property for the element in its complete state
 * @cssprop [--stripe-elements-complete-font-size] - `font-size` property for the element in its complete state
 * @cssprop [--stripe-elements-complete-font-smoothing] - `font-smoothing` property for the element in its complete state
 * @cssprop [--stripe-elements-complete-font-variant] - `font-variant` property for the element in its complete state
 * @cssprop [--stripe-elements-complete-icon-color] - `icon-color` property for the element in its complete state
 * @cssprop [--stripe-elements-complete-line-height] - `line-height` property for the element in its complete state
 * @cssprop [--stripe-elements-complete-letter-spacing] - `letter-spacing` property for the element in its complete state
 * @cssprop [--stripe-elements-complete-text-decoration] - `text-decoration` property for the element in its complete state
 * @cssprop [--stripe-elements-complete-text-shadow] - `text-shadow` property for the element in its complete state
 * @cssprop [--stripe-elements-complete-text-transform] - `text-transform` property for the element in its complete state
 *
 * @cssprop [--stripe-elements-empty-color] - `color` property for the element in its empty state
 * @cssprop [--stripe-elements-empty-font-family] - `font-family` property for the element in its empty state
 * @cssprop [--stripe-elements-empty-font-size] - `font-size` property for the element in its empty state
 * @cssprop [--stripe-elements-empty-font-smoothing] - `font-smoothing` property for the element in its empty state
 * @cssprop [--stripe-elements-empty-font-variant] - `font-variant` property for the element in its empty state
 * @cssprop [--stripe-elements-empty-icon-color] - `icon-color` property for the element in its empty state
 * @cssprop [--stripe-elements-empty-line-height] - `line-height` property for the element in its empty state
 * @cssprop [--stripe-elements-empty-letter-spacing] - `letter-spacing` property for the element in its empty state
 * @cssprop [--stripe-elements-empty-text-decoration] - `text-decoration` property for the element in its empty state
 * @cssprop [--stripe-elements-empty-text-shadow] - `text-shadow` property for the element in its empty state
 * @cssprop [--stripe-elements-empty-text-transform] - `text-transform` property for the element in its empty state
 *
 * @cssprop [--stripe-elements-invalid-color] - `color` property for the element in its invalid state
 * @cssprop [--stripe-elements-invalid-font-family] - `font-family` property for the element in its invalid state
 * @cssprop [--stripe-elements-invalid-font-size] - `font-size` property for the element in its invalid state
 * @cssprop [--stripe-elements-invalid-font-smoothing] - `font-smoothing` property for the element in its invalid state
 * @cssprop [--stripe-elements-invalid-font-variant] - `font-variant` property for the element in its invalid state
 * @cssprop [--stripe-elements-invalid-icon-color] - `icon-color` property for the element in its invalid state
 * @cssprop [--stripe-elements-invalid-line-height] - `line-height` property for the element in its invalid state
 * @cssprop [--stripe-elements-invalid-letter-spacing] - `letter-spacing` property for the element in its invalid state
 * @cssprop [--stripe-elements-invalid-text-decoration] - `text-decoration` property for the element in its invalid state
 * @cssprop [--stripe-elements-invalid-text-shadow] - `text-shadow` property for the element in its invalid state
 * @cssprop [--stripe-elements-invalid-text-transform] - `text-transform` property for the element in its invalid state
 *
 * @element stripe-elements
 * @extends StripeBase
 *
 * @fires 'change' - Stripe Element change event
 */
export declare class StripeElements extends StripeBase {
    static readonly is = "stripe-elements";
    static readonly elementType = "card";
    static readonly styles: import("lit").CSSResult[];
    element: Stripe.StripeCardElement;
    /**
     * Whether to hide icons in the Stripe form.
     */
    hideIcon: boolean;
    /**
     * Whether or not to hide the postal code field.
     * Useful when you gather shipping info elsewhere.
     */
    hidePostalCode: boolean;
    /**
     * Stripe icon style.
     */
    iconStyle: Stripe.StripeCardElementOptions['iconStyle'];
    /**
     * Prefilled values for form.
     * @example { postalCode: '90210' }
     */
    value: Stripe.StripeCardElementOptions['value'];
    /**
     * The card brand detected by Stripe
     */
    readonly brand: Stripe.StripeCardElementChangeEvent['brand'];
    /**
     * Whether the form is complete.
     */
    readonly complete: boolean;
    /**
     * If the form is empty.
     */
    readonly empty: boolean;
    /**
     * Whether the form is invalid.
     */
    readonly invalid: boolean;
    /**
     * Submit payment information to generate a paymentMethod
     */
    createPaymentMethod(paymentMethodData?: Stripe.CreatePaymentMethodData): Promise<Stripe.PaymentMethodResult>;
    /**
     * Submit payment information to generate a source
     */
    createSource(sourceData?: Stripe.CreateSourceData): Promise<Stripe.SourceResult>;
    /**
     * Submit payment information to generate a token
     */
    createToken(tokenData?: Stripe.CreateTokenCardData): Promise<Stripe.TokenResult>;
    /**
     * Checks for potential validity. A potentially valid form is one that is not empty, not complete and has no error. A validated form also counts as potentially valid.
     */
    isPotentiallyValid(): boolean;
    /**
     * Resets the Stripe card.
     */
    reset(): void;
    /**
     * Generates a payment representation of the type specified by `generate`.
     */
    submit(): Promise<StripePaymentResponse>;
    /**
     * Checks if the Stripe form is valid.
     */
    validate(): boolean;
    updateStyle(): void;
    /**
     * Generates PaymentMethodData from the element.
     */
    private getPaymentMethodData;
    /**
     * Returns a Stripe-friendly style object computed from CSS custom properties
     */
    private getStripeElementsStyles;
    protected initElement(): Promise<void>;
    private createElement;
    /**
     * Updates the element's state.
     */
    private onChange;
}
