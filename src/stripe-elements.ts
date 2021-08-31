import type { PropertyValues } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { bound } from './lib/bound.js';

import { StripeBase, StripePaymentResponse, SlotName } from './StripeBase.js';
import { dash } from './lib/strings.js';
import { stripeMethod } from './lib/stripe-method-decorator.js';
import sharedStyles from './shared.css';
import style from './stripe-elements.css';

interface StripeStyleInit {
   base?: stripe.elements.Style;
   complete?: stripe.elements.Style;
   empty?: stripe.elements.Style;
   invalid?: stripe.elements.Style;
}

const allowedStyles = [
  'color',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontSmoothing',
  'fontVariant',
  'iconColor',
  'lineHeight',
  'letterSpacing',
  'textDecoration',
  'textShadow',
  'textTransform',
];

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
@customElement('stripe-elements')
export class StripeElements extends StripeBase {
  static readonly is = 'stripe-elements';

  static readonly elementType = 'card';

  static readonly styles = [
    sharedStyles,
    style,
  ];

  // @ts-expect-error: hopefully ts will allow this soon
  protected get slotName(): SlotName { return SlotName['stripe-elements']; }

  /* PUBLIC FIELDS */

  /**
   * Whether to hide icons in the Stripe form.
   */
  @property({ type: Boolean, attribute: 'hide-icon' })
  hideIcon = false;

  /**
   * Whether or not to hide the postal code field.
   * Useful when you gather shipping info elsewhere.
   */
  @property({ type: Boolean, attribute: 'hide-postal-code' })
  hidePostalCode = false;

  /**
   * Stripe icon style.
   */
  @property({ type: String, attribute: 'icon-style' })
  iconStyle: stripe.elements.ElementsOptions['iconStyle'] = 'default';

  /**
   * Prefilled values for form.
   * @example { postalCode: '90210' }
   */
  @property({ type: Object })
  value: stripe.elements.ElementsOptions['value'] = {};

  /* READ ONLY PROPERTIES */

  /**
   * The card brand detected by Stripe
   */
  @property({ type: String, notify: true, readOnly: true })
  readonly brand: stripe.brandType = null;

  /**
   * Whether the form is complete.
   */
  @property({ type: Boolean, reflect: true, notify: true, readOnly: true })
  readonly complete = false;

  /**
   * If the form is empty.
   */
  @property({ type: Boolean, reflect: true, notify: true, readOnly: true })
  readonly empty = true;

  /**
   * Whether the form is invalid.
   */
  @property({ type: Boolean, reflect: true, notify: true, readOnly: true })
  readonly invalid = false;

  // DEPRECATED

  /**
   * The Stripe card object.
   * **DEPRECATED**. Will be removed in a future version. use `element` instead
   * @deprecated
   */
  @property({ type: Object, notify: true, readOnly: true })
  readonly card: stripe.elements.Element = null;

  /**
   * Whether the form is empty.
   * **DEPRECATED**. Will be removed in a future version. use `empty` instead
   * @deprecated
   */
  @property({ type: Boolean, attribute: 'is-empty', reflect: true, notify: true, readOnly: true })
  isEmpty = true;

