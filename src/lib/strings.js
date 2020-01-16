import eagerDash from '@lavadrop/kebab-case';
import eagerCamel from '@lavadrop/camel-case';
import { memoize } from '@pacote/memoize';

const identity = x => x;

/**
 * camelCase a string
 * @type {(string: string) => string}
 */
export const camel = memoize(identity, eagerCamel);

/**
 * dash-case a string
 * @type {(string: string) => string}
 */
export const dash = memoize(identity, eagerDash);

function randomReplacer(c) {
  return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
}

function getRandomString() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, randomReplacer);
}

/**
 * Generates a random mount point (UUID v4) for Stripe Elements. This will allow multiple
 * Elements forms to be embedded on a single page.
 * @return {String} mount element id
 */
export function generateRandomMountElementId() {
  return `stripe-elements-mount-point-${getRandomString()}`;
}
