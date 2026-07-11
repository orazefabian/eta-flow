function t(t,e,i,s){var r,n=arguments.length,o=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(n<3?r(o):n>3?r(e,i,o):r(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,f=globalThis,$=f.trustedTypes,_=$?$.emptyScript:"",m=f.reactiveElementPolyfillSupport,g=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>!l(t,e),x={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);r?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const n=r.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const n=this.constructor;if(!1===s&&(r=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??v)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[g("elementProperties")]=new Map,b[g("finalized")]=new Map,m?.({ReactiveElement:b}),(f.reactiveElementVersions??=[]).push("2.1.2");const A=globalThis,w=t=>t,k=A.trustedTypes,E=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+S,P=`<${M}>`,O=document,R=()=>O.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,z=Array.isArray,N="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,j=/>/g,L=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,D=/"/g,B=/^(?:script|style|textarea|title)$/i,F=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),V=F(1),W=F(2),q=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),G=new WeakMap,J=O.createTreeWalker(O,129);function Y(t,e){if(!z(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const Z=(t,e)=>{const i=t.length-1,s=[];let r,n=2===e?"<svg>":3===e?"<math>":"",o=T;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,h=0;for(;h<i.length&&(o.lastIndex=h,l=o.exec(i),null!==l);)h=o.lastIndex,o===T?"!--"===l[1]?o=H:void 0!==l[1]?o=j:void 0!==l[2]?(B.test(l[2])&&(r=RegExp("</"+l[2],"g")),o=L):void 0!==l[3]&&(o=L):o===L?">"===l[0]?(o=r??T,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?L:'"'===l[3]?D:I):o===D||o===I?o=L:o===H||o===j?o=T:(o=L,r=void 0);const d=o===L&&t[e+1].startsWith("/>")?" ":"";n+=o===T?i+P:c>=0?(s.push(a),i.slice(0,c)+C+i.slice(c)+S+d):i+S+(-2===c?e:d)}return[Y(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Q{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0;const o=t.length-1,a=this.parts,[l,c]=Z(t,e);if(this.el=Q.createElement(l,i),J.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=J.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=c[n++],i=s.getAttribute(t).split(S),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?st:"?"===o[1]?rt:"@"===o[1]?nt:it}),s.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(B.test(s.tagName)){const t=s.textContent.split(S),e=t.length-1;if(e>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],R()),J.nextNode(),a.push({type:2,index:++r});s.append(t[e],R())}}}else if(8===s.nodeType)if(s.data===M)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(S,t+1));)a.push({type:7,index:r}),t+=S.length-1}r++}}static createElement(t,e){const i=O.createElement("template");return i.innerHTML=t,i}}function X(t,e,i=t,s){if(e===q)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const n=U(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=X(t,r._$AS(t,e.values),r,s)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??O).importNode(e,!0);J.currentNode=s;let r=J.nextNode(),n=0,o=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new et(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new ot(r,this,t)),this._$AV.push(e),a=i[++o]}n!==a?.index&&(r=J.nextNode(),n++)}return J.currentNode=O,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),U(t)?t===K||null==t||""===t?(this._$AH!==K&&this._$AR(),this._$AH=K):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>z(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==K&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Q.createElement(Y(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new tt(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=G.get(t.strings);return void 0===e&&G.set(t.strings,e=new Q(t)),e}k(t){z(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new et(this.O(R()),this.O(R()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=K,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=K}_$AI(t,e=this,i,s){const r=this.strings;let n=!1;if(void 0===r)t=X(this,t,e,0),n=!U(t)||t!==this._$AH&&t!==q,n&&(this._$AH=t);else{const s=t;let o,a;for(t=r[0],o=0;o<r.length-1;o++)a=X(this,s[i+o],e,o),a===q&&(a=this._$AH[o]),n||=!U(a)||a!==this._$AH[o],a===K?t=K:t!==K&&(t+=(a??"")+r[o+1]),this._$AH[o]=a}n&&!s&&this.j(t)}j(t){t===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===K?void 0:t}}class rt extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==K)}}class nt extends it{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??K)===q)return;const i=this._$AH,s=t===K&&i!==K||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==K&&(i===K||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const at=A.litHtmlPolyfillSupport;at?.(Q,et),(A.litHtmlVersions??=[]).push("3.3.3");const lt=globalThis;class ct extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new et(e.insertBefore(R(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}ct._$litElement$=!0,ct.finalized=!0,lt.litElementHydrateSupport?.({LitElement:ct});const ht=lt.litElementPolyfillSupport;ht?.({LitElement:ct}),(lt.litElementVersions??=[]).push("4.2.2");const dt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},pt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:v},ut=(t=pt,e,i)=>{const{kind:s,metadata:r}=i;let n=globalThis.litPropertyMetadata.get(r);if(void 0===n&&globalThis.litPropertyMetadata.set(r,n=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ft(t){return(e,i)=>"object"==typeof i?ut(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function $t(t){return ft({...t,state:!0,attribute:!1})}const _t="eta-flow-card",mt={puffer:{id:"puffer",label:"Puffer",icon:"mdi:storage-tank",color:"#4caf50",x:200,y:200,radius:42,kind:"circle"},solar:{id:"solar",label:"Solar",icon:"mdi:solar-power-variant",color:"#ff9800",x:200,y:56,radius:34,kind:"circle"},kessel:{id:"kessel",label:"Kessel",icon:"mdi:fire",color:"#9c27b0",x:200,y:344,radius:34,kind:"circle"},warmwasser:{id:"warmwasser",label:"Warmwasser",icon:"mdi:water-boiler",color:"#03a9f4",x:56,y:200,radius:34,kind:"circle"},heizkreis:{id:"heizkreis",label:"Heizkreis",icon:"mdi:radiator",color:"#f44336",x:344,y:200,radius:34,kind:"circle"},heizkreis2:{id:"heizkreis2",label:"Heizkreis 2",icon:"mdi:heating-coil",color:"#ec407a",x:322,y:322,radius:30,kind:"circle"},aussen:{id:"aussen",label:"Außen",icon:"mdi:thermometer",color:"#78909c",x:346,y:54,radius:24,kind:"badge"},vorrat:{id:"vorrat",label:"Vorrat",icon:"mdi:silo",color:"#a1887f",x:54,y:346,radius:24,kind:"gauge"}},gt="Pumpe",yt="mdi:pump",vt=15,xt="#4caf50",bt=34,At="mdi:circle-outline",wt="circle",kt=[{key:"solar_to_puffer",from:"solar",to:"puffer"},{key:"kessel_to_puffer",from:"kessel",to:"puffer"},{key:"puffer_to_warmwasser",from:"puffer",to:"warmwasser"},{key:"puffer_to_heizkreis",from:"puffer",to:"heizkreis"},{key:"puffer_to_heizkreis2",from:"puffer",to:"heizkreis2"}],Et=[{from:"aussen",to:"heizkreis"}];function Ct(t,e){if(!e)return;const i=t.states[e];if(!i)return;const s=Number(i.state);return Number.isFinite(s)?s:void 0}function St(t){return 3-2.1*Math.max(0,Math.min(1,t))}function Mt(t,e){return t.type??(void 0!==Ct(e,t.entity)?"power":"state")}function Pt(t,e){const i={active:!1,duration:3,reverse:!1};if(!t)return i;const s=t.threshold??0,r=Mt(t,e);if("power"===r){const r=Ct(e,t.entity);if(void 0===r)return i;const n=Math.abs(r);if(n<=s)return i;const o=t.power_reference??5e3;return{active:!0,duration:St(Math.min(1,n/o+.15)),reverse:r<0!=!!t.invert}}if("delta"===r){const r=Ct(e,t.from_entity),n=Ct(e,t.to_entity);if(void 0===r||void 0===n)return i;const o=r-n;if(o<=s)return i;return{active:!0,duration:St(Math.min(1,o/30+.15)),reverse:!!t.invert}}const n=t.entity?e.states[t.entity]:void 0;if(!n)return i;return{active:(t.active_states??["on"]).includes(n.state),duration:St(.6),reverse:!!t.invert}}function Ot(t){return`hsl(${210-(Math.max(20,Math.min(80,t))-20)/60*210}, 72%, 50%)`}function Rt(t,e){if(!e)return;const i=t.states[e];if(!i)return;const s=i.attributes?.unit_of_measurement,r=Number(i.state),n=Number.isFinite(r)?String(Math.round(10*r)/10):i.state;return s?`${n} ${s}`:n}function Ut(t,e){if(!t||!t.primary)return{available:!1};const i=Rt(e,t.primary);return{primary:i,secondary:Rt(e,t.secondary),state:t.state?e.states[t.state]?.state:void 0,available:void 0!==i}}const zt=o`
  /*
   * Follow the active Home Assistant theme so the card blends with every other
   * card in both light and dark themes. The hardcoded values are dark-theme
   * fallbacks for when a theme variable is missing.
   */
  :host {
    --eta-line: var(--divider-color, #565656);
    --eta-text: var(--primary-text-color, #e1e1e1);
    --eta-text-dim: var(--secondary-text-color, #9e9e9e);
    --eta-node-fill: var(--secondary-background-color, #2a2a2a);
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
  .ring.inactive {
    opacity: 0.55;
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
    opacity: 0.55;
  }
  .pump-ring.active {
    filter: drop-shadow(0 0 4px currentColor);
  }
  .pump-label {
    fill: var(--eta-text-dim);
    font-size: 11px;
    text-anchor: start;
  }
  .pump {
    transform-origin: center;
  }
  .pump.on {
    animation: spin 1.6s linear infinite;
    filter: drop-shadow(0 0 3px currentColor);
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;var Nt,Tt;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(Nt||(Nt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(Tt||(Tt={}));let Ht=class extends ct{setConfig(t){this._config={nodes:{},...t}}render(){return this._config&&this.hass?V`
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

        ${Object.values(mt).map(t=>this._renderNodeRow(t.id,t.label))}

        <h4>Solarpumpe</h4>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config.solarpumpe?.entity??""}
          allow-custom-entity
          @value-changed=${this._solarpumpeChanged}
        ></ha-entity-picker>
      </div>
    `:K}_renderNodeRow(t,e){const i=this._config.nodes?.[t]??{};return V`
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
    `}_titleChanged(t){const e=t.target.value;this._emit({...this._config,title:e||void 0})}_nodeChanged(t,e,i){const s=i.detail?.value,r={...this._config.nodes??{}},n={...r[t]??{}};s?n[e]=s:delete n[e],r[t]=n,this._emit({...this._config,nodes:r})}_solarpumpeChanged(t){const e=t.detail?.value,i=e?{...this._config.solarpumpe,entity:e}:void 0;this._emit({...this._config,solarpumpe:i})}_emit(t){this._config=t,function(t,e,i,s){s=s||{},i=null==i?{}:i;var r=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});r.detail=i,t.dispatchEvent(r)}(this,"config-changed",{config:t})}};Ht.styles=o`
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
  `,t([ft({attribute:!1})],Ht.prototype,"hass",void 0),t([$t()],Ht.prototype,"_config",void 0),Ht=t([dt("eta-flow-card-editor")],Ht),console.info("%c ETA-FLOW-CARD %c v0.1.1 ","color: #fff; background: #4caf50; font-weight: 700;","color: #4caf50; background: #1c1c1c;"),window.customCards=window.customCards||[],window.customCards.push({type:_t,name:"ETA Flow Card",description:"Animated heat-flow visualization for ETA heating systems (pellet, log & solar).",preview:!0,documentationURL:"https://github.com/orazefabian/eta-flow"});const jt=(t,e,i)=>Math.max(e,Math.min(i,t));function Lt(t,e,i,s,r=4){const n=e.x-t.x,o=e.y-t.y,a=Math.hypot(n,o)||1,l=n/a,c=o/a;return{x1:t.x+l*(i+r),y1:t.y+c*(i+r),x2:e.x-l*(s+r),y2:e.y-c*(s+r)}}let It=class extends ct{static async getConfigElement(){return document.createElement("eta-flow-card-editor")}static getStubConfig(){return{type:`custom:${_t}`,title:"Heizung",nodes:{puffer:{},solar:{},kessel:{},warmwasser:{},heizkreis:{},aussen:{}}}}setConfig(t){if(!t)throw new Error("Invalid configuration");this._config={nodes:{},edges:{},...t}}getCardSize(){return 6}render(){if(!this._config||!this.hass)return K;const t=this._nodeIds().filter(t=>this._nodeVisible(t)),e=this._resolvedEdges().filter(e=>t.includes(e.from)&&t.includes(e.to)),i=(this._config.control_links??Et).filter(e=>t.includes(e.from)&&t.includes(e.to));return V`
      <ha-card>
        ${this._config.title?V`<div class="title">${this._config.title}</div>`:K}
        <svg class="flow" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
          ${i.map(t=>this._renderControlLink(t.from,t.to))}
          ${e.map(t=>this._renderEdge(t))} ${e.map(t=>this._renderPump(t))}
          ${t.map(t=>this._renderNode(t,e))}
        </svg>
      </ha-card>
    `}_nodeIds(){const t=Object.keys(mt);for(const e of Object.keys(this._config.nodes??{}))t.includes(e)||t.push(e);return t}_cfg(t){return this._config.nodes?.[t]}_geom(t){const e=this._cfg(t),i=mt[t],s=e?.x??i?.x,r=e?.y??i?.y;if(void 0!==s&&void 0!==r)return{x:s,y:r}}_nodeKind(t){return this._cfg(t)?.kind??mt[t]?.kind??wt}_nodeColor(t){return this._cfg(t)?.color??mt[t]?.color??xt}_nodeRadius(t){return this._cfg(t)?.radius??mt[t]?.radius??bt}_nodeStroke(t){return this._cfg(t)?.stroke_width??2.5}_nodeIcon(t){return this._cfg(t)?.icon??mt[t]?.icon??At}_nodeLabel(t){return this._cfg(t)?.name??mt[t]?.label??t}_hasData(t){return!!(t?.primary||t?.level||t?.layers?.length)}_nodeEntity(t){const e=this._cfg(t);return e?.primary??e?.level??e?.state??e?.secondary??e?.layers?.[0]}_edgeEntity(t){const e=this._config.edges?.[t];return e?.entity??e?.label_entity??e?.from_entity}_openMoreInfo(t){t&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))}_icon(t,e,i,s,r=""){const n=s+6;return W`
      <foreignObject
        x=${e-n/2}
        y=${i-n/2}
        width=${n}
        height=${n}
        style="overflow:visible"
      >
        <div
          class=${r}
          style="width:100%;height:100%;display:flex;align-items:center;justify-content:center"
        >
          <ha-icon
            icon=${t}
            style=${`color: var(--eta-text); --mdc-icon-size:${s}px; width:${s}px; height:${s}px;`}
          ></ha-icon>
        </div>
      </foreignObject>
    `}_nodeVisible(t){const e=this._cfg(t);return!e?.hidden&&(!!this._geom(t)&&(this._hasData(e)||"puffer"===t))}_resolvedEdges(){const t=new Map(kt.map(t=>[t.key,t])),e=new Set([...t.keys(),...Object.keys(this._config.edges??{})]),i=[];for(const s of e){const e=this._config.edges?.[s],r=t.get(s),n=e?.from??r?.from,o=e?.to??r?.to;n&&o&&i.push({key:s,from:n,to:o})}return i}_renderEdge(t){const e=this._geom(t.from),i=this._geom(t.to);if(!e||!i)return K;const{x1:s,y1:r,x2:n,y2:o}=Lt(e,i,this._nodeRadius(t.from),this._nodeRadius(t.to)),a=`edge-${t.key}`,l=`M ${s} ${r} L ${n} ${o}`,c=this._config.edges?.[t.key],h=Pt(c,this.hass),d=this._nodeColor(h.reverse?t.to:t.from),p=c?.show_label??this._config.show_edge_labels??!1?function(t,e){if(!t)return;if(t.label_entity)return Rt(e,t.label_entity);const i=Mt(t,e);if("power"===i)return Rt(e,t.entity);if("delta"===i){const i=Ct(e,t.from_entity),s=Ct(e,t.to_entity);if(void 0===i||void 0===s)return;return`Δ${Math.round(10*(i-s))/10}°`}}(c,this.hass):void 0;let u=K;if(p){const s=(e.x+i.x)/2,r=(e.y+i.y)/2,n=Math.hypot(i.x-e.x,i.y-e.y)||1,o=-(i.y-e.y)/n,a=(i.x-e.x)/n,l=this._edgePump(t.key)?22:11;u=W`<text class="edge-label" x=${s+o*l} y=${r+a*l}
        dominant-baseline="central">${p}</text>`}const f=this._edgeEntity(t.key);return W`
      <path id=${a} class="edge-line" d=${l}></path>
      ${h.active?this._renderDots(a,h.duration,h.reverse,d):K}
      ${u}
      ${f?W`<path class="edge-hit" d=${l} @click=${()=>this._openMoreInfo(f)}></path>`:K}
    `}_renderDots(t,e,i,s){const r=i?"1;0":"0;1";return W`${Array.from({length:3},(i,n)=>W`
        <circle class="dot" r="3.5" style=${`color:${s}`}>
          <animateMotion
            dur=${`${e}s`}
            begin=${`-${e/3*n}s`}
            repeatCount="indefinite"
            keyPoints=${r}
            keyTimes="0;1"
            calcMode="linear"
          >
            <mpath href=${`#${t}`}></mpath>
          </animateMotion>
        </circle>`)}`}_renderControlLink(t,e){const i=this._geom(t),s=this._geom(e);if(!i||!s)return K;const{x1:r,y1:n,x2:o,y2:a}=Lt(i,s,this._nodeRadius(t),this._nodeRadius(e),2);return W`<path class="ctrl-line" d=${`M ${r} ${n} L ${o} ${a}`}></path>`}_edgePump(t){const e=this._config.edges?.[t]?.pump;return e?.entity?e:"solar_to_puffer"===t&&this._config.solarpumpe?.entity?this._config.solarpumpe:void 0}_renderPump(t){const e=this._edgePump(t.key);if(!e?.entity)return K;const i=this._geom(t.from),s=this._geom(t.to);if(!i||!s)return K;const r=(i.x+s.x)/2,n=(i.y+s.y)/2,o=function(t,e,i=["on"]){if(!e)return!1;const s=t.states[e];return!!s&&i.includes(s.state)}(this.hass,e.entity,e.active_states),a=e.color??this._nodeColor(t.from),l=vt,c=Math.round(.95*l),h=e.name??gt;return W`
      <g style=${`color:${a}`} class="clickable" @click=${()=>this._openMoreInfo(e.entity)}>
        <circle
          class=${"pump-ring "+(o?"active":"inactive")}
          cx=${r}
          cy=${n}
          r=${l}
          stroke="currentColor"
        ></circle>
        ${this._icon(e.icon??yt,r,n,c,"pump "+(o?"on":""))}
        ${e.hide_label?K:W`<text class="pump-label" x=${r+l+5} y=${n} dominant-baseline="central">${h}</text>`}
      </g>
    `}_renderNode(t,e){return"circle"===this._nodeKind(t)?this._renderCircle(t,e):this._renderBadge(t)}_renderCircle(t,e){const i=this._geom(t);if(!i)return K;const s=this._cfg(t),r=Ut(s,this.hass),n=this._nodeColor(t),o=this._nodeRadius(t),a=this._nodeActive(t,e),l=!!r.state,c=!l&&!!r.secondary,h=l||c,d=jt(Math.round(.62*o),14,40),p=jt(.36*o,12,22).toFixed(1),u=jt(.28*o,10,16).toFixed(1),f=jt(.3*o,11,16).toFixed(1),$=h?i.y-.42*o:i.y-.3*o,_=h?i.y+.04*o:i.y+.36*o,m=i.y+.44*o,g=i.y+o+.8*Number(f)+3,y=!(!s?.level&&!s?.layers?.length),v=this._nodeEntity(t);return W`
      <g
        style=${`color:${n}`}
        class=${v?"clickable":""}
        @click=${()=>this._openMoreInfo(v)}
      >
        <circle
          class=${"ring "+(a?"active":"inactive")}
          cx=${i.x}
          cy=${i.y}
          r=${o}
          stroke="currentColor"
          stroke-width=${this._nodeStroke(t)}
        ></circle>
        ${y?this._renderStratFill(t,i,o,s,n):K}
        ${this._icon(this._nodeIcon(t),i.x,$,d)}
        ${r.primary?W`<text
                class="node-primary"
                x=${i.x}
                y=${_}
                dominant-baseline="central"
                style=${`font-size:${p}px`}
              >${r.primary}</text>`:K}
        ${l?this._renderPill(i.x,m,o,r.state):K}
        ${c?W`<text
                class="node-secondary"
                x=${i.x}
                y=${m}
                dominant-baseline="central"
                style=${`font-size:${u}px`}
              >${r.secondary}</text>`:K}
        <text
          class="node-label"
          x=${i.x}
          y=${g}
          dominant-baseline="central"
          style=${`font-size:${f}px`}
        >${this._nodeLabel(t)}</text>
      </g>
    `}_renderStratFill(t,e,i,s,r){const n=function(t,e){const i=Ct(e,t?.level??t?.primary);if(void 0!==i)return Math.max(0,Math.min(1,i/100))}(s,this.hass);if(void 0===n||n<=0)return K;const o=this._nodeStroke(t),a=Math.max(0,i-o-.5),l=2*a*n,c=`${t}-clip`,h=`${t}-grad`,d=(s?.layers??[]).map(t=>Ct(this.hass,t)).filter(t=>void 0!==t);let p,u=K;if(d.length>=2){const t=d.map((t,e)=>{const i=e/(d.length-1)*100;return W`<stop offset=${`${i}%`} stop-color=${Ot(t)}></stop>`});u=W`<linearGradient id=${h} x1="0" y1="0" x2="0" y2="1">${t}</linearGradient>`,p=`url(#${h})`}else p=1===d.length?Ot(d[0]):r;return W`
      <defs>
        ${u}
        <clipPath id=${c}><circle cx=${e.x} cy=${e.y} r=${a}></circle></clipPath>
      </defs>
      <rect
        class="strat-fill"
        x=${e.x-a}
        y=${e.y+a-l}
        width=${2*a}
        height=${l}
        fill=${p}
        clip-path=${`url(#${c})`}
      ></rect>
    `}_renderPill(t,e,i,s){const r=jt(.26*i,9,13),n=Math.min(2*i-6,s.length*r*.62+10),o=r+6;return W`
      <rect class="pill-bg" x=${t-n/2} y=${e-o/2} width=${n} height=${o} rx=${o/2}></rect>
      <text class="pill-text" x=${t} y=${e} dominant-baseline="central" style=${`font-size:${r}px`}>${s}</text>
    `}_renderBadge(t){const e=this._geom(t);if(!e)return K;const i=this._cfg(t),s=Ut(i,this.hass),r=this._nodeColor(t),n=this._nodeRadius(t),o=jt(Math.round(.66*n),14,28),a="gauge"===this._nodeKind(t)||!0===i?.gauge?function(t,e){const i=Ct(e,t?.primary);if(void 0===i)return;const s=t?.min??0,r=t?.max??100;return r<=s?void 0:Math.max(0,Math.min(1,(i-s)/(r-s)))}(i,this.hass):void 0,l=e.y+.2*n,c=this._nodeEntity(t);return W`
      <g
        style=${`color:${r}`}
        class=${c?"clickable":""}
        @click=${()=>this._openMoreInfo(c)}
      >
        <circle
          class="badge"
          cx=${e.x}
          cy=${e.y}
          r=${n}
          stroke="currentColor"
          stroke-width=${this._nodeStroke(t)}
        ></circle>
        ${this._icon(this._nodeIcon(t),e.x,e.y-.44*n,o)}
        ${s.primary?W`<text class="badge-text" x=${e.x} y=${l} dominant-baseline="central">${s.primary}</text>`:K}
        ${void 0!==a?W`
              <rect class="gauge-bg" x=${e.x-.6*n} y=${e.y+.5*n} width=${1.2*n} height="4" rx="2"></rect>
              <rect class="gauge-fill" x=${e.x-.6*n} y=${e.y+.5*n} width=${1.2*n*a} height="4" rx="2"></rect>`:K}
        <text class="node-label" x=${e.x} y=${e.y+n+12} dominant-baseline="central">${this._nodeLabel(t)}</text>
      </g>
    `}_nodeActive(t,e){return e.filter(e=>e.from===t||e.to===t).some(t=>Pt(this._config.edges?.[t.key],this.hass).active)}};It.styles=zt,t([ft({attribute:!1})],It.prototype,"hass",void 0),t([$t()],It.prototype,"_config",void 0),It=t([dt(_t)],It);export{It as EtaFlowCard};
