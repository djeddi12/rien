import type {Evidence,Opportunity} from "../core";
export type OpportunityInput={title:string;audience:string;category:string;evidence:Evidence[];monetizationHypotheses:string[]};
export function mineOpportunity(input:OpportunityInput):Opportunity{
 const confidence=input.evidence.length?input.evidence.reduce((s,e)=>s+Math.max(0,Math.min(1,e.confidence)),0)/input.evidence.length:0;
 return {id:`opp_${input.title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}`,title:input.title,audience:input.audience,category:input.category,evidenceIds:input.evidence.map(e=>e.id),monetizationHypotheses:input.monetizationHypotheses,createdAt:new Date().toISOString(),confidence};
}
