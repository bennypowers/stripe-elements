import 'chai-things';
import 'sinon-chai';

import { LitElement, customElement, property, query } from 'lit-element';
import { spreadProps } from '@open-wc/lit-helpers';

import {
  aTimeout,
  expect,
  fixture,
  html,
  nextFrame,
  oneEvent,
  unsafeStatic,
} from '@open-wc/testing';
import { spy, stub } from 'sinon';

import {
  Stripe,
  PUBLISHABLE_KEY,
  addUserAgentCreditCard,
  resetUserAgentCreditCards,
} from './mock-stripe';
import { dash } from '../src/lib/strings';

const getTemplate = (tagName, props = {}) =>
  html`<${tagName} ...="${spreadProps(props)}"></${tagName}>`;

/* eslint-disable no-unused-vars */
@customElement('primary-host') class PrimaryHost extends LitElement {
  @property({ type: String }) tag;

  get nestedElement() { return this.shadowRoot.querySelector(this.tag); }

  render() {
    return html`
      <h1>Other Primary Host Content</h1>
      ${getTemplate(unsafeStatic(this.tag), { publishableKey: PUBLISHABLE_KEY })}
    `;
  }
}

@customElement('secondary-host') class SecondaryHost extends LitElement {
  @query('primary-host') primaryHost;

  @property({ type: String }) tag;

  render() { return html`<primary-host tag="${this.tag}"></primary-host>`; }
}

@customElement('tertiary-host') class TertiaryHost extends LitElement {
  @query('secondary-host') secondaryHost;

  @property({ type: String }) tag;

  render() { return html`<secondary-host tag="${this.tag}"></secondary-host>`; }
}
/* eslint-enable no-unused-vars */

/* CONSTANTS */
export const NO_STRIPE_JS_ERROR =
  `requires Stripe.js to be loaded first.`;

export const NO_STRIPE_CONFIRM_CARD_ERROR =
  'Stripe must be initialized before calling confirmCardPayment.';

export const NO_STRIPE_CREATE_PAYMENT_METHOD_ERROR =
  'Stripe must be initialized before calling createPaymentMethod.';

export const NO_STRIPE_CREATE_SOURCE_ERROR =
  'Stripe must be initialized before calling createSource.';

export const NO_STRIPE_CREATE_TOKEN_ERROR =
  'Stripe must be initialized before calling createToken.';

export const EMPTY_CC_ERROR =
  'Your card number is empty.';

export const BASE_DEFAULT_PROPS = Object.freeze({
  billingDetails: {},
  paymentMethodData: {},
  sourceData: {},
  tokenData: {},
  clientSecret: undefined,
  generate: 'source',
  action: undefined,
  element: null,
  elements: null,
  error: null,
  hasError: false,
  publishableKey: undefined,
  paymentMethod: null,
  showError: false,
  source: null,
  stripe: null,
  token: null,
});

export const BASE_READ_ONLY_PROPS = Object.freeze([
  'element',
  'stripe',
  'error',
  'hasError',
  'paymentMethod',
  'source',
  'token',
]);

export const BASE_NOTIFYING_PROPS = Object.freeze([
  'error',
  'hasError',
  'paymentMethod',
  'publishableKey',
  'source',
  'token',
]);

export const ALLOWED_STYLES = Object.freeze([
  'color',
  'fontFamily',
  'fontSize',
  'fontSmoothing',
  'fontStyle',
  'fontVariant',
  'iconColor',
  'letterSpacing',
  'lineHeight',
  'textDecoration',
  'textShadow',
  'textTransform',
]);

export const STYLE_PREFIXES = Object.freeze([
  'base',
  'complete',
  'empty',
  'invalid',
]);

export const ALL_BLUE_STYLES = ALLOWED_STYLES.flatMap(camelCase => STYLE_PREFIXES.map(prefix => `--stripe-elements-${prefix}-${dash(camelCase)}:blue;`));

/* TEST STATE */

export let fetchStub;

/** @type {StripeElements|StripePaymentRequest} */
export let element;
export let initialStripeMountId;
export let initialStripe;
export const events = new Map();

export function resetTestState() {
  element = undefined;
  initialStripeMountId = undefined;
  initialStripe = undefined;
  events.clear();
  document.getElementById('stripe-elements-custom-css-properties')?.remove();
  document.getElementById('stripe-payment-request-custom-css-properties')?.remove();
  document.querySelectorAll('.artificially-appended-styles').forEach(el => el.remove());
}

