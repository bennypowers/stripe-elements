import '../stripe-elements.js';

import { expect, fixture, oneEvent, nextFrame } from '@open-wc/testing';

import {
  CARD_DECLINED_ERROR,
  INCOMPLETE_CARD_ERROR,
  PUBLISHABLE_KEY,
  SHOULD_ERROR_KEY,
  SUCCESS_RESPONSES,
} from '../test/mock-stripe';
import {
  DEFAULT_PROPS,
  EMPTY_CC_ERROR,
  NOTIFYING_PROPS,
  NO_STRIPE_CREATE_PAYMENT_METHOD_ERROR,
  NO_STRIPE_CREATE_SOURCE_ERROR,
  NO_STRIPE_CREATE_TOKEN_ERROR,
  NO_STRIPE_JS,
  READ_ONLY_PROPS,
  appendAllBlueStyleTag,
  appendGlobalStyles,
  assertFiresStripeChange,
  assertHasOneGlobalStyleTag,
  assertSubmitCalled,
  createPaymentMethod,
  createSource,
  createToken,
  element,
  initialStripe,
  initialStripeMountId,
  mockShadyCSS,
  mockShadyDOM,
  mockStripe,
  removeAllBlueStyleTag,
  removeStripeMount,
  reset,
  resetTestState,
  restoreAppended,
  restoreCardClear,
  restoreConsoleWarn,
  restoreFormSubmit,
  restoreGetComputedStyleValue,
  restoreShadyCSS,
  restoreShadyDOM,
  restoreStripe,
  setProps,
  setupNoProps,
  setupWithPublishableKey,
  spyConsoleWarn,
  spyGetComputedStyleValue,
  stubFormSubmit,
  submit,
  synthStripeEvent,
  synthStripeFormValues,
  testDefaultPropEntry,
  testReadOnlyProp,
  testReadonlyNotifyingProp,
  testWritableNotifyingProp,
  validate,
} from '../test/test-helpers';
import { elem, not } from './lib/predicates.js';

const assignedNodes = el => el.assignedNodes();

const formLightDOM = ({ label = 'Credit or Debit Card', stripeMountId }) => `
  <form method="post">
    <div id="${stripeMountId}" aria-label="${label}" class="stripe-mount"></div>
    <input disabled type="hidden" name="stripePaymentMethod"/>
    <input disabled type="hidden" name="stripeSource"/>
    <input disabled type="hidden" name="stripeToken"/>
  </form>
`;

const expectedLightDOM = ({ label = 'Credit or Debit Card', stripeMountId }) => `<div slot="stripe-card">${formLightDOM({ label, stripeMountId })}</div> `;

