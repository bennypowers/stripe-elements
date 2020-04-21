import type { StripeElements } from '../src/stripe-elements';
import type { StripePaymentRequest } from '../src/stripe-payment-request';
import type { ShadyDOM, ShadyCSS } from '@webcomponents/webcomponentsjs';

import 'chai-things';
import 'sinon-chai';

import { LitElement, customElement, property, TemplateResult } from 'lit-element';
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
  Keys,
  addUserAgentCreditCard,
  resetUserAgentCreditCards,
} from './mock-stripe';
import { dash } from '../src/lib/strings';
import { StripeBase } from '../src/StripeBase';

declare global {
  interface Window {
    ShadyCSS: ShadyCSS;
    ShadyDOM: ShadyDOM;
  }

  interface Node {
    getRootNode(options?: GetRootNodeOptions): Node|ShadowRoot;
  }

  /* eslint-disable */
  namespace stripe {
    namespace paymentRequest {
      interface StripePaymentRequest {
        synthEvent: any;
      }
    }
    namespace elements {
      interface Element {
        style: any;
        setState: any;
        synthEvent: any;
      }
    }
  }
  /* eslint-enable */

}

const getTemplate = (tagName: ReturnType<typeof unsafeStatic>, props = {}): TemplateResult =>
  html`<${tagName} ...="${spreadProps(props)}"></${tagName}>`;

class Host extends LitElement {
  @property({ type: String }) tag: string;
}

@customElement('primary-host')
export class PrimaryHost extends Host {
  static is = 'primary-host';

  get nestedElement(): StripeBase {
    return this.shadowRoot.querySelector(this.tag);
  }

  render(): TemplateResult {
    return html`
      <h1>Other Primary Host Content</h1>
      ${getTemplate(unsafeStatic(this.tag), { publishableKey: Keys.PUBLISHABLE_KEY })}
    `;
  }
}

@customElement('secondary-host')
export class SecondaryHost extends Host {
  get primaryHost(): PrimaryHost {
    return this.shadowRoot.querySelector(PrimaryHost.is);
  }

  render(): TemplateResult {
    return html`<primary-host tag="${this.tag}"></primary-host>`;
  }
}

@customElement('tertiary-host')
export class TertiaryHost extends Host {
  get secondaryHost(): SecondaryHost {
    return this.shadowRoot.querySelector('secondary-host');
  }

  render(): TemplateResult {
    return html`<secondary-host tag="${this.tag}"></secondary-host>`;
  }
}

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
  billingDetails: undefined,
  paymentMethodData: undefined,
  sourceData: undefined,
  tokenData: undefined,
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

export const ALL_BLUE_STYLES =
  ALLOWED_STYLES
  // eslint-disable-next-line
  // @ts-ignore
    .flatMap(
      (camelCase: string) => STYLE_PREFIXES.map(prefix => `--stripe-elements-${prefix}-${dash(camelCase)}:blue;`)
    );

/* TEST STATE */

export let fetchStub: sinon.SinonStub;

export let element: StripeElements&StripePaymentRequest;
export let initialStripeMountId: string;
export let initialStripe: stripe.Stripe;
export const events = new Map();