const ALL_BLUE_STYLE_TAG = document.createElement('style');
ALL_BLUE_STYLE_TAG.id = 'all-blue-styles';
ALL_BLUE_STYLE_TAG.textContent = `html {
  ${ALL_BLUE_STYLES.join('\n')}
}`;

const HEIGHT_STYLE_TAG = document.createElement('style');
HEIGHT_STYLE_TAG.id = 'height-styles';
HEIGHT_STYLE_TAG.textContent = `html {
  --stripe-payment-request-button-height:1000px;
}`;

export const noop = () => {};

export const assignedNodes = el => el.assignedNodes();

export const mountLightDOM = ({ stripeMountId, tagName = element.constructor.is }) =>
  `<div id="${stripeMountId}" class="${`${tagName.toLowerCase()}-mount`}"></div>`;

export const expectedLightDOM = ({ stripeMountId, tagName }) =>
  `<div slot="${tagName.toLowerCase()}-slot">${mountLightDOM({ stripeMountId, tagName })}</div> `;

/* MOCKS, STUBS, AND SPIES */

class MockScopingShim {
  adoptedCssTextMap = {}

  prepareAdoptedCssText(cssTextArray, elementName) {
    this.adoptedCssTextMap[elementName] = cssTextArray.join(' ');
  }
}

class MockShadyCSS {
  getComputedStyleValue(el, name) {
    return getComputedStyle(el).getPropertyValue(name);
  }

  ScopingShim = new MockScopingShim();

  restore() {
    this.ScopingShim.adoptedCssTextMap = {};
  }
}

export function mockCanMakePayment() {
  addUserAgentCreditCard({
    cardNumber: '4242424242424242',
    cvc: '424',
    billingDetails: {
      owner: {
        name: 'Mr. Man',
        email: 'mr@man.email',
        phone: '5555555555',
      },
      address: {
        line1: '123 test st',
        city: 'testington',
        country: 'ca',
      },
    },
  });
}

export function restoreCanMakePayment() {
  resetUserAgentCreditCards();
}

export function mockShadyCSS() {
  window.ShadyCSS = new MockShadyCSS();
}

export function restoreShadyCSS() {
  window.ShadyCSS.restore();
  window.ShadyCSS = undefined;
}

export function spyGetComputedStyleValue() {
  spy(window.ShadyCSS, 'getComputedStyleValue');
}

export function restoreGetComputedStyleValue() {
  window.ShadyCSS?.getComputedStyleValue?.restore();
}

export function mockShadyDOM() {
  window.ShadyDOM = new (class MockShadyDOM { })();
}

export function restoreShadyDOM() {
  window.ShadyDOM = undefined;
}

export function mockStripe() {
  window.Stripe = (key, opts) => new Stripe(key, opts);
}

export function restoreStripe() {
  delete window.Stripe;
}

export function spyCardClear() {
  if (element?.card?.clear) spy(element.card, 'clear');
}

export function spyStripeElementBlur() {
  spy(element.element, 'blur');
}

export function restoreStripeElementBlur() {
  element.element.blur?.restore?.();
}

export function spyStripeElementFocus() {
  spy(element.element, 'focus');
}

export function restoreStripeElementFocus() {
  element.element.focus?.restore?.();
}

export function restoreCardClear() {
  element?.card?.clear?.restore();
}

export function spyConsoleWarn() {
  stub(console, 'warn');
}

export function restoreConsoleWarn() {
  console.warn?.restore();
}

export function stubFetch() {
  fetchStub = stub(window, 'fetch');
  fetchStub.resolves(new Response('ok response'));
}

export function restoreFetch() {
  fetchStub?.restore();
}

/* FIXTURE */

export function setupWithTemplate(template) {
  return async function() {
    element = await fixture(template);
  };
}

export async function setupNoProps() {
  const [describeTitle] = this.test.titlePath();
  const tagName = unsafeStatic(describeTitle.replace(/<(.*)>/, '$1'));
  element = await fixture(getTemplate(tagName));
}

export async function updateComplete() {
  return await element.updateComplete;
}

export function setupWithPublishableKey(publishableKey) {
  return async function setup() {
    const [describeTitle] = this.test.titlePath();
    const tagName = unsafeStatic(describeTitle.replace(/<(.*)>/, '$1'));
    element = await fixture(getTemplate(tagName, { publishableKey }));
    await element.updateComplete;
    initialStripe = element.stripe;
  };
}

export async function removeStripeMount() {
  initialStripeMountId = element.stripeMount.id;
  element?.stripeMount?.remove();
}

export function appendAllBlueStyleTag() {
  document.head.appendChild(ALL_BLUE_STYLE_TAG);
}

