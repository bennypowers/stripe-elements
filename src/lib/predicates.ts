export const elem = <T>(xs: readonly T[]) => (x: T) => xs.includes(x);

export const not = <T>(p: (x: T) => boolean) => (x: T) => !p(x);

export const isRepresentation = elem(['paymentMethod', 'source', 'token']);
