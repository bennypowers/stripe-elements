// src/lib/read-only.ts
function isReactiveElement(host) {
  return "addInitializer" in host.constructor;
}
var _ReadOnlyController = class {
  constructor(host) {
    this.host = host;
    this.values = /* @__PURE__ */ new Map();
    if (_ReadOnlyController.instances.has(host))
      return _ReadOnlyController.instances.get(host);
    host.addController(this);
    _ReadOnlyController.instances.set(host, this);
  }
  static for(host) {
    return new _ReadOnlyController(host);
  }
  hostConnected() {
    null;
  }
  set(key, value) {
    const old = this.values.get(key);
    this.values.set(key, value);
    if (isReactiveElement(this.host))
      this.host.requestUpdate(key, old);
    else
      this.host.requestUpdate();
  }
};
var ReadOnlyController = _ReadOnlyController;
ReadOnlyController.instances = /* @__PURE__ */ new Map();
function readonly(proto, key) {
  const Klass = proto.constructor;
  Klass.addInitializer((x) => {
    const controller = ReadOnlyController.for(x);
    Object.defineProperty(x.constructor.prototype, key, {
      enumerable: true,
      configurable: true,
      get() {
        return controller.values.get(key);
      },
      set(value) {
        if (!controller.values.has(key))
          controller.values.set(key, value);
      }
    });
    Klass.createProperty(key, {
      ...Klass.getPropertyOptions(key),
      noAccessor: true
    });
  });
}
readonly.set = function(host, props) {
  const controller = ReadOnlyController.for(host);
  for (const [key, value] of Object.entries(props))
    controller.set(key, value);
};
export {
  readonly
};
//# sourceMappingURL=read-only.js.map
