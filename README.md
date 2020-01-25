# Stripe Elements Web Components

🛡⚛️🔰 **Any** Framework - **One** Stripe Integration. 💰💵💸

[![Published on npm](https://img.shields.io/npm/v/@power-elements/stripe-elements.svg)](https://www.npmjs.com/package/@power-elements/stripe-elements)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bennypowers/stripe-elements)
[![made with open-wc](https://img.shields.io/badge/made%20with-open--wc-%23217ff9)](https://open-wc.org)
[![Maintainability](https://api.codeclimate.com/v1/badges/b2205a301b0a8bb82d51/maintainability)](https://codeclimate.com/github/bennypowers/stripe-elements/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/b2205a301b0a8bb82d51/test_coverage)](https://codeclimate.com/github/bennypowers/stripe-elements/test_coverage)
[![Release](https://github.com/bennypowers/stripe-elements/workflows/Release/badge.svg)](https://github.com/bennypowers/stripe-elements/actions?query=workflow%3ARelease)
[![Contact me on Codementor](https://cdn.codementor.io/badges/contact_me_github.svg)](https://www.codementor.io/bennyp?utm_source=github&utm_medium=button&utm_term=bennyp&utm_campaign=github)

👨‍🎨 [Live Demo](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-elements--enter-a-stripe-publishable-key) 👀

## 🚚 Installation

You should make sure to load stripe.js on your app's index.html, as per Stripe's recommendation, before loading `<stripe-elements>`. If `window.Stripe` is not available when you load up the component, it will fail with a reasonably-polite console warning.

```html
<script src="https://js.stripe.com/v3/"></script>
```

```
npm i -S @power-elements/stripe-elements
```

To pre-build, use [Snowpack](https://snowpack.dev) to build the modules to your app's `web_modules` directory. See below for usage examples.

```
npx snowpack
```

---

`<stripe-elements>` is a community project.

---


## Elements
### stripe-elements

[Stripe.js v3 Card Elements](https://stripe.com/docs/elements), but it's a Web Component!
Supports Shadow DOM.

👨‍🎨 [Live Demo](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-elements--enter-a-stripe-publishable-key) 👀

### 🧙‍♂️ Usage
If you prebuilt with Snowpack, load the module from your `web_modules` directory

```html
<script type="module" src="/web_modules/@power-elements/stripe-elements/stripe-elements.js"></script>
```

Alternatively, load the module from the unpkg CDN
```html
<script type="module" src="https://unpkg.com/@power-elements/stripe-elements/stripe-elements.js?module"></script>
```

Then you can add the element to your page.

```html
<stripe-elements id="stripe"
     action="/payment"
     publishable-key="pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"
></stripe-elements>
```

See the demos for more comprehensive examples.
   - Using `<stripe-elements>` with [plain HTML and JavaScript](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-elements--in-plain-html-and-javascript).
   - Using `<stripe-elements>` in a [LitElement](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-elements--in-a-lit-element).
   - Using `<stripe-elements>` in a [Vue Component](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-elements--in-a-vue-component).
   - Using `<stripe-elements>` in an [Angular component](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-elements--in-an-angular-component).
   - Using `<stripe-elements>` in a [React component](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-elements--in-a-react-component).
   - Using `<stripe-elements>` in a [Preact component](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-elements--in-a-preact-component).

## Styling

Stripe v3's 'Stripe Elements' are not custom elements, but rather forms
hosted by stripe and injected into your page via an iFrame. When we refer to the
'Stripe Element' in this document, we are referring to the hosted Stripe form,
not the `<stripe-element>` custom element. But when I mention the 'element', I mean the custom element.

When you apply CSS to the custom properties available, they're parsed and sent to Stripe, who should apply them to the Stripe Element they return in the iFrame.

- `base` styles are inherited by all other variants.
- `complete` styles are applied when the Stripe Element has valid input.
- `empty` styles are applied when the Stripe Element has no user input.
- `invalid` styles are applied when the Stripe Element has invalid input.

There are 11 properties for each state that you can set which will be read into the Stripe Element iFrame:

- `color`
- `font-family`
- `font-size`
- `font-smoothing`
- `font-variant`
- `icon-color`
- `line-height`
- `letter-spacing`
- `text-decoration`
- `text-shadow`
- `text-transform`

**Mixins:** LitNotify, ReadOnlyPropertiesMixin

#### Properties

| Property            | Attribute          | Modifiers | Type                                  | Default   | Description                                      |
|---------------------|--------------------|-----------|---------------------------------------|-----------|--------------------------------------------------|
| `action`            | `action`           |           | `string`                              |           | If set, when Stripe returns the payment info (PaymentMethod, Source, or Token),<br />the element will POST JSON data to this URL with an object containing<br />a key equal to the value of the `generate` property. |
| `billingDetails`    |                    |           | `stripe.BillingDetails`               | {}        | billing_details object sent to create the payment representation. (optional) |
| `brand`             | `brand`            | readonly  | `string`                              | null      | The card brand detected by Stripe                |
| `card`              | `card`             | readonly  | `stripe.elements.Element`             | null      | The Stripe card object.<br />**DEPRECATED**. Will be removed in a future version. use `element` instead |
| `clientSecret`      | `client-secret`    |           | `String`                              |           | The `client_secret` part of a Stripe `PaymentIntent` |
| `complete`          | `complete`         | readonly  | `boolean`                             | false     | Whether the form is complete.                    |
| `element`           | `element`          | readonly  | `stripe.elements.Element`             | null      | Stripe element instance                          |
| `elements`          | `elements`         | readonly  | `stripe.elements.Elements`            | null      | Stripe Elements instance                         |
| `empty`             | `empty`            | readonly  | `boolean`                             | true      | If the form is empty.                            |
| `error`             | `error`            | readonly  | `Error\|stripe.Error`                 | null      | Stripe or validation error                       |
| `focused`           | `focused`          | readonly  | `boolean`                             | false     | If the element is focused.                       |
| `generate`          | `generate`         |           | `'payment-method'\|'source'\|'token'` | "source"  | Type of payment representation to generate.      |
| `hasError`          | `has-error`        | readonly  | `boolean`                             | false     | Whether the element has an error<br />**DEPRECATED**. Will be removed in a future version. Use `error` instead |
| `hideIcon`          | `hide-icon`        |           | `boolean`                             | false     | Whether to hide icons in the Stripe form.        |
| `hidePostalCode`    | `hide-postal-code` |           | `boolean`                             | false     | Whether or not to hide the postal code field.<br />Useful when you gather shipping info elsewhere. |
| `iconStyle`         | `icon-style`       |           | `'solid'\|'default'`                  | "default" | Stripe icon style. 'solid' or 'default'.         |
| `invalid`           | `invalid`          | readonly  | `boolean`                             | false     | Whether the form is invalid.                     |
| `isComplete`        | `is-complete`      |           | `boolean`                             | false     | Whether the form is complete.<br />**DEPRECATED**. Will be removed in a future version. use `complete` instead |
| `isEmpty`           | `is-empty`         |           | `boolean`                             | true      | Whether the form is empty.<br />**DEPRECATED**. Will be removed in a future version. use `empty` instead |
| `paymentMethod`     | `payment-method`   | readonly  | `stripe.paymentMethod.PaymentMethod`  | null      | Stripe PaymentMethod                             |
| `paymentMethodData` |                    |           | `stripe.PaymentMethodData`            | {}        | Data passed to stripe.createPaymentMethod. (optional) |
| `publishableKey`    | `publishable-key`  |           | `string`                              |           | Stripe Publishable Key. EG. `pk_test_XXXXXXXXXXXXXXXXXXXXXXXX` |
| `ready`             | `ready`            | readonly  | `boolean`                             | false     | Whether the stripe element is ready to receive focus. |
| `showError`         | `show-error`       |           | `boolean`                             | false     | Whether to display the error message             |
| `source`            | `source`           | readonly  | `stripe.Source`                       | null      | Stripe Source                                    |
| `sourceData`        |                    |           | `SourceData`                          | {}        | Data passed to stripe.createSource. (optional)   |
| `stripe`            | `stripe`           | readonly  | `stripe.Stripe`                       | null      | Stripe instance                                  |
| `stripeMount`       |                    | readonly  | `Element`                             |           | Stripe.js mount point element. Due to limitations in the Stripe.js library, this element must be connected to the document. |
| `stripeReady`       | `stripe-ready`     |           | `boolean`                             | false     | Whether the stripe element is ready to receive focus.<br />**DEPRECATED**. Will be removed in a future version. use `ready` instead. |
| `token`             | `token`            | readonly  | `stripe.Token`                        | null      | Stripe Token                                     |
| `tokenData`         |                    |           | `stripe.TokenOptions`                 | {}        | Data passed to stripe.createToken. (optional)    |
| `value`             | `value`            |           | `object`                              | {}        | Prefilled values for form. Example {postalCode: '90210'} |

#### Methods

| Method                | Type                                             | Description                                      |
|-----------------------|--------------------------------------------------|--------------------------------------------------|
| `blur`                | `(): void`                                       | Blur the element.                                |
| `createPaymentMethod` | `(paymentMethodData?: PaymentMethodData \| undefined): Promise<PaymentMethodResponse>` | Submit payment information to generate a paymentMethod |
| `createSource`        | `(sourceData?: { owner: OwnerInfo; } \| undefined): Promise<SourceResponse>` | Submit payment information to generate a source  |
| `createToken`         | `(tokenData?: TokenData): Promise<TokenResponse>` | Submit payment information to generate a token   |
| `focus`               | `(): void`                                       | Focus the element.                               |
| `isPotentiallyValid`  | `(): boolean`                                    | Checks for potential validity. A potentially valid form is one that is not empty, not complete and has no error. A validated form also counts as potentially valid. |
| `reset`               | `(): void`                                       | Resets the Stripe card.                          |
| `submit`              | `(): Promise<PaymentMethodResponse \| SourceResponse \| TokenResponse>` | Generates a payment representation of the type specified by `generate`. |
| `validate`            | `(): boolean`                                    | Checks if the Stripe form is valid.              |

#### Events

| Event                   | Description                                      |
|-------------------------|--------------------------------------------------|
| `change`                | Stripe Element change event                      |
| `error`                 | The validation error, or the error returned from stripe.com |
| `payment-method`        | The PaymentMethod received from stripe.com       |
| `ready`                 | Stripe has been initialized and mounted          |
| `source`                | The Source received from stripe.com              |
| `stripe-error`          | **DEPRECATED**. Will be removed in a future major version. Use `error` instead |
| `stripe-payment-method` | **DEPRECATED**. Will be removed in a future major version. Use `payment-method` instead |
| `stripe-ready`          | **DEPRECATED**. Will be removed in a future major version. Use `ready` instead |
| `stripe-source`         | **DEPRECATED**. Will be removed in a future major version. Use `source` instead |
| `stripe-token`          | **DEPRECATED**. Will be removed in a future major version. Use `token` instead |
| `success`               | When a payment succeeds                          |
| `token`                 | The Token received from stripe.com               |

#### CSS Shadow Parts

| Part     | Description                      |
|----------|----------------------------------|
| `error`  | container for the error message  |
| `stripe` | container for the stripe element |

#### CSS Custom Properties

| Property                                     | Description                                      |
|----------------------------------------------|--------------------------------------------------|
| `--stripe-elements-base-color`               | `color` property for the element in its base state |
| `--stripe-elements-base-font-family`         | `font-family` property for the element in its base state |
| `--stripe-elements-base-font-size`           | `font-size` property for the element in its base state |
| `--stripe-elements-base-font-smoothing`      | `font-smoothing` property for the element in its base state |
| `--stripe-elements-base-font-variant`        | `font-variant` property for the element in its base state |
| `--stripe-elements-base-icon-color`          | `icon-color` property for the element in its base state |
| `--stripe-elements-base-letter-spacing`      | `letter-spacing` property for the element in its base state |
| `--stripe-elements-base-line-height`         | `line-height` property for the element in its base state |
| `--stripe-elements-base-text-decoration`     | `text-decoration` property for the element in its base state |
| `--stripe-elements-base-text-shadow`         | `text-shadow` property for the element in its base state |
| `--stripe-elements-base-text-transform`      | `text-transform` property for the element in its base state |
| `--stripe-elements-border`                   | border property of the element container. Default `1px solid transparent` |
| `--stripe-elements-border-radius`            | border radius of the element container. Default `4px` |
| `--stripe-elements-box-shadow`               | box shadow for the element container. Default `0 1px 3px 0 #e6ebf1` |
| `--stripe-elements-complete-color`           | `color` property for the element in its complete state |
| `--stripe-elements-complete-font-family`     | `font-family` property for the element in its complete state |
| `--stripe-elements-complete-font-size`       | `font-size` property for the element in its complete state |
| `--stripe-elements-complete-font-smoothing`  | `font-smoothing` property for the element in its complete state |
| `--stripe-elements-complete-font-variant`    | `font-variant` property for the element in its complete state |
| `--stripe-elements-complete-icon-color`      | `icon-color` property for the element in its complete state |
| `--stripe-elements-complete-letter-spacing`  | `letter-spacing` property for the element in its complete state |
| `--stripe-elements-complete-line-height`     | `line-height` property for the element in its complete state |
| `--stripe-elements-complete-text-decoration` | `text-decoration` property for the element in its complete state |
| `--stripe-elements-complete-text-shadow`     | `text-shadow` property for the element in its complete state |
| `--stripe-elements-complete-text-transform`  | `text-transform` property for the element in its complete state |
| `--stripe-elements-empty-color`              | `color` property for the element in its empty state |
| `--stripe-elements-empty-font-family`        | `font-family` property for the element in its empty state |
| `--stripe-elements-empty-font-size`          | `font-size` property for the element in its empty state |
| `--stripe-elements-empty-font-smoothing`     | `font-smoothing` property for the element in its empty state |
| `--stripe-elements-empty-font-variant`       | `font-variant` property for the element in its empty state |
| `--stripe-elements-empty-icon-color`         | `icon-color` property for the element in its empty state |
| `--stripe-elements-empty-letter-spacing`     | `letter-spacing` property for the element in its empty state |
| `--stripe-elements-empty-line-height`        | `line-height` property for the element in its empty state |
| `--stripe-elements-empty-text-decoration`    | `text-decoration` property for the element in its empty state |
| `--stripe-elements-empty-text-shadow`        | `text-shadow` property for the element in its empty state |
| `--stripe-elements-empty-text-transform`     | `text-transform` property for the element in its empty state |
| `--stripe-elements-invalid-color`            | `color` property for the element in its invalid state |
| `--stripe-elements-invalid-font-family`      | `font-family` property for the element in its invalid state |
| `--stripe-elements-invalid-font-size`        | `font-size` property for the element in its invalid state |
| `--stripe-elements-invalid-font-smoothing`   | `font-smoothing` property for the element in its invalid state |
| `--stripe-elements-invalid-font-variant`     | `font-variant` property for the element in its invalid state |
| `--stripe-elements-invalid-icon-color`       | `icon-color` property for the element in its invalid state |
| `--stripe-elements-invalid-letter-spacing`   | `letter-spacing` property for the element in its invalid state |
| `--stripe-elements-invalid-line-height`      | `line-height` property for the element in its invalid state |
| `--stripe-elements-invalid-text-decoration`  | `text-decoration` property for the element in its invalid state |
| `--stripe-elements-invalid-text-shadow`      | `text-shadow` property for the element in its invalid state |
| `--stripe-elements-invalid-text-transform`   | `text-transform` property for the element in its invalid state |
| `--stripe-elements-transition`               | transition property for the element container. Default `box-shadow 150ms ease` |

### stripe-payment-request

Custom element wrapper for Stripe.js v3 Payment Request Buttons.

👨‍🎨 [Live Demo](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-payment-request--enter-a-stripe-publishable-key) 👀

### 🧙‍♂️ Usage
If you prebuilt with Snowpack, load the module from your `web_modules` directory

```html
<script type="module" src="/web_modules/@power-elements/stripe-elements/stripe-payment-request.js"></script>
```

Alternatively, load the module from the unpkg CDN
```html
<script type="module" src="https://unpkg.com/@power-elements/stripe-elements/stripe-payment-request.js?module"></script>
```

Then you can add the element to your page.

```html

<stripe-payment-request id="payment-request"
     publishable-key="pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"
     generate="token"
     action="/charges"
     country="CA"
     currency="cad"
     amount="1000"
     label="Ten Bones"
     request-payer-name
     request-payer-email
     request-payer-phone
></stripe-payment-request>
```

See the demos for more comprehensive examples.
   - Using `<stripe-payment-request>` with [plain HTML and JavaScript](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-payment-request--in-plain-html-and-javascript).
   - Using `<stripe-payment-request>` in a [LitElement](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-payment-request--in-a-lit-element).
   - Using `<stripe-payment-request>` in a [Vue Component](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-payment-request--in-a-vue-component).
   - Using `<stripe-payment-request>` in an [Angular component](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-payment-request--in-an-angular-component).
   - Using `<stripe-payment-request>` in a [React component](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-payment-request--in-a-react-component).
   - Using `<stripe-payment-request>` in a [Preact component](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-payment-request--in-a-preact-component).

**Mixins:** ReadOnlyPropertiesMixin, LitNotify

#### Properties

| Property            | Attribute             | Modifiers | Type                                         | Default   | Description                                      |
|---------------------|-----------------------|-----------|----------------------------------------------|-----------|--------------------------------------------------|
| `action`            | `action`              |           | `string`                                     |           | If set, when Stripe returns the payment info (PaymentMethod, Source, or Token),<br />the element will POST JSON data to this URL with an object containing<br />a key equal to the value of the `generate` property. |
| `amount`            | `amount`              |           | `number`                                     |           | The amount in the currency's subunit (e.g. cents, yen, etc.) |
| `billingDetails`    |                       |           | `stripe.BillingDetails`                      | {}        | billing_details object sent to create the payment representation. (optional) |
| `buttonTheme`       | `button-theme`        |           | `'dark'\|'light'\|'light-outline'`           | "dark"    |                                                  |
| `buttonType`        | `button-type`         |           | `'default'\|'book'\|'buy'\|'donate'`         | "default" |                                                  |
| `canMakePayment`    | `can-make-payment`    |           | `object`                                     | null      | Whether or not the device can make the payment request. |
| `clientSecret`      | `client-secret`       |           | `String`                                     |           | The `client_secret` part of a Stripe `PaymentIntent` |
| `country`           | `country`             |           | `string`                                     |           | The two-letter country code of your Stripe account (e.g., `US`) |
| `currency`          | `currency`            |           | `string`                                     |           | Three character currency code (e.g., `usd`)      |
| `displayItems`      | `displayItems`        |           | `stripe.paymentRequest.DisplayItem[]`        |           | An array of DisplayItem objects. These objects are shown as line items in the browser’s payment interface. Note that the sum of the line item amounts does not need to add up to the total amount above. |
| `element`           | `element`             | readonly  | `stripe.elements.Element`                    | null      | Stripe element instance                          |
| `elements`          | `elements`            | readonly  | `stripe.elements.Elements`                   | null      | Stripe Elements instance                         |
| `error`             | `error`               | readonly  | `Error\|stripe.Error`                        | null      | Stripe or validation error                       |
| `focused`           | `focused`             | readonly  | `boolean`                                    | false     | If the element is focused.                       |
| `generate`          | `generate`            |           | `'payment-method'\|'source'\|'token'`        | "source"  | Type of payment representation to generate.      |
| `hasError`          | `has-error`           | readonly  | `boolean`                                    | false     | Whether the element has an error<br />**DEPRECATED**. Will be removed in a future version. Use `error` instead |
| `label`             | `label`               |           | `string`                                     |           | A name that the browser shows the customer in the payment interface. |
| `paymentIntent`     | `payment-intent`      | readonly  | `stripe.paymentIntents.PaymentIntent`        | null      | Stripe PaymentIntent                             |
| `paymentMethod`     | `payment-method`      | readonly  | `stripe.paymentMethod.PaymentMethod`         | null      | Stripe PaymentMethod                             |
| `paymentMethodData` |                       |           | `stripe.PaymentMethodData`                   | {}        | Data passed to stripe.createPaymentMethod. (optional) |
| `paymentRequest`    | `payment-request`     |           | `stripe.paymentRequest.StripePaymentRequest` | null      | Stripe PaymentRequest                            |
| `pending`           | `pending`             |           | `boolean`                                    | false     | If you might change the payment amount later (for example, after you have calcluated shipping costs), set this to true. Note that browsers treat this as a hint for how to display things, and not necessarily as something that will prevent submission. |
| `publishableKey`    | `publishable-key`     |           | `string`                                     |           | Stripe Publishable Key. EG. `pk_test_XXXXXXXXXXXXXXXXXXXXXXXX` |
| `ready`             | `ready`               | readonly  | `boolean`                                    | false     | Whether the stripe element is ready to receive focus. |
| `requestPayerEmail` | `request-payer-email` |           | `boolean`                                    |           | See the requestPayerName option.                 |
| `requestPayerName`  | `request-payer-name`  |           | `boolean`                                    |           | By default, the browser‘s payment interface only asks the customer for actual payment information. A customer name can be collected by setting this option to true. This collected name will appears in the PaymentResponse object.<br /><br />We highly recommend you collect at least one of name, email, or phone as this also results in collection of billing address for Apple Pay. The billing address can be used to perform address verification and block fraudulent payments. For all other payment methods, the billing address is automatically collected when available. |
| `requestPayerPhone` | `request-payer-phone` |           | `boolean`                                    |           | See the requestPayerName option.                 |
| `requestShipping`   | `request-shipping`    |           | `boolean`                                    |           | Collect shipping address by setting this option to true. The address appears in the PaymentResponse.<br />You must also supply a valid [ShippingOptions] to the shippingOptions property. This can be up front at the time stripe.paymentRequest is called, or in response to a shippingaddresschange event using the updateWith callback. |
| `shippingOptions`   | `shippingOptions`     |           | `stripe.paymentRequest.ShippingOption[]`     |           | An array of ShippingOption objects. The first shipping option listed appears in the browser payment interface as the default option. |
| `showError`         | `show-error`          |           | `boolean`                                    | false     | Whether to display the error message             |
| `source`            | `source`              | readonly  | `stripe.Source`                              | null      | Stripe Source                                    |
| `sourceData`        |                       |           | `SourceData`                                 | {}        | Data passed to stripe.createSource. (optional)   |
| `stripe`            | `stripe`              | readonly  | `stripe.Stripe`                              | null      | Stripe instance                                  |
| `stripeMount`       |                       | readonly  | `Element`                                    |           | Stripe.js mount point element. Due to limitations in the Stripe.js library, this element must be connected to the document. |
| `stripeReady`       | `stripe-ready`        |           | `boolean`                                    | false     | Whether the stripe element is ready to receive focus.<br />**DEPRECATED**. Will be removed in a future version. use `ready` instead. |
| `token`             | `token`               | readonly  | `stripe.Token`                               | null      | Stripe Token                                     |
| `tokenData`         |                       |           | `stripe.TokenOptions`                        | {}        | Data passed to stripe.createToken. (optional)    |

#### Methods

| Method  | Type       | Description              |
|---------|------------|--------------------------|
| `blur`  | `(): void` | Blur the element.        |
| `focus` | `(): void` | Focus the element.       |
| `reset` | `(): void` | Reset the stripe element |

#### Events

| Event                   | Description                                      |
|-------------------------|--------------------------------------------------|
| `cancel`                | When a payment request is cancelled              |
| `error`                 | The validation error, or the error returned from stripe.com |
| `fail`                  | When a payment request fails                     |
| `payment-method`        | The PaymentMethod received from stripe.com       |
| `ready`                 | Stripe has been initialized and mounted          |
| `shippingaddresschange` | When the user chooses a different shipping address |
| `shippingoptionchange`  | When the user chooses a different shipping option |
| `source`                | The Source received from stripe.com              |
| `stripe-error`          | **DEPRECATED**. Will be removed in a future major version. Use `error` instead |
| `stripe-payment-method` | **DEPRECATED**. Will be removed in a future major version. Use `payment-method` instead |
| `stripe-ready`          | **DEPRECATED**. Will be removed in a future major version. Use `ready` instead |
| `stripe-source`         | **DEPRECATED**. Will be removed in a future major version. Use `source` instead |
| `stripe-token`          | **DEPRECATED**. Will be removed in a future major version. Use `token` instead |
| `success`               | When a payment succeeds                          |
| `token`                 | The Token received from stripe.com               |

#### CSS Shadow Parts

| Part     | Description                      |
|----------|----------------------------------|
| `error`  | container for the error message  |
| `stripe` | container for the stripe element |

#### CSS Custom Properties

| Property                                | Description                                      |
|-----------------------------------------|--------------------------------------------------|
| `'--stripe-payment-request-element`     | padding' padding property of the container element. Default `8px 12px` |
| `'--stripe-payment-request-element-min` | width' min-width property of the container element. Default `300px` |

