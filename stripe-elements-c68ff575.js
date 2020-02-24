import"./lit-html-ad749610.js";import{c as e,_ as t,p as r}from"./lit-element-785ef095.js";import{L as i,s as n,_ as o,a as s,b as a,S as l,d}from"./storybook-helpers-bff92679.js";const c=function(e){return t=>{const{descriptor:r}=t,i=r.value;return r.value=e(i),{...t,descriptor:r}}}((function(e){const{name:t}=e;return async function(...r){if(!this.stripe)throw new Error(`<${this.constructor.is}>: Stripe must be initialized before calling ${t}.`);return e.call(this,...r).then(this.handleResponse)}}));var p=e`:host{min-width:var(--stripe-elements-width,300px);min-height:var(--stripe-elements-height,50px)}#stripe{box-sizing:border-box;border-radius:var(--stripe-elements-border-radius,4px);border:var(--stripe-elements-border,1px solid transparent);box-shadow:var(--stripe-elements-box-shadow,0 1px 3px 0 #e6ebf1);transition:var(--stripe-elements-transition,box-shadow 150ms ease);min-width:var(--stripe-elements-width,300px);padding:var(--stripe-elements-element-padding,8px 12px);background:var(--stripe-elements-element-background,#fff)}:host([focused]) #stripe{box-shadow:0 1px 3px 0 #cfd7df}:host([error]) #stripe{border-color:#fa755a}`;function u(e){var t,r=v(e.key);"method"===e.kind?t={value:e.value,writable:!0,configurable:!0,enumerable:!1}:"get"===e.kind?t={get:e.value,configurable:!0,enumerable:!1}:"set"===e.kind?t={set:e.value,configurable:!0,enumerable:!1}:"field"===e.kind&&(t={configurable:!0,writable:!0,enumerable:!0});var i={kind:"field"===e.kind?"field":"method",key:r,placement:e.static?"static":"field"===e.kind?"own":"prototype",descriptor:t};return e.decorators&&(i.decorators=e.decorators),"field"===e.kind&&(i.initializer=e.value),i}function h(e,t){void 0!==e.descriptor.get?t.descriptor.get=e.descriptor.get:t.descriptor.set=e.descriptor.set}function f(e){return e.decorators&&e.decorators.length}function m(e){return void 0!==e&&!(void 0===e.value&&void 0===e.writable)}function y(e,t){var r=e[t];if(void 0!==r&&"function"!=typeof r)throw new TypeError("Expected '"+t+"' to be a function");return r}function v(e){var t=function(e,t){if("object"!=typeof e||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var i=r.call(e,t||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:String(t)}const k=["color","fontFamily","fontSize","fontStyle","fontSmoothing","fontVariant","iconColor","lineHeight","letterSpacing","textDecoration","textShadow","textTransform"];let b=function(e,r,i,n){var o=function(){(function(){return e});var e={elementsDefinitionOrder:[["method"],["field"]],initializeInstanceElements:function(e,t){["method","field"].forEach((function(r){t.forEach((function(t){t.kind===r&&"own"===t.placement&&this.defineClassElement(e,t)}),this)}),this)},initializeClassElements:function(e,t){var r=e.prototype;["method","field"].forEach((function(i){t.forEach((function(t){var n=t.placement;if(t.kind===i&&("static"===n||"prototype"===n)){var o="static"===n?e:r;this.defineClassElement(o,t)}}),this)}),this)},defineClassElement:function(e,t){var r=t.descriptor;if("field"===t.kind){var i=t.initializer;r={enumerable:r.enumerable,writable:r.writable,configurable:r.configurable,value:void 0===i?void 0:i.call(e)}}Object.defineProperty(e,t.key,r)},decorateClass:function(e,t){var r=[],i=[],n={static:[],prototype:[],own:[]};if(e.forEach((function(e){this.addElementPlacement(e,n)}),this),e.forEach((function(e){if(!f(e))return r.push(e);var t=this.decorateElement(e,n);r.push(t.element),r.push.apply(r,t.extras),i.push.apply(i,t.finishers)}),this),!t)return{elements:r,finishers:i};var o=this.decorateConstructor(r,t);return i.push.apply(i,o.finishers),o.finishers=i,o},addElementPlacement:function(e,t,r){var i=t[e.placement];if(!r&&-1!==i.indexOf(e.key))throw new TypeError("Duplicated element ("+e.key+")");i.push(e.key)},decorateElement:function(e,t){for(var r=[],i=[],n=e.decorators,o=n.length-1;o>=0;o--){var s=t[e.placement];s.splice(s.indexOf(e.key),1);var a=this.fromElementDescriptor(e),l=this.toElementFinisherExtras((0,n[o])(a)||a);e=l.element,this.addElementPlacement(e,t),l.finisher&&i.push(l.finisher);var d=l.extras;if(d){for(var c=0;c<d.length;c++)this.addElementPlacement(d[c],t);r.push.apply(r,d)}}return{element:e,finishers:i,extras:r}},decorateConstructor:function(e,t){for(var r=[],i=t.length-1;i>=0;i--){var n=this.fromClassDescriptor(e),o=this.toClassDescriptor((0,t[i])(n)||n);if(void 0!==o.finisher&&r.push(o.finisher),void 0!==o.elements){e=o.elements;for(var s=0;s<e.length-1;s++)for(var a=s+1;a<e.length;a++)if(e[s].key===e[a].key&&e[s].placement===e[a].placement)throw new TypeError("Duplicated element ("+e[s].key+")")}}return{elements:e,finishers:r}},fromElementDescriptor:function(e){var t={kind:e.kind,key:e.key,placement:e.placement,descriptor:e.descriptor};return Object.defineProperty(t,Symbol.toStringTag,{value:"Descriptor",configurable:!0}),"field"===e.kind&&(t.initializer=e.initializer),t},toElementDescriptors:function(e){if(void 0!==e)return t(e).map((function(e){var t=this.toElementDescriptor(e);return this.disallowProperty(e,"finisher","An element descriptor"),this.disallowProperty(e,"extras","An element descriptor"),t}),this)},toElementDescriptor:function(e){var t=String(e.kind);if("method"!==t&&"field"!==t)throw new TypeError('An element descriptor\'s .kind property must be either "method" or "field", but a decorator created an element descriptor with .kind "'+t+'"');var r=v(e.key),i=String(e.placement);if("static"!==i&&"prototype"!==i&&"own"!==i)throw new TypeError('An element descriptor\'s .placement property must be one of "static", "prototype" or "own", but a decorator created an element descriptor with .placement "'+i+'"');var n=e.descriptor;this.disallowProperty(e,"elements","An element descriptor");var o={kind:t,key:r,placement:i,descriptor:Object.assign({},n)};return"field"!==t?this.disallowProperty(e,"initializer","A method descriptor"):(this.disallowProperty(n,"get","The property descriptor of a field descriptor"),this.disallowProperty(n,"set","The property descriptor of a field descriptor"),this.disallowProperty(n,"value","The property descriptor of a field descriptor"),o.initializer=e.initializer),o},toElementFinisherExtras:function(e){return{element:this.toElementDescriptor(e),finisher:y(e,"finisher"),extras:this.toElementDescriptors(e.extras)}},fromClassDescriptor:function(e){var t={kind:"class",elements:e.map(this.fromElementDescriptor,this)};return Object.defineProperty(t,Symbol.toStringTag,{value:"Descriptor",configurable:!0}),t},toClassDescriptor:function(e){var t=String(e.kind);if("class"!==t)throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator created a class descriptor with .kind "'+t+'"');this.disallowProperty(e,"key","A class descriptor"),this.disallowProperty(e,"placement","A class descriptor"),this.disallowProperty(e,"descriptor","A class descriptor"),this.disallowProperty(e,"initializer","A class descriptor"),this.disallowProperty(e,"extras","A class descriptor");var r=y(e,"finisher");return{elements:this.toElementDescriptors(e.elements),finisher:r}},runClassFinishers:function(e,t){for(var r=0;r<t.length;r++){var i=(0,t[r])(e);if(void 0!==i){if("function"!=typeof i)throw new TypeError("Finishers must return a constructor.");e=i}}return e},disallowProperty:function(e,t,r){if(void 0!==e[t])throw new TypeError(r+" can't have a ."+t+" property.")}};return e}();if(n)for(var s=0;s<n.length;s++)o=n[s](o);var a=r((function(e){o.initializeInstanceElements(e,l.elements)}),i),l=o.decorateClass(function(e){for(var t=[],r=function(e){return"method"===e.kind&&e.key===o.key&&e.placement===o.placement},i=0;i<e.length;i++){var n,o=e[i];if("method"===o.kind&&(n=t.find(r)))if(m(o.descriptor)||m(n.descriptor)){if(f(o)||f(n))throw new ReferenceError("Duplicated methods ("+o.key+") can't be decorated.");n.descriptor=o.descriptor}else{if(f(o)){if(f(n))throw new ReferenceError("Decorators can't be placed on different accessors with for the same property ("+o.key+").");n.decorators=o.decorators}h(o,n)}else t.push(o)}return t}(a.d.map(u)),e);return o.initializeClassElements(a.F,l.elements),o.runClassFinishers(a.F,l.finishers)}(null,(function(e,t){class i extends t{constructor(...t){super(...t),e(this)}}return{F:i,d:[{kind:"field",static:!0,key:"is",value:()=>"stripe-elements"},{kind:"field",static:!0,key:"elementType",value:()=>"card"},{kind:"field",static:!0,key:"styles",value:()=>[n,p]},{kind:"field",decorators:[r({type:Boolean,attribute:"hide-icon"})],key:"hideIcon",value:()=>!1},{kind:"field",decorators:[r({type:Boolean,attribute:"hide-postal-code"})],key:"hidePostalCode",value:()=>!1},{kind:"field",decorators:[r({type:String,attribute:"icon-style"})],key:"iconStyle",value:()=>"default"},{kind:"field",decorators:[r({type:Object})],key:"value",value:()=>({})},{kind:"field",decorators:[r({type:String,notify:!0,readOnly:!0})],key:"brand",value:()=>null},{kind:"field",decorators:[r({type:Boolean,reflect:!0,notify:!0,readOnly:!0})],key:"complete",value:()=>!1},{kind:"field",decorators:[r({type:Boolean,reflect:!0,notify:!0,readOnly:!0})],key:"empty",value:()=>!0},{kind:"field",decorators:[r({type:Boolean,reflect:!0,notify:!0,readOnly:!0})],key:"invalid",value:()=>!1},{kind:"field",decorators:[r({type:Object,notify:!0,readOnly:!0})],key:"card",value:()=>null},{kind:"field",decorators:[r({type:Boolean,attribute:"is-empty",reflect:!0,notify:!0,readOnly:!0})],key:"isEmpty",value:()=>!0},{kind:"field",decorators:[r({type:Boolean,attribute:"is-complete",reflect:!0,notify:!0,readOnly:!0})],key:"isComplete",value:()=>!1},{kind:"method",key:"updated",value:function(e){o(s(i.prototype),"updated",this).call(this,e),e.has("element")&&!this.element&&this.set({card:null})}},{kind:"method",decorators:[c],key:"createPaymentMethod",value:async function(e=this.getPaymentMethodData()){return this.stripe.createPaymentMethod(e)}},{kind:"method",decorators:[c],key:"createSource",value:async function(e=this.sourceData){return this.stripe.createSource(this.element,e)}},{kind:"method",decorators:[c],key:"createToken",value:async function(e=this.tokenData){return this.stripe.createToken(this.element,e)}},{kind:"method",key:"isPotentiallyValid",value:function(){return!this.complete&&!this.empty&&!this.error||this.validate()}},{kind:"method",key:"reset",value:function(){var e;o(s(i.prototype),"reset",this).call(this),null===(e=this.element)||void 0===e||e.clear()}},{kind:"method",key:"submit",value:async function(){switch(this.generate){case"payment-method":return this.createPaymentMethod();case"source":return this.createSource();case"token":return this.createToken();default:{const e=this.createError(`cannot generate ${this.generate}`);throw await this.set({error:e}),e}}}},{kind:"method",key:"validate",value:function(){const{complete:e,empty:t,error:r}=this,i=!r&&e&&!t;return t&&!r&&this.set({error:this.createError("Your card number is empty.")}),i}},{kind:"method",key:"getPaymentMethodData",value:function(){const{billingDetails:e,element:t,paymentMethodData:r}=this;return{billing_details:e,...r,type:"card",card:t}}},{kind:"method",key:"getStripeElementsStyles",value:function(){const e=window.ShadyCSS?void 0:getComputedStyle(this),t=t=>this.getCSSCustomPropertyValue(t,e)||void 0;return k.reduce(({base:e={},complete:r={},empty:i={},invalid:n={}},o)=>({base:{...e,[o]:t(`--stripe-elements-base-${d(o)}`)},complete:{...r,[o]:t(`--stripe-elements-complete-${d(o)}`)},empty:{...i,[o]:t(`--stripe-elements-empty-${d(o)}`)},invalid:{...n,[o]:t(`--stripe-elements-invalid-${d(o)}`)}}),{})}},{kind:"method",key:"initElement",value:async function(){if(!this.stripe)return;const{hidePostalCode:e,hideIcon:t,iconStyle:r,value:i}=this,n={hideIcon:t,hidePostalCode:e,iconStyle:r,style:this.getStripeElementsStyles(),value:i},o=this.elements.create("card",n);o.addEventListener("change",this.onChange),await this.set({element:o,card:o})}},{kind:"method",decorators:[a],key:"onChange",value:async function(e){const{brand:t,complete:r,empty:i,error:n=null}=e,o=n||!i&&!r;await this.set({brand:t,complete:r,empty:i,error:n,invalid:o,isComplete:r,isEmpty:i}),this.fire("change",e),this.fire("stripe-change",e)}}]}}),i(l));customElements.define(b.is,b);
//# sourceMappingURL=stripe-elements-c68ff575.js.map