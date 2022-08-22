export declare const elem: <T>(xs: readonly T[]) => (x: T) => boolean;
export declare const not: <T>(p: (x: T) => boolean) => (x: T) => boolean;
export declare const isRepresentation: (x: string) => boolean;
