/// <reference types="sinon" />
/// <reference types="stripe-v3" />
/// <reference types="mocha" />
import type { StripeElements } from '../src/stripe-elements';
import type { StripePaymentRequest } from '../src/stripe-payment-request';
import type { ShadyDOM, ShadyCSS } from '@webcomponents/webcomponentsjs';
import 'chai-things';
import 'sinon-chai';
import { LitElement, TemplateResult } from 'lit-element';
import { StripeBase } from '../src/StripeBase';
declare global {
    interface Window {
        ShadyCSS: ShadyCSS;
        ShadyDOM: ShadyDOM;
    }
    interface Node {
        getRootNode(options?: GetRootNodeOptions): Node | ShadowRoot;
    }
    namespace stripe {
        namespace paymentRequest {
            interface StripePaymentRequest {
                synthEvent: any;
            }
        }
        namespace elements {
            interface Element {
                style: any;
                setState: any;
                synthEvent: any;
            }
        }
    }
}
declare class Host extends LitElement {
    tag: string;
}
export declare class PrimaryHost extends Host {
    static is: string;
    get nestedElement(): StripeBase;
    render(): TemplateResult;
}
export declare class SecondaryHost extends Host {
    get primaryHost(): PrimaryHost;
    render(): TemplateResult;
}
export declare class TertiaryHost extends Host {
    get secondaryHost(): SecondaryHost;
    render(): TemplateResult;
}
export declare const NO_STRIPE_JS_ERROR = "requires Stripe.js to be loaded first.";
export declare const NO_STRIPE_CONFIRM_CARD_ERROR = "Stripe must be initialized before calling confirmCardPayment.";
export declare const NO_STRIPE_CREATE_PAYMENT_METHOD_ERROR = "Stripe must be initialized before calling createPaymentMethod.";
export declare const NO_STRIPE_CREATE_SOURCE_ERROR = "Stripe must be initialized before calling createSource.";
export declare const NO_STRIPE_CREATE_TOKEN_ERROR = "Stripe must be initialized before calling createToken.";
export declare const EMPTY_CC_ERROR = "Your card number is empty.";
export declare const BASE_DEFAULT_PROPS: Readonly<{
    billingDetails: any;
    paymentMethodData: any;
    sourceData: any;
    tokenData: any;
    clientSecret: any;
    generate: string;
    action: any;
    element: any;
    elements: any;
    error: any;
    hasError: boolean;
    publishableKey: any;
    paymentMethod: any;
    showError: boolean;
    source: any;
    stripe: any;
    token: any;
}>;
export declare const BASE_READ_ONLY_PROPS: readonly string[];
export declare const BASE_NOTIFYING_PROPS: readonly string[];
export declare const ALLOWED_STYLES: readonly string[];
export declare const STYLE_PREFIXES: readonly string[];
export declare const ALL_BLUE_STYLES: any;
export declare let fetchStub: sinon.SinonStub;
export declare let element: StripeElements & StripePaymentRequest;
export declare let initialStripeMountId: string;
export declare let initialStripe: stripe.Stripe;
export declare const events: Map<any, any>;
export declare function resetTestState(): void;
export declare const noop: () => void;
export declare const assignedNodes: (el: HTMLSlotElement) => Node[];
interface Opts {
    stripeMountId: string;
    tagName: string;
}
export declare const mountLightDOM: ({ stripeMountId, tagName }: Opts) => string;
export declare const expectedLightDOM: ({ stripeMountId, tagName }: {
    stripeMountId: any;
    tagName: any;
}) => string;
export declare function mockCanMakePayment(): void;
export declare function restoreCanMakePayment(): void;
export declare function mockShadyCSS(): void;
export declare function restoreShadyCSS(): void;
export declare function spyGetComputedStyleValue(): void;
export declare function restoreGetComputedStyleValue(): void;
export declare function mockShadyDOM(): void;
export declare function restoreShadyDOM(): void;
export declare function mockStripe(): void;
export declare function restoreStripe(): void;
export declare function spyCardClear(): void;
export declare function spyStripeElementBlur(): void;
export declare function restoreStripeElementBlur(): void;
export declare function spyStripeElementFocus(): void;
export declare function restoreStripeElementFocus(): void;
export declare function restoreCardClear(): void;
export declare function spyConsoleWarn(): void;
export declare function restoreConsoleWarn(): void;
export declare function stubFetch(): void;
export declare function restoreFetch(): void;
export declare function setupWithTemplate(template: TemplateResult | string): () => Promise<void>;
export declare function setupNoProps(): Promise<void>;
export declare function updateComplete(): Promise<unknown>;
export declare function setupWithPublishableKey(publishableKey: any): () => Promise<void>;
export declare function removeStripeMount(): Promise<void>;
export declare function appendAllBlueStyleTag(): void;
export declare function removeAllBlueStyleTag(): void;
export declare function appendHeightStyleTag(): void;
export declare function removeHeightStyleTag(): void;
export declare function listenFor(eventType: any): () => Promise<void>;
export declare function awaitEvent(eventType: any): () => Promise<void>;
export declare function sleep(ms: number): () => Promise<void>;
export declare function assertCalled(stub: any): () => void;
export declare function assertFired(eventType: string): () => Promise<void>;
export declare function assertEventDetail(eventType: any, expected: any): () => Promise<void>;
export declare function assertProps(props: any, { deep }?: {
    deep?: boolean;
}): () => Promise<void>;
export declare function assertErrorMessage(message: string): () => void;
export declare function assertPropsOk(props: any[], { not }?: {
    not?: boolean;
}): () => Promise<void>;
export declare function testDefaultPropEntry([name, value]: [any, any]): Mocha.Test;
export declare function testReadOnlyProp(name: string): void;
export declare function testWritableNotifyingProp(name: string): void;
export declare function testReadonlyNotifyingProp(name: string): void;
export declare function assertElementErrorMessage(message: string): () => void;
export declare function blur(): Promise<void>;
export declare function focus(): Promise<void>;
export declare function blurStripeElement(): Promise<void>;
export declare function focusStripeElement(): Promise<void>;
export declare function submit(): Promise<void>;
export declare function reset(): Promise<void>;
export declare function createPaymentMethod(): Promise<void>;
export declare function createSource(): Promise<void>;
export declare function createToken(): Promise<void>;
export declare function validate(): Promise<void>;
export declare function setProps(props: any): () => Promise<void>;
export declare function synthCardEvent(...args: any[]): () => void;
export declare function synthPaymentRequestEvent(...args: any[]): () => void;
export declare function synthStripeFormValues(inputs: any): () => Promise<void>;
export {};
