/* istanbul ignore file */
import '../stripe-payment-request.js';

import { expect, fixture, nextFrame } from '@open-wc/testing';
import { stub } from 'sinon';

import {
  BASE_DEFAULT_PROPS,
  BASE_NOTIFYING_PROPS,
  BASE_READ_ONLY_PROPS,
  NO_STRIPE_JS_ERROR,
  appendHeightStyleTag,
  assertCalled,
  assertElementErrorMessage,
  assertFired,
  assertProps,
  assertPropsOk,
  assignedNodes,
  blur,
  blurStripeElement,
  element,
  expectedLightDOM,
  focus,
  focusStripeElement,
  initialStripe,
  initialStripeMountId,
  listenFor,
  mockCanMakePayment,
  mockShadyCSS,
  mockShadyDOM,
  mockStripe,
  mountLightDOM,
  removeHeightStyleTag,
  removeStripeMount,
  reset,
  resetTestState,
  restoreCanMakePayment,
  restoreConsoleWarn,
  restoreShadyCSS,
  restoreShadyDOM,
  restoreStripe,
  restoreStripeElementBlur,
  restoreStripeElementFocus,
  setProps,
  setupNoProps,
  setupWithPublishableKey,
  setupWithTemplate,
  spyConsoleWarn,
  spyStripeElementBlur,
  spyStripeElementFocus,
  synthPaymentRequestEvent,
  testDefaultPropEntry,
  testReadOnlyProp,
  testReadonlyNotifyingProp,
  testWritableNotifyingProp,
  updateComplete,
} from '../test/test-helpers';
import {
  CARD_CONFIRM_ERROR_SECRET,
  CARD_DECLINED_ERROR,
  CLIENT_SECRET,
  PUBLISHABLE_KEY,
  SUCCESSFUL_PAYMENT_INTENT,
  SUCCESSFUL_PAYMENT_METHOD,
  SUCCESSFUL_SOURCE,
  SUCCESSFUL_TOKEN,
} from '../test/mock-stripe';
import { elem, not } from './lib/predicates';

const DEFAULT_PROPS = Object.freeze({
  ...BASE_DEFAULT_PROPS,
  action: undefined,
  amount: undefined,
  canMakePayment: null,
  country: undefined,
  currency: undefined,
  displayItems: undefined,
  label: undefined,
  paymentRequest: null,
  pending: false,
  requestPayerEmail: undefined,
  requestPayerName: undefined,
  requestPayerPhone: undefined,
  requestShipping: undefined,
  shippingOptions: undefined,
  buttonType: 'default',
  buttonTheme: 'dark',
});

const READ_ONLY_PROPS = Object.freeze([
  ...BASE_READ_ONLY_PROPS,
  'canMakePayment',
  'paymentRequest',
]);

const NOTIFYING_PROPS = Object.freeze([
  ...BASE_NOTIFYING_PROPS,
]);

