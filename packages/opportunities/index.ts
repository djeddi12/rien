import type {Evidence,Opportunity} from "../core";
export type OpportunityInput={title:string;audience:string;category:string;intent?:Opportunity["intent"];segment?:string;keywords?:string[];evidence:Evidence[];monetizationHypotheses:string[]};
export function mineOpportunity(input:OpportunityInput):Opportunity{
 const confidence=input.evidence.length?input.evidence.reduce((s,e)=>s+Math.max(0,Math.min(1,e.confidence)),0)/input.evidence.length:0;
 const evidenceIds=input.evidence.map(e=>e.id).sort();
 const sourceTitle=input.title;
 return {id:`opp_${evidenceIds.join("-")}`,title:sourceTitle,sourceTitle,audience:input.audience,category:input.category,intent:input.intent??"unclear",segment:input.segment,keywords:input.keywords??[],evidenceIds,monetizationHypotheses:input.monetizationHypotheses,createdAt:new Date().toISOString(),confidence};
}
