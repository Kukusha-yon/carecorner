import{i as a}from"./index-DFyuifyJ.js";const c={CISCO_SWITCH:"CISCO Switch",SERVER:"Server",MONITORS:"Monitors",LOGITECH_WORLD:"Logitech World",BAGS:"Bags",CHARGER:"Charger"},d=async(r={})=>{var t,e;try{console.log("getProducts called with params:",r);const o=localStorage.getItem("token");console.log("Authentication token for getProducts:",o?"Present":"Missing");const s=await a.get("/products",{params:{...r,admin:r.admin?"true":void 0},headers:o?{Authorization:`Bearer ${o}`}:{}});return console.log("getProducts response:",s.data),s.data}catch(o){throw console.error("Error in getProducts:",o),console.error("Error details:",{message:o.message,response:(t=o.response)==null?void 0:t.data,status:(e=o.response)==null?void 0:e.status}),o}},u=async r=>{var t,e,o;try{console.log("Fetching product with ID:",r);const s=await a.get(`/products/${r}`);return console.log("Product response:",s.data),s.data}catch(s){throw console.error("Error fetching product:",{id:r,error:((t=s.response)==null?void 0:t.data)||s.message,status:(e=s.response)==null?void 0:e.status,statusText:(o=s.response)==null?void 0:o.statusText}),s}},p=async r=>{try{const t=localStorage.getItem("token");if(!t)throw new Error("Authentication required");return(await a.post("/products",r,{headers:{"Content-Type":"multipart/form-data",Authorization:`Bearer ${t}`}})).data}catch(t){throw console.error("Create product error:",t),t}},i=async(r,t)=>{try{const e=localStorage.getItem("token");if(!e)throw new Error("Authentication required");return(await a.put(`/products/${r}`,t,{headers:{"Content-Type":"multipart/form-data",Authorization:`Bearer ${e}`}})).data}catch(e){throw console.error("Update product error:",e),e}},g=async r=>(await a.delete(`/products/${r}`)).data,h=async()=>{var r,t;try{const e=await a.get("/products/featured");if(!e.data||!Array.isArray(e.data))throw new Error("Invalid response format from server");return e.data}catch(e){throw console.error("Error fetching featured products:",e),new Error(((t=(r=e.response)==null?void 0:r.data)==null?void 0:t.message)||"Failed to fetch featured products")}},l=async r=>{console.log("Searching for products with query:",r);const t=await a.get("/products/search",{params:{q:r}});return console.log("Search response:",t.data),t.data},w=async r=>(await a.get(`/products/category/${encodeURIComponent(r)}`)).data;export{c as P,d as a,h as b,w as c,g as d,p as e,u as g,l as s,i as u};
