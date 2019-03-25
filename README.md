[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bennypowers/stripe-elements)
[![Published on npm](https://img.shields.io/npm/v/@power-elements/stripe-elements.svg)](https://www.npmjs.com/package/@power-elements/stripe-elements)
[![Contact me on Codementor](https://cdn.codementor.io/badges/contact_me_github.svg)](https://www.codementor.io/bennyp?utm_source=github&utm_medium=button&utm_term=bennyp&utm_campaign=github)
[![Maintainability](https://api.codeclimate.com/v1/badges/b2205a301b0a8bb82d51/maintainability)](https://codeclimate.com/github/bennypowers/stripe-elements/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/b2205a301b0a8bb82d51/test_coverage)](https://codeclimate.com/github/bennypowers/stripe-elements/test_coverage)
[![CircleCI](https://circleci.com/gh/bennypowers/stripe-elements.svg?style=svg)](https://circleci.com/gh/bennypowers/stripe-elements)

# `<stripe-elements>`

Custom element wrapper for Stripe.js v3 Elements that works in shadow DOM. Creates a `card` element à la https://stripe.com/docs/elements

👨‍🎨 [Storybook Demo](https://bennypowers.dev/stripe-elements) 👀

## Installation
```
npm i -S @power-elements/stripe-elements
npx @pika/web
```

## Usage
You should make sure to load stripe.js on your app's index.html, as per Stripe's recommendation, before loading `<stripe-elements>`. If `window.Stripe` is not available when you load up the component, it will fail with a reasonably-polite console warning.

```html
<script src="https://js.stripe.com/v3/"></script>
```

Then you can add the element to your page.

```html
<script type="module" src="/web_modules/@power-elements/stripe-elements/stripe-elements.js"></script>
<stripe-elements id="stripe" action="/payment"></stripe-elements>
<button id="submit" disabled>Submit</button>
<script>
  submit.onclick = () => stripe.validate() && stripe.submit();
  stripe.addEventListener('change', function onChange() {
    button.disabled = !this.validate()
  })
</script>
```

In a lit-html template

```js
import { html, render } from '/web_modules/lit-html/lit-html.js';
import { PUBLISHABLE_KEY } from './config.js';
import '/web_modules/@power-elements/stripe-elements/stripe-elements.js';

const onChange = ({ target: { isComplete, hasError } }) => {
  document.body.querySelector('button').disabled = !(isComplete && !hasError)
}

const onClick = () => document.getElementById('stripe').submit();

const template = html`
  <button disabled @click="${onClick}">Get Token</button>
  <stripe-elements id="stripe"
      @stripe-change="${onChange}"
      publishable-key="${PUBLISHABLE_KEY}"
      action="/payment"
  ></stripe-elements>
`
render(template, document.body)
```

In a Polymer Template

```html
<paper-input label="Stripe Publishable Key" value="{{key}}"></paper-input>

<stripe-elements id="stripe"
    stripe-ready="{{ready}}"
    publishable-key="[[key]]"
    token="{{token}}"
></stripe-elements>

<paper-button id="submit"
    disabled="[[!ready]]"
    onclick="stripe.submit()">
  Get Token
</paper-button>

<paper-toast
    opened="[[token]]"
    text="Token received for 💳 [[token.card.last4]]! 🤑"
></paper-toast>
```

## Styling

A word about nomenclature before we list custom properties and mixins. Stripe v3
Introduces 'Stripe Elements'. These are not custom elements, but rather forms
hosted by stripe and injected into your page via an iFrame. When we refer to the
'Stripe Element' in this document, we are referring to the hosted Stripe form,
not the `<stripe-element>` custom element. But when I mentions the 'element', I mean the custom element.

The following custom properties are available for styling the `<stripe-elements>` component:

| Custom property | Description | Default |
| --- | --- | --- |
| `--stripe-elements-width` | Min-width of the element | `300px` |
| `--stripe-elements-height` | Min-width of the element | `50px` |
| `--stripe-elements-element-padding` | Padding for the element | `14px` |
| `--stripe-elements-element-background` | Background for the element | `initial` |

When you apply CSS to the custom properties below, they're parsed and sent to Stripe, who should apply them to the Stripe Element they return in the iFrame.  

- `base` styles are inherited by all other variants.  
- `complete` styles are applied when the Stripe Element has valid input.  
- `empty` styles are applied when the Stripe Element has no user input.  
- `invalid` styles are applied when the Stripe Element has invalid input.

There are 11 properties for each state that you can set which will be read into the Stripe Element iFrame:

- `--stripe-elements-base-color`
- `--stripe-elements-base-font-family`
- `--stripe-elements-base-font-size`
- `--stripe-elements-base-font-smoothing`
- `--stripe-elements-base-font-variant`
- `--stripe-elements-base-icon-color`
- `--stripe-elements-base-line-height`
- `--stripe-elements-base-letter-spacing`
- `--stripe-elements-base-text-decoration`
- `--stripe-elements-base-text-shadow`
- `--stripe-elements-base-text-transform`

and likewise `--stripe-elements-complete-color`, etc.
