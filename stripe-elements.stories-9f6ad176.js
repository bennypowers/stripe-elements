import{d as e,n as t,N as n,t as a,h as r,c as i}from"./lit-html-ad749610.js";import{f as o,u as s,$ as d,t as l,X as c,Y as p}from"./storybook-672964cf.js";import{c as u,p as m,q as b,L as h,a as f}from"./lit-element-785ef095.js";import{p as g,c as v,$ as _}from"./storybook-helpers-bff92679.js";import"./stripe-elements-c68ff575.js";import{_ as y,a as x,M as w,m as A,b as C}from"./mwc-textfield-c304cde7.js";
/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */var S;function k(e,t){if(void 0===e&&(e=window),void 0===t&&(t=!1),void 0===S||t){var n=!1;try{e.document.addEventListener("test",(function(){}),{get passive(){return n=!0}})}catch(e){}S=n}return!!S&&{passive:!0}}
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */var T,E={BG_FOCUSED:"mdc-ripple-upgraded--background-focused",FG_ACTIVATION:"mdc-ripple-upgraded--foreground-activation",FG_DEACTIVATION:"mdc-ripple-upgraded--foreground-deactivation",ROOT:"mdc-ripple-upgraded",UNBOUNDED:"mdc-ripple-upgraded--unbounded"},I={VAR_FG_SCALE:"--mdc-ripple-fg-scale",VAR_FG_SIZE:"--mdc-ripple-fg-size",VAR_FG_TRANSLATE_END:"--mdc-ripple-fg-translate-end",VAR_FG_TRANSLATE_START:"--mdc-ripple-fg-translate-start",VAR_LEFT:"--mdc-ripple-left",VAR_TOP:"--mdc-ripple-top"},P={DEACTIVATION_TIMEOUT_MS:225,FG_DEACTIVATION_MS:150,INITIAL_ORIGIN_SCALE:.6,PADDING:10,TAP_DELAY_MS:300};
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var N=["touchstart","pointerdown","mousedown","keydown"],R=["touchend","pointerup","mouseup","contextmenu"],D=[],O=function(e){function t(n){var a=e.call(this,x({},t.defaultAdapter,n))||this;return a.activationAnimationHasEnded_=!1,a.activationTimer_=0,a.fgDeactivationRemovalTimer_=0,a.fgScale_="0",a.frame_={width:0,height:0},a.initialSize_=0,a.layoutFrame_=0,a.maxRadius_=0,a.unboundedCoords_={left:0,top:0},a.activationState_=a.defaultActivationState_(),a.activationTimerCallback_=function(){a.activationAnimationHasEnded_=!0,a.runDeactivationUXLogicIfReady_()},a.activateHandler_=function(e){return a.activate_(e)},a.deactivateHandler_=function(){return a.deactivate_()},a.focusHandler_=function(){return a.handleFocus()},a.blurHandler_=function(){return a.handleBlur()},a.resizeHandler_=function(){return a.layout()},a}return y(t,e),Object.defineProperty(t,"cssClasses",{get:function(){return E},enumerable:!0,configurable:!0}),Object.defineProperty(t,"strings",{get:function(){return I},enumerable:!0,configurable:!0}),Object.defineProperty(t,"numbers",{get:function(){return P},enumerable:!0,configurable:!0}),Object.defineProperty(t,"defaultAdapter",{get:function(){return{addClass:function(){},browserSupportsCssVars:function(){return!0},computeBoundingRect:function(){return{top:0,right:0,bottom:0,left:0,width:0,height:0}},containsEventTarget:function(){return!0},deregisterDocumentInteractionHandler:function(){},deregisterInteractionHandler:function(){},deregisterResizeHandler:function(){},getWindowPageOffset:function(){return{x:0,y:0}},isSurfaceActive:function(){return!0},isSurfaceDisabled:function(){return!0},isUnbounded:function(){return!0},registerDocumentInteractionHandler:function(){},registerInteractionHandler:function(){},registerResizeHandler:function(){},removeClass:function(){},updateCssVariable:function(){}}},enumerable:!0,configurable:!0}),t.prototype.init=function(){var e=this,n=this.supportsPressRipple_();if(this.registerRootHandlers_(n),n){var a=t.cssClasses,r=a.ROOT,i=a.UNBOUNDED;requestAnimationFrame((function(){e.adapter_.addClass(r),e.adapter_.isUnbounded()&&(e.adapter_.addClass(i),e.layoutInternal_())}))}},t.prototype.destroy=function(){var e=this;if(this.supportsPressRipple_()){this.activationTimer_&&(clearTimeout(this.activationTimer_),this.activationTimer_=0,this.adapter_.removeClass(t.cssClasses.FG_ACTIVATION)),this.fgDeactivationRemovalTimer_&&(clearTimeout(this.fgDeactivationRemovalTimer_),this.fgDeactivationRemovalTimer_=0,this.adapter_.removeClass(t.cssClasses.FG_DEACTIVATION));var n=t.cssClasses,a=n.ROOT,r=n.UNBOUNDED;requestAnimationFrame((function(){e.adapter_.removeClass(a),e.adapter_.removeClass(r),e.removeCssVars_()}))}this.deregisterRootHandlers_(),this.deregisterDeactivationHandlers_()},t.prototype.activate=function(e){this.activate_(e)},t.prototype.deactivate=function(){this.deactivate_()},t.prototype.layout=function(){var e=this;this.layoutFrame_&&cancelAnimationFrame(this.layoutFrame_),this.layoutFrame_=requestAnimationFrame((function(){e.layoutInternal_(),e.layoutFrame_=0}))},t.prototype.setUnbounded=function(e){var n=t.cssClasses.UNBOUNDED;e?this.adapter_.addClass(n):this.adapter_.removeClass(n)},t.prototype.handleFocus=function(){var e=this;requestAnimationFrame((function(){return e.adapter_.addClass(t.cssClasses.BG_FOCUSED)}))},t.prototype.handleBlur=function(){var e=this;requestAnimationFrame((function(){return e.adapter_.removeClass(t.cssClasses.BG_FOCUSED)}))},t.prototype.supportsPressRipple_=function(){return this.adapter_.browserSupportsCssVars()},t.prototype.defaultActivationState_=function(){return{activationEvent:void 0,hasDeactivationUXRun:!1,isActivated:!1,isProgrammatic:!1,wasActivatedByPointer:!1,wasElementMadeActive:!1}},t.prototype.registerRootHandlers_=function(e){var t=this;e&&(N.forEach((function(e){t.adapter_.registerInteractionHandler(e,t.activateHandler_)})),this.adapter_.isUnbounded()&&this.adapter_.registerResizeHandler(this.resizeHandler_)),this.adapter_.registerInteractionHandler("focus",this.focusHandler_),this.adapter_.registerInteractionHandler("blur",this.blurHandler_)},t.prototype.registerDeactivationHandlers_=function(e){var t=this;"keydown"===e.type?this.adapter_.registerInteractionHandler("keyup",this.deactivateHandler_):R.forEach((function(e){t.adapter_.registerDocumentInteractionHandler(e,t.deactivateHandler_)}))},t.prototype.deregisterRootHandlers_=function(){var e=this;N.forEach((function(t){e.adapter_.deregisterInteractionHandler(t,e.activateHandler_)})),this.adapter_.deregisterInteractionHandler("focus",this.focusHandler_),this.adapter_.deregisterInteractionHandler("blur",this.blurHandler_),this.adapter_.isUnbounded()&&this.adapter_.deregisterResizeHandler(this.resizeHandler_)},t.prototype.deregisterDeactivationHandlers_=function(){var e=this;this.adapter_.deregisterInteractionHandler("keyup",this.deactivateHandler_),R.forEach((function(t){e.adapter_.deregisterDocumentInteractionHandler(t,e.deactivateHandler_)}))},t.prototype.removeCssVars_=function(){var e=this,n=t.strings;Object.keys(n).forEach((function(t){0===t.indexOf("VAR_")&&e.adapter_.updateCssVariable(n[t],null)}))},t.prototype.activate_=function(e){var t=this;if(!this.adapter_.isSurfaceDisabled()){var n=this.activationState_;if(!n.isActivated){var a=this.previousActivationEvent_;if(!(a&&void 0!==e&&a.type!==e.type))n.isActivated=!0,n.isProgrammatic=void 0===e,n.activationEvent=e,n.wasActivatedByPointer=!n.isProgrammatic&&(void 0!==e&&("mousedown"===e.type||"touchstart"===e.type||"pointerdown"===e.type)),void 0!==e&&D.length>0&&D.some((function(e){return t.adapter_.containsEventTarget(e)}))?this.resetActivationState_():(void 0!==e&&(D.push(e.target),this.registerDeactivationHandlers_(e)),n.wasElementMadeActive=this.checkElementMadeActive_(e),n.wasElementMadeActive&&this.animateActivation_(),requestAnimationFrame((function(){D=[],n.wasElementMadeActive||void 0===e||" "!==e.key&&32!==e.keyCode||(n.wasElementMadeActive=t.checkElementMadeActive_(e),n.wasElementMadeActive&&t.animateActivation_()),n.wasElementMadeActive||(t.activationState_=t.defaultActivationState_())})))}}},t.prototype.checkElementMadeActive_=function(e){return void 0===e||"keydown"!==e.type||this.adapter_.isSurfaceActive()},t.prototype.animateActivation_=function(){var e=this,n=t.strings,a=n.VAR_FG_TRANSLATE_START,r=n.VAR_FG_TRANSLATE_END,i=t.cssClasses,o=i.FG_DEACTIVATION,s=i.FG_ACTIVATION,d=t.numbers.DEACTIVATION_TIMEOUT_MS;this.layoutInternal_();var l="",c="";if(!this.adapter_.isUnbounded()){var p=this.getFgTranslationCoordinates_(),u=p.startPoint,m=p.endPoint;l=u.x+"px, "+u.y+"px",c=m.x+"px, "+m.y+"px"}this.adapter_.updateCssVariable(a,l),this.adapter_.updateCssVariable(r,c),clearTimeout(this.activationTimer_),clearTimeout(this.fgDeactivationRemovalTimer_),this.rmBoundedActivationClasses_(),this.adapter_.removeClass(o),this.adapter_.computeBoundingRect(),this.adapter_.addClass(s),this.activationTimer_=setTimeout((function(){return e.activationTimerCallback_()}),d)},t.prototype.getFgTranslationCoordinates_=function(){var e,t=this.activationState_,n=t.activationEvent;return{startPoint:e={x:(e=t.wasActivatedByPointer?function(e,t,n){if(!e)return{x:0,y:0};var a,r,i=t.x,o=t.y,s=i+n.left,d=o+n.top;if("touchstart"===e.type){var l=e;a=l.changedTouches[0].pageX-s,r=l.changedTouches[0].pageY-d}else{var c=e;a=c.pageX-s,r=c.pageY-d}return{x:a,y:r}}(n,this.adapter_.getWindowPageOffset(),this.adapter_.computeBoundingRect()):{x:this.frame_.width/2,y:this.frame_.height/2}).x-this.initialSize_/2,y:e.y-this.initialSize_/2},endPoint:{x:this.frame_.width/2-this.initialSize_/2,y:this.frame_.height/2-this.initialSize_/2}}},t.prototype.runDeactivationUXLogicIfReady_=function(){var e=this,n=t.cssClasses.FG_DEACTIVATION,a=this.activationState_,r=a.hasDeactivationUXRun,i=a.isActivated;(r||!i)&&this.activationAnimationHasEnded_&&(this.rmBoundedActivationClasses_(),this.adapter_.addClass(n),this.fgDeactivationRemovalTimer_=setTimeout((function(){e.adapter_.removeClass(n)}),P.FG_DEACTIVATION_MS))},t.prototype.rmBoundedActivationClasses_=function(){var e=t.cssClasses.FG_ACTIVATION;this.adapter_.removeClass(e),this.activationAnimationHasEnded_=!1,this.adapter_.computeBoundingRect()},t.prototype.resetActivationState_=function(){var e=this;this.previousActivationEvent_=this.activationState_.activationEvent,this.activationState_=this.defaultActivationState_(),setTimeout((function(){return e.previousActivationEvent_=void 0}),t.numbers.TAP_DELAY_MS)},t.prototype.deactivate_=function(){var e=this,t=this.activationState_;if(t.isActivated){var n=x({},t);t.isProgrammatic?(requestAnimationFrame((function(){return e.animateDeactivation_(n)})),this.resetActivationState_()):(this.deregisterDeactivationHandlers_(),requestAnimationFrame((function(){e.activationState_.hasDeactivationUXRun=!0,e.animateDeactivation_(n),e.resetActivationState_()})))}},t.prototype.animateDeactivation_=function(e){var t=e.wasActivatedByPointer,n=e.wasElementMadeActive;(t||n)&&this.runDeactivationUXLogicIfReady_()},t.prototype.layoutInternal_=function(){var e=this;this.frame_=this.adapter_.computeBoundingRect();var n=Math.max(this.frame_.height,this.frame_.width);this.maxRadius_=this.adapter_.isUnbounded()?n:Math.sqrt(Math.pow(e.frame_.width,2)+Math.pow(e.frame_.height,2))+t.numbers.PADDING;var a=Math.floor(n*t.numbers.INITIAL_ORIGIN_SCALE);this.adapter_.isUnbounded()&&a%2!=0?this.initialSize_=a-1:this.initialSize_=a,this.fgScale_=""+this.maxRadius_/this.initialSize_,this.updateLayoutCssVars_()},t.prototype.updateLayoutCssVars_=function(){var e=t.strings,n=e.VAR_FG_SIZE,a=e.VAR_LEFT,r=e.VAR_TOP,i=e.VAR_FG_SCALE;this.adapter_.updateCssVariable(n,this.initialSize_+"px"),this.adapter_.updateCssVariable(i,this.fgScale_),this.adapter_.isUnbounded()&&(this.unboundedCoords_={left:Math.round(this.frame_.width/2-this.initialSize_/2),top:Math.round(this.frame_.height/2-this.initialSize_/2)},this.adapter_.updateCssVariable(a,this.unboundedCoords_.left+"px"),this.adapter_.updateCssVariable(r,this.unboundedCoords_.top+"px"))},t}(w);
/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
const V=u`@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(.4,0,.2,1);transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity,0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity,0)}to{opacity:0}}`
/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/,F=function(e,t){void 0===t&&(t=!1);var n,a=e.CSS;if("boolean"==typeof T&&!t)return T;if(!(a&&"function"==typeof a.supports))return!1;var r=a.supports("--css-vars","yes"),i=a.supports("(--css-vars: yes)")&&a.supports("color","#00000000");return n=r||i,t||(T=n),n}(window),H=navigator.userAgent.match(/Safari/);let z=!1;const M=e=>{H&&!z&&(()=>{z=!0;const e=document.createElement("style"),t=new n({templateFactory:a});t.appendInto(e),t.setValue(V),t.commit(),document.head.appendChild(e)})();const t=e.surfaceNode,r=e.interactionNode||t;r.getRootNode()!==t.getRootNode()&&""===r.style.position&&(r.style.position="relative");const i=new O({browserSupportsCssVars:()=>F,isUnbounded:()=>void 0===e.unbounded||e.unbounded,isSurfaceActive:()=>A(r,":active"),isSurfaceDisabled:()=>Boolean(r.hasAttribute("disabled")),addClass:e=>t.classList.add(e),removeClass:e=>t.classList.remove(e),containsEventTarget:e=>r.contains(e),registerInteractionHandler:(e,t)=>r.addEventListener(e,t,k()),deregisterInteractionHandler:(e,t)=>r.removeEventListener(e,t,k()),registerDocumentInteractionHandler:(e,t)=>document.documentElement.addEventListener(e,t,k()),deregisterDocumentInteractionHandler:(e,t)=>document.documentElement.removeEventListener(e,t,k()),registerResizeHandler:e=>window.addEventListener("resize",e),deregisterResizeHandler:e=>window.removeEventListener("resize",e),updateCssVariable:(e,n)=>t.style.setProperty(e,n),computeBoundingRect:()=>t.getBoundingClientRect(),getWindowPageOffset:()=>({x:window.pageXOffset,y:window.pageYOffset})});return i.init(),i},G=new WeakMap,$=e((e={})=>n=>{const a=n.committer.element,r=e.interactionNode||a;let i=n.value;const o=G.get(i);void 0!==o&&o!==r&&(i.destroy(),i=t),i===t?(i=M(Object.assign({},e,{surfaceNode:a})),G.set(i,r),n.setValue(i)):(void 0!==e.unbounded&&i.setUnbounded(e.unbounded),void 0!==e.disabled&&i.setUnbounded(e.disabled)),!0===e.active?i.activate():!1===e.active&&i.deactivate()});class X extends h{constructor(){super(...arguments),this.raised=!1,this.unelevated=!1,this.outlined=!1,this.dense=!1,this.disabled=!1,this.trailingIcon=!1,this.icon="",this.label=""}createRenderRoot(){return this.attachShadow({mode:"open",delegatesFocus:!0})}focus(){const e=this.buttonElement;if(e){const t=e.ripple;t&&t.handleFocus(),e.focus()}}blur(){const e=this.buttonElement;if(e){const t=e.ripple;t&&t.handleBlur(),e.blur()}}render(){const e={"mdc-button--raised":this.raised,"mdc-button--unelevated":this.unelevated,"mdc-button--outlined":this.outlined,"mdc-button--dense":this.dense},t=r`<span class="material-icons mdc-button__icon">${this.icon}</span>`,n=$({unbounded:!1});return r` <button id="button" .ripple="${n}" class="mdc-button ${i(e)}" ?disabled="${this.disabled}" aria-label="${this.label||this.icon}"> <div class="mdc-button__ripple"></div> ${this.icon&&!this.trailingIcon?t:""} <span class="mdc-button__label">${this.label}</span> ${this.icon&&this.trailingIcon?t:""} <slot></slot> </button>`}}C([m({type:Boolean})],X.prototype,"raised",void 0),C([m({type:Boolean})],X.prototype,"unelevated",void 0),C([m({type:Boolean})],X.prototype,"outlined",void 0),C([m({type:Boolean})],X.prototype,"dense",void 0),C([m({type:Boolean,reflect:!0})],X.prototype,"disabled",void 0),C([m({type:Boolean})],X.prototype,"trailingIcon",void 0),C([m()],X.prototype,"icon",void 0),C([m()],X.prototype,"label",void 0),C([b("#button")],X.prototype,"buttonElement",void 0);
/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
const B=u`.mdc-touch-target-wrapper{display:inline}.mdc-elevation-overlay{position:absolute;border-radius:inherit;opacity:0;pointer-events:none;transition:opacity 280ms cubic-bezier(.4,0,.2,1);background-color:#fff}.mdc-button{font-family:Roboto,sans-serif;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-size:.875rem;line-height:2.25rem;font-weight:500;letter-spacing:.0892857143em;text-decoration:none;text-transform:uppercase;padding:0 8px 0 8px;position:relative;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;min-width:64px;border:none;outline:0;line-height:inherit;user-select:none;-webkit-appearance:none;overflow:visible;vertical-align:middle;border-radius:4px}.mdc-button .mdc-elevation-overlay{width:100%;height:100%;top:0;left:0}.mdc-button::-moz-focus-inner{padding:0;border:0}.mdc-button:active{outline:0}.mdc-button:hover{cursor:pointer}.mdc-button:disabled{cursor:default;pointer-events:none}.mdc-button .mdc-button__ripple{border-radius:4px}.mdc-button:not(:disabled){background-color:transparent}.mdc-button:disabled{background-color:transparent}.mdc-button .mdc-button__icon{margin-left:0;margin-right:8px;display:inline-block;width:18px;height:18px;font-size:18px;vertical-align:top}[dir=rtl] .mdc-button .mdc-button__icon,.mdc-button .mdc-button__icon[dir=rtl]{margin-left:8px;margin-right:0}.mdc-button .mdc-button__touch{position:absolute;top:50%;right:0;height:48px;left:0;transform:translateY(-50%)}.mdc-button:not(:disabled){color:#6200ee;color:var(--mdc-theme-primary,#6200ee)}.mdc-button:disabled{color:rgba(0,0,0,.38)}.mdc-button__label+.mdc-button__icon{margin-left:8px;margin-right:0}[dir=rtl] .mdc-button__label+.mdc-button__icon,.mdc-button__label+.mdc-button__icon[dir=rtl]{margin-left:0;margin-right:8px}svg.mdc-button__icon{fill:currentColor}.mdc-button--raised .mdc-button__icon,.mdc-button--unelevated .mdc-button__icon,.mdc-button--outlined .mdc-button__icon{margin-left:-4px;margin-right:8px}[dir=rtl] .mdc-button--raised .mdc-button__icon,.mdc-button--raised .mdc-button__icon[dir=rtl],[dir=rtl] .mdc-button--unelevated .mdc-button__icon,.mdc-button--unelevated .mdc-button__icon[dir=rtl],[dir=rtl] .mdc-button--outlined .mdc-button__icon,.mdc-button--outlined .mdc-button__icon[dir=rtl]{margin-left:8px;margin-right:-4px}.mdc-button--raised .mdc-button__label+.mdc-button__icon,.mdc-button--unelevated .mdc-button__label+.mdc-button__icon,.mdc-button--outlined .mdc-button__label+.mdc-button__icon{margin-left:8px;margin-right:-4px}[dir=rtl] .mdc-button--raised .mdc-button__label+.mdc-button__icon,.mdc-button--raised .mdc-button__label+.mdc-button__icon[dir=rtl],[dir=rtl] .mdc-button--unelevated .mdc-button__label+.mdc-button__icon,.mdc-button--unelevated .mdc-button__label+.mdc-button__icon[dir=rtl],[dir=rtl] .mdc-button--outlined .mdc-button__label+.mdc-button__icon,.mdc-button--outlined .mdc-button__label+.mdc-button__icon[dir=rtl]{margin-left:-4px;margin-right:8px}.mdc-button--raised,.mdc-button--unelevated{padding:0 16px 0 16px}.mdc-button--raised:not(:disabled),.mdc-button--unelevated:not(:disabled){background-color:#6200ee;background-color:var(--mdc-theme-primary,#6200ee)}.mdc-button--raised:not(:disabled),.mdc-button--unelevated:not(:disabled){color:#fff;color:var(--mdc-theme-on-primary,#fff)}.mdc-button--raised:disabled,.mdc-button--unelevated:disabled{background-color:rgba(0,0,0,.12)}.mdc-button--raised:disabled,.mdc-button--unelevated:disabled{color:rgba(0,0,0,.38)}.mdc-button--raised{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);transition:box-shadow 280ms cubic-bezier(.4,0,.2,1)}.mdc-button--raised:hover,.mdc-button--raised:focus{box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)}.mdc-button--raised:active{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.mdc-button--raised:disabled{box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12)}.mdc-button--outlined{padding:0 15px 0 15px;border-width:1px;border-style:solid}.mdc-button--outlined .mdc-button__ripple{top:-1px;left:-1px;border:1px solid transparent}.mdc-button--outlined:not(:disabled){border-color:rgba(0,0,0,.12)}.mdc-button--outlined:disabled{border-color:rgba(0,0,0,.12)}.mdc-button--touch{margin-top:6px;margin-bottom:6px}@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(.4,0,.2,1);transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity,0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity,0)}to{opacity:0}}.mdc-button{--mdc-ripple-fg-size:0;--mdc-ripple-left:0;--mdc-ripple-top:0;--mdc-ripple-fg-scale:1;--mdc-ripple-fg-translate-end:0;--mdc-ripple-fg-translate-start:0;-webkit-tap-highlight-color:transparent}.mdc-button .mdc-button__ripple::before,.mdc-button .mdc-button__ripple::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-button .mdc-button__ripple::before{transition:opacity 15ms linear,background-color 15ms linear;z-index:1}.mdc-button.mdc-ripple-upgraded .mdc-button__ripple::before{transform:scale(var(--mdc-ripple-fg-scale,1))}.mdc-button.mdc-ripple-upgraded .mdc-button__ripple::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-button.mdc-ripple-upgraded--unbounded .mdc-button__ripple::after{top:var(--mdc-ripple-top,0);left:var(--mdc-ripple-left,0)}.mdc-button.mdc-ripple-upgraded--foreground-activation .mdc-button__ripple::after{animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-button.mdc-ripple-upgraded--foreground-deactivation .mdc-button__ripple::after{animation:mdc-ripple-fg-opacity-out 150ms;transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}.mdc-button .mdc-button__ripple::before,.mdc-button .mdc-button__ripple::after{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-button.mdc-ripple-upgraded .mdc-button__ripple::after{width:var(--mdc-ripple-fg-size,100%);height:var(--mdc-ripple-fg-size,100%)}.mdc-button .mdc-button__ripple::before,.mdc-button .mdc-button__ripple::after{background-color:#6200ee;background-color:var(--mdc-theme-primary,#6200ee)}.mdc-button:hover .mdc-button__ripple::before{opacity:.04}.mdc-button.mdc-ripple-upgraded--background-focused .mdc-button__ripple::before,.mdc-button:not(.mdc-ripple-upgraded):focus .mdc-button__ripple::before{transition-duration:75ms;opacity:.12}.mdc-button:not(.mdc-ripple-upgraded) .mdc-button__ripple::after{transition:opacity 150ms linear}.mdc-button:not(.mdc-ripple-upgraded):active .mdc-button__ripple::after{transition-duration:75ms;opacity:.12}.mdc-button.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:0.12}.mdc-button .mdc-button__ripple{position:absolute;box-sizing:content-box;width:100%;height:100%;overflow:hidden}.mdc-button:not(.mdc-button--outlined) .mdc-button__ripple{top:0;left:0}.mdc-button--raised .mdc-button__ripple::before,.mdc-button--raised .mdc-button__ripple::after,.mdc-button--unelevated .mdc-button__ripple::before,.mdc-button--unelevated .mdc-button__ripple::after{background-color:#fff;background-color:var(--mdc-theme-on-primary,#fff)}.mdc-button--raised:hover .mdc-button__ripple::before,.mdc-button--unelevated:hover .mdc-button__ripple::before{opacity:.08}.mdc-button--raised.mdc-ripple-upgraded--background-focused .mdc-button__ripple::before,.mdc-button--raised:not(.mdc-ripple-upgraded):focus .mdc-button__ripple::before,.mdc-button--unelevated.mdc-ripple-upgraded--background-focused .mdc-button__ripple::before,.mdc-button--unelevated:not(.mdc-ripple-upgraded):focus .mdc-button__ripple::before{transition-duration:75ms;opacity:.24}.mdc-button--raised:not(.mdc-ripple-upgraded) .mdc-button__ripple::after,.mdc-button--unelevated:not(.mdc-ripple-upgraded) .mdc-button__ripple::after{transition:opacity 150ms linear}.mdc-button--raised:not(.mdc-ripple-upgraded):active .mdc-button__ripple::after,.mdc-button--unelevated:not(.mdc-ripple-upgraded):active .mdc-button__ripple::after{transition-duration:75ms;opacity:.24}.mdc-button--raised.mdc-ripple-upgraded,.mdc-button--unelevated.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:0.24}.mdc-button{height:36px}.material-icons{font-family:var(--mdc-icon-font, "Material Icons");font-weight:400;font-style:normal;font-size:var(--mdc-icon-size,24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}:host{display:inline-flex;outline:0;vertical-align:top}:host([disabled]){pointer-events:none}.mdc-button{flex:auto;overflow:hidden;text-transform:var(--mdc-button-text-transform,uppercase);letter-spacing:var(--mdc-button-letter-spacing,.0892857143em);padding:0 var(--mdc-button-horizontal-padding,8px) 0 var(--mdc-button-horizontal-padding,8px)}.mdc-button.mdc-button--raised,.mdc-button.mdc-button--unelevated{padding:0 var(--mdc-button-horizontal-padding,16px) 0 var(--mdc-button-horizontal-padding,16px)}.mdc-button.mdc-button--outlined{padding:0 calc(var(--mdc-button-horizontal-padding,16px) - var(--mdc-button-outline-width,1px)) 0 calc(var(--mdc-button-horizontal-padding,16px) - var(--mdc-button-outline-width,1px));border-width:var(--mdc-button-outline-width,1px);border-color:var(--mdc-button-outline-color,var(--mdc-theme-primary,#6200ee))}.mdc-button .mdc-button__ripple{border-radius:0}:host([disabled]) .mdc-button.mdc-button--raised,:host([disabled]) .mdc-button.mdc-button--unelevated{background-color:var(--mdc-button-disabled-fill-color,rgba(0,0,0,.12));color:var(--mdc-button-disabled-ink-color,rgba(0,0,0,.38))}:host([disabled]) .mdc-button:not(.mdc-button--raised):not(.mdc-button--unelevated){color:var(--mdc-button-disabled-ink-color,rgba(0,0,0,.38))}:host([disabled]) .mdc-button.mdc-button--outlined{border-color:var(--mdc-button-disabled-ink-color,rgba(0,0,0,.38));border-color:var(--mdc-button-disabled-outline-color,var(--mdc-button-disabled-ink-color,rgba(0,0,0,.38)))}`;let U=class extends X{};function L(){return(L=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}U.styles=B,U=C([f("mwc-button")],U);const K={};function q({components:e,...t}){return o("wrapper",L({},K,t,{components:e,mdxType:"MDXLayout"}),o(p,{title:"Elements/Stripe Elements",mdxType:"Meta"}),o("h1",null,o("inlineCode",{parentName:"h1"},"<stripe-elements>")," Web Component"),o("p",null,"The ",o("inlineCode",{parentName:"p"},"<stripe-elements>")," custom element is an easy way to use stripe.js in your web app,\nacross ",o("a",L({parentName:"p"},{href:"/?path=/docs/framework-examples-angular--stripe-elements"}),"frameworks"),", or inside shadow roots.\nAdd the element to your page with the ",o("inlineCode",{parentName:"p"},"publishable-key")," attribute set to your\n",o("a",L({parentName:"p"},{href:"https://dashboard.stripe.com/account/apikeys"}),"Stripe publishable key"),".\nYou can also set the ",o("inlineCode",{parentName:"p"},"publishableKey")," DOM property using JavaScript."),o("pre",null,o("code",L({parentName:"pre"},{className:"language-html"}),'<stripe-elements publishable-key="pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"></stripe-elements>\n')),o("blockquote",null,o("p",{parentName:"blockquote"},o("strong",{parentName:"p"},"Careful!")," never add your ",o("strong",{parentName:"p"},"secret key")," to an HTML page, only publish your ",o("strong",{parentName:"p"},"publishable key"),".")),o("p",null,"Once you've set the ",o("inlineCode",{parentName:"p"},"publishable-key")," attribute (or the ",o("inlineCode",{parentName:"p"},"publishableKey")," DOM property), Stripe will create a Stripe Card Element on your page."),o("p",null,"Enter your publishable key here (use the test key, not the production key) to run the examples against your Stripe account."),o(l,{name:"Enter a Publishable Key",height:"80px",mdxType:"Story"},r`
    <mwc-textfield id="publishable-key-input"
        outlined
        helperpersistent
        label="Publishable Key"
        helper="NOTE: the input will store the publishable key in localstorage for your convenience."
        value="${g}"
        @change="${v("stripe-elements:not(#should-error)")}">
    </mwc-textfield>`),o("h2",null,"Create a PaymentMethod"),o(c,{mdxType:"Preview"},o(l,{name:"Generate a PaymentMethod",height:"220px",mdxType:"Story"},r`
      <elements-demo label="Generate PaymentMethod">
        <stripe-elements generate="payment-method" publishable-key="${g}"> </stripe-elements>
      </elements-demo>
    `)),o("h2",null,"Create a Source"),o(c,{mdxType:"Preview"},o(l,{name:"Generate a Source",height:"220px",mdxType:"Story"},r`
      <elements-demo label="Generate Source">
        <stripe-elements generate="source" publishable-key="${g}"> </stripe-elements>
      </elements-demo>
    `)),o("h2",null,"Create a Token"),o("p",null,"Once you're set your publishable key and Stripe has instantiated (listen for the ",o("inlineCode",{parentName:"p"},"stripe-ready")," event if you need to know exactly when this happens),\nyou may generate a token from the filled-out form by calling the ",o("inlineCode",{parentName:"p"},"createToken()")," method."),o(c,{mdxType:"Preview"},o(l,{name:"Generate a Token",height:"220px",mdxType:"Story"},r`
      <elements-demo label="Generate Token">
        <stripe-elements generate="token" publishable-key="${g}"> </stripe-elements>
      </elements-demo>
    `)),o("h2",null,"Validation and Styling"),o("p",null,o("inlineCode",{parentName:"p"},"<stripe-elements>")," has a ",o("inlineCode",{parentName:"p"},"show-error")," boolean attribute which will display the error message for you.\nThis is useful for simple validation in cases where you don't need to build your own validation UI."),o(c,{mdxType:"Preview"},o(l,{name:"Validation",height:"120px",mdxType:"Story"},r`
      <elements-demo>
        <stripe-elements publishable-key="should-error-use-bad-key" show-error> </stripe-elements>
        <mwc-button slot="actions" outlined @click="${e=>e.target.parentElement.querySelector("stripe-elements").validate()}">Validate</mwc-button>
      </elements-demo>
    `)),o("h3",null,"Custom Validation"),o("p",null,o("inlineCode",{parentName:"p"},"<stripe-elements>")," comes with several properties, events, and methods for validation.\nListen for the ",o("inlineCode",{parentName:"p"},"change")," and ",o("inlineCode",{parentName:"p"},"error")," events and check the ",o("inlineCode",{parentName:"p"},"complete"),", ",o("inlineCode",{parentName:"p"},"empty"),", ",o("inlineCode",{parentName:"p"},"error"),", and ",o("inlineCode",{parentName:"p"},"invalid"),"\nproperties to react to validation changes."),o("p",null,"These states reflect as attributes, so you can use CSS to style your element in its various states."),o("p",null,"Use the ",o("inlineCode",{parentName:"p"},"stripe")," and ",o("inlineCode",{parentName:"p"},"error")," ",o("a",L({parentName:"p"},{href:"https://developer.mozilla.org/en-US/docs/Web/CSS/::part"}),"CSS Shadow Parts"),"\nto style the element as needed. If your target browsers don't yet support shadow parts,\nYou can still configure the element somewhat using the exposed CSS Custom Properties,\nsee the README for more information."),o("pre",null,o("code",L({parentName:"pre"},{className:"language-css"}),"stripe-elements::part(stripe) {\n  border-radius: 4px;\n  border: 1px solid var(--mdc-button-outline-color, var(--mdc-theme-primary, #6200ee));\n  box-shadow: none;\n  height: 36px;\n  display: flex;\n  flex-flow: column;\n  justify-content: center;\n}\n\nstripe-elements[complete]::part(stripe) {\n  border-color: var(--material-green-a700, #00C853);\n}\n\nstripe-elements[invalid]::part(stripe) {\n  border-color: var(--material-amber-a700, #FFAB00);\n}\n\nstripe-elements[error]::part(stripe) {\n  border-color: var(--material-red-a700, #D50000);\n}\n\nstripe-elements::part(error) {\n  text-align: right;\n  color: var(--material-grey-800, #424242);\n}\n")),o(c,{mdxType:"Preview"},o(l,{name:"Custom Validation",height:"120px",mdxType:"Story"},r`
      <style>
      #states stripe-elements::part(stripe) {
        border-radius: 4px;
        border: 1px solid var(--mdc-button-outline-color, var(--mdc-theme-primary, #6200ee));
        box-shadow: none;
        height: 36px;
        display: flex;
        flex-flow: column;
        justify-content: center;
      }
      #states stripe-elements[complete]::part(stripe) {
        border-color: var(--material-green-a700, #00C853);
      }
      #states stripe-elements[invalid]::part(stripe) {
        border-color: var(--material-amber-a700, #FFAB00);
      }
      #states stripe-elements[error]::part(stripe) {
        border-color: var(--material-red-a700, #D50000);
      }
      #states stripe-elements::part(error) {
        text-align: right;
        color: var(--material-grey-800, #424242);
      }
      </style>
      <article id="states">
        <stripe-elements show-error publishable-key="${g}"> </stripe-elements>
        <mwc-button outlined @click="${e=>e.target.parentElement.querySelector("stripe-elements").validate()}"> Validate</mwc-button>
      </article>
    `)),o("h2",null,"Automatically Posting the Payment Info"),o("p",null,"For simple integrations, you can automatically post the source or token to your backend by setting the ",o("inlineCode",{parentName:"p"},"action")," property"),o("p",null,o("strong",{parentName:"p"},"NOTE"),": For this demo, we've overridden ",o("inlineCode",{parentName:"p"},"window.fetch"),' to return a mocked response with the text body "A-OK!".'),o(c,{mdxType:"Preview"},o(l,{name:"Automatically Posting the Payment Info",mdxType:"Story"},()=>{const e=window.fetch;window.fetch=(t,...n)=>"/my-endpoint"===t?Promise.resolve(new Response("A-OK!")):e(t,...n);const t=e=>_("#auto-post output").textContent=e;return r`
      <article id="auto-post">
        <stripe-elements
            publishable-key="${g}"
            generate="token"
            action="/my-endpoint"
            @success="${({detail:e})=>e.text().then(t)}"
        > </stripe-elements>
        <mwc-button class="generate" outlined @click="${e=>e.target.parentElement.querySelector("stripe-elements").submit()}">Submit and POST</mwc-button>
        <output> </output>
      </article>
    `})),o("h2",null,"API"),o(d,{of:"stripe-elements",mdxType:"Props"}))}q.isMDXComponent=!0;const j=()=>r`
    <mwc-textfield id="publishable-key-input"
        outlined
        helperpersistent
        label="Publishable Key"
        helper="NOTE: the input will store the publishable key in localstorage for your convenience."
        value="${g}"
        @change="${v("stripe-elements:not(#should-error)")}">
    </mwc-textfield>`;(j.story={}).name="Enter a Publishable Key",j.story.parameters={mdxSource:'html`\n    <mwc-textfield id="publishable-key-input"\n        outlined\n        helperpersistent\n        label="Publishable Key"\n        helper="NOTE: the input will store the publishable key in localstorage for your convenience."\n        value="${publishableKey}"\n        @change="${setKeys(\'stripe-elements:not(#should-error)\')}">\n    </mwc-textfield>`'};const Y=()=>r`
      <elements-demo label="Generate PaymentMethod">
        <stripe-elements generate="payment-method" publishable-key="${g}"> </stripe-elements>
      </elements-demo>
    `;(Y.story={}).name="Generate a PaymentMethod",Y.story.parameters={mdxSource:'html`\n      <elements-demo label="Generate PaymentMethod">\n        <stripe-elements generate="payment-method" publishable-key="${publishableKey}"> </stripe-elements>\n      </elements-demo>\n    `'};const W=()=>r`
      <elements-demo label="Generate Source">
        <stripe-elements generate="source" publishable-key="${g}"> </stripe-elements>
      </elements-demo>
    `;(W.story={}).name="Generate a Source",W.story.parameters={mdxSource:'html`\n      <elements-demo label="Generate Source">\n        <stripe-elements generate="source" publishable-key="${publishableKey}"> </stripe-elements>\n      </elements-demo>\n    `'};const Z=()=>r`
      <elements-demo label="Generate Token">
        <stripe-elements generate="token" publishable-key="${g}"> </stripe-elements>
      </elements-demo>
    `;(Z.story={}).name="Generate a Token",Z.story.parameters={mdxSource:'html`\n      <elements-demo label="Generate Token">\n        <stripe-elements generate="token" publishable-key="${publishableKey}"> </stripe-elements>\n      </elements-demo>\n    `'};const J=()=>r`
      <elements-demo>
        <stripe-elements publishable-key="should-error-use-bad-key" show-error> </stripe-elements>
        <mwc-button slot="actions" outlined @click="${e=>e.target.parentElement.querySelector("stripe-elements").validate()}">Validate</mwc-button>
      </elements-demo>
    `;(J.story={}).name="Validation",J.story.parameters={mdxSource:'html`\n      <elements-demo>\n        <stripe-elements publishable-key="should-error-use-bad-key" show-error> </stripe-elements>\n        <mwc-button slot="actions" outlined @click="${event => event.target.parentElement.querySelector(\'stripe-elements\').validate()}">Validate</mwc-button>\n      </elements-demo>\n    `'};const Q=()=>r`
      <style>
      #states stripe-elements::part(stripe) {
        border-radius: 4px;
        border: 1px solid var(--mdc-button-outline-color, var(--mdc-theme-primary, #6200ee));
        box-shadow: none;
        height: 36px;
        display: flex;
        flex-flow: column;
        justify-content: center;
      }
      #states stripe-elements[complete]::part(stripe) {
        border-color: var(--material-green-a700, #00C853);
      }
      #states stripe-elements[invalid]::part(stripe) {
        border-color: var(--material-amber-a700, #FFAB00);
      }
      #states stripe-elements[error]::part(stripe) {
        border-color: var(--material-red-a700, #D50000);
      }
      #states stripe-elements::part(error) {
        text-align: right;
        color: var(--material-grey-800, #424242);
      }
      </style>
      <article id="states">
        <stripe-elements show-error publishable-key="${g}"> </stripe-elements>
        <mwc-button outlined @click="${e=>e.target.parentElement.querySelector("stripe-elements").validate()}"> Validate</mwc-button>
      </article>
    `;(Q.story={}).name="Custom Validation",Q.story.parameters={mdxSource:'html`\n      <style>\n      #states stripe-elements::part(stripe) {\n        border-radius: 4px;\n        border: 1px solid var(--mdc-button-outline-color, var(--mdc-theme-primary, #6200ee));\n        box-shadow: none;\n        height: 36px;\n        display: flex;\n        flex-flow: column;\n        justify-content: center;\n      }\n      #states stripe-elements[complete]::part(stripe) {\n        border-color: var(--material-green-a700, #00C853);\n      }\n      #states stripe-elements[invalid]::part(stripe) {\n        border-color: var(--material-amber-a700, #FFAB00);\n      }\n      #states stripe-elements[error]::part(stripe) {\n        border-color: var(--material-red-a700, #D50000);\n      }\n      #states stripe-elements::part(error) {\n        text-align: right;\n        color: var(--material-grey-800, #424242);\n      }\n      </style>\n      <article id="states">\n        <stripe-elements show-error publishable-key="${publishableKey}"> </stripe-elements>\n        <mwc-button outlined @click="${event => event.target.parentElement.querySelector(\'stripe-elements\').validate()}"> Validate</mwc-button>\n      </article>\n    `'};const ee=()=>{const e=window.fetch;window.fetch=(t,...n)=>"/my-endpoint"===t?Promise.resolve(new Response("A-OK!")):e(t,...n);const t=e=>_("#auto-post output").textContent=e;return r`
      <article id="auto-post">
        <stripe-elements
            publishable-key="${g}"
            generate="token"
            action="/my-endpoint"
            @success="${({detail:e})=>e.text().then(t)}"
        > </stripe-elements>
        <mwc-button class="generate" outlined @click="${e=>e.target.parentElement.querySelector("stripe-elements").submit()}">Submit and POST</mwc-button>
        <output> </output>
      </article>
    `};(ee.story={}).name="Automatically Posting the Payment Info",ee.story.parameters={mdxSource:'() => {\n  const originalFetch = window.fetch;\n\n  window.fetch = (url, ...args) => url === \'/my-endpoint\' ? Promise.resolve(new Response(\'A-OK!\')) : originalFetch(url, ...args);\n\n  const onClick = event => event.target.parentElement.querySelector(\'stripe-elements\').submit();\n\n  const display = x => $(\'#auto-post output\').textContent = x;\n\n  const onSuccess = ({\n    detail\n  }) => detail.text().then(display);\n\n  return html`\n      <article id="auto-post">\n        <stripe-elements\n            publishable-key="${publishableKey}"\n            generate="token"\n            action="/my-endpoint"\n            @success="${onSuccess}"\n        > </stripe-elements>\n        <mwc-button class="generate" outlined @click="${onClick}">Submit and POST</mwc-button>\n        <output> </output>\n      </article>\n    `;\n}'};const te={title:"Elements/Stripe Elements",includeStories:["enterAPublishableKey","generateAPaymentMethod","generateASource","generateAToken","validation","customValidation","automaticallyPostingThePaymentInfo"]},ne={"Enter a Publishable Key":"enterAPublishableKey","Generate a PaymentMethod":"generateAPaymentMethod","Generate a Source":"generateASource","Generate a Token":"generateAToken",Validation:"validation","Custom Validation":"customValidation","Automatically Posting the Payment Info":"automaticallyPostingThePaymentInfo"};te.parameters=te.parameters||{},te.parameters.docs={...te.parameters.docs||{},page:()=>o(s,{mdxStoryNameToKey:ne,mdxComponentMeta:te},o(q,null))};const ae=["enterAPublishableKey","generateAPaymentMethod","generateASource","generateAToken","validation","customValidation","automaticallyPostingThePaymentInfo"];export default te;export{ae as __namedExportsOrder,ee as automaticallyPostingThePaymentInfo,Q as customValidation,j as enterAPublishableKey,Y as generateAPaymentMethod,W as generateASource,Z as generateAToken,J as validation};
//# sourceMappingURL=stripe-elements.stories-9f6ad176.js.map
