# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0](https://github.com/bennypowers/stripe-elements/compare/v1.1.2...v2.0.0) (2019-12-22)


### ⚠ BREAKING CHANGES

* removes `submit` method

Before:
```js
submitButton.addEventListener('click', () => stripeElements.submit())
```

After:
```js
getTokenButton.addEventListener('click', () => stripeElements.createToken())
getSourceButton.addEventListener('click', () =>
stripeElements.createSource())
```
* removes error display unless show-error is set.

Previously, stripe elements would display the error message within it's
shadow DOM. To continue to use that feature, set
```html
<stripe-elements show-error></stripe-elements>
```

Also adds a `error` CSS Shadow Part

```css
stripe-elements::part(error) {
  font-color: red;
}
```

### Features

* add createSource method ([5cc03ab](https://github.com/bennypowers/stripe-elements/commit/5cc03ab10eece1b2dd17f7409c62fbb618e89ed2))
* add data param to createToken & createSouce ([5a1b043](https://github.com/bennypowers/stripe-elements/commit/5a1b043109b1c140bc69cec504de368dbab38741))
* add show-error boolean attribute ([6fedf77](https://github.com/bennypowers/stripe-elements/commit/6fedf77d065a9f3ccb2004702599427297071aaa))


### Bug Fixes

* set validation state initially ([b4b2b0b](https://github.com/bennypowers/stripe-elements/commit/b4b2b0be9b4731c1a087307796e7637a1def2fa3))
