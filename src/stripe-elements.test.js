/* istanbul ignore file */
import '../stripe-elements.js';

import { expect, fixture, oneEvent, nextFrame } from '@open-wc/testing';
import { match } from 'sinon';

import {
  BASE_DEFAULT_PROPS,
  BASE_NOTIFYING_PROPS,
  BASE_READ_ONLY_PROPS,
  EMPTY_CC_ERROR,
  NO_STRIPE_CREATE_PAYMENT_METHOD_ERROR,
  NO_STRIPE_CREATE_SOURCE_ERROR,
  NO_STRIPE_CREATE_TOKEN_ERROR,
  NO_STRIPE_JS_ERROR,
  appendAllBlueStyleTag,
  assertElementErrorMessage,
  assertEventDetail,
  assertFired,
  assertProps,
  assignedNodes,
  awaitEvent,
  blur,
  blurStripeElement,
  createPaymentMethod,
  createSource,
  createToken,
  element,
  expectedLightDOM,
  fetchStub,
  focus,
  focusStripeElement,
  initialStripe,
  initialStripeMountId,
  listenFor,
  mockShadyCSS,
  mockShadyDOM,
  mockStripe,
  mountLightDOM,
  noop,
  removeAllBlueStyleTag,
  removeStripeMount,
  reset,
  resetTestState,
  restoreCardClear,
  restoreConsoleWarn,
  restoreFetch,
  restoreGetComputedStyleValue,
  restoreShadyCSS,
  restoreShadyDOM,
  restoreStripe,
  restoreStripeElementBlur,
  restoreStripeElementFocus,
  setProps,
  setupNoProps,
  setupWithPublishableKey,
  spyConsoleWarn,
  spyGetComputedStyleValue,
  spyStripeElementBlur,
  spyStripeElementFocus,
  stubFetch,
  submit,
  synthCardEvent,
  synthStripeFormValues,
  testDefaultPropEntry,
  testReadOnlyProp,
  testReadonlyNotifyingProp,
  testWritableNotifyingProp,
  updateComplete,
  validate,
} from '../test/test-helpers';
import {
  CARD_DECLINED_ERROR,
  INCOMPLETE_CARD_ERROR,
  PUBLISHABLE_KEY,
  SHOULD_ERROR_KEY,
  SUCCESS_RESPONSES,
} from '../test/mock-stripe';
import { elem, not } from './lib/predicates.js';

const DEFAULT_PROPS = Object.freeze({
  ...BASE_DEFAULT_PROPS,
  brand: null,
  card: null,
  hideIcon: false,
  hidePostalCode: false,
  iconStyle: 'default',
  isComplete: false,
  isEmpty: true,
  stripe: null,
  token: null,
  value: {},
});

const READ_ONLY_PROPS = Object.freeze([
  ...BASE_READ_ONLY_PROPS,
  'brand',
  'card',
  'complete',
  'empty',
  'error',
  'invalid',
  'isComplete',
  'isEmpty',
  'ready',
  'stripeReady',
]);

const NOTIFYING_PROPS = Object.freeze([
  ...BASE_NOTIFYING_PROPS,
  'brand',
  'card',
  'complete',
  'empty',
  'error',
  'invalid',
  'isComplete',
  'isEmpty',
  'ready',
  'stripeReady',
]);

