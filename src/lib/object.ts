export const objectOf = <T>(key: keyof T) => (x: T) => ({ [key]: x });
