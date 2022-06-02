/* istanbul ignore file */
import '../src/stripe-payment-request';

import { expect, fixture, nextFrame, aTimeout } from '@open-wc/testing';
import { stub } from 'sinon';

import * as Helpers from '../test/test-helpers';
import { element } from '../test/test-helpers';

import {
  CARD_CONFIRM_ERROR_SECRET,
  CARD_DECLINED_ERROR,
  CLIENT_SECRET,
  Keys,
  SUCCESSFUL_PAYMENT_INTENT,
  SUCCESSFUL_PAYMENT_METHOD,
  SUCCESSFUL_SOURCE,
  SUCCESSFUL_TOKEN,
} from '../test/mock-stripe';

import { elem, not } from '../src/lib/predicates';
import { isStripeShippingOption, StripePaymentRequest } from '../src/stripe-payment-request';
import {StripeElements} from "../src";

const DEFAULT_PROPS = Object.freeze({
  ...Helpers.BASE_DEFAULT_PROPS,
  action: undefined,
  amount: undefined,
  canMakePayment: null,
  country: undefined,
  currency: undefined,
  displayItems: [],
  label: undefined,
  paymentRequest: null,
  pending: false,
  requestPayerEmail: undefined,
  requestPayerName: undefined,
  requestPayerPhone: undefined,
  requestShipping: undefined,
  shippingOptions: [],
  buttonType: 'default',
  buttonTheme: 'dark',
});

const READ_ONLY_PROPS = Object.freeze([
  ...Helpers.BASE_READ_ONLY_PROPS,
  'canMakePayment',
  'paymentRequest',
]);

const NOTIFYING_PROPS = Object.freeze([
  ...Helpers.BASE_NOTIFYING_PROPS,
]);

describe('isStripeShippingOption', function() {
  it('approves a shipping option', async function() {
    const el = await fixture('<stripe-shipping-option></stripe-shipping-option');
    expect(isStripeShippingOption(el)).to.be.true;
  });
  it('rejects a non-shipping option', async function() {
    const el = await fixture('<stripe-display-item></stripe-display-item');
    expect(isStripeShippingOption(el)).to.be.false;
  });
});

