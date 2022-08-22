export declare const objectOf: <T extends object>(key: keyof T) => (x: T[keyof T]) => {
    [x: string]: T[keyof T];
};
