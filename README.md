## `./stripe-elements.js`:

### class: `StripeElements`, `stripe-elements`

#### Superclass

| Name         | Module             | Package |
| ------------ | ------------------ | ------- |
| `StripeBase` | /src/StripeBase.js |         |

#### Static Fields

| Name          | Privacy | Type     | Default             | Description | Inherited From |
| ------------- | ------- | -------- | ------------------- | ----------- | -------------- |
| `is`          |         | `string` | `'stripe-elements'` |             |                |
| `elementType` |         | `string` | `'card'`            |             |                |

#### Fields

| Name             | Privacy | Type                                           | Default     | Description                                                                                                         | Inherited From |
| ---------------- | ------- | ---------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------- | -------------- |
| `hideIcon`       |         | `boolean`                                      | `false`     | Whether to hide icons in the Stripe form.                                                                           |                |
| `hidePostalCode` |         | `boolean`                                      | `false`     | Whether or not to hide the postal code field.&#xA;Useful when you gather shipping info elsewhere.                   |                |
| `iconStyle`      |         | `stripe.elements.ElementsOptions['iconStyle']` | `'default'` | Stripe icon style.                                                                                                  |                |
| `value`          |         | `stripe.elements.ElementsOptions['value']`     | `{}`        | Prefilled values for form.                                                                                          |                |
| `brand`          |         | `stripe.brandType`                             | `null`      | The card brand detected by Stripe                                                                                   |                |
| `complete`       |         | `boolean`                                      | `false`     | Whether the form is complete.                                                                                       |                |
| `empty`          |         | `boolean`                                      | `true`      | If the form is empty.                                                                                               |                |
| `invalid`        |         | `boolean`                                      | `false`     | Whether the form is invalid.                                                                                        |                |
| `card`           |         | `stripe.elements.Element`                      | `null`      | The Stripe card object.&#xA;\*\*DEPRECATED\*\*. Will be removed in a future version. use \`element\` instead        |                |
| `isEmpty`        |         | `boolean`                                      | `true`      | Whether the form is empty.&#xA;\*\*DEPRECATED\*\*. Will be removed in a future version. use \`empty\` instead       |                |
| `isComplete`     |         | `boolean`                                      | `false`     | Whether the form is complete.&#xA;\*\*DEPRECATED\*\*. Will be removed in a future version. use \`complete\` instead |                |

#### Methods

