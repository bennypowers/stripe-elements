var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// src/stripe-elements.ts
import { property as property2, customElement } from "lit/decorators.js";
import { bound as bound2 } from "./lib/bound.js";

// src/StripeBase.ts
import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { bound } from "./lib/bound.js";
import { dash } from "./lib/strings.js";
import { isRepresentation } from "./lib/predicates.js";
import { throwBadResponse } from "./lib/fetch.js";

// src/breadcrumb-controller.ts
function getRandom() {
  return (Date.now() + Math.random() * 1e3).toString(36).substr(0, 8);
}
var BreadcrumbController = class {
  constructor(host, options) {
    this.host = host;
    this.options = options;
    this.initialized = false;
    this.shadowHosts = [];
    this.host.addController(this);
    this.resetMountId();
    this.slotName = this.options?.slotName ?? `breadcrumb-${getRandom()}`;
  }
  get mount() {
    return document.getElementById(this.mountId);
  }
  hostUpdated() {
    if (!this.initialized && this.options.autoInitialize !== false)
      this.init();
  }
  hostDisconnected() {
    this.destroyMountPoints();
  }
  resetMountId() {
    const prefix = this.options.mountPrefix ?? this.host.localName;
    this.mountId = `${prefix}-mount-point-${getRandom()}`;
  }
  createMountPoint() {
    const node = document.createElement("div");
    node.id = this.mountId;
    node.classList.add(`${this.host.tagName.toLowerCase()}-mount`);
    return node;
  }
  createSlot(slotName) {
    const node = document.createElement("slot");
    node.slot = slotName;
    node.name = slotName;
    return node;
  }
  appendTemplate(target, node = this.createMountPoint()) {
    target.appendChild(node);
    return node;
  }
  initMountPoints() {
    this.initShadowMountPoints();
  }
  destroyMountPoints() {
    for (const host of this.shadowHosts) {
      for (const el of host.querySelectorAll(`[slot="${this.slotName}"][name="${this.slotName}"]`))
        el.remove();
    }
    if (this.mount)
      this.mount.remove();
    this.resetMountId();
  }
  initShadowMountPoints() {
    let host = this.host;
    this.shadowHosts = [this.host];
    while (host = host.getRootNode().host)
      this.shadowHosts.push(host);
    const { shadowHosts, slotName } = this;
    const hosts = [...shadowHosts];
    const root = hosts.pop();
    if (!root.querySelector(`[slot="${slotName}"]`)) {
      const div = document.createElement("div");
      div.slot = slotName;
      root.appendChild(div);
    }
    const container = root.querySelector(`[slot="${slotName}"]`);
    this.appendTemplate(container);
    hosts.forEach((host2) => this.appendTemplate(host2, this.createSlot(slotName)));
  }
  init() {
    this.destroyMountPoints();
    this.initMountPoints();
    this.initialized = true;
  }
};

// src/StripeBase.ts
import { readonly } from "./lib/read-only.js";
import { notify } from "./lib/notify.js";

