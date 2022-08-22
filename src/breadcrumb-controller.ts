import type { ReactiveController, ReactiveControllerHost } from 'lit';

export interface BreadcrumbControllerOptions {
  autoInitialize?: boolean;
  mountPrefix?: string;
  slotName?: string;
}

type Host = Element|ShadowRoot|Document;

/** Generates a random number */
export function getRandom(): string {
  return (Date.now() + (Math.random() * 1000)).toString(36).substr(0, 8);
}

export class BreadcrumbController implements ReactiveController {
  private initialized = false;

  /**
   * Breadcrumbs back up to the document.
   */
  private shadowHosts: Host[] = [];

  /**
   * Mount point element ID. This element must be connected to the document.
   */
  public mountId: string;

  public slotName: string;

  /**
   * Mount point element. This element must be connected to the document.
   */
  public get mount(): Element|null { return document.getElementById(this.mountId); }

  constructor(
    private host: ReactiveControllerHost & Element,
    private options?: BreadcrumbControllerOptions
  ) {
    this.host.addController(this);
    this.mountId = this.resetMountId();
    this.slotName = this.options?.slotName ?? `breadcrumb-${getRandom()}`;
  }

  hostUpdated(): void {
    if (!this.initialized && this.options?.autoInitialize !== false)
      this.init();
  }

  hostDisconnected(): void {
    this.destroyMountPoints();
  }

  private resetMountId() {
    const prefix = this.options?.mountPrefix ?? this.host.localName;
    return `${prefix}-mount-point-${getRandom()}`;
  }

  private createMountPoint(): HTMLElement {
    const node = document.createElement('div');
    node.id = this.mountId;
    node.classList.add(`${this.host.tagName.toLowerCase()}-mount`);
    return node;
  }

  private createSlot(slotName: string): HTMLSlotElement {
    const node = document.createElement('slot');
    node.slot = slotName;
    node.name = slotName;
    return node;
  }

  private appendTemplate(target: Node, node = this.createMountPoint()) {
    target.appendChild(node);
    return node;
  }

  /**
   * Creates mount points for the slotted element
   */
  private initMountPoints(): void {
    this.initShadowMountPoints();
  }

  /**
   * Removes all mount points from the DOM
   */
  private destroyMountPoints(): void {
    // eslint-disable-next-line easy-loops/easy-loops
    for (const host of this.shadowHosts) {
      for (const el of host.querySelectorAll(`[slot="${this.slotName}"][name="${this.slotName}"]`))
        el.remove();
    }
    if (this.mount)
      this.mount.remove();
    this.mountId = this.resetMountId();
  }

  /**
   * Prepares to mount Stripe Elements in light DOM.
   */
  private initShadowMountPoints(): void {
    // trace each shadow boundary between us and the document
    let host = this.host as Element;
    this.shadowHosts = [this.host];
    while (host = (host.getRootNode() as ShadowRoot).host) // eslint-disable-line easy-loops/easy-loops, no-cond-assign, prefer-destructuring
      this.shadowHosts.push(host);

    const { shadowHosts, slotName } = this;

    // Prepare the shallowest breadcrumb slot at document level
    const hosts = [...shadowHosts];
    const root = hosts.pop();
    if (!root!.querySelector(`[slot="${slotName}"]`)) {
      const div = document.createElement('div');
      div.slot = slotName;
      root!.appendChild(div);
    }

    const container = root!.querySelector(`[slot="${slotName}"]`);

    // Render the form to the document, so that the slotted content can mount
    this.appendTemplate(container!);

    // Append breadcrumb slots to each shadowroot in turn,
    // from the document down to the <stripe-elements> instance.
    hosts.forEach(host => this.appendTemplate(host, this.createSlot(slotName)));
  }

  public init() {
    this.destroyMountPoints();
    this.initMountPoints();
    this.initialized = true;
  }
}
