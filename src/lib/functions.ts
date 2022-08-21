export const unary = (f: (...args: any[]) => unknown) => (x: any) => f(x);
