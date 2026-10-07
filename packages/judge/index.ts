import type {Evidence,Opportunity} from "../core";
export type JudgeResult={verdict:"pass"|"watch"|"reject";confidence:number;reasons:string[]};

const TECH=/\b(bug|crash|stack trace|internal|refactor|maintainer|unit test|tests failing|ci failure)\b/i;
const PAIN=/\b(need|missing|manual|slow|expensive|difficult|workaround|cannot|replace|request|broken)\b/i;
const BUYER=/\b(pricing|price|paid|buy|customer|business|agency|enterprise|subscription|hosted|service|alternative|commercial)\b/i;

function textOf(e:Evidence){return String(e.payload.title??"")+" "+String(e.payload.body??"");}

export function adversarialJudge(opportunity:Opportunity,evidence:Evidence[]):JudgeResult{
 const related=evidence.filter(e=>opportunity.evidenceIds.includes(e.id));
 if(!related.length)return {verdict:"reject",confidence:1,reasons:["no_evidence"]};

 const signals=related.map(e=>{const t=textOf(e);return {pain:PAIN.test(t),buyer:BUYER.test(t),technical:TECH.test(t)};});
 const painCount=signals.filter(x=>x.pain).length;
 const buyerCount=signals.filter(x=>x.buyer).length;
 const commercialCount=signals.filter(x=>x.pain&&x.buyer).length;
 const technicalCount=signals.filter(x=>x.technical).length;
 const reasons:string[]=[];

 if(painCount===0) reasons.push("no_clear_pain");
 if(buyerCount===0) reasons.push("no_buyer_signal");
 if(technicalCount>0) reasons.push("some_technical_or_internal_noise");
 if(commercialCount===0)return {verdict:"reject",confidence:.9,reasons};

 const cleanRatio=(related.length-technicalCount)/related.length;
 const commercialRatio=commercialCount/related.length;
 const confidence=Math.min(.95,Math.max(.5,.55+commercialRatio*.35+cleanRatio*.1));

 if(commercialCount>=2 || (commercialCount>=1 && cleanRatio>=.75))
   return {verdict:"pass",confidence:Math.round(confidence*100)/100,reasons};

 return {verdict:"watch",confidence:Math.round(confidence*100)/100,reasons};
}

export function isActionable(result:JudgeResult){return result.verdict!=="reject";}
