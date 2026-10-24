const state={products:[],category:"All",query:"",sort:"featured"};
const $=s=>document.querySelector(s);
const grid=$("#product-grid"),status=$("#catalog-status"),empty=$("#empty-state");
const palette=["green","purple","peach","blue","gold"];
const glyphs=["✳","↗","⌘","◈","◎","✦"];
function esc(value=""){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function safeUrl(value){try{const u=new URL(value);return ["https:","http:"].includes(u.protocol)?u.href:"";}catch{return "";}}
function render(){
 let items=state.products.filter(p=>{
  const hay=[p.name,p.vendor,p.category,p.description,...(p.tags||[])].join(" ").toLowerCase();
  return (state.category==="All"||p.category===state.category)&&hay.includes(state.query.toLowerCase());
 });
 if(state.sort==="name")items.sort((a,b)=>a.name.localeCompare(b.name));
 else if(state.sort==="newest")items.sort((a,b)=>(b.added_at||"").localeCompare(a.added_at||""));
 else items.sort((a,b)=>(b.featured?1:0)-(a.featured?1:0));
 $("#product-count").textContent=state.products.length+" "+(state.products.length===1?"offer":"offers");
 grid.innerHTML=items.map((p,i)=>{
  const url=safeUrl(p.affiliate_url||"");
  const demo=Boolean(p.demo)||!url;
  return `<article class="product-card">
   <div class="product-visual ${palette[i%palette.length]}"><span class="product-category">${esc(p.category||"Other")}</span>${demo?'<span class="product-badge">DEMO / UNVERIFIED</span>':""}<span class="product-glyph">${esc(p.glyph||glyphs[i%glyphs.length])}</span></div>
   <div class="product-body"><div class="product-top"><h3>${esc(p.name)}</h3><span class="product-price">${esc(p.price_label||"See vendor")}</span></div><p>${esc(p.description||"Product details will be added after source verification.")}</p><div class="product-tags">${(p.tags||[]).slice(0,3).map(t=>`<span>${esc(t)}</span>`).join("")}</div></div>
   <div class="product-footer"><span>${esc(p.vendor||"Vendor to be verified")}</span>${url&&!demo?`<a href="/api/click/${encodeURIComponent(p.id)}" target="_blank" rel="sponsored nofollow noopener">Visit vendor ↗</a>`:'<span class="unavailable">Link not activated</span>'}</div>
  </article>`;
 }).join("");
 const none=items.length===0;
 empty.classList.toggle("hidden",!none);
 grid.classList.toggle("hidden",none);
 if(state.products.length===0){status.textContent="The live catalog is empty. Add verified offers through the local admin API; example offers are never passed off as real products.";}
 else {status.textContent=`Showing ${items.length} of ${state.products.length} listed offers. ${state.products.some(p=>p.demo)?"Demo records are visibly marked and cannot send buyers to an unverified destination.":""}`;}
}
async function loadCatalog(){
 try{
  const res=await fetch("/api/products",{headers:{Accept:"application/json"}});
  if(!res.ok)throw new Error("API unavailable");
  const data=await res.json();
  state.products=Array.isArray(data.products)?data.products:[];
  status.dataset.source="api";
 }catch{
  try{
   const res=await fetch("/products.json");
   const data=await res.json();
   state.products=Array.isArray(data.products)?data.products:[];
   status.dataset.source="static";
  }catch{state.products=[];}
 }
 render();
}
$("#search").addEventListener("input",e=>{state.query=e.target.value;render();});
$("#sort").addEventListener("change",e=>{state.sort=e.target.value;render();});
$("#filters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;state.category=b.dataset.category;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));render();});
$("#reset-filters").addEventListener("click",()=>{state.category="All";state.query="";$("#search").value="";document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.category==="All"));render();});
const menu=$(".menu-toggle");
menu.addEventListener("click",()=>{const open=$(".site-header").classList.toggle("nav-open");menu.setAttribute("aria-expanded",String(open));});
document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#search").focus();}});
$("#year").textContent=new Date().getFullYear();
loadCatalog();