import { LitElement, html, css } from 'lit-element';
import { render } from 'lit-html';

// <link rel="import" href="./stripe-elements-custom-styles.html">

const bubbles = true;
const composed = true;

const stripeElementsCustomCssProperties = html`
<style id="stripe-elements-custom-css-properties">
.StripeElement {
  background-color: white;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid transparent;
  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
  min-width: var(--stripe-elements-width, 300px);
  padding: var(--stripe-elements-element-padding, 14px);
  background: var(--stripe-elements-element-background, initial);
}

.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
  border-color: #fa755a;
}

.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}
</style>
`;

const style = css`
:host {
  display: block;
  flex: 1;
  min-width: var(--stripe-elements-width, 300px);
  min-height: var(--stripe-elements-height, 50px);
}
`;

const stripeCardTemplate = ({ action, id, token }) => html`
<div slot="stripe-card">
  <form action="${action}" method="post">
    <div id="${id}" aria-label="Credit or Debit Card"></div>
    <input type="hidden" name="stripeToken" value="${token}">
  </form>
</div>
`;

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

function appendTemplate(template, target) {
  const tmp = document.createElement('div');
  render(template, tmp);
  const appendedDom = tmp.firstElementChild
  target.appendChild(appendedDom);
  tmp.remove();
  return appendedDom;
}

/**
 * Generates a random mount point (UUID v4) for Stripe Elements. This will allow multiple
 * Elements forms to be embedded on a single page.
 * @return {String} mount element id
 */
function generateRandomMountElementId() {
  return `stripe-elements-mount-point-${([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )}`;
}

/**
 * `stripe-elements`
 * Polymer wrapper for Stripe.js v3 Elements
 *
 * ## Usage
 *
 * ```html
 *   <paper-input label="Stripe Publishable Key" value="{{key}}"></paper-input>
 *   <stripe-elements
 *       publishable-key="[[key]]"
 *       token="{{token}}"
 *   ></stripe-elements>
 *   <show-json hide-copy-button json="[[token]]"></show-json>
 * ```
 *
 * ## Styling
 *
 * A word about nomenclature before we list custom properties and mixins.
 * Stripe v3 Introduces 'Stripe Elements'. These are not custom elements,
 * but rather forms hosted by stripe and injected into your page via an iFrame.
 * When we refer to the 'Stripe Element' in this document, we are referring
 * to the hosted Stripe form, not the `<stripe-element>` custom element.
 *
 * The following custom properties and mixins are available for styling the
 * `<stripe-elements>` component:
 *
 * | Custom property | Description | Default |
 * | --- | --- | --- |
 * | `--stripe-elements-width` | Min-width of the stripe-element | 300px |
 * | `--stripe-elements-height` | Min-width of the stripe-element | 50px |
 * | `--stripe-elements-element` | Mixin applied to the Stripe Element | {} |
 * | `--stripe-elements-element-focus` | Mixin applied to the Stripe Element in its focused state. | {} |
 * | `--stripe-elements-element-invalid` | Mixin applied to the Stripe Element in its invalid state | {} |
 * | `--stripe-elements-element-webkit-autofill` | Mixin applied to the Stripe Element's webkit autofill. | {} |
 *
 * When you apply CSS to the custom properties below, they're parsed and sent
 * to Stripe, who should apply them to the Stripe Element they return in the
 * iFrame.
 * `base` styles are inherited by all other variants.
 * `complete` styles are applied when the Stripe Element has valid input.
 * `empty` styles are applied when the Stripe Element has no user input.
 * `invalid` styles are applied when the Stripe Element has invalid input.
 *
 * | Custom property |
 * | --- |
 * | `--stripe-elements-base-color` |
 * | `--stripe-elements-base-font-family` |
 * | `--stripe-elements-base-font-size` |
 * | `--stripe-elements-base-font-smoothing` |
 * | `--stripe-elements-base-font-variant` |
 * | `--stripe-elements-base-icon-color` |
 * | `--stripe-elements-base-line-height` |
 * | `--stripe-elements-base-letter-spacing` |
 * | `--stripe-elements-base-text-decoration` |
 * | `--stripe-elements-base-text-shadow` |
 * | `--stripe-elements-base-text-transform` |
 * | `--stripe-elements-complete-color` |
 * | `--stripe-elements-complete-font-family` |
 * | `--stripe-elements-complete-font-size` |
 * | `--stripe-elements-complete-font-smoothing` |
 * | `--stripe-elements-complete-font-variant` |
 * | `--stripe-elements-complete-icon-color` |
 * | `--stripe-elements-complete-line-height` |
 * | `--stripe-elements-complete-letter-spacing` |
 * | `--stripe-elements-complete-text-decoration` |
 * | `--stripe-elements-complete-text-shadow` |
 * | `--stripe-elements-complete-text-transform` |
 * | `--stripe-elements-empty-color` |
 * | `--stripe-elements-empty-font-family` |
 * | `--stripe-elements-empty-font-size` |
 * | `--stripe-elements-empty-font-smoothing` |
 * | `--stripe-elements-empty-font-variant` |
 * | `--stripe-elements-empty-icon-color` |
 * | `--stripe-elements-empty-line-height` |
 * | `--stripe-elements-empty-letter-spacing` |
 * | `--stripe-elements-empty-text-decoration` |
 * | `--stripe-elements-empty-text-shadow` |
 * | `--stripe-elements-empty-text-transform` |
 * | `--stripe-elements-invalid-color` |
 * | `--stripe-elements-invalid-font-family` |
 * | `--stripe-elements-invalid-font-size` |
 * | `--stripe-elements-invalid-font-smoothing` |
 * | `--stripe-elements-invalid-font-variant` |
 * | `--stripe-elements-invalid-icon-color` |
 * | `--stripe-elements-invalid-line-height` |
 * | `--stripe-elements-invalid-letter-spacing` |
 * | `--stripe-elements-invalid-text-decoration` |
 * | `--stripe-elements-invalid-text-shadow` |
 * | `--stripe-elements-invalid-text-transform` |
 *
 * @demo demo/index.html
 * @polymer
 * @customElement
 * @extends LitElement
 * @fires 'stripe-token'
 * @fires 'stripe-error'
 */
