/* istanbul ignore file */
import type * as Stripe from '@stripe/stripe-js';

import { StripeElements } from '../src/stripe-elements';

import { expect, fixture, oneEvent, nextFrame } from '@open-wc/testing';
import { match } from 'sinon';

import * as Helpers from '../test/test-helpers';
import { element } from '../test/test-helpers';

import '../src/stripe-elements';

import {
  CARD_DECLINED_ERROR,
  INCOMPLETE_CARD_ERROR,
  Keys,
  SUCCESS_RESPONSES,
} from '../test/mock-stripe';

import { elem, not } from '../src/lib/predicates';
import { StripeBase } from '../src/StripeBase';
import { StripePaymentRequest } from '../src';

const DEFAULT_PROPS = Object.freeze({
  ...Helpers.BASE_DEFAULT_PROPS,
  brand: null,
  complete: false,
  empty: true,
  hideIcon: false,
  hidePostalCode: false,
  iconStyle: 'default',
  stripe: null,
  token: null,
  value: {},
});

const READ_ONLY_PROPS = Object.freeze([
  ...Helpers.BASE_READ_ONLY_PROPS,
  'brand',
  'complete',
  'empty',
  'error',
  'invalid',
  'ready',
]);

const NOTIFYING_PROPS = Object.freeze([
  ...Helpers.BASE_NOTIFYING_PROPS,
  'brand',
  'complete',
  'empty',
  'error',
  'invalid',
  'ready',
]);

