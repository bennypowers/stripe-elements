import type { ReactiveElement, ReactiveControllerHost } from 'lit';
export declare function readonly<T extends ReactiveElement>(proto: T, key: string): void;
export declare namespace readonly {
    var set: <T extends ReactiveControllerHost>(host: T, props: Partial<T>) => void;
}