describe('<stripe-elements>', function() {
  beforeEach(spyConsoleWarn);
  afterEach(restoreConsoleWarn);
  afterEach(resetTestState);

  it('instantiates without error', async function noInitialError() {
    await setupNoProps();
    expect(element.constructor.is).to.equal('stripe-elements');
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

  describe('with global CSS present in the document', function() {
    beforeEach(appendGlobalStyles);
    beforeEach(setupNoProps);
    afterEach(restoreAppended);
    it('does not append a second stylesheet to the document', assertHasOneGlobalStyleTag);
  });

  describe('without global CSS in the document', function() {
    beforeEach(setupNoProps);
    it('appends a stylesheet to the document', assertHasOneGlobalStyleTag);
  });

  describe('when Mocked ShadyDOM polyfill is in use', function shadyDOM() {
    beforeEach(mockShadyDOM);
    beforeEach(setupNoProps);
    afterEach(restoreShadyDOM);

    describe('when connected to document', function() {
      it('appends a shady-dom mount point', function shadyMount() {
        expect(element).lightDom.to.equal(formLightDOM(element));
      });

      it('finds its form', function findsForm() {
        expect(element.form).to.be.an.instanceof(HTMLFormElement);
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
        primaryHost = await fixture(`<primary-host></primary-host>`);
        ({ nestedElement } = primaryHost);
        ({ stripeMountId } = nestedElement);
      });

      it('leaves one breadcrumb on its way up to the document', async function breadcrumbs() {
        const [slottedChild] = nestedElement.querySelector('slot').assignedNodes();
        expect(slottedChild).to.contain(nestedElement.stripeMount);
      });

      it('slots mount point in to its light DOM', function() {
        expect(primaryHost).lightDom.to.equal(expectedLightDOM({ stripeMountId }));
      });

      it('finds its form', async function() {
        expect(nestedElement.form).to.be.an.instanceOf(HTMLFormElement);
      });
    });

    describe('when nested two shadow-roots deep', function() {
      beforeEach(async function setupTwoRoots() {
        secondaryHost = await fixture(`<secondary-host></secondary-host>`);
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
        expect(secondaryHost).lightDom.to.equal(expectedLightDOM({ stripeMountId }));
      });

      it('appends a slot to the shadow DOM of the secondary shadow host', function() {
        expect(secondaryHost).shadowDom.to.equal(`
          <primary-host>
            <slot name="stripe-card" slot="stripe-card"></slot>
          </primary-host>
        `);
      });

      it('finds its form', function() {
        expect(nestedElement.form).to.be.an.instanceOf(HTMLFormElement);
      });

      it('only creates one slot', function() {
        expect(document.querySelectorAll('div[slot="stripe-card"]').length).to.equal(1);
      });
    });

    describe('when nested three shadow-roots deep', function() {
      beforeEach(async function setupThreeRoots() {
        tertiaryHost = await fixture(`<tertiary-host></tertiary-host>`);
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
        expect(tertiaryHost).lightDom.to.equal(expectedLightDOM({ stripeMountId }));
      });

      it('appends a slot to the shadow DOM of the tertiary shadow host', function() {
        expect(tertiaryHost).shadowDom.to.equal(`
          <secondary-host>
            <slot name="stripe-card" slot="stripe-card"></slot>
          </secondary-host>
        `);
      });

      it('appends a slot to the shadow DOM of the secondary shadow host', function() {
        expect(secondaryHost).shadowDom.to.equal(`
          <primary-host>
            <slot name="stripe-card" slot="stripe-card"></slot>
          </primary-host>
        `);
      });

      it('finds its form', function() {
        expect(nestedElement.form).to.be.an.instanceOf(HTMLFormElement);
      });

      it('only creates one slot', function() {
        expect(document.querySelectorAll('div[slot="stripe-card"]').length).to.equal(1);
      });
    });
  });

  describe('without Stripe.js', function withoutStripe() {
    beforeEach(restoreStripe);
    describe('with a valid publishable key', function apiKey() {
      beforeEach(setupWithPublishableKey(PUBLISHABLE_KEY));

      it('logs a warning', async function logsWarning() {
        expect(console.warn).to.have.been.calledWith(NO_STRIPE_JS);
      });

      it('does not initialize stripe instance', async function noStripeInit() {
        expect(element.stripe).to.not.be.ok;
      });

      it('does not mount card', async function noCard() {
        expect(element.card).to.not.be.ok;
      });

      it('sets the `error` property', async function setsError() {
        expect(element.error.message).to.equal(NO_STRIPE_JS);
      });

      it('throws an error when creating payment method', async function() {
        try {
          await element.createPaymentMethod();
          expect.fail('Resolved source promise without Stripe.js');
        } catch (err) {
          expect(err.message).to.equal(NO_STRIPE_CREATE_PAYMENT_METHOD_ERROR);
        }
      });

      it('throws an error when creating token', async function() {
        try {
          await element.createToken();
          expect.fail('Resolved token promise without Stripe.js');
        } catch (err) {
          expect(err.message).to.equal(NO_STRIPE_CREATE_TOKEN_ERROR);
        }
      });

      it('throws an error when creating source', async function() {
        try {
          await element.createSource();
          expect.fail('Resolved source promise without Stripe.js');
        } catch (err) {
          expect(err.message).to.equal(NO_STRIPE_CREATE_SOURCE_ERROR);
        }
      });

      it('throws an error when calling submit', async function() {
        try {
          await element.submit();
          expect.fail('Resolved submit promise without Stripe.js');
        } catch (err) {
          expect(err.message).to.equal(NO_STRIPE_CREATE_SOURCE_ERROR);
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
          it('rebuilds its DOM', function() {
            const { stripeMountId } = element;
            expect(element).lightDom.to.equal(expectedLightDOM({ stripeMountId }));
            expect(element.stripeMount, 'mount').to.be.ok;
          });

          it('uses a new id', function() {
            expect(element.stripeMount.id).to.not.equal(initialStripeMountId);
          });

          it('finds its form', function() {
            expect(element.querySelector('form')).to.be.ok;
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
          it('sets the `error` property', function() {
            expect(element.error.message, 'error').to.equal(SHOULD_ERROR_KEY);
            expect(element.paymentMethod, 'paymentMethod').to.be.null;
          });
        });

        describe('calling createSource()', function() {
          beforeEach(createSource);
          it('sets the `error` property', function() {
            expect(element.error.message, 'error').to.equal(SHOULD_ERROR_KEY);
            expect(element.source, 'source').to.be.null;
          });
        });

        describe('calling createToken()', function() {
          beforeEach(createToken);
          it('sets the `error` property', function() {
            expect(element.error.message, 'error').to.equal(SHOULD_ERROR_KEY);
            expect(element.token, 'token').to.be.null;
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

          it('unsets the `error` property', function() {
            expect(element.error).to.be.null;
          });
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

        it('sets the `error` property', function callingValidateWithoutCard() {
          expect(element.error.message).to.equal(EMPTY_CC_ERROR);
        });
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
        it('sets the `error` property', function() {
          expect(element.paymentMethod, 'paymentMethod').to.be.null;
          expect(element.error, 'error').to.equal(INCOMPLETE_CARD_ERROR);
        });
      });

      describe('calling createSource()', function callingCreateSource() {
        beforeEach(createSource);
        it('sets the `error` property', function setsError() {
          expect(element.source, 'source').to.be.null;
          expect(element.error, 'error').to.equal(INCOMPLETE_CARD_ERROR);
        });
      });

      describe('calling createToken()', function() {
        beforeEach(createToken);
        it('sets the `error` property', function() {
          expect(element.token, 'token').to.be.null;
          expect(element.error, 'error').to.equal(INCOMPLETE_CARD_ERROR);
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

      describe('when stripe fires `ready` event', function cardReady() {
        beforeEach(synthStripeEvent('ready'));
        it('fires `stripe-ready` event', async function() {
          const ev = await oneEvent(element, 'stripe-ready');
          expect(ev).to.be.ok;
        });

        it('fires `stripe-ready-changed` event', async function() {
          const { detail: { value } } = await oneEvent(element, 'stripe-ready-changed');
          expect(value).to.be.true;
        });

        it('sets `stripeReady` property', async function() {
          await oneEvent(element, 'stripe-ready');
          expect(element.stripeReady).to.be.true;
        });
      });

      describe('when stripe fires `change` event', function cardChange() {
        describe('without regard to the event content', function() {
          beforeEach(synthStripeEvent('change'));
          it('fires a `stripe-change` event', assertFiresStripeChange);
        });

        describe('with a `brand` property', function brandChange() {
          const brand = 'visa';
          beforeEach(synthStripeEvent('change', { brand }));
          it('fires a `brand-changed` event', async function brandChanged() {
            const { detail: { value } } = await oneEvent(element, 'brand-changed');
            expect(value).to.equal(brand);
          });

          it('sets brand', async function setsBrand() {
            await oneEvent(element, 'brand-changed');
            expect(element.brand).to.equal(brand);
          });
        });

        describe('describing a non-empty, incomplete card', function() {
          beforeEach(synthStripeEvent('change', { brand: 'visa', empty: false, complete: false }));

          it('fires `is-empty-changed` event', async function isEmptyChanged() {
            const { detail: { value: isEmpty } } = await oneEvent(element, 'is-empty-changed');
            expect(isEmpty).to.be.false;
          });

          describe('then after the event', function() {
            beforeEach(async function() {
              await oneEvent(element, 'stripe-change');
            });

            describe('calling reset()', function() {
              beforeEach(reset);
              afterEach(restoreCardClear);

              it('unsets the `error`', function() {
                expect(element.error).to.be.null;
              });

              it('clears the card', function() {
                expect(element.card.clear).to.have.been.called;
              });
            });
          });
        });

        describe('describing a complete card', function() {
          beforeEach(synthStripeEvent('change', { brand: 'visa', empty: false, complete: true }));
          it('fires `is-complete-changed` event', async function() {
            const { detail: { value: isComplete } } = await oneEvent(element, 'is-complete-changed');
            expect(isComplete).to.be.true;
          });
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
        beforeEach(synthStripeFormValues({ cardNumber: '4242424242424242', mm: '01', yy: '40', cvc: '000' }));

        it('sets the `isEmpty` property', function() {
          expect(element.isEmpty).to.be.false;
        });

        it('sets the `isComplete` property', function() {
          expect(element.isComplete).to.be.true;
        });

        describe('calling createPaymentMethod()', function() {
          it('resolves with the payment method', function() {
            return element.createPaymentMethod()
              .then(result => expect(result.paymentMethod).to.equal(SUCCESS_RESPONSES.paymentMethod));
          });

          describe('subsequently', function() {
            beforeEach(createPaymentMethod);

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

        describe('calling createSource()', function() {
          it('resolves with the source', function() {
            return element.createSource()
              .then(result => expect(result.source).to.equal(SUCCESS_RESPONSES.source));
          });

          describe('subsequently', function() {
            beforeEach(createSource);
            it('fires a `source-changed` event', async function() {
              const ev = await oneEvent(element, 'source-changed');
              expect(ev.detail.value).to.equal(SUCCESS_RESPONSES.source);
            });

            it('fires a `stripe-source` event', async function() {
              const ev = await oneEvent(element, 'stripe-source');
              expect(ev.detail).to.equal(SUCCESS_RESPONSES.source);
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

        describe('calling createToken()', function() {
          it('resolves with the token', function() {
            return element.createToken()
              .then(result => expect(result.token).to.equal(SUCCESS_RESPONSES.token));
          });

          describe('subsequently', function() {
            beforeEach(createToken);

            it('fires a `token-changed` event', async function() {
              const ev = await oneEvent(element, 'token-changed');
              expect(ev.detail.value).to.equal(SUCCESS_RESPONSES.token);
            });

            it('fires a `stripe-token` event', async function() {
              const ev = await oneEvent(element, 'stripe-token');
              expect(ev.detail).to.equal(SUCCESS_RESPONSES.token);
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

        describe('and generate unset', function() {
          describe('calling submit()', function() {
            it('resolves with the source', function() {
              return element.submit()
                .then(result => expect(result.source).to.equal(SUCCESS_RESPONSES.source));
            });

            describe('subsequently', function() {
              beforeEach(submit);
              it('fires a `source-changed` event', async function() {
                const ev = await oneEvent(element, 'source-changed');
                expect(ev.detail.value).to.equal(SUCCESS_RESPONSES.source);
              });

              it('fires a `stripe-source` event', async function() {
                const ev = await oneEvent(element, 'stripe-source');
                expect(ev.detail).to.equal(SUCCESS_RESPONSES.source);
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

        describe('and generate set to `token`', function() {
          beforeEach(setProps({ generate: 'token' }));
          describe('calling submit()', function() {
            it('resolves with the token', function() {
              return element.submit()
                .then(result => expect(result.token).to.equal(SUCCESS_RESPONSES.token));
            });

            describe('subsequently', function() {
              beforeEach(submit);
              it('fires a `token-changed` event', async function() {
                const ev = await oneEvent(element, 'token-changed');
                expect(ev.detail.value).to.equal(SUCCESS_RESPONSES.token);
              });

              it('fires a `stripe-token` event', async function() {
                const ev = await oneEvent(element, 'stripe-token');
                expect(ev.detail).to.equal(SUCCESS_RESPONSES.token);
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

            describe('subsequently', function() {
              beforeEach(() => submit().catch(() => {}));

              it('sets the `error` property', function() {
                expect(element.error.message).to.equal('<stripe-elements>: cannot generate something-silly');
              });

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
          beforeEach(stubFormSubmit);
          beforeEach(setProps({ action: '/here' }));
          afterEach(restoreFormSubmit);

          describe('calling createPaymentMethod()', function() {
            beforeEach(createPaymentMethod);
            it('submits the form', assertSubmitCalled);
          });

          describe('calling createSource()', function() {
            beforeEach(createSource);
            it('submits the form', assertSubmitCalled);
          });

          describe('calling createToken()', function() {
            beforeEach(createToken);
            it('submits the form', assertSubmitCalled);
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
            it('sets the `error` property', function() {
              expect(element.error).to.equal(CARD_DECLINED_ERROR);
              expect(element.paymentMethod).to.be.null;
            });

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
            it('sets the `error` property', function() {
              expect(element.error).to.equal(CARD_DECLINED_ERROR);
              expect(element.source).to.be.null;
            });

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
            it('sets the `error` property', function() {
              expect(element.error).to.equal(CARD_DECLINED_ERROR);
              expect(element.token).to.be.null;
            });

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
