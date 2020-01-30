
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

export const CARD_ERRORS = {
  '4000000000000002': CARD_DECLINED_ERROR,
};