export class StripeElements extends LitElement {
  static is = 'stripe-elements';

  static properties = {
    /**
     * The URL to the morm action. Example '/charges'.
     * If blank or undefined will not submit charges immediately.
     */
    action: { type: String },

    /**
     * The card brand detected by Stripe
     * @type {String}
     * @readonly
     */
    brand: { type: String },

    /**
     * Reference to the Stripe card.
     * @type {Object}
     * @readonly
     */
    card: { type: Object },

    /**
     * Card billing info to be passed to createToken() (optional)
     * https://stripe.com/docs/stripe-js/reference#stripe-create-token
     * @type {Object}
     */
    cardData: { type: Object },

    /**
     * Error message from Stripe.
     * @type {String}
     * @readonly
     */
    error: { type: String },

    /**
     * If the form has an error.
     * @type {Boolean}
     * @readonly
     */
    hasError: { type: Boolean, attribute: 'has-error', reflect: true },

    /**
     * If the form is complete.
     * @type {Boolean}
     * @readonly
     */
    isComplete: { type: Boolean, attribute: 'is-complete', reflect: true },

    /**
     * If the form is empty.
     * @type {Boolean}
     * @readonly
     */
    isEmpty: { type: Boolean, attribute: 'is-empty', reflect: true },

    /**
     * Whether to hide icons in the Stripe form.
     * @type {Boolean}
     */
    hideIcon: { type: Boolean, attribute: 'hide-icon' },

    /**
     * Whether or not to hide the postal code field.
     * Useful when you gather shipping info elsewhere.
     * @type {Boolean}
     */
    hidePostalCode: { type: Boolean, attribute: 'hide-postal-code' },

    /**
     * Stripe icon style. 'solid' or 'default'.
     * @type {'solid'|'default'}
     */
    iconStyle: { type: String, attribute: 'icon-style' },

    /**
     * Stripe Publishable Key. EG. pk_test_XXXXXXXXXXXXXXXXXXXXXXXX
     * @type {String}
     */
    publishableKey: { type: String, attribute: 'publishable-key' },

    /**
     * True when the stripe element is ready to receive focus.
     * @type {Boolean}
     * @readonly
     */
    stripeReady: { type: Boolean, attribute: 'stripe-ready', reflect: true },

    /**
     * Stripe token
     * @type {Object}
     * @readonly
     */
    token: { type: Object },

    /**
     * Prefilled values for form. Example {postalCode: '90210'}
     * @type {Object}
     */
    value: { type: Object },

    /**
     * Stripe instance
     * @type {Object}
     * @readonly
     */
    stripe: { type: Object },

    /**
     * Stripe Elements instance
     * @type {Object}
     * @readonly
     */
    elements: { type: Object },
  }

