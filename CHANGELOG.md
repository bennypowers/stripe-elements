## [2.3.6](https://github.com/bennypowers/stripe-elements/compare/v2.3.5...v2.3.6) (2020-04-22)


### Bug Fixes

* migrate to typescript ([1b63924](https://github.com/bennypowers/stripe-elements/commit/1b6392418739a065984e431689dccb632b816819))

## [2.3.5](https://github.com/bennypowers/stripe-elements/compare/v2.3.4...v2.3.5) (2020-02-25)


### Bug Fixes

* update and unpatch notify mixin ([f346dd6](https://github.com/bennypowers/stripe-elements/commit/f346dd6dadce93f03e1dd1462e708f64ec4ec987))

## [2.3.4](https://github.com/bennypowers/stripe-elements/compare/v2.3.3...v2.3.4) (2020-02-24)


### Bug Fixes

* some notifying props now fire changed events properly ([1046da6](https://github.com/bennypowers/stripe-elements/commit/1046da6076059a96508c55cba650b3f73c037598))

## [2.3.3](https://github.com/bennypowers/stripe-elements/compare/v2.3.2...v2.3.3) (2020-02-13)


### Bug Fixes

* unmount element when disconnected from the DOM ([1330f45](https://github.com/bennypowers/stripe-elements/commit/1330f45493ad7568aeb2f2759a60ef9857e831a7))

## [2.3.2](https://github.com/bennypowers/stripe-elements/compare/v2.3.1...v2.3.2) (2020-02-09)


### Bug Fixes

* shadow breadcrumbs use tag name ([6e21421](https://github.com/bennypowers/stripe-elements/commit/6e214215c02ddd4007a445d56189c2207326c743)), closes [#33](https://github.com/bennypowers/stripe-elements/issues/33)

## [2.3.1](https://github.com/bennypowers/stripe-elements/compare/v2.3.0...v2.3.1) (2020-02-08)


### Bug Fixes

* patch types to extend LitElement properly ([6b2e8cf](https://github.com/bennypowers/stripe-elements/commit/6b2e8cfa82b7ac0de4a2fed087afc20c4389d72b))

# [2.3.0](https://github.com/bennypowers/stripe-elements/compare/v2.2.4...v2.3.0) (2020-01-29)


### Bug Fixes

* prevent typeerror if payment is unsupported ([d9f1146](https://github.com/bennypowers/stripe-elements/commit/d9f11468f35ccc9343f7a935f3b7936327a68d0c))


### Features

* **payment-request:** add `unsupported` event ([de6555b](https://github.com/bennypowers/stripe-elements/commit/de6555b1879602481930360d491057ed7ce0485f))

## [2.2.4](https://github.com/bennypowers/stripe-elements/compare/v2.2.3...v2.2.4) (2020-01-29)


### Bug Fixes

* more semantic HTML for error output ([21443f5](https://github.com/bennypowers/stripe-elements/commit/21443f5836e851e308eb5d72a6fcbaf1376a5d1d))
* unmount element before removing mountpoints when initializing ([8f2dd6f](https://github.com/bennypowers/stripe-elements/commit/8f2dd6f179e494fbff0e6c9f253fbb13f632682b))

## [2.2.3](https://github.com/bennypowers/stripe-elements/compare/v2.2.2...v2.2.3) (2020-01-27)


### Bug Fixes

* fix patch-package script ([e347aaa](https://github.com/bennypowers/stripe-elements/commit/e347aaa183cef7604f00e192dd3a9da05e41f272))



## [2.2.2](https://github.com/bennypowers/stripe-elements/compare/v2.2.1...v2.2.2) (2020-01-27)


### Bug Fixes

* fix typescript typings ([f3cb81e](https://github.com/bennypowers/stripe-elements/commit/f3cb81ed864fc5f5548c9236b82d1d075c5357fc))



## [2.2.1](https://github.com/bennypowers/stripe-elements/compare/v2.2.0...v2.2.1) (2020-01-25)


### Bug Fixes

* export ts typings ([487c04c](https://github.com/bennypowers/stripe-elements/commit/487c04c17d7bebf50b6b3f8e575de6a46b8e2349))



# [2.2.0](https://github.com/bennypowers/stripe-elements/compare/v2.1.1...v2.2.0) (2020-01-25)


### Bug Fixes

* clear the element when calling `reset` ([3b8bc61](https://github.com/bennypowers/stripe-elements/commit/3b8bc61e56c9f10f46a423f5110981899b761c8d))
* improve error message for empty card ([fa17b60](https://github.com/bennypowers/stripe-elements/commit/fa17b60874f42521895bb74b424314fbadfae36a))


### Features

* add `stripe` and `error` css shadow parts. ([46013a2](https://github.com/bennypowers/stripe-elements/commit/46013a239e8aee38411fe4fcb6f802955eebdfe0))
* add stripe-payment-request element ([32cdd0d](https://github.com/bennypowers/stripe-elements/commit/32cdd0d54e1fef3e81c6c222ac1ab2cc1735d57b))
* adds ready and focused propertie; blur and focus methods ([26f6e2a](https://github.com/bennypowers/stripe-elements/commit/26f6e2af6d083cfccb6face2372a1a74318b8696))
* reflect error message to attr ([bf3df77](https://github.com/bennypowers/stripe-elements/commit/bf3df779ec1cd47d3402221b3079be77f5f96ee7))
* **stripe-elements:** add `ready` readOnly notifying prop ([279d603](https://github.com/bennypowers/stripe-elements/commit/279d6032dc5958a70b958aace24cdd5c3f318fdc))
* **stripe-elements:** adds `complete`, `empty`, & `invalid` properties ([b7c3f12](https://github.com/bennypowers/stripe-elements/commit/b7c3f12d7f833a49bc42b7a11b7255d28a706d00))



## [2.1.1](https://github.com/bennypowers/stripe-elements/compare/v2.1.0...v2.1.1) (2020-01-21)


### Bug Fixes

* events bubble ([e68f25c](https://github.com/bennypowers/stripe-elements/commit/e68f25c495d67e7d01a88d2a595b16e2770ee4b7))
* when `action` property is set auto-POSTs payment info to URL ([35f0502](https://github.com/bennypowers/stripe-elements/commit/35f0502f2546f6c7e3dbe66ae6941a744a661a4e))



# [2.1.0](https://github.com/bennypowers/stripe-elements/compare/v2.0.2...v2.1.0) (2020-01-20)


### Features

* add createPaymentMethod method ([9639e10](https://github.com/bennypowers/stripe-elements/commit/9639e1095356f59a3d2680d2dae31e93b06452c3))
* add submit method and generate attribute ([b866405](https://github.com/bennypowers/stripe-elements/commit/b866405000a819d9135a27a0d65f5dcdcbcb1a50))



## [2.0.2](https://github.com/bennypowers/stripe-elements/compare/v2.0.1...v2.0.2) (2020-01-19)


### Bug Fixes

* fix DOM rebuilding for broken light slot template ([56b6a69](https://github.com/bennypowers/stripe-elements/commit/56b6a69c8d0966b93859b40b90a670db86e79130))



## [2.0.1](https://github.com/bennypowers/stripe-elements/compare/v2.0.0...v2.0.1) (2020-01-06)


### Bug Fixes

* instantiating with a key no longer breaks tree walking ([0ab1a56](https://github.com/bennypowers/stripe-elements/commit/0ab1a5610c5f0bbf77abe71403d4a1fba349a7d3))


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
