import{i as n}from"./index-DFyuifyJ.js";const o="/featured-products",p=async(e=!1)=>{try{return(await n.get(`${o}${e?"?includeInactive=true":""}`)).data}catch(t){throw console.error("Error fetching featured products:",t),t}},c=async e=>{try{return(await n.get(`${o}/${e}`)).data}catch(t){throw console.error("Error fetching featured product:",t),t}},u=async e=>{try{return(await n.get(`${o}/product/${e}`)).data}catch(t){throw console.error("Error fetching featured product by product ID:",t),t}},g=async e=>{var t,d;try{if(e instanceof FormData){if(!e.get("title")||!e.get("description")||!e.get("link")||!e.get("productId"))throw new Error("All required fields must be provided");if(!e.get("image"))throw new Error("Image is required");return(await n.post(o,e,{headers:{"Content-Type":"multipart/form-data"}})).data}else{const r=new FormData;if(r.append("title",e.title||""),r.append("description",e.description||""),r.append("link",e.link||""),r.append("productId",e.productId||""),e.detailedDescription&&r.append("detailedDescription",e.detailedDescription),e.order!==void 0&&r.append("order",e.order),e.isActive!==void 0&&r.append("isActive",e.isActive),e.startDate&&r.append("startDate",e.startDate),e.endDate&&r.append("endDate",e.endDate),e.buttonText&&r.append("buttonText",e.buttonText),e.highlightText&&r.append("highlightText",e.highlightText),e.features&&r.append("features",JSON.stringify(e.features)),e.specifications&&r.append("specifications",JSON.stringify(e.specifications)),e.seoMetadata&&r.append("seoMetadata",JSON.stringify(e.seoMetadata)),e.image&&r.append("image",e.image),e.galleryImages&&e.galleryImages.length>0&&e.galleryImages.forEach(i=>{r.append("galleryImages",i)}),!r.get("title")||!r.get("description")||!r.get("link")||!r.get("productId")||!r.get("image"))throw new Error("All required fields must be provided");return(await n.post(o,r,{headers:{"Content-Type":"multipart/form-data"}})).data}}catch(r){throw console.error("Error creating featured product:",r),new Error(((d=(t=r.response)==null?void 0:t.data)==null?void 0:d.message)||r.message||"Failed to create featured product")}},l=async(e,t)=>{var d,r;try{return(await n.put(`${o}/${e}`,t,{headers:{"Content-Type":"multipart/form-data"}})).data}catch(s){throw console.error("Error updating featured product:",s),new Error(((r=(d=s.response)==null?void 0:d.data)==null?void 0:r.message)||"Failed to update featured product")}},h=async e=>{var t,d;try{return(await n.delete(`${o}/${e}`)).data}catch(r){throw console.error("Error deleting featured product:",r),new Error(((d=(t=r.response)==null?void 0:t.data)==null?void 0:d.message)||"Failed to delete featured product")}},w=async(e,t)=>{var d,r;try{return(await n.put(`${o}/${e}/order`,{order:t})).data}catch(s){throw console.error("Error updating featured product order:",s),new Error(((r=(d=s.response)==null?void 0:d.data)==null?void 0:r.message)||"Failed to update featured product order")}};export{u as a,l as b,g as c,h as d,c as e,p as g,w as u};
