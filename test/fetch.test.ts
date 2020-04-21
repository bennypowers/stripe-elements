import { expect } from '@open-wc/testing';
import { throwBadResponse } from '../src/lib/fetch';

describe('throwBadResponse', function() {
  it('throws the statusText of a bad response', async function() {
    const status = 400;
    const statusText = 'permission denied';
    const response = new Response('bad', { status, statusText });
    try {
      await throwBadResponse(response);
      expect.fail('resolved response');
    } catch (err) {
      expect(err.message).to.equal(statusText);
    }
  });

  it('passes a good response along', async function() {
    const status = 200;
    const response = new Response('good', { status });
    try {
      expect(await throwBadResponse(response)).to.equal(response);
    } catch (err) {
      expect.fail('rejected response');
    }
  });
});
