import eagerDash from '@lavadrop/kebab-case';
import eagerCamel from '@lavadrop/camel-case';
import { memoize } from '@pacote/memoize';

const identity = <T>(x: T): T => x;

/** camelCase a string */
export const camel = memoize(identity, eagerCamel);

/** dash-case a string */
export const dash = memoize(identity, eagerDash);
