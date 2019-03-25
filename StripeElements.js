import { classPrivateFieldLooseBase as _classPrivateFieldLooseBase, classPrivateFieldLooseKey as _classPrivateFieldLooseKey } from './_virtual/_rollupPluginBabelHelpers.js';
import { html, css, LitElement } from 'lit-element';
import { render } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';

const bubbles = true;
const composed = true;

const removeEl = el => el.remove();

const removeAllMounts = host => host.querySelectorAll('[slot="stripe-card" name="stripe-card"]').forEach(removeEl);

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

const stripeCardTemplate = ({
  action,
  id,
  token
}) => html`
<div slot="stripe-card">
  <form action="${ifDefined(action || undefined)}" method="post">
    <div id="${id}" aria-label="Credit or Debit Card"></div>
    <input type="hidden" name="stripeToken" value="${ifDefined(token || undefined)}">
  </form>
</div>
`;

const allowedStyles = ['color', 'fontFamily', 'fontSize', 'fontStyle', 'fontSmoothing', 'fontVariant', 'iconColor', 'lineHeight', 'letterSpacing', 'textDecoration', 'textShadow', 'textTransform'];

function appendTemplate(template, target) {
  const tmp = document.createElement('div');
  render(template, tmp);
  const appendedDom = tmp.firstElementChild;
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
  return `stripe-elements-mount-point-${([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))}`;
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


class StripeElements extends LitElement {
  get brand() {
    return _classPrivateFieldLooseBase(this, _brand)[_brand];
  }

  set brand(_) {}

  get card() {
    return _classPrivateFieldLooseBase(this, _card)[_card];
  }

  set card(_) {}

  get error() {
    return _classPrivateFieldLooseBase(this, _error)[_error];
  }

  set error(_) {}

  get hasError() {
    return _classPrivateFieldLooseBase(this, _hasError)[_hasError];
  }

  set hasError(_) {}

  get isComplete() {
    return _classPrivateFieldLooseBase(this, _isComplete)[_isComplete];
  }

  set isComplete(_) {}

  get isEmpty() {
    return _classPrivateFieldLooseBase(this, _isEmpty)[_isEmpty];
  }

  set isEmpty(_) {}

  get stripeReady() {
    return _classPrivateFieldLooseBase(this, _stripeReady)[_stripeReady];
  }

  set stripeReady(_) {}

  get token() {
    return _classPrivateFieldLooseBase(this, _token)[_token];
  }

  set token(_) {}
  /**
   * Mount Point Element id
   * @type {String}
   */


  get stripe() {
    return _classPrivateFieldLooseBase(this, _stripe)[_stripe];
  }

  set stripe(_) {}

  get elements() {
    return _classPrivateFieldLooseBase(this, _elements)[_elements];
  }

  set elements(_) {}
  /** The form element */


  /** LIFECYCLE */

  /** @inheritdoc */
  constructor() {
    super();
    Object.defineProperty(this, _setToken, {
      value: _setToken2
    });
    Object.defineProperty(this, _setStripReady, {
      value: _setStripReady2
    });
    Object.defineProperty(this, _setIsEmpty, {
      value: _setIsEmpty2
    });
    Object.defineProperty(this, _setIsComplete, {
      value: _setIsComplete2
    });
    Object.defineProperty(this, _setError, {
      value: _setError2
    });
    Object.defineProperty(this, _setCard, {
      value: _setCard2
    });
    Object.defineProperty(this, _setBrand, {
      value: _setBrand2
    });
    Object.defineProperty(this, _unmountCard, {
      value: _unmountCard2
    });
    Object.defineProperty(this, _publishableKeyChanged, {
      value: _publishableKeyChanged2
    });
    Object.defineProperty(this, _onReady, {
      value: _onReady2
    });
    Object.defineProperty(this, _onChange, {
      value: _onChange2
    });
    Object.defineProperty(this, _mountCard, {
      value: _mountCard2
    });
    Object.defineProperty(this, _initStripe, {
      value: _initStripe2
    });
    Object.defineProperty(this, _initShadyDomMount, {
      value: _initShadyDomMount2
    });
    Object.defineProperty(this, _initShadowDomMounts, {
      value: _initShadowDomMounts2
    });
    Object.defineProperty(this, _initMountPoints, {
      value: _initMountPoints2
    });
    Object.defineProperty(this, _handleResponse, {
      value: _handleResponse2
    });
    Object.defineProperty(this, _handleError, {
      value: _handleError2
    });
    Object.defineProperty(this, _getStripeElementsStyles, {
      value: _getStripeElementsStyles2
    });
    Object.defineProperty(this, _fireError, {
      value: _fireError2
    });
    Object.defineProperty(this, _fire, {
      value: _fire2
    });
    Object.defineProperty(this, _root, {
      get: _get_root
    });
    Object.defineProperty(this, _brand, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _card, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _error, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _hasError, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _isComplete, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _isEmpty, {
      writable: true,
      value: true
    });
    Object.defineProperty(this, _stripeReady, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _token, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _mountElementId, {
      writable: true,
      value: generateRandomMountElementId()
    });
    Object.defineProperty(this, _shadowHosts, {
      writable: true,
      value: []
    });
    Object.defineProperty(this, _shadyDomMount, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _stripe, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _elements, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _form, {
      writable: true,
      value: null
    });
    this.action = '';
    this.hideIcon = false;
    this.hidePostalCode = false;
    this.iconStyle = 'default';
    this.value = {};
  }
  /** @inheritdoc */


  connectedCallback() {
    super.connectedCallback();

    _classPrivateFieldLooseBase(this, _fire)[_fire]('is-complete-changed', this.isComplete);

    _classPrivateFieldLooseBase(this, _fire)[_fire]('is-empty-changed', this.isEmpty);

    _classPrivateFieldLooseBase(this, _fire)[_fire]('has-error-changed', this.hasError);

    _classPrivateFieldLooseBase(this, _fire)[_fire]('brand-changed', this.brand);

    _classPrivateFieldLooseBase(this, _fire)[_fire]('card-changed', this.card);

    _classPrivateFieldLooseBase(this, _fire)[_fire]('error-changed', this.error);

    _classPrivateFieldLooseBase(this, _fire)[_fire]('publishable-key-changed', this.publishableKey);

    _classPrivateFieldLooseBase(this, _fire)[_fire]('stripe-ready-changed', this.stripeReady);

    _classPrivateFieldLooseBase(this, _fire)[_fire]('token-changed', this.token);

    if (!document.getElementById('stripe-elements-custom-css-properties')) {
      appendTemplate(stripeElementsCustomCssProperties, document.head);
    }
  }
  /** @inheritdoc */


  firstUpdated() {
    _classPrivateFieldLooseBase(this, _initMountPoints)[_initMountPoints]();

    _classPrivateFieldLooseBase(this, _form)[_form] = _classPrivateFieldLooseBase(this, _root)[_root].querySelector('form');
  }
  /** @inheritdoc */


  updated(changed) {
    if (changed.has('isComplete')) _classPrivateFieldLooseBase(this, _fire)[_fire]('is-complete-changed', this.isComplete);
    if (changed.has('isEmpty')) _classPrivateFieldLooseBase(this, _fire)[_fire]('is-empty-changed', this.isEmpty);
    if (changed.has('hasError')) _classPrivateFieldLooseBase(this, _fire)[_fire]('has-error-changed', this.hasError);
    if (changed.has('brand')) _classPrivateFieldLooseBase(this, _fire)[_fire]('brand-changed', this.brand);
    if (changed.has('card')) _classPrivateFieldLooseBase(this, _fire)[_fire]('card-changed', this.card);
    if (changed.has('stripeReady')) _classPrivateFieldLooseBase(this, _fire)[_fire]('stripe-ready-changed', this.stripeReady);

    if (changed.has('publishableKey')) {
      _classPrivateFieldLooseBase(this, _fire)[_fire]('publishable-key-changed', this.publishableKey);

      _classPrivateFieldLooseBase(this, _publishableKeyChanged)[_publishableKeyChanged](this.publishableKey);
    }

    if (changed.has('token')) {
      const {
        token
      } = this;

      _classPrivateFieldLooseBase(this, _fire)[_fire]('token-changed', token);

      this.dispatchEvent(new CustomEvent('stripe-token', {
        bubbles,
        composed,
        detail: token
      }));
    }

    if (changed.has('error')) {
      _classPrivateFieldLooseBase(this, _fire)[_fire]('error-changed', this.error);

      _classPrivateFieldLooseBase(this, _fireError)[_fireError](this.error);
    }
  }
  /** @inheritdoc */


  render() {
    const {
      error
    } = this;
    const {
      message: errorMessage = ''
    } = error || {};
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
    return !this.isComplete && !this.isEmpty && !this.hasError || this.validate();
  }
  /** Resets the Stripe card. */


  reset() {
    if (this.card && typeof this.card.clear === 'function') this.card.clear();

    _classPrivateFieldLooseBase(this, _setError)[_setError](null);
  }
  /**
   * Submit credit card information to generate a token
   */


  submit() {
    if (!this.stripe) throw new Error('Cannot submit before initializing Stripe');
    if (!this.isComplete) return;
    this.stripe.createToken(_classPrivateFieldLooseBase(this, _card)[_card], this.cardData).then(_classPrivateFieldLooseBase(this, _handleResponse)[_handleResponse].bind(this)).catch(_classPrivateFieldLooseBase(this, _handleError)[_handleError].bind(this));
  }
  /**
   * Checks if the Stripe form is valid.
   * @return {Boolean} true if the Stripe form is valid
   */


  validate() {
    const {
      isComplete,
      isEmpty,
      hasError,
      error
    } = this;
    const isValid = !hasError && isComplete && !isEmpty;

    if (!isValid && !hasError) {
      _classPrivateFieldLooseBase(this, _setError)[_setError](isEmpty ? 'Credit Card information is empty.' : 'Credit card information is incomplete.');
    }

    return isValid;
  }
  /** PRIVATE METHODS */

  /** Fires an event with a polymer-style changed event */


}

var _brand = _classPrivateFieldLooseKey("brand");

var _card = _classPrivateFieldLooseKey("card");

var _error = _classPrivateFieldLooseKey("error");

var _hasError = _classPrivateFieldLooseKey("hasError");

var _isComplete = _classPrivateFieldLooseKey("isComplete");

var _isEmpty = _classPrivateFieldLooseKey("isEmpty");

var _stripeReady = _classPrivateFieldLooseKey("stripeReady");

var _token = _classPrivateFieldLooseKey("token");

var _mountElementId = _classPrivateFieldLooseKey("mountElementId");

var _shadowHosts = _classPrivateFieldLooseKey("shadowHosts");

var _shadyDomMount = _classPrivateFieldLooseKey("shadyDomMount");

var _stripe = _classPrivateFieldLooseKey("stripe");

var _elements = _classPrivateFieldLooseKey("elements");

var _form = _classPrivateFieldLooseKey("form");

var _root = _classPrivateFieldLooseKey("root");

var _fire = _classPrivateFieldLooseKey("fire");

var _fireError = _classPrivateFieldLooseKey("fireError");

var _getStripeElementsStyles = _classPrivateFieldLooseKey("getStripeElementsStyles");

var _handleError = _classPrivateFieldLooseKey("handleError");

var _handleResponse = _classPrivateFieldLooseKey("handleResponse");

var _initMountPoints = _classPrivateFieldLooseKey("initMountPoints");

var _initShadowDomMounts = _classPrivateFieldLooseKey("initShadowDomMounts");

var _initShadyDomMount = _classPrivateFieldLooseKey("initShadyDomMount");

var _initStripe = _classPrivateFieldLooseKey("initStripe");

var _mountCard = _classPrivateFieldLooseKey("mountCard");

var _onChange = _classPrivateFieldLooseKey("onChange");

var _onReady = _classPrivateFieldLooseKey("onReady");

var _publishableKeyChanged = _classPrivateFieldLooseKey("publishableKeyChanged");

var _unmountCard = _classPrivateFieldLooseKey("unmountCard");

var _setBrand = _classPrivateFieldLooseKey("setBrand");

var _setCard = _classPrivateFieldLooseKey("setCard");

var _setError = _classPrivateFieldLooseKey("setError");

var _setIsComplete = _classPrivateFieldLooseKey("setIsComplete");

var _setIsEmpty = _classPrivateFieldLooseKey("setIsEmpty");

var _setStripReady = _classPrivateFieldLooseKey("setStripReady");

var _setToken = _classPrivateFieldLooseKey("setToken");

StripeElements.is = 'stripe-elements';
StripeElements.properties = {
  /**
   * The URL to the morm action. Example '/charges'.
   * If blank or undefined will not submit charges immediately.
   */
  action: {
    type: String
  },

  /**
   * The card brand detected by Stripe
   * @type {String}
   * @readonly
   */
  brand: {
    type: String
  },

  /**
   * Reference to the Stripe card.
   * @type {Object}
   * @readonly
   */
  card: {
    type: Object
  },

  /**
   * Card billing info to be passed to createToken() (optional)
   * https://stripe.com/docs/stripe-js/reference#stripe-create-token
   * @type {Object}
   */
  cardData: {
    type: Object
  },

  /**
   * Error message from Stripe.
   * @type {String}
   * @readonly
   */
  error: {
    type: String
  },

  /**
   * If the form has an error.
   * @type {Boolean}
   * @readonly
   */
  hasError: {
    type: Boolean,
    attribute: 'has-error',
    reflect: true
  },

  /**
   * If the form is complete.
   * @type {Boolean}
   * @readonly
   */
  isComplete: {
    type: Boolean,
    attribute: 'is-complete',
    reflect: true
  },

  /**
   * If the form is empty.
   * @type {Boolean}
   * @readonly
   */
  isEmpty: {
    type: Boolean,
    attribute: 'is-empty',
    reflect: true
  },

  /**
   * Whether to hide icons in the Stripe form.
   * @type {Boolean}
   */
  hideIcon: {
    type: Boolean,
    attribute: 'hide-icon'
  },

  /**
   * Whether or not to hide the postal code field.
   * Useful when you gather shipping info elsewhere.
   * @type {Boolean}
   */
  hidePostalCode: {
    type: Boolean,
    attribute: 'hide-postal-code'
  },

  /**
   * Stripe icon style. 'solid' or 'default'.
   * @type {'solid'|'default'}
   */
  iconStyle: {
    type: String,
    attribute: 'icon-style'
  },

  /**
   * Stripe Publishable Key. EG. pk_test_XXXXXXXXXXXXXXXXXXXXXXXX
   * @type {String}
   */
  publishableKey: {
    type: String,
    attribute: 'publishable-key'
  },

  /**
   * True when the stripe element is ready to receive focus.
   * @type {Boolean}
   * @readonly
   */
  stripeReady: {
    type: Boolean,
    attribute: 'stripe-ready',
    reflect: true
  },

  /**
   * Stripe token
   * @type {Object}
   * @readonly
   */
  token: {
    type: Object
  },

  /**
   * Prefilled values for form. Example {postalCode: '90210'}
   * @type {Object}
   */
  value: {
    type: Object
  },

  /**
   * Stripe instance
   * @type {Object}
   * @readonly
   */
  stripe: {
    type: Object
  },

  /**
   * Stripe Elements instance
   * @type {Object}
   * @readonly
   */
  elements: {
    type: Object
  }
};

var _get_root = function () {
  return window.ShadyDOM ? this.shadowRoot : document;
};

StripeElements.styles = [style];

var _fire2 = function _fire2(type, value) {
  const detail = value ? {
    value
  } : undefined;
  this.dispatchEvent(new CustomEvent(type, {
    bubbles,
    composed,
    detail
  }));
};

var _fireError2 = function _fireError2(error) {
  this.dispatchEvent(new ErrorEvent('stripe-error', {
    bubbles,
    composed,
    error
  }));
};

var _getStripeElementsStyles2 = function _getStripeElementsStyles2() {
  const retVal = {
    base: {},
    complete: {},
    empty: {},
    invalid: {}
  };
  allowedStyles.forEach(style => {
    const dash = style.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`);
    ['base', 'complete', 'empty', 'invalid'].forEach(prefix => {
      retVal[prefix][style] = window.ShadyCSS ? ShadyCSS.getComputedStyleValue(this, `--stripe-elements-${prefix}-${dash}`) : getComputedStyle(this).getPropertyValue(`--stripe-elements-${prefix}-${dash}`);
    });
  });
  return retVal;
};

var _handleError2 = function _handleError2(error) {
  _classPrivateFieldLooseBase(this, _setError)[_setError](error.message);
};

var _handleResponse2 = function _handleResponse2(response) {
  if (response.error) return _classPrivateFieldLooseBase(this, _setError)[_setError](response.error);

  _classPrivateFieldLooseBase(this, _setToken)[_setToken](response.token); // Submit the form


  if (this.action) _classPrivateFieldLooseBase(this, _form)[_form].submit();
};

var _initMountPoints2 = function _initMountPoints2() {
  if (!!window.ShadyDOM) _classPrivateFieldLooseBase(this, _initShadyDomMount)[_initShadyDomMount]();else _classPrivateFieldLooseBase(this, _initShadowDomMounts)[_initShadowDomMounts]();
};

var _initShadowDomMounts2 = function _initShadowDomMounts2() {
  // trace each shadow boundary between us and the document
  let host = this;
  _classPrivateFieldLooseBase(this, _shadowHosts)[_shadowHosts] = [this]; // eslint-disable-next-line no-loops/no-loops

  while (host = host.getRootNode().host) _classPrivateFieldLooseBase(this, _shadowHosts)[_shadowHosts].push(host); // append mount point to first shadow host under document (as light child)
  // and slot breadcrumbs to each shadowroot in turn, until our shadow host.


  const {
    action,
    token
  } = this;

  const id = _classPrivateFieldLooseBase(this, _mountElementId)[_mountElementId];

  const mountTemplate = stripeCardTemplate({
    action,
    id,
    token
  });
  const slotTemplate = html`<slot slot="stripe-card" name="stripe-card"></slot>`;
  appendTemplate(mountTemplate, _classPrivateFieldLooseBase(this, _shadowHosts)[_shadowHosts].pop());

  _classPrivateFieldLooseBase(this, _shadowHosts)[_shadowHosts].forEach(host => appendTemplate(slotTemplate, host));
};

var _initShadyDomMount2 = function _initShadyDomMount2() {
  if (_classPrivateFieldLooseBase(this, _shadyDomMount)[_shadyDomMount]) return;
  const {
    action,
    token
  } = this;

  const id = _classPrivateFieldLooseBase(this, _mountElementId)[_mountElementId];

  const mountTemplate = stripeCardTemplate({
    action,
    id,
    token
  });
  _classPrivateFieldLooseBase(this, _shadyDomMount)[_shadyDomMount] = appendTemplate(mountTemplate, this);
};

var _initStripe2 = function _initStripe2() {
  const oldStripe = _classPrivateFieldLooseBase(this, _stripe)[_stripe];

  const oldElements = _classPrivateFieldLooseBase(this, _elements)[_elements];

  if (_classPrivateFieldLooseBase(this, _stripe)[_stripe]) _classPrivateFieldLooseBase(this, _stripe)[_stripe] = null;

  if (!window.Stripe) {
    const message = `<stripe-elements> requires Stripe.js to be loaded first.`;

    _classPrivateFieldLooseBase(this, _setError)[_setError]({
      message
    }); // eslint-disable-next-line no-console


    console.warn(message);
  } else if (this.publishableKey) {
    _classPrivateFieldLooseBase(this, _stripe)[_stripe] = Stripe(this.publishableKey);
    _classPrivateFieldLooseBase(this, _elements)[_elements] = _classPrivateFieldLooseBase(this, _stripe)[_stripe].elements();
  } else {
    _classPrivateFieldLooseBase(this, _elements)[_elements] = null;
  }

  this.requestUpdate('stripe', oldStripe);
  this.requestUpdate('elements', oldElements);
};

var _mountCard2 = function _mountCard2() {
  const mount = _classPrivateFieldLooseBase(this, _root)[_root].getElementById(_classPrivateFieldLooseBase(this, _mountElementId)[_mountElementId]);

  if (!mount) {
    _classPrivateFieldLooseBase(this, _unmountCard)[_unmountCard]();

    _classPrivateFieldLooseBase(this, _initMountPoints)[_initMountPoints]();
  }

  const {
    hidePostalCode,
    hideIcon,
    iconStyle,
    value
  } = this;

  const style = _classPrivateFieldLooseBase(this, _getStripeElementsStyles)[_getStripeElementsStyles]();

  _classPrivateFieldLooseBase(this, _setCard)[_setCard](_classPrivateFieldLooseBase(this, _elements)[_elements].create('card', {
    hideIcon,
    hidePostalCode,
    iconStyle,
    style,
    value
  }));

  _classPrivateFieldLooseBase(this, _card)[_card].mount(mount);

  _classPrivateFieldLooseBase(this, _card)[_card].addEventListener('ready', _classPrivateFieldLooseBase(this, _onReady)[_onReady].bind(this));

  _classPrivateFieldLooseBase(this, _card)[_card].addEventListener('change', _classPrivateFieldLooseBase(this, _onChange)[_onChange].bind(this));
};

var _onChange2 = function _onChange2(event) {
  const {
    empty,
    complete,
    brand,
    error,
    value
  } = event;

  _classPrivateFieldLooseBase(this, _setError)[_setError](error);

  _classPrivateFieldLooseBase(this, _setBrand)[_setBrand](brand);

  _classPrivateFieldLooseBase(this, _setIsComplete)[_setIsComplete](complete);

  _classPrivateFieldLooseBase(this, _setIsEmpty)[_setIsEmpty](empty);
};

var _onReady2 = function _onReady2(event) {
  _classPrivateFieldLooseBase(this, _setStripReady)[_setStripReady](true);

  _classPrivateFieldLooseBase(this, _fire)[_fire]('stripe-ready');
};

var _publishableKeyChanged2 = function _publishableKeyChanged2(publishableKey) {
  _classPrivateFieldLooseBase(this, _unmountCard)[_unmountCard]();

  _classPrivateFieldLooseBase(this, _initStripe)[_initStripe]();

  if (publishableKey && this.stripe) _classPrivateFieldLooseBase(this, _mountCard)[_mountCard]();
};

var _unmountCard2 = function _unmountCard2() {
  if (window.ShadyDOM) _classPrivateFieldLooseBase(this, _shadyDomMount)[_shadyDomMount].remove();else _classPrivateFieldLooseBase(this, _shadowHosts)[_shadowHosts].forEach(removeAllMounts);
  if (this.card) this.card.unmount();

  _classPrivateFieldLooseBase(this, _setCard)[_setCard](null);

  _classPrivateFieldLooseBase(this, _setStripReady)[_setStripReady](false);
};

var _setBrand2 = function _setBrand2(newVal) {
  const oldBrand = _classPrivateFieldLooseBase(this, _brand)[_brand];

  _classPrivateFieldLooseBase(this, _brand)[_brand] = newVal;
  this.requestUpdate('brand', oldBrand);
};

var _setCard2 = function _setCard2(newVal) {
  const oldCard = _classPrivateFieldLooseBase(this, _card)[_card];

  _classPrivateFieldLooseBase(this, _card)[_card] = newVal;
  this.requestUpdate('card', oldCard);
};

var _setError2 = function _setError2(newVal) {
  const oldError = _classPrivateFieldLooseBase(this, _error)[_error];

  _classPrivateFieldLooseBase(this, _error)[_error] = newVal;
  this.requestUpdate('error', oldError);

  const oldHasError = _classPrivateFieldLooseBase(this, _hasError)[_hasError];

  _classPrivateFieldLooseBase(this, _hasError)[_hasError] = !!newVal;
  this.requestUpdate('hasError', oldHasError);
};

var _setIsComplete2 = function _setIsComplete2(newVal) {
  const oldIsComplete = _classPrivateFieldLooseBase(this, _isComplete)[_isComplete];

  _classPrivateFieldLooseBase(this, _isComplete)[_isComplete] = newVal;
  this.requestUpdate('isComplete', oldIsComplete);
};

var _setIsEmpty2 = function _setIsEmpty2(newVal) {
  const oldIsEmpty = _classPrivateFieldLooseBase(this, _isEmpty)[_isEmpty];

  _classPrivateFieldLooseBase(this, _isEmpty)[_isEmpty] = newVal;
  this.requestUpdate('isEmpty', oldIsEmpty);
};

var _setStripReady2 = function _setStripReady2(newVal) {
  const oldStripeReady = _classPrivateFieldLooseBase(this, _stripeReady)[_stripeReady];

  _classPrivateFieldLooseBase(this, _stripeReady)[_stripeReady] = newVal;
  this.requestUpdate('stripeReady', oldStripeReady);
};

var _setToken2 = function _setToken2(newVal) {
  const oldToken = _classPrivateFieldLooseBase(this, _token)[_token];

  _classPrivateFieldLooseBase(this, _token)[_token] = newVal;
  this.requestUpdate('token', oldToken);
};

export { StripeElements };