export function resetTestState(): void {
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

export const noop = (): void => { null; };

export const assignedNodes = (el: HTMLSlotElement): Node[] => el.assignedNodes();

interface Opts {
  stripeMountId: string;
  tagName: string;
}

export const mountLightDOM =
  ({ stripeMountId, tagName = element.tagName.toLowerCase() }: Opts): string =>
    `<div id="${stripeMountId}" class="${`${tagName.toLowerCase()}-mount`}"></div>`;

export const expectedLightDOM = ({ stripeMountId, tagName }): string =>
  `<div slot="${tagName.toLowerCase()}-slot">${mountLightDOM({ stripeMountId, tagName })}</div> `;

/* MOCKS, STUBS, AND SPIES */

class MockScopingShim {
  adoptedCssTextMap = {}

  prepareAdoptedCssText(cssTextArray, elementName): void {
    this.adoptedCssTextMap[elementName] = cssTextArray.join(' ');
  }
}

class MockShadyCSS {
  getComputedStyleValue(el, name): string {
    return getComputedStyle(el).getPropertyValue(name);
  }

  ScopingShim = new MockScopingShim();

  restore(): void {
    this.ScopingShim.adoptedCssTextMap = {};
  }
}

export function mockCanMakePayment(): void {
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

export function restoreCanMakePayment(): void {
  resetUserAgentCreditCards();
}

export function mockShadyCSS(): void {
  window.ShadyCSS = new MockShadyCSS();
}

export function restoreShadyCSS(): void {
  window.ShadyCSS.restore();
  window.ShadyCSS = undefined;
}

export function spyGetComputedStyleValue(): void {
  spy(window.ShadyCSS, 'getComputedStyleValue');
}

export function restoreGetComputedStyleValue(): void {
  window.ShadyCSS?.getComputedStyleValue?.restore();
}

export function mockShadyDOM(): void {
  window.ShadyDOM = new (class MockShadyDOM { })();
}

export function restoreShadyDOM(): void {
  window.ShadyDOM = undefined;
}

export function mockStripe(): void {
  const stripeStatic =
    (key: Keys, opts: stripe.StripeOptions): stripe.Stripe =>
      ((new Stripe(key, opts)) as unknown as stripe.Stripe);
  stripeStatic.version = 0;
  window.Stripe = stripeStatic;
}

export function restoreStripe(): void {
  delete window.Stripe;
}

export function spyCardClear(): void {
  if (element?.card?.clear) spy(element.card, 'clear');
}

export function spyStripeElementBlur(): void {
  spy(element.element, 'blur');
}

export function restoreStripeElementBlur(): void {
  element.element.blur
  // eslint-disable-next-line
  // @ts-ignore
    ?.restore?.();
}

export function spyStripeElementFocus(): void {
  spy(element.element, 'focus');
}

export function restoreStripeElementFocus(): void {
  // eslint-disable-next-line
  // @ts-ignore
  element.element.focus?.restore?.();
}

export function restoreCardClear(): void {
  // eslint-disable-next-line
  // @ts-ignore
  element?.card?.clear?.restore();
}

export function spyConsoleWarn(): void {
  stub(console, 'warn');
}

export function restoreConsoleWarn(): void {
  (console.warn as ReturnType<typeof stub>)?.restore();
}

export function stubFetch(): void {
  fetchStub = stub(window, 'fetch');
  fetchStub.resolves(new Response('ok response'));
}

export function restoreFetch(): void {
  fetchStub?.restore();
}

/* FIXTURE */

export function setupWithTemplate(template: TemplateResult|string) {
  return async function(): Promise<void> {
    element = await fixture(template);
  };
}

export async function setupNoProps(): Promise<void> {
  const [describeTitle] = this.test.titlePath();
  const tagName = unsafeStatic(describeTitle.replace(/<(.*)>/, '$1'));
  element = await fixture(getTemplate(tagName));
}

export async function updateComplete(): Promise<unknown> {
  return await element.updateComplete;
}

export function setupWithPublishableKey(publishableKey) {
  return async function setup(): Promise<void> {
    const [describeTitle] = this.test.titlePath();
    const tagName = unsafeStatic(describeTitle.replace(/<(.*)>/, '$1'));
    element = await fixture(getTemplate(tagName, { publishableKey }));
    await element.updateComplete;
    initialStripe = element.stripe;
  };
}

export async function removeStripeMount() {
  // eslint-disable-next-line
  // @ts-ignore
  initialStripeMountId = element.stripeMount.id;
  // eslint-disable-next-line
  // @ts-ignore
  element?.stripeMount?.remove();
}

export function appendAllBlueStyleTag(): void {
  document.head.appendChild(ALL_BLUE_STYLE_TAG);
}

export function removeAllBlueStyleTag(): void {
  document.getElementById('all-blue-styles').remove();
}

export function appendHeightStyleTag(): void {
  document.head.appendChild(HEIGHT_STYLE_TAG);
}

export function removeHeightStyleTag(): void {
  document.getElementById('height-styles').remove();
}

export function listenFor(eventType) {
  return async function(): Promise<void> {
    events.set(eventType, oneEvent(element, eventType));
  };
}

export function awaitEvent(eventType) {
  return async function(): Promise<void> {
    await events.get(eventType);
  };
}

export function sleep(ms: number) {
  return async function(): Promise<void> {
    await aTimeout(ms);
  };
}

/* ASSERTIONS */

export function assertCalled(stub) {
  return function(): void {
    expect(stub).to.have.been.called;
  };
}

export function assertFired(eventType: string) {
  return async function(): Promise<void> {
    const event = await events.get(eventType);
    expect(event, eventType).to.be.an.instanceof(Event);
  };
}

export function assertEventDetail(eventType, expected) {
  return async function(): Promise<void> {
    const { detail } = await events.get(eventType);
    expect(detail, `${eventType} detail`).to.deep.equal(expected);
  };
}

export function assertProps(props, { deep = false } = {}) {
  return async function(): Promise<void> {
    await element.updateComplete;
    Object.entries(props).forEach(([name, value]) => {
      if (deep) expect(element[name]).to.deep.equal(value);
      else expect(element[name]).to.equal(value);
    });
  };
}

export function assertErrorMessage(message: string) {
  return function(): void {
    expect(element.error?.message).to.equal(message);
  };
}

export function assertPropsOk(props: any[], { not = false } = {}) {
  return async function(): Promise<void> {
    await element.updateComplete;
    props.forEach(prop =>
      not ? expect(element[prop]).to.not.be.ok
      : expect(element[prop]).to.be.ok
    );
  };
}

export function testDefaultPropEntry([name, value]): Mocha.Test {
  return it(name, async function() {
    expect(element[name], name).to.eql(value);
  });
}

export function testReadOnlyProp(name: string): void {
  it(name, function() {
    // this.timeout(10 * 60 * 1000)
    const init = element[name];
    element[name] = Math.random();
    expect(element[name], name).to.equal(init);
    // return aTimeout(10 * 60 * 1000).then(() => {
    //   expect(element[name], name).to.equal(init);
    // })
  });
}

export function testWritableNotifyingProp(name: string): void {
  it(name, async function() {
    const synth = `${Math.random()}`;
    const eventName = `${dash(name)}-changed`;
    setTimeout(function setProp() { element[name] = synth; });
    const { detail: { value } } = await oneEvent(element, eventName);
    expect(value, name).to.eql(synth);
  });
}

export function testReadonlyNotifyingProp(name: string): void {
  it(name, async function() {
    const synth = `${Math.random()}`;
    const eventName = `${dash(name)}-changed`;
    setTimeout(function setProp() { element.setReadOnlyProperties({ [name]: synth }); });
    const { detail: { value } } = await oneEvent(element, eventName);
    expect(value, name).to.eql(synth);
  });
}

export function assertElementErrorMessage(message: string) {
  return function(): void {
    expect(element.error.message).to.equal(`<${element.tagName.toLowerCase()}>: ${message}`);
  };
}

/* ELEMENT METHODS */

export async function blur(): Promise<void> {
  element.blur();
}

export async function focus(): Promise<void> {
  element.focus();
}

export async function blurStripeElement(): Promise<void> {
  element.element.synthEvent('blur');
}

export async function focusStripeElement(): Promise<void> {
  element.element.synthEvent('focus');
}

export async function submit(): Promise<void> {
  const submitPromise = element.submit();
  // don't await result if we need to set up a listener
  if (!this?.currentTest?.title.startsWith('fires')) await submitPromise;
}

export async function reset(): Promise<void> {
  spyCardClear();
  element.reset();
  await element.updateComplete;
}

export async function createPaymentMethod(): Promise<void> {
  element.createPaymentMethod();
  // don't await result if we need to set up a listener
  if (!this?.currentTest?.title.startsWith('fires')) await nextFrame();
}

export async function createSource(): Promise<void> {
  element.createSource();
  // don't await result if we need to set up a listener
  if (!this?.currentTest?.title.startsWith('fires')) await nextFrame();
}

export async function createToken(): Promise<void> {
  element.createToken();
  // don't await result if we need to set up a listener
  if (!this?.currentTest?.title.startsWith('fires')) await nextFrame();
}

export async function validate(): Promise<void> {
  element.validate();
  await element.updateComplete;
}

export function setProps(props) {
  return async function doSetProps(): Promise<void> {
    Object.entries(props).forEach(([name, value]) => {
      element[name] = value;
    });
    await element.updateComplete;
  };
}

export function synthCardEvent(...args) {
  return function(): void {
    element.element.synthEvent(...args);
  };
}

export function synthPaymentRequestEvent(...args) {
  return function(): void {
    element.paymentRequest.synthEvent(...args);
  };
}

export function synthStripeFormValues(inputs) {
  return async function(): Promise<void> {
    element?.card?.setState(inputs);
    await oneEvent(element, 'stripe-change');
    await element.updateComplete;
  };
}