  /**
   * Whether the form is complete.
   * **DEPRECATED**. Will be removed in a future version. use `complete` instead
   * @deprecated
   */
  @property({
    type: Boolean,
    attribute: 'is-complete',
    reflect: true,
    notify: true,
    readOnly: true,
  })
  isComplete = false;

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    // DEPRECATED
    if (changed.has('element') && !this.element) this.setReadOnlyProperties({ card: null });
  }

  /* PUBLIC API */

  /**
   * Submit payment information to generate a paymentMethod
   */
  @stripeMethod public async createPaymentMethod(
    paymentMethodData: stripe.PaymentMethodData = this.getPaymentMethodData()
  ): Promise<stripe.PaymentMethodResponse> {
    return this.stripe.createPaymentMethod(paymentMethodData);
  }

  /**
   * Submit payment information to generate a source
   */
  @stripeMethod public async createSource(
    sourceData: stripe.SourceOptions = this.sourceData
  ): Promise<stripe.SourceResponse> {
    return this.stripe.createSource(this.element, sourceData);
  }

  /**
   * Submit payment information to generate a token
   */
  @stripeMethod public async createToken(
    tokenData: stripe.TokenOptions = this.tokenData
  ): Promise<stripe.TokenResponse> {
    return this.stripe.createToken(this.element, tokenData);
  }

  /**
   * Checks for potential validity. A potentially valid form is one that is not empty, not complete and has no error. A validated form also counts as potentially valid.
   */
  public isPotentiallyValid(): boolean {
    return (!this.complete && !this.empty && !this.error) || this.validate();
  }

  /**
   * Resets the Stripe card.
   */
  public reset(): void {
    super.reset();
    /* istanbul ignore next */
    this.element?.clear();
  }

  /**
   * Generates a payment representation of the type specified by `generate`.
   */
  public async submit(): Promise<StripePaymentResponse> {
    switch (this.generate) {
      case 'payment-method': return this.createPaymentMethod();
      case 'source': return this.createSource();
      case 'token': return this.createToken();
      default: {
        const error = this.createError(`cannot generate ${this.generate}`);
        await this.setReadOnlyProperties({ error });
        throw error;
      }
    }
  }

  /**
   * Checks if the Stripe form is valid.
   */
  public validate(): boolean {
    const { complete, empty, error } = this;
    const isValid = !error && complete && !empty;
    if (empty && !error)
      this.setReadOnlyProperties({ error: this.createError('Your card number is empty.') });
    return isValid;
  }

  /* PRIVATE METHODS */

  /**
   * Generates PaymentMethodData from the element.
   */
  private getPaymentMethodData(): stripe.PaymentMethodData {
    const type = 'card';
    const { billingDetails, element: card, paymentMethodData } = this;
    return ({
      billing_details: billingDetails, // eslint-disable-line @typescript-eslint/camelcase
      ...paymentMethodData,
      type,
      card,
    });
  }

  /**
   * Returns a Stripe-friendly style object computed from CSS custom properties
   */
  private getStripeElementsStyles(): StripeStyleInit {
    const computedStyle = window.ShadyCSS ? undefined : getComputedStyle(this);
    const getStyle = (prop: string): string =>
      this.getCSSCustomPropertyValue(prop, computedStyle) || undefined;
    const styleReducer = ({
      base = {},
      complete = {},
      empty = {},
      invalid = {},
    }: StripeStyleInit, camelCase: string): StripeStyleInit => ({
      base: { ...base, [camelCase]: getStyle(`--stripe-elements-base-${dash(camelCase)}`) },
      complete: { ...complete, [camelCase]: getStyle(`--stripe-elements-complete-${dash(camelCase)}`) },
      empty: { ...empty, [camelCase]: getStyle(`--stripe-elements-empty-${dash(camelCase)}`) },
      invalid: { ...invalid, [camelCase]: getStyle(`--stripe-elements-invalid-${dash(camelCase)}`) },
    });
    return allowedStyles.reduce(styleReducer, {});
  }

  protected async initElement(): Promise<void> {
    if (!this.stripe) return;
    const { hidePostalCode, hideIcon, iconStyle, value } = this;
    const style = this.getStripeElementsStyles();
    const options: stripe.elements.ElementsOptions = {
      hideIcon,
      hidePostalCode,
      iconStyle,
      style,
      value,
    };

    const element = this.elements.create('card', options);

    element.addEventListener('change', this.onChange);

    await this.setReadOnlyProperties({
      element,
      // DEPRECATED
      card: element,
    });
  }

  /**
   * Updates the element's state.
   */
  @bound private async onChange(event: stripe.elements.ElementChangeResponse): Promise<void> {
    const { brand, complete, empty, error = null } = event;
    const invalid = error || (!empty && !complete);
    await this.setReadOnlyProperties({
      brand,
      complete,
      empty,
      error,
      invalid,

      // DEPRECATED
      isComplete: complete,
      isEmpty: empty,
    });
    this.fire('change', event);
    // DEPRECATED
    this.fire('stripe-change', event);
  }
}
