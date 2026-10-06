import type {Evidence, Offer} from "../core";
import {deduplicateEvidence} from "../evidence/dedup";
import {discoverGitHubIssues} from "./github";
import {discoverCommercialOpportunities} from "./commercial";
import {matchOffer} from "../offers";
import {scoreOpportunity} from "../scoring";

export type LiveDiscoveryConfig={queries:string[];perQuery?:number;token?:string;target?:number};
export type LiveBenchmarkRow={rank:number;title:string;category:string;confidence:number;score:number;decision:"build"|"watch"|"reject";evidenceCount:number;bestOffer?:string;bestOfferScore?:number;sourceUrl?:string};

function classifyCategory(text:string){
 const t=text.toLowerCase();
 if(/seo|search|marketing|campaign|email|crm|lead|conversion|analytics/.test(t)) return "marketing";
 if(/api|sdk|developer|typescript|python|docker|kubernetes|database|auth/.test(t)) return "developer-tools";
 if(/automation|workflow|integration|zapier|manual|process/.test(t)) return "operations";
 if(/dashboard|report|metric|observability|monitoring/.test(t)) return "analytics";
 return "software";
}

function normalizeSignals(raw:Evidence[]):Evidence[]{
 return raw.map(e=>({...e,payload:{...e.payload,category:String(e.payload.category??classifyCategory(String(e.payload.title??"")+" "+String(e.payload.body??""))),audience:String(e.payload.audience??"software buyers")}}));
}

export async function collectLiveEvidence(config:LiveDiscoveryConfig,fetcher:typeof fetch=fetch):Promise<Evidence[]>{
 const target=config.target??100;
 const all:Evidence[]=[];
 for(const query of config.queries){
  if(all.length>=target) break;
  const signals=await discoverGitHubIssues({query,token:config.token,perPage:config.perQuery??20},fetcher);
  for(const s of signals) all.push({...s,id:"github-"+String(all.length+1),capturedAt:s.capturedAt??new Date().toISOString()} as Evidence);
 }
 return deduplicateEvidence(normalizeSignals(all)).slice(0,target);
}

export async function runLiveBenchmark(config:LiveDiscoveryConfig,offers:Offer[],fetcher:typeof fetch=fetch):Promise<LiveBenchmarkRow[]>{
 const evidence=await collectLiveEvidence(config,fetcher);
 const opportunities=discoverCommercialOpportunities(evidence);
 return opportunities.map(o=>{
  const matches=offers.map(x=>matchOffer(o,x)).sort((a,b)=>(b.fitScore+b.economicsScore)-(a.fitScore+a.economicsScore));
  const best=matches[0];
  const related=evidence.filter(e=>o.evidenceIds.includes(e.id));
  const commercial=Math.max(0,...related.map(e=>Number(e.payload.commercialIntent??0)));
  const score=scoreOpportunity({demand:o.confidence*100,commercialIntent:commercial*100,competition:50,affiliateValue:best?.economicsScore??0,contentGap:70,serpOpportunity:60,executionCost:70});
  return {rank:0,title:o.title,category:o.category,confidence:o.confidence,score:score.total,decision:score.decision,evidenceCount:related.length,bestOffer:best?.offerId,bestOfferScore:best?Math.round((best.fitScore+best.economicsScore)/2):undefined,sourceUrl:String(related[0]?.sourceUrl??"")};
 }).sort((a,b)=>b.score-a.score).slice(0,10).map((x,i)=>({...x,rank:i+1}));
}