// node_modules/@stripe/stripe-js/dist/pure.esm.js
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
var V3_URL = "https://js.stripe.com/v3";
var V3_URL_REGEX = /^https:\/\/js\.stripe\.com\/v3\/?(\?.*)?$/;
var EXISTING_SCRIPT_MESSAGE = "loadStripe.setLoadParameters was called but an existing Stripe.js script already exists in the document; existing script parameters will be used";
var findScript = function findScript2() {
  var scripts = document.querySelectorAll('script[src^="'.concat(V3_URL, '"]'));
  for (var i = 0; i < scripts.length; i++) {
    var script = scripts[i];
    if (!V3_URL_REGEX.test(script.src)) {
      continue;
    }
    return script;
  }
  return null;
};
var injectScript = function injectScript2(params) {
  var queryString = params && !params.advancedFraudSignals ? "?advancedFraudSignals=false" : "";
  var script = document.createElement("script");
  script.src = "".concat(V3_URL).concat(queryString);
  var headOrBody = document.head || document.body;
  if (!headOrBody) {
    throw new Error("Expected document.body not to be null. Stripe.js requires a <body> element.");
  }
  headOrBody.appendChild(script);
  return script;
};
var registerWrapper = function registerWrapper2(stripe, startTime) {
  if (!stripe || !stripe._registerWrapper) {
    return;
  }
  stripe._registerWrapper({
    name: "stripe-js",
    version: "1.23.0",
    startTime
  });
};
var stripePromise = null;
var loadScript = function loadScript2(params) {
  if (stripePromise !== null) {
    return stripePromise;
  }
  stripePromise = new Promise(function(resolve, reject) {
    if (typeof window === "undefined") {
      resolve(null);
      return;
    }
    if (window.Stripe && params) {
      console.warn(EXISTING_SCRIPT_MESSAGE);
    }
    if (window.Stripe) {
      resolve(window.Stripe);
      return;
    }
    try {
      var script = findScript();
      if (script && params) {
        console.warn(EXISTING_SCRIPT_MESSAGE);
      } else if (!script) {
        script = injectScript(params);
      }
      script.addEventListener("load", function() {
        if (window.Stripe) {
          resolve(window.Stripe);
        } else {
          reject(new Error("Stripe.js not available"));
        }
      });
      script.addEventListener("error", function() {
        reject(new Error("Failed to load Stripe.js"));
      });
    } catch (error) {
      reject(error);
      return;
    }
  });
  return stripePromise;
};
var initStripe = function initStripe2(maybeStripe, args, startTime) {
  if (maybeStripe === null) {
    return null;
  }
  var stripe = maybeStripe.apply(void 0, args);
  registerWrapper(stripe, startTime);
  return stripe;
};
var validateLoadParams = function validateLoadParams2(params) {
  var errorMessage = "invalid load parameters; expected object of shape\n\n    {advancedFraudSignals: boolean}\n\nbut received\n\n    ".concat(JSON.stringify(params), "\n");
  if (params === null || _typeof(params) !== "object") {
    throw new Error(errorMessage);
  }
  if (Object.keys(params).length === 1 && typeof params.advancedFraudSignals === "boolean") {
    return params;
  }
  throw new Error(errorMessage);
};
var loadParams;
var loadStripeCalled = false;
var loadStripe = function loadStripe2() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  loadStripeCalled = true;
  var startTime = Date.now();
  return loadScript(loadParams).then(function(maybeStripe) {
    return initStripe(maybeStripe, args, startTime);
  });
};
loadStripe.setLoadParameters = function(params) {
  if (loadStripeCalled) {
    throw new Error("You cannot change load parameters after calling loadStripe");
  }
  loadParams = validateLoadParams(params);
};

