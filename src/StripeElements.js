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
 * Custom element wrapper for Stripe.js v3 Elements. Creates a `card` element à la https://stripe.com/docs/elements
 *
 * 👨‍🎨 [Storybook Demo](https://bennypowers.dev/stripe-elements) 👀
 *
 * [![made with open-wc](https://img.shields.io/badge/made%20with-open--wc-%23217ff9)](https://open-wc.org)
 * [![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bennypowers/stripe-elements)
 * [![Published on npm](https://img.shields.io/npm/v/@power-elements/stripe-elements.svg)](https://www.npmjs.com/package/@power-elements/stripe-elements)
 * [![Maintainability](https://api.codeclimate.com/v1/badges/b2205a301b0a8bb82d51/maintainability)](https://codeclimate.com/github/bennypowers/stripe-elements/maintainability)
 * [![Test Coverage](https://api.codeclimate.com/v1/badges/b2205a301b0a8bb82d51/test_coverage)](https://codeclimate.com/github/bennypowers/stripe-elements/test_coverage)
 * [![Release](https://github.com/bennypowers/stripe-elements/workflows/Release/badge.svg)](https://github.com/bennypowers/stripe-elements/actions?query=workflow%3ARelease)
 * [![Contact me on Codementor](https://cdn.codementor.io/badges/contact_me_github.svg)](https://www.codementor.io/bennyp?utm_source=github&utm_medium=button&utm_term=bennyp&utm_campaign=github)
 *
 *  ## Installation and Usage
 *
 *  You should make sure to load stripe.js on your app's index.html, as per Stripe's recommendation, before loading `<stripe-elements>`. If `window.Stripe` is not available when you load up the component, it will fail with a reasonably-polite console warning.
 *
 *  ```html
 *  <script src="https://js.stripe.com/v3/"></script>
 *  ```
 *
 *  ```
 *  npm i -S @power-elements/stripe-elements
 *  ```
 *
 *  To pre-build, use `@pika/web` and reference the module at `/web_modules/@powers-elements/stripe-elements/stripe-elements.js`;
 *
 *  ```
 *  npx @pika/web
 *  ```
 *
 *  ```html
 *  <script type="module" src="/web_modules/@power-elements/stripe-elements/stripe-elements.js"></script>
 *  ```
 *
 *  Or load the module from the unpkg CDN
 *  ```html
 *  <script type="module" src="https://unpkg.com/@power-elements/stripe-elements/stripe-elements.js?module"></script>
 *  ```
 *
 * Then you can add the element to your page.
 *
 * ```html
 * <script type="module" src="https://unpkg.com/@power-elements/stripe-elements/stripe-elements.js?module"></script>
 * <script type="module" src="https://unpkg.com/@power-elements/json-viewer/json-viewer.js?module"></script>
 *
 * <stripe-elements id="stripe"
 *     action="/payment"
 *     publishable-key="pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"
 * ></stripe-elements>
 *
 * <button id="submit" disabled>Submit</button>
 * <json-viewer id="json"></json-viewer>
 *
 * <script>
 *   const handleAsJson = response => response.json();
 *   const viewJson = object => json.object = object;
 *   const viewer = document.getElementById('json');
 *   const stripe = document.getElementById('stripe');
 *   const submit = document.getElementById('button');
 *
 *   submit.addEventListener('click', onClickSubmit);
 *   stripe.addEventListener('stripe-source', onStripeSource);
 *   stripe.addEventListener('change', onChange);
 *
 *   function onClickSubmit() {
 *     stripe.createSource();
 *   }
 *
 *   function onChange({ target }) {
 *     button.disabled = !target.validate();
 *   }
 *
 *   function onStripeSource({ target: { source } }) {
 *     const method = 'POST';
 *     const body = JSON.stringify(source);
 *     const headers = { 'Content-Type': 'application/json' };
 *     fetch('/payments', { method, body, headers })
 *       .then(handleAsJson)
 *       .then(viewJson)
 *       .catch(viewJson);
 *   }
 * </script>
 * ```
 *
 * In a lit-html template
 *
 * ```js
 * import { html, render } from '/web_modules/lit-html/lit-html.js';
 * import { PUBLISHABLE_KEY } from './config.js';
 * import '/web_modules/@power-elements/stripe-elements/stripe-elements.js';
 *
 * const onChange = ({ target: { isComplete, hasError } }) => {
 *   document.body.querySelector('button').disabled = !(isComplete && !hasError)
 * }
 *
 * const onClick = () => document.getElementById('stripe').createSource();
 *
 * const template = html`
 *   <button disabled @click="${onClick}">Get Token</button>
 *   <stripe-elements id="stripe" @stripe-change="${onChange}"
 *       publishable-key="${PUBLISHABLE_KEY}"
 *       action="/payment"
 *   ></stripe-elements>
 * `
 * render(template, document.body)
 * ```
 *
 * In a Polymer Template
 *
 * ```html
 * <paper-input label="Stripe Publishable Key" value="{{key}}"></paper-input>
 *
 * <stripe-elements id="stripe"
 *     stripe-ready="{{ready}}"
 *     publishable-key="[[key]]"
 *     token="{{token}}"
 * ></stripe-elements>
 *
 * <paper-button id="submit"
 *     disabled="[[!ready]]"
 *     onclick="stripe.createSource()">
 *   Get Token
 * </paper-button>
 *
 * <paper-toast
 *     opened="[[token]]"
 *     text="Token received for 💳 [[token.card.last4]]! 🤑"
 * ></paper-toast>
 * ```
 *
 * ## Styling
 *
 * A word about nomenclature before we list custom properties and mixins. Stripe v3
 * Introduces 'Stripe Elements'. These are not custom elements, but rather forms
 * hosted by stripe and injected into your page via an iFrame. When we refer to the
 * 'Stripe Element' in this document, we are referring to the hosted Stripe form,
 * not the `<stripe-element>` custom element. But when I mentions the 'element', I mean the custom element.
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
 * ---
 *
 * `<stripe-elements>` is a community project, not endorsed or affiliated with Stripe.
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
  @property({ type: String, notify: true })
  get brand() { return this.__brand; }

  /**
   * The Stripe card object.
   * @type {stripe.Element}
   * @readonly
   */
  @property({ type: Object, notify: true })
  get card() { return this.__card; }

  /**
   * If the form is complete.
   * @type {Boolean}
   */
  @property({ type: Boolean, attribute: 'is-complete', reflect: true, notify: true })
  get isComplete() { return this.__isComplete; }

  /**
   * If the form is empty.
   * @type {Boolean}
   */
  @property({ type: Boolean, attribute: 'is-empty', reflect: true, notify: true })
  get isEmpty() { return this.__isEmpty; }

  /**
   * If the stripe element is ready to receive focus.
   * @type {Boolean}
   */
  @property({ type: Boolean, attribute: 'stripe-ready', reflect: true, notify: true })
  get stripeReady() { return this.__stripeReady; }

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

  /** @type {stripe.brandType} */
  __brand = null;

  /** @type {stripe.elements.Element} */
  __card = null;

  __isComplete = false;

  __isEmpty = true;

  __stripeReady = false;

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
    this.card && this.card.clear();
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
   * @inheritdoc
   */
  async init() {
    this.resetMount();
    if (this.card) await this.unmountCard();
    await this.initStripe();
    await this.mountCard();
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
      const element = document.createElement('div');
      element.slot = 'stripe-card';
      root.appendChild(element);
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
  async mountCard() {
    if (!this.stripe) return;
    const { hidePostalCode, hideIcon, iconStyle, value } = this;
    const style = this.getStripeElementsStyles();

    const card = this.elements
      .create('card', { hideIcon, hidePostalCode, iconStyle, style, value });

    await this.set({ card });
    this.card.mount(this.stripeMount);
    this.card.addEventListener('ready', this.onReady);
    this.card.addEventListener('change', this.onChange);
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
  async unmountCard() {
    this.card?.unmount();
    await this.set({ card: null, stripeReady: false });
  }
}
