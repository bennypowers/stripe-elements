[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bennypowers/stripe-elements)

# \<stripe-elements\>

Polymer wrapper for Stripe.js v3 Elements. Creates a `card` element such as https://stripe.com/docs/elements

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
  <paper-input label="Stripe Publishable Key" value="{{key}}"></paper-input>
  <stripe-elements publishable-key="[[key]]" token="{{token}}"></stripe-elements>
  <show-json hide-copy-button json="[[token]]"></show-json>
```

## Styling

You can use the `--paper-button` mixin to apply styles to the submit button, e.g.

```css
stripe-elements {
  --paper-button: {
    background-color: blue;
    color: white;
  }
}
```

A word about nomenclature before we list custom properties and mixins. Stripe v3
Introduces 'Stripe Elements'. These are not custom elements, but rather forms
hosted by stripe and injected into your page via an iFrame. When we refer to the
'Stripe Element' in this document, we are referring to the hosted Stripe form,
not the `<stripe-element>` custom element.

The following custom properties and mixins are available for styling:

| Custom property | Description | Default |
| --- | --- | --- |
| `--stripe-elements-element` | Mixin applied to the Stripe Element | {} |
| `--stripe-elements-element-focus` | Mixin applied to the Stripe Element in its focussed state. | {} |
| `--stripe-elements-element-invalid` | Mixin applied to the Stripe Element in ins invalid state | {} |
| `--stripe-elements-element-webkit-autofill | Mixin applied to the Stripe Element's webkit autofill. | {} |
|
| `--stripe-elements-base-color` | Base styles are inherited by all other variants | '' |
| `--stripe-elements-base-color-font-family` | Base styles are inherited by all other variants | '' |
| `--stripe-elements-base-font-size` | Base styles are inherited by all other variants | '' |
| `--stripe-elements-base-font-smoothing` | Base styles are inherited by all other variants | '' |
| `--stripe-elements-base-font-variant` | Base styles are inherited by all other variants | '' |
| `--stripe-elements-base-icon-color` | Base styles are inherited by all other variants | '' |
| `--stripe-elements-base-line-height` | Base styles are inherited by all other variants | '' |
| `--stripe-elements-base-letter-spacing` | Base styles are inherited by all other variants | '' |
| `--stripe-elements-base-text-decoration` | Base styles are inherited by all other variants | '' |
| `--stripe-elements-base-text-shadow` | Base styles are inherited by all other variants | '' |
| `--stripe-elements-base-text-transform` | Base styles are inherited by all other variants | '' |
| `--stripe-elements-complete-color` | Applied when the Stripe Element has valid input | '' |
| `--stripe-elements-complete-color-font-family` | Applied when the Stripe Element has valid input | '' |
| `--stripe-elements-complete-font-size` | Applied when the Stripe Element has valid input | '' |
| `--stripe-elements-complete-font-smoothing` | Applied when the Stripe Element has valid input | '' |
| `--stripe-elements-complete-font-variant` | Applied when the Stripe Element has valid input | '' |
| `--stripe-elements-complete-icon-color` | Applied when the Stripe Element has valid input | '' |
| `--stripe-elements-complete-line-height` | Applied when the Stripe Element has valid input | '' |
| `--stripe-elements-complete-letter-spacing` | Applied when the Stripe Element has valid input | '' |
| `--stripe-elements-complete-text-decoration` | Applied when the Stripe Element has valid input | '' |
| `--stripe-elements-complete-text-shadow` | Applied when the Stripe Element has valid input | '' |
| `--stripe-elements-complete-text-transform` | Applied when the Stripe Element has valid input | '' |
| `--stripe-elements-empty-color` | Applied when the Stripe Element has no user input | '' |
| `--stripe-elements-empty-color-font-family` | Applied when the Stripe Element has no user input | '' |
| `--stripe-elements-empty-font-size` | Applied when the Stripe Element has no user input | '' |
| `--stripe-elements-empty-font-smoothing` | Applied when the Stripe Element has no user input | '' |
| `--stripe-elements-empty-font-variant` | Applied when the Stripe Element has no user input | '' |
| `--stripe-elements-empty-icon-color` | Applied when the Stripe Element has no user input | '' |
| `--stripe-elements-empty-line-height` | Applied when the Stripe Element has no user input | '' |
| `--stripe-elements-empty-letter-spacing` | Applied when the Stripe Element has no user input | '' |
| `--stripe-elements-empty-text-decoration` | Applied when the Stripe Element has no user input | '' |
| `--stripe-elements-empty-text-shadow` | Applied when the Stripe Element has no user input | '' |
| `--stripe-elements-empty-text-transform` | Applied when the Stripe Element has no user input | '' |
| `--stripe-elements-invalid-color` | Applied when the Stripe Element has invalid input | '' |
| `--stripe-elements-invalid-color-font-family` | Applied when the Stripe Element has invalid input | '' |
| `--stripe-elements-invalid-font-size` | Applied when the Stripe Element has invalid input | '' |
| `--stripe-elements-invalid-font-smoothing` | Applied when the Stripe Element has invalid input | '' |
| `--stripe-elements-invalid-font-variant` | Applied when the Stripe Element has invalid input | '' |
| `--stripe-elements-invalid-icon-color` | Applied when the Stripe Element has invalid input | '' |
| `--stripe-elements-invalid-line-height` | Applied when the Stripe Element has invalid input | '' |
| `--stripe-elements-invalid-letter-spacing` | Applied when the Stripe Element has invalid input | '' |
| `--stripe-elements-invalid-text-decoration` | Applied when the Stripe Element has invalid input | '' |
| `--stripe-elements-invalid-text-shadow` | Applied when the Stripe Element has invalid input | '' |
| `--stripe-elements-invalid-text-transform` | Applied when the Stripe Element has invalid input | '' |
