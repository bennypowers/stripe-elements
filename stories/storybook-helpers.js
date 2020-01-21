import { LitElement, css, html } from 'lit-element';

export const $ = x => document.querySelector(x);
export const $$ = x => [...document.querySelectorAll(x)];

export const PK_LS_KEY = '__STRIPE_PUBLISHABLE_KEY__';

export const publishableKey = localStorage.getItem(PK_LS_KEY) || 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX';

const setKey = key => el =>
  (el.publishableKey = key);

export const setKeys = selector => ({ target: { value } }) => {
  localStorage.setItem(PK_LS_KEY, value);
  return $$(selector)
    .forEach(setKey(value));
};


const fieldEntry = field => [field.dataset.ownerProp, field.value];

customElements.define('stripe-elements-demo', class StripeElementsDemo extends LitElement {
  static properties = {
    label: { type: String },
    submitDisabled: { type: Boolean },
    output: { type: Object },
  };

  static styles = css`
    [hidden] { display: none !important; }

    :host {
      align-items: center;
      display: grid;
      grid-gap: 12px;
      grid-template-areas:
        'stripe stripe'
        'fields fields';
    }

    #stripe,
    #actions {
      display: contents;
    }

    ::slotted(stripe-elements) {
      grid-area: stripe;
    }

    json-viewer {
      color: #212529;
      padding: 0;
      background: white;

      --json-viewer-key-color: #d9480f;
      --json-viewer-boolean-color: #0b7285;
      --json-viewer-number-color: #087f5b;
      --json-viewer-null-color: #c92a2a;
      --json-viewer-string-color: #0b7285;
    }

  `;

  constructor() {
    super();
    this.submitDisabled = true;
    this.addEventListener('stripe-change', this.onStripeChange.bind(this));
  }

  get billingDetails() {
    const slot = this.shadowRoot.querySelector('slot[name="actions"]');
    const assigned = slot.assignedElements();
    const elements = (assigned.length ? assigned : [...slot.children]);
    return Object.fromEntries(elements.map(fieldEntry));
  }

  render() {
    return html`
      <div id="stripe" ?hidden="${this.output}">
        <slot name="stripe"></slot>
      </div>

      <div id="actions" ?hidden="${this.output}">
        <slot name="actions">
          <mwc-textfield outlined label="Cardholder Name" data-owner-prop="name" value="Mr. Man"> </mwc-textfield>
          <mwc-textfield outlined label="Cardholder Email" data-owner-prop="email" value="mr@man.email"> </mwc-textfield>
          <mwc-textfield outlined label="Cardholder Phone" data-owner-prop="phone" value="555 555 5555"> </mwc-textfield>
          <mwc-button ?disabled="${this.submitDisabled}" outlined @click="${this.onClickSubmit}">${this.label}</mwc-button>
        </slot>
      </div>

      <json-viewer .object="${this.output}"> </json-viewer>
    `;
  }

  async onClickSubmit() {
    const element = this.querySelector('stripe-elements');
    element.billingDetails = this.billingDetails;
    this.output = await element.submit();
  }

  onStripeChange({ target: { isComplete } }) {
    this.submitDisabled = !isComplete;
  }
});
