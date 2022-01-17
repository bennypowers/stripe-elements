```js script
import { html } from 'lit' ;
import '@power-elements/codesandbox-button';

export default {
  title: 'Framework Examples/React',
  parameters: {
    options: {
      selectedPanel: 'storybookjs/docs/panel'
    }
  }
}
```

# `<stripe-elements>`

```js story
export const ReactStripeElements = () => html`
  <codesandbox-button sandbox-id="23zw8"></codesandbox-button>
`
```

```jsx
import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { PUBLISHABLE_KEY } from './config';
import "./styles.css";

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
const isDisabled = ({ complete, empty }) => !complete || empty;
const getTarget = x => x.target ?? {};
const getDetail = x => x.detail ?? null;
const getToken = x => x.token ?? null;

function App() {
  const stripeRef = useRef(null);
  const viewerRef = useRef(null);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const [disabled, setDisabled] = useState(true);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const onChange = compose(setDisabled, isDisabled, getTarget);
  const onError = compose(setError, getDetail);
  const onToken = compose(setToken, getToken);

  const onClick = async () =>
    stripeRef.current.createToken()
      .then(getToken);
      .then(setToken);

  useEffect(() => {
    stripeRef.current.addEventListener("change", onChange);
    stripeRef.current.addEventListener("error", onError);
    stripeRef.current.addEventListener("token", onToken);
    buttonRef.current.addEventListener("click", onClick);
    buttonRef.current.disabled = disabled;
    if (token || error) viewerRef.current.object = token;
  });

  return (
    <article className="App">
      <stripe-elements ref={stripeRef} publishable-key={PUBLISHABLE_KEY} />
      <mwc-button ref={buttonRef}>Submit</mwc-button>
      <json-viewer ref={viewerRef} />
    </article>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
```

# `<stripe-payment-request>`

```js story
export const ReactStripePaymentRequest = () => html`
  <codesandbox-button sandbox-id="0kktv"></codesandbox-button>
`
```


```jsx
import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { PUBLISHABLE_KEY } from './config';
import "./styles.css";

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
const getDetail = x => x.detail ?? null;
const getPaymentMethod = x => x.paymentMethod ?? null;

function App() {
  const stripeRef = useRef(null);
  const viewerRef = useRef(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [error, setError] = useState(null);

  const onError = compose(setError, getDetail);
  const onPaymentMethod = compose(setPaymentMethod, getPaymentMethod);

  useEffect(() => {
    stripeRef.current.addEventListener("error", onError);
    stripeRef.current.addEventListener("payment-method", onPaymentMethod);
    if (paymentMethod || error) viewerRef.current.object = paymentMethod;
  });

  return (
    <article className="App">
      <stripe-payment-request ref={stripeRef} publishable-key={PUBLISHABLE_KEY}
        generate="payment-method"
        request-payer-name
        request-payer-email
        request-payer-phone
        amount="326"
        label="Double Double"
        country="CA"
        currency="cad"
      />
      <json-viewer ref={viewerRef} />
    </article>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
```
