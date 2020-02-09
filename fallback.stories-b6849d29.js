import{h as e,i as t}from"./lit-html-ad749610.js";import{f as n,u as s,t as i,X as r,Y as a}from"./storybook-672964cf.js";import{L as o,c as p}from"./lit-element-785ef095.js";import"./codesandbox-button-84b117ac.js";import{p as u,c as l}from"./storybook-helpers-bff92679.js";import"./stripe-elements-c68ff575.js";function d(){return(d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&(e[s]=n[s])}return e}).apply(this,arguments)}const m={};function h({components:s,...h}){return n("wrapper",d({},m,h,{components:s,mdxType:"MDXLayout"}),n(a,{title:"Fallback to Stripe Elements",parameters:{options:{selectedPanel:"storybookjs/docs/panel"}},mdxType:"Meta"}),n("h1",null,"Fallback to Stripe Elements"),n("p",null,"You might often want to show users a ",n("inlineCode",{parentName:"p"},"<stripe-payment-request>")," button if they\nare able (i.e. if ",n("inlineCode",{parentName:"p"},"canMakePayment")," is true), but fall back to a\n",n("inlineCode",{parentName:"p"},"<stripe-elements>")," card form if they are not."),n("p",null,"To accomplish this, listen for the ",n("inlineCode",{parentName:"p"},"unsupported")," and ",n("inlineCode",{parentName:"p"},"ready")," events on\n",n("inlineCode",{parentName:"p"},"<stripe-payment-request>"),", which fire when the element is finally unable or\nable to display a Payment Request button, respectively."),n("p",null,"We recommend that you don't set ",n("inlineCode",{parentName:"p"},"publishable-key")," on ",n("inlineCode",{parentName:"p"},"<stripe-elements>")," until\n",n("inlineCode",{parentName:"p"},"unsupported")," fires from ",n("inlineCode",{parentName:"p"},"<stripe-payment-request>"),", as setting the publishable\nkey will kick off the element's initialization, even if payment request is\nsupported."),n("p",null,"Enter your publishable key here (use the test key, not the production key) to\nrun the examples against your Stripe account."),n(i,{name:"Enter a Publishable Key",height:"80px",mdxType:"Story"},e`
    <mwc-textfield id="publishable-key-input"
        outlined
        helperpersistent
        label="Publishable Key"
        helper="NOTE: the input will store the publishable key in localstorage for your convenience."
        value="${u}"
        @change="${l("fallback-form")}">
    </mwc-textfield>`),n(r,{mdxType:"Preview"},n(i,{name:"Falling Back to Stripe Elements When Payment Request is Not Supported",mdxType:"Story"},()=>(customElements.get("fallback-form")||customElements.define("fallback-form",class extends o{static get properties(){return{error:{type:Object},output:{type:Object},unsupported:{type:Boolean},publishableKey:{type:String,attribute:"publishable-key"},submitDisabled:{type:Boolean}}}static get styles(){return p`[hidden]{display:none!important}:host{font-family:"Nunito Sans",-apple-system,".SFNSText-Regular","San Francisco",BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Helvetica,Arial,sans-serif;align-items:center;display:grid;grid-gap:12px;grid-template-areas:'support support' 'stripe submit' 'output output'}stripe-elements{grid-area:stripe}stripe-payment-request{grid-area:submit/stripe/stripe/submit}mwc-button{grid-area:submit}json-viewer{grid-area:output}`}constructor(){super(),this.submitDisabled=!0}render(){return e`
                <output ?hidden="${void 0===this.unsupported}">Payment Request is ${this.unsupported?"un":""}supported on this Browser</output>
                <stripe-payment-request
                    ?hidden="${this.output||this.unsupported}"
                    @success="${this.onSuccess}"
                    @fail="${this.onFail}"
                    @error="${this.onError}"
                    @unsupported="${this.onUnsupported}"
                    @ready="${this.onReady}"
                    publishable-key="${t(this.publishableKey)}"
                    generate="source"
                    request-payer-name
                    request-payer-email
                    request-payer-phone
                    amount="326"
                    label="Double Double"
                    country="CA"
                    currency="cad">
                  <stripe-display-item data-amount="125" data-label="Double Double"> </stripe-display-item>
                  <stripe-display-item data-amount="199" data-label="Box of 10 Timbits"> </stripe-display-item>
                  <stripe-shipping-option data-id="pick-up" data-label="Pick Up" data-detail="Pick Up at Your Local Timmy's" data-amount="0"> </stripe-shipping-option>
                  <stripe-shipping-option data-id="delivery" data-label="Delivery" data-detail="Timbits to Your Door" data-amount="200"> </stripe-shipping-option>
                </stripe-payment-request>
                <stripe-elements
                    ?hidden="${this.output||!this.unsupported}"
                    generate="source"
                    publishable-key="${t(this.unsupported?this.publishableKey:void 0)}"
                    @change="${this.onChange}"
                    @source="${this.onSuccess}"
                    @error="${this.onError}"
                > </stripe-elements>
                <mwc-button
                    ?hidden="${this.output||!this.unsupported}"
                    ?disabled="${this.submitDisabled}"
                    @click="${this.onClick}"
                >Submit</mwc-button>
                <json-viewer .object="${this.output}"> </json-viewer>
              `}onChange({target:{complete:e,hasError:t}}){this.submitDisabled=!(e&&!t)}onClick(){this.shadowRoot.querySelector("stripe-elements").submit()}onError({target:{error:e}}){this.error=e}onFail(e){this.output=e.detail}onReady(){this.unsupported=!1}onSuccess(e){this.output=e.detail}onUnsupported(){this.unsupported=!0}}),e`<fallback-form publishable-key="${u}"> </fallback-form>`))))}h.isMDXComponent=!0;const b=()=>e`
    <mwc-textfield id="publishable-key-input"
        outlined
        helperpersistent
        label="Publishable Key"
        helper="NOTE: the input will store the publishable key in localstorage for your convenience."
        value="${u}"
        @change="${l("fallback-form")}">
    </mwc-textfield>`;(b.story={}).name="Enter a Publishable Key",b.story.parameters={mdxSource:'html`\n    <mwc-textfield id="publishable-key-input"\n        outlined\n        helperpersistent\n        label="Publishable Key"\n        helper="NOTE: the input will store the publishable key in localstorage for your convenience."\n        value="${publishableKey}"\n        @change="${setKeys(\'fallback-form\')}">\n    </mwc-textfield>`'};const c=()=>(customElements.get("fallback-form")||customElements.define("fallback-form",class extends o{static get properties(){return{error:{type:Object},output:{type:Object},unsupported:{type:Boolean},publishableKey:{type:String,attribute:"publishable-key"},submitDisabled:{type:Boolean}}}static get styles(){return p`[hidden]{display:none!important}:host{font-family:"Nunito Sans",-apple-system,".SFNSText-Regular","San Francisco",BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Helvetica,Arial,sans-serif;align-items:center;display:grid;grid-gap:12px;grid-template-areas:'support support' 'stripe submit' 'output output'}stripe-elements{grid-area:stripe}stripe-payment-request{grid-area:submit/stripe/stripe/submit}mwc-button{grid-area:submit}json-viewer{grid-area:output}`}constructor(){super(),this.submitDisabled=!0}render(){return e`
                <output ?hidden="${void 0===this.unsupported}">Payment Request is ${this.unsupported?"un":""}supported on this Browser</output>
                <stripe-payment-request
                    ?hidden="${this.output||this.unsupported}"
                    @success="${this.onSuccess}"
                    @fail="${this.onFail}"
                    @error="${this.onError}"
                    @unsupported="${this.onUnsupported}"
                    @ready="${this.onReady}"
                    publishable-key="${t(this.publishableKey)}"
                    generate="source"
                    request-payer-name
                    request-payer-email
                    request-payer-phone
                    amount="326"
                    label="Double Double"
                    country="CA"
                    currency="cad">
                  <stripe-display-item data-amount="125" data-label="Double Double"> </stripe-display-item>
                  <stripe-display-item data-amount="199" data-label="Box of 10 Timbits"> </stripe-display-item>
                  <stripe-shipping-option data-id="pick-up" data-label="Pick Up" data-detail="Pick Up at Your Local Timmy's" data-amount="0"> </stripe-shipping-option>
                  <stripe-shipping-option data-id="delivery" data-label="Delivery" data-detail="Timbits to Your Door" data-amount="200"> </stripe-shipping-option>
                </stripe-payment-request>
                <stripe-elements
                    ?hidden="${this.output||!this.unsupported}"
                    generate="source"
                    publishable-key="${t(this.unsupported?this.publishableKey:void 0)}"
                    @change="${this.onChange}"
                    @source="${this.onSuccess}"
                    @error="${this.onError}"
                > </stripe-elements>
                <mwc-button
                    ?hidden="${this.output||!this.unsupported}"
                    ?disabled="${this.submitDisabled}"
                    @click="${this.onClick}"
                >Submit</mwc-button>
                <json-viewer .object="${this.output}"> </json-viewer>
              `}onChange({target:{complete:e,hasError:t}}){this.submitDisabled=!(e&&!t)}onClick(){this.shadowRoot.querySelector("stripe-elements").submit()}onError({target:{error:e}}){this.error=e}onFail(e){this.output=e.detail}onReady(){this.unsupported=!1}onSuccess(e){this.output=e.detail}onUnsupported(){this.unsupported=!0}}),e`<fallback-form publishable-key="${u}"> </fallback-form>`);(c.story={}).name="Falling Back to Stripe Elements When Payment Request is Not Supported",c.story.parameters={mdxSource:'() => {\n  if (!customElements.get(\'fallback-form\')) {\n    customElements.define(\'fallback-form\', class PaymentForm extends LitElement {\n      static get properties() {\n        return {\n          error: {\n            type: Object\n          },\n          output: {\n            type: Object\n          },\n          unsupported: {\n            type: Boolean\n          },\n          publishableKey: {\n            type: String,\n            attribute: \'publishable-key\'\n          },\n          submitDisabled: {\n            type: Boolean\n          }\n        };\n      }\n\n      static get styles() {\n        return css`\n              [hidden] { display: none !important; }\n              :host {\n                font-family: "Nunito Sans", -apple-system, ".SFNSText-Regular", "San Francisco", BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;\n                align-items: center;\n                display: grid;\n                grid-gap: 12px;\n                grid-template-areas:\n                  \'support support\'\n                  \'stripe submit\'\n                  \'output output\';\n              }\n              stripe-elements { grid-area: stripe; }\n              stripe-payment-request { grid-area: submit/stripe/stripe/submit; }\n              mwc-button { grid-area: submit; }\n              json-viewer { grid-area: output; }\n              `;\n      }\n\n      constructor() {\n        super();\n        this.submitDisabled = true;\n      }\n\n      render() {\n        return html`\n                <output ?hidden="${this.unsupported === undefined}">Payment Request is ${this.unsupported ? \'un\' : \'\'}supported on this Browser</output>\n                <stripe-payment-request\n                    ?hidden="${this.output || this.unsupported}"\n                    @success="${this.onSuccess}"\n                    @fail="${this.onFail}"\n                    @error="${this.onError}"\n                    @unsupported="${this.onUnsupported}"\n                    @ready="${this.onReady}"\n                    publishable-key="${ifDefined(this.publishableKey)}"\n                    generate="source"\n                    request-payer-name\n                    request-payer-email\n                    request-payer-phone\n                    amount="326"\n                    label="Double Double"\n                    country="CA"\n                    currency="cad">\n                  <stripe-display-item data-amount="125" data-label="Double Double"> </stripe-display-item>\n                  <stripe-display-item data-amount="199" data-label="Box of 10 Timbits"> </stripe-display-item>\n                  <stripe-shipping-option data-id="pick-up" data-label="Pick Up" data-detail="Pick Up at Your Local Timmy\'s" data-amount="0"> </stripe-shipping-option>\n                  <stripe-shipping-option data-id="delivery" data-label="Delivery" data-detail="Timbits to Your Door" data-amount="200"> </stripe-shipping-option>\n                </stripe-payment-request>\n                <stripe-elements\n                    ?hidden="${this.output || !this.unsupported}"\n                    generate="source"\n                    publishable-key="${ifDefined(this.unsupported ? this.publishableKey : undefined)}"\n                    @change="${this.onChange}"\n                    @source="${this.onSuccess}"\n                    @error="${this.onError}"\n                > </stripe-elements>\n                <mwc-button\n                    ?hidden="${this.output || !this.unsupported}"\n                    ?disabled="${this.submitDisabled}"\n                    @click="${this.onClick}"\n                >Submit</mwc-button>\n                <json-viewer .object="${this.output}"> </json-viewer>\n              `;\n      }\n\n      onChange({\n        target: {\n          complete,\n          hasError\n        }\n      }) {\n        this.submitDisabled = !(complete && !hasError);\n      }\n\n      onClick() {\n        this.shadowRoot.querySelector(\'stripe-elements\').submit();\n      }\n\n      onError({\n        target: {\n          error\n        }\n      }) {\n        this.error = error;\n      }\n\n      onFail(event) {\n        this.output = event.detail;\n      }\n\n      onReady() {\n        this.unsupported = false;\n      }\n\n      onSuccess(event) {\n        this.output = event.detail;\n      }\n\n      onUnsupported() {\n        this.unsupported = true;\n      }\n\n    });\n  }\n\n  return html`<fallback-form publishable-key="${publishableKey}"> </fallback-form>`;\n}'};const y={title:"Fallback to Stripe Elements",parameters:{options:{selectedPanel:"storybookjs/docs/panel"}},includeStories:["enterAPublishableKey","fallingBackToStripeElementsWhenPaymentRequestIsNotSupported"]},f={"Enter a Publishable Key":"enterAPublishableKey","Falling Back to Stripe Elements When Payment Request is Not Supported":"fallingBackToStripeElementsWhenPaymentRequestIsNotSupported"};y.parameters=y.parameters||{},y.parameters.docs={...y.parameters.docs||{},page:()=>n(s,{mdxStoryNameToKey:f,mdxComponentMeta:y},n(h,null))};const g=["enterAPublishableKey","fallingBackToStripeElementsWhenPaymentRequestIsNotSupported"];export default y;export{g as __namedExportsOrder,b as enterAPublishableKey,c as fallingBackToStripeElementsWhenPaymentRequestIsNotSupported};
//# sourceMappingURL=fallback.stories-b6849d29.js.map
