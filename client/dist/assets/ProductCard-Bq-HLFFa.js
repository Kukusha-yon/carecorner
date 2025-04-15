import{r as l,b as i,j as e,L as r,S as c,e as d}from"./index-DFyuifyJ.js";import{B as m}from"./Button-DN5n5fSN.js";const x=l.memo(({product:s})=>{const[h,t]=l.useState(!1),{addToCart:o}=i();if(!s||!s._id)return console.error("Invalid product data:",s),null;const n=a=>{if(a.preventDefault(),a.stopPropagation(),s.countInStock===0){d.error("This product is out of stock");return}o(s)};return e.jsxs("div",{className:"group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 h-full flex flex-col",onMouseEnter:()=>t(!0),onMouseLeave:()=>t(!1),children:[e.jsx(r,{to:`/products/${s._id}`,className:"block",children:e.jsxs("div",{className:"relative w-full h-48 bg-gray-50",children:[e.jsx("div",{className:"absolute inset-0 flex items-center justify-center p-4",children:s.image?e.jsx("img",{src:s.image,alt:s.name||"Product image",className:"w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-110",loading:"lazy",decoding:"async",onError:a=>{console.error("Error loading image:",s.image),a.target.src="https://via.placeholder.com/300x300?text=Image+Not+Found"}}):e.jsx("div",{className:"w-full h-full flex items-center justify-center bg-gray-100",children:e.jsx("span",{className:"text-gray-400",children:"No image available"})})}),s.isBestSeller&&e.jsx("div",{className:"absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded",children:"Best Seller"})]})}),e.jsxs("div",{className:"p-4 flex-grow flex flex-col justify-between",children:[e.jsx("div",{children:e.jsx(r,{to:`/products/${s._id}`,className:"block",children:e.jsx("h3",{className:"text-lg font-semibold text-gray-900 mb-2 line-clamp-2 h-12 hover:text-[#39b54a] transition-colors",children:s.name})})}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsxs("span",{className:"text-xl font-bold text-[#39b54a]",children:["ETB ",s.price.toFixed(2)]}),s.countInStock>0?e.jsx("span",{className:"text-sm text-green-600",children:"In Stock"}):e.jsx("span",{className:"text-sm text-red-600",children:"Out of Stock"})]}),e.jsxs(m,{onClick:n,disabled:s.countInStock===0,className:"w-full",variant:s.countInStock===0?"disabled":"primary",children:[e.jsx(c,{className:"w-4 h-4 mr-2"}),s.countInStock===0?"Out of Stock":"Add to Cart"]})]})]})]})});x.displayName="ProductCard";export{x as P};
