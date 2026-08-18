const products=[
{id:1,name:"Premium Black Football Jersey",category:"Jerseys",brand:"GoalZone",price:35,rating:4.9,sizes:["S","M","L","XL"],emoji:"👕",desc:"Lightweight match jersey with breathable fabric.",new:true},
{id:2,name:"Pro Football Boots",category:"Boots",brand:"ProKick",price:75,rating:4.8,sizes:["S","M","L"],emoji:"👟",desc:"Speed boots with high-grip sole for fast players.",new:true},
{id:3,name:"Classic Training Shorts",category:"Shorts",brand:"GoalZone",price:25,rating:4.5,sizes:["S","M","L","XL"],emoji:"🩳",desc:"Comfortable training shorts built for daily sessions."},
{id:4,name:"Performance Football Socks",category:"Socks",brand:"Elite",price:12,rating:4.6,sizes:["S","M","L"],emoji:"🧦",desc:"Sweat-wicking socks with supportive ankle fit."},
{id:5,name:"Professional Match Ball",category:"Balls",brand:"MatchPro",price:30,rating:4.9,sizes:["M","L"],emoji:"⚽",desc:"Match-ready football with reliable touch and flight."},
{id:6,name:"Football Training Bag",category:"Accessories",brand:"GoalZone",price:40,rating:4.7,sizes:["M","L"],emoji:"🎒",desc:"Spacious training bag with shoe compartment."},
{id:7,name:"Blue Performance Jersey",category:"Jerseys",brand:"Elite",price:38,rating:4.7,sizes:["S","M","L","XL"],emoji:"👕",desc:"Electric-blue performance jersey for match day."},
{id:8,name:"Elite Football Boots",category:"Boots",brand:"Elite",price:95,rating:5.0,sizes:["M","L","XL"],emoji:"👟",desc:"Elite-level boots designed for control and acceleration."}
];

let cart=JSON.parse(localStorage.getItem("goalzoneCart")||"[]");
let favorites=JSON.parse(localStorage.getItem("goalzoneFavorites")||"[]");
let selectedProduct=null;

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

function save(){localStorage.setItem("goalzoneCart",JSON.stringify(cart));localStorage.setItem("goalzoneFavorites",JSON.stringify(favorites));}
function money(n){return "$"+n.toFixed(2)}
function stars(r){return "★".repeat(Math.floor(r))+(r%1>=.5?"½":"")+" <small>"+r+"</small>"}

function renderProducts(){
 let list=[...products];
 const cat=$("#categoryFilter").value,brand=$("#brandFilter").value,size=$("#sizeFilter").value;
 const rating=+$("#ratingFilter").value,price=$("#priceFilter").value,search=($("#searchInput").value||"").toLowerCase();
 list=list.filter(p=>(cat==="All"||p.category===cat)&&(brand==="All"||p.brand===brand)&&(size==="All"||p.sizes.includes(size))&&p.rating>=rating&&(price==="all"||p.price<=+price)&&(!search||`${p.name} ${p.category} ${p.brand}`.toLowerCase().includes(search)));
 const sort=$("#sortSelect").value;
 if(sort==="low")list.sort((a,b)=>a.price-b.price);
 if(sort==="high")list.sort((a,b)=>b.price-a.price);
 if(sort==="newest")list.sort((a,b)=>(b.new?1:0)-(a.new?1:0));
 $("#productGrid").innerHTML=list.map(p=>`
 <article class="product-card">
   <div class="product-image" data-product="${p.id}"><span>${p.emoji}</span><button class="favorite ${favorites.includes(p.id)?"active":""}" data-fav="${p.id}">♥</button></div>
   <div class="product-info">
    <h3>${p.name}</h3><p class="description">${p.desc}</p>
    <div class="price-row"><span class="price">${money(p.price)}</span><span class="stars">${stars(p.rating)}</span></div>
    <div class="sizes">${p.sizes.map(s=>`<span class="size">${s}</span>`).join("")}</div>
    <div class="card-actions"><button class="add-btn" data-add="${p.id}">Add to Cart</button><button class="buy-btn" data-buy="${p.id}">Buy Now</button></div>
   </div>
 </article>`).join("");
 $("#emptyState").hidden=list.length!==0;
}
function updateCartCount(){$("#cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0)}
function addToCart(id,qty=1){
 const item=cart.find(x=>x.id===id); if(item)item.qty+=qty; else cart.push({id,qty});
 save();updateCartCount();toast("Added to cart ✓");
}
function renderCart(){
 const box=$("#cartItems");
 if(!cart.length){box.innerHTML='<p class="empty-state">Your cart is empty.</p>';$("#cartTotal").textContent="$0.00";return}
 box.innerHTML=cart.map(item=>{const p=products.find(x=>x.id===item.id);return `<div class="cart-row"><div><strong>${p.name}</strong><small>${money(p.price)} each</small></div><div class="qty-controls"><button data-dec="${p.id}">−</button><span>${item.qty}</span><button data-inc="${p.id}">+</button></div><strong>${money(p.price*item.qty)}</strong><button class="remove" data-remove="${p.id}">Remove</button></div>`}).join("");
 $("#cartTotal").textContent=money(cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0));
}
function openModal(id){$("#"+id).classList.add("show")}
function closeModal(id){$("#"+id).classList.remove("show")}
function openProduct(id){
 const p=products.find(x=>x.id===id);selectedProduct=p;
 $("#productDetail").innerHTML=`<button class="modal-close" data-close="productModal">×</button>
 <div class="detail-image">${p.emoji}</div><div class="detail-info">
 <p class="eyebrow">${p.category.toUpperCase()}</p><h2>${p.name}</h2><div class="stars">${stars(p.rating)}</div><div class="price">${money(p.price)}</div>
 <p>${p.desc} Made with player-focused materials for comfortable training and match-day performance.</p>
 <label>Size<select id="detailSize">${p.sizes.map(s=>`<option>${s}</option>`).join("")}</select></label>
 <div class="quantity"><button id="detailMinus">−</button><span id="detailQty">1</span><button id="detailPlus">+</button></div>
 <div class="card-actions"><button class="add-btn" id="detailAdd">Add to Cart</button><button class="buy-btn" id="detailBuy">Buy Now</button></div>
 <div class="specs"><strong>Product Specifications</strong><ul><li>Brand: ${p.brand}</li><li>Category: ${p.category}</li><li>Performance-focused design</li><li>Available sizes: ${p.sizes.join(", ")}</li></ul></div>
 <h3>Customer Reviews</h3><p>★★★★★ &nbsp; "Excellent quality and comfortable fit." — GoalZone Player</p>
 </div>`;
 openModal("productModal");
 let q=1;$("#detailMinus").onclick=()=>{q=Math.max(1,q-1);$("#detailQty").textContent=q};$("#detailPlus").onclick=()=>{$("#detailQty").textContent=++q};
 $("#detailAdd").onclick=()=>{addToCart(p.id,q);closeModal("productModal")};
 $("#detailBuy").onclick=()=>{addToCart(p.id,q);closeModal("productModal");openCheckout()};
}
function openCheckout(){
 if(!cart.length){toast("Your cart is empty");return}
 renderCheckout();closeModal("cartModal");openModal("checkoutModal");
}
function renderCheckout(){
 const rows=cart.map(x=>{const p=products.find(y=>y.id===x.id);return `<div class="summary-line"><span>${p.name} × ${x.qty}</span><span>${money(p.price*x.qty)}</span></div>`}).join("");
 $("#checkoutSummary").innerHTML=rows;$("#checkoutTotal").textContent="Total: "+money(cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0));
}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2500)}

