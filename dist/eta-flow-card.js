function t(t,e,i,o){var n,s=arguments.length,r=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),n=new WeakMap;let s=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[o+1],t[0]);return new s(i,t,o)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new s("string"==typeof t?t:t+"",void 0,o))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:u,getPrototypeOf:f}=Object,p=globalThis,_=p.trustedTypes,m=_?_.emptyScript:"",g=p.reactiveElementPolyfillSupport,y=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!c(t,e),b={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(t,i,e);void 0!==o&&l(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){const{get:o,set:n}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const s=o?.call(this);n?.call(this,e),this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=f(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...d(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,o)=>{if(i)t.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of o){const o=document.createElement("style"),n=e.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=i.cssText,t.appendChild(o)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,i);if(void 0!==o&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,o=i._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=i.getPropertyOptions(o),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=o;const s=n.fromAttribute(e,t.type);this[o]=s??this._$Ej?.get(o)??s,this._$Em=null}}requestUpdate(t,e,i,o=!1,n){if(void 0!==t){const s=this.constructor;if(!1===o&&(n=this[t]),i??=s.getPropertyOptions(t),!((i.hasChanged??$)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:o,wrapped:n},s){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),!0!==n||void 0!==s)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,i,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[y("elementProperties")]=new Map,x[y("finalized")]=new Map,g?.({ReactiveElement:x}),(p.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,k=t=>t,A=w.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+C,P=`<${M}>`,z=document,O=()=>z.createComment(""),N=t=>null===t||"object"!=typeof t&&"function"!=typeof t,L=Array.isArray,T="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,U=/>/g,j=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,I=/"/g,F=/^(?:script|style|textarea|title)$/i,B=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),q=B(1),W=B(2),V=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),Y=new WeakMap,G=z.createTreeWalker(z,129);function J(t,e){if(!L(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const Z=(t,e)=>{const i=t.length-1,o=[];let n,s=2===e?"<svg>":3===e?"<math>":"",r=H;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,h=0;for(;h<i.length&&(r.lastIndex=h,c=r.exec(i),null!==c);)h=r.lastIndex,r===H?"!--"===c[1]?r=R:void 0!==c[1]?r=U:void 0!==c[2]?(F.test(c[2])&&(n=RegExp("</"+c[2],"g")),r=j):void 0!==c[3]&&(r=j):r===j?">"===c[0]?(r=n??H,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?j:'"'===c[3]?I:D):r===I||r===D?r=j:r===R||r===U?r=H:(r=j,n=void 0);const d=r===j&&t[e+1].startsWith("/>")?" ":"";s+=r===H?i+P:l>=0?(o.push(a),i.slice(0,l)+E+i.slice(l)+C+d):i+C+(-2===l?e:d)}return[J(t,s+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class Q{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let n=0,s=0;const r=t.length-1,a=this.parts,[c,l]=Z(t,e);if(this.el=Q.createElement(c,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=G.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(E)){const e=l[s++],i=o.getAttribute(t).split(C),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:r[2],strings:i,ctor:"."===r[1]?ot:"?"===r[1]?nt:"@"===r[1]?st:it}),o.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:n}),o.removeAttribute(t));if(F.test(o.tagName)){const t=o.textContent.split(C),e=t.length-1;if(e>0){o.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)o.append(t[i],O()),G.nextNode(),a.push({type:2,index:++n});o.append(t[e],O())}}}else if(8===o.nodeType)if(o.data===M)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=o.data.indexOf(C,t+1));)a.push({type:7,index:n}),t+=C.length-1}n++}}static createElement(t,e){const i=z.createElement("template");return i.innerHTML=t,i}}function X(t,e,i=t,o){if(e===V)return e;let n=void 0!==o?i._$Co?.[o]:i._$Cl;const s=N(e)?void 0:e._$litDirective$;return n?.constructor!==s&&(n?._$AO?.(!1),void 0===s?n=void 0:(n=new s(t),n._$AT(t,i,o)),void 0!==o?(i._$Co??=[])[o]=n:i._$Cl=n),void 0!==n&&(e=X(t,n._$AS(t,e.values),n,o)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,o=(t?.creationScope??z).importNode(e,!0);G.currentNode=o;let n=G.nextNode(),s=0,r=0,a=i[0];for(;void 0!==a;){if(s===a.index){let e;2===a.type?e=new et(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new rt(n,this,t)),this._$AV.push(e),a=i[++r]}s!==a?.index&&(n=G.nextNode(),s++)}return G.currentNode=z,o}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,o){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),N(t)?t===K||null==t||""===t?(this._$AH!==K&&this._$AR(),this._$AH=K):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>L(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==K&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,o="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Q.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new tt(o,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=Y.get(t.strings);return void 0===e&&Y.set(t.strings,e=new Q(t)),e}k(t){L(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const n of t)o===e.length?e.push(i=new et(this.O(O()),this.O(O()),this,this.options)):i=e[o],i._$AI(n),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}let it=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,o,n){this.type=1,this._$AH=K,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=K}_$AI(t,e=this,i,o){const n=this.strings;let s=!1;if(void 0===n)t=X(this,t,e,0),s=!N(t)||t!==this._$AH&&t!==V,s&&(this._$AH=t);else{const o=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=X(this,o[i+r],e,r),a===V&&(a=this._$AH[r]),s||=!N(a)||a!==this._$AH[r],a===K?t=K:t!==K&&(t+=(a??"")+n[r+1]),this._$AH[r]=a}s&&!o&&this.j(t)}j(t){t===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}};class ot extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===K?void 0:t}}class nt extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==K)}}class st extends it{constructor(t,e,i,o,n){super(t,e,i,o,n),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??K)===V)return;const i=this._$AH,o=t===K&&i!==K||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==K&&(i===K||o);o&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}let rt=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}};const at=w.litHtmlPolyfillSupport;at?.(Q,et),(w.litHtmlVersions??=[]).push("3.3.3");const ct=globalThis;let lt=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const o=i?.renderBefore??e;let n=o._$litPart$;if(void 0===n){const t=i?.renderBefore??null;o._$litPart$=n=new et(e.insertBefore(O(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};lt._$litElement$=!0,lt.finalized=!0,ct.litElementHydrateSupport?.({LitElement:lt});const ht=ct.litElementPolyfillSupport;ht?.({LitElement:lt}),(ct.litElementVersions??=[]).push("4.2.2");const dt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ut={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:$},ft=(t=ut,e,i)=>{const{kind:o,metadata:n}=i;let s=globalThis.litPropertyMetadata.get(n);if(void 0===s&&globalThis.litPropertyMetadata.set(n,s=new Map),"setter"===o&&((t=Object.create(t)).wrapped=!0),s.set(i.name,t),"accessor"===o){const{name:o}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(o,n,t,!0,i)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===o){const{name:o}=i;return function(i){const n=this[o];e.call(this,i),this.requestUpdate(o,n,t,!0,i)}}throw Error("Unsupported decorator location: "+o)};function pt(t){return(e,i)=>"object"==typeof i?ft(t,e,i):((t,e,i)=>{const o=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),o?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function _t(t){return pt({...t,state:!0,attribute:!1})}var mt,gt;function yt(){return(yt=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(t[o]=i[o])}return t}).apply(this,arguments)}!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(mt||(mt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(gt||(gt={}));var vt=function(t,e,i){var o=e?function(t){switch(t.number_format){case mt.comma_decimal:return["en-US","en"];case mt.decimal_comma:return["de","es","it"];case mt.space_comma:return["fr","sv","cs"];case mt.system:return;default:return t.language}}(e):void 0;if(Number.isNaN=Number.isNaN||function t(e){return"number"==typeof e&&t(e)},(null==e?void 0:e.number_format)!==mt.none&&!Number.isNaN(Number(t))&&Intl)try{return new Intl.NumberFormat(o,$t(t,i)).format(Number(t))}catch(e){return console.error(e),new Intl.NumberFormat(void 0,$t(t,i)).format(Number(t))}return"string"==typeof t?t:function(t,e){return void 0===e&&(e=2),Math.round(t*Math.pow(10,e))/Math.pow(10,e)}(t,null==i?void 0:i.maximumFractionDigits).toString()+("currency"===(null==i?void 0:i.style)?" "+i.currency:"")},$t=function(t,e){var i=yt({maximumFractionDigits:2},e);if("string"!=typeof t)return i;if(!e||!e.minimumFractionDigits&&!e.maximumFractionDigits){var o=t.indexOf(".")>-1?t.split(".")[1].length:0;i.minimumFractionDigits=o,i.maximumFractionDigits=o}return i},bt=["closed","locked","off"],xt=function(t,e,i,o){o=o||{},i=null==i?{}:i;var n=new Event(e,{bubbles:void 0===o.bubbles||o.bubbles,cancelable:Boolean(o.cancelable),composed:void 0===o.composed||o.composed});return n.detail=i,t.dispatchEvent(n),n},wt=function(t){xt(window,"haptic",t)},kt=function(t,e,i,o){if(o||(o={action:"more-info"}),!o.confirmation||o.confirmation.exemptions&&o.confirmation.exemptions.some(function(t){return t.user===e.user.id})||(wt("warning"),confirm(o.confirmation.text||"Are you sure you want to "+o.action+"?")))switch(o.action){case"more-info":(i.entity||i.camera_image)&&xt(t,"hass-more-info",{entityId:i.entity?i.entity:i.camera_image});break;case"navigate":o.navigation_path&&function(t,e,i){void 0===i&&(i=!1),i?history.replaceState(null,"",e):history.pushState(null,"",e),xt(window,"location-changed",{replace:i})}(0,o.navigation_path);break;case"url":o.url_path&&window.open(o.url_path);break;case"toggle":i.entity&&(function(t,e){(function(t,e,i){void 0===i&&(i=!0);var o,n=function(t){return t.substr(0,t.indexOf("."))}(e),s="group"===n?"homeassistant":n;switch(n){case"lock":o=i?"unlock":"lock";break;case"cover":o=i?"open_cover":"close_cover";break;default:o=i?"turn_on":"turn_off"}t.callService(s,o,{entity_id:e})})(t,e,bt.includes(t.states[e].state))}(e,i.entity),wt("success"));break;case"call-service":if(!o.service)return void wt("failure");var n=o.service.split(".",2);e.callService(n[0],n[1],o.service_data,o.target),wt("success");break;case"fire-dom-event":xt(t,"ll-custom",o)}};function At(t){return void 0!==t&&"none"!==t.action}const St=6;class Et{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const Ct=["touchstart","mousedown"],Mt=["touchend","touchcancel","mouseup","click"];function Pt(t,e){t.dispatchEvent(new CustomEvent("action",{detail:{action:e},bubbles:!0,composed:!0}))}function zt(t,e){if(function(t){const e=t.__etaActionHandler;if(e){for(const i of Ct)e.start&&t.removeEventListener(i,e.start);for(const i of Mt)e.end&&t.removeEventListener(i,e.end);t.__etaActionHandler=void 0}}(t),e.disabled)return;let i,o,n=!1;const s=()=>{n=!1,e.hasHold&&(i=window.setTimeout(()=>{n=!0,Pt(t,"hold")},500))},r=s=>{void 0!==i&&(clearTimeout(i),i=void 0),"click"===s.type&&(n?n=!1:e.hasDoubleClick?void 0===o?o=window.setTimeout(()=>{o=void 0,Pt(t,"tap")},250):(clearTimeout(o),o=void 0,Pt(t,"double_tap")):Pt(t,"tap"))};for(const e of Ct)t.addEventListener(e,s,{passive:!0});for(const e of Mt)t.addEventListener(e,r);t.__etaActionHandler={options:e,start:s,end:r}}const Ot=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends Et{constructor(t){if(super(t),t.type!==St)throw new Error("actionHandler must be bound to an element, e.g. <g ${actionHandler()}>")}update(t,e){const i=t.element,o=e[0]??{},n=i.__etaActionHandler?.options;return this._element===i&&n?.hasHold===o.hasHold&&n?.hasDoubleClick===o.hasDoubleClick&&n?.disabled===o.disabled||(this._element=i,zt(i,o)),V}render(t){return V}});const Nt="eta-flow-card",Lt={puffer:{id:"puffer",label:"Puffer",icon:"mdi:storage-tank",color:"#4caf50",x:200,y:200,radius:42,kind:"circle"},solar:{id:"solar",label:"Solar",icon:"mdi:solar-power-variant",color:"#ff9800",x:200,y:56,radius:34,kind:"circle"},kessel:{id:"kessel",label:"Kessel",icon:"mdi:fire",color:"#9c27b0",x:200,y:344,radius:34,kind:"circle"},warmwasser:{id:"warmwasser",label:"Warmwasser",icon:"mdi:water-boiler",color:"#03a9f4",x:56,y:200,radius:34,kind:"circle"},heizkreis:{id:"heizkreis",label:"Heizkreis",icon:"mdi:radiator",color:"#f44336",x:344,y:200,radius:34,kind:"circle"},heizkreis2:{id:"heizkreis2",label:"Heizkreis 2",icon:"mdi:heating-coil",color:"#ec407a",x:322,y:322,radius:30,kind:"circle"},aussen:{id:"aussen",label:"Außen",icon:"mdi:thermometer",color:"#78909c",x:346,y:54,radius:24,kind:"badge"},vorrat:{id:"vorrat",label:"Vorrat",icon:"mdi:silo",color:"#a1887f",x:54,y:346,radius:24,kind:"gauge"}},Tt=[["heizkreis2",/heizkreis[_\s]?2.*(vorlauf|flow|temp)/],["puffer",/puffer.*(ladezustand|ladung|charge|soc)/],["kessel",/kessel.*(temp|kesseltemperatur)/],["solar",/solar.*(kollektor|collector|temp)/],["warmwasser",/(warmwasser|brauchwasser|dhw).*(temp|ist)/],["heizkreis",/heizkreis.*(vorlauf|flow)/],["aussen",/(aussen|außen|outside|outdoor).*temp/],["vorrat",/(pellet|vorrat|lager|stock)/]],Ht="Pumpe",Rt="mdi:pump",Ut=15,jt="#4caf50",Dt=34,It="mdi:circle-outline",Ft="circle",Bt=[{key:"solar_to_puffer",from:"solar",to:"puffer"},{key:"kessel_to_puffer",from:"kessel",to:"puffer"},{key:"puffer_to_warmwasser",from:"puffer",to:"warmwasser"},{key:"puffer_to_heizkreis",from:"puffer",to:"heizkreis"},{key:"puffer_to_heizkreis2",from:"puffer",to:"heizkreis2"}],qt=[{from:"aussen",to:"heizkreis"}],Wt=new Set(["unavailable","unknown","none",""]);function Vt(t,e){if(!e)return;const i=t.states[e];if(!i||Wt.has(i.state))return;const o=Number(i.state);return Number.isFinite(o)?o:void 0}function Kt(t){const e=Math.max(0,Math.min(1,t));return Math.round(4*(3-2.1*e))/4}function Yt(t,e){return t.type??(void 0!==Vt(e,t.entity)?"power":"state")}function Gt(t,e){const i={active:!1,duration:3,reverse:!1};if(!t)return i;const o=t.threshold??0,n=Yt(t,e);if("power"===n){const n=Vt(e,t.entity);if(void 0===n)return i;const s=Math.abs(n);if(s<=o)return i;const r=t.power_reference??5e3;return{active:!0,duration:Kt(Math.min(1,s/r+.15)),reverse:n<0!=!!t.invert}}if("delta"===n){const n=Vt(e,t.from_entity),s=Vt(e,t.to_entity);if(void 0===n||void 0===s)return i;const r=n-s;if(r<=o)return i;return{active:!0,duration:Kt(Math.min(1,r/30+.15)),reverse:!!t.invert}}const s=t.entity?e.states[t.entity]:void 0;if(!s)return i;return{active:(t.active_states??["on"]).includes(s.state),duration:Kt(.6),reverse:!!t.invert}}function Jt(t,e){if(!t)return;if(t.label_entity)return ie(e,t.label_entity);const i=Yt(t,e);if("power"===i)return ie(e,t.entity);if("delta"===i){const i=Vt(e,t.from_entity),o=Vt(e,t.to_entity);if(void 0===i||void 0===o)return;const n=Math.round(10*(i-o))/10,s=function(t,e){return e?t.states[e]?.attributes?.unit_of_measurement:void 0}(e,t.from_entity),r=`Δ${ee(e,n)}`;return s?`${r} ${s}`:r}}function Zt(t,e,i=["on"]){if(!e)return!1;const o=t.states[e];return!!o&&i.includes(o.state)}function Qt(t){return`hsl(${210-(Math.max(20,Math.min(80,t))-20)/60*210}, 72%, 50%)`}const Xt="#ffffff";function te(t){const e=function(t){const e=/^hsl\(\s*([\d.-]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)$/i.exec(t.trim());if(e){const t=(Number(e[1])%360+360)%360,i=Number(e[2])/100,o=Number(e[3])/100,n=(1-Math.abs(2*o-1))*i,s=n*(1-Math.abs(t/60%2-1)),r=o-n/2,[a,c,l]=[[n,s,0],[s,n,0],[0,n,s],[0,s,n],[s,0,n],[n,0,s]][Math.floor(t/60)%6];return[a+r,c+r,l+r]}const i=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(t.trim());if(i){const t=3===i[1].length?[...i[1]].map(t=>t+t):[i[1].slice(0,2),i[1].slice(2,4),i[1].slice(4,6)];return t.map(t=>parseInt(t,16)/255)}}(t);if(!e)return Xt;const[i,o,n]=e.map(t=>t<=.03928?t/12.92:((t+.055)/1.055)**2.4);return.2126*i+.7152*o+.0722*n>.42?"#101418":Xt}function ee(t,e){const i=Math.round(10*e)/10;try{return vt(i,t.locale,{maximumFractionDigits:1})}catch{return String(i)}}function ie(t,e){if(!e)return;const i=t.states[e];if(!i||Wt.has(i.state))return;const o=t.formatEntityState;if("function"==typeof o)try{const t=o(i);if(t)return t}catch{}const n=i.attributes?.unit_of_measurement,s=Number(i.state),r=Number.isFinite(s)?ee(t,s):i.state;return n?`${r} ${n}`:r}function oe(t){return"string"==typeof t?t:t?.entity}function ne(t,e){if(!t)return{available:!1};const i=oe(t.state);if(!!!(t.primary||t.secondary||i))return{available:!1};const o=ie(e,t.primary),n=ie(e,t.secondary),s=e.states[i]?.state,r=ie(e,i),a=void 0!==r&&void 0!==s?function(t,e,i){const o="string"==typeof t?void 0:t?.map;if(!o)return{text:i};const n=new Map(Object.entries(o).map(([t,e])=>[t.toLowerCase(),e])),s=n.get(e.toLowerCase())??n.get(i.toLowerCase());return void 0===s?{text:i}:"string"==typeof s?{text:s}:{text:s.text??i,color:s.color}}(t.state,s,r):{};return{primary:o,secondary:n,state:a.text||void 0,stateColor:a.color,available:void 0!==o||void 0!==n||void 0!==r}}const se=r`
  /*
   * Follow the active Home Assistant theme so the card blends with every other
   * card in both light and dark themes. The hardcoded values are dark-theme
   * fallbacks for when a theme variable is missing.
   *
   * Nodes fill with the plain card background (white in light themes, dark at
   * night) — derived from the same variable chain ha-card uses, rather than
   * --secondary-background-color, which some themes leave light even in dark
   * mode. On hover the fill shifts to a subtle grey tint (see .ring:hover) for
   * feedback.
   */
  :host {
    --eta-line: var(--divider-color, #565656);
    --eta-text: var(--primary-text-color, #e1e1e1);
    --eta-text-dim: var(--secondary-text-color, #9e9e9e);
    --eta-node-fill: var(--ha-card-background, var(--card-background-color, #1c1c1c));
    /* Hover tint: card background nudged toward the text color. Fallback for
       WebKit < 16.2 (no color-mix) is --secondary-background-color, still a
       greyish surface; the color-mix line overrides it where supported. */
    --eta-node-fill-hover: var(--secondary-background-color, #444);
    --eta-node-fill-hover: color-mix(
      in srgb,
      var(--ha-card-background, var(--card-background-color, #1c1c1c)),
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

  /* shown instead of data when none of the configured entities exist yet */
  .hint {
    color: var(--eta-text-dim);
    font-size: 0.8rem;
    text-align: center;
    padding: 0 8px 6px;
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
    fill: var(--eta-node-fill-hover);
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

  /* hover feedback for the (clickable) connections */
  .edge-group:hover .edge-line {
    stroke: var(--eta-text-dim);
    stroke-width: 3;
  }

  /*
   * Labels float free between the nodes and can cross a connecting line, so they
   * get a halo in the card background color. Values inside a circle deliberately
   * do not — the ring already separates them from everything behind.
   */
  .edge-label {
    paint-order: stroke;
    stroke: var(--eta-node-fill);
    stroke-width: 3px;
    stroke-linejoin: round;
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
  /* a node whose entities are unavailable/unknown: dashed, dimmed, no glow */
  .ring.unavailable,
  .badge.unavailable {
    stroke-dasharray: 4 4;
    stroke-opacity: 0.35;
    filter: none;
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
    text-anchor: middle;
    paint-order: stroke;
    stroke: var(--eta-node-fill);
    stroke-width: 3px;
    stroke-linejoin: round;
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
`,re=[{name:"title",selector:{text:{}}},{name:"show_edge_labels",selector:{boolean:{}}},{name:"node_background",selector:{text:{}}}],ae=[{name:"primary",selector:{entity:{}}},{name:"secondary",selector:{entity:{}}},{name:"state",selector:{entity:{}}},{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"color",selector:{text:{}}}],ce=[{name:"type",selector:{select:{mode:"dropdown",options:[{value:"power",label:"Power / numeric sensor"},{value:"state",label:"On-off state (pump, …)"},{value:"delta",label:"Temperature difference"}]}}},{name:"entity",selector:{entity:{}}},{name:"from_entity",selector:{entity:{}}},{name:"to_entity",selector:{entity:{}}},{name:"threshold",selector:{number:{mode:"box",step:"any"}}},{name:"power_reference",selector:{number:{mode:"box",step:"any"}}},{name:"show_label",selector:{boolean:{}}},{name:"label_entity",selector:{entity:{}}},{type:"expandable",name:"pump",title:"Pump glyph",schema:[{name:"entity",selector:{entity:{}}},{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"hide_label",selector:{boolean:{}}}]}],le={title:"Title",show_edge_labels:"Show values on the connections",node_background:"Node fill color (CSS color, optional)",primary:"Primary value",secondary:"Secondary value",state:"Status pill",name:"Name",icon:"Icon",color:"Accent color (CSS color)",type:"Flow mode",entity:"Entity",from_entity:"Warm side",to_entity:"Cold side",threshold:"Threshold",power_reference:"Value at full speed",show_label:"Show this value on the line",label_entity:"Label entity",hide_label:"Hide the pump name"};function he(t){return t.state&&"string"!=typeof t.state?{...t,state:oe(t.state)}:t}function de(t,e){const i=t?.state;return i&&"string"!=typeof i?e?{...i,entity:e}:void 0:e||void 0}function ue(t){const e={};for(const[i,o]of Object.entries(t))if(null!=o&&""!==o){if("object"==typeof o&&!Array.isArray(o)){const t=ue(o);t&&(e[i]=t);continue}e[i]=o}return Object.keys(e).length?e:void 0}let fe=class extends lt{constructor(){super(...arguments),this._label=t=>le[t.name]??t.title??t.name}setConfig(t){this._config={nodes:{},edges:{},...t}}_nodeIds(){const t=Object.keys(Lt);for(const e of Object.keys(this._config.nodes??{}))t.includes(e)||t.push(e);return t}_edgeKeys(){const t=Bt.map(t=>t.key);for(const e of Object.keys(this._config.edges??{}))t.includes(e)||t.push(e);return t}_nodeData(){const t={};for(const[e,i]of Object.entries(this._config.nodes??{}))i&&(t[e]=he(i));return t}_nodeSchema(){return this._nodeIds().map(t=>({type:"expandable",name:t,title:this._config.nodes?.[t]?.name??Lt[t]?.label??t,icon:Lt[t]?.icon,schema:ae}))}_edgeSchema(){return this._edgeKeys().map(t=>({type:"expandable",name:t,title:this._edgeTitle(t),schema:ce}))}_edgeTitle(t){const e=Bt.find(e=>e.key===t),i=this._config.edges?.[t],o=i?.from??e?.from,n=i?.to??e?.to;if(!o||!n)return t;const s=t=>this._config.nodes?.[t]?.name??Lt[t]?.label??t;return`${s(o)} → ${s(n)}`}render(){if(!this._config||!this.hass)return K;const{title:t,show_edge_labels:e,node_background:i}=this._config;return q`
      <div class="card-config">
        <ha-form
          .hass=${this.hass}
          .data=${{title:t,show_edge_labels:e,node_background:i}}
          .schema=${re}
          .computeLabel=${this._label}
          @value-changed=${this._cardChanged}
        ></ha-form>

        <h4>Nodes</h4>
        <p class="hint">
          A node is drawn once it has an entity. Leave one empty to hide it — the Puffer hub always
          shows. Shortening or coloring the status pill's text (<code>state.map</code>) stays in
          YAML and is kept when you edit a node here.
        </p>
        <ha-form
          .hass=${this.hass}
          .data=${this._nodeData()}
          .schema=${this._nodeSchema()}
          .computeLabel=${this._label}
          @value-changed=${this._nodesChanged}
        ></ha-form>

        <h4>Connections</h4>
        <p class="hint">
          Each connection animates when its entity says heat is moving. Rewiring the layout
          (<code>from</code>/<code>to</code>, custom nodes, positions) stays in YAML — see the
          README.
        </p>
        <ha-form
          .hass=${this.hass}
          .data=${this._config.edges??{}}
          .schema=${this._edgeSchema()}
          .computeLabel=${this._label}
          @value-changed=${this._edgesChanged}
        ></ha-form>
      </div>
    `}_cardChanged(t){t.stopPropagation();const e=t.detail.value;this._emit({...this._config,title:e.title||void 0,show_edge_labels:e.show_edge_labels||void 0,node_background:e.node_background||void 0})}_nodesChanged(t){t.stopPropagation();const e=t.detail.value,i={};for(const[t,o]of Object.entries(e)){const e=this._config.nodes?.[t],n={...e,...o},s=de(e,o.state);delete n.state;const r=ue(n)??{};s&&(r.state=s),Object.keys(r).length&&(i[t]=r)}this._emit({...this._config,nodes:i})}_edgesChanged(t){t.stopPropagation();const e=t.detail.value,i={};for(const[t,o]of Object.entries(e)){const e=ue({...this._config.edges?.[t],...o});e&&(i[t]=e)}this._emit({...this._config,edges:i})}_emit(t){this._config=t,xt(this,"config-changed",{config:t})}};fe.styles=r`
    .card-config {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    h4 {
      margin: 12px 0 0;
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
      margin: 2px 0 4px;
    }
    ha-form {
      display: block;
    }
  `,t([pt({attribute:!1})],fe.prototype,"hass",void 0),t([_t()],fe.prototype,"_config",void 0),fe=t([dt("eta-flow-card-editor")],fe),console.info("%c ETA-FLOW-CARD %c v0.4.0 ","color: #fff; background: #4caf50; font-weight: 700;","color: #4caf50; background: #1c1c1c;"),window.customCards=window.customCards||[],window.customCards.push({type:Nt,name:"ETA Flow Card",description:"Animated heat-flow visualization for ETA heating systems (pellet, log & solar).",preview:!0,documentationURL:"https://github.com/orazefabian/eta-flow"});const pe=(t,e,i)=>Math.max(e,Math.min(i,t)),_e=.58;function me(t,e){return e.reduce((e,i)=>e+function(t,e){const i=Math.min(t.x2,e.x2)-Math.max(t.x1,e.x1),o=Math.min(t.y2,e.y2)-Math.max(t.y1,e.y1);return i>0&&o>0?i*o:0}(t,i),0)}function ge(t,e,i){const o=i.textLength??i.text.length*i.fontSize*_e,n=1.25*i.fontSize;return{x1:t-o/2,y1:e-n/2,x2:t+o/2,y2:e+n/2}}const ye=["power","state","delta"],ve=["circle","badge","gauge"];function $e(t){const e={};if(!t?.states)return e;const i=Object.keys(t.states).filter(t=>t.startsWith("sensor.")),o=new Set;for(const[t,n]of Tt){const s=i.find(t=>!o.has(t)&&n.test(t.toLowerCase()));s&&(e[t]=s,o.add(s))}return e}function be(t,e,i,o,n=4){const s=e.x-t.x,r=e.y-t.y,a=Math.hypot(s,r)||1,c=s/a,l=r/a;return{x1:t.x+c*(i+n),y1:t.y+l*(i+n),x2:e.x-c*(o+n),y2:e.y-l*(o+n)}}let xe=class extends lt{constructor(){super(...arguments),this._entityIds=[],this._widthPx=0,this._placeholder=!1}connectedCallback(){super.connectedCallback(),this._observeSize()}disconnectedCallback(){this._resize?.disconnect(),this._resize=void 0,super.disconnectedCallback()}firstUpdated(){this._observeSize()}_observeSize(){if(this._resize)return;const t=this.renderRoot?.querySelector(".flow-wrap");t&&(this._resize=new ResizeObserver(t=>{const e=t[0]?.contentRect.width??0,i=Math.round(e);i!==this._widthPx&&(this._widthPx=i)}),this._resize.observe(t))}_unitsPerPx(){return this._widthPx>0?400/this._widthPx:1}_minFont(){return 9.5*this._unitsPerPx()}_font(t){return Math.max(t,this._minFont())}_isNarrow(){return this._widthPx>0&&this._widthPx<290}_fit(t,e,i){const o=this._font(e);if(t.length*o*_e<=i)return{text:t,fontSize:o};const n=Math.max(this._minFont(),i/(t.length*_e));return{text:t,fontSize:n,textLength:t.length*n*_e>i+.5?i:void 0}}_fitLabel(t,e,i){const o=this._font(e),n=Math.floor(i/(o*_e));return t.length<=n?{text:t,fontSize:o}:n<2?{text:t.slice(0,1),fontSize:o}:{text:`${t.slice(0,n-1).trimEnd()}…`,fontSize:o}}static async getConfigElement(){return document.createElement("eta-flow-card-editor")}static getStubConfig(t){const e={puffer:{},solar:{},kessel:{},warmwasser:{},heizkreis:{},aussen:{}};for(const[i,o]of Object.entries($e(t)))e[i]={...e[i],primary:o};return{type:`custom:${Nt}`,title:"Heizung",nodes:e}}setConfig(t){if(!t)throw new Error("Invalid configuration");!function(t){const e=new Set([...Object.keys(Lt),...Object.keys(t.nodes??{})]);for(const[e,i]of Object.entries(t.nodes??{}))if(i){if(!Lt[e]&&(void 0===i.x||void 0===i.y))throw new Error(`eta-flow-card: custom node "${e}" needs an x and y position (0..400).`);if(i.kind&&!ve.includes(i.kind))throw new Error(`eta-flow-card: node "${e}" has kind "${i.kind}" — expected ${ve.join(", ")}.`);if(void 0!==i.min&&void 0!==i.max&&i.max<=i.min)throw new Error(`eta-flow-card: node "${e}" needs max greater than min.`);if(i.state&&"string"!=typeof i.state&&!i.state.entity)throw new Error(`eta-flow-card: node "${e}" has a state block without an entity.`)}for(const[i,o]of Object.entries(t.edges??{}))if(o){if(o.type&&!ye.includes(o.type))throw new Error(`eta-flow-card: edge "${i}" has type "${o.type}" — expected ${ye.join(", ")}.`);for(const t of["from","to"]){const n=o[t];if(n&&!e.has(n))throw new Error(`eta-flow-card: edge "${i}" points ${t} unknown node "${n}".`)}if(!(Bt.some(t=>t.key===i)||o.from&&o.to))throw new Error(`eta-flow-card: custom edge "${i}" needs both from and to.`)}for(const i of t.control_links??[])for(const t of["from","to"])if(!e.has(i[t]))throw new Error(`eta-flow-card: control_link points ${t} unknown node "${i[t]}".`)}(t),this._config={nodes:{},edges:{},...t},this._entityIds=function(t){const e=new Set,i=t=>{t&&e.add(t)};for(const e of Object.values(t.nodes??{}))if(e){i(e.primary),i(e.secondary),i(oe(e.state)),i(e.level);for(const t of e.layers??[])i(t)}for(const e of Object.values(t.edges??{}))e&&(i(e.entity),i(e.from_entity),i(e.to_entity),i(e.label_entity),i(e.pump?.entity));return i(t.solarpumpe?.entity),[...e]}(this._config)}getCardSize(){return 6}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}shouldUpdate(t){if(!this._config)return!1;if(t.size>1||!t.has("hass"))return!0;const e=t.get("hass");if(!e)return!0;for(const t of this._entityIds)if(e.states[t]!==this.hass.states[t])return!0;return e.locale!==this.hass.locale||e.themes!==this.hass.themes}willUpdate(){this._placeholder=!!this.hass&&!this._entityIds.some(t=>this.hass.states[t])}render(){if(!this._config||!this.hass)return K;const t=this._nodeIds().filter(t=>this._nodeVisible(t)),e=this._resolvedEdges().filter(e=>t.includes(e.from)&&t.includes(e.to)),i=(this._config.control_links??qt).filter(e=>t.includes(e.from)&&t.includes(e.to)),o=[];for(const e of t){const t="circle"===this._nodeKind(e)?this._circleIconSpec(e):this._badgeIconSpec(e);t&&o.push(t)}for(const t of e){const e=this._pumpIconSpec(t);e&&o.push(e)}const n=this._config.node_background?`--eta-node-fill: ${this._config.node_background}`:K,s=this._layoutLabels(e,t);return q`
      <ha-card style=${n}>
        ${this._config.title?q`<div class="title">${this._config.title}</div>`:K}
        <div class="flow-wrap">
          <svg class="flow" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
            ${i.map(t=>this._renderControlLink(t.from,t.to))}
            ${e.map(t=>this._renderEdge(t))} ${e.map(t=>this._renderPump(t))}
            ${t.map(t=>this._renderNode(t,e))}
            <!-- value labels last: they must never disappear behind a node -->
            ${[...s.edges.values()].map(t=>this._renderText("edge-label",t.x,t.y,t))}
            ${[...s.pumps.values()].map(t=>this._renderText("pump-label",t.x,t.y,t))}
          </svg>
          ${this._iconOverlay(o)}
        </div>
        ${this._placeholder?q`<div class="hint">Pick the entities for each node in the card editor.</div>`:K}
      </ha-card>
    `}_layoutLabels(t,e){const i={edges:new Map,pumps:new Map};if(this._isNarrow())return i;const o=[];for(const t of e){const e=this._geom(t);if(!e)continue;const i=this._nodeRadius(t);o.push({x1:e.x-i,y1:e.y-i,x2:e.x+i,y2:e.y+i});const n=this._nodeLabelFitted(t);o.push(ge(e.x,this._nodeLabelY(e,i,n),n))}for(const e of t){const t=this._pumpCenter(e);if(!t)continue;const i=Ut+2;o.push({x1:t.x-i,y1:t.y-i,x2:t.x+i,y2:t.y+i})}for(const e of t){const t=this._edgePump(e.key),n=this._pumpCenter(e);if(!t||!n||t.hide_label)continue;const s=this._fitLabel(t.name??Ht,11,84),r=this._placeNear(n,Ut+s.fontSize,s,o);r&&(o.push(r.box),i.pumps.set(e.key,{...s,x:r.x,y:r.y}))}for(const e of t){const t=this._config.edges?.[e.key];if(!(t?.show_label??this._config.show_edge_labels??!1))continue;const n=Jt(t,this.hass);if(!n)continue;const s=this._geom(e.from),r=this._geom(e.to);if(!s||!r)continue;const{x1:a,y1:c,x2:l,y2:h}=be(s,r,this._nodeRadius(e.from),this._nodeRadius(e.to)),d=this._fit(n,10,96),u=Math.hypot(l-a,h-c)||1,f=-(h-c)/u,p=(l-a)/u,_=.9*d.fontSize+5;let m;for(const t of[.5,.62,.38,.74,.26])for(const e of[1,-1])for(const i of[1,1.8,2.6]){const n=_*i*e,s=a+(l-a)*t+f*n,r=c+(h-c)*t+p*n,u=ge(s,r,d);if(u.x1<1||u.x2>399||u.y1<1||u.y2>399)continue;const g=me(u,o)+8*Math.abs(t-.5)+6*(i-1)+(1===e?0:1);(!m||g<m.cost)&&(m={cost:g,x:s,y:r,box:u})}m&&(o.push(m.box),i.edges.set(e.key,{...d,x:m.x,y:m.y}))}return i}_placeNear(t,e,i,o){const n=(i.textLength??i.text.length*i.fontSize*_e)/2;let s;return[{x:1,y:0},{x:0,y:1},{x:-1,y:0},{x:0,y:-1}].forEach((r,a)=>{const c=0===r.y?e+n:e,l=t.x+r.x*c,h=t.y+r.y*c,d=ge(l,h,i);if(d.x1<1||d.x2>399||d.y1<1||d.y2>399)return;const u=me(d,o)+2*a;(!s||u<s.cost)&&(s={cost:u,x:l,y:h,box:d})}),s}_pumpCenter(t){if(!this._edgePump(t.key)?.entity)return;const e=this._geom(t.from),i=this._geom(t.to);return e&&i?{x:(e.x+i.x)/2,y:(e.y+i.y)/2}:void 0}_nodeLabelFitted(t){const e=this._nodeRadius(t);return this._fitLabel(this._nodeLabel(t),pe(.3*e,11,16),Math.max(2.4*e,76))}_nodeLabelY(t,e,i){return t.y+e+.8*i.fontSize+3}_renderNodeLabel(t,e,i){const o=this._nodeLabelFitted(t);return W`<text
      class="node-label"
      x=${e.x}
      y=${this._nodeLabelY(e,i,o)}
      dominant-baseline="central"
      style=${`font-size:${o.fontSize.toFixed(1)}px`}
    >${o.text}</text>`}_nodeIds(){const t=Object.keys(Lt);for(const e of Object.keys(this._config.nodes??{}))t.includes(e)||t.push(e);return t}_cfg(t){return this._config.nodes?.[t]}_geom(t){const e=this._cfg(t),i=Lt[t],o=e?.x??i?.x,n=e?.y??i?.y;if(void 0!==o&&void 0!==n)return{x:o,y:n}}_nodeKind(t){return this._cfg(t)?.kind??Lt[t]?.kind??Ft}_nodeColor(t){return this._cfg(t)?.color??Lt[t]?.color??jt}_nodeRadius(t){return this._cfg(t)?.radius??Lt[t]?.radius??Dt}_nodeStroke(t){return this._cfg(t)?.stroke_width??2.5}_nodeIcon(t){return this._cfg(t)?.icon??Lt[t]?.icon??It}_nodeLabel(t){return this._cfg(t)?.name??Lt[t]?.label??t}_hasData(t){const e=oe(t?.state);return!!(t?.primary||t?.secondary||e||t?.level||t?.layers?.length)}_nodeEntity(t){const e=this._cfg(t);return e?.primary??e?.level??oe(e?.state)??e?.secondary??e?.layers?.[0]}_edgeEntity(t){const e=this._config.edges?.[t];return e?.entity??e?.label_entity??e?.from_entity}_actionsFor(t,e){const i=t?{action:"more-info"}:{action:"none"};return{entity:t,tap_action:e?.tap_action??this._config.tap_action??i,hold_action:e?.hold_action??this._config.hold_action,double_tap_action:e?.double_tap_action??this._config.double_tap_action}}_interactive(t){return At(t.tap_action)||At(t.hold_action)||At(t.double_tap_action)}_actionHandler(t){return Ot({hasHold:At(t.hold_action),hasDoubleClick:At(t.double_tap_action),disabled:!this._interactive(t)})}_onAction(t,e){const i=t.detail?.action;i&&function(t,e,i,o){var n;"double_tap"===o&&i.double_tap_action?n=i.double_tap_action:"hold"===o&&i.hold_action?n=i.hold_action:"tap"===o&&i.tap_action&&(n=i.tap_action),kt(t,e,i,n)}(this,this.hass,e,i)}_iconOverlay(t){return t.length?q`
      <div class="icon-overlay">
        ${t.map(t=>q`
            <ha-icon
              class=${`node-icon ${t.cls}`.trim()}
              icon=${t.icon}
              style=${`left:${t.cx/4}%;top:${t.cy/4}%;--mdc-icon-size:${t.size/4}cqw;`}
            ></ha-icon>
          `)}
      </div>
    `:K}_circleIconSpec(t){const e=this._geom(t);if(!e)return;const i=ne(this._cfg(t),this.hass),o=this._nodeRadius(t),n=!!i.state||!!i.secondary,s=pe(Math.round(.62*o),14,40),r=n?e.y-.42*o:e.y-.3*o;return{icon:this._nodeIcon(t),cx:e.x,cy:r,size:s,cls:""}}_badgeIconSpec(t){const e=this._geom(t);if(!e)return;const i=this._nodeRadius(t),o=pe(Math.round(.66*i),14,28);return{icon:this._nodeIcon(t),cx:e.x,cy:e.y-.44*i,size:o,cls:""}}_pumpIconSpec(t){const e=this._edgePump(t.key);if(!e?.entity)return;const i=this._geom(t.from),o=this._geom(t.to);if(!i||!o)return;const n=Zt(this.hass,e.entity,e.active_states),s=Math.round(.95*Ut);return{icon:e.icon??Rt,cx:(i.x+o.x)/2,cy:(i.y+o.y)/2,size:s,cls:("pump "+(n?"on":"")).trim()}}_nodeVisible(t){const e=this._cfg(t);return!e?.hidden&&(!!this._geom(t)&&(!(!this._placeholder||!Lt[t])||(this._hasData(e)||"puffer"===t)))}_resolvedEdges(){const t=new Map(Bt.map(t=>[t.key,t])),e=new Set([...t.keys(),...Object.keys(this._config.edges??{})]),i=[];for(const o of e){const e=this._config.edges?.[o],n=t.get(o),s=e?.from??n?.from,r=e?.to??n?.to;s&&r&&i.push({key:o,from:s,to:r})}return i}_renderEdge(t){const e=this._geom(t.from),i=this._geom(t.to);if(!e||!i)return K;const{x1:o,y1:n,x2:s,y2:r}=be(e,i,this._nodeRadius(t.from),this._nodeRadius(t.to)),a=`edge-${t.key}`,c=`M ${o} ${n} L ${s} ${r}`,l=this._config.edges?.[t.key],h=Gt(l,this.hass),d=this._nodeColor(h.reverse?t.to:t.from),u=this._actionsFor(this._edgeEntity(t.key),l);return W`
      <g class="edge-group">
        <path id=${a} class="edge-line" d=${c}></path>
        ${h.active?this._renderDots(a,h.duration,h.reverse,d):K}
        ${this._interactive(u)?W`<path
                class="edge-hit"
                d=${c}
                ${this._actionHandler(u)}
                @action=${t=>this._onAction(t,u)}
              ></path>`:K}
      </g>
    `}_renderDots(t,e,i,o){const n=i?"1;0":"0;1";return W`${Array.from({length:3},(i,s)=>W`
        <circle class="dot" r="3.5" style=${`color:${o}`}>
          <animateMotion
            dur=${`${e}s`}
            begin=${`-${e/3*s}s`}
            repeatCount="indefinite"
            keyPoints=${n}
            keyTimes="0;1"
            calcMode="linear"
          >
            <mpath href=${`#${t}`}></mpath>
          </animateMotion>
        </circle>`)}`}_renderControlLink(t,e){const i=this._geom(t),o=this._geom(e);if(!i||!o)return K;const{x1:n,y1:s,x2:r,y2:a}=be(i,o,this._nodeRadius(t),this._nodeRadius(e),2);return W`<path class="ctrl-line" d=${`M ${n} ${s} L ${r} ${a}`}></path>`}_edgePump(t){const e=this._config.edges?.[t]?.pump;return e?.entity?e:"solar_to_puffer"===t&&this._config.solarpumpe?.entity?this._config.solarpumpe:void 0}_renderPump(t){const e=this._edgePump(t.key);if(!e?.entity)return K;const i=this._geom(t.from),o=this._geom(t.to);if(!i||!o)return K;const n=(i.x+o.x)/2,s=(i.y+o.y)/2,r=Zt(this.hass,e.entity,e.active_states),a=e.color??this._nodeColor(t.from),c=Ut,l=this._actionsFor(e.entity,e);return W`
      <g
        style=${`color:${a}`}
        class=${this._interactive(l)?"clickable":""}
        ${this._actionHandler(l)}
        @action=${t=>this._onAction(t,l)}
      >
        <circle
          class=${"pump-ring "+(r?"active":"inactive")}
          cx=${n}
          cy=${s}
          r=${c}
          stroke="currentColor"
        ></circle>
      </g>
    `}_renderNode(t,e){return"circle"===this._nodeKind(t)?this._renderCircle(t,e):this._renderBadge(t)}_renderCircle(t,e){const i=this._geom(t);if(!i)return K;const o=this._cfg(t),n=ne(o,this.hass),s=this._nodeColor(t),r=this._nodeRadius(t),a=this._nodeActive(t,e),c=this._placeholder||this._hasData(o)&&!n.available,l=this._isNarrow(),h=!!n.state&&!l,d=!h&&!!n.secondary&&!l,u=h||d,f=n.primary??(c?"—":void 0),p=f?this._fit(f,pe(.36*r,12,22),1.55*r):void 0,_=d?this._fit(n.secondary,pe(.28*r,10,16),1.5*r):void 0,m=u?i.y+.04*r:i.y+.36*r,g=i.y+.44*r,y=!(!o?.level&&!o?.layers?.length),v=this._actionsFor(this._nodeEntity(t),o);return W`
      <g
        style=${`color:${s}`}
        class=${this._interactive(v)?"clickable":""}
        ${this._actionHandler(v)}
        @action=${t=>this._onAction(t,v)}
      >
        <circle
          class=${`ring ${a?"active":"inactive"}${c?" unavailable":""}`}
          cx=${i.x}
          cy=${i.y}
          r=${r}
          stroke="currentColor"
          stroke-width=${this._nodeStroke(t)}
        ></circle>
        ${y?this._renderStratFill(t,i,r,o,s):K}
        ${p?this._renderText("node-primary",i.x,m,p,this._valueColor(t,i,r,o,m,s)):K}
        ${h?this._renderPill(i.x,g,r,n.state,n.stateColor):K}
        ${_?this._renderText("node-secondary",i.x,g,_,this._valueColor(t,i,r,o,g,s)):K}
        ${this._renderNodeLabel(t,i,r)}
      </g>
    `}_renderText(t,e,i,o,n){const s=`font-size:${o.fontSize.toFixed(1)}px${n?`;fill:${n}`:""}`;return W`<text
      class=${t}
      x=${e}
      y=${i}
      dominant-baseline="central"
      textLength=${(t=>t??K)(o.textLength)}
      lengthAdjust="spacingAndGlyphs"
      style=${s}
    >${o.text}</text>`}_strat(t,e,i,o){if(!o?.level&&!o?.layers?.length)return;const n=function(t,e){const i=Vt(e,t?.level??t?.primary);if(void 0!==i)return Math.max(0,Math.min(1,i/100))}(o,this.hass);if(void 0===n||n<=0)return;const s=Math.max(0,i-this._nodeStroke(t)-.5),r=e.y+s;return{top:r-2*s*n,bottom:r,rC:s,layers:(o?.layers??[]).map(t=>Vt(this.hass,t)).filter(t=>void 0!==t)}}_valueColor(t,e,i,o,n,s){const r=this._strat(t,e,i,o);if(!r||n<r.top||n>r.bottom)return;const{layers:a}=r;if(0===a.length)return te(s);if(1===a.length)return te(Qt(a[0]));const c=pe((n-r.top)/(r.bottom-r.top),0,1)*(a.length-1),l=Math.min(Math.floor(c),a.length-2);return te(Qt(a[l]+(a[l+1]-a[l])*(c-l)))}_renderStratFill(t,e,i,o,n){const s=this._strat(t,e,i,o);if(!s)return K;const{rC:r,layers:a,top:c}=s,l=s.bottom-c,h=`${t}-clip`,d=`${t}-grad`;let u,f=K;if(a.length>=2){const t=a.map((t,e)=>{const i=e/(a.length-1)*100;return W`<stop offset=${`${i}%`} stop-color=${Qt(t)}></stop>`});f=W`<linearGradient id=${d} x1="0" y1="0" x2="0" y2="1">${t}</linearGradient>`,u=`url(#${d})`}else u=1===a.length?Qt(a[0]):n;return W`
      <defs>
        ${f}
        <clipPath id=${h}><circle cx=${e.x} cy=${e.y} r=${r}></circle></clipPath>
      </defs>
      <rect
        class="strat-fill"
        x=${e.x-r}
        y=${c}
        width=${2*r}
        height=${l}
        fill=${u}
        clip-path=${`url(#${h})`}
      ></rect>
    `}_renderPill(t,e,i,o,n){const s=2*i-16,r=this._fit(o,pe(.26*i,9,13),s),a=r.textLength??r.text.length*r.fontSize*_e,c=Math.min(2*i-6,a+10),l=r.fontSize+6;return W`
      <rect
        class="pill-bg"
        x=${t-c/2}
        y=${e-l/2}
        width=${c}
        height=${l}
        rx=${l/2}
        style=${n?`fill:${n}`:K}
      ></rect>
      ${this._renderText("pill-text",t,e,r)}
    `}_renderBadge(t){const e=this._geom(t);if(!e)return K;const i=this._cfg(t),o=ne(i,this.hass),n=this._nodeColor(t),s=this._nodeRadius(t),r="gauge"===this._nodeKind(t)||!0===i?.gauge?function(t,e){const i=Vt(e,t?.primary);if(void 0===i)return;const o=t?.min??0,n=t?.max??100;return n<=o?void 0:Math.max(0,Math.min(1,(i-o)/(n-o)))}(i,this.hass):void 0,a=this._placeholder||this._hasData(i)&&!o.available,c=e.y+(void 0!==r?.14*s:.2*s),l=this._actionsFor(this._nodeEntity(t),i),h=o.primary??(a?"—":void 0),d=h?this._fit(h,12,1.7*s):void 0,u=1.3*s,f=e.y+.52*s;return W`
      <g
        style=${`color:${n}`}
        class=${this._interactive(l)?"clickable":""}
        ${this._actionHandler(l)}
        @action=${t=>this._onAction(t,l)}
      >
        <circle
          class=${"badge"+(a?" unavailable":"")}
          cx=${e.x}
          cy=${e.y}
          r=${s}
          stroke="currentColor"
          stroke-width=${this._nodeStroke(t)}
        ></circle>
        ${d?this._renderText("badge-text",e.x,c,d):K}
        ${void 0!==r?W`
              <rect class="gauge-bg" x=${e.x-u/2} y=${f} width=${u} height="6" rx="3"></rect>
              <rect class="gauge-fill" x=${e.x-u/2} y=${f} width=${u*r} height="6" rx="3"></rect>`:K}
        ${this._renderNodeLabel(t,e,s)}
      </g>
    `}_nodeActive(t,e){return e.filter(e=>e.from===t||e.to===t).some(t=>Gt(this._config.edges?.[t.key],this.hass).active)}};xe.styles=se,t([pt({attribute:!1})],xe.prototype,"hass",void 0),t([_t()],xe.prototype,"_config",void 0),t([_t()],xe.prototype,"_widthPx",void 0),xe=t([dt(Nt)],xe);export{xe as EtaFlowCard,$e as detectRoleEntities};
