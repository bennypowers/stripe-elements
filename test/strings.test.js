import { expect } from '@open-wc/testing';
import { generateRandomMountElementId } from '../src/lib/strings.js';

describe('generateRandomMountElementId', function() {
  let initial;
  let next;

  it('generates a mount point id', function() {
    initial = generateRandomMountElementId('STRIPE-ELEMENTS');
    expect(initial).to.be.a('string').and.match(/stripe-elements-mount-point-/);
  });

  it('generates a mount point by tagName', function() {
    expect(generateRandomMountElementId('STRIPE-PAYMENT-REQUEST')).to.be.a('string').and.match(/stripe-payment-request-mount-point-/);
  });

  it('randomizes the suffix on each call', function() {
    next = generateRandomMountElementId('STRIPE-ELEMENTS');
    expect(next).to.not.equal(initial);
  });
});
