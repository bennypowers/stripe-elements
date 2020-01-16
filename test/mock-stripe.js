import { render, html } from 'lit-html';
import luhn from 'luhn-js';
import creditCardType from 'credit-card-type';

export const PUBLISHABLE_KEY = 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX';

export const INCOMPLETE_CARD_KEY = 'INCOMPLETE_CARD_KEY';

export const INCOMPLETE_CARD_ERROR = {
  type: 'validation_error',
  code: 'incomplete_number',
  message: 'Your card number is incomplete.',
};

export const CARD_DECLINED_ERROR = {
  type: 'card_error',
  code: 'card_declined',
  message: 'The card has been declined.',
};

export const SHOULD_ERROR_KEY = 'SHOULD_ERROR_KEY';

export const TOKEN_ERROR_KEY = 'TOKEN_ERROR_KEY';

export const SUCCESSFUL_TOKEN = Object.freeze({ id: 'SUCCESSFUL_TOKEN' });

export const SUCCESSFUL_SOURCE = Object.freeze({ id: 'SUCCESSFUL_SOURCE' });

export const SUCCESSFUL_PAYMENT_METHOD = Object.freeze({ id: 'SUCCESSFUL_PAYMENT_METHOD' });

const assign = target => ([k, v]) => target[k] = v;

const CARD_ERRORS = {
  '4000000000000002': CARD_DECLINED_ERROR,
};

class MockElement {
  card = new EventTarget();

  listeners = [];

  get error() {
    const { cardNumber, complete, empty } = this;
    const cardError = CARD_ERRORS[cardNumber?.toString()];
    const stateError = (!complete || empty) ? INCOMPLETE_CARD_ERROR : undefined;
    return cardError || stateError;
  }

  constructor(type, { hideIcon, hidePostalCode, iconStyle, style, value }) {
    this.hideIcon = hideIcon;
    this.hidePostalCode = hidePostalCode;
    this.iconStyle = iconStyle;
    this.style = style;
    this.type = type;
    this.value = value;
  }

  // Stripe Card APIs
  addEventListener(type, handler) {
    this.listeners.push([type, handler]);
    return this.card.addEventListener(type, handler);
  }

  mount(node) {
    render(html`<!-- Stripe mounts here -->`, node);
  }

  on() { }

  blur() { }

  clear() { }

  destroy() {
    this.listeners.forEach(listener => this.card.removeEventListener(...listener));
    delete this.card;
  }

  focus() { }

  unmount() { }

  update() { }

  // Test Helpers
  synthEvent(type, params) {
    const props = { ...params, error: this.error };
    const event = new CustomEvent(type);
    Object.entries(props).forEach(assign(event));
    this.card.dispatchEvent(event);
  }

  setState({ cardNumber, mm, yy, cvc, zip }) {
    this.cardNumber = cardNumber;
    this.zip = zip;
    this.mm = mm;
    this.yy = yy;
    this.cvc = cvc;

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

class MockElements {
  constructor({ locale, fonts }) {
    this.locale = locale;
    this.fonts = fonts;
    return this;
  }

  create(type, { style } = {}) {
    return new MockElement(type, { style });
  }
}

export class MockedStripeAPI {
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
    return new MockElements({ fonts, locale });
  }

  async createPaymentMethod({ error = this.keyError }, cardData) {
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
}