| Name                  | Privacy | Description                                                                                                                                                         | Parameters                                    | Return                                  | Inherited From |
| --------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | --------------------------------------- | -------------- |
| `createPaymentMethod` | public  | Submit payment information to generate a paymentMethod                                                                                                              | `paymentMethodData: stripe.PaymentMethodData` | `Promise<stripe.PaymentMethodResponse>` |                |
| `createSource`        | public  | Submit payment information to generate a source                                                                                                                     | `sourceData: stripe.SourceOptions`            | `Promise<stripe.SourceResponse>`        |                |
| `createToken`         | public  | Submit payment information to generate a token                                                                                                                      | `tokenData: stripe.TokenOptions`              | `Promise<stripe.TokenResponse>`         |                |
| `isPotentiallyValid`  | public  | Checks for potential validity. A potentially valid form is one that is not empty, not complete and has no error. A validated form also counts as potentially valid. |                                               | `boolean`                               |                |
| `reset`               | public  | Resets the Stripe card.                                                                                                                                             |                                               | `void`                                  |                |
| `submit`              | public  | Generates a payment representation of the type specified by \`generate\`.                                                                                           |                                               | `Promise<StripePaymentResponse>`        |                |
| `validate`            | public  | Checks if the Stripe form is valid.                                                                                                                                 |                                               | `boolean`                               |                |

#### Events

| Name       | Type | Description                 | Inherited From |
| ---------- | ---- | --------------------------- | -------------- |
| `'change'` |      | Stripe Element change event |                |

#### Attributes

| Name               | Field          | Inherited From |
| ------------------ | -------------- | -------------- |
| `hide-icon`        | hideIcon       |                |
| `hide-postal-code` | hidePostalCode |                |
| `icon-style`       | iconStyle      |                |
| `value`            | value          |                |
| `brand`            | brand          |                |
| `complete`         | complete       |                |
| `empty`            | empty          |                |
| `invalid`          | invalid        |                |
| `card`             | card           |                |
| `is-empty`         | isEmpty        |                |
| `is-complete`      | isComplete     |                |

#### CSS Properties

| Name                                         | Default                       | Description                                                        |
| -------------------------------------------- | ----------------------------- | ------------------------------------------------------------------ |
| `--stripe-elements-border-radius`            | `` `4px` ``                   | border radius of the element container                             |
| `--stripe-elements-border`                   | `` `1px solid transparent` `` | border property of the element container                           |
| `--stripe-elements-box-shadow`               | `` `0 1px 3px 0 #e6ebf1` ``   | box shadow for the element container                               |
| `--stripe-elements-transition`               | `` `box-shadow 150ms ease` `` | transition property for the element container                      |
| `--stripe-elements-base-color`               |                               | \`color\` property for the element in its base state               |
| `--stripe-elements-base-font-family`         |                               | \`font-family\` property for the element in its base state         |
| `--stripe-elements-base-font-size`           |                               | \`font-size\` property for the element in its base state           |
| `--stripe-elements-base-font-smoothing`      |                               | \`font-smoothing\` property for the element in its base state      |
| `--stripe-elements-base-font-variant`        |                               | \`font-variant\` property for the element in its base state        |
| `--stripe-elements-base-icon-color`          |                               | \`icon-color\` property for the element in its base state          |
| `--stripe-elements-base-line-height`         |                               | \`line-height\` property for the element in its base state         |
| `--stripe-elements-base-letter-spacing`      |                               | \`letter-spacing\` property for the element in its base state      |
| `--stripe-elements-base-text-decoration`     |                               | \`text-decoration\` property for the element in its base state     |
| `--stripe-elements-base-text-shadow`         |                               | \`text-shadow\` property for the element in its base state         |
| `--stripe-elements-base-text-transform`      |                               | \`text-transform\` property for the element in its base state      |
| `--stripe-elements-complete-color`           |                               | \`color\` property for the element in its complete state           |
| `--stripe-elements-complete-font-family`     |                               | \`font-family\` property for the element in its complete state     |
| `--stripe-elements-complete-font-size`       |                               | \`font-size\` property for the element in its complete state       |
| `--stripe-elements-complete-font-smoothing`  |                               | \`font-smoothing\` property for the element in its complete state  |
| `--stripe-elements-complete-font-variant`    |                               | \`font-variant\` property for the element in its complete state    |
| `--stripe-elements-complete-icon-color`      |                               | \`icon-color\` property for the element in its complete state      |
| `--stripe-elements-complete-line-height`     |                               | \`line-height\` property for the element in its complete state     |
| `--stripe-elements-complete-letter-spacing`  |                               | \`letter-spacing\` property for the element in its complete state  |
| `--stripe-elements-complete-text-decoration` |                               | \`text-decoration\` property for the element in its complete state |
| `--stripe-elements-complete-text-shadow`     |                               | \`text-shadow\` property for the element in its complete state     |
| `--stripe-elements-complete-text-transform`  |                               | \`text-transform\` property for the element in its complete state  |
| `--stripe-elements-empty-color`              |                               | \`color\` property for the element in its empty state              |
| `--stripe-elements-empty-font-family`        |                               | \`font-family\` property for the element in its empty state        |
| `--stripe-elements-empty-font-size`          |                               | \`font-size\` property for the element in its empty state          |
| `--stripe-elements-empty-font-smoothing`     |                               | \`font-smoothing\` property for the element in its empty state     |
| `--stripe-elements-empty-font-variant`       |                               | \`font-variant\` property for the element in its empty state       |
| `--stripe-elements-empty-icon-color`         |                               | \`icon-color\` property for the element in its empty state         |
| `--stripe-elements-empty-line-height`        |                               | \`line-height\` property for the element in its empty state        |
| `--stripe-elements-empty-letter-spacing`     |                               | \`letter-spacing\` property for the element in its empty state     |
| `--stripe-elements-empty-text-decoration`    |                               | \`text-decoration\` property for the element in its empty state    |
| `--stripe-elements-empty-text-shadow`        |                               | \`text-shadow\` property for the element in its empty state        |
| `--stripe-elements-empty-text-transform`     |                               | \`text-transform\` property for the element in its empty state     |
| `--stripe-elements-invalid-color`            |                               | \`color\` property for the element in its invalid state            |
| `--stripe-elements-invalid-font-family`      |                               | \`font-family\` property for the element in its invalid state      |
| `--stripe-elements-invalid-font-size`        |                               | \`font-size\` property for the element in its invalid state        |
| `--stripe-elements-invalid-font-smoothing`   |                               | \`font-smoothing\` property for the element in its invalid state   |
| `--stripe-elements-invalid-font-variant`     |                               | \`font-variant\` property for the element in its invalid state     |
| `--stripe-elements-invalid-icon-color`       |                               | \`icon-color\` property for the element in its invalid state       |
| `--stripe-elements-invalid-line-height`      |                               | \`line-height\` property for the element in its invalid state      |
| `--stripe-elements-invalid-letter-spacing`   |                               | \`letter-spacing\` property for the element in its invalid state   |
| `--stripe-elements-invalid-text-decoration`  |                               | \`text-decoration\` property for the element in its invalid state  |
| `--stripe-elements-invalid-text-shadow`      |                               | \`text-shadow\` property for the element in its invalid state      |
| `--stripe-elements-invalid-text-transform`   |                               | \`text-transform\` property for the element in its invalid state   |

<details><summary>Private API</summary>

#### Fields

| Name       | Privacy   | Type       | Default | Description | Inherited From |
| ---------- | --------- | ---------- | ------- | ----------- | -------------- |
| `slotName` | protected | `SlotName` |         |             |                |

#### Methods

| Name                      | Privacy   | Description                                                                | Parameters                                     | Return                     | Inherited From |
| ------------------------- | --------- | -------------------------------------------------------------------------- | ---------------------------------------------- | -------------------------- | -------------- |
| `getPaymentMethodData`    | private   | Generates PaymentMethodData from the element.                              |                                                | `stripe.PaymentMethodData` |                |
| `getStripeElementsStyles` | private   | Returns a Stripe-friendly style object computed from CSS custom properties |                                                | `StripeStyleInit`          |                |
| `initElement`             | protected |                                                                            |                                                | `Promise<void>`            |                |
| `onChange`                | private   | Updates the element's state.                                               | `event: stripe.elements.ElementChangeResponse` | `Promise<void>`            |                |

</details>

<hr/>

### Exports

| Kind                        | Name              | Declaration    | Module               | Package |
| --------------------------- | ----------------- | -------------- | -------------------- | ------- |
| `js`                        | `StripeElements`  | StripeElements | ./stripe-elements.js |         |
| `custom-element-definition` | `stripe-elements` | StripeElements | ./stripe-elements.js |         |

## `./stripe-payment-request.js`:

### class: `StripePaymentRequest`, `stripe-payment-request`

#### Superclass

| Name         | Module             | Package |
| ------------ | ------------------ | ------- |
| `StripeBase` | /src/StripeBase.js |         |

#### Static Fields

| Name | Privacy | Type     | Default                    | Description | Inherited From |
| ---- | ------- | -------- | -------------------------- | ----------- | -------------- |
| `is` |         | `string` | `'stripe-payment-request'` |             |                |

#### Fields

| Name                | Privacy | Type                                         | Default     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Inherited From |
| ------------------- | ------- | -------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| `amount`            |         | `number`                                     |             | The amount in the currency's subunit (e.g. cents, yen, etc.)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |                |
| `canMakePayment`    |         | `CanMakePaymentType`                         | `null`      | Whether or not the device can make the payment request.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |                |
| `country`           |         | `CountryCode`                                |             | The two-letter country code of your Stripe account                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |                |
| `currency`          |         | `StripePaymentRequestOptions['currency']`    |             | Three character currency code                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |                |
| `displayItems`      |         | `DisplayItem[]`                              |             | An array of DisplayItem objects. These objects are shown as line items in the browser’s payment interface. Note that the sum of the line item amounts does not need to add up to the total amount above.                                                                                                                                                                                                                                                                                                                                                                             |                |
| `label`             |         | `string`                                     |             | A name that the browser shows the customer in the payment interface.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |                |
| `paymentIntent`     |         | `PaymentIntent`                              | `null`      | Stripe PaymentIntent                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |                |
| `paymentRequest`    |         | `stripe.paymentRequest.StripePaymentRequest` | `null`      | Stripe PaymentRequest                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |                |
| `pending`           |         | `boolean`                                    | `false`     | If you might change the payment amount later (for example, after you have calcluated shipping costs), set this to true. Note that browsers treat this as a hint for how to display things, and not necessarily as something that will prevent submission.                                                                                                                                                                                                                                                                                                                            |                |
| `requestPayerEmail` |         | `boolean`                                    |             | See the requestPayerName option.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |                |
| `requestPayerName`  |         | `boolean`                                    |             | By default, the browser‘s payment interface only asks the customer for actual payment information. A customer name can be collected by setting this option to true. This collected name will appears in the PaymentResponse object.&#xA;&#xA;We highly recommend you collect at least one of name, email, or phone as this also results in collection of billing address for Apple Pay. The billing address can be used to perform address verification and block fraudulent payments. For all other payment methods, the billing address is automatically collected when available. |                |
| `requestPayerPhone` |         | `boolean`                                    |             | See the requestPayerName option.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |                |
| `requestShipping`   |         | `boolean`                                    |             | Collect shipping address by setting this option to true. The address appears in the PaymentResponse.&#xA;You must also supply a valid \[ShippingOptions] to the shippingOptions property. This can be up front at the time stripe.paymentRequest is called, or in response to a shippingaddresschange event using the updateWith callback.                                                                                                                                                                                                                                           |                |
| `shippingOptions`   |         | `ShippingOption[]`                           |             | An array of ShippingOption objects. The first shipping option listed appears in the browser payment interface as the default option.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |                |
| `buttonType`        |         | `PaymentRequestButtonStyleOptions['type']`   | `'default'` |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                |
| `buttonTheme`       |         | `PaymentRequestButtonStyleOptions['theme']`  | `'dark'`    |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                |

#### Methods

| Name    | Privacy | Description | Parameters | Return | Inherited From |
| ------- | ------- | ----------- | ---------- | ------ | -------------- |
| `reset` | public  |             |            | `void` |                |

#### Events

| Name                      | Type | Description                                                        | Inherited From |
| ------------------------- | ---- | ------------------------------------------------------------------ | -------------- |
| `'unsupported'`           |      | When the element detects that the user agent cannot make a payment |                |
| `'fail'`                  |      | When a payment request fails                                       |                |
| `'cancel'`                |      | When a payment request is cancelled                                |                |
| `'shippingaddresschange'` |      | When the user chooses a different shipping address                 |                |
| `'shippingoptionchange'`  |      | When the user chooses a different shipping option                  |                |

#### Attributes

| Name                  | Field             | Inherited From |
| --------------------- | ----------------- | -------------- |
| `amount`              | amount            |                |
| `can-make-payment`    | canMakePayment    |                |
| `country`             | country           |                |
| `currency`            | currency          |                |
| `displayItems`        | displayItems      |                |
| `label`               | label             |                |
| `payment-intent`      | paymentIntent     |                |
| `payment-request`     | paymentRequest    |                |
| `pending`             | pending           |                |
| `request-payer-email` | requestPayerEmail |                |
| `request-payer-name`  | requestPayerName  |                |
| `request-payer-phone` | requestPayerPhone |                |
| `request-shipping`    | requestShipping   |                |
| `shippingOptions`     | shippingOptions   |                |
| `button-type`         | buttonType        |                |
| `button-theme`        | buttonTheme       |                |

#### CSS Properties

| Name                                          | Default          | Description                                  |
| --------------------------------------------- | ---------------- | -------------------------------------------- |
| `--stripe-payment-request-element-min-width`  | `` `300px` ``    | min-width property of the container element  |
| `--stripe-payment-request-element-padding`    | `` `8px 12px` `` | padding property of the container element    |
| `--stripe-payment-request-element-background` | `` `white` ``    | background property of the container element |

<details><summary>Private API</summary>

#### Fields

| Name               | Privacy   | Type               | Default | Description | Inherited From |
| ------------------ | --------- | ------------------ | ------- | ----------- | -------------- |
| `slotName`         | protected | `SlotName`         |         |             |                |
| `#displayItems`    | private   | `DisplayItem[]`    |         |             |                |
| `#shippingOptions` | private   | `ShippingOption[]` |         |             |                |