// src/StripeBase.ts
var StripeElementsError = class extends Error {
  constructor(tag, message) {
    super(`<${tag}>: ${message}`);
    this.originalMessage = message;
  }
};
function isStripeElementsError(error) {
  return !!error && error instanceof StripeElementsError;
}
var errorConverter = {
  toAttribute: (error) => !error ? null : isStripeElementsError(error) ? error.originalMessage : error.message || ""
};
var StripeBase = class extends LitElement {
  constructor() {
    super(...arguments);
    this.generate = "source";
    this.showError = false;
    this.paymentMethod = null;
    this.source = null;
    this.token = null;
    this.element = null;
    this.elements = null;
    this.error = null;
    this.focused = false;
    this.ready = false;
    this.stripe = null;
    this.theme = "none";
    this.precomputedStyle = getComputedStyle(this);
    this.breadcrumb = new BreadcrumbController(this, {
      slotName: `${this.constructor.is}-slot`
    });
  }
  get stripeMountId() {
    return this.breadcrumb.mountId;
  }
  get stripeMount() {
    return this.breadcrumb.mount;
  }
  render() {
    const { error, showError } = this;
    const { slotName } = this.breadcrumb;
    const errorMessage = isStripeElementsError(error) ? error.originalMessage : error?.message;
    return html`
      <div id="stripe" part="stripe">
        <slot id="stripe-slot" name="${slotName}"></slot>
      </div>

      <output id="error"
          for="stripe"
          part="error"
          ?hidden="${!showError}">
        ${ifDefined(errorMessage)}
      </output>
    `;
  }
  updated(changed) {
    super.updated?.(changed);
    if (changed.has("error"))
      this.errorChanged();
    if (changed.has("publishableKey"))
      this.init();
    [...changed.keys()].forEach(this.representationChanged);
  }
  async disconnectedCallback() {
    super.disconnectedCallback();
    await this.unmount?.();
  }
  reset() {
    this.element?.clear?.();
    this.resetRepresentations();
    readonly.set(this, { error: null });
  }
  blur() {
    this.element?.blur();
  }
  focus() {
    this.element?.focus();
  }
  createError(message) {
    return new StripeElementsError(this.constructor.is, message);
  }
  errorChanged() {
    this.resetRepresentations();
    this.fireError(this.error);
  }
  fire(type, detail, opts) {
    this.dispatchEvent(new CustomEvent(type, { detail, ...opts }));
  }
  fireError(error) {
    this.dispatchEvent(new ErrorEvent("error", { error }));
  }
  getCSSCustomPropertyValue(propertyName) {
    return this.precomputedStyle.getPropertyValue(propertyName);
  }
  async handleResponse(response) {
    const { error = null, paymentMethod = null, source = null, token = null } = { ...response };
    readonly.set(this, { error, paymentMethod, source, token });
    await this.updateComplete;
    if (error)
      throw error;
    else
      return response;
  }
  initElement() {
    "abstract";
  }
  async init() {
    await this.unmount();
    await this.initStripe();
    await this.initElement();
    this.initElementListeners();
    this.breadcrumb.init();
    this.mount();
  }
  initElementListeners() {
    if (!this.element)
      return;
    this.element.on("ready", this.onReady);
    this.element.on("focus", this.onFocus);
    this.element.on("blur", this.onBlur);
  }
  async initStripe() {
    const { publishableKey, stripeAccount } = this;
    if (!publishableKey)
      readonly.set(this, { elements: null, element: null, stripe: null });
    else {
      try {
        const options = { stripeAccount };
        const stripe = window.Stripe ? window.Stripe(publishableKey, options) : await loadStripe(publishableKey, options);
        const elements = stripe?.elements();
        readonly.set(this, { elements, error: null, stripe });
      } catch (e) {
        console.warn(e);
        const error = this.createError("Stripe.js must be loaded first.");
        readonly.set(this, { elements: null, error, stripe: null });
      } finally {
        await this.updateComplete;
      }
    }
  }
  mount() {
    if (!this.breadcrumb.mount)
      throw this.createError("Stripe Mount missing");
    this.element?.mount(this.breadcrumb.mount);
  }
  async unmount() {
    this.element?.unmount?.();
    readonly.set(this, { element: null });
    await this.updateComplete;
  }
  async onBlur() {
    readonly.set(this, { focused: false });
    await this.updateComplete;
  }
  async onFocus() {
    readonly.set(this, { focused: true });
    await this.updateComplete;
  }
  async onReady(event) {
    readonly.set(this, { ready: true });
    await this.updateComplete;
    this.fire("ready", event);
  }
  async postRepresentation() {
    const onError = (error) => readonly.set(this, { error });
    const onSuccess = (success) => this.fire("success", success);
    const token = this.token || void 0;
    const source = this.source || void 0;
    const paymentMethod = this.paymentMethod || void 0;
    const body = JSON.stringify({ token, source, paymentMethod });
    const headers = { "Content-Type": "application/json" };
    const method = "POST";
    return fetch(this.action, { body, headers, method }).then(throwBadResponse).then(onSuccess).catch(onError);
  }
  representationChanged(name) {
    if (!isRepresentation(name))
      return;
    const value = this[name];
    if (!value)
      return;
    this.fire(`${dash(name)}`, value);
    if (this.action)
      this.postRepresentation();
  }
  resetRepresentations() {
    readonly.set(this, {
      paymentMethod: null,
      token: null,
      source: null
    });
  }
};
__decorateClass([
  property({ type: String })
], StripeBase.prototype, "action", 2);
__decorateClass([
  property({ type: String, attribute: "client-secret" })
], StripeBase.prototype, "clientSecret", 2);
__decorateClass([
  property({ type: String })
], StripeBase.prototype, "generate", 2);
__decorateClass([
  notify,
  property({ type: String, attribute: "publishable-key", reflect: true })
], StripeBase.prototype, "publishableKey", 2);
__decorateClass([
  property({ type: Boolean, attribute: "show-error", reflect: true })
], StripeBase.prototype, "showError", 2);
__decorateClass([
  property({ type: String, attribute: "stripe-account" })
], StripeBase.prototype, "stripeAccount", 2);
__decorateClass([
  readonly,
  notify,
  property({ type: Object, attribute: "payment-method" })
], StripeBase.prototype, "paymentMethod", 2);
__decorateClass([
  readonly,
  notify,
  property({ type: Object })
], StripeBase.prototype, "source", 2);
__decorateClass([
  readonly,
  notify,
  property({ type: Object })
], StripeBase.prototype, "token", 2);
__decorateClass([
  readonly,
  property({ type: Object })
], StripeBase.prototype, "element", 2);
__decorateClass([
  readonly,
  property({ type: Object })
], StripeBase.prototype, "elements", 2);
__decorateClass([
  readonly,
  notify,
  property({ type: Object, reflect: true, converter: errorConverter })
], StripeBase.prototype, "error", 2);
__decorateClass([
  readonly,
  notify,
  property({ type: Boolean, reflect: true })
], StripeBase.prototype, "focused", 2);
__decorateClass([
  readonly,
  notify,
  property({ type: Boolean, reflect: true })
], StripeBase.prototype, "ready", 2);
__decorateClass([
  readonly,
  property({ type: Object })
], StripeBase.prototype, "stripe", 2);
__decorateClass([
  property()
], StripeBase.prototype, "theme", 2);
__decorateClass([
  property({ attribute: "border-radius" })
], StripeBase.prototype, "borderRadius", 2);
__decorateClass([
  property({ attribute: "color-background" })
], StripeBase.prototype, "colorBackground", 2);
__decorateClass([
  property({ attribute: "color-danger" })
], StripeBase.prototype, "colorDanger", 2);
__decorateClass([
  property({ attribute: "color-primary" })
], StripeBase.prototype, "colorPrimary", 2);
__decorateClass([
  property({ attribute: "color-text" })
], StripeBase.prototype, "colorText", 2);
__decorateClass([
  property({ attribute: "font-family" })
], StripeBase.prototype, "fontFamily", 2);
__decorateClass([
  property({ attribute: "spacing-unit" })
], StripeBase.prototype, "spacingUnit", 2);
__decorateClass([
  bound
], StripeBase.prototype, "handleResponse", 1);
__decorateClass([
  bound
], StripeBase.prototype, "onBlur", 1);
__decorateClass([
  bound
], StripeBase.prototype, "onFocus", 1);
__decorateClass([
  bound
], StripeBase.prototype, "onReady", 1);
__decorateClass([
  bound
], StripeBase.prototype, "representationChanged", 1);

