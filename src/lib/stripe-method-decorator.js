/* eslint-disable no-invalid-this */

function wrap(f) {
  return wrapped => {
    const { descriptor } = wrapped;
    const original = descriptor.value;

    descriptor.value = f(original);

    return { ...wrapped, descriptor };
  };
}

export const stripeMethod = wrap(function(f) {
  const { name } = f;
  return async function(...args) {
    if (!this.stripe) throw new Error(`<${this.constructor.is}>: Stripe must be initialized before calling ${name}.`);
    return f.call(this, ...args)
      .then(this.handleResponse);
  };
});
