export const unary = (f: (...args:any[]) => unknown) => (x: unknown) => f(x);
