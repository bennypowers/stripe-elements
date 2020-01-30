import { SynthEventTarget } from './SynthEventTarget';
import { userAgentCreditCards } from './mocks';

export class PaymentRequest extends SynthEventTarget {
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
