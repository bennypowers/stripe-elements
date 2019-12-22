import './stripe-elements';

import { expect, fixture, oneEvent, nextFrame, aTimeout } from '@open-wc/testing';
import { html, render } from 'lit-html';
import { spy, stub } from 'sinon';

import 'chai-things';
import 'sinon-chai';

import {
  INCOMPLETE_CARD_KEY,
  MockedStripeAPI,
  PUBLISHABLE_KEY,
  SHOULD_ERROR_KEY,
  SUCCESSFUL_SOURCE,
  SUCCESSFUL_TOKEN,
  TOKEN_ERROR_KEY,
} from '../test/mock-stripe';

function appendTemplate(template, target) {
  const tmp = document.createElement('div');
  render(template, tmp);
  const { firstElementChild } = tmp;
  target.appendChild(firstElementChild);
  tmp.remove();
  return firstElementChild;
}

customElements.define('x-host', class XHost extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<stripe-elements></stripe-elements>`;
    this.stripeElements = this.shadowRoot.firstElementChild;
  }
});

function camelCaseToDash( myStr ) {
  return myStr.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
}

const NO_STRIPE_JS = `<stripe-elements> requires Stripe.js to be loaded first.`;
const INCOMPLETE_CC_INFO = 'Credit card information is incomplete.';
const EMPTY_CC_INFO = 'Credit card information is empty.';

afterEach(function removeGlobalStyles() {
  const globalStyles = document.getElementById('stripe-elements-custom-css-properties');
  if (globalStyles) globalStyles.remove();
});

describe('stripe-elements', function() {
  it('instantiates without error', async function noInitialError() {
    const element = await fixture(`<stripe-elements></stripe-elements>`);
    expect(element.constructor.is).to.equal('stripe-elements');
  });

  describe('default properties', function defaults() {
    [
      { name: 'action', default: undefined },
      { name: 'brand', default: null },
      { name: 'card', default: null },
      { name: 'elements', default: null },
      { name: 'error', default: null },
      { name: 'hasError', default: false },
      { name: 'hideIcon', default: false },
      { name: 'hidePostalCode', default: false },
      { name: 'iconStyle', default: 'default' },
      { name: 'isComplete', default: false },
      { name: 'isEmpty', default: true },
      { name: 'source', default: null },
      { name: 'stripe', default: null },
      { name: 'token', default: null },
      { name: 'value', default: {} },
    ].forEach(prop => {
      it(prop.name, async function() {
        const element = await fixture(`<stripe-elements></stripe-elements>`);
        expect(element[prop.name]).to.eql(prop.default);
      });
    });
  });

  describe('read-only properties', function readOnly() {
    [
      'brand',
      'card',
      'elements',
      'error',
      'hasError',
      'isComplete',
      'isEmpty',
      'source',
      'stripe',
      'stripeReady',
      'token',
    ].forEach(prop => {
      it(prop, async function() {
        const element = await fixture(`<stripe-elements></stripe-elements>`);
        const init = element[prop];
        expect(() => element[prop] = Math.random()).to.throw;
        expect(element[prop]).to.equal(init);
      });
    });
  });

  describe('notifying public properties', function notifying() {
    [
      'publishableKey',
    ].forEach(prop => {
      it(prop, async function() {
        window.Stripe = {};
        const element = await fixture(`<stripe-elements></stripe-elements>`);
        const synth = Math.random();
        setTimeout(() => {
          element[prop] = synth;
        });
        const eventName = `${camelCaseToDash(prop)}-changed`;
        const { detail: { value } } = await oneEvent(element, eventName);
        expect(value).to.eql(synth);
        delete window.Stripe;
      });
    });
  });

  describe('document styles', function() {
    it('appends a stylesheet to the document when absent', async function globalStylesWhen() {
      await fixture(`<stripe-elements></stripe-elements>`);
      const globalStyles = document.getElementById('stripe-elements-custom-css-properties');
      expect(globalStyles).to.not.be.null;
    });

    it('doesnt append a stylesheet to the document when present', async function globalStylesWhen() {
      const style = document.createElement('style');
      style.id = 'stripe-elements-custom-css-properties';
      document.head.appendChild(style);
      await fixture(`<stripe-elements></stripe-elements>`);
      const globalStyles = document.getElementById('stripe-elements-custom-css-properties');
      expect(globalStyles).to.equal(style);
    });
  });

  describe('ShadyDOM support', function shadyDOM() {
    it('appends a shady-dom mount point', async function shadyMount() {
      window.ShadyDOM = {};
      const element = await fixture(`<stripe-elements></stripe-elements>`);
      expect(element.querySelector('form')).to.be.ok;
      expect(element.querySelector('[aria-label="Credit or Debit Card"]')).to.be.ok;
      expect(element.querySelector('input[name="stripeToken"]')).to.be.ok;
      expect(element.querySelectorAll('form').length).to.equal(1);
    });

    it('only appends once', async function shadyMount() {
      window.ShadyDOM = {};
      const element = await fixture(`<stripe-elements></stripe-elements>`);
      element.firstUpdated();
      expect(element.querySelectorAll('form').length).to.equal(1);
      delete window.ShadyDOM;
    });
  });

  describe('Shadow DOM support', function shadowDOM() {
    it('leaves breadcrumbs on its way up to the document', async function breadcrumbs() {
      const host = await fixture(`<x-host></x-host>`);
      const element = host.stripeElements;
      const target = document.querySelector('[aria-label="Credit or Debit Card"]');
      const [slottedChild] = element.querySelector('slot').assignedNodes();

      expect(slottedChild).to.contain(target);
    });
  });

  describe('with a publishable key', function apiKey() {
    describe('without Stripe.js', function withoutStripe() {
      beforeEach(function stubConsole() {
        stub(console, 'warn');
      });

      afterEach(function restoreConsole() {
        console.warn.restore();
      });

      it('logs a warning', async function logsWarning() {
        const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
        expect(console.warn).to.have.been.calledWith(NO_STRIPE_JS);
        expect(element.stripe).to.not.be.ok;
      });

      it('does not initialize stripe instance', async function noStripeInit() {
        const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
        expect(element.stripe).to.not.be.ok;
      });

      it('does not mount card', async function noCard() {
        const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
        expect(element.card).to.not.be.ok;
      });

      it('sets the error', async function setsError() {
        const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
        expect(element.error).to.eql({ message: NO_STRIPE_JS });
      });

      it('throws an error when creating token', async function submit() {
        const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
        return element.createToken()
          .then(() => expect.fail('Resolved token promise without Stripe.js'))
          .catch(err => expect(err.message).to.equal('Cannot create token before initializing Stripe'));
      });

      it('throws an error when creating source', async function submit() {
        const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
        return element.createSource()
          .then(() => expect.fail('Resolved source promise without Stripe.js'))
          .catch(err => expect(err.message).to.equal('Cannot create source before initializing Stripe'));
      });
    });

    describe('with mocked Stripe.js', function withMockedStripeJs() {
      beforeEach(function mockStripe() {
        window.Stripe = (key, opts) => new MockedStripeAPI(key, opts);
      });

      afterEach(function restoreMock() {
        delete window.Stripe;
      });

      it('initializes stripe instance', async function stripeInit() {
        const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
        expect(element.stripe).to.be.ok;
      });

      it('initializes elements instance', async function elementsInit() {
        const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
        expect(element.elements).to.be.ok;
      });

      it('mounts a card into the target', async function cardInit() {
        const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
        expect(element.card).to.be.ok;
      });

      describe('when pk is reset', function pkReset() {
        it('reinitializes stripe', async function() {
          const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
          const initial = element.stripe;
          element.publishableKey = 'foo';
          await element.updateComplete;
          expect(element.stripe).to.not.equal(initial);
        });
      });

      describe('when pk is unset', function pkReset() {
        it('unsets stripe instance', async function() {
          const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
          element.publishableKey = '';
          await element.updateComplete;
          expect(element.stripe).to.be.null;
        });

        it('unsets element instance', async function() {
          const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
          element.publishableKey = '';
          await element.updateComplete;
          expect(element.elements).to.be.null;
        });

        it('unsets card', async function() {
          const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
          element.publishableKey = '';
          await element.updateComplete;
          expect(element.card).to.be.null;
        });
      });

      describe('when dom is screwed before pk is set', function pkReset() {
        it('rebuilds its dom', async function() {
          const element = await fixture(`<stripe-elements></stripe-elements>`);
          element.stripeMount.remove();
          element.publishableKey = PUBLISHABLE_KEY;
          await element.updateComplete;
          expect(element.stripeMount).to.be.ok;
          expect(element.querySelector('form')).to.be.ok;
        });

        it('uses a new id', async function() {
          const element = await fixture(`<stripe-elements></stripe-elements>`);
          const initial = element.stripeMount.id;
          element.stripeMount.remove();
          element.publishableKey = PUBLISHABLE_KEY;
          await element.updateComplete;
          expect(element.stripeMount.id).to.not.equal(initial);
        });

        it('rebuilds the whole trail', async function() {
          const element = await fixture(`<stripe-elements></stripe-elements>`);
          element.stripeMount.remove();
          element.publishableKey = PUBLISHABLE_KEY;
          await element.updateComplete;
          expect(element.stripeMount).to.be.ok;
          expect(element.querySelector('form')).to.be.ok;
        });
      });

      describe('when stripe fires change', function() {
        it('fires a stripe-change event', async function() {
          const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
          const details = { foo: 'bar' };
          setTimeout(() => element.card.synthEvent(details));
          const { detail } = await oneEvent(element, 'stripe-change');
          expect(detail.foo).to.equal('bar');
        });
      });

      describe('when card is ready', function cardReady() {
        it('fires stripe-ready event', async function() {
          const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
          setTimeout(() => element.card.synthEvent('ready'));
          const ev = await oneEvent(element, 'stripe-ready');
          expect(ev).to.be.ok;
        });

        it('fires stripe-ready-changed event', async function() {
          const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
          setTimeout(() => element.card.synthEvent('ready'));
          const ev = await oneEvent(element, 'stripe-ready-changed');
          expect(ev.detail.value).to.be.true;
        });

        it('sets stripeReady', async function() {
          const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
          element.card.synthEvent('ready');
          expect(element.stripeReady).to.be.true;
        });
      });

      describe('when card changes', function cardChange() {
        describe('when empty changes', function emptyChange() {
          it('fires is-empty-changed event', async function isEmptyChanged() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            const synth = Math.random() + 1;
            setTimeout(() => element.card.synthEvent({ empty: synth }));
            const ev = await oneEvent(element, 'is-empty-changed');
            expect(ev.detail.value).to.equal(synth);
          });

          it('sets isEmpty', async function setsIsEmpty() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            element.card.synthEvent({ empty: true });
            expect(element.isEmpty).to.be.true;
          });

          describe('validating empty card', function() {
            it('is false', async function validating() {
              const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
              element.card.synthEvent({ brand: 'visa', complete: false, empty: true });
              await element.updateComplete;
              expect(element.validate()).to.be.false;
            });

            it('sets error', async function validating() {
              const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
              element.card.synthEvent({ brand: 'visa', complete: false, empty: true });
              element.validate();
              await nextFrame();
              await element.updateComplete;
              expect(element.error).to.equal(EMPTY_CC_INFO);
            });
          });
        });

        describe('when complete changes', function emptyChange() {
          it('fires is-complete-changed event', async function isEmptyChanged() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            const synth = Math.random() + 1;
            setTimeout(() => element.card.synthEvent({ complete: synth }));
            const ev = await oneEvent(element, 'is-complete-changed');
            expect(ev.detail.value).to.equal(synth);
          });

          it('sets isComplete', async function setsIsEmpty() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            element.card.synthEvent({ complete: true });
            expect(element.isComplete).to.be.true;
          });

          describe('validating incomplete card', function() {
            it('is false', async function validating() {
              const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
              element.card.synthEvent({ brand: 'visa', complete: false, empty: false });
              await element.updateComplete;
              expect(element.validate()).to.be.false;
            });

            it('sets error', async function validating() {
              const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
              element.card.synthEvent({ brand: 'visa', complete: false, empty: false });
              await element.updateComplete;
              element.validate();
              await element.updateComplete;
              expect(element.error).to.equal(INCOMPLETE_CC_INFO);
            });
          });
        });

        describe('when brand changes', function brandChange() {
          it('fires brand-changed event', async function brandChanged() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            const synth = Math.random() + 1;
            setTimeout(() => element.card.synthEvent({ brand: synth }));
            const ev = await oneEvent(element, 'brand-changed');
            expect(ev.detail.value).to.equal(synth);
          });

          it('sets brand', async function setsBrand() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            const brand = 'visa';
            element.card.synthEvent({ brand });
            expect(element.brand).to.equal(brand);
          });
        });

        describe('when error changes', function errorChange() {
          it('fires error-changed event', async function errorChanged() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            const synth = Math.random() + 1;
            setTimeout(() => element.card.synthEvent({ error: synth }));
            const ev = await oneEvent(element, 'error-changed');
            expect(ev.detail.value).to.equal(synth);
          });

          it('sets error', async function setsError() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            element.card.synthEvent({ error: { message: 'foo' } });
            expect(element.error).to.eql({ message: 'foo' });
          });

          it('sets hasError', async function setsError() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            element.card.synthEvent({ error: { message: 'foo' } });
            expect(element.hasError).to.be.true;
          });
        });

        describe('potentially valid', function() {
          it('is true when neither incomplete, empty nor with error', async function validating() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            element.card.synthEvent({ brand: 'visa', complete: false, empty: false });
            await element.updateComplete;
            expect(element.isPotentiallyValid()).to.be.true;
          });
        });

        describe('reset', function() {
          it('unsets error', async function() {
            const element = await fixture(`<stripe-elements publishable-key="${SHOULD_ERROR_KEY}"></stripe-elements>`);
            // set some arbitrary initial state
            element.card.synthEvent({ brand: 'visa', complete: false, empty: false });
            await nextFrame();
            expect(element.error).to.not.be.null;
            element.reset();
            await element.updateComplete;
            expect(element.error).to.be.null;
          });

          it('clears the card', async function() {
            const element = await fixture(`<stripe-elements publishable-key="${SHOULD_ERROR_KEY}"></stripe-elements>`);
            element.card.synthEvent({ brand: 'visa', complete: true, empty: false });
            stub(element.card, 'clear');
            element.reset();
            await nextFrame();
            await element.updateComplete;
            expect(element.card.clear).to.have.been.called;
            element.card.clear.restore();
          });
        });
      });

      describe('when createSource called', function submitting() {
        describe('when card is incomplete', function() {
          it('does nothing', async function submit() {
            const element = await fixture(`<stripe-elements publishable-key="${INCOMPLETE_CARD_KEY}"></stripe-elements>`);
            element.createSource();
            expect(element.token).to.be.null;
            expect(element.source).to.be.null;
            expect(element.error).to.be.null;
          });
        });

        describe('when createSource throws', function throws() {
          it('sets error', async function() {
            const element = await fixture(`<stripe-elements publishable-key="${SHOULD_ERROR_KEY}"></stripe-elements>`);
            element.card.synthEvent({ brand: 'visa', complete: true, empty: false });
            element.createSource();
            await nextFrame();
            await element.updateComplete;
            expect(element.error).to.eql(SHOULD_ERROR_KEY);
            expect(element.token).to.be.null;
            expect(element.source).to.be.null;
          });

          describe('validating existing error', function() {
            it('is false', async function validating() {
              const element = await fixture(`<stripe-elements publishable-key="${SHOULD_ERROR_KEY}"></stripe-elements>`);
              element.card.synthEvent({ brand: 'visa', complete: false, empty: false });
              await element.updateComplete;
              expect(element.validate()).to.be.false;
            });

            it('retains error', async function validating() {
              const element = await fixture(`<stripe-elements publishable-key="${TOKEN_ERROR_KEY}"></stripe-elements>`);
              element.card.synthEvent({ brand: 'visa', complete: true, empty: false });
              element.createSource();
              await nextFrame();
              await element.updateComplete;
              element.validate();
              expect(element.error).to.equal(TOKEN_ERROR_KEY);
              expect(element.token).to.be.null;
              expect(element.source).to.be.null;
            });
          });
        });

        describe('when createSource returns error', function throws() {
          it('sets error', async function() {
            const element = await fixture(`<stripe-elements publishable-key="${TOKEN_ERROR_KEY}"></stripe-elements>`);
            element.card.synthEvent({ brand: 'visa', complete: true, empty: false });
            element.createSource();
            await nextFrame();
            await element.updateComplete;
            expect(element.error).to.eql(TOKEN_ERROR_KEY);
            expect(element.token).to.be.null;
            expect(element.source).to.be.null;
          });
        });

        describe('when source is returned', function() {
          it('sets source', async function submit() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            element.card.synthEvent({ brand: 'visa', complete: true, empty: false });
            await element.updateComplete;
            element.createSource();
            await element.updateComplete;
            expect(element.source).to.equal(SUCCESSFUL_SOURCE);
          });

          it('fires source-changed', async function submit() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            element.card.synthEvent({ brand: 'visa', complete: true, empty: false });
            await element.updateComplete;
            setTimeout(() => element.createSource());
            const ev = await oneEvent(element, 'source-changed');
            expect(ev.detail.value).to.equal(SUCCESSFUL_SOURCE);
          });

          it('fires stripe-source', async function submit() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            element.card.synthEvent({ brand: 'visa', complete: true, empty: false });
            await element.updateComplete;
            setTimeout(() => element.createSource());
            const ev = await oneEvent(element, 'stripe-source');
            expect(ev.detail).to.equal(SUCCESSFUL_SOURCE);
          });

          describe('when there is an action', function() {
            it('submits the form', async function submit() {
              const element = await fixture(`<stripe-elements action="/here" publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
              await element.updateComplete;
              const { form } = element;
              const subStub = stub(form, 'submit');
              element.card.synthEvent({ brand: 'visa', complete: true, empty: false });
              element.createSource();
              await aTimeout(100);
              expect(subStub).to.have.been.called;
              subStub.restore();
            });
          });

          describe('validating good token', function() {
            it('is true', async function validating() {
              const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
              element.card.synthEvent({ brand: 'visa', complete: true, empty: false });
              await element.updateComplete;
              expect(element.validate()).to.be.true;
              expect(element.error).to.not.be.ok;
            });

            it('it is also "potentially" valid', async function validating() {
              const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
              element.card.synthEvent({ brand: 'visa', complete: true, empty: false });
              await element.updateComplete;
              expect(element.isPotentiallyValid()).to.be.true;
              expect(element.error).to.not.be.ok;
            });
          });
        });
      });

      describe('when createToken called', function submitting() {
        describe('when card is incomplete', function() {
          it('does nothing', async function submit() {
            const element = await fixture(`<stripe-elements publishable-key="${INCOMPLETE_CARD_KEY}"></stripe-elements>`);
            element.createToken();
            expect(element.token).to.be.null;
            expect(element.source).to.be.null;
            expect(element.error).to.be.null;
          });
        });

        describe('when createToken throws', function throws() {
          it('sets error', async function() {
            const element = await fixture(`<stripe-elements publishable-key="${SHOULD_ERROR_KEY}"></stripe-elements>`);
            element.card.synthEvent({ brand: 'visa', complete: true, empty: false });
            element.createToken();
            await nextFrame();
            await element.updateComplete;
            expect(element.error).to.eql(SHOULD_ERROR_KEY);
            expect(element.token).to.be.null;
            expect(element.source).to.be.null;
          });

          describe('validating existing error', function() {
            it('is false', async function validating() {
              const element = await fixture(`<stripe-elements publishable-key="${SHOULD_ERROR_KEY}"></stripe-elements>`);
              element.card.synthEvent({ brand: 'visa', complete: false, empty: false });
              await element.updateComplete;
              expect(element.validate()).to.be.false;
            });

            it('retains error', async function validating() {
              const element = await fixture(`<stripe-elements publishable-key="${TOKEN_ERROR_KEY}"></stripe-elements>`);
              element.card.synthEvent({ brand: 'visa', complete: true, empty: false });
              element.createToken();
              await nextFrame();
              await element.updateComplete;
              element.validate();
              expect(element.error).to.equal(TOKEN_ERROR_KEY);
              expect(element.token).to.be.null;
              expect(element.source).to.be.null;
            });
          });
        });

        describe('when createToken returns error', function throws() {
          it('sets error', async function() {
            const element = await fixture(`<stripe-elements publishable-key="${TOKEN_ERROR_KEY}"></stripe-elements>`);
            element.card.synthEvent({ brand: 'visa', complete: true, empty: false });
            element.createToken();
            await nextFrame();
            await element.updateComplete;
            expect(element.error).to.eql(TOKEN_ERROR_KEY);
            expect(element.token).to.be.null;
            expect(element.source).to.be.null;
          });
        });

        describe('when token is returned', function() {
          it('sets token', async function submit() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            element.card.synthEvent({ brand: 'visa', complete: true, empty: false });
            await element.createToken();
            await element.updateComplete;
            expect(element.token).to.equal(SUCCESSFUL_TOKEN);
          });

          it('fires token-changed', async function submit() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            element.card.synthEvent({ brand: 'visa', complete: true, empty: false });
            setTimeout(() => element.createToken());
            const ev = await oneEvent(element, 'token-changed');
            expect(ev.detail.value).to.equal(SUCCESSFUL_TOKEN);
          });

          it('fires stripe-token', async function submit() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            element.card.synthEvent({ brand: 'visa', complete: true, empty: false });
            await element.updateComplete;
            setTimeout(() => element.createToken());
            const ev = await oneEvent(element, 'stripe-token');
            expect(ev.detail).to.equal(SUCCESSFUL_TOKEN);
          });

          describe('when there is an action', function() {
            it('submits the form', async function submit() {
              const element = await fixture(`<stripe-elements action="here" publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
              await element.updateComplete;
              const form = element.querySelector('form');
              const subStub = stub(form, 'submit');
              element.card.synthEvent({ brand: 'visa', complete: true, empty: false });
              element.createToken();
              await aTimeout(100);
              expect(subStub).to.have.been.called;
              subStub.restore();
            });
          });

          describe('validating good token', function() {
            it('is true', async function validating() {
              const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
              element.card.synthEvent({ brand: 'visa', complete: true, empty: false });
              await element.updateComplete;
              expect(element.validate()).to.be.true;
              expect(element.error).to.not.be.ok;
            });

            it('it is also "potentially" valid', async function validating() {
              const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
              element.card.synthEvent({ brand: 'visa', complete: true, empty: false });
              await element.updateComplete;
              expect(element.isPotentiallyValid()).to.be.true;
              expect(element.error).to.not.be.ok;
            });
          });
        });
      });

      describe('styling', function() {
        const allBlue = html`
            <style id="all-blue-styles">
            html {
              --stripe-elements-base-color:blue;
              --stripe-elements-base-font-family:blue;
              --stripe-elements-base-font-size:blue;
              --stripe-elements-base-font-smoothing:blue;
              --stripe-elements-base-font-style:blue;
              --stripe-elements-base-font-variant:blue;
              --stripe-elements-base-icon-color:blue;
              --stripe-elements-base-line-height:blue;
              --stripe-elements-base-letter-spacing:blue;
              --stripe-elements-base-text-decoration:blue;
              --stripe-elements-base-text-shadow:blue;
              --stripe-elements-base-text-transform:blue;
              --stripe-elements-complete-color:blue;
              --stripe-elements-complete-font-family:blue;
              --stripe-elements-complete-font-size:blue;
              --stripe-elements-complete-font-smoothing:blue;
              --stripe-elements-complete-font-style:blue;
              --stripe-elements-complete-font-variant:blue;
              --stripe-elements-complete-icon-color:blue;
              --stripe-elements-complete-line-height:blue;
              --stripe-elements-complete-letter-spacing:blue;
              --stripe-elements-complete-text-decoration:blue;
              --stripe-elements-complete-text-shadow:blue;
              --stripe-elements-complete-text-transform:blue;
              --stripe-elements-empty-color:blue;
              --stripe-elements-empty-font-family:blue;
              --stripe-elements-empty-font-size:blue;
              --stripe-elements-empty-font-smoothing:blue;
              --stripe-elements-empty-font-style:blue;
              --stripe-elements-empty-font-variant:blue;
              --stripe-elements-empty-icon-color:blue;
              --stripe-elements-empty-line-height:blue;
              --stripe-elements-empty-letter-spacing:blue;
              --stripe-elements-empty-text-decoration:blue;
              --stripe-elements-empty-text-shadow:blue;
              --stripe-elements-empty-text-transform:blue;
              --stripe-elements-invalid-color:blue;
              --stripe-elements-invalid-font-family:blue;
              --stripe-elements-invalid-font-size:blue;
              --stripe-elements-invalid-font-smoothing:blue;
              --stripe-elements-invalid-font-style:blue;
              --stripe-elements-invalid-font-variant:blue;
              --stripe-elements-invalid-icon-color:blue;
              --stripe-elements-invalid-line-height:blue;
              --stripe-elements-invalid-letter-spacing:blue;
              --stripe-elements-invalid-text-decoration:blue;
              --stripe-elements-invalid-text-shadow:blue;
              --stripe-elements-invalid-text-transform:blue;
            }
            </style>`;

        describe('with native shadowDOM', function() {
          beforeEach(function applyShim() {
            appendTemplate(allBlue, document.head);
          });

          afterEach(function removeShim() {
            document.getElementById('all-blue-styles').remove();
          });

          it('passes css custom styles to stripe', async function() {
            appendTemplate(allBlue, document.head);
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            await element.updateComplete;
            const allValues = Object.values(element.card.style).flatMap(Object.values);
            expect(allValues).to.all.equal('blue');
            document.getElementById('all-blue-styles').remove();
          });
        });

        describe('with mocked ShadyCSS', function() {
          const adoptedCssTextMap = {};

          beforeEach(function applyMock() {
            appendTemplate(allBlue, document.head);
            window.ShadyCSS = {
              getComputedStyleValue(el, name) {
                return getComputedStyle(el).getPropertyValue(name);
              },
              ScopingShim: {
                prepareAdoptedCssText(cssTextArray, elementName) {
                  adoptedCssTextMap[elementName] = cssTextArray.join(' ');
                },
              },
            };
            spy(window.ShadyCSS, 'getComputedStyleValue');
          });

          afterEach(function removeMock() {
            document.getElementById('all-blue-styles').remove();
            window.ShadyCSS.getComputedStyleValue.restore();
            delete window.ShadyCSS;
          });

          it('passes css custom styles to stripe', async function() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            await element.updateComplete;
            const allValues = Object.values(element.card.style).flatMap(Object.values);
            expect(allValues).to.all.equal('blue');
            expect(window.ShadyCSS.getComputedStyleValue).to.have.been.called;
          });
        });
      });
    });
  });
});
