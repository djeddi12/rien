const $=s=>document.querySelector(s);
const tokenInput=$("#token"), message=$("#summary-message"), formMessage=$("#form-message");
const saved=sessionStorage.getItem("signalshelf-admin-token");
if(saved)tokenInput.value=saved;
function headers(){return {"Authorization":"Bearer "+tokenInput.value.trim(),"Content-Type":"application/json"};}
function show(el,text,error=false){el.textContent=text;el.hidden=false;el.classList.toggle("error",error);}
async function refresh(){
 if(!tokenInput.value.trim()){message.textContent="Enter your admin token first.";return;}
 try{
  const res=await fetch("/api/admin/summary",{headers:headers()});
  const data=await res.json();
  if(!res.ok)throw new Error(data.error||"Could not load summary");
  $("#stat-products").textContent=data.active_products;
  $("#stat-clicks").textContent=data.tracked_outbound_clicks;
  message.textContent="Ledger connected. Recent events: "+data.recent_events.length+".";
  sessionStorage.setItem("signalshelf-admin-token",tokenInput.value.trim());
 }catch(e){message.textContent=e.message;$("#stat-products").textContent="—";$("#stat-clicks").textContent="—";}
}
$("#connect").addEventListener("click",refresh);
$("#refresh").addEventListener("click",refresh);
$("#disconnect").addEventListener("click",()=>{sessionStorage.removeItem("signalshelf-admin-token");tokenInput.value="";$("#stat-products").textContent="—";$("#stat-clicks").textContent="—";message.textContent="Token forgotten for this browser session.";});
$("#offer-form").addEventListener("submit",async e=>{
 e.preventDefault();formMessage.hidden=true;
 const f=new FormData(e.currentTarget),tags=String(f.get("tags")||"").split(",").map(x=>x.trim()).filter(Boolean).slice(0,10);
 const body={name:f.get("name"),vendor:f.get("vendor"),category:f.get("category"),description:f.get("description"),affiliate_url:f.get("affiliate_url"),vendor_url:f.get("vendor_url"),source_url:f.get("source_url"),price_label:f.get("price_label")||"See vendor",tags,verified_at:f.get("verified_at")||"",featured:f.get("featured")==="true"};
 try{
  const res=await fetch("/api/admin/products",{method:"POST",headers:headers(),body:JSON.stringify(body)});
  const data=await res.json();
  if(!res.ok)throw new Error(data.error||"Could not add offer");
  show(formMessage,"Offer added: "+data.id+". Refresh the storefront to confirm it appears.");
  e.currentTarget.reset();e.currentTarget.elements.price_label.value="See vendor";
  await refresh();
 }catch(err){show(formMessage,err.message,true);}
});
if(saved)refresh();