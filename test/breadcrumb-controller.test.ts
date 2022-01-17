import { expect, defineCE, fixture } from '@open-wc/testing';
import { BreadcrumbController } from '../src/breadcrumb-controller';
import { ReactiveElement } from '@lit/reactive-element';

describe('BreadcrumbController', function() {
  class Test extends ReactiveElement {
    breadcrumb = new BreadcrumbController(this, {
      slotName: 'hello',
    });
  }

  it('generates a mount point id', async function() {
    const tag = defineCE(class extends Test {});
    const host = await fixture<Test>(`<${tag}></${tag}>`);
    expect(host.breadcrumb.mountId).to.be.a('string').and.match(new RegExp(`${host.localName}-mount-point`));
  });

  it('generates a mount point by tagName', async function() {
    const tag = defineCE(class extends Test {});
    const host = await fixture<Test>(`<${tag}></${tag}>`);
    expect(host.breadcrumb.mountId).to.be.a('string').and.match(new RegExp(`${host.localName}-mount-point`));
  });

  it('randomizes the suffix on each call', async function() {
    const tag1 = defineCE(class extends Test {});
    const host1 = await fixture<Test>(`<${tag1}></${tag1}>`);
    const tag2 = defineCE(class extends Test {});
    const host2 = await fixture<Test>(`<${tag2}></${tag2}>`);
    expect(host2.breadcrumb.mountId).to.not.equal(host1.breadcrumb.mountId);
  });
});
