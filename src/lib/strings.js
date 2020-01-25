import eagerDash from '@lavadrop/kebab-case';
import eagerCamel from '@lavadrop/camel-case';
import { memoize } from '@pacote/memoize';

const identity = x => x;

/** camelCase a string */
export const camel = memoize(identity, eagerCamel);

/** dash-case a string */
export const dash = memoize(identity, eagerDash);

/**
 * Generates a random mount point for Stripe Elements. This will allow multiple
 * Elements forms to be embedded on a single page.
 * @return {string} mount element id
 */
export function generateRandomMountElementId() {
  return `stripe-elements-mount-point-${(Date.now() + (Math.random() * 1000)).toString(36).substr(0, 8)}`;
}

export const isString = x => typeof x === 'string';
