```js script
import { html } from 'lit-html' ;
import '@power-elements/codesandbox-button';

export default {
  title: 'Framework Examples/Vue',
  parameters: {
    options: {
      selectedPanel: 'storybookjs/docs/panel'
    }
  }
}
```

# `<stripe-elements>`

```js story
export const VueStripeElements = () => html`
  <codesandbox-button sandbox-id="06ulb" module="/src/Payment.vue"></codesandbox-button>
`
```

```html
<template>
  <article>
    <stripe-elements
      ref="stripe"
      @change="onChange"
      @token="onToken"
      @error="onError"
      :publishable-key="publishableKey"
    ></stripe-elements>

    <mwc-button :disabled="!complete || empty" @click="onClick">Get Token</mwc-button>

    <json-viewer v-if="error || token" :object.prop="error || token"></json-viewer>
  </article>
</template>

<script>
import { PUBLISHABLE_KEY } from './config';

export default {
  name: "payment-form",
  data() {
    return {
      publishableKey: PUBLISHABLE_KEY,
      token: null,
      error: null,
      complete: false,
      empty: true
    };
  },
  methods: {
    onChange({ target: { complete, empty } }) {
      this.complete = complete;
      this.empty = empty;
    },

    onClick() {
      this.$refs.stripe.createToken();
    },

    onToken({ detail: token }) {
      this.token = token;
    },

    onError({ detail: error }) {
      this.error = error;
    },
  }
};
</script>
```

# `<stripe-payment-request>`

```js story
export const VueStripePaymentRequest = () => html`
  <codesandbox-button sandbox-id="23edw" module="/src/Payment.vue"></codesandbox-button>
`
```


```html
<template>
  <article>
    <stripe-payment-request
      ref="stripe"
      @payment-method="onPaymentMethod"
      @error="onError"
      :publishable-key="publishableKey"
      generate="payment-method"
      request-payer-name
      request-payer-email
      request-payer-phone
      amount="326"
      label="Double Double"
      country="CA"
      currency="cad"
    ></stripe-payment-request>

    <json-viewer v-if="error || paymentMethod" :object.prop="error || paymentMethod"></json-viewer>
  </article>
</template>

<script>
import { PUBLISHABLE_KEY } from './config';

export default {
  name: "payment-form",
  data() {
    return {
      publishableKey: PUBLISHABLE_KEY,
      paymentMethod: null,
      error: null,
    };
  },
  methods: {
    onPaymentMethod({ detail: paymentMethod }) {
      this.paymentMethod = paymentMethod;
    },

    onError({ target: { error } }) {
      this.error = error;
    },
  }
};
</script>
```
