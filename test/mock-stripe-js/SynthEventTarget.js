import { assign } from './lib/assign';

export class SynthEventTarget {
  eventTarget = new EventTarget();

  listeners = [];

  synthEvent(type, params) {
    const error = this.error ?? params?.error;
    const props = { ...params, error };
    const event = new CustomEvent(type);
    Object.entries(props).forEach(assign(event));
    this.eventTarget.dispatchEvent(event);
  }

  addEventListener(type, handler) {
    this.listeners.push([type, handler]);
    return this.eventTarget.addEventListener(type, handler);
  }

  on(type, handler) {
    this.addEventListener(type, handler);
  }
}