// src/stripe-elements.ts
import { dash as dash2 } from "./lib/strings.js";
import { stripeMethod } from "./lib/stripe-method-decorator.js";
import { readonly as readonly2 } from "./lib/read-only.js";
import { notify as notify2 } from "./lib/notify.js";

// src/shared.css
import { css } from "lit";
var styles = css`[hidden] {
  display: none !important;
}

:host:not([hidden]) {
  display: block;
  box-sizing: border-box;
}

#error {
  font-family: sans-serif;
  font-size: 14px;
  padding-left: 42px;
  padding-bottom: 10px;
}
`;
var shared_default = styles;

// src/stripe-elements.css
import { css as css2 } from "lit";
var styles2 = css2`:host {
  min-width: var(--stripe-elements-width, 300px);
  min-height: var(--stripe-elements-height, 50px);
}

#stripe {
  box-sizing: border-box;
  border-radius: var(--stripe-elements-border-radius, 4px);
  border: var(--stripe-elements-border, 1px solid transparent);
  box-shadow: var(--stripe-elements-box-shadow, 0 1px 3px 0 #e6ebf1);
  transition: var(--stripe-elements-transition, box-shadow 150ms ease);
  min-width: var(--stripe-elements-width, 300px);
  padding: var(--stripe-elements-element-padding, 8px 12px);
  background: var(--stripe-elements-element-background, white);
}

:host([focused]) #stripe {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

:host([error]) #stripe {
  border-color: #fa755a;
}
`;
var stripe_elements_default = styles2;

