// src/lib/notify.ts
var ChangeEvent = class extends Event {
  constructor(key, oldValue, value, attribute) {
    super(`${attribute ?? key.toLowerCase()}-changed`);
    this.key = key;
    this.oldValue = oldValue;
    this.value = value;
    this.detail = { value };
  }
};
var _NotifyController = class {
  constructor(host) {
    this.host = host;
    this.cache = /* @__PURE__ */ new Map();
    if (_NotifyController.instances.has(host))
      return _NotifyController.instances.get(host);
    host.addController(this);
    _NotifyController.instances.set(host, this);
  }
  hostUpdated() {
    for (const [key, oldValue] of this.cache) {
      const newValue = this.host[key];
      const { attribute } = this.host.constructor.getPropertyOptions(key) ?? {};
      const attr = typeof attribute === "string" ? attribute : null;
      this.cache.set(key, newValue);
      this.host.dispatchEvent(new ChangeEvent(key, oldValue, newValue, attr));
    }
  }
};
var NotifyController = _NotifyController;
NotifyController.instances = /* @__PURE__ */ new Map();
function notify(proto, key) {
  proto.constructor.addInitializer((x) => {
    const controller = new NotifyController(x);
    controller.cache.set(key, x[key]);
  });
}
export {
  notify
};
//# sourceMappingURL=notify.js.map
