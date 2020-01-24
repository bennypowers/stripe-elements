import { LitElement, css, html } from 'lit-element';

export const $ = x => document.querySelector(x);
export const $$ = x => [...document.querySelectorAll(x)];

const LS_KEYS = Object.freeze({
  publishableKey: '__STRIPE_PUBLISHABLE_KEY__',
  clientSecret: '__STRIPE_CLIENT_SECRET__',
});

export const publishableKey =
  localStorage.getItem(LS_KEYS.publishableKey) || 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX';

export const clientSecret =
  localStorage.getItem(LS_KEYS.clientSecret) || undefined;

const setProp = (prop, value) => el =>
  (el[prop] = value);

const setProps = propName => selector => ({ target: { value } }) => {
  localStorage.setItem(LS_KEYS[propName], value);
  return $$(selector)
    .forEach(setProp(propName, value));
};

export const setKeys = setProps('publishableKey');
export const setClientSecrets = setProps('clientSecret');

export const displayObject = ({ target, detail }) => {
  const viewer = target.parentElement.querySelector('json-viewer');
  viewer.object = detail;
};

const fieldEntry = field => [field.dataset.ownerProp, field.value];

const shared = css`
  [hidden] { display: none !important; }

  :host {
    align-items: center;
    display: grid;
    grid-gap: 12px;
  }

  #stripe {
    display: contents;
  }

  ::slotted([publishable-key]) {
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

class DemoBase extends LitElement {
  static get properties() {
    return {
      output: { type: Object },
    };
  }

  constructor() {
    super();
    this.display = this.display.bind(this);
  }

  attachStripeListeners() {
    const stripe = this.querySelector(this.constructor.selector);
    if (!stripe) return;
    stripe.addEventListener('success', this.display);
    stripe.addEventListener('fail', this.display);
  }

  detatchStripeListeners() {
    const stripe = this.querySelector(this.constructor.selector);
    if (!stripe) return;
    stripe.addEventListener('success', this.display);
    stripe.addEventListener('fail', this.display);
  }

  connectedCallback() {
    super.connectedCallback();
    const mo = new MutationObserver(this.attachStripeListeners);
    mo.observe(this, { childList: true });
    this.attachStripeListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.detachStripeListeners();
  }

  display({ target }) {
    const val = target[target.generate];
    this.output = val;
  }
}

customElements.define('elements-demo', class ElementsDemo extends DemoBase {
  static get properties() {
    return {
      submitDisabled: { type: Boolean },
      label: { type: String },
    };
  }

  static get styles() {
    return [shared, css`
      :host {
        grid-template-areas:
          'stripe stripe'
          'fields fields';
      }

      #actions {
        display: contents;
      }
`];
  }

  static get selector() {
    return 'stripe-elements';
  }

  constructor() {
    super();
    this.submitDisabled = true;
    this.addEventListener('change', this.onStripeChange.bind(this));
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
    const [element] = this.shadowRoot.querySelector('slot[name="stripe"]');
    element.billingDetails = this.billingDetails;
    this.output = await element.submit();
  }

  onStripeChange({ target: { isComplete } }) {
    this.submitDisabled = !isComplete;
  }
});

customElements.define('payment-request-demo', class PaymentRequestDemo extends DemoBase {
  static get styles() {
    return [shared, css`
      :host {
        grid-template-areas:
          'stripe'
          'output';
      }
`];
  }

  static get selector() {
    return 'stripe-payment-request';
  }

  render() {
    return html`
      <div id="stripe" ?hidden="${this.output}"><slot></slot></div>
      <json-viewer .object="${this.output}"> </json-viewer>
    `;
  }
});