// src/stripe-elements.ts
var ALLOWED_STYLES = [
  "color",
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontSmoothing",
  "fontVariant",
  "iconColor",
  "lineHeight",
  "letterSpacing",
  "textDecoration",
  "textShadow",
  "textTransform"
];
var SUB_STYLES = [
  ":hover",
  ":focus",
  "::placeholder",
  "::selection",
  ":-webkit-autofill",
  ":disabled"
];
var StripeElements = class extends StripeBase {
  constructor() {
    super(...arguments);
    this.hideIcon = false;
    this.hidePostalCode = false;
    this.iconStyle = "default";
    this.value = {};
    this.brand = null;
    this.complete = false;
    this.empty = true;
    this.invalid = false;
  }
  async createPaymentMethod(paymentMethodData = this.getPaymentMethodData()) {
    return this.stripe.createPaymentMethod(paymentMethodData);
  }
  async createSource(sourceData = this.sourceData) {
    return this.stripe.createSource(this.element, sourceData);
  }
  async createToken(tokenData = this.tokenData) {
    return this.stripe.createToken(this.element, tokenData);
  }
  isPotentiallyValid() {
    return !this.complete && !this.empty && !this.error || this.validate();
  }
  reset() {
    super.reset();
    this.element?.clear();
  }
  async submit() {
    switch (this.generate) {
      case "payment-method":
        return this.createPaymentMethod();
      case "source":
        return this.createSource();
      case "token":
        return this.createToken();
      default: {
        const error = this.createError(`cannot generate ${this.generate}`);
        readonly2.set(this, { error });
        await this.updateComplete;
        throw error;
      }
    }
  }
  validate() {
    const { complete, empty, error } = this;
    const isValid = !error && complete && !empty;
    if (empty && !error)
      readonly2.set(this, { error: this.createError("Your card number is empty.") });
    return isValid;
  }
  updateStyle() {
    this.element?.update({
      style: this.getStripeElementsStyles()
    });
  }
  getPaymentMethodData() {
    const type = "card";
    const { billingDetails, paymentMethodData } = this;
    return {
      billing_details: billingDetails,
      ...paymentMethodData,
      type,
      card: this.element
    };
  }
  getStripeElementsStyles() {
    const getStyle = (prop) => this.getCSSCustomPropertyValue(prop) || void 0;
    const STATES = ["base", "complete", "empty", "invalid"];
    const subReducer = (state) => (acc, sub) => {
      if (state.includes("-"))
        return acc;
      const subProp = sub.split(":").pop();
      return {
        ...acc,
        [sub]: ALLOWED_STYLES.reduce(styleReducer(`${state}-${subProp}`), {})
      };
    };
    const styleReducer = (state) => (init, p) => {
      const prop = `--stripe-elements-${state}-${dash2(p)}`;
      return {
        ...init,
        [p]: getStyle(prop),
        ...SUB_STYLES.reduce(subReducer(state), {})
      };
    };
    return STATES.reduce((acc, state) => ({
      ...acc,
      [state]: ALLOWED_STYLES.reduce(styleReducer(state), {})
    }), {});
  }
  async initElement() {
    if (!this.stripe)
      return;
    const { hidePostalCode, hideIcon, iconStyle, value } = this;
    const style = this.getStripeElementsStyles();
    await this.updateComplete;
    const element = this.createElement({
      hideIcon,
      hidePostalCode,
      iconStyle,
      style,
      value
    });
    element.on("change", this.onChange);
    readonly2.set(this, { element });
    await this.updateComplete;
  }
  createElement(options) {
    const element = this.elements.create("card", options);
    return element;
  }
  async onChange(event) {
    const { brand, complete, empty, error = null } = event;
    const invalid = !(error || !empty && !complete);
    readonly2.set(this, { brand, complete, empty, error, invalid });
    await this.updateComplete;
    this.fire("change", event);
  }
};
StripeElements.is = "stripe-elements";
StripeElements.elementType = "card";
StripeElements.styles = [
  shared_default,
  stripe_elements_default
];
__decorateClass([
  property2({ type: Boolean, attribute: "hide-icon" })
], StripeElements.prototype, "hideIcon", 2);
__decorateClass([
  property2({ type: Boolean, attribute: "hide-postal-code" })
], StripeElements.prototype, "hidePostalCode", 2);
__decorateClass([
  property2({ type: String, attribute: "icon-style" })
], StripeElements.prototype, "iconStyle", 2);
__decorateClass([
  property2({ type: Object })
], StripeElements.prototype, "value", 2);
__decorateClass([
  notify2,
  readonly2,
  property2({ type: String })
], StripeElements.prototype, "brand", 2);
__decorateClass([
  notify2,
  readonly2,
  property2({ type: Boolean, reflect: true })
], StripeElements.prototype, "complete", 2);
__decorateClass([
  notify2,
  readonly2,
  property2({ type: Boolean, reflect: true })
], StripeElements.prototype, "empty", 2);
__decorateClass([
  notify2,
  readonly2,
  property2({ type: Boolean, reflect: true })
], StripeElements.prototype, "invalid", 2);
__decorateClass([
  stripeMethod
], StripeElements.prototype, "createPaymentMethod", 1);
__decorateClass([
  stripeMethod
], StripeElements.prototype, "createSource", 1);
__decorateClass([
  stripeMethod
], StripeElements.prototype, "createToken", 1);
__decorateClass([
  bound2
], StripeElements.prototype, "onChange", 1);
StripeElements = __decorateClass([
  customElement("stripe-elements")
], StripeElements);