describe('<stripe-payment-request>', function() {
  beforeEach(spyConsoleWarn);
  afterEach(restoreConsoleWarn);
  afterEach(resetTestState);

  describe('simply instantiating', function() {
    beforeEach(setupNoProps);
    it('does not throw error', assertProps({ tagName: 'STRIPE-PAYMENT-REQUEST' }));

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

  describe('with <stripe-display-item> children', function() {
    const template = `
      <stripe-payment-request>
        <stripe-display-item data-amount="125" data-label="Double Double"> </stripe-display-item>
        <stripe-display-item data-amount="199" data-label="Box of 10 Timbits"> </stripe-display-item>
      </stripe-payment-request>
    `;

    const displayItems = [
      { amount: 125, label: 'Double Double' },
      { amount: 199, label: 'Box of 10 Timbits' },
    ];

    beforeEach(setupWithTemplate(template));
    it('gets the `displayItems` property based on DOM children', assertProps({ displayItems }, { deep: true }));

    describe('and `displayItems` property set', function() {
      const displayItemsProperty = [{ amount: 125, label: 'Double Double' }];
      beforeEach(setProps({ displayItems: displayItemsProperty }));
      it('gets the `displayItems` property based on DOM property', assertProps({ displayItems: displayItemsProperty }, { deep: true }));
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

    beforeEach(setupWithTemplate(template));
    it('gets the `shippingOptions` property based on DOM children', assertProps({ shippingOptions }, { deep: true }));

    describe('and `shippingOptions` property set', function() {
      const shippingOptionsProperty = [{ id: 'scotty', amount: 200, label: 'Beam Me Up', detail: 'There\'s a bug in the transporter buffer' }];
      beforeEach(setProps({ shippingOptions: shippingOptionsProperty }));
      it('gets the `shippingOptions` property based on DOM property', assertProps({ shippingOptions: shippingOptionsProperty }, { deep: true }));
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
        primaryHost = await fixture(`<primary-host tag="stripe-payment-request"></primary-host>`);
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
          <stripe-payment-request publishable-key="${PUBLISHABLE_KEY}">
            <slot name="stripe-card" slot="stripe-card"></slot>
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
            .flatMap(assignedNodes);
        expect(slottedChild).to.contain(nestedElement.stripeMount);
      });

      it('slots mount point in to the light DOM of the secondary shadow host', function() {
        expect(secondaryHost).lightDom.to.equal(expectedLightDOM({ stripeMountId, tagName: nestedElement.constructor.is }));
      });

      it('appends a slot to the shadow DOM of the secondary shadow host', function() {
        expect(secondaryHost).shadowDom.to.equal(`
          <primary-host tag="stripe-payment-request">
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
            .flatMap(assignedNodes)
            .flatMap(assignedNodes);
        expect(slottedChild).to.contain(nestedElement.stripeMount);
      });

      it('slots mount point in to the light DOM of the tertiary shadow host', function() {
        expect(tertiaryHost).lightDom.to.equal(expectedLightDOM({ stripeMountId, tagName: nestedElement.constructor.is }));
      });

      it('appends a slot to the shadow DOM of the tertiary shadow host', function() {
        expect(tertiaryHost).shadowDom.to.equal(`
          <secondary-host tag="stripe-payment-request">
            <slot name="stripe-card" slot="stripe-card"></slot>
          </secondary-host>
        `);
      });

      it('appends a slot to the shadow DOM of the secondary shadow host', function() {
        expect(secondaryHost).shadowDom.to.equal(`
          <primary-host tag="stripe-payment-request">
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

  describe('when the user agent is able to make a payment', function() {
    beforeEach(mockCanMakePayment);
    afterEach(restoreCanMakePayment);
    describe('without Stripe.js', function withoutStripe() {
      beforeEach(restoreStripe);
      describe('with a valid publishable key', function apiKey() {
        beforeEach(setupWithPublishableKey(PUBLISHABLE_KEY));

        it('logs a warning', async function logsWarning() {
          expect(console.warn).to.have.been.calledWith(`<${element.constructor.is}>: ${NO_STRIPE_JS_ERROR}`);
        });

        it('does not initialize stripe instance', assertPropsOk(['stripe'], { not: true }));

        it('does not mount element', async function noCard() {
          expect(element.element).to.not.be.ok;
        });

        it('sets the `error` property', assertElementErrorMessage(NO_STRIPE_JS_ERROR));
      });
    });

    describe('with mocked Stripe.js', function withMockedStripeJs() {
      beforeEach(mockStripe);
      afterEach(restoreStripe);

      describe('and CSS custom properties applied', function() {
        beforeEach(appendHeightStyleTag);
        afterEach(removeHeightStyleTag);

        describe('and a valid publishable key', function publishableKeyReset() {
          beforeEach(setupWithPublishableKey(PUBLISHABLE_KEY));
          beforeEach(nextFrame);
          describe('with a mocked ShadyCSS shim', function() {
            beforeEach(mockShadyCSS);
            afterEach(restoreShadyCSS);

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
              beforeEach(setProps({ publishableKey: 'foo' }));
              beforeEach(nextFrame);
              it('passes CSS custom property values to stripe', function() {
                expect(element.element.style.paymentRequestButton.height).to.equal('1000px');
              });
            });
          });

          describe('without the ShadyCSS shim', function() {
            describe('when publishable key is changed', function publishableKeyReset() {
              beforeEach(setProps({ publishableKey: 'foo' }));
              beforeEach(nextFrame);
              it('passes CSS custom property values to stripe', function() {
                expect(element.element.style.paymentRequestButton.height).to.equal('1000px');
              });
            });
          });
        });
      });


      describe('without CSS custom properties applied', function() {
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
            });
          });
        });

        describe('and a valid publishable key', function() {
          beforeEach(setupWithPublishableKey(PUBLISHABLE_KEY));

          describe('with country and currency set', function() {
            beforeEach(setProps({ country: 'CA', currency: 'cad' }));

            it('uses default element height value', function() {
              expect(element.element.style.paymentRequestButton.height).to.equal('40px');
            });

            describe('with `generate` set to "source"', function() {
              beforeEach(setProps({ generate: 'source' }));
              it('initializes stripe instance', assertPropsOk(['stripe']));

              it('initializes elements instance', assertPropsOk(['elements']));
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
              it('unsets the `stripe` property', assertProps({ stripe: null }));
              it('unsets the `element` property', assertProps({ element: null }));
              it('unsets the `elements` property', assertProps({ elements: null }));
            });

            it('sets the `canMakePayment` property', assertProps({ canMakePayment: { applePay: true } }, { deep: true }));

            it('sets the `paymentRequest` property', assertPropsOk(['paymentRequest']));

            describe('when the paymentRequest fires the `cancel` event', function() {
              beforeEach(listenFor('cancel'));
              beforeEach(synthPaymentRequestEvent('cancel'));
              it('fires a `cancel` event', assertFired('cancel'));
            });

            describe('when the paymentRequest fires the `shippingaddresschange` event', function() {
              beforeEach(listenFor('shippingaddresschange'));
              beforeEach(synthPaymentRequestEvent('shippingaddresschange'));
              it('fires a `shippingaddresschange` event', assertFired('shippingaddresschange'));
            });

            describe('when the paymentRequest fires the `shippingoptionchange` event', function() {
              beforeEach(listenFor('shippingoptionchange'));
              beforeEach(synthPaymentRequestEvent('shippingoptionchange'));
              it('fires a `shippingoptionchange` event', assertFired('shippingoptionchange'));
            });

            describe('when the paymentRequest fires the `source` event', function() {
              const complete = stub();
              const source = SUCCESSFUL_SOURCE;
              beforeEach(listenFor('success'));
              beforeEach(synthPaymentRequestEvent('source', { source, complete }));
              beforeEach(nextFrame);
              afterEach(complete.resetBehavior.bind(complete));
              it('fires a `success` event', assertFired('success'));
              it('sets the `source` property', assertProps({ source }));
              it('unsets the `error` property', assertProps({ error: null }));
              it('unsets the `token` property', assertProps({ token: null }));
              it('unsets the `paymentMethod` property', assertProps({ paymentMethod: null }));
              it('calls the complete function', assertCalled(complete));
            });

            describe('when the paymentRequest fires a `source` event with an error', function() {
              const complete = stub();
              const error = CARD_DECLINED_ERROR;
              beforeEach(listenFor('fail'));
              beforeEach(synthPaymentRequestEvent('source', { error, complete }));
              beforeEach(nextFrame);
              afterEach(complete.resetBehavior.bind(complete));
              it('fires a `fail` event', assertFired('fail'));
              it('sets the `error` property', assertProps({ error }));
              it('unsets the `token` property', assertProps({ token: null }));
              it('unsets the `source` property', assertProps({ source: null }));
              it('unsets the `paymentMethod` property', assertProps({ paymentMethod: null }));
              it('calls the complete function', assertCalled(complete));
            });
          });

          describe('with `generate` set to "token"', function() {
            beforeEach(setProps({ generate: 'token' }));
            describe('when the paymentRequest fires the `token` event', function() {
              const complete = stub();
              const token = SUCCESSFUL_TOKEN;
              beforeEach(listenFor('success'));
              beforeEach(synthPaymentRequestEvent('token', { token, complete }));
              beforeEach(nextFrame);
              afterEach(complete.resetBehavior.bind(complete));
              it('fires a `success` event', assertFired('success'));
              it('sets the `token` property', assertProps({ token }));
              it('unsets the `error` property', assertProps({ error: null }));
              it('unsets the `source` property', assertProps({ source: null }));
              it('unsets the `paymentMethod` property', assertProps({ paymentMethod: null }));
              it('calls the complete function', assertCalled(complete));
            });

            describe('when the paymentRequest fires a `token` event with an error', function() {
              const complete = stub();
              const error = CARD_DECLINED_ERROR;
              beforeEach(listenFor('fail'));
              beforeEach(synthPaymentRequestEvent('token', { error, complete }));
              afterEach(complete.resetBehavior.bind(complete));
              it('fires a `fail` event', assertFired('fail'));
              it('sets the `error` property', assertProps({ error }));
              it('unsets the `token` property', assertProps({ token: null }));
              it('unsets the `source` property', assertProps({ source: null }));
              it('unsets the `paymentMethod` property', assertProps({ paymentMethod: null }));
              it('calls the complete function', assertCalled(complete));
            });
          });

          describe('with `generate` set to "payment-method"', function() {
            beforeEach(setProps({ generate: 'payment-method' }));

            describe('when the paymentRequest fires the `paymentmethod` event', function() {
              const complete = stub();
              const paymentMethod = SUCCESSFUL_PAYMENT_METHOD;
              beforeEach(listenFor('success'));
              beforeEach(nextFrame);
              beforeEach(synthPaymentRequestEvent('paymentmethod', { paymentMethod, complete }));
              afterEach(complete.resetBehavior.bind(complete));
              it('fires a `success` event', assertFired('success'));
              it('sets the `paymentMethod` property', assertProps({ paymentMethod }));
              it('unsets the `error` property', assertProps({ error: null }));
              it('unsets the `source` property', assertProps({ source: null }));
              it('unsets the `token` property', assertProps({ token: null }));
              it('calls the complete function', assertCalled(complete));
            });

            describe('when the paymentRequest fires a `paymentmethod` event with an error', function() {
              const complete = stub();
              const error = CARD_DECLINED_ERROR;
              beforeEach(listenFor('fail'));
              beforeEach(synthPaymentRequestEvent('paymentmethod', { error, complete }));
              beforeEach(nextFrame);
              afterEach(complete.resetBehavior.bind(complete));
              it('fires a `fail` event', assertFired('fail'));
              it('sets the `error` property', assertProps({ error }));
              it('unsets the `paymentMethod` property', assertProps({ paymentMethod: null }));
              it('unsets the `source` property', assertProps({ source: null }));
              it('unsets the `token` property', assertProps({ token: null }));
              it('calls the complete function', assertCalled(complete));
            });

            describe('with `clientSecret` set', function() {
              beforeEach(setProps({ clientSecret: CLIENT_SECRET }));
              describe('when the paymentRequest fires the `paymentmethod` event', function() {
                const complete = stub();
                const paymentMethod = SUCCESSFUL_PAYMENT_METHOD;
                const paymentIntent = SUCCESSFUL_PAYMENT_INTENT;
                beforeEach(listenFor('success'));
                beforeEach(synthPaymentRequestEvent('paymentmethod', { paymentMethod, complete }));
                beforeEach(nextFrame);
                afterEach(complete.resetBehavior.bind(complete));
                it('sets the `paymentMethod` property', assertProps({ paymentMethod }));
                it('sets the `paymentIntent` property', assertProps({ paymentIntent }));
                it('unsets the `error` property', assertProps({ error: null }));
                it('unsets the `source` property', assertProps({ source: null }));
                it('unsets the `token` property', assertProps({ token: null }));
                it('fires a `success` event', assertFired('success'));
                it('calls the complete function', assertCalled(complete));
                describe('then calling reset()', function() {
                  beforeEach(reset);
                  it('unsets all the properties', assertProps({ paymentMethod: null, paymentIntent: null, error: null, source: null, token: null }));
                });
              });

              describe('when the paymentRequest fires a `paymentmethod` event with an error', function() {
                const complete = stub();
                const error = CARD_DECLINED_ERROR;
                beforeEach(listenFor('fail'));
                beforeEach(synthPaymentRequestEvent('paymentmethod', { error, complete }));
                beforeEach(nextFrame);
                afterEach(complete.resetBehavior.bind(complete));
                it('fires a `fail` event', assertFired('fail'));
                it('sets the `error` property', assertProps({ error }));
                it('unsets the `paymentMethod` property', assertProps({ paymentMethod: null }));
                it('unsets the `source` property', assertProps({ source: null }));
                it('unsets the `token` property', assertProps({ token: null }));
                it('calls the complete function', assertCalled(complete));
              });
            });

            describe('when the card will be declined', function() {
              const error = CARD_DECLINED_ERROR;
              beforeEach(setProps({ clientSecret: CARD_CONFIRM_ERROR_SECRET }));
              describe('when the paymentRequest fires the `paymentmethod` event', function() {
                const complete = stub();
                const paymentMethod = SUCCESSFUL_PAYMENT_METHOD;
                beforeEach(listenFor('fail'));
                beforeEach(synthPaymentRequestEvent('paymentmethod', { paymentMethod, complete }));
                beforeEach(nextFrame);
                afterEach(complete.resetBehavior.bind(complete));
                it('sets the `error` property', assertProps({ error }));
                it('unsets the `paymentMethod` property', assertProps({ paymentMethod: null }));
                it('unsets the `paymentIntent` property', assertProps({ paymentIntent: null }));
                it('unsets the `source` property', assertProps({ source: null }));
                it('unsets the `token` property', assertProps({ token: null }));
                it('fires a `fail` event', assertFired('fail'));
                it('calls the complete function', assertCalled(complete));
                describe('then calling reset()', function() {
                  beforeEach(reset);
                  it('unsets all the properties', assertProps({ paymentMethod: null, paymentIntent: null, error: null, source: null, token: null }));
                });
              });
            });
          });
        });
      });
    });
  });
});

// TODO: Shady Styles
