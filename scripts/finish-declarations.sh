echo "declare global { interface HTMLElementTagNameMap { 'stripe-elements': StripeElements; } }" >> stripe-elements.d.ts
echo "declare global { interface HTMLElementTagNameMap { 'stripe-payment-request': StripePaymentRequest; } }" >> stripe-payment-request.d.ts
echo $(cat <<- END
import { StripeElements } from './stripe-elements';
import { StripePaymentRequest } from './stripe-payment-request';
declare global {
  interface HTMLElementTagNameMap {
    'stripe-elements': StripeElements;
    'stripe-payment-request': StripePaymentRequest;
  }
}
END) >> index.d.ts

node scripts/privatize.js
