```js script
import '@power-elements/codesandbox-button';

import { html } from '@open-wc/demoing-storybook';

export default {
  title: 'Framework Examples/Angular',
  parameters: {
    options: {
      selectedPanel: 'storybookjs/docs/panel'
      }
  }
}
```

# `<stripe-elements>`

```js story
export const AngularStripeElements = () => html`
  <codesandbox-button
      sandbox-id="0mgh4"
      module="/src/app/app.component.ts"
  ></codesandbox-button>
`;
```

```ts
import { Component } from "@angular/core";
import { PUBLISHABLE_KEY } from './config';

const template = `
  <stripe-elements
    #stripe
    (change)="disabled = !$event.target.complete"
    (token)="token = $event.detail"
    (error)="error = $event.detail"
    [publishableKey]="publishableKey"
  ></stripe-elements>

  <mwc-button [disabled]="disabled" (click)="createToken(stripe)">Get Token</mwc-button>

  <json-viewer *ngIf="error || token" [object]="error || token"></json-viewer>
`;

const styleUrls = ["./app.component.css"];

@Component({ selector: "app-root", template, styleUrls })
export class AppComponent {
  publishableKey: string = PUBLISHABLE_KEY;
  disabled = true;
  token?: stripe.Token = null;
  error?: Error | stripe.Error = null;
  createToken(stripeElements: any) {
    stripeElements.createToken();
  }
}
```

# `<stripe-payment-request>`

```js story
export const AngularStripePaymentRequest = () => html`
  <codesandbox-button
      sandbox-id="97z2t"
      module="/src/app/app.component.ts"
  ></codesandbox-button>
`;
```

```ts
import { Component } from "@angular/core";
import { PUBLISHABLE_KEY } from './config';

const template = `
  <stripe-payment-request
    (paymentMethod)="paymentMethod = $event.detail"
    (error)="error = $event.detail"
    [publishableKey]="publishableKey"
    generate="payment-method"
    request-payer-name
    request-payer-email
    request-payer-phone
    amount="326"
    label="Double Double"
    country="CA"
    currency="cad"
  ></stripe-payment-request>

  <json-viewer *ngIf="error || paymentMethod" [object]="error || paymentMethod"></json-viewer>
`;

const styleUrls = ["./app.component.css"];

@Component({ selector: "app-root", template, styleUrls })
export class AppComponent {
  publishableKey: string = PUBLISHABLE_KEY;
  paymentMethod?: stripe.paymentMethod.PaymentMethod = null;
  error?: Error | stripe.Error = null;
}
```
