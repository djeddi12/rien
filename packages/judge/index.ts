import type {Evidence,Opportunity} from "../core";
export type JudgeResult={verdict:"pass"|"watch"|"reject";confidence:number;reasons:string[]};
const TECH=/\b(bug|crash|stack trace|internal|refactor|maintainer|unit test|tests failing|ci failure)\b/i;
const PAIN=/\b(need|missing|manual|slow|expensive|difficult|workaround|cannot|replace|request)\b/i;
const BUYER=/\b(pricing|price|paid|buy|customer|business|agency|enterprise|subscription|hosted|service|alternative)\b/i;
export function adversarialJudge(opportunity:Opportunity,evidence:Evidence[]):JudgeResult{
 const related=evidence.filter(e=>opportunity.evidenceIds.includes(e.id));
 if(!related.length)return {verdict:"reject",confidence:1,reasons:["no_evidence"]};
 const text=related.map(e=>String(e.payload.title??"")+" "+String(e.payload.body??"")).join(" ");
 const painCount=related.filter(e=>PAIN.test(String(e.payload.title??"")+" "+String(e.payload.body??""))).length;
 const buyer=BUYER.test(text),technical=TECH.test(text),reasons:string[]=[];
 if(technical)reasons.push("technical_or_internal_issue");
 if(painCount===0)reasons.push("no_clear_pain");
 if(!buyer)reasons.push("no_buyer_signal");
 if(technical||painCount===0)return {verdict:"reject",confidence:.9,reasons};
 return {verdict:buyer&&painCount>=2?"pass":"watch",confidence:buyer&&painCount>=2?.8:.6,reasons};
}
