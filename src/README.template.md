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
