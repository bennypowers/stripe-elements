/* eslint-disable @typescript-eslint/ban-types, no-invalid-this, @typescript-eslint/no-explicit-any */

function wrap(f: {
  (f: {
    call?: any; name?: any;
  }): (this: any, ...args: unknown[]) => Promise<any>; (arg0: any): any;
}) {
  return (_target: Object, _property: string, descriptor: TypedPropertyDescriptor<any>) => {
    const original = descriptor.value;
    descriptor.value = f(original);
    return descriptor;
  };
}

export const stripeMethod = wrap(function(f: { call?: any; name?: any; }) {
  const { name } = f;
  return async function(this: any, ...args: unknown[]) {
    if (!this.stripe) throw new Error(`<${this.constructor.is}>: Stripe must be initialized before calling ${name}.`);
    return f.call(this, ...args)
      .then(this.handleResponse);
  };
});
