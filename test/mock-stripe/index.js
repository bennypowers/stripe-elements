import { render, html } from 'lit-html';
import luhn from 'luhn-js';
import creditCardType from 'credit-card-type';

const assign = target => ([k, v]) => target[k] = v;

export const PUBLISHABLE_KEY = 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX';

export const SHOULD_ERROR_KEY = 'SHOULD_ERROR_KEY';

export const TOKEN_ERROR_KEY = 'TOKEN_ERROR_KEY';

export const INCOMPLETE_CARD_KEY = 'INCOMPLETE_CARD_KEY';

export const CLIENT_SECRET = 'CLIENT_SECRET';

export const CARD_CONFIRM_ERROR_SECRET = 'CARD_CONFIRM_ERROR_SECRET';

export const SUCCESSFUL_TOKEN = Object.freeze({ id: 'SUCCESSFUL_TOKEN' });

export const SUCCESSFUL_SOURCE = Object.freeze({ id: 'SUCCESSFUL_SOURCE' });

export const SUCCESSFUL_PAYMENT_METHOD = Object.freeze({ id: 'SUCCESSFUL_PAYMENT_METHOD' });

export const SUCCESSFUL_PAYMENT_INTENT = Object.freeze({ id: 'SUCCESSFUL_PAYMENT_INTENT' });

export const SUCCESS_RESPONSES = Object.freeze({
  paymentMethod: SUCCESSFUL_PAYMENT_METHOD,
  source: SUCCESSFUL_SOURCE,
  token: SUCCESSFUL_TOKEN,
});

export const INCOMPLETE_CARD_ERROR = Object.freeze({
  type: 'validation_error',
  code: 'incomplete_number',
  message: 'Your card number is incomplete.',
});

export const CARD_DECLINED_ERROR = Object.freeze({
  type: 'card_error',
  code: 'card_declined',
  decline_code: 'generic_decline',
  message: 'The card has been declined.',
});

export const NO_CLIENT_SECRET_ERROR = 'Cannot confirm a card payment without a client-secret';

const CARD_ERRORS = {
  '4000000000000002': CARD_DECLINED_ERROR,
};

const userAgentCreditCards = [];

class SynthEventTarget {
  eventTarget = new EventTarget();

  listeners = [];

  synthEvent(type, params) {
    const error = this.error ?? params?.error;
    const props = { ...params, error };
    const event = new CustomEvent(type);
    Object.entries(props).forEach(assign(event));
    this.eventTarget.dispatchEvent(event);
  }

  addEventListener(type, handler) {
    this.listeners.push([type, handler]);
    return this.eventTarget.addEventListener(type, handler);
  }

  on(type, handler) {
    this.addEventListener(type, handler);
  }
}

class PaymentRequest extends SynthEventTarget {
  constructor(options) {
    super(options);
    Object.entries(options).forEach(([name, value]) => {
      this[name] = value;
    });
  }

  async canMakePayment() {
    return userAgentCreditCards.length ? { applePay: true } : null;
  }
}

class Element extends SynthEventTarget {
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

class CardElement extends Element {
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

class PaymentRequestButtonElement extends Element {
}

class Elements {
  constructor({ locale, fonts }) {
    this.locale = locale;
    this.fonts = fonts;
    return this;
  }

  create(type, { style } = {}) {
    switch (type) {
      case 'card': return new CardElement(type, { style });
      case 'paymentRequestButton': return new PaymentRequestButtonElement(type, { style });
    }
  }
}

export class Stripe {
  constructor(key, opts) {
    this.key = key;
    this.opts = opts;
    this.keyError =
      key === SHOULD_ERROR_KEY ? new Error(SHOULD_ERROR_KEY)
      : key === TOKEN_ERROR_KEY ? new Error(TOKEN_ERROR_KEY)
      : undefined;
    return this;
  }

  elements({ fonts, locale } = {}) {
    return new Elements({ fonts, locale });
  }

  paymentRequest(options) {
    return new PaymentRequest(options);
  }

  async confirmCardPayment(clientSecret, data, options) {
    // console.log('Stripe#confirmCardPayment start', { clientSecret, data, options });
    const error =
      this.keyError ? this.keyError
      : clientSecret === CARD_CONFIRM_ERROR_SECRET ? CARD_DECLINED_ERROR
      : undefined;
    const paymentIntent = error ? undefined : SUCCESSFUL_PAYMENT_INTENT;
    // console.log('Stripe#confirmCardPayment end', { error, paymentIntent });
    return { error, paymentIntent };
  }

  async createPaymentMethod(paymentMethodData) {
    const { error = this.keyError } = paymentMethodData.card;
    const paymentMethod = error ? undefined : SUCCESSFUL_PAYMENT_METHOD;
    const response = { error, paymentMethod };
    return response;
  }

  async createSource({ error = this.keyError }, cardData) {
    const source = error ? undefined : SUCCESSFUL_SOURCE;
    const response = { error, source };
    return response;
  }

  async createToken({ error = this.keyError } = {}, cardData) {
    const token = error ? undefined : SUCCESSFUL_TOKEN;
    const response = { error, token };
    return response;
  }

  // Test Helpers

  get userAgentCreditCards() {
    return userAgentCreditCards;
  }
}

export function addUserAgentCreditCard(card) {
  userAgentCreditCards.push(card);
}

export function resetUserAgentCreditCards() {
  userAgentCreditCards.splice(0, userAgentCreditCards.length);
}