document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]"),buy=e.target.closest("[data-buy]"),prod=e.target.closest("[data-product]"),fav=e.target.closest("[data-fav]");
 if(add)addToCart(+add.dataset.add);
 if(buy){addToCart(+buy.dataset.buy);openCheckout()}
 if(prod&&!fav)openProduct(+prod.dataset.product);
 if(fav){const id=+fav.dataset.fav;favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];save();renderProducts();toast(favorites.includes(id)?"Added to favorites ♥":"Removed from favorites")}
 const inc=e.target.closest("[data-inc]"),dec=e.target.closest("[data-dec]"),remove=e.target.closest("[data-remove]");
 if(inc){cart.find(x=>x.id===+inc.dataset.inc).qty++;save();renderCart();updateCartCount()}
 if(dec){const x=cart.find(x=>x.id===+dec.dataset.dec);x.qty--;if(x.qty<=0)cart=cart.filter(y=>y.id!==x.id);save();renderCart();updateCartCount()}
 if(remove){cart=cart.filter(x=>x.id!==+remove.dataset.remove);save();renderCart();updateCartCount()}
 const close=e.target.closest("[data-close]");if(close)closeModal(close.dataset.close);
 if(e.target.classList.contains("modal"))e.target.classList.remove("show");
});

["categoryFilter","brandFilter","sizeFilter","ratingFilter","priceFilter","sortSelect"].forEach(id=>$("#"+id).addEventListener("change",renderProducts));
$("#resetFilters").onclick=()=>{["categoryFilter","brandFilter","sizeFilter"].forEach(id=>$("#"+id).value="All");$("#ratingFilter").value="0";$("#priceFilter").value="all";$("#sortSelect").value="popular";$("#searchInput").value="";renderProducts()};
$$(".category-card").forEach(b=>b.onclick=()=>{$("#categoryFilter").value=b.dataset.category;renderProducts();$("#products").scrollIntoView({behavior:"smooth"})});
$("#cartBtn").onclick=()=>{renderCart();openModal("cartModal")};
$("#checkoutBtn").onclick=openCheckout;
$("#searchBtn").onclick=()=>{$("#searchPanel").classList.toggle("show");$("#searchInput").focus()};
$("#closeSearch").onclick=()=>$("#searchPanel").classList.remove("show");
$("#searchInput").addEventListener("input",renderProducts);
$("#menuToggle").onclick=()=>$("#mainNav").classList.toggle("open");
$("#saleBtn").onclick=()=>{$("#priceFilter").value="50";renderProducts();$("#products").scrollIntoView({behavior:"smooth"})};
$("#loginBtn").onclick=()=>toast("Login demo — connect your backend to enable accounts.");
$("#newsletterForm").onsubmit=e=>{e.preventDefault();toast("Subscribed successfully! ⚽");e.target.reset()};
$("#checkoutForm").onsubmit=e=>{e.preventDefault();cart=[];save();updateCartCount();closeModal("checkoutModal");toast("Order Successful! Thank you for shopping with GoalZone.");e.target.reset()};

renderProducts();updateCartCount();
