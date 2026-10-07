import type {Evidence,Opportunity} from "../core";
import {mineOpportunity} from "../opportunities";
import {adversarialJudge,isActionable} from "../judge";

const BUYING_TERMS=["best","alternative","alternatives","vs","pricing","price","buy","purchase","software","tool","service","for agencies","for business","paid","customer","enterprise"];
const PAIN_TERMS=["need","wish","missing","slow","broken","expensive","difficult","pain","cannot","can't","manual","workaround","replace","request"];
const STOP_WORDS=new Set([
 "the","and","for","with","from","that","this","have","has","had","are","was","were","will","would","could","should",
 "need","needs","best","alternative","alternatives","pricing","price","buy","purchase","software","tool","tools","service",
 "paid","customer","customers","business","businesses","agency","agencies","enterprise","feature","request","issue","problem",
 "want","wanted","please","using","use","used","make","made","like","just","very","more","less","into","than","then","also",
 "not","but","our","your","their","they","them","you","can","cannot","can't","missing","manual","expensive","difficult",
 "slow","broken","workaround","replace","replacement","support","integration"
]);

function contains(text:string,terms:string[]){const t=text.toLowerCase();return terms.some(x=>t.includes(x));}

function words(text:string):string[]{
 return text.toLowerCase().replace(/https?:\/\/\S+/g," ").split(/[^a-z0-9]+/)
   .filter(x=>x.length>=3&&!STOP_WORDS.has(x));
}

function keyTerms(e:Evidence):Set<string>{
 const title=String(e.payload.title??"");
 const body=String(e.payload.body??"");
 const titleWords=words(title);
 const bodyWords=words(body);
 const counts=new Map<string,number>();
 for(const word of titleWords) counts.set(word,(counts.get(word)??0)+3);
 for(const word of bodyWords) counts.set(word,(counts.get(word)??0)+1);
 return new Set([...counts.entries()]
   .sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))
   .slice(0,12)
   .map(([x])=>x));
}

function similarity(a:Set<string>,b:Set<string>):number{
 if(!a.size||!b.size)return 0;
 const intersection=[...a].filter(x=>b.has(x)).length;
 const union=new Set([...a,...b]).size;
 return intersection/union;
}

function clusterEvidence(items:Evidence[]):Evidence[][]{
 const clusters:{items:Evidence[];terms:Set<string>}[]=[];
 for(const item of items){
  const terms=keyTerms(item);
  let best=-1,bestScore=0;
  for(let i=0;i<clusters.length;i++){
   const score=similarity(terms,clusters[i].terms);
   if(score>bestScore){bestScore=score;best=i;}
  }
  if(best>=0&&bestScore>=.30){
   clusters[best].items.push(item);
   clusters[best].terms=new Set([...clusters[best].terms,...terms]);
  }else{
   clusters.push({items:[item],terms});
  }
 }
 return clusters.map(x=>x.items);
}

function clusterTitle(items:Evidence[],category:string):string{
 const counts=new Map<string,number>();
 for(const item of items){
  for(const word of keyTerms(item)) counts.set(word,(counts.get(word)??0)+1);
 }
 const terms=[...counts.entries()]
   .sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))
   .filter(([x])=>!["cheaper","hosted","option","clear","pain","buyers"].includes(x))
   .slice(0,3).map(([x])=>x);
 const label=terms.length?terms.join(" "):category;
 const buyer=items.some(e=>contains(JSON.stringify(e.payload),["alternative","vs","pricing","price","buy","purchase"]));
 const pain=items.some(e=>contains(JSON.stringify(e.payload),PAIN_TERMS));
 if(buyer&&pain)return `${label} alternatives for buyers with a clear pain`;
 if(buyer)return `${label} alternatives and buying options`;
 if(pain)return `${label} workflow pain and solution gap`;
 return `${label} commercial opportunity`;
}

function clusterAudience(items:Evidence[]):string{
 const values=items.map(e=>String(e.payload.audience??"")).filter(Boolean);
 if(!values.length)return "buyers";
 const counts=new Map<string,number>();
 for(const value of values)counts.set(value,(counts.get(value)??0)+1);
 return [...counts.entries()].sort((a,b)=>b[1]-a[1])[0][0];
}

export function enrichCommercialIntent(e:Evidence):Evidence{
 const text=JSON.stringify(e.payload);
 const buyer=contains(text,BUYING_TERMS),pain=contains(text,PAIN_TERMS);
 const intent=(buyer?0.65:0)+(pain?0.35:0);
 return {...e,payload:{...e.payload,commercialIntent:Math.round(intent*100)/100,signals:{buyerIntent:buyer,painSignal:pain}}};
}

export function discoverCommercialOpportunities(evidence:Evidence[]):Opportunity[]{
 const enriched=evidence.map(enrichCommercialIntent).filter(e=>Number(e.payload.commercialIntent??0)>=.35);
 const byCategory=new Map<string,Evidence[]>();
 for(const e of enriched){
  const category=String(e.payload.category??"software");
  const list=byCategory.get(category)??[];
  list.push(e);
  byCategory.set(category,list);
 }
 const opportunities:Opportunity[]=[];
 for(const [category,categoryItems] of byCategory){
  for(const items of clusterEvidence(categoryItems)){
   const opportunity=mineOpportunity({
    title:clusterTitle(items,category),
    audience:clusterAudience(items),
    category,
    evidence:items,
    monetizationHypotheses:["affiliate","lead_gen","digital_product"]
   });
   const judgment=adversarialJudge(opportunity,enriched);
   if(isActionable(judgment)){
    opportunities.push({...opportunity,confidence:Math.round(opportunity.confidence*judgment.confidence*100)/100});
   }
  }
 }
 return opportunities.sort((a,b)=>b.confidence-a.confidence);
}
