import { render, html } from 'lit-html';
import creditCardType from 'credit-card-type';
import luhn from 'luhn-js';

import { CARD_ERRORS, INCOMPLETE_CARD_ERROR } from './Error';
import { SynthEventTarget } from './SynthEventTarget';

export class Element extends SynthEventTarget {
  constructor(type, options) {
    super(type, options);
    this.type = type;
    Object.entries(options).forEach(([name, value]) => {
      this[name] = value;
    });
  }

  setState(props) {
    Object.entries(props).forEach(([name, value]) => {
      this[name] = value;
    });
  }

  // Stripe Card APIs

  mount(node) {
    render(html`<!-- Stripe mounts here -->`, node);
    this.eventTarget.dispatchEvent(new CustomEvent('ready'));
  }

  blur() {
    this.eventTarget.dispatchEvent(new CustomEvent('blur'));
  }

  clear() { }

  destroy() {
    this.listeners.forEach(listener => this.eventTarget.removeEventListener(...listener));
    delete this.eventTarget;
  }

  focus() {
    this.eventTarget.dispatchEvent(new CustomEvent('focus'));
  }

  unmount() { }

  update() { }
}

export class CardElement extends Element {
  get error() {
    const { cardNumber, complete, empty } = this;
    const cardError = CARD_ERRORS[cardNumber?.toString()];
    const stateError = (!complete || empty) ? INCOMPLETE_CARD_ERROR : undefined;
    return cardError || stateError;
  }

  constructor(type, options) {
    super(type, options);
  }

  setState({ cardNumber, mm, yy, cvc, zip }) {
    super.setState({ cardNumber, mm, yy, cvc, zip });

    [{ type: this.brand }] = creditCardType(this.cardNumber);

    this.complete =
      luhn.isValid(this.cardNumber) && mm && yy && cvc !== undefined;

    this.empty =
      !cardNumber && cardNumber !== 0 &&
      !mm && mm !== 0 &&
      !yy && yy !== 0 &&
      !cvc && cvc !== 0;

    const { brand, complete, empty } = this;

    this.synthEvent('change', { brand, complete, empty });
  }
}

export class PaymentRequestButtonElement extends Element { }
