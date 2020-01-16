import { expect } from '@open-wc/testing';
import { generateRandomMountElementId } from './strings.js';

describe('generateRandomMountElementId', function() {
  let initial;
  let next;

  it('generates a mount point id', function() {
    initial = generateRandomMountElementId();
    expect(initial).to.be.a('string').and.match(/stripe-elements-mount-point-/);
  });

  it('randomizes the suffix on each call', function() {
    next = generateRandomMountElementId();
    expect(next).to.not.equal(initial);
  });
});
