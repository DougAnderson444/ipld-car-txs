import{S as H,i as $,s as A,q as x,r as _,b,A as p,h as C,o as S}from"./index-4be5796e.js";import{v as N,e as I,d as J,C as f,p as L,c as R,a as z,b as E,f as M,g as U,i as v,h as P,j as W,k as G,l as q,A as X,m as F,n as K,T as B}from"./index-0a678716.js";function Q(e){let t,r;return{c(){t=x("CarTX: "),r=x(e[0])},l(a){t=_(a,"CarTX: "),r=_(a,e[0])},m(a,s){b(a,t,s),b(a,r,s)},p,i:p,o:p,d(a){a&&C(t),a&&C(r)}}}function V(e){let t;return S(async()=>{let r;globalThis.dag?r=globalThis.dag:(r=await D(),globalThis.dag=r);let a="Mobile",s="Landline";await r.tx.add(a,{number:"555-1234"});const d=await r.tx.commit();await r.tx.add(a,{number:"212-555-1234"}),await r.tx.add(s,{number:"555-555-1234"});const i=await r.tx.commit();let o=(await r.get(r.rootCID,{path:`/${a}/current/number`})).value;console.log({currentNumber:o});let n=(await r.get(r.rootCID,{path:`/${a}/prev/number`})).value;console.log({prevNumber:n});let c;globalThis.rebuiltDag?c=globalThis.rebuiltDag:(c=await D({path:"rebuiltDag"}),globalThis.rebuiltDag=c),await c.importBuffers([d,i]);let u=(await c.get(r.rootCID,{path:`/${a}/current/number`})).value;console.log({rebuiltCurrent:u})}),[t]}class Te extends H{constructor(t){super(),$(this,t,V,Q,A,{})}}async function*Y(e){let t=0;for(;t<e.length;)yield e[t++]}const Z="dag-pb",j=112;function ee(e){N(e);const t={};return e.Links&&(t.Links=e.Links.map(r=>{const a={};return r.Hash&&(a.Hash=r.Hash.bytes),r.Name!==void 0&&(a.Name=r.Name),r.Tsize!==void 0&&(a.Tsize=r.Tsize),a})),e.Data&&(t.Data=e.Data),I(t)}function te(e){const t=J(e),r={};return t.Data&&(r.Data=t.Data),t.Links&&(r.Links=t.Links.map(a=>{const s={};try{s.Hash=f.decode(a.Hash)}catch{}if(!s.Hash)throw new Error("Invalid Hash field found in link, expected CID");return a.Name!==void 0&&(s.Name=a.Name),a.Tsize!==void 0&&(s.Tsize=a.Tsize),s})),r}const re=Object.freeze(Object.defineProperty({__proto__:null,name:Z,code:j,encode:ee,decode:te,prepare:L,validate:N,createNode:R,createLink:z},Symbol.toStringTag,{value:"Module"}));function h(e){return E.encode(e).slice(1)}function l(e){return E.decode(`u${e}`)}function ae(e){const[t,r,a]=e;return{payload:r,signatures:[{protected:t,signature:a}],link:f.decode(l(r))}}function ie(e){const t={signature:l(e.signature)};return e.header&&(t.header=e.header),e.protected&&(t.protected=l(e.protected)),t}function ne(e){const t=l(e.payload);try{f.decode(t)}catch{throw new Error("Not a valid DagJWS")}return{payload:t,signatures:e.signatures.map(ie)}}function se(e){const t={signature:h(e.signature)};return e.header&&(t.header=e.header),e.protected&&(t.protected=h(e.protected)),t}function oe(e){const t={payload:h(e.payload),signatures:e.signatures.map(se)};return t.link=f.decode(new Uint8Array(e.payload)),t}function ce(e){const[t,r,a,s,d]=e,i={ciphertext:s,iv:a,protected:t,tag:d};return r&&(i.recipients=[{encrypted_key:r}]),i}function de(e){const t={};return e.encrypted_key&&(t.encrypted_key=l(e.encrypted_key)),e.header&&(t.header=e.header),t}function le(e){const t={ciphertext:l(e.ciphertext),protected:l(e.protected),iv:l(e.iv),tag:l(e.tag)};return e.aad&&(t.aad=l(e.aad)),e.recipients&&(t.recipients=e.recipients.map(de)),e.unprotected&&(t.unprotected=e.unprotected),t}function he(e){const t={};return e.encrypted_key&&(t.encrypted_key=h(e.encrypted_key)),e.header&&(t.header=e.header),t}function ue(e){const t={ciphertext:h(e.ciphertext),protected:h(e.protected),iv:h(e.iv),tag:h(e.tag)};return e.aad&&(t.aad=h(e.aad)),e.recipients&&(t.recipients=e.recipients.map(he)),e.unprotected&&(t.unprotected=e.unprotected),t}const fe="dag-jose",pe=133;function k(e){return"payload"in e&&typeof e.payload=="string"&&"signatures"in e&&Array.isArray(e.signatures)}function ge(e){return"payload"in e&&e.payload instanceof Uint8Array&&"signatures"in e&&Array.isArray(e.signatures)}function ye(e){return"ciphertext"in e&&e.ciphertext instanceof Uint8Array&&"iv"in e&&e.iv instanceof Uint8Array&&"protected"in e&&e.protected instanceof Uint8Array&&"tag"in e&&e.tag instanceof Uint8Array}function T(e){return"ciphertext"in e&&typeof e.ciphertext=="string"&&"iv"in e&&typeof e.iv=="string"&&"protected"in e&&typeof e.protected=="string"&&"tag"in e&&typeof e.tag=="string"}function O(e){if(typeof e=="string"){const t=e.split(".");if(t.length===3)return ae(t);if(t.length===5)return ce(t);throw new Error("Not a valid JOSE string")}if(k(e)||T(e))return e;throw new Error("Not a valid unencoded JOSE object")}function me(e){typeof e=="string"&&(e=O(e));let t;if(k(e))t=ne(e);else if(T(e))t=le(e);else throw new Error("Not a valid JOSE object");return new Uint8Array(M(t))}function we(e){let t;try{t=U(e)}catch{throw new Error("Not a valid DAG-JOSE object")}if(ge(t))return oe(t);if(ye(t))return ue(t);throw new Error("Not a valid DAG-JOSE object")}const xe=Object.freeze(Object.defineProperty({__proto__:null,name:fe,code:pe,toGeneral:O,encode:me,decode:we},Symbol.toStringTag,{value:"Module"})),_e=e=>Promise.reject(new Error(`No codec found for "${e}"`));class be{constructor(t){this._codecsByName={},this._codecsByCode={},this._loadCodec=t.loadCodec||_e;for(const r of t.codecs)this.addCodec(r)}addCodec(t){if(this._codecsByName[t.name]||this._codecsByCode[t.code])throw new Error(`Resolver already exists for codec "${t.name}"`);this._codecsByName[t.name]=t,this._codecsByCode[t.code]=t}removeCodec(t){delete this._codecsByName[t.name],delete this._codecsByCode[t.code]}async getCodec(t){const r=typeof t=="string"?this._codecsByName:this._codecsByCode;if(r[t])return r[t];const a=await this._loadCodec(t);return r[t]==null&&this.addCodec(a),a}listCodecs(){return Object.values(this._codecsByName)}}const Ce=e=>Promise.reject(new Error(`No hasher found for "${e}"`));class ve{constructor(t){this._hashersByName={},this._hashersByCode={},this._loadHasher=t.loadHasher||Ce;for(const r of t.hashers)this.addHasher(r)}addHasher(t){if(this._hashersByName[t.name]||this._hashersByCode[t.code])throw new Error(`Resolver already exists for codec "${t.name}"`);this._hashersByName[t.name]=t,this._hashersByCode[t.code]=t}removeHasher(t){delete this._hashersByName[t.name],delete this._hashersByCode[t.code]}async getHasher(t){const r=typeof t=="string"?this._hashersByName:this._hashersByCode;if(r[t])return r[t];const a=await this._loadHasher(t);return r[t]==null&&this.addHasher(a),a}listHashers(){return Object.values(this._hashersByName)}}const Be=async e=>{const t=[];for await(const r of e)t.push(r);return t};var De=Be;class Ne extends X{constructor({repo:t,codecs:r,options:a}){const s=Object.values(F);(a.ipld&&a.ipld.hashers?a.ipld.hashers:[]).forEach(i=>s.push(i));const d=new ve({hashers:s,loadHasher:a.ipld&&a.ipld.loadHasher});super({repo:t,codecs:r,hashers:d,preload:i=>{}}),Object.assign(this,K()),this.repo=t,this.rootCID,this.tx={pending:B.create(),getExistingTx:async()=>{let i={};try{console.log({pending:this.tx.pending});let o=this.tx.pending.last;if(!o)return;console.log({last:o});let n=await this.tx.pending.get(o);console.log({lastBlock:n}),i=n.value,console.log({existingTx:i})}catch{}return i},add:async(i,o)=>{var m;let n=!1,c=await this.tx.getExistingTx();if(c&&c[i])n=c[i].current;else if(this.rootCID)try{n=((m=(await this.get(this.rootCID)).value[i])==null?void 0:m.current)||!1}catch(w){console.log(`no prev dag ${i}`,w)}let u=await this.tx.pending.add(o),g=Object.assign({},c,{[i]:{current:u,prev:n}});console.log({newBlock:g});let y=await this.tx.pending.add(g);return this.emit("added",y),y},commit:async()=>{let i=await this.tx.getExistingTx(),o={};try{this.rootCID&&(o=(await this.get(this.rootCID)).value)}catch(u){console.log({error:u})}let n=Object.assign({},o,i);this.rootCID=await this.tx.pending.add(n);const c=await this.tx.pending.commit();return await this.importBuffer(c),this.tx.pending=B.create(),c}}}async importBuffers(t){let r;for(const a of t)r=await this.importBuffer(a);return r}async importBuffer(t){const r=await Y([t]),[{root:a}]=await De(this.import(r));return a.cid}}async function D(e={}){const t={name:v.name,code:v.code,encode:n=>n,decode:n=>n},r=Object.values(P);[re,W,G,xe,t].concat(e.ipld&&e.ipld.codecs||[]).forEach(n=>r.push(n));const a=new be({codecs:r,loadCodec:e.ipld&&e.ipld.loadCodec}),s=e.path||"ipfs",d=q(console.log,a,{path:s,autoMigrate:!0}),i={};try{await d.init(i),await d.open()}catch(n){throw n}const o=await d.config.getAll();return new Ne({repo:d,codecs:a,options:{...e,repoConfig:o}})}export{Te as C,D as c,Y as m};
