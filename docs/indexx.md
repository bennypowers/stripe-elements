---
layout: layout-docs.njk
title: <stripe-elements>
publishableKey: pk_test_XXXXXXXXXXXXXXXXXXXXXXXX
parameters:
  component: stripe-elements
---

# `<stripe-elements>` Web Component

The `<stripe-elements>` custom element is an easy way to use stripe.js in your web app,
across [frameworks](/?path=/docs/framework-examples-angular--stripe-elements), or inside shadow roots.
Add the element to your page with the `publishable-key` attribute set to your
[Stripe publishable key](https://dashboard.stripe.com/account/apikeys).
You can also set the `publishableKey` DOM property using JavaScript.

<mwc-textfield outlined data-arg="publishableKey" label="Publishable Key"></mwc-textfield>

> **Careful!** never add your **secret key** to an HTML page, only publish your **publishable key**.

Once you've set the `publishable-key` attribute (or the `publishableKey` DOM property), Stripe will create a Stripe Card Element on your page.

## Accepting Payments

Fill out some payment information here, then choose the type of payment object you'd like to generate.

Once you're set your publishable key and Stripe has instantiated (listen for the `ready` event if you need to know exactly when this happens),
you may generate a token from the filled-out form by calling the `createToken()` method.

<mwc-textfield outlined label="Cardholder Name" value="Mr. Man"></mwc-textfield>
<mwc-textfield outlined label="Cardholder Email" value="mr@man.email"></mwc-textfield>
<mwc-textfield outlined label="Cardholder Phone" value="555 555 5555"></mwc-textfield>

<stripe-elements publishable-key="{{ publishableKey }}"></stripe-elements>

<mwc-button data-generate="payment-method" label="Generate a PaymentMethod"></mwc-button>
<mwc-button data-generate="source" label="Generate a Source"></mwc-button>
<mwc-button data-generate="token" label="Generate a Token"></mwc-button>


<mwc-dialog>
  <json-viewer></json-viewer>
  <mwc-button slot="primaryAction" dialogAction="cancel">OK</mwc-button>
</mwc-dialog>

## Validation and Styling

`<stripe-elements>` has a `show-error` boolean attribute which will display the error message for you.
This is useful for simple validation in cases where you don't need to build your own validation UI.

```html
<stripe-elements publishable-key="should-error-use-bad-key"
                 show-error></stripe-elements>
```

<iframe src="/frames/show-error/"></iframe>

### Custom Validation

`<stripe-elements>` comes with several properties, events, and methods for validation.
Listen for the `change` and `error` events and check the `complete`, `empty`, `error`, and `invalid`
properties to react to validation changes.

These states reflect as attributes, so you can use CSS to style your element in its various states.

Use the `stripe` and `error` [CSS Shadow Parts](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)
to style the element as needed. If your target browsers don't yet support shadow parts,
You can still configure the element somewhat using the exposed CSS Custom Properties,
see the README for more information.

``` css
stripe-elements::part(stripe) {
  border-radius: 4px;
  border: 1px solid var(--theme-primary);
  box-shadow: none;
  height: 36px;
  display: flex;
  flex-flow: column;
  justify-content: center;
}

stripe-elements[complete]::part(stripe) {
  border-color: var(--success);
}

stripe-elements[invalid]::part(stripe) {
  border-color: var(--warning);
}

stripe-elements[error]::part(stripe) {
  border-color: var(--error);
}

stripe-elements::part(error) {
  text-align: right;
  color: var(--text);
}
```

<iframe data-update-key src="/frames/custom-validation/" height="120px"></iframe>

## Automatically Posting the Payment Info

For simple integrations, you can automatically post the source or token to your backend by setting the `action` property

**NOTE**: For this demo, we've overridden `window.fetch` to return a mocked response with the text body "A-OK!".

```html
<stripe-elements publishable-key="{{ publishableKey }}"
    generate="token"
    action="/my-endpoint"
></stripe-elements>
```
<iframe data-update-key src="/frames/automatically-posting/"></iframe>

## API

<sb-props of="stripe-elements"></sb-props>
