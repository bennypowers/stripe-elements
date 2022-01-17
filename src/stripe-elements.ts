import type * as Stripe from '@stripe/stripe-js';
import { property, customElement } from 'lit/decorators.js';

import { bound } from './lib/bound.js';

import { StripeBase, StripePaymentResponse } from './StripeBase.js';
import { dash } from './lib/strings.js';
import { stripeMethod } from './lib/stripe-method-decorator.js';
import { readonly } from './lib/read-only.js';
import { notify } from './lib/notify.js';

import sharedStyles from './shared.css';
import style from './stripe-elements.css';

interface StripeStyleInit {
   base?: Stripe.StripeElementStyle;
   complete?: Stripe.StripeElementStyle;
   empty?: Stripe.StripeElementStyle;
   invalid?: Stripe.StripeElementStyle;
}

const ALLOWED_STYLES = [
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

const SUB_STYLES = [
  ':hover',
  ':focus',
  '::placeholder',
  '::selection',
  ':-webkit-autofill',
  // available for all Elements except the paymentRequestButton Element.
  ':disabled',
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

  declare element: Stripe.StripeCardElement;

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
  iconStyle: Stripe.StripeCardElementOptions['iconStyle'] = 'default';

  /**
   * Prefilled values for form.
   * @example { postalCode: '90210' }
   */
  @property({ type: Object })
  value: Stripe.StripeCardElementOptions['value'] = {};

  /* READ ONLY PROPERTIES */

  /**
   * The card brand detected by Stripe
   */
  @notify
  @readonly
  @property({ type: String })
  readonly brand: Stripe.StripeCardElementChangeEvent['brand'] = null;

  /**
   * Whether the form is complete.
   */
  @notify
  @readonly
  @property({ type: Boolean, reflect: true })
  readonly complete: boolean = false;

  /**
   * If the form is empty.
   */
  @notify
  @readonly
  @property({ type: Boolean, reflect: true })
  readonly empty: boolean = true;

  /**
   * Whether the form is invalid.
   */
  @notify
  @readonly
  @property({ type: Boolean, reflect: true })
  readonly invalid: boolean = false;

  /* PUBLIC API */

  /**
   * Submit payment information to generate a paymentMethod
   */
  @stripeMethod public async createPaymentMethod(
    paymentMethodData: Stripe.CreatePaymentMethodData = this.getPaymentMethodData()
  ): Promise<Stripe.PaymentMethodResult> {
    return this.stripe.createPaymentMethod(paymentMethodData);
  }

  /**
   * Submit payment information to generate a source
   */
  @stripeMethod public async createSource(
    sourceData: Stripe.CreateSourceData = this.sourceData
  ): Promise<Stripe.SourceResult> {
    return this.stripe.createSource(this.element, sourceData);
  }

  /**
   * Submit payment information to generate a token
   */
  @stripeMethod public async createToken(
    tokenData = this.tokenData
  ): Promise<Stripe.TokenResult> {
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
        readonly.set<StripeElements>(this, { error });
        await this.updateComplete;
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
      readonly.set<StripeElements>(this, { error: this.createError('Your card number is empty.') });
    return isValid;
  }

  public updateStyle() {
    this.element?.update({
      style: this.getStripeElementsStyles(),
    });
  }

  /* PRIVATE METHODS */

  /**
   * Generates PaymentMethodData from the element.
   */
  private getPaymentMethodData(): Stripe.CreatePaymentMethodData {
    const type = 'card';
    const { billingDetails, paymentMethodData } = this;
    return ({
      billing_details: billingDetails,
      ...paymentMethodData,
      type,
      card: this.element as Stripe.StripeCardElement,
    });
  }

  /**
   * Returns a Stripe-friendly style object computed from CSS custom properties
   */
  private getStripeElementsStyles(): Stripe.StripeElementStyle {
    const getStyle = (prop: string): string => this.getCSSCustomPropertyValue(prop) || undefined;

    const STATES = ['base', 'complete', 'empty', 'invalid'];
    const subReducer = (state: string) => (acc: StripeStyleInit, sub: string) => {
      if (state.includes('-')) return acc;
      const subProp = sub.split(':').pop();
      return {
        ...acc,
        [sub]: ALLOWED_STYLES.reduce(styleReducer(`${state}-${subProp}`), {}),
      };
    };

    const styleReducer = (state: string) => (init: StripeStyleInit, p: string): StripeStyleInit => {
      const prop = `--stripe-elements-${state}-${dash(p)}`;
      return ({
        ...init,
        [p]: getStyle(prop),
        ...SUB_STYLES.reduce(subReducer(state), {}),
      });
    };

    return STATES.reduce((acc, state) => ({
      ...acc,
      [state]: ALLOWED_STYLES.reduce(styleReducer(state), {}),
    }), {});
  }

  protected async initElement(): Promise<void> {
    if (!this.stripe) return;
    const { hidePostalCode, hideIcon, iconStyle, value } = this;
    const style = this.getStripeElementsStyles();

    await this.updateComplete;

    const element = this.createElement({
      hideIcon,
      hidePostalCode,
      iconStyle,
      style,
      value,
    });

    element.on('change', this.onChange);
    readonly.set<StripeElements>(this, { element });
    await this.updateComplete;
  }

  private createElement(options: Stripe.StripeCardElementOptions) {
    const element = this.elements.create('card', options);
    return element;
  }

  /**
   * Updates the element's state.
   */
  @bound private async onChange(event: Stripe.StripeCardElementChangeEvent): Promise<void> {
    const { brand, complete, empty, error = null } = event;
    const invalid = !(error || (!empty && !complete));
    readonly.set<StripeElements>(this, { brand, complete, empty, error, invalid });
    await this.updateComplete;
    this.fire('change', event);
  }
}
