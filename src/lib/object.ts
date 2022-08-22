export const objectOf = <T extends object>(key: keyof T) => (x: T[keyof T]) => ({ [key]: x });