// src/stripe-payment-request.ts
import { customElement as customElement2, property as property3 } from "lit/decorators.js";
import { bound as bound3 } from "./lib/bound.js";
import { throwResponseError } from "./lib/stripe.js";

// src/stripe-payment-request.css
import { css as css3 } from "lit";
var styles3 = css3`#stripe {
  box-sizing: border-box;
  min-width: var(--stripe-payment-request-element-min-width, 300px);
  padding: var(--stripe-payment-request-element-padding, 8px 12px);
  background: var(--stripe-payment-request-element-background, white);
}
`;
var stripe_payment_request_default = styles3;

// src/stripe-payment-request.ts
import { readonly as readonly3 } from "./lib/read-only.js";
import { notify as notify3 } from "./lib/notify.js";
function isStripeDisplayItem(el) {
  return el.tagName.toLowerCase() === "stripe-display-item";
}
function datasetToStripeDisplayItem({ dataset: { amount, label, pending } }) {
  return {
    label,
    amount: parseInt(amount),
    ...pending !== void 0 && { pending: pending === "true" ? true : false }
  };
}
function datasetToStripeShippingOption({ dataset: { amount, detail, ...rest } }) {
  return {
    amount: parseInt(amount),
    detail,
    ...rest
  };
}
function mapDataset(el) {
  return isStripeDisplayItem(el) ? datasetToStripeDisplayItem(el) : datasetToStripeShippingOption(el);
}
var _displayItems, _shippingOptions;
var StripePaymentRequest = class extends StripeBase {
  constructor() {
    super(...arguments);
    this.canMakePayment = null;
    __privateAdd(this, _displayItems, void 0);
    this.paymentIntent = null;
    this.paymentRequest = null;
    this.pending = false;
    __privateAdd(this, _shippingOptions, void 0);
    this.buttonType = "default";
    this.buttonTheme = "dark";
    this.complete = async (paymentResponse, confirmationError) => {
      const { error: paymentResponseError = null } = { ...paymentResponse };
      const status = paymentResponseError || confirmationError ? "fail" /* fail */ : "success" /* success */;
      paymentResponse.complete(status);
      this.fire(status, paymentResponse);
      return confirmationError ? { error: confirmationError } : paymentResponse;
    };
  }
  get displayItems() {
    const value = __privateGet(this, _displayItems);
    return Array.isArray(value) ? value : this.parseDatasets("stripe-display-item");
  }
  set displayItems(value) {
    const oldValue = this.displayItems;
    __privateSet(this, _displayItems, value);
    this.requestUpdate("displayItems", oldValue);
  }
  get shippingOptions() {
    const value = __privateGet(this, _shippingOptions);
    return Array.isArray(value) ? value : this.parseDatasets("stripe-shipping-option");
  }
  set shippingOptions(value) {
    const oldValue = this.shippingOptions;
    __privateSet(this, _shippingOptions, value);
    this.requestUpdate("shippingOptions", oldValue);
  }
  reset() {
    super.reset();
    readonly3.set(this, { paymentIntent: null });
  }
  updated(changed) {
    super.updated(changed);
    if (changed.has("generate"))
      this.initPaymentRequestListeners();
    if (changed.has("amount"))
      this.updatePaymentRequest();
  }
  getStripePaymentRequestOptions() {
    const {
      country,
      currency,
      displayItems,
      shippingOptions,
      requestShipping,
      requestPayerEmail,
      requestPayerName,
      requestPayerPhone,
      label = "",
      amount = 0
    } = this;
    const total = { label, amount };
    return {
      country,
      currency,
      displayItems,
      requestPayerEmail,
      requestPayerName,
      requestPayerPhone,
      requestShipping,
      shippingOptions,
      total
    };
  }
  async initElement() {
    await this.initPaymentRequest();
    await this.initPaymentRequestListeners();
    await this.initPaymentRequestButton();
  }
  async initPaymentRequest() {
    if (!this.stripe)
      return;
    const stripePaymentRequestOptions = this.getStripePaymentRequestOptions();
    const paymentRequest = this.stripe.paymentRequest(stripePaymentRequestOptions);
    const canMakePayment = await paymentRequest.canMakePayment();
    readonly3.set(this, { paymentRequest, canMakePayment });
    await this.updateComplete;
    if (!this.canMakePayment)
      this.fire("unsupported");
  }
  async initPaymentRequestButton() {
    const { buttonTheme: theme, buttonType: type, canMakePayment, paymentRequest } = this;
    if (!canMakePayment || !this.elements)
      return;
    const propertyName = "--stripe-payment-request-button-height";
    const height = this.getCSSCustomPropertyValue(propertyName) || "40px";
    const style = { paymentRequestButton: { height, theme, type } };
    const element = this.elements.create("paymentRequestButton", { paymentRequest, style });
    readonly3.set(this, { element });
    await this.updateComplete;
  }
  async initPaymentRequestListeners() {
    if (!this.canMakePayment)
      return;
    this.paymentRequest.on("click", this.updatePaymentRequest);
    this.paymentRequest.on("cancel", this.onCancel);
    this.paymentRequest.on("shippingaddresschange", this.onShippingaddresschange);
    this.paymentRequest.on("shippingoptionchange", this.onShippingoptionchange);
    switch (this.generate) {
      case "payment-method":
        this.paymentRequest.on("paymentmethod", this.onPaymentResponse);
        break;
      case "source":
        this.paymentRequest.on("source", this.onPaymentResponse);
        break;
      case "token":
        this.paymentRequest.on("token", this.onPaymentResponse);
        break;
    }
  }
  async updatePaymentRequest() {
    if (!this.paymentRequest)
      return;
    const { currency, total, displayItems, shippingOptions } = this.getStripePaymentRequestOptions();
    this.paymentRequest.update({ currency, total, displayItems, shippingOptions });
  }
  onCancel() {
    this.fire("cancel" /* cancel */);
  }
  async onPaymentResponse(event) {
    const {
      error = null,
      paymentMethod = null,
      source = null,
      token = null
    } = { ...event };
    readonly3.set(this, { error, paymentMethod, source, token });
    const isPaymentIntent = this.clientSecret && !error;
    if (isPaymentIntent)
      this.confirmPaymentIntent(event);
    else
      this.complete(event);
  }
  async confirmPaymentIntent(paymentResponse) {
    const confirmCardData = { payment_method: this.paymentMethod.id };
    const { error = null, paymentIntent = null } = await this.confirmCardPayment(confirmCardData, { handleActions: false }).then(({ error: confirmationError }) => this.complete(paymentResponse, confirmationError)).then(throwResponseError).then(() => this.confirmCardPayment()).then(throwResponseError).catch((error2) => ({ error: error2 }));
    readonly3.set(this, { error, paymentIntent });
    await this.updateComplete;
  }
  async confirmCardPayment(data, options) {
    return this.stripe.confirmCardPayment(this.clientSecret, data, options);
  }
  onShippingaddresschange(originalEvent) {
    this.fire("shippingaddresschange", originalEvent);
  }
  onShippingoptionchange(originalEvent) {
    this.fire("shippingoptionchange", originalEvent);
  }
  parseDatasets(selector) {
    const elements = [...this.querySelectorAll(selector)];
    return !elements.length ? [] : elements.map(mapDataset);
  }
};
_displayItems = new WeakMap();
_shippingOptions = new WeakMap();
StripePaymentRequest.is = "stripe-payment-request";
StripePaymentRequest.styles = [
  shared_default,
  stripe_payment_request_default
];
__decorateClass([
  property3({ type: Number, reflect: true })
], StripePaymentRequest.prototype, "amount", 2);
__decorateClass([
  notify3,
  readonly3,
  property3({ type: Boolean, attribute: "can-make-payment", reflect: true })
], StripePaymentRequest.prototype, "canMakePayment", 2);
__decorateClass([
  property3({ type: String })
], StripePaymentRequest.prototype, "country", 2);
__decorateClass([
  property3({ type: String })
], StripePaymentRequest.prototype, "currency", 2);
__decorateClass([
  property3({ type: Array })
], StripePaymentRequest.prototype, "displayItems", 1);
__decorateClass([
  property3({ type: String, reflect: true })
], StripePaymentRequest.prototype, "label", 2);
__decorateClass([
  notify3,
  readonly3,
  property3({ type: Object, attribute: "payment-intent" })
], StripePaymentRequest.prototype, "paymentIntent", 2);
__decorateClass([
  readonly3,
  property3({ type: Object, attribute: "payment-request" })
], StripePaymentRequest.prototype, "paymentRequest", 2);
__decorateClass([
  property3({ type: Boolean, reflect: true })
], StripePaymentRequest.prototype, "pending", 2);
__decorateClass([
  property3({ type: Boolean, attribute: "request-payer-email" })
], StripePaymentRequest.prototype, "requestPayerEmail", 2);
__decorateClass([
  property3({ type: Boolean, attribute: "request-payer-name" })
], StripePaymentRequest.prototype, "requestPayerName", 2);
__decorateClass([
  property3({ type: Boolean, attribute: "request-payer-phone" })
], StripePaymentRequest.prototype, "requestPayerPhone", 2);
__decorateClass([
  property3({ type: Boolean, attribute: "request-shipping" })
], StripePaymentRequest.prototype, "requestShipping", 2);
__decorateClass([
  property3({ type: Array })
], StripePaymentRequest.prototype, "shippingOptions", 1);
__decorateClass([
  property3({ type: String, attribute: "button-type" })
], StripePaymentRequest.prototype, "buttonType", 2);
__decorateClass([
  property3({ type: String, attribute: "button-theme" })
], StripePaymentRequest.prototype, "buttonTheme", 2);
__decorateClass([
  bound3
], StripePaymentRequest.prototype, "onCancel", 1);
__decorateClass([
  bound3
], StripePaymentRequest.prototype, "onPaymentResponse", 1);
__decorateClass([
  bound3
], StripePaymentRequest.prototype, "confirmPaymentIntent", 1);
__decorateClass([
  bound3
], StripePaymentRequest.prototype, "confirmCardPayment", 1);
__decorateClass([
  bound3
], StripePaymentRequest.prototype, "onShippingaddresschange", 1);
__decorateClass([
  bound3
], StripePaymentRequest.prototype, "onShippingoptionchange", 1);
StripePaymentRequest = __decorateClass([
  customElement2("stripe-payment-request")
], StripePaymentRequest);
export {
  StripeElements,
  StripePaymentRequest
};
//# sourceMappingURL=index.js.map
