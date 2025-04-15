import{f as p,c as $,h as z,k as H,b as U,r as l,u as W,V as c,j as e,o as Y,X as C}from"./index-DFyuifyJ.js";import{B as r}from"./Button-DN5n5fSN.js";import{d as S,g as G}from"./orderService-Hj6BzJ-j.js";import{F as K}from"./funnel-C5qJn7jx.js";import{C as Q}from"./chevron-down-Bmnaw9AJ.js";import{T as O}from"./trash-2-Bwrh7WsY.js";import{T as X}from"./truck-BF08lgha.js";import{C as Z}from"./circle-check-big-CjXnL9UI.js";/**
 * @license lucide-react v0.486.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]],se=p("circle-help",ee);/**
 * @license lucide-react v0.486.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]],te=p("clock",ae);/**
 * @license lucide-react v0.486.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const re=[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]],N=p("package",re);/**
 * @license lucide-react v0.486.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],ce=p("refresh-cw",le),ge=()=>{const g=$(),n=z(),{user:t}=H(),{addToCart:_}=U(),[A,d]=l.useState(!1),[v,m]=l.useState(null),[ne,T]=l.useState(!1),[x,I]=l.useState(""),[f,L]=l.useState("all"),[M,b]=l.useState([]);l.useEffect(()=>{try{const s=localStorage.getItem("mock_orders");s&&b(JSON.parse(s))}catch(s){console.error("Error loading mock orders:",s)}},[]);const{data:D=[],isLoading:E,error:w,refetch:y}=W({queryKey:["userOrders"],queryFn:G,staleTime:0,refetchOnMount:!0}),j=[...D,...M];l.useEffect(()=>{var s,a,o;if((((s=n.state)==null?void 0:s.from)==="order-confirmation"||((a=n.state)==null?void 0:a.from)==="checkout")&&(c.success("Your order has been placed successfully!"),T(!0),(o=n.state)!=null&&o.orderId&&n.state.orderId.startsWith("mock_"))){const h={_id:n.state.orderId,createdAt:new Date().toISOString(),status:"pending",items:JSON.parse(localStorage.getItem("cart_"+(t==null?void 0:t._id))||"[]"),shippingDetails:{fullName:(t==null?void 0:t.name)||"Guest User",email:(t==null?void 0:t.email)||"guest@example.com"},totalAmount:localStorage.getItem("last_cart_total")||0},u=JSON.parse(localStorage.getItem("mock_orders")||"[]"),i=[h,...u];localStorage.setItem("mock_orders",JSON.stringify(i)),b(i)}},[n,t]);const F=async s=>{try{await S(s),c.success("Order cleared successfully"),m(null),y()}catch(a){console.error("Error clearing order:",a),c.error("Failed to clear order")}},q=async()=>{try{await Promise.all(j.map(s=>S(s._id))),c.success("All orders cleared successfully"),d(!1),y()}catch(s){console.error("Error clearing all orders:",s),c.error("Failed to clear all orders")}},B=s=>{switch(s.toLowerCase()){case"delivered":return e.jsx(Z,{className:"w-5 h-5 text-green-500"});case"shipped":return e.jsx(X,{className:"w-5 h-5 text-blue-500"});case"pending":return e.jsx(te,{className:"w-5 h-5 text-yellow-500"});default:return e.jsx(N,{className:"w-5 h-5 text-gray-500"})}},J=s=>{switch(s.toLowerCase()){case"delivered":return"text-green-700 bg-green-50";case"shipped":return"text-blue-700 bg-blue-50";case"pending":return"text-yellow-700 bg-yellow-50";default:return"text-gray-700 bg-gray-50"}},P=s=>{try{s.items.forEach(a=>{_({_id:a._id,name:a.name,price:a.price,image:a.image,countInStock:a.countInStock},a.quantity)}),c.success("Items added to cart"),g("/cart")}catch(a){console.error("Error adding items to cart:",a),c.error("Failed to add items to cart")}},R=s=>{g("/support",{state:{orderId:s._id}})},V=j.filter(s=>{var h,u,i,k;const a=s._id.toLowerCase().includes(x.toLowerCase())||((u=(h=s.shippingDetails)==null?void 0:h.fullName)==null?void 0:u.toLowerCase().includes(x.toLowerCase()))||((k=(i=s.shippingDetails)==null?void 0:i.email)==null?void 0:k.toLowerCase().includes(x.toLowerCase())),o=f==="all"||s.status===f;return a&&o});return E?e.jsx("div",{className:"min-h-screen bg-gray-50 pt-24",children:e.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",children:e.jsx("div",{className:"flex items-center justify-center",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-[#39b54a]"})})})}):w?e.jsx("div",{className:"min-h-screen bg-gray-50 pt-24",children:e.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",children:e.jsxs("div",{className:"text-center",children:[e.jsx(se,{className:"w-12 h-12 mx-auto text-gray-400 mb-4"}),e.jsx("h2",{className:"text-xl font-medium text-gray-900 mb-2",children:"Unable to load orders"}),e.jsx("p",{className:"text-gray-500 mb-4",children:w.message}),e.jsxs(r,{variant:"primary",onClick:y,className:"bg-[#39b54a] hover:bg-[#2d8f3a] text-white",children:[e.jsx(ce,{className:"w-4 h-4 mr-2"}),"Try Again"]})]})})}):j.length===0?e.jsx("div",{className:"min-h-screen bg-gray-50 pt-24",children:e.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",children:e.jsxs("div",{className:"text-center",children:[e.jsx(N,{className:"w-12 h-12 mx-auto text-gray-400 mb-4"}),e.jsx("h2",{className:"text-xl font-medium text-gray-900 mb-2",children:"No orders yet"}),e.jsx("p",{className:"text-gray-500 mb-4",children:"When you place an order, it will appear here."}),e.jsx(r,{variant:"primary",onClick:()=>g("/products"),className:"bg-[#39b54a] hover:bg-[#2d8f3a] text-white",children:"Start Shopping"})]})})}):e.jsxs("div",{className:"min-h-screen bg-gray-50 pt-24",children:[e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",children:[e.jsxs("div",{className:"flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4",children:[e.jsx("h1",{className:"text-2xl font-bold text-gray-900",children:"Your Orders"}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-4 w-full md:w-auto",children:[e.jsxs("div",{className:"relative flex-1 sm:flex-none",children:[e.jsx(Y,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"}),e.jsx("input",{type:"text",placeholder:"Search orders...",value:x,onChange:s=>I(s.target.value),className:"pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39b54a] focus:border-transparent"})]}),e.jsxs("div",{className:"relative flex-1 sm:flex-none",children:[e.jsx(K,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"}),e.jsxs("select",{value:f,onChange:s=>L(s.target.value),className:"pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39b54a] focus:border-transparent appearance-none bg-white",children:[e.jsx("option",{value:"all",children:"All Status"}),e.jsx("option",{value:"pending",children:"Pending"}),e.jsx("option",{value:"processing",children:"Processing"}),e.jsx("option",{value:"shipped",children:"Shipped"}),e.jsx("option",{value:"delivered",children:"Delivered"}),e.jsx("option",{value:"cancelled",children:"Cancelled"})]}),e.jsx(Q,{className:"absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none"})]}),e.jsxs(r,{variant:"outline",onClick:()=>d(!0),className:"text-red-600 hover:text-red-700 border-red-600 hover:border-red-700",children:[e.jsx(O,{className:"w-4 h-4 mr-2"}),"Clear All"]})]})]}),e.jsx("div",{className:"space-y-6",children:V.map(s=>e.jsxs("div",{className:"bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300",children:[e.jsx("div",{className:"border-b border-gray-200 p-4",children:e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2",children:[e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsxs("div",{className:`px-2 py-0.5 rounded-full text-sm font-medium ${J(s.status)}`,children:[B(s.status),e.jsx("span",{className:"ml-1",children:s.status})]}),e.jsx("div",{className:"text-sm text-gray-500",children:new Date(s.createdAt).toLocaleDateString()})]}),e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsxs("div",{className:"text-sm",children:[e.jsxs("span",{className:"font-medium text-gray-900",children:["#",s._id.slice(-8)]}),e.jsxs("span",{className:"text-gray-500 ml-2",children:["ETB ",s.totalAmount.toFixed(2)]})]}),e.jsx(r,{variant:"outline",onClick:()=>m(s),className:"text-red-600 hover:text-red-700 border-red-600 hover:border-red-700 p-1",children:e.jsx(O,{className:"w-4 h-4"})})]})]})}),e.jsxs("div",{className:"p-4",children:[e.jsx("div",{className:"space-y-2",children:s.items.map((a,o)=>e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx("div",{className:"flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden",children:a.image?e.jsx("img",{src:a.image,alt:a.name,className:"w-full h-full object-cover"}):e.jsx("div",{className:"w-full h-full flex items-center justify-center",children:e.jsx(N,{className:"w-6 h-6 text-gray-400"})})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("p",{className:"text-sm font-medium text-gray-900 truncate",children:a.name}),e.jsxs("p",{className:"text-sm font-medium text-gray-900 ml-2",children:["ETB ",(a.quantity*a.price).toFixed(2)]})]}),e.jsxs("p",{className:"text-xs text-gray-500",children:[a.quantity," × ETB ",a.price.toFixed(2)]})]})]},o))}),e.jsxs("div",{className:"mt-4 pt-3 border-t border-gray-200 flex flex-wrap gap-2",children:[e.jsx(r,{variant:"outline",onClick:()=>P(s),className:"flex-1 sm:flex-none text-sm py-1",children:"Reorder"}),e.jsx(r,{variant:"outline",onClick:()=>R(s),className:"flex-1 sm:flex-none text-sm py-1",children:"Contact Support"})]})]})]},s._id))})]}),A&&e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50",children:e.jsxs("div",{className:"bg-white rounded-lg max-w-md w-full p-6",children:[e.jsxs("div",{className:"flex justify-between items-start mb-4",children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-900",children:"Clear All Orders"}),e.jsx("button",{onClick:()=>d(!1),className:"text-gray-400 hover:text-gray-500",children:e.jsx(C,{className:"h-6 w-6"})})]}),e.jsx("p",{className:"text-gray-500 mb-6",children:"Are you sure you want to clear all your orders? This action cannot be undone."}),e.jsxs("div",{className:"flex justify-end space-x-4",children:[e.jsx(r,{variant:"outline",onClick:()=>d(!1),className:"text-gray-700 border-gray-300 hover:bg-gray-50",children:"Cancel"}),e.jsx(r,{variant:"primary",onClick:q,className:"bg-red-600 hover:bg-red-700 text-white",children:"Clear All"})]})]})}),v&&e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50",children:e.jsxs("div",{className:"bg-white rounded-lg max-w-md w-full p-6",children:[e.jsxs("div",{className:"flex justify-between items-start mb-4",children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-900",children:"Delete Order"}),e.jsx("button",{onClick:()=>m(null),className:"text-gray-400 hover:text-gray-500",children:e.jsx(C,{className:"h-6 w-6"})})]}),e.jsx("p",{className:"text-gray-500 mb-6",children:"Are you sure you want to delete this order? This action cannot be undone."}),e.jsxs("div",{className:"flex justify-end space-x-4",children:[e.jsx(r,{variant:"outline",onClick:()=>m(null),className:"text-gray-700 border-gray-300 hover:bg-gray-50",children:"Cancel"}),e.jsx(r,{variant:"primary",onClick:()=>F(v._id),className:"bg-red-600 hover:bg-red-700 text-white",children:"Delete"})]})]})})]})};export{ge as default};
