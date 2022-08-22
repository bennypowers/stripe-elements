import type { ReactiveController, ReactiveElement, ReactiveControllerHost } from 'lit';

class ChangeEvent extends Event {
  public detail: { value: unknown };

  constructor(
    public key: string,
    public oldValue: unknown,
    public value: unknown,
    attribute?: string|null,
  ) {
    super(`${attribute ?? key.toLowerCase()}-changed`);
    this.detail = { value };
  }
}

class NotifyController implements ReactiveController {
  private static instances = new Map<ReactiveControllerHost, NotifyController>();

  cache = new Map();

  constructor(private host: HTMLElement & ReactiveControllerHost) {
    if (NotifyController.instances.has(host))
      return NotifyController.instances.get(host) as this;
    host.addController(this);
    NotifyController.instances.set(host, this);
  }

  hostUpdated() {
    // eslint-disable-next-line easy-loops/easy-loops
    for (const [key, oldValue] of this.cache) {
      const newValue = this.host[key as keyof typeof this.host];
      const { attribute } = (this.host.constructor as typeof ReactiveElement)
        .getPropertyOptions(key) ?? {};
      const attr = typeof attribute === 'string' ? attribute : null;
      this.cache.set(key, newValue);
      this.host.dispatchEvent(new ChangeEvent(key, oldValue, newValue, attr));
    }
  }
}


export function notify<T extends ReactiveElement>(proto: T, key: string) {
  (proto.constructor as typeof ReactiveElement).addInitializer(x => {
    const controller = new NotifyController(x);
    controller.cache.set(key, x[key as keyof typeof x]);
  });
}
