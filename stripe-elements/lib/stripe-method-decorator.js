// src/lib/stripe-method-decorator.ts
function wrap(f) {
  return (_target, _property, descriptor) => {
    const original = descriptor.value;
    descriptor.value = f(original);
    return descriptor;
  };
}
var stripeMethod = wrap(function(f) {
  const { name } = f;
  return async function(...args) {
    if (!this.stripe)
      throw new Error(`<${this.constructor.is}>: Stripe must be initialized before calling ${name}.`);
    return f.call(this, ...args).then(this.handleResponse);
  };
});
export {
  stripeMethod
};
//# sourceMappingURL=stripe-method-decorator.js.map
