export const elem = xs => x => xs.includes(x);

export const not = p => x => !p(x);

export const isRepresentation = elem(['paymentMethod', 'source', 'token']);
