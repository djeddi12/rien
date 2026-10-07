import type {Evidence,OpportunityFingerprint} from "../core";

const PAIN=/\b(need|missing|manual|slow|expensive|difficult|workaround|cannot|can't|broken|replace|replacement|pain|friction)\b/i;
const BUYER=/\b(pricing|price|paid|buy|purchase|customer|business|agency|enterprise|subscription|hosted|service|alternative|commercial)\b/i;
const CONTRADICTION=/\b(already solved|no longer need|not needed|works fine|fixed|duplicate|wontfix|won't fix|not interested)\b/i;
const TECH=/\b(bug|crash|stack trace|internal|refactor|maintainer|unit test|tests failing|ci failure)\b/i;
const REPEAT=/\b(every|daily|weekly|monthly|always|often|repeated|recurring|again|workflow|process|manual)\b/i;

function textOf(e:Evidence){return `${String(e.payload.title??"")} ${String(e.payload.body??"")}`;}
function sourceKey(e:Evidence):string{
 const url=String(e.sourceUrl??"");
 const repo=url.match(/github\.com\/([^/]+\/[^/#]+)/i)?.[1]?.toLowerCase();
 return repo??e.source.toLowerCase();
}
function freshness(e:Evidence,now=Date.now()):number{
 const t=Date.parse(e.capturedAt);
 if(!Number.isFinite(t)) return .5;
 const days=Math.max(0,(now-t)/86400000);
 return Math.exp(-days/90);
}
function ratio(count:number,total:number){return total?count/total:0;}
function firstMatch(items:Evidence[],re:RegExp,fallback:string){
 const hit=items.find(e=>re.test(textOf(e)));
 return hit?String(hit.payload.title??fallback):fallback;
}

export function buildOpportunityFingerprint(evidence:Evidence[]):OpportunityFingerprint{
 const total=evidence.length;
 const texts=evidence.map(textOf);
 const pain= texts.filter(t=>PAIN.test(t)).length;
 const buyer=texts.filter(t=>BUYER.test(t)).length;
 const commercial=texts.filter(t=>PAIN.test(t)&&BUYER.test(t)).length;
 const contradiction=texts.filter(t=>CONTRADICTION.test(t)).length;
 const technical=texts.filter(t=>TECH.test(t)).length;
 const repeat=texts.filter(t=>REPEAT.test(t)).length;
 const diversity=new Set(evidence.map(sourceKey)).size;
 const freshnessScore=total?evidence.reduce((s,e)=>s+freshness(e),0)/total:0;
 const painStrength=Math.round(ratio(pain,total)*100)/100;
 const buyerSignal=Math.round(ratio(buyer,total)*100)/100;
 const commercialSignal=Math.round(ratio(commercial,total)*100)/100;
 const repeatability=Math.round(ratio(repeat,total)*100)/100;
 const evidenceDiversity=Math.round(Math.min(1,diversity/3)*100)/100;
 const contradictionRisk=Math.round(ratio(contradiction,total)*100)/100;
 const technicalNoiseRatio=Math.round(ratio(technical,total)*100)/100;
 const quality=Math.round(Math.max(0,Math.min(1,
   .30*painStrength+.20*buyerSignal+.20*commercialSignal+.10*repeatability+
   .10*evidenceDiversity+.10*freshnessScore-.15*contradictionRisk-.10*technicalNoiseRatio
 ))*100)/100;
 return {
  problem:firstMatch(evidence,PAIN,"Unresolved workflow or product problem"),
  buyer:firstMatch(evidence,BUYER,"Commercial buyer"),
  jobToBeDone:firstMatch(evidence,REPEAT,"Complete the required workflow more effectively"),
  currentWorkaround:firstMatch(evidence,/\b(workaround|manual|replace|alternative)\b/i,"Existing workaround or alternative"),
  painStrength,buyerSignal,commercialSignal,repeatability,evidenceFreshness:Math.round(freshnessScore*100)/100,
  evidenceDiversity,contradictionRisk,technicalNoiseRatio,quality
 };
}
