function t(t,e,i,s){var r,o=arguments.length,n=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(n=(o<3?r(n):o>3?r(e,i,n):r(e,i))||n);return o>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,f=globalThis,m=f.trustedTypes,_=m?m.emptyScript:"",g=f.reactiveElementPolyfillSupport,$=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>!c(t,e),b={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);r?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty($("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($("properties"))){const t=this.properties,e=[...d(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const o=r.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const o=this.constructor;if(!1===s&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??v)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==r||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[$("elementProperties")]=new Map,x[$("finalized")]=new Map,g?.({ReactiveElement:x}),(f.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,A=t=>t,k=w.trustedTypes,E=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+C,P=`<${M}>`,O=document,z=()=>O.createComment(""),R=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,T="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,I=/>/g,L=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,D=/"/g,B=/^(?:script|style|textarea|title)$/i,q=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),F=q(1),V=q(2),W=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),G=new WeakMap,J=O.createTreeWalker(O,129);function Y(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const Z=(t,e)=>{const i=t.length-1,s=[];let r,o=2===e?"<svg>":3===e?"<math>":"",n=H;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,h=0;for(;h<i.length&&(n.lastIndex=h,c=n.exec(i),null!==c);)h=n.lastIndex,n===H?"!--"===c[1]?n=N:void 0!==c[1]?n=I:void 0!==c[2]?(B.test(c[2])&&(r=RegExp("</"+c[2],"g")),n=L):void 0!==c[3]&&(n=L):n===L?">"===c[0]?(n=r??H,l=-1):void 0===c[1]?l=-2:(l=n.lastIndex-c[2].length,a=c[1],n=void 0===c[3]?L:'"'===c[3]?D:j):n===D||n===j?n=L:n===N||n===I?n=H:(n=L,r=void 0);const d=n===L&&t[e+1].startsWith("/>")?" ":"";o+=n===H?i+P:l>=0?(s.push(a),i.slice(0,l)+S+i.slice(l)+C+d):i+C+(-2===l?e:d)}return[Y(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Q{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[c,l]=Z(t,e);if(this.el=Q.createElement(c,i),J.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=J.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(S)){const e=l[o++],i=s.getAttribute(t).split(C),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:n[2],strings:i,ctor:"."===n[1]?st:"?"===n[1]?rt:"@"===n[1]?ot:it}),s.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(B.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],z()),J.nextNode(),a.push({type:2,index:++r});s.append(t[e],z())}}}else if(8===s.nodeType)if(s.data===M)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)a.push({type:7,index:r}),t+=C.length-1}r++}}static createElement(t,e){const i=O.createElement("template");return i.innerHTML=t,i}}function X(t,e,i=t,s){if(e===W)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const o=R(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=X(t,r._$AS(t,e.values),r,s)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??O).importNode(e,!0);J.currentNode=s;let r=J.nextNode(),o=0,n=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new et(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new nt(r,this,t)),this._$AV.push(e),a=i[++n]}o!==a?.index&&(r=J.nextNode(),o++)}return J.currentNode=O,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),R(t)?t===K||null==t||""===t?(this._$AH!==K&&this._$AR(),this._$AH=K):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==K&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Q.createElement(Y(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new tt(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=G.get(t.strings);return void 0===e&&G.set(t.strings,e=new Q(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new et(this.O(z()),this.O(z()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=K,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=K}_$AI(t,e=this,i,s){const r=this.strings;let o=!1;if(void 0===r)t=X(this,t,e,0),o=!R(t)||t!==this._$AH&&t!==W,o&&(this._$AH=t);else{const s=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=X(this,s[i+n],e,n),a===W&&(a=this._$AH[n]),o||=!R(a)||a!==this._$AH[n],a===K?t=K:t!==K&&(t+=(a??"")+r[n+1]),this._$AH[n]=a}o&&!s&&this.j(t)}j(t){t===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===K?void 0:t}}class rt extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==K)}}class ot extends it{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??K)===W)return;const i=this._$AH,s=t===K&&i!==K||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==K&&(i===K||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(Q,et),(w.litHtmlVersions??=[]).push("3.3.3");const ct=globalThis;class lt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new et(e.insertBefore(z(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}lt._$litElement$=!0,lt.finalized=!0,ct.litElementHydrateSupport?.({LitElement:lt});const ht=ct.litElementPolyfillSupport;ht?.({LitElement:lt}),(ct.litElementVersions??=[]).push("4.2.2");const dt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ut={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:v},pt=(t=ut,e,i)=>{const{kind:s,metadata:r}=i;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ft(t){return(e,i)=>"object"==typeof i?pt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function mt(t){return ft({...t,state:!0,attribute:!1})}const _t="eta-flow-card",gt={puffer:{id:"puffer",label:"Puffer",icon:"mdi:storage-tank",color:"#4caf50",x:200,y:200,radius:42,kind:"circle"},solar:{id:"solar",label:"Solar",icon:"mdi:solar-power-variant",color:"#ff9800",x:200,y:56,radius:34,kind:"circle"},kessel:{id:"kessel",label:"Kessel",icon:"mdi:fire",color:"#9c27b0",x:200,y:344,radius:34,kind:"circle"},warmwasser:{id:"warmwasser",label:"Warmwasser",icon:"mdi:water-boiler",color:"#03a9f4",x:56,y:200,radius:34,kind:"circle"},heizkreis:{id:"heizkreis",label:"Heizkreis",icon:"mdi:radiator",color:"#f44336",x:344,y:200,radius:34,kind:"circle"},heizkreis2:{id:"heizkreis2",label:"Heizkreis 2",icon:"mdi:heating-coil",color:"#ec407a",x:322,y:322,radius:30,kind:"circle"},aussen:{id:"aussen",label:"Außen",icon:"mdi:thermometer",color:"#78909c",x:346,y:54,radius:24,kind:"badge"},vorrat:{id:"vorrat",label:"Vorrat",icon:"mdi:silo",color:"#a1887f",x:54,y:346,radius:24,kind:"gauge"}},$t="Pumpe",yt="mdi:pump",vt=15,bt="#4caf50",xt=34,wt="mdi:circle-outline",At="circle",kt=[{key:"solar_to_puffer",from:"solar",to:"puffer"},{key:"kessel_to_puffer",from:"kessel",to:"puffer"},{key:"puffer_to_warmwasser",from:"puffer",to:"warmwasser"},{key:"puffer_to_heizkreis",from:"puffer",to:"heizkreis"},{key:"puffer_to_heizkreis2",from:"puffer",to:"heizkreis2"}],Et=[{from:"aussen",to:"heizkreis"}];function St(t,e){if(!e)return;const i=t.states[e];if(!i)return;const s=Number(i.state);return Number.isFinite(s)?s:void 0}function Ct(t){return 3-2.1*Math.max(0,Math.min(1,t))}function Mt(t,e){return t.type??(void 0!==St(e,t.entity)?"power":"state")}function Pt(t,e){const i={active:!1,duration:3,reverse:!1};if(!t)return i;const s=t.threshold??0,r=Mt(t,e);if("power"===r){const r=St(e,t.entity);if(void 0===r)return i;const o=Math.abs(r);if(o<=s)return i;const n=t.power_reference??5e3;return{active:!0,duration:Ct(Math.min(1,o/n+.15)),reverse:r<0!=!!t.invert}}if("delta"===r){const r=St(e,t.from_entity),o=St(e,t.to_entity);if(void 0===r||void 0===o)return i;const n=r-o;if(n<=s)return i;return{active:!0,duration:Ct(Math.min(1,n/30+.15)),reverse:!!t.invert}}const o=t.entity?e.states[t.entity]:void 0;if(!o)return i;return{active:(t.active_states??["on"]).includes(o.state),duration:Ct(.6),reverse:!!t.invert}}function Ot(t,e,i=["on"]){if(!e)return!1;const s=t.states[e];return!!s&&i.includes(s.state)}function zt(t){return`hsl(${210-(Math.max(20,Math.min(80,t))-20)/60*210}, 72%, 50%)`}function Rt(t,e){if(!e)return;const i=t.states[e];if(!i)return;const s=i.attributes?.unit_of_measurement,r=Number(i.state),o=Number.isFinite(r)?String(Math.round(10*r)/10):i.state;return s?`${o} ${s}`:o}function Ut(t,e){if(!t||!t.primary)return{available:!1};const i=Rt(e,t.primary);return{primary:i,secondary:Rt(e,t.secondary),state:t.state?e.states[t.state]?.state:void 0,available:void 0!==i}}const Tt=n`
  /*
   * Follow the active Home Assistant theme so the card blends with every other
   * card in both light and dark themes. The hardcoded values are dark-theme
   * fallbacks for when a theme variable is missing.
   *
   * The node fill is derived from the card background (nudged toward the text
   * color for a subtle raised look) rather than from --secondary-background-color,
   * which some themes leave light even in dark mode — leaving nodes glaringly
   * white at night. Deriving from the card background always tracks light/dark.
   */
  :host {
    --eta-line: var(--divider-color, #565656);
    --eta-text: var(--primary-text-color, #e1e1e1);
    --eta-text-dim: var(--secondary-text-color, #9e9e9e);
    --eta-node-fill: color-mix(
      in srgb,
      var(--card-background-color, #1c1c1c),
      var(--primary-text-color, #e1e1e1) 12%
    );
  }

  ha-card {
    /* inherit the standard themed card background instead of forcing dark */
    padding: 8px 8px 4px;
    overflow: hidden;
  }

  .title {
    color: var(--eta-text-dim);
    font-size: 0.95rem;
    padding: 6px 8px 2px;
  }

  .flow {
    width: 100%;
    aspect-ratio: 1 / 1;
    display: block;
  }

  /* clickable nodes open the entity's more-info dialog */
  .clickable {
    cursor: pointer;
  }
  .clickable:hover .ring,
  .clickable:hover .badge {
    filter: brightness(1.12);
  }

  /* wide invisible hit target so a thin edge is easy to click */
  .edge-hit {
    stroke: transparent;
    stroke-width: 18;
    fill: none;
    cursor: pointer;
    pointer-events: stroke;
  }

  /* connecting lines */
  .edge-line {
    stroke: var(--eta-line);
    stroke-width: 2;
    fill: none;
  }

  /* control link (e.g. outside temp -> heating circuit) */
  .ctrl-line {
    stroke: var(--eta-text-dim);
    stroke-width: 1.2;
    stroke-dasharray: 3 4;
    fill: none;
    opacity: 0.5;
  }

  .dot {
    fill: currentColor;
  }

  /* edge value label */
  .edge-label {
    fill: var(--eta-text-dim);
    font-size: 10px;
    text-anchor: middle;
    font-variant-numeric: tabular-nums;
  }

  /* node circles (outline thickness set per-node via the stroke-width attribute) */
  .ring {
    fill: var(--eta-node-fill);
  }
  /* dim only the outline for inactive nodes — the fill must stay opaque so the
     edge line behind the node is never visible through it */
  .ring.inactive {
    stroke-opacity: 0.5;
  }
  .ring.active {
    filter: drop-shadow(0 0 5px currentColor);
  }

  /* stratified buffer fill */
  .strat-fill {
    opacity: 0.82;
  }

  .node-primary {
    fill: var(--eta-text);
    font-size: 15px;
    text-anchor: middle;
    font-weight: 500;
  }
  .node-secondary {
    fill: var(--eta-text-dim);
    font-size: 12px;
    text-anchor: middle;
  }
  .node-label {
    fill: var(--eta-text-dim);
    font-size: 13px;
    text-anchor: middle;
  }

  /* text state pill (e.g. boiler Bereit/Heizen) */
  .pill-bg {
    fill: currentColor;
    opacity: 0.22;
  }
  .pill-text {
    fill: var(--eta-text);
    text-anchor: middle;
  }

  /* corner badge (Außentemperatur, Pelletvorrat) */
  .badge {
    fill: var(--eta-node-fill);
  }
  .badge-text {
    fill: var(--eta-text);
    font-size: 12px;
    text-anchor: middle;
  }

  /* badge fill gauge */
  .gauge-bg {
    fill: currentColor;
    opacity: 0.2;
  }
  .gauge-fill {
    fill: currentColor;
  }

  /* pump glyph (any edge) */
  .pump-ring {
    fill: var(--eta-node-fill);
    stroke-width: 2;
  }
  .pump-ring.inactive {
    stroke-opacity: 0.5;
  }
  .pump-ring.active {
    filter: drop-shadow(0 0 4px currentColor);
  }
  .pump-label {
    fill: var(--eta-text-dim);
    font-size: 11px;
    text-anchor: start;
  }

  /*
   * Icons are an HTML overlay on top of the SVG, positioned in % of the (square) flow
   * area — never inside a foreignObject, which WebKit fails to scale with the viewBox.
   * The wrapper is a query container so icon size can scale via cqw.
   */
  .flow-wrap {
    position: relative;
    container-type: inline-size;
  }
  .icon-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .node-icon {
    position: absolute;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--eta-text);
    pointer-events: none;
  }
  .node-icon.pump.on {
    animation: spin-centered 1.6s linear infinite;
    filter: drop-shadow(0 0 3px currentColor);
  }
  /* keep the centering translate while rotating */
  @keyframes spin-centered {
    from {
      transform: translate(-50%, -50%) rotate(0);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;var Ht,Nt;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(Ht||(Ht={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(Nt||(Nt={}));let It=class extends lt{setConfig(t){this._config={nodes:{},...t}}render(){return this._config&&this.hass?F`
      <div class="card-config">
        <ha-textfield
          label="Title"
          .value=${this._config.title??""}
          @input=${this._titleChanged}
        ></ha-textfield>

        <p class="hint">
          Map an entity to each node. Leave a node empty to hide it. Connecting lines
          (<code>edges</code>) and per-edge flow behaviour are configured in YAML — see the README.
        </p>

        ${Object.values(gt).map(t=>this._renderNodeRow(t.id,t.label))}

        <h4>Solarpumpe</h4>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config.solarpumpe?.entity??""}
          allow-custom-entity
          @value-changed=${this._solarpumpeChanged}
        ></ha-entity-picker>
      </div>
    `:K}_renderNodeRow(t,e){const i=this._config.nodes?.[t]??{};return F`
      <div class="node-row">
        <span class="node-name">${e}</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${i.primary??""}
          label="Primary"
          allow-custom-entity
          @value-changed=${e=>this._nodeChanged(t,"primary",e)}
        ></ha-entity-picker>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${i.secondary??""}
          label="Secondary (optional)"
          allow-custom-entity
          @value-changed=${e=>this._nodeChanged(t,"secondary",e)}
        ></ha-entity-picker>
      </div>
    `}_titleChanged(t){const e=t.target.value;this._emit({...this._config,title:e||void 0})}_nodeChanged(t,e,i){const s=i.detail?.value,r={...this._config.nodes??{}},o={...r[t]??{}};s?o[e]=s:delete o[e],r[t]=o,this._emit({...this._config,nodes:r})}_solarpumpeChanged(t){const e=t.detail?.value,i=e?{...this._config.solarpumpe,entity:e}:void 0;this._emit({...this._config,solarpumpe:i})}_emit(t){this._config=t,function(t,e,i,s){s=s||{},i=null==i?{}:i;var r=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});r.detail=i,t.dispatchEvent(r)}(this,"config-changed",{config:t})}};It.styles=n`
    .card-config {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    ha-textfield {
      width: 100%;
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
      margin: 4px 0;
    }
    .node-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 6px 0;
      border-top: 1px solid var(--divider-color);
    }
    .node-name {
      font-weight: 600;
    }
  `,t([ft({attribute:!1})],It.prototype,"hass",void 0),t([mt()],It.prototype,"_config",void 0),It=t([dt("eta-flow-card-editor")],It),console.info("%c ETA-FLOW-CARD %c v0.2.4 ","color: #fff; background: #4caf50; font-weight: 700;","color: #4caf50; background: #1c1c1c;"),window.customCards=window.customCards||[],window.customCards.push({type:_t,name:"ETA Flow Card",description:"Animated heat-flow visualization for ETA heating systems (pellet, log & solar).",preview:!0,documentationURL:"https://github.com/orazefabian/eta-flow"});const Lt=(t,e,i)=>Math.max(e,Math.min(i,t));function jt(t,e,i,s,r=4){const o=e.x-t.x,n=e.y-t.y,a=Math.hypot(o,n)||1,c=o/a,l=n/a;return{x1:t.x+c*(i+r),y1:t.y+l*(i+r),x2:e.x-c*(s+r),y2:e.y-l*(s+r)}}let Dt=class extends lt{static async getConfigElement(){return document.createElement("eta-flow-card-editor")}static getStubConfig(){return{type:`custom:${_t}`,title:"Heizung",nodes:{puffer:{},solar:{},kessel:{},warmwasser:{},heizkreis:{},aussen:{}}}}setConfig(t){if(!t)throw new Error("Invalid configuration");this._config={nodes:{},edges:{},...t}}getCardSize(){return 6}render(){if(!this._config||!this.hass)return K;const t=this._nodeIds().filter(t=>this._nodeVisible(t)),e=this._resolvedEdges().filter(e=>t.includes(e.from)&&t.includes(e.to)),i=(this._config.control_links??Et).filter(e=>t.includes(e.from)&&t.includes(e.to)),s=[];for(const e of t){const t="circle"===this._nodeKind(e)?this._circleIconSpec(e):this._badgeIconSpec(e);t&&s.push(t)}for(const t of e){const e=this._pumpIconSpec(t);e&&s.push(e)}const r=this._config.node_background?`--eta-node-fill: ${this._config.node_background}`:K;return F`
      <ha-card style=${r}>
        ${this._config.title?F`<div class="title">${this._config.title}</div>`:K}
        <div class="flow-wrap">
          <svg class="flow" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
            ${i.map(t=>this._renderControlLink(t.from,t.to))}
            ${e.map(t=>this._renderEdge(t))} ${e.map(t=>this._renderPump(t))}
            ${t.map(t=>this._renderNode(t,e))}
          </svg>
          ${this._iconOverlay(s)}
        </div>
      </ha-card>
    `}_nodeIds(){const t=Object.keys(gt);for(const e of Object.keys(this._config.nodes??{}))t.includes(e)||t.push(e);return t}_cfg(t){return this._config.nodes?.[t]}_geom(t){const e=this._cfg(t),i=gt[t],s=e?.x??i?.x,r=e?.y??i?.y;if(void 0!==s&&void 0!==r)return{x:s,y:r}}_nodeKind(t){return this._cfg(t)?.kind??gt[t]?.kind??At}_nodeColor(t){return this._cfg(t)?.color??gt[t]?.color??bt}_nodeRadius(t){return this._cfg(t)?.radius??gt[t]?.radius??xt}_nodeStroke(t){return this._cfg(t)?.stroke_width??2.5}_nodeIcon(t){return this._cfg(t)?.icon??gt[t]?.icon??wt}_nodeLabel(t){return this._cfg(t)?.name??gt[t]?.label??t}_hasData(t){return!!(t?.primary||t?.level||t?.layers?.length)}_nodeEntity(t){const e=this._cfg(t);return e?.primary??e?.level??e?.state??e?.secondary??e?.layers?.[0]}_edgeEntity(t){const e=this._config.edges?.[t];return e?.entity??e?.label_entity??e?.from_entity}_openMoreInfo(t){t&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))}_iconOverlay(t){return t.length?F`
      <div class="icon-overlay">
        ${t.map(t=>F`
            <ha-icon
              class=${`node-icon ${t.cls}`.trim()}
              icon=${t.icon}
              style=${`left:${t.cx/4}%;top:${t.cy/4}%;--mdc-icon-size:${t.size/4}cqw;`}
            ></ha-icon>
          `)}
      </div>
    `:K}_circleIconSpec(t){const e=this._geom(t);if(!e)return;const i=Ut(this._cfg(t),this.hass),s=this._nodeRadius(t),r=!!i.state||!!i.secondary,o=Lt(Math.round(.62*s),14,40),n=r?e.y-.42*s:e.y-.3*s;return{icon:this._nodeIcon(t),cx:e.x,cy:n,size:o,cls:""}}_badgeIconSpec(t){const e=this._geom(t);if(!e)return;const i=this._nodeRadius(t),s=Lt(Math.round(.66*i),14,28);return{icon:this._nodeIcon(t),cx:e.x,cy:e.y-.44*i,size:s,cls:""}}_pumpIconSpec(t){const e=this._edgePump(t.key);if(!e?.entity)return;const i=this._geom(t.from),s=this._geom(t.to);if(!i||!s)return;const r=Ot(this.hass,e.entity,e.active_states),o=Math.round(.95*vt);return{icon:e.icon??yt,cx:(i.x+s.x)/2,cy:(i.y+s.y)/2,size:o,cls:("pump "+(r?"on":"")).trim()}}_nodeVisible(t){const e=this._cfg(t);return!e?.hidden&&(!!this._geom(t)&&(this._hasData(e)||"puffer"===t))}_resolvedEdges(){const t=new Map(kt.map(t=>[t.key,t])),e=new Set([...t.keys(),...Object.keys(this._config.edges??{})]),i=[];for(const s of e){const e=this._config.edges?.[s],r=t.get(s),o=e?.from??r?.from,n=e?.to??r?.to;o&&n&&i.push({key:s,from:o,to:n})}return i}_renderEdge(t){const e=this._geom(t.from),i=this._geom(t.to);if(!e||!i)return K;const{x1:s,y1:r,x2:o,y2:n}=jt(e,i,this._nodeRadius(t.from),this._nodeRadius(t.to)),a=`edge-${t.key}`,c=`M ${s} ${r} L ${o} ${n}`,l=this._config.edges?.[t.key],h=Pt(l,this.hass),d=this._nodeColor(h.reverse?t.to:t.from),u=l?.show_label??this._config.show_edge_labels??!1?function(t,e){if(!t)return;if(t.label_entity)return Rt(e,t.label_entity);const i=Mt(t,e);if("power"===i)return Rt(e,t.entity);if("delta"===i){const i=St(e,t.from_entity),s=St(e,t.to_entity);if(void 0===i||void 0===s)return;return`Δ${Math.round(10*(i-s))/10}°`}}(l,this.hass):void 0;let p=K;if(u){const s=(e.x+i.x)/2,r=(e.y+i.y)/2,o=Math.hypot(i.x-e.x,i.y-e.y)||1,n=-(i.y-e.y)/o,a=(i.x-e.x)/o,c=this._edgePump(t.key)?22:11;p=V`<text class="edge-label" x=${s+n*c} y=${r+a*c}
        dominant-baseline="central">${u}</text>`}const f=this._edgeEntity(t.key);return V`
      <path id=${a} class="edge-line" d=${c}></path>
      ${h.active?this._renderDots(a,h.duration,h.reverse,d):K}
      ${p}
      ${f?V`<path class="edge-hit" d=${c} @click=${()=>this._openMoreInfo(f)}></path>`:K}
    `}_renderDots(t,e,i,s){const r=i?"1;0":"0;1";return V`${Array.from({length:3},(i,o)=>V`
        <circle class="dot" r="3.5" style=${`color:${s}`}>
          <animateMotion
            dur=${`${e}s`}
            begin=${`-${e/3*o}s`}
            repeatCount="indefinite"
            keyPoints=${r}
            keyTimes="0;1"
            calcMode="linear"
          >
            <mpath href=${`#${t}`}></mpath>
          </animateMotion>
        </circle>`)}`}_renderControlLink(t,e){const i=this._geom(t),s=this._geom(e);if(!i||!s)return K;const{x1:r,y1:o,x2:n,y2:a}=jt(i,s,this._nodeRadius(t),this._nodeRadius(e),2);return V`<path class="ctrl-line" d=${`M ${r} ${o} L ${n} ${a}`}></path>`}_edgePump(t){const e=this._config.edges?.[t]?.pump;return e?.entity?e:"solar_to_puffer"===t&&this._config.solarpumpe?.entity?this._config.solarpumpe:void 0}_renderPump(t){const e=this._edgePump(t.key);if(!e?.entity)return K;const i=this._geom(t.from),s=this._geom(t.to);if(!i||!s)return K;const r=(i.x+s.x)/2,o=(i.y+s.y)/2,n=Ot(this.hass,e.entity,e.active_states),a=e.color??this._nodeColor(t.from),c=vt,l=e.name??$t;return V`
      <g style=${`color:${a}`} class="clickable" @click=${()=>this._openMoreInfo(e.entity)}>
        <circle
          class=${"pump-ring "+(n?"active":"inactive")}
          cx=${r}
          cy=${o}
          r=${c}
          stroke="currentColor"
        ></circle>
        ${e.hide_label?K:V`<text class="pump-label" x=${r+c+5} y=${o} dominant-baseline="central">${l}</text>`}
      </g>
    `}_renderNode(t,e){return"circle"===this._nodeKind(t)?this._renderCircle(t,e):this._renderBadge(t)}_renderCircle(t,e){const i=this._geom(t);if(!i)return K;const s=this._cfg(t),r=Ut(s,this.hass),o=this._nodeColor(t),n=this._nodeRadius(t),a=this._nodeActive(t,e),c=!!r.state,l=!c&&!!r.secondary,h=c||l,d=Lt(.36*n,12,22).toFixed(1),u=Lt(.28*n,10,16).toFixed(1),p=Lt(.3*n,11,16).toFixed(1),f=h?i.y+.04*n:i.y+.36*n,m=i.y+.44*n,_=i.y+n+.8*Number(p)+3,g=!(!s?.level&&!s?.layers?.length),$=this._nodeEntity(t);return V`
      <g
        style=${`color:${o}`}
        class=${$?"clickable":""}
        @click=${()=>this._openMoreInfo($)}
      >
        <circle
          class=${"ring "+(a?"active":"inactive")}
          cx=${i.x}
          cy=${i.y}
          r=${n}
          stroke="currentColor"
          stroke-width=${this._nodeStroke(t)}
        ></circle>
        ${g?this._renderStratFill(t,i,n,s,o):K}
        ${r.primary?V`<text
                class="node-primary"
                x=${i.x}
                y=${f}
                dominant-baseline="central"
                style=${`font-size:${d}px`}
              >${r.primary}</text>`:K}
        ${c?this._renderPill(i.x,m,n,r.state):K}
        ${l?V`<text
                class="node-secondary"
                x=${i.x}
                y=${m}
                dominant-baseline="central"
                style=${`font-size:${u}px`}
              >${r.secondary}</text>`:K}
        <text
          class="node-label"
          x=${i.x}
          y=${_}
          dominant-baseline="central"
          style=${`font-size:${p}px`}
        >${this._nodeLabel(t)}</text>
      </g>
    `}_renderStratFill(t,e,i,s,r){const o=function(t,e){const i=St(e,t?.level??t?.primary);if(void 0!==i)return Math.max(0,Math.min(1,i/100))}(s,this.hass);if(void 0===o||o<=0)return K;const n=this._nodeStroke(t),a=Math.max(0,i-n-.5),c=2*a*o,l=`${t}-clip`,h=`${t}-grad`,d=(s?.layers??[]).map(t=>St(this.hass,t)).filter(t=>void 0!==t);let u,p=K;if(d.length>=2){const t=d.map((t,e)=>{const i=e/(d.length-1)*100;return V`<stop offset=${`${i}%`} stop-color=${zt(t)}></stop>`});p=V`<linearGradient id=${h} x1="0" y1="0" x2="0" y2="1">${t}</linearGradient>`,u=`url(#${h})`}else u=1===d.length?zt(d[0]):r;return V`
      <defs>
        ${p}
        <clipPath id=${l}><circle cx=${e.x} cy=${e.y} r=${a}></circle></clipPath>
      </defs>
      <rect
        class="strat-fill"
        x=${e.x-a}
        y=${e.y+a-c}
        width=${2*a}
        height=${c}
        fill=${u}
        clip-path=${`url(#${l})`}
      ></rect>
    `}_renderPill(t,e,i,s){const r=Lt(.26*i,9,13),o=Math.min(2*i-6,s.length*r*.62+10),n=r+6;return V`
      <rect class="pill-bg" x=${t-o/2} y=${e-n/2} width=${o} height=${n} rx=${n/2}></rect>
      <text class="pill-text" x=${t} y=${e} dominant-baseline="central" style=${`font-size:${r}px`}>${s}</text>
    `}_renderBadge(t){const e=this._geom(t);if(!e)return K;const i=this._cfg(t),s=Ut(i,this.hass),r=this._nodeColor(t),o=this._nodeRadius(t),n="gauge"===this._nodeKind(t)||!0===i?.gauge?function(t,e){const i=St(e,t?.primary);if(void 0===i)return;const s=t?.min??0,r=t?.max??100;return r<=s?void 0:Math.max(0,Math.min(1,(i-s)/(r-s)))}(i,this.hass):void 0,a=e.y+.2*o,c=this._nodeEntity(t);return V`
      <g
        style=${`color:${r}`}
        class=${c?"clickable":""}
        @click=${()=>this._openMoreInfo(c)}
      >
        <circle
          class="badge"
          cx=${e.x}
          cy=${e.y}
          r=${o}
          stroke="currentColor"
          stroke-width=${this._nodeStroke(t)}
        ></circle>
        ${s.primary?V`<text class="badge-text" x=${e.x} y=${a} dominant-baseline="central">${s.primary}</text>`:K}
        ${void 0!==n?V`
              <rect class="gauge-bg" x=${e.x-.6*o} y=${e.y+.5*o} width=${1.2*o} height="4" rx="2"></rect>
              <rect class="gauge-fill" x=${e.x-.6*o} y=${e.y+.5*o} width=${1.2*o*n} height="4" rx="2"></rect>`:K}
        <text class="node-label" x=${e.x} y=${e.y+o+12} dominant-baseline="central">${this._nodeLabel(t)}</text>
      </g>
    `}_nodeActive(t,e){return e.filter(e=>e.from===t||e.to===t).some(t=>Pt(this._config.edges?.[t.key],this.hass).active)}};Dt.styles=Tt,t([ft({attribute:!1})],Dt.prototype,"hass",void 0),t([mt()],Dt.prototype,"_config",void 0),Dt=t([dt(_t)],Dt);export{Dt as EtaFlowCard};
