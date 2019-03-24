import { expect, fixture, oneEvent } from '@open-wc/testing';
// import { StripeElements } from './StripeElements';
import './stripe-elements';

afterEach(() => {
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
      { name: 'action', default: '' },
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
      'hasError',
      'isComplete',
      'isEmpty',
      'stripe',
      'stripeReady',
      'token',
    ].forEach(prop => {
      it(prop, async function() {
        const element = await fixture(`<stripe-elements></stripe-elements>`);
        const init = element[prop];
        element[prop] = Math.random();
        expect(element[prop]).to.eql(init);
      });
    });
  });

  describe('notifying public properties', function notifying() {
    function camelCaseToDash( myStr ) {
      return myStr.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
    }

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
    });
  });
});
