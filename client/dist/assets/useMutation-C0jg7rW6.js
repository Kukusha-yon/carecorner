var x=i=>{throw TypeError(i)};var g=(i,t,s)=>t.has(i)||x("Cannot "+s);var e=(i,t,s)=>(g(i,t,"read from private field"),s?s.call(i):t.get(i)),b=(i,t,s)=>t.has(i)?x("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(i):t.set(i,s),p=(i,t,s,r)=>(g(i,t,"write to private field"),r?r.call(i,s):t.set(i,s),s),m=(i,t,s)=>(g(i,t,"access private method"),s);import{K as U,M as k,N as K,O as q,Q as R,z as L,r as f,T as Q,W as T}from"./index-DFyuifyJ.js";var a,l,h,o,u,M,C,w,j=(w=class extends U{constructor(t,s){super();b(this,u);b(this,a);b(this,l);b(this,h);b(this,o);p(this,a,t),this.setOptions(s),this.bindMethods(),m(this,u,M).call(this)}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(t){var r;const s=this.options;this.options=e(this,a).defaultMutationOptions(t),k(this.options,s)||e(this,a).getMutationCache().notify({type:"observerOptionsUpdated",mutation:e(this,h),observer:this}),s!=null&&s.mutationKey&&this.options.mutationKey&&K(s.mutationKey)!==K(this.options.mutationKey)?this.reset():((r=e(this,h))==null?void 0:r.state.status)==="pending"&&e(this,h).setOptions(this.options)}onUnsubscribe(){var t;this.hasListeners()||(t=e(this,h))==null||t.removeObserver(this)}onMutationUpdate(t){m(this,u,M).call(this),m(this,u,C).call(this,t)}getCurrentResult(){return e(this,l)}reset(){var t;(t=e(this,h))==null||t.removeObserver(this),p(this,h,void 0),m(this,u,M).call(this),m(this,u,C).call(this)}mutate(t,s){var r;return p(this,o,s),(r=e(this,h))==null||r.removeObserver(this),p(this,h,e(this,a).getMutationCache().build(e(this,a),this.options)),e(this,h).addObserver(this),e(this,h).execute(t)}},a=new WeakMap,l=new WeakMap,h=new WeakMap,o=new WeakMap,u=new WeakSet,M=function(){var s;const t=((s=e(this,h))==null?void 0:s.state)??q();p(this,l,{...t,isPending:t.status==="pending",isSuccess:t.status==="success",isError:t.status==="error",isIdle:t.status==="idle",mutate:this.mutate,reset:this.reset})},C=function(t){R.batch(()=>{var s,r,n,v,c,y,E,S;if(e(this,o)&&this.hasListeners()){const d=e(this,l).variables,O=e(this,l).context;(t==null?void 0:t.type)==="success"?((r=(s=e(this,o)).onSuccess)==null||r.call(s,t.data,d,O),(v=(n=e(this,o)).onSettled)==null||v.call(n,t.data,null,d,O)):(t==null?void 0:t.type)==="error"&&((y=(c=e(this,o)).onError)==null||y.call(c,t.error,d,O),(S=(E=e(this,o)).onSettled)==null||S.call(E,void 0,t.error,d,O))}this.listeners.forEach(d=>{d(e(this,l))})})},w);function D(i,t){const s=L(),[r]=f.useState(()=>new j(s,i));f.useEffect(()=>{r.setOptions(i)},[r,i]);const n=f.useSyncExternalStore(f.useCallback(c=>r.subscribe(R.batchCalls(c)),[r]),()=>r.getCurrentResult(),()=>r.getCurrentResult()),v=f.useCallback((c,y)=>{r.mutate(c,y).catch(Q)},[r]);if(n.error&&T(r.options.throwOnError,[n.error]))throw n.error;return{...n,mutate:v,mutateAsync:n.mutate}}export{D as u};
