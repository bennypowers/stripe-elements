// src/lib/bound.ts
var configurable = true;
function bound(_, key, descriptor) {
  if (typeof descriptor?.value !== "function")
    throw new TypeError(`Only methods can be decorated with @bound. <${key ?? _.name}> is not a method!`);
  return {
    configurable,
    get() {
      const value = descriptor.value.bind(this);
      Object.defineProperty(this, key, { value, configurable, writable: true });
      return value;
    }
  };
}
export {
  bound
};
//# sourceMappingURL=bound.js.map
