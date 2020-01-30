import { CardElement, PaymentRequestButtonElement } from './Element';

export class Elements {
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
