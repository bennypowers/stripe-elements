import type { ReactiveController, ReactiveElement, ReactiveControllerHost } from 'lit';

function isReactiveElement(host: ReactiveControllerHost): host is ReactiveElement {
  return 'addInitializer' in host.constructor;
}

class ReadOnlyController implements ReactiveController {
  private static instances = new Map<ReactiveControllerHost, ReadOnlyController>();

  static for(host: ReactiveControllerHost) {
    return new ReadOnlyController(host);
  }

  values = new Map();

  hostConnected() { null; }

  constructor(private host: ReactiveControllerHost) {
    if (ReadOnlyController.instances.has(host))
      return ReadOnlyController.instances.get(host);
    host.addController(this);
    ReadOnlyController.instances.set(host, this);
  }

  set(key: string, value: unknown) {
    const old = this.values.get(key);
    this.values.set(key, value);
    if (isReactiveElement(this.host))
      this.host.requestUpdate(key, old);
    else
      this.host.requestUpdate();
  }
}


export function readonly<T extends ReactiveElement>(proto: T, key: string) {
  const Klass = (proto.constructor as typeof ReactiveElement);
  Klass.addInitializer(x => {
    const controller = ReadOnlyController.for(x);

    // controller.values.set(key, x[key]);

    Object.defineProperty(x.constructor.prototype, key, {
      enumerable: true,
      configurable: true,
      get() {
        return controller.values.get(key);
      },

      /** allow for class field initialization */
      set(value) {
        if (!controller.values.has(key))
          controller.values.set(key, value);
      },
    });

    Klass.createProperty(key, {
      // @ts-expect-error: https://github.com/lit/lit/pull/1963
      ...Klass.getPropertyOptions(key),
      noAccessor: true,
    });
  });
}

readonly.set = function<T extends ReactiveControllerHost>(host: T, props: Partial<T>) {
  const controller = ReadOnlyController.for(host);
  for (const [key, value] of Object.entries(props))
    controller.set(key, value);
};
