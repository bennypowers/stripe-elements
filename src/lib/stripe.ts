import type * as Stripe from '@stripe/stripe-js';
export function throwResponseError<T extends Stripe.TokenResult
|Stripe.SourceResult
|Stripe.PaymentMethodResult
|{
    error?: Stripe.StripeError| null
  }>(
  response: T
) {
  if (response.error) throw response.error;
  else return response;
}
