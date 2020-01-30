export const SUCCESSFUL_TOKEN = Object.freeze({ id: 'SUCCESSFUL_TOKEN' });

export const SUCCESSFUL_SOURCE = Object.freeze({ id: 'SUCCESSFUL_SOURCE' });

export const SUCCESSFUL_PAYMENT_METHOD = Object.freeze({ id: 'SUCCESSFUL_PAYMENT_METHOD' });

export const SUCCESSFUL_PAYMENT_INTENT = Object.freeze({ id: 'SUCCESSFUL_PAYMENT_INTENT' });

export const SUCCESS_RESPONSES = Object.freeze({
  paymentMethod: SUCCESSFUL_PAYMENT_METHOD,
  source: SUCCESSFUL_SOURCE,
  token: SUCCESSFUL_TOKEN,
});

export const userAgentCreditCards = [];

export function addUserAgentCreditCard(card) {
  userAgentCreditCards.push(card);
}

export function resetUserAgentCreditCards() {
  userAgentCreditCards.splice(0, userAgentCreditCards.length);
}