describe('<stripe-elements>', function() {
  beforeEach(spyConsoleWarn);
  afterEach(restoreConsoleWarn);
  afterEach(resetTestState);

  describe('simply instantiating', function() {
    beforeEach(setupNoProps);
    it('does not throw error', function noInitialError() {
      expect(element.tagName).to.equal('STRIPE-ELEMENTS');
    });

    describe('uses default for property', function defaults() {
      beforeEach(setupNoProps);
      Object.entries(DEFAULT_PROPS).forEach(testDefaultPropEntry);
    });

    describe('has read-only property', function readOnly() {
      beforeEach(setupNoProps);
      READ_ONLY_PROPS.forEach(testReadOnlyProp);
    });

    describe('notifies when setting property', function notifying() {
      beforeEach(setupNoProps);
      NOTIFYING_PROPS.filter(not(elem(READ_ONLY_PROPS))).forEach(testWritableNotifyingProp);
    });

    describe('notifies when privately setting read-only property', function notifying() {
      beforeEach(setupNoProps);
      READ_ONLY_PROPS.filter(elem(NOTIFYING_PROPS)).forEach(testReadonlyNotifyingProp);
    });
  });

  describe('when Mocked ShadyDOM polyfill is in use', function shadyDOM() {
    beforeEach(mockShadyDOM);
    beforeEach(setupNoProps);
    afterEach(restoreShadyDOM);

    describe('when connected to document', function() {
      it('appends a shady-dom mount point', function shadyMount() {
        expect(element).lightDom.to.equal(mountLightDOM(element));
      });
    });
  });

  describe('with Native Shadow DOM support', function shadowDOM() {
    let nestedElement;
    let primaryHost;
    let secondaryHost;
    let tertiaryHost;
    let stripeMountId;
    describe('when nested one shadow-root deep', function() {
      beforeEach(async function setupOneRoot() {
        primaryHost = await fixture(`<primary-host tag="stripe-elements"></primary-host>`);
        ({ nestedElement } = primaryHost);
        ({ stripeMountId } = nestedElement);
      });

      it('leaves one breadcrumb on its way up to the document', async function breadcrumbs() {
        const [slottedChild] = nestedElement.querySelector('slot').assignedNodes();
        expect(slottedChild).to.contain(nestedElement.stripeMount);
      });

      it('slots mount point in to its light DOM', function() {
        expect(primaryHost).lightDom.to.equal(expectedLightDOM({ stripeMountId, tagName: nestedElement.constructor.is }));
      });

      it('does not break primary host\'s internal DOM', function() {
        expect(primaryHost).shadowDom.to.equal(`
          <h1>Other Primary Host Content</h1>
          <stripe-elements publishable-key="${PUBLISHABLE_KEY}">
            <slot name="stripe-card" slot="stripe-card"></slot>
          </stripe-elements>
        `);
      });
    });

    describe('when nested two shadow-roots deep', function() {
      beforeEach(async function setupTwoRoots() {
        secondaryHost = await fixture(`<secondary-host tag="stripe-elements"></secondary-host>`);
        ({ primaryHost } = secondaryHost);
        ({ nestedElement } = primaryHost);
        ({ stripeMountId } = nestedElement);
      });

      it('forwards stripe mount deeply through slots', async function breadcrumbs() {
        const [slottedChild] =
          primaryHost.shadowRoot.querySelector('slot')
            .assignedNodes()
            .flatMap(assignedNodes);
        expect(slottedChild).to.contain(nestedElement.stripeMount);
      });

      it('slots mount point in to the light DOM of the secondary shadow host', function() {
        expect(secondaryHost).lightDom.to.equal(expectedLightDOM({ stripeMountId, tagName: nestedElement.constructor.is }));
      });

      it('appends a slot to the shadow DOM of the secondary shadow host', function() {
        expect(secondaryHost).shadowDom.to.equal(`
          <primary-host tag="stripe-elements">
            <slot name="stripe-card" slot="stripe-card"></slot>
          </primary-host>
        `);
      });

      it('only creates one slot', function() {
        expect(document.getElementById(stripeMountId)).to.be.ok;
        expect(document.querySelectorAll(`#${stripeMountId}`).length).to.equal(1);
        expect(document.querySelectorAll('[slot="stripe-card"]').length).to.equal(1);
      });
    });

    describe('when nested three shadow-roots deep', function() {
      beforeEach(async function setupThreeRoots() {
        tertiaryHost = await fixture(`<tertiary-host tag="stripe-elements"></tertiary-host>`);
        ({ secondaryHost } = tertiaryHost);
        ({ primaryHost } = secondaryHost);
        ({ nestedElement } = primaryHost);
        ({ stripeMountId } = nestedElement);
      });

      it('forwards stripe mount deeply through slots', async function breadcrumbs() {
        const [slottedChild] =
          primaryHost.shadowRoot.querySelector('slot')
            .assignedNodes()
            .flatMap(assignedNodes)
            .flatMap(assignedNodes);
        expect(slottedChild).to.contain(nestedElement.stripeMount);
      });

      it('slots mount point in to the light DOM of the tertiary shadow host', function() {
        expect(tertiaryHost).lightDom.to.equal(expectedLightDOM({ stripeMountId, tagName: nestedElement.constructor.is }));
      });

      it('appends a slot to the shadow DOM of the tertiary shadow host', function() {
        expect(tertiaryHost).shadowDom.to.equal(`
          <secondary-host tag="stripe-elements">
            <slot name="stripe-card" slot="stripe-card"></slot>
          </secondary-host>
        `);
      });

      it('appends a slot to the shadow DOM of the secondary shadow host', function() {
        expect(secondaryHost).shadowDom.to.equal(`
          <primary-host tag="stripe-elements">
            <slot name="stripe-card" slot="stripe-card"></slot>
          </primary-host>
        `);
      });

      it('only creates one slot', function() {
        expect(document.getElementById(stripeMountId)).to.be.ok;
        expect(document.querySelectorAll(`#${stripeMountId}`).length).to.equal(1);
        expect(document.querySelectorAll('[slot="stripe-card"]').length).to.equal(1);
      });
    });
  });

  describe('without Stripe.js', function withoutStripe() {
    beforeEach(restoreStripe);
    describe('with a valid publishable key', function apiKey() {
      beforeEach(setupWithPublishableKey(PUBLISHABLE_KEY));

      it('logs a warning', async function logsWarning() {
        expect(console.warn).to.have.been.calledWith(`<${element.constructor.is}>: ${NO_STRIPE_JS_ERROR}`);
      });

      it('does not initialize stripe instance', async function noStripeInit() {
        expect(element.stripe).to.not.be.ok;
      });

      it('does not mount element', async function noElement() {
        expect(element.element).to.not.be.ok;
      });

      it('sets the `error` property', assertElementErrorMessage(NO_STRIPE_JS_ERROR));

      it('throws an error when creating payment method', async function() {
        try {
          await element.createPaymentMethod();
          expect.fail('Resolved source promise without Stripe.js');
        } catch (err) {
          expect(err.message).to.equal(`<${element.constructor.is}>: ${NO_STRIPE_CREATE_PAYMENT_METHOD_ERROR}`);
        }
      });

      it('throws an error when creating token', async function() {
        try {
          await element.createToken();
          expect.fail('Resolved token promise without Stripe.js');
        } catch (err) {
          expect(err.message).to.equal(`<${element.constructor.is}>: ${NO_STRIPE_CREATE_TOKEN_ERROR}`);
        }
      });

      it('throws an error when creating source', async function() {
        try {
          await element.createSource();
          expect.fail('Resolved source promise without Stripe.js');
        } catch (err) {
          expect(err.message).to.equal(`<${element.constructor.is}>: ${NO_STRIPE_CREATE_SOURCE_ERROR}`);
        }
      });

      it('throws an error when calling submit', async function() {
        try {
          await element.submit();
          expect.fail('Resolved submit promise without Stripe.js');
        } catch (err) {
          expect(err.message).to.equal(`<${element.constructor.is}>: ${NO_STRIPE_CREATE_SOURCE_ERROR}`);
        }
      });
    });
  });

  describe('with mocked Stripe.js', function withMockedStripeJs() {
    beforeEach(mockStripe);
    afterEach(restoreStripe);
    describe('and CSS custom properties applied', function() {
      beforeEach(appendAllBlueStyleTag);
      afterEach(removeAllBlueStyleTag);
      describe('with a mocked ShadyCSS shim', function() {
        beforeEach(mockShadyCSS);
        beforeEach(spyGetComputedStyleValue);
        afterEach(restoreShadyCSS);
        afterEach(restoreGetComputedStyleValue);
        describe('with a valid publishable key', function() {
          beforeEach(setupWithPublishableKey(PUBLISHABLE_KEY));
          describe('and a valid card', function() {
            beforeEach(synthStripeFormValues({ cardNumber: '4242424242424242', mm: '01', yy: '40', cvc: '000' }));
            it('passes CSS custom property values to stripe', function() {
              const allValues = Object.values(element.card.style).flatMap(Object.values);
              expect(allValues).to.all.equal('blue');
            });
          });
        });
      });

      describe('without the ShadyCSS shim', function() {
        describe('with a valid publishable key', function() {
          beforeEach(setupWithPublishableKey(PUBLISHABLE_KEY));
          describe('and a valid card', function() {
            beforeEach(synthStripeFormValues({ cardNumber: '4242424242424242', mm: '01', yy: '40', cvc: '000' }));
            it('passes CSS custom property values to stripe', function() {
              const allValues = Object.values(element.card.style).flatMap(Object.values);
              expect(allValues).to.all.equal('blue');
            });
          });
        });
      });
    });

    describe('and no publishable key', function() {
      beforeEach(setupNoProps);
      describe('when stripe mount point is removed from DOM', function() {
        beforeEach(removeStripeMount);
        describe('then publishable key is set', function() {
          beforeEach(setProps({ publishableKey: PUBLISHABLE_KEY }));
          beforeEach(nextFrame);
          it('rebuilds its DOM', function() {
            const { stripeMountId } = element;
            expect(element).lightDom.to.equal(expectedLightDOM({ stripeMountId }));
            expect(element.stripeMount, 'mount').to.be.ok;
          });

          it('uses a new id', function() {
            expect(element.stripeMount.id).to.not.equal(initialStripeMountId);
          });
        });
      });
    });

    describe('and an invalid publishable key', function() {
      beforeEach(setupWithPublishableKey(SHOULD_ERROR_KEY));
      describe('and a complete, valid form', function() {
        beforeEach(synthStripeFormValues({ cardNumber: '4242424242424242', mm: '01', yy: '40', cvc: '000' }));

        describe('calling createPaymentMethod()', function() {
          beforeEach(createPaymentMethod);
          it('unsets the `paymentMethod` property', assertProps({ paymentMethod: null }));
          it('sets the `error` property', function() {
            expect(element.error.message, 'error').to.equal(SHOULD_ERROR_KEY);
          });
        });

        describe('calling createSource()', function() {
          beforeEach(createSource);
          it('unsets the `source` property', assertProps({ source: null }));
          it('sets the `error` property', function() {
            expect(element.error.message, 'error').to.equal(SHOULD_ERROR_KEY);
          });
        });

        describe('calling createToken()', function() {
          beforeEach(createToken);
          it('unsets the `token` property', assertProps({ token: null }));
          it('sets the `error` property', function() {
            expect(element.error.message, 'error').to.equal(SHOULD_ERROR_KEY);
          });
        });

        describe('calling submit()', function() {
          it('sets the `error` property', function() {
            return element.submit().then(expect.fail, function() {
              expect(element.error.message, 'error').to.equal(SHOULD_ERROR_KEY);
              expect(element.source, 'source').to.be.null;
            });
          });
        });

        describe('calling validate()', function() {
          beforeEach(validate);
          it('returns true', function validating() {
            expect(element.validate()).to.be.true;
          });

          it('unsets the `error` property', assertProps({ error: null }));
        });
      });
    });

    describe('and a valid publishable key', function() {
      beforeEach(setupWithPublishableKey(PUBLISHABLE_KEY));
      beforeEach(nextFrame);

      it('initializes stripe instance', async function stripeInit() {
        expect(element.stripe).to.be.ok;
      });

      it('initializes elements instance', async function elementsInit() {
        expect(element.elements).to.be.ok;
      });

      it('mounts a card into the target', async function cardInit() {
        expect(element.card).to.be.ok;
        expect(element.element).to.be.ok;
        expect(element.card).to.equal(element.element);
      });

      describe('calling blur()', function() {
        beforeEach(spyStripeElementBlur);
        beforeEach(blur);
        afterEach(restoreStripeElementBlur);
        it('calls StripeElement#blur', function() {
          expect(element.element.blur).to.have.been.called;
        });
      });

      describe('calling focus()', function() {
        beforeEach(spyStripeElementFocus);
        beforeEach(focus);
        afterEach(restoreStripeElementFocus);
        it('calls StripeElement#focus', function() {
          expect(element.element.focus).to.have.been.called;
        });
      });

      describe('when stripe element is focused', function() {
        beforeEach(focusStripeElement);
        beforeEach(updateComplete);
        it('sets the `focused` property', assertProps({ focused: true }));
      });

      describe('when stripe element is blurred', function() {
        beforeEach(focusStripeElement);
        beforeEach(updateComplete);
        beforeEach(blurStripeElement);
        beforeEach(updateComplete);
        it('unsets the `focused` property', assertProps({ focused: false }));
      });

      describe('when publishable key is changed', function publishableKeyReset() {
        let initialStripeMountId;
        beforeEach(function() { initialStripeMountId = element.stripeMountId; });
        beforeEach(setProps({ publishableKey: 'foo' }));
        beforeEach(nextFrame);
        afterEach(function() { initialStripeMountId = undefined; });
        it('reinitializes stripe', function() { expect(element.stripe).to.be.ok.and.not.equal(initialStripe); });
        it('uses a new mount point id', function() { expect(element.stripeMountId).to.be.ok.and.not.equal(initialStripeMountId); });
      });

      describe('when publishable key is unset', function pkReset() {
        beforeEach(setProps({ publishableKey: undefined }));
        beforeEach(nextFrame);

        it('unsets stripe instance', function() {
          expect(element.stripe).to.be.null;
        });

        it('unsets element instance', function() {
          expect(element.elements).to.be.null;
        });

        it('unsets card', function() {
          expect(element.card).to.be.null;
        });
      });

      describe('calling validate()', function() {
        beforeEach(validate);

        it('returns false', function() {
          expect(element.validate()).to.be.false;
        });

        it('sets the `error` property', assertElementErrorMessage(EMPTY_CC_ERROR));
      });

      describe('calling isPotentiallyValid()', function() {
        it('returns false', function callingIsPotentiallyValidWithoutCard() {
          expect(element.isPotentiallyValid()).to.be.false;
        });

        it('does not set the `error` property', function() {
          expect(element.error).to.be.null;
        });
      });

      describe('calling createPaymentMethod()', function() {
        beforeEach(createPaymentMethod);
        it('sets the `error` property', assertProps({ error: INCOMPLETE_CARD_ERROR }));
        it('unsets the `paymentMethod` property', assertProps({ paymentMethod: null }));
      });

      describe('calling createSource()', function callingCreateSource() {
        beforeEach(createSource);
        it('sets the `error` property', assertProps({ error: INCOMPLETE_CARD_ERROR }));
        it('unsets the `source` property', assertProps({ source: null }));
      });

      describe('calling createToken()', function() {
        beforeEach(createToken);
        it('sets the `error` property', assertProps({ error: INCOMPLETE_CARD_ERROR }));
        it('unsets the `token` property', assertProps({ token: null }));
      });

      describe('calling submit()', function() {
        it('sets the `error` property', function() {
          element.submit().then(expect.fail, function() {
            expect(element.error, 'error').to.equal(INCOMPLETE_CARD_ERROR);
            expect(element.source, 'source').to.be.null;
          });
        });
      });

      describe('when stripe fires `ready` event', function cardReady() {
        beforeEach(listenFor('ready'));
        beforeEach(listenFor('stripe-ready-changed'));
        beforeEach(synthCardEvent('ready'));
        it('fires `ready` event', assertFired('ready'));
        it('fires `stripe-ready-changed` event', assertEventDetail('stripe-ready-changed', { value: true }));
        describe('after `ready` event', function() {
          beforeEach(awaitEvent('ready'));
          it('sets `stripeReady` property', assertProps({ stripeReady: true }));
        });
      });

      describe('when stripe fires `change` event', function cardChange() {
        beforeEach(listenFor('change'));
        beforeEach(synthCardEvent('change'));
        describe('with a `brand` property', function brandChange() {
          const brand = 'visa';
          beforeEach(listenFor('brand-changed'));
          beforeEach(synthCardEvent('change', { brand }));
          it('fires a `stripe-change` event', assertFired('change'));
          it('fires a `brand-changed` event', assertEventDetail('brand-changed', { value: brand }));
          describe('and then', function() {
            beforeEach(awaitEvent('brand-changed'));
            it('sets the `brand` property', assertProps({ brand }));
          });
        });

        describe('describing a non-empty, incomplete card', function() {
          beforeEach(listenFor('is-empty-changed'));
          beforeEach(listenFor('empty-changed'));
          beforeEach(synthCardEvent('change', { brand: 'visa', empty: false, complete: false }));
          it('fires `is-empty-changed` event', assertEventDetail('is-empty-changed', { value: false }));
          describe('and then', function() {
            beforeEach(awaitEvent('is-empty-changed'));
            describe('calling reset()', function() {
              beforeEach(reset);
              afterEach(restoreCardClear);
              it('unsets the `error` property', assertProps({ error: null }));
              it('clears the card', function() {
                expect(element.element.clear).to.have.been.called;
              });
            });
          });
        });

        describe('describing a complete card', function() {
          beforeEach(listenFor('is-complete-changed'));
          beforeEach(synthCardEvent('change', { brand: 'visa', empty: false, complete: true }));
          it('fires `is-complete-changed` event', assertEventDetail('is-complete-changed', { value: true }));
        });
      });

      describe('with a non-empty, incomplete form', function() {
        beforeEach(synthStripeFormValues({ cardNumber: '4242424242424242' }));

        describe('calling createPaymentMethod()', function() {
          beforeEach(createPaymentMethod);
          it('sets the `error` property', function() {
            expect(element.paymentMethod, 'paymentMethod').to.be.null;
            expect(element.error, 'error').to.eql(INCOMPLETE_CARD_ERROR);
          });

          it('sets the `hasError` property', function() {
            expect(element.hasError).to.be.true;
          });

          describe('calling validate()', function() {
            beforeEach(validate);
            it('returns false', function() {
              expect(element.validate()).to.be.false;
            });
          });


          describe('calling isPotentiallyValid()', function() {
            it('returns false', function() {
              expect(element.isPotentiallyValid()).to.be.false;
            });
          });
        });

        describe('calling createSource()', function() {
          beforeEach(createSource);
          it('sets the `error` property', function() {
            expect(element.source, 'source').to.be.null;
            expect(element.error, 'error').to.eql(INCOMPLETE_CARD_ERROR);
          });

          it('sets the `hasError` property', function() {
            expect(element.hasError).to.be.true;
          });

          describe('calling validate()', function() {
            it('returns false', function() {
              expect(element.validate()).to.be.false;
            });
          });

          describe('calling isPotentiallyValid()', function() {
            it('returns false', function() {
              expect(element.isPotentiallyValid()).to.be.false;
            });
          });
        });

        describe('calling createToken()', function() {
          beforeEach(createToken);
          it('sets the `error` property', function() {
            expect(element.token, 'token').to.be.null;
            expect(element.error, 'error').to.eql(INCOMPLETE_CARD_ERROR);
          });

          it('sets the `hasError` property', function() {
            expect(element.hasError).to.be.true;
          });

          describe('calling validate()', function() {
            it('returns false', function() {
              expect(element.validate()).to.be.false;
            });
          });

          describe('calling isPotentiallyValid()', function() {
            it('returns false', function() {
              expect(element.isPotentiallyValid()).to.be.false;
            });
          });
        });

        describe('calling submit()', function() {
          it('sets the `error` property', function() {
            element.submit().then(expect.fail, function() {
              expect(element.error, 'error').to.equal(INCOMPLETE_CARD_ERROR);
              expect(element.source, 'source').to.be.null;
            });
          });
        });
      });

      describe('with a valid card', function() {
        beforeEach(stubFetch);
        beforeEach(synthStripeFormValues({ cardNumber: '4242424242424242', mm: '01', yy: '40', cvc: '000' }));
        afterEach(restoreFetch);

        it('sets the `isEmpty` property', assertProps({ isEmpty: false }));

        it('sets the `isComplete` property', assertProps({ isComplete: true }));

        describe('calling createPaymentMethod()', function() {
          it('resolves with the payment method', function() {
            return element.createPaymentMethod()
              .then(result => expect(result.paymentMethod).to.equal(SUCCESS_RESPONSES.paymentMethod));
          });

          describe('subsequently', function() {
            beforeEach(listenFor('payment-method'));
            beforeEach(listenFor('payment-method-changed'));
            beforeEach(createPaymentMethod);
            it('fires a `payment-method` event', assertEventDetail('payment-method', SUCCESS_RESPONSES.paymentMethod));
            it('fires a `payment-method-changed` event', assertEventDetail('payment-method-changed', { value: SUCCESS_RESPONSES.paymentMethod }));
            describe('calling validate()', function() {
              beforeEach(validate);
              it('unsets the `error` property', assertProps({ error: null }));
              it('returns true', function() {
                expect(element.validate()).to.be.true;
              });
            });

            describe('calling isPotentiallyValid()', function() {
              it('returns true', function() {
                expect(element.isPotentiallyValid()).to.be.true;
              });
            });
          });
        });

        describe('calling createSource()', function() {
          it('resolves with the source', function() {
            return element.createSource()
              .then(result => expect(result.source).to.equal(SUCCESS_RESPONSES.source));
          });

          describe('subsequently', function() {
            beforeEach(listenFor('source'));
            beforeEach(listenFor('source-changed'));
            beforeEach(createSource);
            it('fires a `source` event', assertEventDetail('source', SUCCESS_RESPONSES.source));
            it('fires a `source-changed` event', assertEventDetail('source-changed', { value: SUCCESS_RESPONSES.source }));

            describe('calling validate()', function() {
              beforeEach(validate);
              it('unsets the `error` property', assertProps({ error: null }));
              it('returns true', function() {
                expect(element.validate()).to.be.true;
              });
            });

            describe('calling isPotentiallyValid()', function() {
              it('returns true', function() {
                expect(element.isPotentiallyValid()).to.be.true;
              });
            });
          });
        });

        describe('calling createToken()', function() {
          it('resolves with the token', function() {
            return element.createToken()
              .then(result => expect(result.token).to.equal(SUCCESS_RESPONSES.token));
          });

          describe('subsequently', function() {
            beforeEach(listenFor('token'));
            beforeEach(listenFor('token-changed'));
            beforeEach(createToken);
            it('fires a `token` event', assertEventDetail('token', SUCCESS_RESPONSES.token));
            it('fires a `token-changed` event', assertEventDetail('token-changed', { value: SUCCESS_RESPONSES.token }));

            describe('calling validate()', function() {
              beforeEach(validate);
              it('unsets the `error` property', assertProps({ error: null }));
              it('returns true', function() {
                expect(element.validate()).to.be.true;
              });
            });

            describe('calling isPotentiallyValid()', function() {
              it('returns true', function() {
                expect(element.isPotentiallyValid()).to.be.true;
              });
            });
          });
        });

        describe('and generate unset', function() {
          it('calling submit() resolves with the source', function() {
            return element.submit()
              .then(result => expect(result.source).to.equal(SUCCESS_RESPONSES.source));
          });

          describe('calling submit()', function() {
            describe('subsequently', function() {
              beforeEach(listenFor('source'));
              beforeEach(listenFor('source-changed'));
              beforeEach(submit);
              it('fires a `source` event', assertEventDetail('source', SUCCESS_RESPONSES.source));
              it('fires a `source-changed` event', assertEventDetail('source-changed', { value: SUCCESS_RESPONSES.source }));

              describe('calling validate()', function() {
                beforeEach(validate);
                it('unsets the `error` property', assertProps({ error: null }));
                it('returns true', function() { expect(element.validate()).to.be.true; });
              });

              describe('calling isPotentiallyValid()', function() {
                it('returns true', function() {
                  expect(element.isPotentiallyValid()).to.be.true;
                });
              });
            });
          });
        });

        describe('and generate set to `source`', function() {
          beforeEach(setProps({ generate: 'source' }));
          describe('calling submit()', function() {
            it('resolves with the source', function() {
              return element.submit()
                .then(result => expect(result.source).to.equal(SUCCESS_RESPONSES.source));
            });

            describe('subsequently', function() {
              beforeEach(listenFor('source'));
              beforeEach(listenFor('source-changed'));
              beforeEach(submit);
              it('fires a `source` event', assertEventDetail('source', SUCCESS_RESPONSES.source));
              it('fires a `source-changed` event', assertEventDetail('source-changed', { value: SUCCESS_RESPONSES.source }));

              describe('calling validate()', function() {
                beforeEach(validate);
                it('unsets the `error` property', assertProps({ error: null }));
                it('returns true', function() { expect(element.validate()).to.be.true; });
              });

              describe('calling isPotentiallyValid()', function() {
                it('returns true', function() {
                  expect(element.isPotentiallyValid()).to.be.true;
                });
              });
            });
          });
        });

        describe('and generate set to `token`', function() {
          beforeEach(setProps({ generate: 'token' }));
          describe('calling submit()', function() {
            it('resolves with the token', function() {
              return element.submit()
                .then(result => expect(result.token).to.equal(SUCCESS_RESPONSES.token));
            });

            describe('subsequently', function() {
              beforeEach(listenFor('token'));
              beforeEach(listenFor('token-changed'));
              beforeEach(submit);
              it('fires a `token` event', assertEventDetail('token', SUCCESS_RESPONSES.token));
              it('fires a `token-changed` event', assertEventDetail('token-changed', { value: SUCCESS_RESPONSES.token }));

              describe('calling validate()', function() {
                beforeEach(validate);
                it('unsets the `error` property', assertProps({ error: null }));
                it('returns true', function() { expect(element.validate()).to.be.true; });
              });

              describe('calling isPotentiallyValid()', function() {
                it('returns true', function() {
                  expect(element.isPotentiallyValid()).to.be.true;
                });
              });
            });
          });
        });

        describe('and generate set to `payment-method`', function() {
          beforeEach(setProps({ generate: 'payment-method' }));
          describe('calling submit()', function() {
            it('resolves with the payment method', function() {
              return element.submit()
                .then(result => expect(result.paymentMethod).to.equal(SUCCESS_RESPONSES.paymentMethod));
            });

            describe('subsequently', function() {
              beforeEach(submit);
              it('fires a `payment-method-changed` event', async function() {
                const ev = await oneEvent(element, 'payment-method-changed');
                expect(ev.detail.value).to.equal(SUCCESS_RESPONSES.paymentMethod);
              });

              it('fires a `stripe-payment-method` event', async function() {
                const ev = await oneEvent(element, 'stripe-payment-method');
                expect(ev.detail).to.equal(SUCCESS_RESPONSES.paymentMethod);
              });

              describe('calling validate()', function() {
                beforeEach(validate);
                it('returns true', function() {
                  expect(element.validate()).to.be.true;
                });

                it('does not set `error`', function() {
                  expect(element.error).to.be.null;
                });
              });

              describe('calling isPotentiallyValid()', function() {
                it('returns true', function() {
                  expect(element.isPotentiallyValid()).to.be.true;
                });
              });
            });
          });
        });

        describe('and generate set to `something-silly`', function() {
          beforeEach(setProps({ generate: 'something-silly' }));
          describe('calling submit()', function() {
            it('rejects', function() {
              return element.submit().then(expect.fail, function(err) {
                expect(err.message).to.equal('<stripe-elements>: cannot generate something-silly');
              });
            });

            it('does not POST anything', async function() {
              await element.submit().catch(noop);
              expect(fetchStub).to.not.have.been.called;
            });

            describe('subsequently', function() {
              beforeEach(() => submit().catch(noop));

              it('sets the `error` property', assertElementErrorMessage('cannot generate something-silly'));

              describe('calling validate()', function() {
                beforeEach(validate);
                it('returns false', function() {
                  expect(element.validate()).to.be.false;
                });
              });
            });
          });
        });

        describe('with `action` property set', function() {
          beforeEach(setProps({ action: '/here' }));

          describe('calling createPaymentMethod()', function() {
            beforeEach(createPaymentMethod);
            it('POSTs the paymentMethod to the endpoint at `action`', function() {
              const { action, paymentMethod } = element;
              expect(fetchStub).to.have.been.calledWith(action, match({ body: JSON.stringify({ paymentMethod }) }) );
            });
          });

          describe('calling createSource()', function() {
            beforeEach(createSource);
            it('POSTs the source to the endpoint at `action`', function() {
              const { action, source } = element;
              expect(fetchStub).to.have.been.calledWith(action, match({ body: JSON.stringify({ source }) }) );
            });
          });

          describe('calling createToken()', function() {
            beforeEach(createToken);
            it('POSTs the token to the endpoint at `action`', function() {
              const { action, token } = element;
              expect(fetchStub).to.have.been.calledWith(action, match({ body: JSON.stringify({ token }) }) );
            });
          });

          describe('in case the endpoint at `action` throws', function() {
            const error = new Error('endpoint error');
            describe('calling submit()', function() {
              beforeEach(function() { fetchStub.rejects(error); });
              beforeEach(submit);
              it('sets the `error` property', assertProps({ error }));
            });
          });
        });
      });

      describe('with a card that will be declined', function() {
        beforeEach(synthStripeFormValues({ cardNumber: '4000000000000002', mm: '01', yy: '40', cvc: '000' }));

        describe('calling createPaymentMethod()', function() {
          it('rejects with the Stripe error', async function() {
            return element.createPaymentMethod()
              .then(
                _ => expect.fail('createPaymentMethod Resolved'),
                e => expect(e).to.equal(CARD_DECLINED_ERROR)
              );
          });

          describe('subsequently', function() {
            beforeEach(createPaymentMethod);
            it('sets the `error` property', assertProps({ error: CARD_DECLINED_ERROR }));
            it('unsets the `paymentMethod` property', assertProps({ paymentMethod: null }));

            describe('calling validate()', function() {
              beforeEach(validate);
              it('returns false', function() {
                expect(element.validate()).to.be.false;
              });

              it('retains the `error` property', async function validating() {
                expect(element.error).to.equal(CARD_DECLINED_ERROR);
              });
            });
          });
        });

        describe('calling createSource()', function() {
          it('rejects with the Stripe error', async function() {
            return element.createSource()
              .then(
                _ => expect.fail('createSource Resolved'),
                e => expect(e).to.equal(CARD_DECLINED_ERROR)
              );
          });

          describe('subsequently', function() {
            beforeEach(createSource);
            it('sets the `error` property', assertProps({ error: CARD_DECLINED_ERROR }));
            it('unsets the `source` property', assertProps({ source: null }));

            describe('calling validate()', function() {
              beforeEach(validate);
              it('returns false', function() {
                expect(element.validate()).to.be.false;
              });

              it('retains the `error` property', assertProps({ error: CARD_DECLINED_ERROR }));
            });
          });
        });

        describe('calling createToken()', function() {
          it('rejects with the Stripe error', async function() {
            return element.createToken()
              .then(
                _ => expect.fail('createToken Resolved'),
                e => expect(e).to.equal(CARD_DECLINED_ERROR)
              );
          });

          describe('subsequently', function() {
            beforeEach(createToken);
            it('sets the `error` property', assertProps({ error: CARD_DECLINED_ERROR }));
            it('unsets the `token` property', assertProps({ token: null }));

            describe('calling validate()', function() {
              beforeEach(validate);
              it('returns false', function() {
                expect(element.validate()).to.be.false;
              });

              it('retains the `error` property', async function validating() {
                expect(element.error).to.equal(CARD_DECLINED_ERROR);
              });
            });
          });
        });
      });
    });
  });
});
