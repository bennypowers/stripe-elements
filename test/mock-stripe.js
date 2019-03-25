import { render, html } from 'lit-html';

export const PUBLISHABLE_KEY = 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX';
export const INCOMPLETE_CARD_KEY = 'INCOMPLETE_CARD_KEY';
export const SHOULD_ERROR_KEY = 'SHOULD_ERROR_KEY';
export const TOKEN_ERROR_KEY = 'TOKEN_ERROR_KEY';

export class MockedStripeAPI {
  constructor(key, opts) {
    this.key = key;
    this.opts = opts;
    this.__card = null;
    return this;
  }

  elements({ fonts, locale } = {}) {
    return {
      create(type, { value, hidePostalCode, iconStyle, hideIcon, disabled } = {}) {
        return {
          addEventListener(type, handler) {
            return this.__card.addEventListener(type, handler);
          },
          mount(node) {
            render(html`<div></div>`, node);
            this.__card = node.firstElementChild;
          },
          on() {},
          blur() {},
          clear() {},
          destroy() {},
          focus() {},
          unmount() {},
          update() {},
        };
      },
    };
  }

  async createToken(card, cardData) {
    if (this.key === SHOULD_ERROR_KEY) throw new Error(SHOULD_ERROR_KEY);
    else if (this.key === TOKEN_ERROR_KEY) return { error: TOKEN_ERROR_KEY };
    else return { token: 'howdy!' };
  }

  createSource() {
    return {};
  }
}
