import { LitElement, html, css } from 'lit-element';
import { render } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';

const removeEl = el => {
  /* istanbul ignore if */
  if (el instanceof Element) el.remove();
};

const MEMOS = new WeakMap();

const getCache = f => {
  if (!MEMOS.has(f)) MEMOS.set(f, new Map());
  return MEMOS.get(f);
};

const memoize1 = f => {
  const m = getCache(f);
  return x => {
    if (m.has(x)) {
      return m.get(x);
    } else {
      const val = f(x);
      m.set(x, val);
      return val;
    }
  };
};

const camel = memoize1(s =>
  s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()));

const dash = memoize1(s =>
  s.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase());

/* istanbul ignore next */
const removeAllMounts = host =>
  host.querySelectorAll('[slot="stripe-card"][name="stripe-card"]')
    .forEach(removeEl);

function appendTemplate(template, target) {
  const tmp = document.createElement('div');
  render(template, tmp);
  const { firstElementChild } = tmp;
  target.appendChild(firstElementChild);
  tmp.remove();
  return firstElementChild;
}

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
[hidden] { display: none !important; }
:host {
  display: block;
  min-width: var(--stripe-elements-width, 300px);
  min-height: var(--stripe-elements-height, 50px);
}
#error {
  font-family: sans-serif;
  font-size: 14px;
  padding-left: 42px;
  padding-bottom: 10px;
}
`;

const stripeCardTemplate = ({ action, id, source, token }) => html`
<div slot="stripe-card">
  <form action="${ifDefined(action || undefined)}" method="post">
    <div id="${id}" aria-label="Credit or Debit Card"></div>
    <input type="hidden" name="stripeToken" value="${ifDefined(token || undefined)}">
    <input type="hidden" name="stripeSource" value="${ifDefined(source || undefined)}">
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
 * Custom element wrapper for Stripe.js v3 Elements
 *
 * ## Usage
 *
 * ```html
 *   <label>Stripe Publishable Key <input id="pubkey"/></label>
 *   <stripe-elements id="stripe"></stripe-elements>
 *   <script>
 *     const onKey = ({ target: { value } })) => stripe.publishableKey = value;
 *     const onToken = ({ detail: token })) => console.log(token);
 *     pubkey.addEventListener('change', onKey);
 *     stripe.addEventListener('stripe-token', onToken);
 *   </script>
 * ```
 *
 * ## Styling
 *
 * A word about nomenclature before we list custom properties and mixins.
 * Stripe v3 Introduces 'Stripe Elements'. These are not custom elements,
 * but rather forms hosted by stripe and injected into your page via an iFrame.
 * When we refer to the 'Stripe Element' in this document, we are referring
 * to the hosted Stripe form, not the `<stripe-element>` custom element.
 * Confusing? Possibly... but the alternative was to call *this* element `<stripe-elements-element>``
 *
 * The following custom properties are available for styling the `<stripe-elements>` component:
 *
 * | Custom property | Description | Default |
 * | --- | --- | --- |
 * | `--stripe-elements-width` | Min-width of the stripe-element | `300px` |
 * | `--stripe-elements-height` | Min-width of the stripe-element | `50px` |
 * | `--stripe-elements-element-padding` | Padding for the stripe-element | `14px`;
 * | `--stripe-elements-element-background | Background for the stripe-element | `initial` |
 *
 * When you apply CSS to the custom properties below, they're parsed and sent to Stripe, who should apply them to the Stripe Element they return in the iFrame.
 *
 * - `base` styles are inherited by all other variants.
 * - `complete` styles are applied when the Stripe Element has valid input.
 * - `empty` styles are applied when the Stripe Element has no user input.
 * - `invalid` styles are applied when the Stripe Element has invalid input.
 *
 * There are 11 properties for each state that you can set which will be read into the Stripe Element iFrame:
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
 * @demo demo/index.html
 * @element stripe-elements
 * @extends LitElement
 *
 * @fires stripe-token - The token received from stripe.com
 * @fires stripe-source - The source received from stripe.com
 * @fires stripe-error - The validation error, or the error returned from stripe.com
 * @fires stripe-change - Stripe Element change event
 * @fires stripe-ready - Stripe has been initialized and mounted
 *
 * @fires is-complete-changed - The new value of is-complete
 * @fires is-empty-changed - The new value of is-empty
 * @fires has-error-changed - The new value of has-error
 * @fires brand-changed - The new value of brand
 * @fires card-changed - The new value of card
 * @fires error-changed - The new value of error
 * @fires publishable-key-changed - The new value of publishable-key
 * @fires stripe-ready-changed - The new value of stripe-ready
 * @fires token-changed - The new value of token
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
     * @type {Card}
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
     * Whether the form has an error.
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
     * Whether to display the error message
     * @type {Object}
     */
    showError: { type: Boolean, attribute: 'show-error', reflect: true },

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

  /**
   * Brand of the card
   */
  #brand = null;
  get brand() { return this.#brand; }

  /**
   * Stripe card object
   * @type {StripeCard}
   */
  #card = null;
  get card() { return this.#card; }

  /**
   * Stripe or validation error
   * @type {Error}
   */
  #error = null;
  get error() { return this.#error; }

  /**
   * Whether the element has an error
   * @type {Boolean}
   */
  #hasError = false;
  get hasError() { return this.#hasError; }

  /**
   * Whether the card form is complete
   * @type {Boolean}
   */
  #isComplete = false;
  get isComplete() { return this.#isComplete; }

  /**
   * Whether the card form is empty
   * @type {Boolean}
   */
  #isEmpty = true;
  get isEmpty() { return this.#isEmpty; }

  /**
   * Whether Stripe.js has been initialized
   * @type {Boolean}
   */
  #stripeReady = false;
  get stripeReady() { return this.#stripeReady; }

  /**
   * The token returned from `createToken`
   * @type {StripeToken}
   */
  #token = null;
  get token() { return this.#token; }

  /**
   * The source returned from `createSource`
   * @type {StripeSource}
   */
  #source = null;
  get source() { return this.#source; }

  /**
   * The Stripe.js object
   * @type {Stripe}
   */
  #stripe = null;
  get stripe() { return this.#stripe; }

  /**
   * The Stripe.js Elements instance object
   * @type {Elements}
   */
  #elements = null;
  get elements() { return this.#elements; }

  /**
   * Breadcrumbs back up to the document.
   * @type {Array}
   */
  #shadowHosts = [];

  /**
   * Mount Point Element id
   * @type {String}
   */
  #stripeMountId = null;

  /**
   * Stripe Element mount point
   * @type {Element}
   */
  get stripeMount() {
    return document.getElementById(this.#stripeMountId);
  }

  get form () {
    return this.querySelector('form');
  }

  static styles = [
    style,
  ];

  action = '';

  hideIcon = false;

  hidePostalCode = false;

  iconStyle = 'default';

  value = {};

  /** LIFECYCLE */
  constructor() {
    super();
    this.#onReady = this.#onReady.bind(this)
    this.#onChange = this.#onChange.bind(this)
    this.#handleError = this.#handleError.bind(this)
    this.#handleResponse = this.#handleResponse.bind(this)
  }

  /** @inheritdoc */
  connectedCallback() {
    super.connectedCallback();
    this.#notify('is-complete');
    this.#notify('is-empty');
    this.#notify('has-error');
    this.#notify('brand');
    this.#notify('card');
    this.#notify('error');
    this.#notify('publishable-key');
    this.#notify('stripe-ready');
    this.#notify('token');
    this.#notify('source');
    if (!document.getElementById('stripe-elements-custom-css-properties')) {
      appendTemplate(stripeElementsCustomCssProperties, document.head);
    }
  }

  /** @inheritdoc */
  render() {
    const { error, showError } = this;
    const { message: errorMessage = '' } = error || {};
    return html`
      <slot id="stripe-slot" name="stripe-card"></slot>
      <div id="error" part="error" ?hidden="${!showError}">${errorMessage || error}</div>
    `;
  }

  /** @inheritdoc */
  firstUpdated() {
    this.#initMountPoints();
  }

  /** @inheritdoc */
  updated(changed) {
    if (changed.has('isComplete')) this.#notify('is-complete');
    if (changed.has('isEmpty')) this.#notify('is-empty');
    if (changed.has('hasError')) this.#notify('has-error');
    if (changed.has('brand')) this.#notify('brand');
    if (changed.has('card')) this.#notify('card');
    if (changed.has('stripeReady')) this.#notify('stripe-ready');
    if (changed.has('publishableKey')) {
      this.#notify('publishable-key');
      this.#publishableKeyChanged(this.publishableKey);
    }

    if (changed.has('token')) {
      const { token } = this;
      this.#notify('token');
      this.#fire('stripe-token', token);
      // Submit the form
      if (this.action) this.querySelector('form').submit();
    }

    if (changed.has('source')) {
      const { source } = this;
      this.#notify('source');
      this.#fire('stripe-source', source);
      // Submit the form
      if (this.action) this.querySelector('form').submit();
    }

    if (changed.has('error')) {
      this.#setToken(null);
      this.#setSource(null);
      this.#notify('error');
      this.#fireError(this.error);
    }
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

  /**
   * Resets the Stripe card.
   */
  reset() {
    this.#setError(null);
    this.card && this.card.clear();
  }

  /**
   * Submit credit card information to generate a source
   */
  createSource() {
    if (!this.stripe) throw new Error('Cannot create source before initializing Stripe');
    if (!this.isComplete) return;
    return this.stripe.createToken(this.#card)
      .then(this.#handleResponse)
      .catch(this.#handleError);
  }

  /**
   * Submit credit card information to generate a token
   */
  createToken() {
    if (!this.stripe) throw new Error('Cannot create token before initializing Stripe');
    if (!this.isComplete) return;
    return this.stripe.createToken(this.#card, this.cardData)
      .then(this.#handleResponse)
      .catch(this.#handleError);
  }

  /**
   * Submit credit card information to generate a token
   * @deprecated will be removed in a subsequent version
   */
  submit() {
    return this.createToken();
  }

  /**
   * Checks if the Stripe form is valid.
   * @return {Boolean} true if the Stripe form is valid
   */
  validate() {
    const { isComplete, isEmpty, hasError } = this;
    const isValid = !hasError && isComplete && !isEmpty;
    const message = `Credit card information is ${isEmpty ? 'empty' : 'incomplete'}.`;
    if (!isValid && !hasError) this.#setError(message);
    return isValid;
  }

  /**
   * Fires an event.
   * @param  {string} type      event type
   * @param  {any}    detail    detail value
   * @param  {Object} [opts={}] event options
   */
  #fire(type, detail, opts = {}) {
    this.dispatchEvent(new CustomEvent(type, { detail, ...opts }));
  }

  /**
   * Fires an Error Event
   * @param  {Error} error
   */
  #fireError(error) {
    this.dispatchEvent(new ErrorEvent('stripe-error', { error }));
  }

  /**
   * Fires a Polymer-style prop-changed event.
   * @param {string} prop camelCased prop name.
   */
  #notify(prop) {
    const type = `${dash(prop)}-changed`;
    const value = this[camel(prop)];
    this.#fire(type, { value });
  }

  /**
   * Returns a Stripe-friendly style object computed from CSS custom properties
   * @return {Object} Stripe Style initialization object.
   */
  #getStripeElementsStyles() {
    const computedStyle = window.ShadyCSS ? null : getComputedStyle(this);
    return allowedStyles.reduce((acc, style) => {
      const dashCase = dash(style);
      Object.keys(acc).forEach(prefix => {
        acc[prefix][style] = (
          window.ShadyCSS ?
            ShadyCSS.getComputedStyleValue(this, `--stripe-elements-${prefix}-${dashCase}`) :
            computedStyle.getPropertyValue(`--stripe-elements-${prefix}-${dashCase}`)
        ) || undefined;
      });
      return acc;
    }, { base: {}, complete: {}, empty: {}, invalid: {} });
  }

  /**
   * Sets the error.
   * @param  {Object} error
   * @protected
   */
  #handleError(error) {
    this.#setError(error.message);
  }

  /**
   * Sets the token or error from the response.
   * @param  {Object} response       Response from stripe
   * @param  {Object} response.error Stripe error
   * @param  {Object} response.token Stripe token
   * @return {Object}
   * @protected
   */
  #handleResponse(response) {
    const { error, token, source } = response;
    if (error) this.#setError(error);
    else if (token) this.#setToken(token);
    else if (source) this.#setSource(source);
    return response;
  }

  #initMountPoints() {
    if (this.stripeMount) return;
    else if (window.ShadyDOM) this.#initShadyDomMount();
    else this.#initShadowDomMounts();
  }

  /** Prepares to mount Stripe Elements in light DOM. */
  #initShadowDomMounts() {
    // trace each shadow boundary between us and the document
    let host = this;
    this.#shadowHosts = [this];
    while (host = host.getRootNode().host) this.#shadowHosts.push(host); // eslint-disable-line prefer-destructuring, no-loops/no-loops

    // append mount point to first shadow host under document (as light child)
    // and slot breadcrumbs to each shadowroot in turn, until our shadow host.

    const { action, token } = this;
    this.#stripeMountId = generateRandomMountElementId();
    const id = this.#stripeMountId;
    const mountTemplate = stripeCardTemplate({ action, id, token });
    const slotTemplate =
      html`<slot slot="stripe-card" name="stripe-card"></slot>`;

    appendTemplate(mountTemplate, this.#shadowHosts.pop());
    this.#shadowHosts.forEach(host => appendTemplate(slotTemplate, host));
  }

  /** Creates a mounting div for the shady dom stripe elements container */
  #initShadyDomMount() {
    const { action, token } = this;
    this.#stripeMountId = generateRandomMountElementId();
    const id = this.#stripeMountId;
    const mountTemplate = stripeCardTemplate({ action, id, token });
    appendTemplate(mountTemplate, this);
  }

  /**
   * Initializes Stripe and elements.
   */
  #initStripe() {
    const oldStripe = this.#stripe;
    const oldElements = this.#elements;
    if (this.#stripe) this.#stripe = null;
    if (!window.Stripe) {
      const message = `<stripe-elements> requires Stripe.js to be loaded first.`;
      this.#setError({ message });
      console.warn(message); // eslint-disable-line no-console
    } else if (this.publishableKey) {
      this.#stripe = Stripe(this.publishableKey);
      this.#elements = this.#stripe.elements();
    } else {
      this.#elements = null;
    }
    this.requestUpdate('stripe', oldStripe);
    this.requestUpdate('elements', oldElements);
  }

  /** Creates and mounts Stripe Elements card. */
  #mountCard() {
    const { hidePostalCode, hideIcon, iconStyle, value } = this;
    const style = this.#getStripeElementsStyles();

    this.#setCard(this.#elements.create('card', {
      hideIcon,
      hidePostalCode,
      iconStyle,
      style,
      value,
    }));

    this.#card.mount(this.stripeMount);
    this.#card.addEventListener('ready', this.#onReady);
    this.#card.addEventListener('change', this.#onChange);
  }

  /**
   * Sets the error.
   * @param  {StripeChangeEvent}         event
   * @param  {Boolean}       event.empty     true if value is empty
   * @param  {Boolean}       event.complete  true if value is well-formed and potentially complete.
   * @param  {String}        event.brand     brand of the card being entered e.g. 'visa' or 'amex'
   * @param  {Object}        event.error     The current validation error, if any.
   * @param  {String|Object} event.value     Value of the form. Only non-sensitive information e.g. postalCode is present.
   */
  #onChange(event) {
    const { empty, complete, brand, error } = event;
    this.#setError(error);
    this.#setBrand(brand);
    this.#setIsComplete(complete);
    this.#setIsEmpty(empty);
    this.#fire('stripe-change', event);
  }

  /**
   * Sets the stripeReady property when the stripe element is ready to receive focus.
   * @param  {Event} event
   */
  #onReady(event) {
    this.#setStripeReady(true);
    this.#fire('stripe-ready', event);
  }

  /**
   * Reinitializes Stripe and mounts the card.
   * @param  {String} publishableKey Stripe publishable key
   */
  #publishableKeyChanged(publishableKey) {
    this.#unmountCard();
    this.#setStripeReady(false);
    if (!this.stripeMount || !this.form) this.#resetMount();
    this.#initStripe();
    if (publishableKey && this.stripe) this.#mountCard();
  }

  #removeMountPoints() {
    this.#shadowHosts.forEach(removeAllMounts);
    removeEl(this.stripeMount);
  }

  #resetMount() {
    this.#removeMountPoints();
    this.#initMountPoints();
  }

  /** Unmounts and nullifies the card. */
  #unmountCard() {
    if (this.card) this.card.unmount();
    this.#setCard(null);
  }

  /** READONLY SETTERS */

  #setBrand(newVal) {
    const oldBrand = this.#brand;
    this.#brand = newVal;
    this.requestUpdate('brand', oldBrand);
  }

  #setCard(newVal) {
    const oldCard = this.#card;
    this.#card = newVal;
    this.requestUpdate('card', oldCard);
  }

  #setError(newVal) {
    const oldError = this.#error;
    this.#error = newVal;
    this.requestUpdate('error', oldError);
    const oldHasError = this.#hasError;
    this.#hasError = !!newVal;
    this.requestUpdate('hasError', oldHasError);
  }

  #setIsComplete(newVal) {
    const oldIsComplete = this.#isComplete;
    this.#isComplete = newVal;
    this.requestUpdate('isComplete', oldIsComplete);
  }

  #setIsEmpty(newVal) {
    const oldIsEmpty = this.#isEmpty;
    this.#isEmpty = newVal;
    this.requestUpdate('isEmpty', oldIsEmpty);
  }

  #setStripeReady(newVal) {
    const oldStripeReady = this.#stripeReady;
    this.#stripeReady = newVal;
    this.requestUpdate('stripeReady', oldStripeReady);
  }

  #setSource(newVal) {
    const oldSource = this.#source;
    this.#source = newVal;
    this.requestUpdate('source', oldSource);
  }

  #setToken(newVal) {
    const oldToken = this.#token;
    this.#token = newVal;
    this.requestUpdate('token', oldToken);
  }
}