#### Methods

| Name                             | Privacy   | Description                                                    | Parameters                                                                       | Return                                                                        | Inherited From |
| -------------------------------- | --------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------------- |
| `getStripePaymentRequestOptions` | private   | Creates a StripePaymentRequestOptions object.                  |                                                                                  | `StripePaymentRequestOptions`                                                 |                |
| `initElement`                    | protected | Initializes the PaymentRequest Object.                         |                                                                                  | `Promise<void>`                                                               |                |
| `initPaymentRequest`             | private   | Initialized the \`PaymentRequest\` object.                     |                                                                                  | `Promise<void>`                                                               |                |
| `initPaymentRequestButton`       | private   | Creates Stripe Payment Request Element.                        |                                                                                  | `Promise<void>`                                                               |                |
| `initPaymentRequestListeners`    | private   | Attaches listeners to the \`PaymentRequest\` object.           |                                                                                  | `Promise<void>`                                                               |                |
| `updatePaymentRequest`           | private   | Updates the PaymentRequests's values                           |                                                                                  |                                                                               |                |
| `onCancel`                       | private   | Handle a \`cancel\` event                                      |                                                                                  | `void`                                                                        |                |
| `complete`                       | private   | Completes the PaymentRequest.                                  | `paymentResponse: StripePaymentRequestResponse, confirmationError: stripe.Error` | `Promise<StripePaymentRequestResponse \| { error: stripe.Error \| null }>`    |                |
| `onPaymentResponse`              | private   | Handle a paymentResponse from Stripe                           | `paymentResponse: StripePaymentRequestResponse`                                  | `Promise<void>`                                                               |                |
| `confirmPaymentIntent`           | private   | When a PaymentIntent client secret is set, confirm the payment | `paymentResponse: StripePaymentRequestResponse`                                  | `Promise<void>`                                                               |                |
| `confirmCardPayment`             | private   | Stripe confirmCardPayment method                               | `data: stripe.ConfirmCardPaymentData, options: stripe.ConfirmCardPaymentOptions` | `Promise<PaymentIntentResponse>`                                              |                |
| `onShippingaddresschange`        | private   |                                                                | `originalEvent: ShippingAddressChangeEvent`                                      | `void`                                                                        |                |
| `onShippingoptionchange`         | private   |                                                                | `originalEvent: ShippingOptionChangeEvent`                                       | `void`                                                                        |                |
| `parseDatasets`                  | private   | Parses an element's dataset number props from string to number | `selector: 'stripe-shipping-option'`                                             | `ShippingOption[]`                                                            |                |
| `parseDatasets`                  | private   |                                                                | `selector: 'stripe-display-item'`                                                | `DisplayItem[]`                                                               |                |
| `parseDatasets`                  | private   |                                                                | `selector: 'stripe-display-item'\|'stripe-shipping-option'`                      | `(stripe.paymentRequest.DisplayItem\|stripe.paymentRequest.ShippingOption)[]` |                |

</details>

<hr/>

### Functions

| Name                     | Description | Parameters    | Return                       |
| ------------------------ | ----------- | ------------- | ---------------------------- |
| `isStripeDisplayItem`    |             | `el: Element` | `el is StripeDisplayItem`    |
| `isStripeShippingOption` |             | `el: Element` | `el is StripeShippingOption` |

<hr/>

### Exports

| Kind                        | Name                     | Declaration            | Module                      | Package |
| --------------------------- | ------------------------ | ---------------------- | --------------------------- | ------- |
| `js`                        | `isStripeDisplayItem`    | isStripeDisplayItem    | ./stripe-payment-request.js |         |
| `js`                        | `isStripeShippingOption` | isStripeShippingOption | ./stripe-payment-request.js |         |
| `js`                        | `StripePaymentRequest`   | StripePaymentRequest   | ./stripe-payment-request.js |         |
| `custom-element-definition` | `stripe-payment-request` | StripePaymentRequest   | ./stripe-payment-request.js |         |

## `./index.js`:

### Exports

| Kind | Name                   | Declaration          | Module                      | Package |
| ---- | ---------------------- | -------------------- | --------------------------- | ------- |
| `js` | `StripeElements`       | StripeElements       | ./stripe-elements.js        |         |
| `js` | `StripePaymentRequest` | StripePaymentRequest | ./stripe-payment-request.js |         |
