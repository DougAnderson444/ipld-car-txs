var Je=Object.defineProperty;var Ke=(a,e,t)=>e in a?Je(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var ue=(a,e,t)=>(Ke(a,typeof e!="symbol"?e+"":e,t),t);import{S as We,i as He,s as Fe,a as Me,e as q,c as Ge,b as K,g as te,t as x,d as ne,f as z,h as B,j as Ye,o as me,k as Xe,l as Qe,m as Ze,n as de,p as N,q as et,r as tt,u as nt,v as W,w as be,x as H,y as F,z as Ce}from"./chunks/index-4be5796e.js";import{g as De,f as Ne,a as Te,s as J,b as _e,i as rt,c as at}from"./chunks/singletons-e3f052ab.js";import{_ as Q}from"./chunks/preload-helper-aa6bc0ce.js";import"./chunks/index-ffd7719c.js";class Z{constructor(e,t){ue(this,"name","HttpError");ue(this,"stack");this.status=e,this.message=t!=null?t:`Error: ${e}`}toString(){return this.message}}class Ve{constructor(e,t){this.status=e,this.location=t}}function st(a,e){return a==="/"||e==="ignore"?a:e==="never"?a.endsWith("/")?a.slice(0,-1):a:e==="always"&&!a.endsWith("/")?a+"/":a}function it(a){for(const e in a)a[e]=a[e].replace(/%23/g,"#").replace(/%3[Bb]/g,";").replace(/%2[Cc]/g,",").replace(/%2[Ff]/g,"/").replace(/%3[Ff]/g,"?").replace(/%3[Aa]/g,":").replace(/%40/g,"@").replace(/%26/g,"&").replace(/%3[Dd]/g,"=").replace(/%2[Bb]/g,"+").replace(/%24/g,"$");return a}const ot=["href","pathname","search","searchParams","toString","toJSON"];function lt(a,e){const t=new URL(a);for(const o of ot){let i=t[o];Object.defineProperty(t,o,{get(){return e(),i},enumerable:!0,configurable:!0})}return t[Symbol.for("nodejs.util.inspect.custom")]=(o,i,d)=>d(a,i),ct(t),t}function ct(a){Object.defineProperty(a,"hash",{get(){throw new Error("Cannot access event.url.hash. Consider using `$page.url.hash` inside a component instead")}})}function ft(a){let e=5381,t=a.length;if(typeof a=="string")for(;t;)e=e*33^a.charCodeAt(--t);else for(;t;)e=e*33^a[--t];return(e>>>0).toString(36)}const ee=window.fetch;function ut(a,e){let o=`script[sveltekit\\:data-type="data"][sveltekit\\:data-url=${JSON.stringify(typeof a=="string"?a:a.url)}]`;e&&typeof e.body=="string"&&(o+=`[sveltekit\\:data-body="${ft(e.body)}"]`);const i=document.querySelector(o);if(i&&i.textContent){const{body:d,...n}=JSON.parse(i.textContent);return Promise.resolve(new Response(d,n))}return ee(a,e)}const dt=/^(\.\.\.)?(\w+)(?:=(\w+))?$/;function pt(a){const e=[],t=[];let o=!0;if(/\]\[/.test(a))throw new Error(`Invalid route ${a} \u2014 parameters must be separated`);if(qe("[",a)!==qe("]",a))throw new Error(`Invalid route ${a} \u2014 brackets are unbalanced`);return{pattern:a===""?/^\/$/:new RegExp(`^${a.split(/(?:\/|$)/).filter(ht).map((d,n,p)=>{const b=decodeURIComponent(d),h=/^\[\.\.\.(\w+)(?:=(\w+))?\]$/.exec(b);if(h)return e.push(h[1]),t.push(h[2]),"(?:/(.*))?";const g=n===p.length-1;return b&&"/"+b.split(/\[(.+?)\]/).map(($,E)=>{if(E%2){const I=dt.exec($);if(!I)throw new Error(`Invalid param: ${$}. Params and matcher names can only have underscores and alphanumeric characters.`);const[,U,M,G]=I;return e.push(M),t.push(G),U?"(.*?)":"([^/]+?)"}return g&&$.includes(".")&&(o=!1),$.normalize().replace(/%5[Bb]/g,"[").replace(/%5[Dd]/g,"]").replace(/#/g,"%23").replace(/\?/g,"%3F").replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}).join("")}).join("")}${o?"/?":""}$`),names:e,types:t}}function ht(a){return!/^\([^)]+\)$/.test(a)}function mt(a,e,t,o){const i={};for(let d=0;d<e.length;d+=1){const n=e[d],p=t[d],b=a[d+1]||"";if(p){const h=o[p];if(!h)throw new Error(`Missing "${p}" param matcher`);if(!h(b))return}i[n]=b}return i}function qe(a,e){let t=0;for(let o=0;o<e.length;o+=1)e[o]===a&&(t+=1);return t}function _t(a,e,t){return Object.entries(e).map(([o,[i,d,n]])=>{const{pattern:p,names:b,types:h}=pt(o),g=i<0;g&&(i=~i);const $={id:o,exec:E=>{const I=p.exec(E);if(I)return mt(I,b,h,t)},errors:[1,...n||[]].map(E=>a[E]),layouts:[0,...d||[]].map(E=>a[E]),leaf:a[i],uses_server_data:g};return $.errors.length=$.layouts.length=Math.max($.errors.length,$.layouts.length),$})}function gt(a,e){return new Z(a,e)}function wt(a){let e,t,o;var i=a[0][0];function d(n){return{props:{data:n[1],errors:n[3]}}}return i&&(e=new i(d(a))),{c(){e&&W(e.$$.fragment),t=q()},l(n){e&&be(e.$$.fragment,n),t=q()},m(n,p){e&&H(e,n,p),K(n,t,p),o=!0},p(n,p){const b={};if(p&2&&(b.data=n[1]),p&8&&(b.errors=n[3]),i!==(i=n[0][0])){if(e){te();const h=e;x(h.$$.fragment,1,0,()=>{F(h,1)}),ne()}i?(e=new i(d(n)),W(e.$$.fragment),z(e.$$.fragment,1),H(e,t.parentNode,t)):e=null}else i&&e.$set(b)},i(n){o||(e&&z(e.$$.fragment,n),o=!0)},o(n){e&&x(e.$$.fragment,n),o=!1},d(n){n&&B(t),e&&F(e,n)}}}function bt(a){let e,t,o;var i=a[0][0];function d(n){return{props:{data:n[1],errors:n[3],$$slots:{default:[yt]},$$scope:{ctx:n}}}}return i&&(e=new i(d(a))),{c(){e&&W(e.$$.fragment),t=q()},l(n){e&&be(e.$$.fragment,n),t=q()},m(n,p){e&&H(e,n,p),K(n,t,p),o=!0},p(n,p){const b={};if(p&2&&(b.data=n[1]),p&8&&(b.errors=n[3]),p&517&&(b.$$scope={dirty:p,ctx:n}),i!==(i=n[0][0])){if(e){te();const h=e;x(h.$$.fragment,1,0,()=>{F(h,1)}),ne()}i?(e=new i(d(n)),W(e.$$.fragment),z(e.$$.fragment,1),H(e,t.parentNode,t)):e=null}else i&&e.$set(b)},i(n){o||(e&&z(e.$$.fragment,n),o=!0)},o(n){e&&x(e.$$.fragment,n),o=!1},d(n){n&&B(t),e&&F(e,n)}}}function yt(a){let e,t,o;var i=a[0][1];function d(n){return{props:{data:n[2]}}}return i&&(e=new i(d(a))),{c(){e&&W(e.$$.fragment),t=q()},l(n){e&&be(e.$$.fragment,n),t=q()},m(n,p){e&&H(e,n,p),K(n,t,p),o=!0},p(n,p){const b={};if(p&4&&(b.data=n[2]),i!==(i=n[0][1])){if(e){te();const h=e;x(h.$$.fragment,1,0,()=>{F(h,1)}),ne()}i?(e=new i(d(n)),W(e.$$.fragment),z(e.$$.fragment,1),H(e,t.parentNode,t)):e=null}else i&&e.$set(b)},i(n){o||(e&&z(e.$$.fragment,n),o=!0)},o(n){e&&x(e.$$.fragment,n),o=!1},d(n){n&&B(t),e&&F(e,n)}}}function xe(a){let e,t=a[5]&&ze(a);return{c(){e=Xe("div"),t&&t.c(),this.h()},l(o){e=Qe(o,"DIV",{id:!0,"aria-live":!0,"aria-atomic":!0,style:!0});var i=Ze(e);t&&t.l(i),i.forEach(B),this.h()},h(){de(e,"id","svelte-announcer"),de(e,"aria-live","assertive"),de(e,"aria-atomic","true"),N(e,"position","absolute"),N(e,"left","0"),N(e,"top","0"),N(e,"clip","rect(0 0 0 0)"),N(e,"clip-path","inset(50%)"),N(e,"overflow","hidden"),N(e,"white-space","nowrap"),N(e,"width","1px"),N(e,"height","1px")},m(o,i){K(o,e,i),t&&t.m(e,null)},p(o,i){o[5]?t?t.p(o,i):(t=ze(o),t.c(),t.m(e,null)):t&&(t.d(1),t=null)},d(o){o&&B(e),t&&t.d()}}}function ze(a){let e;return{c(){e=et(a[6])},l(t){e=tt(t,a[6])},m(t,o){K(t,e,o)},p(t,o){o&64&&nt(e,t[6])},d(t){t&&B(e)}}}function vt(a){let e,t,o,i,d;const n=[bt,wt],p=[];function b(g,$){return g[0][1]?0:1}e=b(a),t=p[e]=n[e](a);let h=a[4]&&xe(a);return{c(){t.c(),o=Me(),h&&h.c(),i=q()},l(g){t.l(g),o=Ge(g),h&&h.l(g),i=q()},m(g,$){p[e].m(g,$),K(g,o,$),h&&h.m(g,$),K(g,i,$),d=!0},p(g,[$]){let E=e;e=b(g),e===E?p[e].p(g,$):(te(),x(p[E],1,1,()=>{p[E]=null}),ne(),t=p[e],t?t.p(g,$):(t=p[e]=n[e](g),t.c()),z(t,1),t.m(o.parentNode,o)),g[4]?h?h.p(g,$):(h=xe(g),h.c(),h.m(i.parentNode,i)):h&&(h.d(1),h=null)},i(g){d||(z(t),d=!0)},o(g){x(t),d=!1},d(g){p[e].d(g),g&&B(o),h&&h.d(g),g&&B(i)}}}function kt(a,e,t){let{stores:o}=e,{page:i}=e,{components:d}=e,{data_0:n=null}=e,{data_1:p=null}=e,{errors:b}=e;Ye(o.page.notify);let h=!1,g=!1,$=null;return me(()=>{const E=o.page.subscribe(()=>{h&&(t(5,g=!0),t(6,$=document.title||"untitled page"))});return t(4,h=!0),E}),a.$$set=E=>{"stores"in E&&t(7,o=E.stores),"page"in E&&t(8,i=E.page),"components"in E&&t(0,d=E.components),"data_0"in E&&t(1,n=E.data_0),"data_1"in E&&t(2,p=E.data_1),"errors"in E&&t(3,b=E.errors)},a.$$.update=()=>{a.$$.dirty&384&&o.page.set(i)},[d,n,p,b,h,g,$,o,i]}class Et extends We{constructor(e){super(),He(this,e,kt,vt,Fe,{stores:7,page:8,components:0,data_0:1,data_1:2,errors:3})}}const $t={},re=[()=>Q(()=>import("./chunks/0-de8a0d34.js"),["chunks\\0-de8a0d34.js","components\\pages\\_layout.svelte-760f918b.js","assets\\+layout-7a096437.css","chunks\\index-4be5796e.js"],import.meta.url),()=>Q(()=>import("./chunks/1-a822ab0a.js"),["chunks\\1-a822ab0a.js","components\\error.svelte-91511b35.js","chunks\\index-4be5796e.js","chunks\\singletons-e3f052ab.js","chunks\\index-ffd7719c.js"],import.meta.url),()=>Q(()=>import("./chunks/2-24ba825e.js"),["chunks\\2-24ba825e.js","components\\pages\\_page.svelte-ae67f28a.js","assets\\+page-529a785d.css","chunks\\index-4be5796e.js","chunks\\preload-helper-aa6bc0ce.js","chunks\\index-0a678716.js","chunks\\index-ffd7719c.js"],import.meta.url),()=>Q(()=>import("./chunks/3-b32d78a9.js"),["chunks\\3-b32d78a9.js","components\\pages\\simple\\_page.svelte-d346294b.js","chunks\\index-4be5796e.js","chunks\\dagRepo-9c69aabb.js","chunks\\index-0a678716.js"],import.meta.url)],St={"":[2],simple:[3]},Be="sveltekit:scroll",V="sveltekit:index",pe=_t(re,St,$t),ge=re[0],we=re[1];ge();we();let Y={};try{Y=JSON.parse(sessionStorage[Be])}catch{}function he(a){Y[a]=_e()}function Rt({target:a,base:e,trailing_slash:t}){var je;const o=[],i={id:null,promise:null},d={before_navigate:[],after_navigate:[]};let n={branch:[],error:null,session_id:0,url:null},p=!1,b=!0,h=!1,g=1,$=null,E,I=!0,U=(je=history.state)==null?void 0:je[V];U||(U=Date.now(),history.replaceState({...history.state,[V]:U},"",location.href));const M=Y[U];M&&(history.scrollRestoration="manual",scrollTo(M.x,M.y));let G=!1,ae,ye;async function ve(r,{noscroll:c=!1,replaceState:f=!1,keepfocus:s=!1,state:l={}},y){if(typeof r=="string"&&(r=new URL(r,De(document))),I)return le({url:r,scroll:c?_e():null,keepfocus:s,redirect_chain:y,details:{state:l,replaceState:f},accepted:()=>{},blocked:()=>{}});await T(r)}async function ke(r){const c=Le(r);if(!c)throw new Error("Attempted to prefetch a URL that does not belong to this app");return i.promise=Re(c),i.id=c.id,i.promise}async function Ee(r,c,f,s){var w,R,P;const l=Le(r),y=ye={};let u=l&&await Re(l);if(!u&&r.origin===location.origin&&r.pathname===location.pathname&&(u=await oe({status:404,error:new Error(`Not found: ${r.pathname}`),url:r,routeId:null})),!u)return await T(r),!1;if(r=(l==null?void 0:l.url)||r,ye!==y)return!1;if(o.length=0,u.type==="redirect")if(c.length>10||c.includes(r.pathname))u=await oe({status:500,error:new Error("Redirect loop"),url:r,routeId:null});else return I?ve(new URL(u.location,r).href,{},[...c,r.pathname]):await T(new URL(u.location,location.href)),!1;else((R=(w=u.props)==null?void 0:w.page)==null?void 0:R.status)>=400&&await J.updated.check()&&await T(r);if(h=!0,f&&f.details){const{details:k}=f,L=k.replaceState?0:1;k.state[V]=U+=L,history[k.replaceState?"replaceState":"pushState"](k.state,"",r)}if(p?(n=u.state,u.props.page&&(u.props.page.url=r),E.$set(u.props)):$e(u),f){const{scroll:k,keepfocus:L}=f;if(!L){const S=document.body,O=S.getAttribute("tabindex");S.tabIndex=-1,S.focus({preventScroll:!0}),setTimeout(()=>{var _;(_=getSelection())==null||_.removeAllRanges()}),O!==null?S.setAttribute("tabindex",O):S.removeAttribute("tabindex")}if(await Ce(),b){const S=r.hash&&document.getElementById(r.hash.slice(1));k?scrollTo(k.x,k.y):S?S.scrollIntoView():scrollTo(0,0)}}else await Ce();i.promise=null,i.id=null,b=!0,u.props.page&&(ae=u.props.page);const v=u.state.branch[u.state.branch.length-1];I=((P=v==null?void 0:v.node.shared)==null?void 0:P.router)!==!1,s&&s(),h=!1}function $e(r){n=r.state;const c=document.querySelector("style[data-sveltekit]");if(c&&c.remove(),ae=r.props.page,E=new Et({target:a,props:{...r.props,stores:J},hydrate:!0}),I){const f={from:null,to:new URL(location.href)};d.after_navigate.forEach(s=>s(f))}p=!0}async function X({url:r,params:c,branch:f,status:s,error:l,routeId:y,validation_errors:u}){const v=f.filter(Boolean),w={type:"loaded",state:{url:r,params:c,branch:f,error:l,session_id:g},props:{components:v.map(L=>L.node.component),errors:u}};let R={},P=!1;for(let L=0;L<v.length;L+=1)R={...R,...v[L].data},(P||!n.branch.some(S=>S===v[L]))&&(w.props[`data_${L}`]=R,P=!0);if(!n.url||r.href!==n.url.href||n.error!==l||P){w.props.page={error:l,params:c,routeId:y,status:s,url:r,data:R};const L=(S,O)=>{Object.defineProperty(w.props.page,S,{get:()=>{throw new Error(`$page.${S} has been replaced by $page.url.${O}`)}})};L("origin","origin"),L("path","pathname"),L("query","searchParams")}return w}async function se({loader:r,parent:c,url:f,params:s,routeId:l,server_data_node:y}){var R,P,k,L,S;let u=null;const v={dependencies:new Set,params:new Set,parent:!1,url:!1},w=await r();if((R=w.shared)!=null&&R.load){let O=function(...m){for(const j of m){const{href:C}=new URL(j,f);v.dependencies.add(C)}};const _={};for(const m in s)Object.defineProperty(_,m,{get(){return v.params.add(m),s[m]},enumerable:!0});const A={routeId:l,params:_,data:(P=y==null?void 0:y.data)!=null?P:null,url:lt(f,()=>{v.url=!0}),async fetch(m,j){let C;typeof m=="string"?C=m:(C=m.url,j={body:m.method==="GET"||m.method==="HEAD"?void 0:await m.blob(),cache:m.cache,credentials:m.credentials,headers:m.headers,integrity:m.integrity,keepalive:m.keepalive,method:m.method,mode:m.mode,redirect:m.redirect,referrer:m.referrer,referrerPolicy:m.referrerPolicy,signal:m.signal,...j});const D=new URL(C,f).href;return O(D),p?ee(D,j):ut(C,j)},setHeaders:()=>{},depends:O,parent(){return v.parent=!0,c()}};Object.defineProperties(A,{props:{get(){throw new Error("@migration task: Replace `props` with `data` stuff https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693")},enumerable:!1},session:{get(){throw new Error("session is no longer available. See https://github.com/sveltejs/kit/discussions/5883")},enumerable:!1},stuff:{get(){throw new Error("@migration task: Remove stuff https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693")},enumerable:!1}}),u=(k=await w.shared.load.call(null,A))!=null?k:null}return{node:w,loader:r,server:y,shared:(L=w.shared)!=null&&L.load?{type:"data",data:u,uses:v}:null,data:(S=u!=null?u:y==null?void 0:y.data)!=null?S:null}}function Se(r,c,f){if(!f)return!1;if(f.parent&&c||r.url&&f.url)return!0;for(const s of r.params)if(f.params.has(s))return!0;for(const s of f.dependencies)if(o.some(l=>l(s)))return!0;return!1}function ie(r){var c,f;return(r==null?void 0:r.type)==="data"?{type:"data",data:r.data,uses:{dependencies:new Set((c=r.uses.dependencies)!=null?c:[]),params:new Set((f=r.uses.params)!=null?f:[]),parent:!!r.uses.parent,url:!!r.uses.url}}:null}async function Re({id:r,url:c,params:f,route:s}){if(i.id===r&&i.promise)return i.promise;const{errors:l,layouts:y,leaf:u}=s,v=n.url&&{url:r!==n.url.pathname+n.url.search,params:Object.keys(f).filter(_=>n.params[_]!==f[_])};[...l,...y,u].forEach(_=>_==null?void 0:_().catch(()=>{}));const w=[...y,u];let R=null;const P=w.reduce((_,A,m)=>{var D;const j=n.branch[m],C=A&&((j==null?void 0:j.loader)!==A||Se(v,_.some(Boolean),(D=j.server)==null?void 0:D.uses));return _.push(C),_},[]);if(s.uses_server_data&&P.some(Boolean)){try{const _=await ee(`${c.pathname}${c.pathname.endsWith("/")?"":"/"}__data.json${c.search}`,{headers:{"x-sveltekit-invalidated":P.map(A=>A?"1":"").join(",")}});if(R=await _.json(),!_.ok)throw R}catch{T(c);return}if(R.type==="redirect")return R}const k=R==null?void 0:R.nodes;let L=!1;const S=w.map(async(_,A)=>{var ce,Pe,Oe,Ae;if(!_)return;const m=n.branch[A],j=(ce=k==null?void 0:k[A])!=null?ce:null;if((!j||j.type==="skip")&&_===(m==null?void 0:m.loader)&&!Se(v,L,(Pe=m.shared)==null?void 0:Pe.uses))return m;if(L=!0,(j==null?void 0:j.type)==="error")throw j.httperror?gt(j.httperror.status,j.httperror.message):j.error;return se({loader:_,url:c,params:f,routeId:s.id,parent:async()=>{var Ie;const Ue={};for(let fe=0;fe<A;fe+=1)Object.assign(Ue,(Ie=await S[fe])==null?void 0:Ie.data);return Ue},server_data_node:(Ae=(Oe=ie(j))!=null?Oe:m==null?void 0:m.server)!=null?Ae:null})});for(const _ of S)_.catch(()=>{});const O=[];for(let _=0;_<w.length;_+=1)if(w[_])try{O.push(await S[_])}catch(A){const m=A;if(m instanceof Ve)return{type:"redirect",location:m.location};const j=A instanceof Z?A.status:500;for(;_--;)if(l[_]){let C,D=_;for(;!O[D];)D-=1;try{return C={node:await l[_](),loader:l[_],data:{},server:null,shared:null},await X({url:c,params:f,branch:O.slice(0,D+1).concat(C),status:j,error:m,routeId:s.id})}catch{continue}}T(c);return}else O.push(void 0);return await X({url:c,params:f,branch:O,status:200,error:null,routeId:s.id})}async function oe({status:r,error:c,url:f,routeId:s}){var R;const l={},y=await ge();let u=null;if(y.server){const P=await ee(`${f.pathname}${f.pathname.endsWith("/")?"":"/"}__data.json${f.search}`,{headers:{"x-sveltekit-invalidated":"1"}}),k=await P.json();if(u=(R=k==null?void 0:k[0])!=null?R:null,!P.ok||(k==null?void 0:k.type)!=="data"){T(f);return}}const v=await se({loader:ge,url:f,params:l,routeId:s,parent:()=>Promise.resolve({}),server_data_node:ie(u)}),w={node:await we(),loader:we,shared:null,server:null,data:null};return await X({url:f,params:l,branch:[v,w],status:r,error:c,routeId:s})}function Le(r){if(r.origin!==location.origin||!r.pathname.startsWith(e))return;const c=decodeURI(r.pathname.slice(e.length)||"/");for(const f of pe){const s=f.exec(c);if(s){const l=new URL(r.origin+st(r.pathname,t)+r.search+r.hash);return{id:l.pathname+l.search,route:f,params:it(s),url:l}}}}async function le({url:r,scroll:c,keepfocus:f,redirect_chain:s,details:l,accepted:y,blocked:u}){const v=n.url;let w=!1;const R={from:v,to:r,cancel:()=>w=!0};if(d.before_navigate.forEach(P=>P(R)),w){u();return}he(U),y(),p&&J.navigating.set({from:n.url,to:r}),await Ee(r,s,{scroll:c,keepfocus:f,details:l},()=>{const P={from:v,to:r};d.after_navigate.forEach(k=>k(P)),J.navigating.set(null)})}function T(r){return location.href=r.href,new Promise(()=>{})}return{after_navigate:r=>{me(()=>(d.after_navigate.push(r),()=>{const c=d.after_navigate.indexOf(r);d.after_navigate.splice(c,1)}))},before_navigate:r=>{me(()=>(d.before_navigate.push(r),()=>{const c=d.before_navigate.indexOf(r);d.before_navigate.splice(c,1)}))},disable_scroll_handling:()=>{(h||!p)&&(b=!1)},goto:(r,c={})=>ve(r,c,[]),invalidate:r=>{var c,f;if(r===void 0){for(const s of n.branch)(c=s==null?void 0:s.server)==null||c.uses.dependencies.add(""),(f=s==null?void 0:s.shared)==null||f.uses.dependencies.add("");o.push(()=>!0)}else if(typeof r=="function")o.push(r);else{const{href:s}=new URL(r,location.href);o.push(l=>l===s)}return $||($=Promise.resolve().then(async()=>{await Ee(new URL(location.href),[]),$=null})),$},prefetch:async r=>{const c=new URL(r,De(document));await ke(c)},prefetch_routes:async r=>{const f=(r?pe.filter(s=>r.some(l=>s.exec(l))):pe).map(s=>Promise.all([...s.layouts,s.leaf].map(l=>l==null?void 0:l())));await Promise.all(f)},_start_router:()=>{history.scrollRestoration="manual",addEventListener("beforeunload",s=>{let l=!1;const y={from:n.url,to:null,cancel:()=>l=!0};d.before_navigate.forEach(u=>u(y)),l?(s.preventDefault(),s.returnValue=""):history.scrollRestoration="auto"}),addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"){he(U);try{sessionStorage[Be]=JSON.stringify(Y)}catch{}}});const r=s=>{const l=Ne(s);l&&l.href&&l.hasAttribute("sveltekit:prefetch")&&ke(Te(l))};let c;const f=s=>{clearTimeout(c),c=setTimeout(()=>{var l;(l=s.target)==null||l.dispatchEvent(new CustomEvent("sveltekit:trigger_prefetch",{bubbles:!0}))},20)};addEventListener("touchstart",r),addEventListener("mousemove",f),addEventListener("sveltekit:trigger_prefetch",r),addEventListener("click",s=>{if(!I||s.button||s.which!==1||s.metaKey||s.ctrlKey||s.shiftKey||s.altKey||s.defaultPrevented)return;const l=Ne(s);if(!l||!l.href)return;const y=l instanceof SVGAElement,u=Te(l);if(!y&&!(u.protocol==="https:"||u.protocol==="http:"))return;const v=(l.getAttribute("rel")||"").split(/\s+/);if(l.hasAttribute("download")||v.includes("external")||l.hasAttribute("sveltekit:reload")||(y?l.target.baseVal:l.target))return;const[w,R]=u.href.split("#");if(R!==void 0&&w===location.href.split("#")[0]){G=!0,he(U),J.page.set({...ae,url:u}),J.page.notify();return}le({url:u,scroll:l.hasAttribute("sveltekit:noscroll")?_e():null,keepfocus:!1,redirect_chain:[],details:{state:{},replaceState:u.href===location.href},accepted:()=>s.preventDefault(),blocked:()=>s.preventDefault()})}),addEventListener("popstate",s=>{if(s.state&&I){if(s.state[V]===U)return;le({url:new URL(location.href),scroll:Y[s.state[V]],keepfocus:!1,redirect_chain:[],details:null,accepted:()=>{U=s.state[V]},blocked:()=>{const l=U-s.state[V];history.go(l)}})}}),addEventListener("hashchange",()=>{G&&(G=!1,history.replaceState({...history.state,[V]:++U},"",location.href))});for(const s of document.querySelectorAll("link"))s.rel==="icon"&&(s.href=s.href);addEventListener("pageshow",s=>{s.persisted&&J.navigating.set(null)})},_hydrate:async({status:r,error:c,node_ids:f,params:s,routeId:l})=>{const y=new URL(location.href);let u;try{const v=(k,L)=>{const S=document.querySelector(`script[sveltekit\\:data-type="${k}"]`);return S!=null&&S.textContent?JSON.parse(S.textContent):L},w=v("server_data",[]),R=v("validation_errors",void 0),P=f.map(async(k,L)=>se({loader:re[k],url:y,params:s,routeId:l,parent:async()=>{const S={};for(let O=0;O<L;O+=1)Object.assign(S,(await P[O]).data);return S},server_data_node:ie(w[L])}));u=await X({url:y,params:s,branch:await Promise.all(P),status:r,error:c!=null&&c.__is_http_error?new Z(c.status,c.message):c,validation_errors:R,routeId:l})}catch(v){const w=v;if(w instanceof Ve){await T(new URL(v.location,location.href));return}u=await oe({status:w instanceof Z?w.status:500,error:w,url:y,routeId:l})}$e(u)}}}function Ut(a){}async function It({paths:a,target:e,route:t,spa:o,trailing_slash:i,hydrate:d}){const n=Rt({target:e,base:a.base,trailing_slash:i});rt({client:n}),at(a),d&&await n._hydrate(d),t&&(o&&n.goto(location.href,{replaceState:!0}),n._start_router()),dispatchEvent(new CustomEvent("sveltekit:start"))}export{Ut as set_public_env,It as start};
