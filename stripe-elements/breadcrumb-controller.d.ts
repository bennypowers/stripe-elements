import type { ReactiveController, ReactiveControllerHost } from 'lit';
export interface BreadcrumbControllerOptions {
    autoInitialize?: boolean;
    mountPrefix?: string;
    slotName?: string;
}
/** Generates a random number */
export declare function getRandom(): string;
export declare class BreadcrumbController implements ReactiveController {
    private host;
    private options?;
    private initialized;
    /**
     * Breadcrumbs back up to the document.
     */
    private shadowHosts;
    /**
     * Mount point element ID. This element must be connected to the document.
     */
    mountId: string;
    slotName: string;
    /**
     * Mount point element. This element must be connected to the document.
     */
    get mount(): Element | null;
    constructor(host: ReactiveControllerHost & Element, options?: BreadcrumbControllerOptions | undefined);
    hostUpdated(): void;
    hostDisconnected(): void;
    private resetMountId;
    private createMountPoint;
    private createSlot;
    private appendTemplate;
    /**
     * Creates mount points for the slotted element
     */
    private initMountPoints;
    /**
     * Removes all mount points from the DOM
     */
    private destroyMountPoints;
    /**
     * Prepares to mount Stripe Elements in light DOM.
     */
    private initShadowMountPoints;
    init(): void;
}
