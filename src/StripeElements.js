import { LitNotify } from '@morbidick/lit-element-notify';
import { html, property } from 'lit-element';

import { ifDefined } from 'lit-html/directives/if-defined';
import { render } from 'lit-html';
import bound from 'bound-decorator';

import { StripeBase } from './StripeBase';
import { appendTemplate, remove } from './lib/dom';
import { dash, generateRandomMountElementId } from './lib/strings';
import sharedStyles from './shared.css';
import style from './stripe-elements.css';

/* istanbul ignore next */
const removeAllMounts = host =>
  host.querySelectorAll('[slot="stripe-card"][name="stripe-card"]')
    .forEach(remove);

const slotTemplate =
  html`<slot slot="stripe-card" name="stripe-card"></slot>`;

const stripeElementsCustomCssTemplate = document.createElement('template');
stripeElementsCustomCssTemplate.id = 'stripe-elements-custom-css-properties';
stripeElementsCustomCssTemplate.innerHTML = `
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

function applyCustomCss() {
  if (!document.getElementById('stripe-elements-custom-css-properties')) {
    document.head.appendChild(stripeElementsCustomCssTemplate.content.cloneNode(true));
  }
}

const stripeCardTemplate = ({ action, id, label, paymentMethod, source, token }) => html`
  <form action="${ifDefined(action || undefined)}" method="post">
    <div id="${ifDefined(id)}" aria-label="${ifDefined(label)}"></div>
    <input ?disabled="${!paymentMethod}" type="hidden" name="stripePaymentMethod" value="${ifDefined(paymentMethod || undefined)}">
    <input ?disabled="${!source}" type="hidden" name="stripeSource" value="${ifDefined(source || undefined)}">
    <input ?disabled="${!token}" type="hidden" name="stripeToken" value="${ifDefined(token || undefined)}">
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
 * <script type="module" src="https://unpkg.com/@power-elements/stripe-elements/stripe-elements.js?module"></script>
 * <stripe-elements id="stripe"
 *     action="/payment"
 *     publishable-key="pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"
 * ></stripe-elements>
 * ```
 *
 * See the demos for more comprehensive examples.
 *   - Using `<stripe-elements>` with [plain HTML and JavaScript](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-elements--in-plain-html-and-javascript).
 *   - Using `<stripe-elements>` in a [LitElement](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-elements--in-a-lit-element).
 *   - Using `<stripe-elements>` in a [Polymer Element](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-elements--in-a-polymer-element).
 *   - Using `<stripe-elements>` in a [Vue Component](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-elements--in-a-vue-component).
 *   - Using `<stripe-elements>` in an [Angular component](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-elements--in-an-angular-component).
 *   - Using `<stripe-elements>` in a [React component](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-elements--in-a-react-component).
 *   - Using `<stripe-elements>` in a [Preact component](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-elements--in-a-preact-component).
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
 * @fires 'stripe-change' - Stripe Element change event
 * @fires 'stripe-ready' - Stripe has been initialized and mounted
 *
 * @fires 'brand-changed' - The new value of brand
 * @fires 'card-changed' - The new value of card
 * @fires 'is-complete-changed' - The new value of is-complete
 * @fires 'is-empty-changed' - The new value of is-empty
 * @fires 'stripe-ready-changed' - The new value of stripe-ready
 */
export class StripeElements extends LitNotify(StripeBase) {
  static is = 'stripe-elements';

  static elementType = 'card';

  static styles = [
    sharedStyles,
    style,
  ];

  /* PUBLIC FIELDS */

  /**
   * Whether to hide icons in the Stripe form.
   * @type {Boolean}
   */
  @property({ type: Boolean, attribute: 'hide-icon' }) hideIcon = false;

  /**
   * Whether or not to hide the postal code field.
   * Useful when you gather shipping info elsewhere.
   * @type {Boolean}
   */
  @property({ type: Boolean, attribute: 'hide-postal-code' }) hidePostalCode = false;

  /**
   * Stripe icon style. 'solid' or 'default'.
   * @type {'solid'|'default'}
   */
  @property({ type: String, attribute: 'icon-style' }) iconStyle = 'default';

  /**
   * aria-label attribute for the credit card form.
   * @type {String}
   */
  @property({ type: String }) label = 'Credit or Debit Card';

  /**
   * Prefilled values for form. Example {postalCode: '90210'}
   * @type {Object}
   */
  @property({ type: Object }) value = {};

  /* READ ONLY PROPERTIES */

  /**
   * The card brand detected by Stripe
   * @type {String}
   * @readonly
   */
  @property({ type: String, notify: true, readOnly: true }) brand = null;

  /**
   * The Stripe card object.
   * @type {stripe.Element}
   * @readonly
   */
  @property({ type: Object, notify: true, readOnly: true }) card = null;

  /**
   * If the form is complete.
   * @type {Boolean}
   */
  @property({
    type: Boolean,
    attribute: 'is-complete',
    reflect: true,
    notify: true,
    readOnly: true,
  }) isComplete = false;

  /**
   * If the form is empty.
   * @type {Boolean}
   */
  @property({
    type: Boolean,
    attribute: 'is-empty',
    reflect: true,
    notify: true,
    readOnly: true,
  }) isEmpty = true;

  /**
   * If the stripe element is ready to receive focus.
   * @type {Boolean}
   */
  @property({
    type: Boolean,
    attribute: 'stripe-ready',
    reflect: true,
    notify: true,
    readOnly: true,
  }) stripeReady = false;

  /* PRIVATE FIELDS */

  /**
   * Breadcrumbs back up to the document.
   * @type {Node[]}
   * @private
   */
  shadowHosts = [];

  /**
   * The internal form element
   * @type {HTMLFormElement}
   * @protected
   */
  get form() {
    if (window.ShadyDOM) return this.querySelector('form');
    let slot = this.shadowRoot.querySelector('slot');
    // eslint-disable-next-line no-loops/no-loops
    while (slot instanceof HTMLSlotElement && ([slot] = slot.assignedElements())) continue;
    return slot.querySelector('form');
  }

  /**
   * Stripe Element mount point
   * @type {Element}
   */
  get stripeMount() { return document.getElementById(this.stripeMountId); }

  /**
   * Mount Point Element id
   * @type {String}
   * @protected
   */
  stripeMountId;

  /* LIFECYCLE */

  /** @inheritdoc */
  connectedCallback() {
    super.connectedCallback();
    applyCustomCss();
  }

  /** @inheritdoc */
  firstUpdated() {
    this.resetMount();
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

  /* PUBLIC API */

  /**
   * Checks for potential validity. A potentially valid form is one that is not empty, not complete and has no error. A validated form also counts as potentially valid.
   * @return {Boolean} true if the Stripe form is potentially valid
   */
  isPotentiallyValid() {
    return (!this.isComplete && !this.isEmpty && !this.hasError) || this.validate();
  }

  /**
   * Resets the Stripe card.
   */
  reset() {
    super.reset();
    this.element && this.element.clear();
  }

  /**
   * Checks if the Stripe form is valid.
   * @return {Boolean} true if the Stripe form is valid
   */
  validate() {
    const { isComplete, isEmpty, hasError } = this;
    const isValid = !hasError && isComplete && !isEmpty;
    const error = new Error(`Credit card information is ${isEmpty ? 'empty' : 'incomplete'}.`);
    if (!isValid && !hasError) this.set({ error });
    return isValid;
  }

  /* PRIVATE METHODS */

  /**
   * Returns a Stripe-friendly style object computed from CSS custom properties
   * @return {Object} Stripe Style initialization object.
   * @private
   */
  getStripeElementsStyles() {
    const computedStyle = window.ShadyCSS ? null : getComputedStyle(this);
    return allowedStyles.reduce((acc, camelCase) => {
      const dashCase = dash(camelCase);
      Object.keys(acc).forEach(prefix => {
        const customProperty = `--stripe-elements-${prefix}-${dashCase}`;
        const propertyValue =
          computedStyle ? computedStyle.getPropertyValue(customProperty)
          : ShadyCSS.getComputedStyleValue(this, customProperty);
        acc[prefix][camelCase] = propertyValue || undefined;
      });
      return acc;
    }, { base: {}, complete: {}, empty: {}, invalid: {} });
  }

  /**
   * Reinitializes Stripe and mounts the card.
   * @private
   */
  async init() {
    this.resetMount();
    await this.unmount();
    await this.initStripe();
    await this.mount();
  }

  /** @private */
  initMountPoint() {
    this.stripeMountId = generateRandomMountElementId();
    if (window.ShadyDOM) this.initShadyDOMMount();
    else this.initShadowDOMMounts();
  }

  /**
   * Prepares to mount Stripe Elements in light DOM.
   * @private
   */
  initShadowDOMMounts() {
    // trace each shadow boundary between us and the document
    let host = this;
    this.shadowHosts = [this];
    while (host = host.getRootNode().host) this.shadowHosts.push(host); // eslint-disable-line prefer-destructuring, no-loops/no-loops

    const { shadowHosts, stripeMountId: id, action, label, token } = this;

    // Prepare the shallowest breadcrumb slot at document level
    const hosts = [...shadowHosts];
    const root = hosts.pop();
    if (!root.querySelector('[slot="stripe-card"]')) {
      const div = document.createElement('div');
      div.slot = 'stripe-card';
      root.appendChild(div);
    }
    const container = root.querySelector('[slot="stripe-card"]');

    // hedge against shenanigans
    const isDomCorrupt = container.querySelector('form') && !container.querySelector(`#${this.stripeMountId}`);
    const renderTemplate = isDomCorrupt ? render : appendTemplate;

    // Render the form to the document, so that Stripe.js can mount
    renderTemplate(stripeCardTemplate({ action, id, token, label }), container);

    // Append breadcrumb slots to each shadowroot in turn,
    // from the document down to the <stripe-elements> instance.
    hosts.forEach(appendTemplate(slotTemplate));
  }

  /**
   * Creates a mounting div for the shady dom stripe elements container
   * @private
   */
  initShadyDOMMount() {
    const { action, token, label } = this;
    const id = this.stripeMountId;
    const mountTemplate = stripeCardTemplate({ action, id, label, token });
    appendTemplate(mountTemplate, this);
  }

  /**
   * Creates and mounts Stripe Elements card.
   * @private
   */
  async mount() {
    if (!this.stripe) return;
    const { hidePostalCode, hideIcon, iconStyle, value } = this;
    const style = this.getStripeElementsStyles();

    const element = this.elements
      .create('card', { hideIcon, hidePostalCode, iconStyle, style, value });

    await this.set({ element, card: element });

    element.mount(this.stripeMount);
    element.addEventListener('ready', this.onReady);
    element.addEventListener('change', this.onChange);

    await this.set({ isComplete: false, isEmpty: true });
  }

  /**
   * Sets the error.
   * @param  {StripeChangeEvent}         event
   * @param  {Boolean}       event.empty     true if value is empty
   * @param  {Boolean}       event.complete  true if value is well-formed and potentially complete.
   * @param  {String}        event.brand     brand of the card being entered e.g. 'visa' or 'amex'
   * @param  {Object}        event.error     The current validation error, if any.
   * @param  {String|Object} event.value     Value of the form. Only non-sensitive information e.g. postalCode is present.
   * @private
   */
  @bound async onChange(event) {
    const { brand, complete: isComplete, empty: isEmpty, error = null } = event;
    await this.set({ error, brand, isComplete, isEmpty });
    this.fire('stripe-change', event);
  }

  /**
   * Sets the stripeReady property when the stripe element is ready to receive focus.
   * @param  {Event} event
   * @private
   */
  @bound async onReady(event) {
    await this.set({ stripeReady: true });
    this.fire('stripe-ready', event);
  }

  /** @private */
  removeStripeMounts() {
    this.shadowHosts.forEach(removeAllMounts);
    if (this.stripeMount) this.stripeMount.remove();
  }

  /** @private */
  resetMount() {
    this.removeStripeMounts();
    this.initMountPoint();
  }

  /**
   * Unmounts and nullifies the card.
   * @private
   */
  async unmount() {
    this.element?.unmount();
    await this.set({ card: null, element: null, stripeReady: false });
  }
}
