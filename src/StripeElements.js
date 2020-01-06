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
<form action="${ifDefined(action || undefined)}" method="post">
  <div id="${id}" aria-label="Credit or Debit Card"></div>
  <input ?disabled="${!token}" type="hidden" name="stripeToken" value="${ifDefined(token || undefined)}">
  <input ?disabled="${!source}" type="hidden" name="stripeSource" value="${ifDefined(source || undefined)}">
</form>
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
    publishableKey: { type: String, attribute: 'publishable-key', reflect: true },

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
  __brand = null;

  get brand() {
    return this.__brand;
  }

  /**
   * Stripe card object
   * @type {StripeCard}
   */
  __card = null;

  get card() {
    return this.__card;
  }

  __error = null;

  /**
   * Stripe or validation error
   * @type {Error}
   */
  get error() {
    return this.__error;
  }

  __hasError = false;

  /**
   * Whether the element has an error
   * @type {Boolean}
   */
  get hasError() {
    return this.__hasError;
  }

  __isComplete = false;

  /**
   * Whether the card form is complete
   * @type {Boolean}
   */
  get isComplete() {
    return this.__isComplete;
  }

  __isEmpty = true;

  /**
   * Whether the card form is empty
   * @type {Boolean}
   */
  get isEmpty() {
    return this.__isEmpty;
  }

  __stripeReady = false;

  /**
   * Whether Stripe.js has been initialized
   * @type {Boolean}
   */
  get stripeReady() {
    return this.__stripeReady;
  }

  __token = null;


  /**
   * The token returned from `createToken`
   * @type {StripeToken}
   */
  get token() {
    return this.__token;
  }

  __source = null;

  /**
   * The source returned from `createSource`
   * @type {StripeSource}
   */
  get source() {
    return this.__source;
  }

  __stripe = null;

  /**
   * The Stripe.js object
   * @type {Stripe}
   */
  get stripe() {
    return this.__stripe;
  }

  /**
   * The Stripe.js Elements instance object
   * @type {Elements}
   */
  __elements = null;

  get elements() {
    return this.__elements;
  }

  /**
   * Breadcrumbs back up to the document.
   * @type {Array}
   */
  __shadowHosts = [];

  /**
   * Mount Point Element id
   * @type {String}
   */
  __stripeMountId = null;

  /**
   * Stripe Element mount point
   * @type {Element}
   */
  get stripeMount() {
    return document.getElementById(this.__stripeMountId);
  }

  /**
   * The internal form element
   * @type {HTMLFormElement}
   */
  get form() {
    let slot = this.shadowRoot.querySelector('slot');
    // eslint-disable-next-line no-loops/no-loops
    while (slot instanceof HTMLSlotElement && ([slot] = slot.assignedElements())) continue;
    return slot.querySelector('form');
  }

  get __tokenFormField() {
    return this.form.querySelector('[name="stripeToken"]');
  }

  get __sourceFormField() {
    return this.form.querySelector('[name="stripeSource"]');
  }

  static styles = [
    style,
  ];

  /**
   * The action attr of the internal form.
   * @type {string}
   */
  action;

  /**
   * Stripe cardData object to submit with
   * @type {Object}
   */
  cardData = {};

  hideIcon = false;

  hidePostalCode = false;

  iconStyle = 'default';

  value = {};

  /** LIFECYCLE */

  constructor() {
    super();
    this.__handleError = this.__handleError.bind(this);
    this.__handleResponse = this.__handleResponse.bind(this);
    this.__onReady = this.__onReady.bind(this);
    this.__onChange = this.__onChange.bind(this);
  }

  /** @inheritdoc */
  connectedCallback() {
    super.connectedCallback();
    this.__notify('is-complete');
    this.__notify('is-empty');
    this.__notify('has-error');
    this.__notify('brand');
    this.__notify('card');
    this.__notify('error');
    this.__notify('publishable-key');
    this.__notify('stripe-ready');
    this.__notify('token');
    this.__notify('source');
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
    this.__initMountPoints();
  }

  /** @inheritdoc */
  updated(changed) {
    if (changed.has('isComplete')) this.__notify('is-complete');
    if (changed.has('isEmpty')) this.__notify('is-empty');
    if (changed.has('hasError')) this.__notify('has-error');
    if (changed.has('brand')) this.__notify('brand');
    if (changed.has('card')) this.__notify('card');
    if (changed.has('stripeReady')) this.__notify('stripe-ready');
    if (changed.has('source')) this.__notify('source');
    if (changed.has('token')) this.__notify('token');
    if (changed.has('publishableKey')) {
      this.__notify('publishable-key');
      this.__publishableKeyChanged(this.publishableKey);
    }

    if (changed.has('error')) {
      this.__setToken(null);
      this.__setSource(null);
      this.__notify('error');
      this.__fireError(this.error);
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
    this.__setError(null);
    this.card && this.card.clear();
  }

  /**
   * Submit credit card information to generate a source
   * @param {object} [sourceData={}]
   */
  async createSource(sourceData = {}) {
    if (!this.stripe) throw new Error('Cannot create source before initializing Stripe');
    return this.stripe.createSource(this.__card, sourceData)
      .then(this.__handleResponse)
      .catch(this.__handleError);
  }

  /**
   * Submit credit card information to generate a token
   * @param {object} [cardData=this.cardData]
   */
  async createToken(cardData = this.cardData) {
    if (!this.stripe) throw new Error('Cannot create token before initializing Stripe');
    return this.stripe.createToken(this.__card, cardData)
      .then(this.__handleResponse)
      .catch(this.__handleError);
  }

  /**
   * Checks if the Stripe form is valid.
   * @return {Boolean} true if the Stripe form is valid
   */
  validate() {
    const { isComplete, isEmpty, hasError } = this;
    const isValid = !hasError && isComplete && !isEmpty;
    const message = `Credit card information is ${isEmpty ? 'empty' : 'incomplete'}.`;
    if (!isValid && !hasError) this.__setError(message);
    return isValid;
  }

  /**
   * Fires an event.
   * @param  {string} type      event type
   * @param  {any}    detail    detail value
   * @param  {Object} [opts={}] event options
   */
  __fire(type, detail, opts = {}) {
    this.dispatchEvent(new CustomEvent(type, { detail, ...opts }));
  }

  /**
   * Fires an Error Event
   * @param  {Error} error
   */
  __fireError(error) {
    this.dispatchEvent(new ErrorEvent('stripe-error', { error }));
  }

  /**
   * Fires a Polymer-style prop-changed event.
   * @param {string} prop camelCased prop name.
   */
  __notify(prop) {
    const type = `${dash(prop)}-changed`;
    const value = this[camel(prop)];
    this.__fire(type, { value });
  }

  /**
   * Returns a Stripe-friendly style object computed from CSS custom properties
   * @return {Object} Stripe Style initialization object.
   */
  __getStripeElementsStyles() {
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
  async __handleError(error) {
    this.__setError(error.message);
    await this.updateComplete;
    return error;
  }

  /**
   * Sets the token or error from the response.
   * @param  {Object} response       Response from stripe
   * @param  {Object} response.error Stripe error
   * @param  {Object} response.token Stripe token
   * @return {Object}
   * @protected
   */
  async __handleResponse(response) {
    const { error, token, source } = response;
    if (error) this.__setError(error);
    else if (token) this.__setToken(token);
    else if (source) this.__setSource(source);
    await this.updateComplete;
    return response;
  }

  __initMountPoints() {
    if (this.stripeMount) return;
    else if (window.ShadyDOM) this.__initShadyDomMount();
    else this.__initShadowDomMounts();
  }

  /** Prepares to mount Stripe Elements in light DOM. */
  __initShadowDomMounts() {
    // trace each shadow boundary between us and the document
    let host = this;
    this.__shadowHosts = [this];
    while (host = host.getRootNode().host) this.__shadowHosts.push(host); // eslint-disable-line prefer-destructuring, no-loops/no-loops

    // append mount point to first shadow host under document (as light child)
    // and slot breadcrumbs to each shadowroot in turn, until our shadow host.

    const { action, token } = this;
    this.__stripeMountId = generateRandomMountElementId();
    const id = this.__stripeMountId;
    const mountTemplate = stripeCardTemplate({ action, id, token });
    const slotTemplate =
      html`<slot slot="stripe-card" name="stripe-card"></slot>`;

    const root = this.__shadowHosts.pop();
    let container = root.querySelector('[slot="stripe-card"]');
    if (!container) {
      container = document.createElement('div');
      container.slot = 'stripe-card';
      root.appendChild(container);
    }
    appendTemplate(mountTemplate, container);
    this.__shadowHosts.forEach(host => appendTemplate(slotTemplate, host));
  }

  /** Creates a mounting div for the shady dom stripe elements container */
  __initShadyDomMount() {
    const { action, token } = this;
    this.__stripeMountId = generateRandomMountElementId();
    const id = this.__stripeMountId;
    const mountTemplate = stripeCardTemplate({ action, id, token });
    appendTemplate(mountTemplate, this);
  }

  /**
   * Initializes Stripe and elements.
   */
  __initStripe() {
    const oldStripe = this.__stripe;
    const oldElements = this.__elements;
    if (this.__stripe) this.__stripe = null;
    if (!window.Stripe) {
      const message = `<stripe-elements> requires Stripe.js to be loaded first.`;
      this.__setError({ message });
      console.warn(message); // eslint-disable-line no-console
    } else if (this.publishableKey) {
      this.__stripe = Stripe(this.publishableKey);
      this.__elements = this.__stripe.elements();
    } else {
      this.__elements = null;
    }
    this.requestUpdate('stripe', oldStripe);
    this.requestUpdate('elements', oldElements);
  }

  /** Creates and mounts Stripe Elements card. */
  __mountCard() {
    const { hidePostalCode, hideIcon, iconStyle, value } = this;
    const style = this.__getStripeElementsStyles();

    const card =
      this.__elements.create('card', { hideIcon, hidePostalCode, iconStyle, style, value });

    this.__setCard(card);

    this.__card.mount(this.stripeMount);
    this.__card.addEventListener('ready', this.__onReady);
    this.__card.addEventListener('change', this.__onChange);
    this.__setIsComplete(false);
    this.__setIsEmpty(true);
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
  __onChange(event) {
    const { empty, complete, brand, error } = event;
    this.__setError(error);
    this.__setBrand(brand);
    this.__setIsComplete(complete);
    this.__setIsEmpty(empty);
    this.__fire('stripe-change', event);
  }

  /**
   * Sets the stripeReady property when the stripe element is ready to receive focus.
   * @param  {Event} event
   */
  __onReady(event) {
    this.__setStripeReady(true);
    this.__fire('stripe-ready', event);
  }

  /**
   * Reinitializes Stripe and mounts the card.
   * @param  {String} publishableKey Stripe publishable key
   */
  __publishableKeyChanged(publishableKey) {
    this.__unmountCard();
    this.__setStripeReady(false);
    if (!this.stripeMount || !this.form) this.__resetMount();
    this.__initStripe();
    if (publishableKey && this.stripe) this.__mountCard();
  }

  __removeMountPoints() {
    this.__shadowHosts.forEach(removeAllMounts);
    removeEl(this.stripeMount);
  }

  __resetMount() {
    this.__removeMountPoints();
    this.__initMountPoints();
  }

  /** Unmounts and nullifies the card. */
  __unmountCard() {
    if (this.card) this.card.unmount();
    this.__setCard(null);
  }

  /** READONLY SETTERS */

  __setBrand(newVal) {
    const oldBrand = this.__brand;
    this.__brand = newVal;
    this.requestUpdate('brand', oldBrand);
  }

  __setCard(newVal) {
    const oldCard = this.__card;
    this.__card = newVal;
    this.requestUpdate('card', oldCard);
  }

  __setError(newVal) {
    const oldError = this.__error;
    this.__error = newVal;
    this.requestUpdate('error', oldError);
    const oldHasError = this.__hasError;
    this.__hasError = !!newVal;
    this.requestUpdate('hasError', oldHasError);
  }

  __setIsComplete(newVal) {
    const oldIsComplete = this.__isComplete;
    this.__isComplete = newVal;
    this.requestUpdate('isComplete', oldIsComplete);
  }

  __setIsEmpty(newVal) {
    const oldIsEmpty = this.__isEmpty;
    this.__isEmpty = newVal;
    this.requestUpdate('isEmpty', oldIsEmpty);
  }

  __setStripeReady(newVal) {
    const oldStripeReady = this.__stripeReady;
    this.__stripeReady = newVal;
    this.requestUpdate('stripeReady', oldStripeReady);
  }

  __setSource(newVal) {
    const oldSource = this.__source;
    this.__source = newVal;
    this.requestUpdate('source', oldSource);
    if (!newVal) return;
    this.__fire('stripe-source', newVal);
    this.__sourceFormField.removeAttribute('disabled');
    this.__sourceFormField.value = newVal;
    if (this.action) this.form.submit();
  }

  __setToken(newVal) {
    const oldToken = this.__token;
    this.__token = newVal;
    this.requestUpdate('token', oldToken);
    if (!newVal) return;
    this.__fire('stripe-token', newVal);
    this.__tokenFormField.removeAttribute('disabled');
    this.__tokenFormField.value = newVal;
    if (this.action) this.form.submit();
  }
}
