import type {Evidence,Opportunity} from "../core";
import {mineOpportunity} from "../opportunities";
import {adversarialJudge,isActionable} from "../judge";

const BUYING_TERMS=["best","alternative","vs","pricing","price","buy","software","tool","service","for agencies","for business"];
const PAIN_TERMS=["need","wish","missing","slow","broken","expensive","difficult","pain","cannot","can't","manual"];

function contains(text:string,terms:string[]){const t=text.toLowerCase();return terms.some(x=>t.includes(x));}

export function enrichCommercialIntent(e:Evidence):Evidence{
 const text=JSON.stringify(e.payload);
 const buyer=contains(text,BUYING_TERMS),pain=contains(text,PAIN_TERMS);
 const intent=(buyer?0.65:0)+(pain?0.35:0);
 return {...e,payload:{...e.payload,commercialIntent:Math.round(intent*100)/100,signals:{buyerIntent:buyer,painSignal:pain}}};
}

export function discoverCommercialOpportunities(evidence:Evidence[]):Opportunity[]{
 const enriched=evidence.map(enrichCommercialIntent).filter(e=>Number(e.payload.commercialIntent??0)>=.35);
 const groups=new Map<string,Evidence[]>();
 for(const e of enriched){
   const category=String(e.payload.category??"software");
   const list=groups.get(category)??[];list.push(e);groups.set(category,list);
 }
 return [...groups].map(([category,items])=>mineOpportunity({
   title:`Commercial opportunity in ${category}`,
   audience:String(items[0].payload.audience??"buyers"),
   category,evidence:items,
   monetizationHypotheses:["affiliate","lead_gen","digital_product"]
 })).filter(o=>isActionable(adversarialJudge(o,enriched))).sort((a,b)=>b.confidence-a.confidence);
}
