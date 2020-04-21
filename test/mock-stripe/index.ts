import { render, html } from 'lit-html';
import luhn from 'luhn-js';
import creditCardType from 'credit-card-type';

const assign = (target: object) => ([k, v]: [string, unknown]): unknown => target[k] = v;

export const enum Keys {
  PUBLISHABLE_KEY = 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX',
  SHOULD_ERROR_KEY = 'SHOULD_ERROR_KEY',
  TOKEN_ERROR_KEY = 'TOKEN_ERROR_KEY',
  INCOMPLETE_CARD_KEY = 'INCOMPLETE_CARD_KEY',
}

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
  decline_code: 'generic_decline', // eslint-disable-line @typescript-eslint/camelcase
  message: 'The card has been declined.',
});

export const NO_CLIENT_SECRET_ERROR = 'Cannot confirm a card payment without a client-secret';

const CARD_ERRORS = {
  '4000000000000002': CARD_DECLINED_ERROR,
};

const userAgentCreditCards = [];

class SynthEventTarget extends EventTarget {
  listeners = [];

  error: Error;

  synthEvent(type: string, params: any): void {
    const error = this.error ?? params?.error;
    const props = { ...params, error };
    const event = new CustomEvent(type);
    Object.entries(props).forEach(assign(event));
    this.dispatchEvent(event);
  }

  addEventListener(type: string, handler: EventListenerOrEventListenerObject): void {
    this.listeners.push([type, handler]);
    return super.addEventListener(type, handler);
  }

  on(type: string, handler: EventListenerOrEventListenerObject): void {
    this.addEventListener(type, handler);
  }
}

class PaymentRequest extends SynthEventTarget {
  constructor(options: any) {
    super();
    Object.entries(options).forEach(assign(this));
  }

  async canMakePayment(): Promise<{ applePay: boolean }> {
    return userAgentCreditCards.length ? { applePay: true } : null;
  }
}

class Element extends SynthEventTarget {
  type: string

  constructor(type, options) {
    super();
    this.type = type;
    Object.entries(options).forEach(assign(this));
  }

  setState(props): void {
    Object.entries(props).forEach(assign(this));
  }

  // Stripe Card APIs

  mount(node): void {
    render(html`<!-- Stripe mounts here -->`, node);
    this.dispatchEvent(new CustomEvent('ready'));
  }

  blur(): void {
    this.dispatchEvent(new CustomEvent('blur'));
  }

  clear(): void { null; }

  destroy(): void {
    this.listeners.forEach((listener: [string, EventListenerOrEventListenerObject]) => this.removeEventListener(...listener));
  }

  focus(): void {
    this.dispatchEvent(new CustomEvent('focus'));
  }

  unmount(): void { null; }

  update(): void { null; }
}

class CardElement extends Element {
  cardNumber: string;

  complete: boolean;

  empty: boolean;

  type: string;

  options: any;

  brand: string;

  get error(): Error {
    const { cardNumber, complete, empty } = this;
    const cardError = CARD_ERRORS[cardNumber?.toString()];
    const stateError = (!complete || empty) ? INCOMPLETE_CARD_ERROR : undefined;
    return cardError || stateError;
  }

  constructor(type, options) {
    super(type, options);
    this.type = type;
    this.options = options;
  }

  setState({ cardNumber, mm, yy, cvc, zip }): void {
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
  locale: string;

  fonts: any;

  constructor({ locale, fonts }) {
    this.locale = locale;
    this.fonts = fonts;
    return this;
  }

  create(type: string, { style = undefined } = {}): CardElement|PaymentRequestButtonElement {
    switch (type) {
      case 'card': return new CardElement(type, { style });
      case 'paymentRequestButton': return new PaymentRequestButtonElement(type, { style });
    }
  }
}

export class Stripe {
  key: string;

  opts: any;

  keyError: Error;

  constructor(key: Keys, opts: any) {
    this.key = key;
    this.opts = opts;
    this.keyError =
      key === Keys.SHOULD_ERROR_KEY ? new Error(Keys.SHOULD_ERROR_KEY)
      : key === Keys.TOKEN_ERROR_KEY ? new Error(Keys.TOKEN_ERROR_KEY)
      : undefined;
    return this;
  }

  elements({ fonts = undefined, locale = undefined } = {}): Elements {
    return new Elements({ fonts, locale });
  }

  paymentRequest(options: any): PaymentRequest {
    return new PaymentRequest(options);
  }

  async confirmCardPayment(clientSecret: string) {
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
