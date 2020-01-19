# Stripe Elements Web Components

Custom element wrappers for Stripe.js v3 Elements.

[![made with open-wc](https://img.shields.io/badge/made%20with-open--wc-%23217ff9)](https://open-wc.org)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bennypowers/stripe-elements)
[![Published on npm](https://img.shields.io/npm/v/@power-elements/stripe-elements.svg)](https://www.npmjs.com/package/@power-elements/stripe-elements)
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
<script type="module" src="https://unpkg.com/@power-elements/stripe-elements/stripe-elements.js?module"></script>
<stripe-elements id="stripe"
     action="/payment"
     publishable-key="pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"
></stripe-elements>
```

See the demos for more comprehensive examples.
   - Using `<stripe-elements>` with [plain HTML and JavaScript](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-elements--in-plain-html-and-javascript).
   - Using `<stripe-elements>` in a [LitElement](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-elements--in-a-lit-element).
   - Using `<stripe-elements>` in a [Polymer Element](https://bennypowers.dev/stripe-elements/?path=/docs/stripe-elements--in-a-polymer-element).
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

| Property         | Attribute          | Modifiers | Type                          | Default                | Description                                      |
|------------------|--------------------|-----------|-------------------------------|------------------------|--------------------------------------------------|
| `action`         | `action`           |           | `String`                      |                        | The URL to the form action. Example '/charges'.<br />If blank or undefined will not submit charges immediately. |
| `billingDetails` |                    |           | `stripe.BillingDetails`       |                        |                                                  |
| `brand`          | `brand`            | readonly  | `String`                      | null                   | The card brand detected by Stripe                |
| `card`           | `card`             | readonly  | `stripe.Element`              | null                   | The Stripe card object.                          |
| `element`        | `element`          | readonly  | `stripe.elements.Element`     | null                   | Stripe element instance                          |
| `elements`       | `elements`         | readonly  | `stripe.elements.Elements`    | null                   | Stripe Elements instance                         |
| `error`          | `error`            | readonly  | `Error\|stripe.Error`         | null                   | Stripe or validation error                       |
| `hasError`       | `has-error`        | readonly  | `Boolean`                     | false                  | Whether the element has an error                 |
| `hideIcon`       | `hide-icon`        |           | `Boolean`                     | false                  | Whether to hide icons in the Stripe form.        |
| `hidePostalCode` | `hide-postal-code` |           | `Boolean`                     | false                  | Whether or not to hide the postal code field.<br />Useful when you gather shipping info elsewhere. |
| `iconStyle`      | `icon-style`       |           | `'solid'\|'default'`          | "default"              | Stripe icon style. 'solid' or 'default'.         |
| `isComplete`     | `is-complete`      |           | `Boolean`                     | false                  | If the form is complete.                         |
| `isEmpty`        | `is-empty`         |           | `Boolean`                     | true                   | If the form is empty.                            |
| `label`          | `label`            |           | `String`                      | "Credit or Debit Card" | aria-label attribute for the credit card form.   |
| `publishableKey` | `publishable-key`  |           | `String`                      |                        | Stripe Publishable Key. EG. `pk_test_XXXXXXXXXXXXXXXXXXXXXXXX` |
| `showError`      | `show-error`       |           | `boolean`                     | false                  | Whether to display the error message             |
| `source`         | `source`           | readonly  | `stripe.Source`               | null                   | Stripe Source                                    |
| `sourceData`     |                    |           | `{ owner: stripe.OwnerData }` |                        | Data passed to stripe.createSource. (optional)   |
| `stripe`         | `stripe`           | readonly  | `stripe.Stripe`               | null                   | Stripe instance                                  |
| `stripeMount`    |                    | readonly  | `Element`                     |                        | Stripe Element mount point                       |
| `stripeReady`    | `stripe-ready`     |           | `Boolean`                     | false                  | If the stripe element is ready to receive focus. |
| `token`          | `token`            | readonly  | `stripe.Token`                | null                   | Stripe Token                                     |
| `tokenData`      |                    |           | `stripe.TokenOptions`         |                        | Data passed to stripe.createToken. (optional)    |
| `value`          | `value`            |           | `Object`                      | {}                     | Prefilled values for form. Example {postalCode: '90210'} |

#### Methods

| Method               | Type                                             | Description                                      |
|----------------------|--------------------------------------------------|--------------------------------------------------|
| `createSource`       | `(sourceData?: { owner: OwnerInfo; } \| undefined): Promise<SourceResponse>` | Submit payment information to generate a source  |
| `createToken`        | `(tokenData?: TokenData): Promise<TokenResponse>` | Submit payment information to generate a token   |
| `isPotentiallyValid` | `(): Boolean`                                    | Checks for potential validity. A potentially valid form is one that is not empty, not complete and has no error. A validated form also counts as potentially valid. |
| `reset`              | `(): void`                                       | Resets the Stripe card.                          |
| `validate`           | `(): Boolean`                                    | Checks if the Stripe form is valid.              |

#### Events

| Event                     | Description                                      |
|---------------------------|--------------------------------------------------|
| `brand-changed`           | The new value of brand                           |
| `card-changed`            | The new value of card                            |
| `error-changed`           | The new value of error                           |
| `has-error-changed`       | The new value of has-error                       |
| `is-complete-changed`     | The new value of is-complete                     |
| `is-empty-changed`        | The new value of is-empty                        |
| `payment-intent-changed`  | The new value of payment-intent                  |
| `payment-method-changed`  | The new value of payment-method                  |
| `publishable-key-changed` | The new value of publishable-key                 |
| `source-changed`          | The new value of source                          |
| `stripe-change`           | Stripe Element change event                      |
| `stripe-error`            | The validation error, or the error returned from stripe.com |
| `stripe-payment-intent`   | The PaymentIntent received from stripe.com       |
| `stripe-payment-method`   | The PaymentMethod received from stripe.com       |
| `stripe-ready`            | Stripe has been initialized and mounted          |
| `stripe-ready-changed`    | The new value of stripe-ready                    |
| `stripe-source`           | The Source received from stripe.com              |
| `stripe-token`            | The Token received from stripe.com               |
| `token-changed`           | The new value of token                           |

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

