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
    <template is="dom-bind">
      <next-code-block></next-code-block>
    </template>
  </template>
</custom-element-demo>
```
-->
```html
  <paper-input label="Stripe Publishable Key" value="{{key}}"></paper-input>
  <stripe-elements publishable-key="[[key]]" token="{{token}}"></stripe-elements>
  <show-json hide-copy-button json="[[token]]"></show-json>
```