describe('<stripe-payment-request>', function() {
  beforeEach(Helpers.spyConsoleWarn);
  afterEach(Helpers.restoreConsoleWarn);
  afterEach(Helpers.resetTestState);

  describe('simply instantiating', function() {
    beforeEach(Helpers.setupNoProps);
    it('does not throw error', Helpers.assertProps({ tagName: 'STRIPE-PAYMENT-REQUEST' }));

    describe('uses default for property', function defaults() {
      beforeEach(Helpers.setupNoProps);
      Object.entries(DEFAULT_PROPS).forEach(Helpers.testDefaultPropEntry);
    });

    describe('has read-only property', function readOnly() {
      beforeEach(Helpers.setupNoProps);
      READ_ONLY_PROPS.forEach(Helpers.testReadOnlyProp);
    });

    describe('notifies when setting property', function notifying() {
      beforeEach(Helpers.setupNoProps);
      NOTIFYING_PROPS.filter(not(elem(READ_ONLY_PROPS))).forEach(Helpers.testWritableNotifyingProp);
    });

    describe('notifies when privately setting read-only property', function notifying() {
      beforeEach(Helpers.setupNoProps);
      READ_ONLY_PROPS.filter(elem(NOTIFYING_PROPS)).forEach(Helpers.testReadonlyNotifyingProp);
    });
  });

  describe('with <stripe-display-item> children', function() {
    const template = `
      <stripe-payment-request>
        <stripe-display-item data-amount="125" data-label="Double Double"> </stripe-display-item>
        <stripe-display-item data-amount="199" data-label="Box of 10 Timbits" data-pending="true"> </stripe-display-item>
        <stripe-display-item data-amount="325" data-label="Everything Bagel with Butter" data-pending="false"> </stripe-display-item>
      </stripe-payment-request>
    `;

    const displayItems = [
      { amount: 125, label: 'Double Double' },
      { amount: 199, label: 'Box of 10 Timbits', pending: true },
      { amount: 325, label: 'Everything Bagel with Butter', pending: false },
    ];

    beforeEach(Helpers.setupWithTemplate(template));
    it('gets the `displayItems` property based on DOM children', Helpers.assertProps({
      displayItems,
    }, { deep: true }));

    describe('and `displayItems` property set', function() {
      const displayItemsProperty = [{ amount: 125, label: 'Double Double' }];
      beforeEach(Helpers.setProps({ displayItems: displayItemsProperty }));
      it('gets the `displayItems` property based on DOM property', Helpers.assertProps({
        displayItems: displayItemsProperty,
      }, { deep: true }));
    });
  });

  describe('with <stripe-shipping-option> children', function() {
    const template = `
      <stripe-payment-request>
        <stripe-shipping-option data-id="pick-up" data-label="Pick Up" data-detail="Pick Up at Your Local Timmy's" data-amount="0"> </stripe-shipping-option>
        <stripe-shipping-option data-id="delivery" data-label="Delivery" data-detail="Timbits to Your Door" data-amount="200"> </stripe-shipping-option>
      </stripe-payment-request>
    `;

    const shippingOptions = [
      { id: 'pick-up', amount: 0, label: 'Pick Up', detail: 'Pick Up at Your Local Timmy\'s' },
      { id: 'delivery', amount: 200, label: 'Delivery', detail: 'Timbits to Your Door' },
    ];

    beforeEach(Helpers.setupWithTemplate(template));
    it('gets the `shippingOptions` property based on DOM children', Helpers.assertProps({ shippingOptions }, { deep: true }));

    describe('and `shippingOptions` property set', function() {
      const shippingOptionsProperty = [{ id: 'scotty', amount: 200, label: 'Beam Me Up', detail: 'There\'s a bug in the transporter buffer' }];
      beforeEach(Helpers.setProps({ shippingOptions: shippingOptionsProperty }));
      it('gets the `shippingOptions` property based on DOM property', Helpers.assertProps({ shippingOptions: shippingOptionsProperty }, { deep: true }));
    });
  });

  describe('with Native Shadow DOM support', function shadowDOM() {
    let nestedElement;
    let primaryHost;
    let secondaryHost;
    let tertiaryHost;
    let stripeMountId;

    describe('when nested one shadow-root deep', function() {
      beforeEach(Helpers.mockStripe);
      afterEach(Helpers.restoreStripe);
      beforeEach(async function setupOneRoot() {
        primaryHost = await fixture(`<primary-host tag="stripe-payment-request"></primary-host>`);
        ({ nestedElement } = primaryHost);
        ({ stripeMountId } = nestedElement);
      });

      it('leaves one breadcrumb on its way up to the document', async function breadcrumbs() {
        const [slottedChild] = nestedElement.querySelector('slot').assignedNodes();
        expect(slottedChild).to.contain(nestedElement.stripeMount);
      });

      it('slots mount point in to its light DOM', function() {
        const { tagName } = nestedElement;
        expect(primaryHost).lightDom.to.equal(Helpers.expectedLightDOM({ stripeMountId, tagName }));
      });

      it('does not break primary host\'s internal DOM', function() {
        expect(primaryHost).shadowDom.to.equal(`
          <h1>Other Primary Host Content</h1>
          <stripe-payment-request publishable-key="${Keys.PUBLISHABLE_KEY}">
            <slot name="stripe-payment-request-slot" slot="stripe-payment-request-slot"></slot>
          </stripe-payment-request>
        `);
      });
    });

    describe('when nested two shadow-roots deep', function() {
      beforeEach(async function setupTwoRoots() {
        secondaryHost = await fixture(`<secondary-host tag="stripe-payment-request"></secondary-host>`);
        ({ primaryHost } = secondaryHost);
        ({ nestedElement } = primaryHost);
        ({ stripeMountId } = nestedElement);
      });

      it('forwards stripe mount deeply through slots', async function breadcrumbs() {
        const [slottedChild] =
          primaryHost.shadowRoot.querySelector('slot')
            .assignedNodes()
            .flatMap(Helpers.assignedNodes);
        expect(slottedChild).to.contain(nestedElement.stripeMount);
      });

      it('slots mount point in to the light DOM of the secondary shadow host', function() {
        const { tagName } = nestedElement;
        expect(secondaryHost).lightDom.to.equal(Helpers.expectedLightDOM({ stripeMountId, tagName }));
      });

      it('appends a slot to the shadow DOM of the secondary shadow host', function() {
        expect(secondaryHost).shadowDom.to.equal(`
          <primary-host tag="stripe-payment-request">
            <slot name="stripe-payment-request-slot" slot="stripe-payment-request-slot"></slot>
          </primary-host>
        `);
      });

      it('only creates one slot', function() {
        expect(document.getElementById(stripeMountId)).to.be.ok;
        expect(document.querySelectorAll(`#${stripeMountId}`).length).to.equal(1);
        expect(document.querySelectorAll('[slot="stripe-payment-request-slot"]').length).to.equal(1);
      });
    });

    describe('when nested three shadow-roots deep', function() {
      beforeEach(async function setupThreeRoots() {
        tertiaryHost = await fixture(`<tertiary-host tag="stripe-payment-request"></tertiary-host>`);
        ({ secondaryHost } = tertiaryHost);
        ({ primaryHost } = secondaryHost);
        ({ nestedElement } = primaryHost);
        ({ stripeMountId } = nestedElement);
      });

      it('forwards stripe mount deeply through slots', async function breadcrumbs() {
        const [slottedChild] =
          primaryHost.shadowRoot.querySelector('slot')
            .assignedNodes()
            .flatMap(Helpers.assignedNodes)
            .flatMap(Helpers.assignedNodes);
        expect(slottedChild).to.contain(nestedElement.stripeMount);
      });

      it('slots mount point in to the light DOM of the tertiary shadow host', function() {
        const { tagName } = nestedElement;
        expect(tertiaryHost).lightDom.to.equal(Helpers.expectedLightDOM({ stripeMountId, tagName }));
      });

      it('appends a slot to the shadow DOM of the tertiary shadow host', function() {
        expect(tertiaryHost).shadowDom.to.equal(`
          <secondary-host tag="stripe-payment-request">
            <slot name="stripe-payment-request-slot" slot="stripe-payment-request-slot"></slot>
          </secondary-host>
        `);
      });

      it('appends a slot to the shadow DOM of the secondary shadow host', function() {
        expect(secondaryHost).shadowDom.to.equal(`
          <primary-host tag="stripe-payment-request">
            <slot name="stripe-payment-request-slot" slot="stripe-payment-request-slot"></slot>
          </primary-host>
        `);
      });

      it('only creates one slot', function() {
        expect(document.getElementById(stripeMountId)).to.be.ok;
        expect(document.querySelectorAll(`#${stripeMountId}`).length).to.equal(1);
        expect(document.querySelectorAll('[slot="stripe-payment-request-slot"]').length).to.equal(1);
      });
    });
  });

  describe('when the user agent is unable to make a payment', function() {
    describe('with mocked Stripe.js', function withMockedStripeJs() {
      beforeEach(Helpers.mockStripe);
      beforeEach(Helpers.setupNoProps);
      afterEach(Helpers.restoreStripe);

      describe('when setting publishable key', function() {
        beforeEach(Helpers.listenFor('unsupported'));
        beforeEach(Helpers.setProps({ publishableKey: Keys.PUBLISHABLE_KEY }));
        it('fires the `unsupported` event', Helpers.assertFired('unsupported'));
      });
    });
  });

  describe('when the user agent is able to make a payment', function() {
    beforeEach(Helpers.mockCanMakePayment);
    afterEach(Helpers.restoreCanMakePayment);

    // TODO: test loading behaviour by mocking loadStripe in test-runner config
    describe.skip('without Stripe.js', function withoutStripe() {
      beforeEach(Helpers.restoreStripe);
      describe('with a valid publishable key', function apiKey() {
        beforeEach(Helpers.setupWithPublishableKey(Keys.PUBLISHABLE_KEY));

        it('logs a warning', function() {
          expect(console.warn).to.have.been.calledWith(`<${(element.constructor as typeof StripePaymentRequest).is}>: ${Helpers.NO_STRIPE_JS_ERROR}`);
        });

        it('does not initialize stripe instance', Helpers.assertPropsOk(['stripe'], { not: true }));

        it('does not mount element', function() {
          expect(element.element).to.not.be.ok;
        });

        it('sets the `error` property', Helpers.assertElementErrorMessage(Helpers.NO_STRIPE_JS_ERROR));
      });
    });

    describe('with mocked Stripe.js', function withMockedStripeJs() {
      beforeEach(Helpers.mockStripe);
      afterEach(Helpers.restoreStripe);

      describe('with request-shipping attr', function() {
        const template = `
          <stripe-payment-request request-shipping></stripe-payment-request>
        `;

        beforeEach(Helpers.setupWithTemplate(template));
        describe('and a valid publishable key', function() {
          beforeEach(Helpers.setProps({ publishableKey: Keys.PUBLISHABLE_KEY }));
          beforeEach(nextFrame);
          it('initializes stripe with requestShipping option', function() {
            expect(element.stripe.paymentRequest).to.have.been.calledWithMatch({ requestShipping: true });
          });
        });
      });

      describe('and CSS custom properties applied', function() {
        beforeEach(Helpers.appendHeightStyleTag);
        afterEach(Helpers.removeHeightStyleTag);

        describe('and a valid publishable key', function publishableKeyReset() {
          beforeEach(Helpers.setupWithPublishableKey(Keys.PUBLISHABLE_KEY));
          beforeEach(nextFrame);

          describe('calling blur()', function() {
            beforeEach(Helpers.spyStripeElementBlur);
            beforeEach(Helpers.blur);
            afterEach(Helpers.restoreStripeElementBlur);
            it('calls StripeElement#blur', function() {
              expect(element.element.blur).to.have.been.called;
            });
          });

          describe('calling focus()', function() {
            beforeEach(Helpers.spyStripeElementFocus);
            beforeEach(Helpers.focus);
            afterEach(Helpers.restoreStripeElementFocus);
            it('calls StripeElement#focus', function() {
              expect(element.element.focus).to.have.been.called;
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

          describe('when publishable key is changed', function publishableKeyReset() {
            beforeEach(Helpers.setProps({ publishableKey: 'foo' }));
            beforeEach(nextFrame);
            it('passes CSS custom property values to stripe', function() {
              expect(
                // @ts-expect-error: stripe made this private?
                element.element.style
                  .paymentRequestButton.height).to.equal('1000px');
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
              expect(element.stripeMount.id).to.not.equal(Helpers.initialStripeMountId);
            });
          });
        });
        describe('when setting publishable key', function() {
          beforeEach(Helpers.setProps({ publishableKey: Keys.PUBLISHABLE_KEY }));
          beforeEach(Helpers.listenFor('ready'));
          it('fires the `ready` event', Helpers.assertFired('ready'));
        });
      });

      describe('and a valid publishable key', function() {
        beforeEach(Helpers.setupWithPublishableKey(Keys.PUBLISHABLE_KEY));

        describe('with country and currency set', function() {
          beforeEach(Helpers.setProps({ country: 'CA', currency: 'cad' }));

          it('uses default element height value', function() {
            expect(
              // @ts-expect-error: stripe made this private?
              element.element.style
                .paymentRequestButton.height).to.equal('40px');
          });

          describe('with `generate` set to "source"', function() {
            beforeEach(Helpers.setProps({ generate: 'source' }));

            it('initializes stripe instance', Helpers.assertPropsOk(['stripe']));

            it('initializes elements instance', Helpers.assertPropsOk(['elements']));

            describe('when the paymentRequest fires the `source` event', function() {
              const complete = stub();
              const source = SUCCESSFUL_SOURCE;
              beforeEach(Helpers.listenFor('success'));
              beforeEach(Helpers.synthPaymentRequestEvent('source', { source, complete }));
              beforeEach(nextFrame);
              beforeEach(nextFrame);
              beforeEach(nextFrame);
              beforeEach(nextFrame);
              beforeEach(nextFrame);
              beforeEach(nextFrame);
              afterEach(complete.resetBehavior.bind(complete));
              it('fires a `success` event', Helpers.assertFired('success'));
              it('sets the `source` property', Helpers.assertProps({ source }));
              it('unsets the `error` property', Helpers.assertProps({ error: null }));
              it('unsets the `token` property', Helpers.assertProps({ token: null }));
              it('unsets the `paymentMethod` property', Helpers.assertProps({ paymentMethod: null }));
              it('calls the complete function', Helpers.assertCalled(complete));
            });

            describe('when the paymentRequest fires a `source` event with an error', function() {
              const complete = stub();
              const error = CARD_DECLINED_ERROR;
              beforeEach(Helpers.listenFor('fail'));
              beforeEach(Helpers.synthPaymentRequestEvent('source', { error, complete }));
              beforeEach(nextFrame);
              afterEach(complete.resetBehavior.bind(complete));
              it('fires a `fail` event', Helpers.assertFired('fail'));
              it('sets the `error` property', Helpers.assertProps({ error }));
              it('unsets the `token` property', Helpers.assertProps({ token: null }));
              it('unsets the `source` property', Helpers.assertProps({ source: null }));
              it('unsets the `paymentMethod` property', Helpers.assertProps({ paymentMethod: null }));
              it('calls the complete function', Helpers.assertCalled(complete));
            });
          });
        });

        describe('when stripe account is changed', function stripeAccountSet() {
          beforeEach(Helpers.setProps({ publishableKey: 'foo', stripeAccount: 'bar' }));
          beforeEach(nextFrame);
          it('reinitializes stripe', function() { expect(element.stripe).to.be.ok.and.not.deep.equal(Helpers.initialStripe); });
          it('has stripeAccount in its options', function() {
            const { stripe } = element as StripeElements;
            const { opts } = stripe as any;
            expect(opts).to.have.property('stripeAccount');
          });
        });

        describe('when publishable key is changed', function publishableKeyReset() {
          let initialStripeMountId;
          beforeEach(function() { initialStripeMountId = element.stripeMountId; });
          beforeEach(Helpers.setProps({ publishableKey: 'foo' }));
          beforeEach(nextFrame);
          afterEach(function() { initialStripeMountId = undefined; });
          it('reinitializes stripe', function() { expect(element.stripe).to.be.ok.and.not.equal(Helpers.initialStripe); });
          it('uses a new mount point id', function() { expect(element.stripeMountId).to.be.ok.and.not.equal(initialStripeMountId); });
        });

        describe('when publishable key is unset', function pkReset() {
          beforeEach(Helpers.setProps({ publishableKey: undefined }));
          beforeEach(nextFrame);
          it('unsets the `stripe` property', Helpers.assertProps({ stripe: null }));
          it('unsets the `element` property', Helpers.assertProps({ element: null }));
          it('unsets the `elements` property', Helpers.assertProps({ elements: null }));
        });

        // TODO: should fire `ready`
        describe('after some time', function() {
          beforeEach(() => aTimeout(200));
          const canMakePayment = { applePay: true };
          it('sets the `paymentRequest` property', Helpers.assertPropsOk(['paymentRequest']));
          it('sets the `canMakePayment` property', Helpers.assertProps({ canMakePayment }, { deep: true }));

          describe('setting `amount`', function() {
            beforeEach(Helpers.setProps({ amount: 10 }));
            it('sets the amount on the paymentRequest', function() {
              // @ts-expect-error: checking my own mocks
              expect((element as StripePaymentRequest).paymentRequest.total.amount).to.equal(10);
            });
            describe('then setting a different `amount`', function() {
              beforeEach(Helpers.setProps({ amount: 20 }));
              it('sets the new amount on the paymentRequest', function() {
                // @ts-expect-error: checking my own mocks
                expect((element as StripePaymentRequest).paymentRequest.total.amount).to.equal(20);
              });
            });
          });
        });

        describe('when the paymentRequest fires the `cancel` event', function() {
          beforeEach(Helpers.listenFor('cancel'));
          beforeEach(Helpers.synthPaymentRequestEvent('cancel'));
          it('fires a `cancel` event', Helpers.assertFired('cancel'));
        });

        describe('when the paymentRequest fires the `shippingaddresschange` event', function() {
          beforeEach(Helpers.listenFor('shippingaddresschange'));
          beforeEach(Helpers.synthPaymentRequestEvent('shippingaddresschange'));
          it('fires a `shippingaddresschange` event', Helpers.assertFired('shippingaddresschange'));
        });

        describe('when the paymentRequest fires the `shippingoptionchange` event', function() {
          beforeEach(Helpers.listenFor('shippingoptionchange'));
          beforeEach(Helpers.synthPaymentRequestEvent('shippingoptionchange'));
          it('fires a `shippingoptionchange` event', Helpers.assertFired('shippingoptionchange'));
        });

        describe('with `generate` set to "token"', function() {
          beforeEach(Helpers.setProps({ generate: 'token' }));
          describe('when the paymentRequest fires the `token` event', function() {
            const complete = stub();
            const token = SUCCESSFUL_TOKEN;
            beforeEach(Helpers.listenFor('success'));
            beforeEach(Helpers.synthPaymentRequestEvent('token', { token, complete }));
            beforeEach(nextFrame);
            afterEach(complete.resetBehavior.bind(complete));
            it('fires a `success` event', Helpers.assertFired('success'));
            it('sets the `token` property', Helpers.assertProps({ token }));
            it('unsets the `error` property', Helpers.assertProps({ error: null }));
            it('unsets the `source` property', Helpers.assertProps({ source: null }));
            it('unsets the `paymentMethod` property', Helpers.assertProps({ paymentMethod: null }));
            it('calls the complete function', Helpers.assertCalled(complete));
          });

          describe('when the paymentRequest fires a `token` event with an error', function() {
            const complete = stub();
            const error = CARD_DECLINED_ERROR;
            beforeEach(Helpers.listenFor('fail'));
            beforeEach(Helpers.synthPaymentRequestEvent('token', { error, complete }));
            afterEach(complete.resetBehavior.bind(complete));
            it('fires a `fail` event', Helpers.assertFired('fail'));
            it('sets the `error` property', Helpers.assertProps({ error }));
            it('unsets the `token` property', Helpers.assertProps({ token: null }));
            it('unsets the `source` property', Helpers.assertProps({ source: null }));
            it('unsets the `paymentMethod` property', Helpers.assertProps({ paymentMethod: null }));
            it('calls the complete function', Helpers.assertCalled(complete));
          });
        });

        describe('with `generate` set to "payment-method"', function() {
          beforeEach(Helpers.setProps({ generate: 'payment-method' }));

          describe('when the paymentRequest fires the `paymentmethod` event', function() {
            const complete = stub();
            const paymentMethod = SUCCESSFUL_PAYMENT_METHOD;
            beforeEach(Helpers.listenFor('success'));
            beforeEach(nextFrame);
            beforeEach(Helpers.synthPaymentRequestEvent('paymentmethod', { paymentMethod, complete }));
            afterEach(complete.resetBehavior.bind(complete));
            it('fires a `success` event', Helpers.assertFired('success'));
            it('sets the `paymentMethod` property', Helpers.assertProps({ paymentMethod }));
            it('unsets the `error` property', Helpers.assertProps({ error: null }));
            it('unsets the `source` property', Helpers.assertProps({ source: null }));
            it('unsets the `token` property', Helpers.assertProps({ token: null }));
            it('calls the complete function', Helpers.assertCalled(complete));
          });

          describe('when the paymentRequest fires a `paymentmethod` event with an error', function() {
            const complete = stub();
            const error = CARD_DECLINED_ERROR;
            beforeEach(Helpers.listenFor('fail'));
            beforeEach(Helpers.synthPaymentRequestEvent('paymentmethod', { error, complete }));
            beforeEach(nextFrame);
            afterEach(complete.resetBehavior.bind(complete));
            it('fires a `fail` event', Helpers.assertFired('fail'));
            it('sets the `error` property', Helpers.assertProps({ error }));
            it('unsets the `paymentMethod` property', Helpers.assertProps({ paymentMethod: null }));
            it('unsets the `source` property', Helpers.assertProps({ source: null }));
            it('unsets the `token` property', Helpers.assertProps({ token: null }));
            it('calls the complete function', Helpers.assertCalled(complete));
          });

          describe('with `clientSecret` set', function() {
            beforeEach(Helpers.setProps({ clientSecret: CLIENT_SECRET }));
            describe('when the paymentRequest fires the `paymentmethod` event', function() {
              const complete = stub();
              const paymentMethod = SUCCESSFUL_PAYMENT_METHOD;
              const paymentIntent = SUCCESSFUL_PAYMENT_INTENT;
              beforeEach(Helpers.listenFor('success'));
              beforeEach(Helpers.synthPaymentRequestEvent('paymentmethod', { paymentMethod, complete }));
              beforeEach(nextFrame);
              afterEach(complete.resetBehavior.bind(complete));
              it('sets the `paymentMethod` property', Helpers.assertProps({ paymentMethod }));
              it('sets the `paymentIntent` property', Helpers.assertProps({ paymentIntent }));
              it('unsets the `error` property', Helpers.assertProps({ error: null }));
              it('unsets the `source` property', Helpers.assertProps({ source: null }));
              it('unsets the `token` property', Helpers.assertProps({ token: null }));
              it('fires a `success` event', Helpers.assertFired('success'));
              it('calls the complete function', Helpers.assertCalled(complete));
              describe('then calling reset()', function() {
                beforeEach(Helpers.reset);
                it('unsets all the properties', Helpers.assertProps({ paymentMethod: null, paymentIntent: null, error: null, source: null, token: null }));
              });
            });

            describe('when the paymentRequest fires a `paymentmethod` event with an error', function() {
              const complete = stub();
              const error = CARD_DECLINED_ERROR;
              beforeEach(Helpers.listenFor('fail'));
              beforeEach(Helpers.synthPaymentRequestEvent('paymentmethod', { error, complete }));
              beforeEach(nextFrame);
              afterEach(complete.resetBehavior.bind(complete));
              it('fires a `fail` event', Helpers.assertFired('fail'));
              it('sets the `error` property', Helpers.assertProps({ error }));
              it('unsets the `paymentMethod` property', Helpers.assertProps({ paymentMethod: null }));
              it('unsets the `source` property', Helpers.assertProps({ source: null }));
              it('unsets the `token` property', Helpers.assertProps({ token: null }));
              it('calls the complete function', Helpers.assertCalled(complete));
            });
          });

          describe('when the card will be declined', function() {
            const error = CARD_DECLINED_ERROR;
            beforeEach(Helpers.setProps({ clientSecret: CARD_CONFIRM_ERROR_SECRET }));
            describe('when the paymentRequest fires the `paymentmethod` event', function() {
              const complete = stub();
              const paymentMethod = SUCCESSFUL_PAYMENT_METHOD;
              beforeEach(Helpers.listenFor('fail'));
              beforeEach(Helpers.synthPaymentRequestEvent('paymentmethod', { paymentMethod, complete }));
              beforeEach(nextFrame);
              afterEach(complete.resetBehavior.bind(complete));
              it('sets the `error` property', Helpers.assertProps({ error }));
              it('unsets the `paymentMethod` property', Helpers.assertProps({ paymentMethod: null }));
              it('unsets the `paymentIntent` property', Helpers.assertProps({ paymentIntent: null }));
              it('unsets the `source` property', Helpers.assertProps({ source: null }));
              it('unsets the `token` property', Helpers.assertProps({ token: null }));
              it('fires a `fail` event', Helpers.assertFired('fail'));
              it('calls the complete function', Helpers.assertCalled(complete));
              describe('then calling reset()', function() {
                beforeEach(Helpers.reset);
                it('unsets all the properties', Helpers.assertProps({ paymentMethod: null, paymentIntent: null, error: null, source: null, token: null }));
              });
            });
          });
        });
      });
    });
  });
});