export function removeAllBlueStyleTag() {
  document.getElementById('all-blue-styles').remove();
}

export function appendHeightStyleTag() {
  document.head.appendChild(HEIGHT_STYLE_TAG);
}

export function removeHeightStyleTag() {
  document.getElementById('height-styles').remove();
}

export function listenFor(eventType) {
  return async function() {
    events.set(eventType, oneEvent(element, eventType));
  };
}

export function awaitEvent(eventType) {
  return async function() {
    await events.get(eventType);
  };
}

export function sleep(ms) {
  return async function() {
    await aTimeout(ms);
  };
}

/* ASSERTIONS */

export function assertCalled(stub) {
  return function() {
    expect(stub).to.have.been.called;
  };
}

export function assertFired(eventType) {
  return async function() {
    expect(await events.get(eventType), eventType).to.be.an.instanceof(Event);
  };
}

export function assertEventDetail(eventType, expected) {
  return async function() {
    const { detail } = await events.get(eventType);
    expect(detail, `${eventType} detail`).to.deep.equal(expected);
  };
}

export function assertProps(props, { deep } = {}) {
  return async function() {
    await element.updateComplete;
    Object.entries(props).forEach(([name, value]) => {
      if (deep) expect(element[name]).to.deep.equal(value);
      else expect(element[name]).to.equal(value);
    });
  };
}

export function assertErrorMessage(message) {
  return function() {
    expect(element.error?.message).to.equal(message);
  };
}

export function assertPropsOk(props, { not } = {}) {
  return async function() {
    await element.updateComplete;
    props.forEach(prop =>
      not ? expect(element[prop]).to.not.be.ok
      : expect(element[prop]).to.be.ok
    );
  };
}

export function testDefaultPropEntry([name, value]) {
  return it(name, async function() {
    expect(element[name], name).to.eql(value);
  });
}

export function testReadOnlyProp(name) {
  it(name, function() {
    const init = element[name];
    element[name] = Math.random();
    expect(element[name], name).to.equal(init);
  });
}

export function testWritableNotifyingProp(name) {
  it(name, async function() {
    const synth = `${Math.random()}`;
    const eventName = `${dash(name)}-changed`;
    setTimeout(function setProp() { element[name] = synth; });
    const { detail: { value } } = await oneEvent(element, eventName);
    expect(value, name).to.eql(synth);
  });
}

export function testReadonlyNotifyingProp(name) {
  it(name, async function() {
    const synth = `${Math.random()}`;
    const eventName = `${dash(name)}-changed`;
    setTimeout(function setProp() { element.set({ [name]: synth }); });
    const { detail: { value } } = await oneEvent(element, eventName);
    expect(value, name).to.eql(synth);
  });
}

export function assertElementErrorMessage(message) {
  return function() {
    expect(element.error.message).to.equal(`<${element.constructor.is}>: ${message}`);
  };
}

/* ELEMENT METHODS */

export async function blur() {
  element.blur();
}

export async function focus() {
  element.focus();
}

export async function blurStripeElement() {
  element.element.synthEvent('blur');
}

export async function focusStripeElement() {
  element.element.synthEvent('focus');
}

export async function submit() {
  const submitPromise = element.submit();
  // don't await result if we need to set up a listener
  if (!this?.currentTest?.title.startsWith('fires')) await submitPromise;
}

export async function reset() {
  spyCardClear();
  element.reset();
  await element.updateComplete;
}

export async function createPaymentMethod() {
  element.createPaymentMethod();
  // don't await result if we need to set up a listener
  if (!this?.currentTest?.title.startsWith('fires')) await nextFrame();
}

export async function createSource() {
  element.createSource();
  // don't await result if we need to set up a listener
  if (!this?.currentTest?.title.startsWith('fires')) await nextFrame();
}

export async function createToken() {
  element.createToken();
  // don't await result if we need to set up a listener
  if (!this?.currentTest?.title.startsWith('fires')) await nextFrame();
}

export async function validate() {
  element.validate();
  await element.updateComplete;
}

export function setProps(props) {
  return async function doSetProps() {
    Object.entries(props).forEach(([name, value]) => {
      element[name] = value;
    });
    await element.updateComplete;
  };
}

export function synthCardEvent(...args) {
  return function() {
    element.element.synthEvent(...args);
  };
}

export function synthPaymentRequestEvent(...args) {
  return function() {
    element.paymentRequest.synthEvent(...args);
  };
}

export function synthStripeFormValues(inputs) {
  return async function() {
    element?.card?.setState(inputs);
    await oneEvent(element, 'stripe-change');
    await element.updateComplete;
  };
}
