import 'chai-things';
import 'sinon-chai';

import { LitElement, html, customElement, query } from 'lit-element';
import { spreadProps } from '@open-wc/lit-helpers';

import {
  expect,
  fixture,
  nextFrame,
  oneEvent,
} from '@open-wc/testing';
import { spy, stub } from 'sinon';

import { MockedStripeAPI, PUBLISHABLE_KEY } from './mock-stripe';
import { dash } from '../src/lib/strings';

const getTemplate = (props = {}) =>
  html`<stripe-elements ...="${spreadProps(props)}"></stripe-elements>`;

/* eslint-disable no-unused-vars */
@customElement('primary-host') class PrimaryHost extends LitElement {
  @query('stripe-elements') nestedElement;

  render() {
    return html`
      <h1>Other Primary Host Content</h1>
      ${getTemplate({ publishableKey: PUBLISHABLE_KEY })}
    `;
  }
}

@customElement('secondary-host') class SecondaryHost extends LitElement {
  @query('primary-host') primaryHost;

  render() { return html`<primary-host></primary-host>`; }
}

@customElement('tertiary-host') class TertiaryHost extends LitElement {
  @query('secondary-host') secondaryHost;

  render() { return html`<secondary-host></secondary-host>`; }
}
/* eslint-enable no-unused-vars */

const stripeMethodError = name => `<stripe-elements>: Stripe must be initialized before calling ${name}.`;

/* CONSTANTS */
export const NO_STRIPE_JS = `<stripe-elements> requires Stripe.js to be loaded first.`;
export const NO_STRIPE_CONFIRM_CARD_ERROR = stripeMethodError('confirmCardPayment');
export const NO_STRIPE_CREATE_PAYMENT_METHOD_ERROR = stripeMethodError('createPaymentMethod');
export const NO_STRIPE_CREATE_SOURCE_ERROR = stripeMethodError('createSource');
export const NO_STRIPE_CREATE_TOKEN_ERROR = stripeMethodError('createToken');
export const INCOMPLETE_CC_ERROR = 'Credit card information is incomplete.';
export const EMPTY_CC_ERROR = 'Credit card information is empty.';

export const DEFAULT_PROPS = Object.freeze({
  action: undefined,
  brand: null,
  card: null,
  elements: null,
  error: null,
  hasError: false,
  hideIcon: false,
  hidePostalCode: false,
  iconStyle: 'default',
  isComplete: false,
  isEmpty: true,
  publishableKey: undefined,
  paymentMethod: null,
  source: null,
  stripe: null,
  token: null,
  value: {},
});

export const READ_ONLY_PROPS = Object.freeze([
  'brand',
  'card',
  'elements',
  'error',
  'hasError',
  'isComplete',
  'isEmpty',
  'paymentMethod',
  'source',
  'stripe',
  'stripeReady',
  'token',
]);

export const NOTIFYING_PROPS = Object.freeze([
  'brand',
  'card',
  'error',
  'hasError',
  'isComplete',
  'isEmpty',
  'paymentMethod',
  'publishableKey',
  'source',
  'stripeReady',
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

export let element;
export let initialStripeMountId;
export let initialStripe;

export function resetTestState() {
  element = undefined;
  initialStripeMountId = undefined;
  initialStripe = undefined;
  document.getElementById('stripe-elements-custom-css-properties')?.remove();
}

const ALL_BLUE_STYLE_TAG = document.createElement('style');
ALL_BLUE_STYLE_TAG.id = 'all-blue-styles';
ALL_BLUE_STYLE_TAG.textContent = `html {
  ${ALL_BLUE_STYLES.join('\n')}
}`;

export const noop = () => {};

export const assignedNodes = el => el.assignedNodes();

export const mountLightDOM = ({ stripeMountId }) =>
  `<div id="${stripeMountId}" class="stripe-elements-mount"></div>`;

export const expectedLightDOM = ({ stripeMountId }) =>
  `<div slot="stripe-card">${mountLightDOM({ stripeMountId })}</div> `;

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
  window.Stripe = (key, opts) => new MockedStripeAPI(key, opts);
}

export function restoreStripe() {
  delete window.Stripe;
}

export function spyCardClear() {
  spy(element.card, 'clear');
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

export async function setupNoProps() {
  element = await fixture(getTemplate());
}

export async function updateComplete() {
  return await element.updateComplete;
}

export function setupWithPublishableKey(publishableKey) {
  return async function setup() {
    element = await fixture(getTemplate({ publishableKey }));
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

let appendedGlobalStyleTag;
export function appendGlobalStyles() {
  appendedGlobalStyleTag = document.createElement('style');
  appendedGlobalStyleTag.id = 'stripe-elements-custom-css-properties';
  document.head.appendChild(appendedGlobalStyleTag);
}

export function restoreAppended() {
  appendedGlobalStyleTag = undefined;
}

/* ASSERTIONS */

export function assertProps(props) {
  const assertEntry = ([name, value]) => expect(element[name]).to.equal(value);
  return function() {
    return async function() {
      await element.updateComplete;
      Object.entries(props).forEach(assertEntry);
    };
  };
}

export function assertHasOneGlobalStyleTag() {
  const queried = document.querySelectorAll('#stripe-elements-custom-css-properties');
  expect(queried.length).to.equal(1);
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

export async function assertFiresStripeChange() {
  const name = 'stripe-change';
  const { type } = await oneEvent(element, name);
  expect(type).to.equal(name);
}

/* ELEMENT METHODS */

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

export function synthStripeEvent(...args) {
  return function() {
    element.card.synthEvent(...args);
  };
}

export function synthStripeFormValues(inputs) {
  return async function() {
    element?.card?.setState(inputs);
    await oneEvent(element, 'stripe-change');
    await element.updateComplete;
  };
}