describe('<stripe-elements>', function() {
  beforeEach(Helpers.spyConsoleWarn);
  afterEach(Helpers.restoreConsoleWarn);
  afterEach(Helpers.resetTestState);

  describe('simply instantiating', function() {
    beforeEach(Helpers.setupNoProps);
    it('does not throw error', function() {
      expect(element.tagName).to.equal('STRIPE-ELEMENTS');
    });

    describe('uses default for property', function() {
      beforeEach(Helpers.setupNoProps);
      Object.entries(DEFAULT_PROPS).forEach(Helpers.testDefaultPropEntry);
    });

    describe('has read-only property', function() {
      beforeEach(Helpers.setupNoProps);
      Helpers.testReadOnlyProp('element');
      READ_ONLY_PROPS.forEach(Helpers.testReadOnlyProp);
    });

    describe('notifies when setting property', function() {
      beforeEach(Helpers.setupNoProps);
      NOTIFYING_PROPS.filter(not(elem(READ_ONLY_PROPS))).forEach(Helpers.testWritableNotifyingProp);
    });

    describe('notifies when privately setting read-only property', function() {
      beforeEach(Helpers.setupNoProps);
      READ_ONLY_PROPS.filter(elem(NOTIFYING_PROPS)).forEach(Helpers.testReadonlyNotifyingProp);
    });
  });

  describe('in nested shadow roots', function() {
    let nestedElement: StripeBase;
    let primaryHost: Helpers.PrimaryHost;
    let secondaryHost: Helpers.SecondaryHost;
    let tertiaryHost: Helpers.TertiaryHost;
    let stripeMountId: string;
    afterEach(function() {
      // @ts-expect-error: intended: reset test state
      nestedElement = undefined; primaryHost = undefined; secondaryHost = undefined;
      // @ts-expect-error: intended: reset test state
      tertiaryHost = undefined; stripeMountId = undefined;
    });
    describe('when nested one shadow-root deep', function() {
      beforeEach(Helpers.mockStripe);
      afterEach(Helpers.restoreStripe);
      beforeEach(async function setupOneRoot() {
        primaryHost = await fixture(`<primary-host tag="stripe-elements"></primary-host>`);
        ({ nestedElement } = primaryHost);
        ({ stripeMountId } = nestedElement);
      });

      it('leaves one breadcrumb on its way up to the document', function() {
        const slot = nestedElement.querySelector('slot');
        const [slottedChild] = slot!.assignedNodes();
        expect(slottedChild).to.contain(nestedElement.stripeMount);
      });

      it('slots mount point in to its light DOM', function() {
        const { tagName } = nestedElement;
        expect(primaryHost).lightDom.to.equal(Helpers.expectedLightDOM({ stripeMountId, tagName }));
      });

      it('does not break primary host\'s internal DOM', function() {
        expect(primaryHost).shadowDom.to.equal(`
          <h1>Other Primary Host Content</h1>
          <stripe-elements publishable-key="${Keys.PUBLISHABLE_KEY}">
            <slot name="stripe-elements-slot" slot="stripe-elements-slot"></slot>
          </stripe-elements>
        `);
      });
    });

    describe('when nested two shadow-roots deep', function() {
      beforeEach(async function setupTwoRoots() {
        this.timeout(10 * 60 * 1000);
        secondaryHost = await fixture(`<secondary-host tag="stripe-elements"></secondary-host>`);
        ({ primaryHost } = secondaryHost);
        ({ nestedElement } = primaryHost);
        ({ stripeMountId } = nestedElement);
      });

      it('forwards stripe mount deeply through slots', function() {
        const [slottedChild] =
          (primaryHost.shadowRoot.querySelector('slot')!
            .assignedNodes() as HTMLSlotElement[])
            .flatMap(Helpers.assignedNodes);
        expect(slottedChild).to.contain(nestedElement.stripeMount);
      });

      it('slots mount point in to the light DOM of the secondary shadow host', function() {
        const { tagName } = nestedElement;
        expect(secondaryHost).lightDom.to.equal(Helpers.expectedLightDOM({ stripeMountId, tagName }));
      });

      it('appends a slot to the shadow DOM of the secondary shadow host', function() {
        expect(secondaryHost).shadowDom.to.equal(`
          <primary-host tag="stripe-elements">
            <slot name="stripe-elements-slot" slot="stripe-elements-slot"></slot>
          </primary-host>
        `);
      });

      it('only creates one slot', function() {
        expect(document.getElementById(stripeMountId)).to.be.ok;
        expect(document.querySelectorAll(`#${stripeMountId}`).length).to.equal(1);
        expect(document.querySelectorAll('[slot="stripe-elements-slot"]').length).to.equal(1);
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

      it('forwards stripe mount deeply through slots', function() {
        const [slottedChild] =
          ((primaryHost.shadowRoot.querySelector('slot')!
            .assignedNodes() as HTMLSlotElement[])
            .flatMap(Helpers.assignedNodes) as HTMLSlotElement[])
            .flatMap(Helpers.assignedNodes);
        expect(slottedChild).to.contain(nestedElement.stripeMount);
      });

      it('slots mount point in to the light DOM of the tertiary shadow host', function() {
        const { tagName } = nestedElement;
        expect(tertiaryHost).lightDom.to.equal(Helpers.expectedLightDOM({ stripeMountId, tagName }));
      });

      it('appends a slot to the shadow DOM of the tertiary shadow host', function() {
        expect(tertiaryHost).shadowDom.to.equal(`
          <secondary-host tag="stripe-elements">
            <slot name="stripe-elements-slot" slot="stripe-elements-slot"></slot>
          </secondary-host>
        `);
      });

      it('appends a slot to the shadow DOM of the secondary shadow host', function() {
        expect(secondaryHost).shadowDom.to.equal(`
          <primary-host tag="stripe-elements">
            <slot name="stripe-elements-slot" slot="stripe-elements-slot"></slot>
          </primary-host>
        `);
      });

      it('only creates one slot', function() {
        expect(document.getElementById(stripeMountId)).to.be.ok;
        expect(document.querySelectorAll(`#${stripeMountId}`).length).to.equal(1);
        expect(document.querySelectorAll('[slot="stripe-elements-slot"]').length).to.equal(1);
      });
    });
  });

  // TODO: test loading behaviour with loadStripe
  // mock the module in test-runner config
  describe.skip('without Stripe.js', function() {
    beforeEach(Helpers.restoreStripe);
    describe('with a valid publishable key', function() {
      beforeEach(Helpers.setupWithPublishableKey(Keys.PUBLISHABLE_KEY));

      it('logs a warning', function() {
        expect(console.warn)
          .to.have.been.calledWith(`<${element.tagName.toLowerCase()}>: ${Helpers.NO_STRIPE_JS_ERROR}`);
      });

      it('does not initialize stripe instance', function() {
        expect(element.stripe).to.not.be.ok;
      });

      it('does not mount element', function() {
        expect(element.element).to.not.be.ok;
      });

      it('sets the `error` property', Helpers.assertElementErrorMessage(Helpers.NO_STRIPE_JS_ERROR));

      it('throws an error when creating payment method', async function() {
        try {
          await (element as StripeElements).createPaymentMethod();
          expect.fail('Resolved source promise without Stripe.js');
        } catch (err) {
          expect((err as Error).message).to.equal(`<${(element.constructor as typeof StripeBase).is}>: ${Helpers.NO_STRIPE_CREATE_PAYMENT_METHOD_ERROR}`);
        }
      });

      it('throws an error when creating token', async function() {
        try {
          await (element as StripeElements).createToken();
          expect.fail('Resolved token promise without Stripe.js');
        } catch (err) {
          expect((err as Error).message).to.equal(`<${element.tagName.toLowerCase()}>: ${Helpers.NO_STRIPE_CREATE_TOKEN_ERROR}`);
        }
      });

      it('throws an error when creating source', async function() {
        try {
          await (element as StripeElements).createSource();
          expect.fail('Resolved source promise without Stripe.js');
        } catch (err) {
          expect((err as Error)).to.equal(`<${(element.constructor as typeof StripeBase).is}>: ${Helpers.NO_STRIPE_CREATE_SOURCE_ERROR}`);
        }
      });

      it('throws an error when calling submit', async function() {
        try {
          await (element as StripeElements).submit();
          expect.fail('Resolved submit promise without Stripe.js');
        } catch (err) {
          expect((err as Error)).to.equal(`<${(element.constructor as typeof StripeBase).is}>: ${Helpers.NO_STRIPE_CREATE_SOURCE_ERROR}`);
        }
      });
    });
  });

  describe('with mocked Stripe.js', function() {
    beforeEach(Helpers.mockStripe);
    afterEach(Helpers.restoreStripe);

    describe('and CSS custom properties applied', function() {
      beforeEach(Helpers.appendAllBlueStyleTag);
      afterEach(Helpers.removeAllBlueStyleTag);

      describe('with a valid publishable key', function() {
        beforeEach(Helpers.setupWithPublishableKey(Keys.PUBLISHABLE_KEY));
        describe('and a valid card', function() {
          beforeEach(Helpers.synthStripeFormValues({ cardNumber: '4242424242424242', mm: '01', yy: '40', cvc: '000' }));
          it('passes CSS custom property values to stripe', function() {
            const allValues = Object.values<string>(
              (element.element as Stripe.StripeElement & { style: Record<string, string> }).style as {}
            ).flatMap(Object.values);
            const noEmpties = allValues.filter(x => !(typeof x === 'object' && Object.values(x).every(x => x === undefined)));
            expect(noEmpties).to.deep.equal(Array.from(noEmpties, () => 'blue'));
          });
        });
      });

      describe('with a valid stripe account', function() {
        beforeEach(Helpers.setupWithPublishableKeyAndStripeAccount(Keys.PUBLISHABLE_KEY, Keys.STRIPE_ACCOUNT));
        describe('and a stripe account set', function() {
          it('Stripe has the Account setting in its options', function() {
            const { stripe } = element as StripeElements;
            const { opts } = stripe as any;
            expect(opts).to.have.property('stripeAccount');
          });
        });
      });
    });

    describe('and no publishable key', function() {
      beforeEach(Helpers.setupNoProps);
      describe('when stripe mount point is removed from DOM', function() {
        beforeEach(Helpers.removeStripeMount);
        describe('then publishable key is set', function() {
          beforeEach(Helpers.setProps({ publishableKey: Keys.PUBLISHABLE_KEY }));
          beforeEach(nextFrame);
          it('rebuilds its DOM', function() {
            const { stripeMountId, tagName } = element;
            expect(element).lightDom.to.equal(Helpers.expectedLightDOM({ stripeMountId, tagName }));
            expect(element.stripeMount, 'mount').to.be.ok;
          });

          it('uses a new id', function() {
            expect(element.stripeMount!.id).to.not.equal(Helpers.initialStripeMountId);
          });
        });
      });
    });

    describe('and an invalid publishable key', function() {
      beforeEach(Helpers.setupWithPublishableKey(Keys.SHOULD_ERROR_KEY));
      describe('and a complete, valid form', function() {
        beforeEach(Helpers.synthStripeFormValues({ cardNumber: '4242424242424242', mm: '01', yy: '40', cvc: '000' }));

        describe('calling createPaymentMethod()', function() {
          beforeEach(Helpers.createPaymentMethod);
          it('unsets the `paymentMethod` property', Helpers.assertProps({ paymentMethod: null }));
          it('sets the `error` property', function() {
            expect(element.error!.message, 'error').to.equal(Keys.SHOULD_ERROR_KEY);
          });
        });

        describe('calling createSource()', function() {
          beforeEach(Helpers.createSource);
          it('unsets the `source` property', Helpers.assertProps({ source: null }));
          it('sets the `error` property', function() {
            expect(element.error!.message, 'error').to.equal(Keys.SHOULD_ERROR_KEY);
          });
        });

        describe('calling createToken()', function() {
          beforeEach(Helpers.createToken);
          it('unsets the `token` property', Helpers.assertProps({ token: null }));
          it('sets the `error` property', function() {
            expect(element.error!.message, 'error').to.equal(Keys.SHOULD_ERROR_KEY);
          });
        });

        describe('calling submit()', function() {
          it('sets the `error` property', function() {
            return (element as StripeElements).submit().then(x => expect.fail(x.toString()), function() {
              expect(element.error!.message, 'error').to.equal(Keys.SHOULD_ERROR_KEY);
              expect(element.source, 'source').to.be.null;
            });
          });
        });

        describe('calling validate()', function() {
          beforeEach(Helpers.validate);
          it('returns true', function() {
            expect((element as StripeElements).validate()).to.be.true;
          });

          it('unsets the `error` property', Helpers.assertProps({ error: null }));
        });
      });
    });

    describe('and a valid publishable key', function() {
      beforeEach(Helpers.setupWithPublishableKey(Keys.PUBLISHABLE_KEY));

      it('initializes stripe instance', function() {
        expect(element.stripe).to.be.ok;
      });

      it('initializes elements instance', function() {
        expect(element.elements).to.be.ok;
      });

      it('mounts a card into the target', function() {
        expect(element.element).to.be.ok;
      });

      describe('removing the element', function() {
        let removed: StripeElements | StripePaymentRequest | undefined;
        beforeEach(function() { removed = element; element.remove(); });
        afterEach(function() { removed = undefined; });
        it('unmounts the card', function() {
          expect(removed).to.be.an.instanceof(HTMLElement);
          expect(removed!.isConnected).to.be.false;
          expect(removed!.stripeMount).to.not.be.ok;
          expect(document.querySelector('[slot="stripe-elements-slot"]')).to.not.be.ok;
        });
      });

      describe('calling blur()', function() {
        beforeEach(Helpers.spyStripeElementBlur);
        beforeEach(Helpers.blur);
        afterEach(Helpers.restoreStripeElementBlur);
        it('calls StripeElement#blur', function() {
          expect(element.element!.blur).to.have.been.called;
        });
      });

      describe('calling focus()', function() {
        beforeEach(Helpers.spyStripeElementFocus);
        beforeEach(Helpers.focus);
        afterEach(Helpers.restoreStripeElementFocus);
        it('calls StripeElement#focus', function() {
          expect(element.element!.focus).to.have.been.called;
        });
      });

      describe('when stripe element is focused', function() {
        beforeEach(Helpers.focusStripeElement);
        beforeEach(Helpers.updateComplete);
        it('sets the `focused` property', Helpers.assertProps({ focused: true }));
      });

      describe('when stripe element is blurred', function() {
        beforeEach(Helpers.focusStripeElement);
        beforeEach(Helpers.updateComplete);
        beforeEach(Helpers.blurStripeElement);
        beforeEach(Helpers.updateComplete);
        it('unsets the `focused` property', Helpers.assertProps({ focused: false }));
      });

      describe('when publishable key is changed', function() {
        let initialStripeMountId: string | undefined;
        beforeEach(function() { initialStripeMountId = element.stripeMountId; });
        beforeEach(Helpers.listenFor('ready'));
        beforeEach(Helpers.setProps({ publishableKey: 'foo' }));
        beforeEach(nextFrame);
        afterEach(function() { initialStripeMountId = undefined; });
        it('reinitializes stripe', function() { expect(element.stripe).to.be.ok.and.not.equal(Helpers.initialStripe); });
        it('uses a new mount point id', function() { expect(element.stripeMountId).to.be.ok.and.not.equal(initialStripeMountId); });
        it('fires `ready` event', Helpers.assertFired('ready'));
      });

      describe('when publishable key is unset', function() {
        beforeEach(Helpers.setProps({ publishableKey: undefined }));
        beforeEach(nextFrame);

        it('unsets stripe instance', function() {
          expect(element.stripe).to.be.null;
        });

        it('unsets element instance', function() {
          expect(element.elements).to.be.null;
        });
      });

      describe('calling validate()', function() {
        beforeEach(Helpers.validate);

        it('returns false', function() {
          expect((element as StripeElements).validate()).to.be.false;
        });

        it('sets the `error` property', Helpers.assertElementErrorMessage(Helpers.EMPTY_CC_ERROR));
      });

      describe('calling isPotentiallyValid()', function() {
        it('returns false', function callingIsPotentiallyValidWithoutCard() {
          expect((element as StripeElements).isPotentiallyValid()).to.be.false;
        });

        it('does not set the `error` property', function() {
          expect(element.error).to.be.null;
        });
      });

      describe('calling createPaymentMethod()', function() {
        beforeEach(Helpers.createPaymentMethod);
        it('sets the `error` property', Helpers.assertProps({ error: INCOMPLETE_CARD_ERROR }));
        it('unsets the `paymentMethod` property', Helpers.assertProps({ paymentMethod: null }));
      });

      describe('calling createSource()', function callingCreateSource() {
        beforeEach(Helpers.createSource);
        it('sets the `error` property', Helpers.assertProps({ error: INCOMPLETE_CARD_ERROR }));
        it('unsets the `source` property', Helpers.assertProps({ source: null }));
      });

      describe('calling createToken()', function() {
        beforeEach(Helpers.createToken);
        it('sets the `error` property', Helpers.assertProps({ error: INCOMPLETE_CARD_ERROR }));
        it('unsets the `token` property', Helpers.assertProps({ token: null }));
      });

      describe('calling submit()', function() {
        it('sets the `error` property', async function() {
          try {
            await (element as StripeElements).submit();
            expect.fail('Response Received');
          } catch (error) {
            expect(element.error, 'error').to.equal(INCOMPLETE_CARD_ERROR).and.to.equal(error);
            expect(element.source, 'source').to.be.null;
          }
        });
      });

      describe('when stripe fires `change` event', function() {
        beforeEach(Helpers.listenFor('change'));
        beforeEach(Helpers.synthCardEvent('change'));
        describe('with a `brand` property', function() {
          const brand = 'visa';
          beforeEach(Helpers.listenFor('brand-changed'));
          beforeEach(Helpers.synthCardEvent('change', { brand }));
          it('fires a `stripe-change` event', Helpers.assertFired('change'));
          it('fires a `brand-changed` event', Helpers.assertEventDetail('brand-changed', { value: brand }));
          describe('and then', function() {
            beforeEach(Helpers.awaitEvent('brand-changed'));
            it('sets the `brand` property', Helpers.assertProps({ brand }));
          });
        });

        describe('describing a non-empty, incomplete card', function() {
          beforeEach(Helpers.listenFor('empty-changed'));
          beforeEach(Helpers.synthCardEvent('change', { brand: 'visa', empty: false, complete: false }));
          it('fires `empty-changed` event', Helpers.assertEventDetail('empty-changed', { value: false }));
          describe('and then', function() {
            beforeEach(Helpers.awaitEvent('empty-changed'));
            describe('calling reset()', function() {
              beforeEach(Helpers.reset);
              afterEach(Helpers.restoreCardClear);
              it('unsets the `error` property', Helpers.assertProps({ error: null }));
              it('clears the card', function() {
                expect(element.element!.clear).to.have.been.called;
              });
            });
          });
        });

        describe('describing a complete card', function() {
          beforeEach(Helpers.listenFor('complete-changed'));
          beforeEach(Helpers.synthCardEvent('change', { brand: 'visa', empty: false, complete: true }));
          it('fires `complete-changed` event', Helpers.assertEventDetail('complete-changed', { value: true }));
        });
      });

      describe('with a non-empty, incomplete form', function() {
        beforeEach(Helpers.synthStripeFormValues({ cardNumber: '4242424242424242' }));

        describe('calling createPaymentMethod()', function() {
          beforeEach(Helpers.createPaymentMethod);
          it('sets the `error` property', function() {
            expect(element.paymentMethod, 'paymentMethod').to.be.null;
            expect(element.error, 'error').to.eql(INCOMPLETE_CARD_ERROR);
          });

          describe('calling validate()', function() {
            beforeEach(Helpers.validate);
            it('returns false', function() {
              expect((element as StripeElements).validate()).to.be.false;
            });
          });


          describe('calling isPotentiallyValid()', function() {
            it('returns false', function() {
              expect((element as StripeElements).isPotentiallyValid()).to.be.false;
            });
          });
        });

        describe('calling createSource()', function() {
          beforeEach(Helpers.createSource);
          it('sets the `error` property', function() {
            expect(element.source, 'source').to.be.null;
            expect(element.error, 'error').to.eql(INCOMPLETE_CARD_ERROR);
          });

          describe('calling validate()', function() {
            it('returns false', function() {
              expect((element as StripeElements).validate()).to.be.false;
            });
          });

          describe('calling isPotentiallyValid()', function() {
            it('returns false', function() {
              expect((element as StripeElements).isPotentiallyValid()).to.be.false;
            });
          });
        });

        describe('calling createToken()', function() {
          beforeEach(Helpers.createToken);
          it('sets the `error` property', function() {
            expect(element.token, 'token').to.be.null;
            expect(element.error, 'error').to.eql(INCOMPLETE_CARD_ERROR);
          });

          describe('calling validate()', function() {
            it('returns false', function() {
              expect((element as StripeElements).validate()).to.be.false;
            });
          });

          describe('calling isPotentiallyValid()', function() {
            it('returns false', function() {
              expect((element as StripeElements).isPotentiallyValid()).to.be.false;
            });
          });
        });

        describe('calling submit()', function() {
          it('sets the `error` property', async function() {
            try {
              await (element as StripeElements).submit();
              expect.fail('Response Received');
            } catch (error) {
              expect(element.error, 'error').to.equal(INCOMPLETE_CARD_ERROR).and.to.equal(error);
              expect(element.source, 'source').to.be.null;
            }
          });
        });
      });

      describe('with a valid card', function() {
        beforeEach(Helpers.stubFetch);
        beforeEach(Helpers.synthStripeFormValues({ cardNumber: '4242424242424242', mm: '01', yy: '40', cvc: '000' }));
        afterEach(Helpers.restoreFetch);

        it('sets the `empty` property', Helpers.assertProps({ empty: false }));

        it('sets the `complete` property', Helpers.assertProps({ complete: true }));

        describe('calling createPaymentMethod()', function() {
          it('resolves with the payment method', async function() {
            const { paymentMethod } = await (element as StripeElements).createPaymentMethod();
            expect(paymentMethod).to.equal(SUCCESS_RESPONSES.paymentMethod);
          });

          describe('subsequently', function() {
            beforeEach(Helpers.listenFor('payment-method'));
            beforeEach(Helpers.listenFor('payment-method-changed'));
            beforeEach(Helpers.createPaymentMethod);
            it('fires a `payment-method` event', Helpers.assertEventDetail('payment-method', SUCCESS_RESPONSES.paymentMethod));
            it('fires a `payment-method-changed` event', Helpers.assertEventDetail('payment-method-changed', { value: SUCCESS_RESPONSES.paymentMethod }));
            describe('calling validate()', function() {
              beforeEach(Helpers.validate);
              it('unsets the `error` property', Helpers.assertProps({ error: null }));
              it('returns true', function() {
                expect((element as StripeElements).validate()).to.be.true;
              });
            });

            describe('calling isPotentiallyValid()', function() {
              it('returns true', function() {
                expect((element as StripeElements).isPotentiallyValid()).to.be.true;
              });
            });
          });
        });

        describe('calling createSource()', function() {
          it('resolves with the source', function(this: Mocha.Context) {
            return (element as StripeElements).createSource()
              .then(result => expect(result.source).to.equal(SUCCESS_RESPONSES.source));
          });

          describe('subsequently', function() {
            beforeEach(Helpers.listenFor('source'));
            beforeEach(Helpers.listenFor('source-changed'));
            beforeEach(Helpers.createSource);
            it('fires a `source` event', Helpers.assertEventDetail('source', SUCCESS_RESPONSES.source));
            it('fires a `source-changed` event', Helpers.assertEventDetail('source-changed', { value: SUCCESS_RESPONSES.source }));

            describe('calling validate()', function() {
              beforeEach(Helpers.validate);
              it('unsets the `error` property', Helpers.assertProps({ error: null }));
              it('returns true', function() {
                expect((element as StripeElements).validate()).to.be.true;
              });
            });

            describe('calling isPotentiallyValid()', function() {
              it('returns true', function() {
                expect((element as StripeElements).isPotentiallyValid()).to.be.true;
              });
            });
          });
        });

        describe('calling createToken()', function() {
          it('resolves with the token', function(this: Mocha.Context) {
            return (element as StripeElements).createToken()
              .then(result => expect(result.token).to.equal(SUCCESS_RESPONSES.token));
          });

          describe('subsequently', function() {
            beforeEach(Helpers.listenFor('token'));
            beforeEach(Helpers.listenFor('token-changed'));
            beforeEach(Helpers.createToken);
            it('fires a `token` event', Helpers.assertEventDetail('token', SUCCESS_RESPONSES.token));
            it('fires a `token-changed` event', Helpers.assertEventDetail('token-changed', { value: SUCCESS_RESPONSES.token }));

            describe('calling validate()', function() {
              beforeEach(Helpers.validate);
              it('unsets the `error` property', Helpers.assertProps({ error: null }));
              it('returns true', function() {
                expect((element as StripeElements).validate()).to.be.true;
              });
            });

            describe('calling isPotentiallyValid()', function() {
              it('returns true', function() {
                expect((element as StripeElements).isPotentiallyValid()).to.be.true;
              });
            });
          });
        });

        describe('and generate unset', function() {
          it('calling submit() resolves with the source', function(this: Mocha.Context) {
            return (element as StripeElements).submit()
              .then(result => expect((result as Stripe.SourceResult).source).to.equal(SUCCESS_RESPONSES.source));
          });

          describe('calling submit()', function() {
            describe('subsequently', function() {
              beforeEach(Helpers.listenFor('source'));
              beforeEach(Helpers.listenFor('source-changed'));
              beforeEach(Helpers.submit);
              it('fires a `source` event', Helpers.assertEventDetail('source', SUCCESS_RESPONSES.source));
              it('fires a `source-changed` event', Helpers.assertEventDetail('source-changed', { value: SUCCESS_RESPONSES.source }));

              describe('calling validate()', function() {
                beforeEach(Helpers.validate);
                it('unsets the `error` property', Helpers.assertProps({ error: null }));
                it('returns true', function() { expect((element as StripeElements).validate()).to.be.true; });
              });

              describe('calling isPotentiallyValid()', function() {
                it('returns true', function() {
                  expect((element as StripeElements).isPotentiallyValid()).to.be.true;
                });
              });
            });
          });
        });

        describe('and generate set to `source`', function() {
          beforeEach(Helpers.setProps({ generate: 'source' }));
          describe('calling submit()', function() {
            it('resolves with the source', function(this: Mocha.Context) {
              return (element as StripeElements).submit()
                .then(result => expect((result as Stripe.SourceResult).source).to.equal(SUCCESS_RESPONSES.source));
            });

            describe('subsequently', function() {
              beforeEach(Helpers.listenFor('source'));
              beforeEach(Helpers.listenFor('source-changed'));
              beforeEach(Helpers.submit);
              it('fires a `source` event', Helpers.assertEventDetail('source', SUCCESS_RESPONSES.source));
              it('fires a `source-changed` event', Helpers.assertEventDetail('source-changed', { value: SUCCESS_RESPONSES.source }));

              describe('calling validate()', function() {
                beforeEach(Helpers.validate);
                it('unsets the `error` property', Helpers.assertProps({ error: null }));
                it('returns true', function() { expect((element as StripeElements).validate()).to.be.true; });
              });

              describe('calling isPotentiallyValid()', function() {
                it('returns true', function() {
                  expect((element as StripeElements).isPotentiallyValid()).to.be.true;
                });
              });
            });
          });
        });

        describe('and generate set to `token`', function() {
          beforeEach(Helpers.setProps({ generate: 'token' }));
          describe('calling submit()', function() {
            it('resolves with the token', function(this: Mocha.Context) {
              return (element as StripeElements).submit()
                .then(result => expect((result as Stripe.TokenResult).token).to.equal(SUCCESS_RESPONSES.token));
            });

            describe('subsequently', function() {
              beforeEach(Helpers.listenFor('token'));
              beforeEach(Helpers.listenFor('token-changed'));
              beforeEach(Helpers.submit);
              it('fires a `token` event', Helpers.assertEventDetail('token', SUCCESS_RESPONSES.token));
              it('fires a `token-changed` event', Helpers.assertEventDetail('token-changed', { value: SUCCESS_RESPONSES.token }));

              describe('calling validate()', function() {
                beforeEach(Helpers.validate);
                it('unsets the `error` property', Helpers.assertProps({ error: null }));
                it('returns true', function() { expect((element as StripeElements).validate()).to.be.true; });
              });

              describe('calling isPotentiallyValid()', function() {
                it('returns true', function() {
                  expect((element as StripeElements).isPotentiallyValid()).to.be.true;
                });
              });
            });
          });
        });

        describe('and generate set to `payment-method`', function() {
          beforeEach(Helpers.setProps({ generate: 'payment-method' }));

          describe('calling submit()', function() {
            it('resolves with the payment method', async function() {
              const { paymentMethod } = await (element as StripeElements).submit() as Stripe.PaymentMethodResult;
              expect(paymentMethod).to.equal(SUCCESS_RESPONSES.paymentMethod);
            });

            describe('subsequently', function() {
              beforeEach(Helpers.submit);

              it('fires a `payment-method-changed` event', async function() {
                const ev = await oneEvent(element, 'payment-method-changed');
                expect(ev.detail.value).to.equal(SUCCESS_RESPONSES.paymentMethod);
              });

              it('fires a `payment-method` event', async function() {
                const ev = await oneEvent(element, 'payment-method');
                expect(ev.detail).to.equal(SUCCESS_RESPONSES.paymentMethod);
              });

              describe('calling validate()', function() {
                beforeEach(Helpers.validate);
                it('returns true', function() {
                  expect((element as StripeElements).validate()).to.be.true;
                });

                it('does not set `error`', function() {
                  expect(element.error).to.be.null;
                });
              });

              describe('calling isPotentiallyValid()', function() {
                it('returns true', function() {
                  expect((element as StripeElements).isPotentiallyValid()).to.be.true;
                });
              });
            });
          });
        });

        describe('and generate set to `something-silly`', function() {
          beforeEach(Helpers.setProps({ generate: 'something-silly' }));
          describe('calling submit()', function() {
            it('rejects', function() {
              return (element as StripeElements).submit().then(() => expect.fail('Response received'), function(err) {
                expect((err as Error).message).to.equal('<stripe-elements>: cannot generate something-silly');
              });
            });

            it('does not POST anything', async function() {
              await (element as StripeElements).submit().catch(Helpers.noop);
              expect(Helpers.fetchStub).to.not.have.been.called;
            });

            describe('subsequently', function(this: Mocha.Suite) {
              beforeEach(function(this: Mocha.Context) { return Helpers.submit.call(this).catch(Helpers.noop) });

              it('sets the `error` property', Helpers.assertElementErrorMessage('cannot generate something-silly'));

              describe('calling validate()', function() {
                beforeEach(Helpers.validate);
                it('returns false', function() {
                  expect((element as StripeElements).validate()).to.be.false;
                });
              });
            });
          });
        });

        describe('with `action` property set', function() {
          beforeEach(Helpers.setProps({ action: '/here' }));

          describe('calling createPaymentMethod()', function() {
            beforeEach(Helpers.createPaymentMethod);
            it('POSTs the paymentMethod to the endpoint at `action`', function() {
              const { action, paymentMethod } = element;
              expect(Helpers.fetchStub).to.have.been.calledWith(action, match({ body: JSON.stringify({ paymentMethod }) }) );
            });
          });

          describe('calling createSource()', function() {
            beforeEach(Helpers.createSource);
            it('POSTs the source to the endpoint at `action`', function() {
              const { action, source } = element;
              expect(Helpers.fetchStub).to.have.been.calledWith(action, match({ body: JSON.stringify({ source }) }) );
            });
          });

          describe('calling createToken()', function() {
            beforeEach(Helpers.createToken);
            it('POSTs the token to the endpoint at `action`', function() {
              const { action, token } = element;
              expect(Helpers.fetchStub).to.have.been.calledWith(action, match({ body: JSON.stringify({ token }) }) );
            });
          });

          describe('in case the endpoint at `action` throws', function() {
            const error = new Error('endpoint error');
            describe('calling submit()', function() {
              beforeEach(function() { Helpers.fetchStub.rejects(error); });
              beforeEach(Helpers.submit);
              it('sets the `error` property', Helpers.assertProps({ error }));
            });
          });
        });

        describe('with no `locale` property set', function() {
          it('should have `auto` by default', function() {
            expect(element.locale).to.be.equal('auto');
          });
        });

        describe('with `locale` property set', function() {
          const LOCALE = 'en';
          beforeEach(Helpers.setProps({ locale: LOCALE }));
          it(`should have ${LOCALE}`, function() {
            expect(element.locale).to.be.equal('en');
          });
        });
      });

      describe('with a card that will be declined', function() {
        beforeEach(Helpers.synthStripeFormValues({ cardNumber: '4000000000000002', mm: '01', yy: '40', cvc: '000' }));

        describe('calling createPaymentMethod()', function() {
          it('rejects with the Stripe error', async function() {
            return (element as StripeElements).createPaymentMethod()
              .then(
                () => expect.fail('createPaymentMethod Resolved'),
                e => expect(e).to.equal(CARD_DECLINED_ERROR)
              );
          });

          describe('subsequently', function() {
            beforeEach(Helpers.createPaymentMethod);
            it('sets the `error` property', Helpers.assertProps({ error: CARD_DECLINED_ERROR }));
            it('unsets the `paymentMethod` property', Helpers.assertProps({ paymentMethod: null }));

            describe('calling validate()', function() {
              beforeEach(Helpers.validate);
              it('returns false', function() {
                expect((element as StripeElements).validate()).to.be.false;
              });

              it('retains the `error` property', async function validating() {
                expect(element.error).to.equal(CARD_DECLINED_ERROR);
              });
            });
          });
        });

        describe('calling createSource()', function() {
          it('rejects with the Stripe error', async function() {
            return (element as StripeElements).createSource()
              .then(
                () => expect.fail('createSource Resolved'),
                er => expect(er).to.equal(CARD_DECLINED_ERROR)
              );
          });

          describe('subsequently', function() {
            beforeEach(Helpers.createSource);
            it('sets the `error` property', Helpers.assertProps({ error: CARD_DECLINED_ERROR }));
            it('unsets the `source` property', Helpers.assertProps({ source: null }));

            describe('calling validate()', function() {
              beforeEach(Helpers.validate);
              it('returns false', function() {
                expect((element as StripeElements).validate()).to.be.false;
              });

              it('retains the `error` property', Helpers.assertProps({ error: CARD_DECLINED_ERROR }));
            });
          });
        });

        describe('calling createToken()', function() {
          it('rejects with the Stripe error', async function() {
            return (element as StripeElements).createToken()
              .then(
                () => expect.fail('createToken Resolved'),
                e => expect(e).to.equal(CARD_DECLINED_ERROR)
              );
          });

          describe('subsequently', function() {
            beforeEach(Helpers.createToken);
            it('sets the `error` property', Helpers.assertProps({ error: CARD_DECLINED_ERROR }));
            it('unsets the `token` property', Helpers.assertProps({ token: null }));

            describe('calling validate()', function() {
              beforeEach(Helpers.validate);
              it('returns false', function() {
                expect((element as StripeElements).validate()).to.be.false;
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
