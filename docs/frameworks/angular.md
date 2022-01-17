---
layout: layout-framework.njk
templateEngineOverride: njk,md
framework: angular
tags:
  - framework
---
## `<stripe-elements>`

{% sandbox "0mgh4", module="/src/app/app.component.ts" %}

``` html
<stripe-elements
  #stripe
  (change)="disabled = !$event.target.complete"
  (token)="token = $event.detail"
  (error)="error = $event.detail"
  [publishableKey]="publishableKey"
></stripe-elements>

<mwc-button [disabled]="disabled" (click)="createToken(stripe)">Get Token</mwc-button>

<json-viewer *ngIf="error || token" [object]="error || token"></json-viewer>
```

```ts
import { Component } from "@angular/core";
import { PUBLISHABLE_KEY } from './config';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
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

## `<stripe-payment-request>`

{% sandbox "97z2t", module="/src/app/app.component.ts" %}

``` html
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
```

```ts
import { Component } from "@angular/core";
import { PUBLISHABLE_KEY } from './config';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  publishableKey: string = PUBLISHABLE_KEY;
  paymentMethod?: stripe.paymentMethod.PaymentMethod = null;
  error?: Error | stripe.Error = null;
}
```
