import{u as o,j as e}from"./index-DFyuifyJ.js";import{c,P as a}from"./productService-DI1icBLi.js";import{P as d}from"./ProductCard-Bq-HLFFa.js";import{C as n}from"./CategoryHero-ZbkGiX76.js";import"./Button-DN5n5fSN.js";const u=()=>{const{data:s,isLoading:t,error:i}=o({queryKey:["products",a.BAGS],queryFn:()=>c(a.BAGS)});return t?e.jsx("div",{className:"min-h-screen flex items-center justify-center",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-[#39b54a]"})}):i?e.jsx("div",{className:"min-h-screen flex items-center justify-center",children:e.jsx("div",{className:"text-red-500",children:"Error loading products. Please try again later."})}):e.jsxs("div",{className:"min-h-screen bg-white",children:[e.jsx(n,{title:"Professional Bags",description:"Durable and stylish bags designed to protect and transport your tech gear with ease.",image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80",ctaText:"Shop Bags",ctaLink:"/products?category=Bags"}),e.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",children:e.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6",children:s==null?void 0:s.map(r=>e.jsx(d,{product:r},r._id))})})]})};export{u as default};
