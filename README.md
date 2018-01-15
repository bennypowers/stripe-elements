[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bennypowers/stripe-elements)

# \<stripe-elements\>

Polymer wrapper for Stripe.js v3 Elements. Creates a `card` element à la https://stripe.com/docs/elements

## Note Before Using

You should make sure to load stripe.js on your app's index.html, as per Stripe's recommendation, before loading `<stripe-elements>`. If `window.Stripe` is not available when you load up the component, it will fail with a reasonably-polite console warning.

## Usage
<!--
```
<custom-element-demo>
  <template>
    <link rel="import" href="../paper-input/paper-input.html">
    <link rel="import" href="../show-json/show-json.html">
    <link rel="import" href="stripe-elements.html">
    <body>
      <template is="dom-bind">
        <next-code-block></next-code-block>
      </template>
    </body>
  </template>
</custom-element-demo>
```
-->
```html
  <script src="https://js.stripe.com/v3/"></script>
  <paper-input label="Stripe Publishable Key" value="{{key}}"></paper-input>
  <stripe-elements id="stripe"
      publishable-key="[[key]]"
      token="{{token}}"
  ></stripe-elements>
  <paper-button disabled="[[!key]]" onclick="stripe.submit()"></paper-button>
  <show-json hide-copy-button json="[[token]]"></show-json>
```

## Styling

A word about nomenclature before we list custom properties and mixins. Stripe v3
Introduces 'Stripe Elements'. These are not custom elements, but rather forms
hosted by stripe and injected into your page via an iFrame. When we refer to the
'Stripe Element' in this document, we are referring to the hosted Stripe form,
not the `<stripe-element>` custom element.

The following custom properties and mixins are available for styling the `<stripe-elements>` component:

| Custom property | Description | Default |
| --- | --- | --- |
| `--stripe-elements-width` | Min-width of the stripe-element | 300px |
| `--stripe-elements-element` | Mixin applied to the Stripe Element | {} |
| `--stripe-elements-element-focus` | Mixin applied to the Stripe Element in its focused state. | {} |
| `--stripe-elements-element-invalid` | Mixin applied to the Stripe Element in its invalid state | {} |
| `--stripe-elements-element-webkit-autofill` | Mixin applied to the Stripe Element's webkit autofill. | {} |

When you apply CSS to the custom properties below, they're parsed and sent to Stripe, who should apply them to the Stripe Element they return in the iFrame.  

`base` styles are inherited by all other variants.  
`complete` styles are applied when the Stripe Element has valid input.  
`empty` styles are applied when the Stripe Element has no user input.  
`invalid` styles are applied when the Stripe Element has invalid input.

| Custom property |
| --- |
| `--stripe-elements-base-color` |
| `--stripe-elements-base-font-family` |
| `--stripe-elements-base-font-size` |
| `--stripe-elements-base-font-smoothing` |
| `--stripe-elements-base-font-variant` |
| `--stripe-elements-base-icon-color` |
| `--stripe-elements-base-line-height` |
| `--stripe-elements-base-letter-spacing` |
| `--stripe-elements-base-text-decoration` |
| `--stripe-elements-base-text-shadow` |
| `--stripe-elements-base-text-transform` |
| `--stripe-elements-complete-color` |
| `--stripe-elements-complete-font-family` |
| `--stripe-elements-complete-font-size` |
| `--stripe-elements-complete-font-smoothing` |
| `--stripe-elements-complete-font-variant` |
| `--stripe-elements-complete-icon-color` |
| `--stripe-elements-complete-line-height` |
| `--stripe-elements-complete-letter-spacing` |
| `--stripe-elements-complete-text-decoration` |
| `--stripe-elements-complete-text-shadow` |
| `--stripe-elements-complete-text-transform` |
| `--stripe-elements-empty-color` |
| `--stripe-elements-empty-font-family` |
| `--stripe-elements-empty-font-size` |
| `--stripe-elements-empty-font-smoothing` |
| `--stripe-elements-empty-font-variant` |
| `--stripe-elements-empty-icon-color` |
| `--stripe-elements-empty-line-height` |
| `--stripe-elements-empty-letter-spacing` |
| `--stripe-elements-empty-text-decoration` |
| `--stripe-elements-empty-text-shadow` |
| `--stripe-elements-empty-text-transform` |
| `--stripe-elements-invalid-color` |
| `--stripe-elements-invalid-font-family` |
| `--stripe-elements-invalid-font-size` |
| `--stripe-elements-invalid-font-smoothing` |
| `--stripe-elements-invalid-font-variant` |
| `--stripe-elements-invalid-icon-color` |
| `--stripe-elements-invalid-line-height` |
| `--stripe-elements-invalid-letter-spacing` |
| `--stripe-elements-invalid-text-decoration` |
| `--stripe-elements-invalid-text-shadow` |
| `--stripe-elements-invalid-text-transform` |
