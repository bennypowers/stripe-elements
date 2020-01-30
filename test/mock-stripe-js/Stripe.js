import {
  CARD_CONFIRM_ERROR_SECRET,
  SHOULD_ERROR_KEY,
  TOKEN_ERROR_KEY,
} from './keys';
import { CARD_DECLINED_ERROR } from './Error';
import { Elements } from './Elements';
import { PaymentRequest } from './PaymentRequest';
import {
  SUCCESSFUL_PAYMENT_INTENT,
  SUCCESSFUL_PAYMENT_METHOD,
  SUCCESSFUL_SOURCE,
  SUCCESSFUL_TOKEN,
} from './mocks';

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

  async confirmCardPayment(clientSecret, _data, _options) {
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

  async createSource({ error = this.keyError }, _cardData) {
    const source = error ? undefined : SUCCESSFUL_SOURCE;
    const response = { error, source };
    return response;
  }

  async createToken({ error = this.keyError } = {}, _cardData) {
    const token = error ? undefined : SUCCESSFUL_TOKEN;
    const response = { error, token };
    return response;
  }
}