  #brand = null;
  get brand() { return this.#brand; }
  set brand(_) { }

  #card = null;
  get card() { return this.#card; }
  set card(_) { }

  #error = null;
  get error() { return this.#error; }
  set error(_) { }

  #hasError = false;
  get hasError() { return this.#hasError; }
  set hasError(_) { }

  #isComplete = false;
  get isComplete() { return this.#isComplete; }
  set isComplete(_) { }

  #isEmpty = true;
  get isEmpty() { return this.#isEmpty; }
  set isEmpty(_) { }

  #stripeReady = false;
  get stripeReady() { return this.#stripeReady; }
  set stripeReady(_) { }

  #token = null;
  get token() { return this.#token; }
  set token(_) { }

  /**
   * Mount Point Element id
   * @type {String}
   */
  #mountElementId = generateRandomMountElementId();

  /**
   * Stripe Element mount point for Polyfilled browsers
   * @type {Element}
   */
  #shadyDomMount = null;

  #stripe = null;
  get stripe() { return this.#stripe; }
  set stripe(_) { }

  #elements = null;
  get elements() { return this.#elements; }
  set elements(_) { }

  /** The form element */
  #form = null;

  get #root() {
    return window.ShadyDOM ? this.shadowRoot : document;
  }

  static styles = [
    style,
  ];

  /** LIFECYCLE */

  /** @inheritdoc */
  constructor() {
    super();
    this.action = '';
    this.hideIcon = false;
    this.hidePostalCode = false;
    this.iconStyle = 'default';
    this.value = {};
  }

  /** @inheritdoc */
  connectedCallback() {
    super.connectedCallback();
    this.#fire('is-complete-changed', this.isComplete);
    this.#fire('is-empty-changed', this.isEmpty);
    this.#fire('has-error-changed', this.hasError);
    this.#fire('brand-changed', this.brand);
    this.#fire('card-changed', this.card);
    this.#fire('error-changed', this.error);
    this.#fire('publishable-key-changed', this.publishableKey);
    this.#fire('stripe-ready-changed', this.stripeReady);
    this.#fire('token-changed', this.token);
    if (!document.getElementById('stripe-elements-custom-css-properties')) {
      appendTemplate(stripeElementsCustomCssProperties, document.head);
    }
  }

  /** @inheritdoc */
  firstUpdated() {
    this.#initMountPoints();
    this.#form = this.#root.querySelector('form');
  }

  /** @inheritdoc */
  updated(changed) {
    if (changed.has('isComplete')) this.#fire('is-complete-changed', this.isComplete);
    if (changed.has('isEmpty')) this.#fire('is-empty-changed', this.isEmpty);
    if (changed.has('hasError')) this.#fire('has-error-changed', this.hasError);
    if (changed.has('brand')) this.#fire('brand-changed', this.brand);
    if (changed.has('card')) this.#fire('card-changed', this.card);
    if (changed.has('stripeReady')) this.#fire('stripe-ready-changed', this.stripeReady);
    if (changed.has('publishableKey')) {
      this.#fire('publishable-key-changed', this.publishableKey);
      this.#publishableKeyChanged(this.publishableKey);
    }
    if (changed.has('token')) {
      const { token } = this;
      this.#fire('token-changed', token);
      this.dispatchEvent(new CustomEvent('stripe-token', { bubbles, composed, token }));
    }
    if (changed.has('error')) {
      this.#fire('error-changed', this.error);
      this.#fireError(this.error);
    }
  }

  /** @inheritdoc */
  render() {
    const { error } = this;
    const { message: errorMessage = '' } = error || {};
    return html`
      <slot id="stripe-slot" name="stripe-card"></slot>
      <div id="error">${errorMessage}</div>
    `;
  }

  /** PUBLIC API */

  /**
   * Checks for potential validity. A potentially valid form is one that
   * is not empty, not complete and has no error. A validated form also counts
   * as potentially valid.
   * @return {Boolean} true if the Stripe form is potentially valid
   */
  isPotentiallyValid() {
    return (!this.isComplete && !this.isEmpty && !this.hasError) || this.validate();
  }

  /** Resets the Stripe card. */
  reset() {
    if (this.card && typeof this.card.clear === 'function') this.card.clear();
    let old = this.#error
    this.#error = undefined;
    this.requestUpdate('error', old);
  }

  /**
   * Submit credit card information to generate a token
   * @param  {Event} event Submit event.
   */
  submit(event) {
    this.stripe.createToken(this.card, this.cardData)
      .then(this.#handleResponse.bind(this))
      .catch(this.#handleError.bind(this));
  }

  /**
   * Checks if the Stripe form is valid.
   * @return {Boolean} true if the Stripe form is valid
   */
  validate() {
    const isValid = this.isComplete && !this.isEmpty && !this.hasError;
    if (!isValid) {
      let oldError = this.#error;
      this.#error = { message: 'Credit card information is invalid.' };
      this.requestUpdate('error', oldError)
    }
    return isValid;
  }

  /** PRIVATE METHODS */

  /** Fires an event with a polymer-style changed event */
  #fire(type, value) {
    const detail = value ? { value } : undefined;
    this.dispatchEvent(new CustomEvent(type, { bubbles, composed, detail }));
  }

  /** Fires an Error Event */
  #fireError(error) {
    this.dispatchEvent(new ErrorEvent('stripe-error', { bubbles, composed, error }));
  }

  /**
   * Returns a Stripe-friendly style object computed from CSS custom properties
   * @return {Object} Stripe Style initialization object.
   */
  #getStripeElementsStyles() {
    const retVal = { base: {}, complete: {}, empty: {}, invalid: {} };
    allowedStyles.forEach(style => {
      const dash = style.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`);
      ['base', 'complete', 'empty', 'invalid'].forEach(prefix => {
        retVal[prefix][style] = window.ShadyCSS
          ? ShadyCSS.getComputedStyleValue(this, `--stripe-elements-${prefix}-${dash}`)
          : getComputedStyle(this).getPropertyValue(`--stripe-elements-${prefix}-${dash}`);
      });
    });
    return retVal;
  }

  /**
   * Sets the error.
   * @param  {Object} error
   * @protected
   */
  #handleError(error) {
    this.#fireError(error);
    // Show error in UI
    const oldError = this.#error;
    this.#error = error.message;
    this.requestUpdate('error', oldError);
  }

  /**
   * Sets the token or error from the response.
   * @param  {Object} response.error Stripe error
   * @param  {Object} response.token Stripe token
   * @protected
   */
  #handleResponse({ error, token }) {
    if (error) {
      const oldError = this.#error;
      this.#error = error;
      this.requestUpdate('error', oldError);
    } else {
      const oldToken = this.#token;
      this.#token = token;
      this.requestUpdate('token', oldToken);
      // Submit the form
      if (this.action) this.#form.submit();
    }
  }

  #initMountPoints() {
    if (!!window.ShadyDOM) this.#initShadyDomMount();
    else this.#initShadowDomMounts();
  }

  /** Prepares to mount Stripe Elements in light DOM. */
  #initShadowDomMounts() {
    // trace each shadow boundary between us and the document
    let host = this;
    const shadowHosts = [this];
    // eslint-disable-next-line no-loops/no-loops
    while (host = host.getRootNode().host) {
      if (host) shadowHosts.push(host);
    }

    // append mount point to first shadow host under document (as light child)
    // and slot breadcrumbs to each shadowroot in turn, until our shadow host.

    const { action, token } = this;
    const id = this.#mountElementId;
    const mountTemplate = stripeCardTemplate({ action, id, token });
    const slotTemplate =
      html`<slot slot="stripe-card" name="stripe-card"></slot>`;

    appendTemplate(mountTemplate, shadowHosts.pop());
    shadowHosts.forEach(host => appendTemplate(slotTemplate, host));
  }

  /** Creates a mounting div for the shady dom stripe elements container */
  #initShadyDomMount() {
    if (this.#shadyDomMount) return;
    const { action, token } = this;
    const id = this.#mountElementId;
    const mountTemplate = stripeCardTemplate({ action, id, token });
    this.#shadyDomMount = appendTemplate(mountTemplate, this);
  }

  /**
   * Initializes Stripe and elements.
   * @param {String} publishableKey Stripe publishable key.
   */
  #initStripe(publishableKey = this.publishableKey) {
    const oldStripe = this.#stripe;
    const oldElements = this.#elements;
    if (this.#stripe) this.#stripe = null;
    if (!window.Stripe) {
      // eslint-disable-next-line no-console
      console.warn(`<stripe-elements> requires Stripe.js to be loaded first.`);
    } else {
      this.#stripe = Stripe(publishableKey);
      this.#elements = this.#stripe.elements();
      this.requestUpdate('elements', oldElements)
    }
    this.requestUpdate('stripe', oldStripe)
  }

  /** Creates and mounts Stripe Elements card. */
  #mountCard() {
    const mount = this.#root.getElementById(this.#mountElementId);
    if (mount) {
      const { hidePostalCode, hideIcon, iconStyle, value } = this;
      const style = this.#getStripeElementsStyles();
      const oldCard = this.#card;
      this.#card = this.#elements.create('card', {
        hideIcon,
        hidePostalCode,
        iconStyle,
        style,
        value,
      });
      this.requestUpdate('card', oldCard)
      this.#card.mount(mount);
      this.#card.addEventListener('ready', this.onReady.bind(this));
      this.#card.addEventListener('change', this.onChange.bind(this));
    }
  }

  /**
   * Sets the error.
   * @param  {Boolean}       event.empty     true if value is empty
   * @param  {Boolean}       event.complete  true if value is well-formed and potentially complete.
   * @param  {String}        event.brand     brand of the card being entered e.g. 'visa' or 'amex'
   * @param  {Object}        event.error     The current validation error, if any.
   * @param  {String|Object} event.value     Value of the form. Only non-sensitive information e.g. postalCode is present.
   */
  onChange({ empty, complete, brand, error, value } = {}) {
    const oldBrand = this.#brand
    const oldError = this.#error;
    const oldHasError = this.#hasError;
    const oldIsComplete = this.#isComplete
    const oldIsEmpty = this.#isEmpty

    this.#brand = brand;
    this.#error = error;
    this.#hasError = !!error;
    this.#isComplete = complete;
    this.#isEmpty = empty;

    this.requestUpdate('brand', oldBrand);
    this.requestUpdate('error', oldError);
    this.requestUpdate('hasError', oldHasError);
    this.requestUpdate('isComplete', oldIsComplete);
    this.requestUpdate('isEmpty', oldIsEmpty);
  }

  /**
   * Sets the stripeReady property when the stripe element is ready to receive focus.
   * @param  {Event} event
   */
  onReady(event) {
    const oldStripeReady = this.#stripeReady
    this.#stripeReady = true;
    this.requestUpdate('stripeReady', oldStripeReady);
    this.#fire('stripe-ready');
  }

  /**
   * Reinitializes Stripe and mounts the card.
   * @param  {String} publishableKey Stripe publishable key
   */
  #publishableKeyChanged(publishableKey) {
    this.#unmountCard();
    if (publishableKey) {
      this.#initStripe(this.publishableKey);
      this.#mountCard();
    }
  }

  /** Unmounts and nullifies the card. */
  #unmountCard() {
    try {
      this.card && this.card.unmount && this.card.unmount();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      const oldCard = this.#card
      this.#card = null;
      this.requestUpdate('card', oldCard);
      const oldStripeReady = this.#stripeReady;
      this.#stripeReady = false;
      this.requestUpdate('stripeReady', oldStripeReady);
    }
  }
}
