echo "declare global { interface HTMLElementTagNameMap { 'stripe-elements': StripeElements; } }" >> stripe-elements.d.ts
echo "declare global { interface HTMLElementTagNameMap { 'stripe-payment-request': StripePaymentRequest; } }" >> stripe-payment-request.d.ts
echo "import { StripeElements } from './stripe-elements';" >> index.d.ts
echo "import { StripePaymentRequest } from './stripe-payment-request';" >> index.d.ts
echo "declare global {" >> index.d.ts
echo "  interface HTMLElementTagNameMap {" >> index.d.ts
echo "    'stripe-elements': StripeElements;" >> index.d.ts
echo "    'stripe-payment-request': StripePaymentRequest;" >> index.d.ts
echo "  }" >> index.d.ts
echo "}" >> index.d.ts
node scripts/privatize.js

# lol
sed -i "1s|^|import { LitElement } from 'lit-element';\n|" StripeBase.d.ts
sed -i "s/export class StripeBase/export class StripeBase extends LitElement/" StripeBase.d.ts
