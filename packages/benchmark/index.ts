import type {Evidence,Offer} from "../core";
import {discoverCommercialOpportunities} from "../discovery/commercial";
import {matchOffer} from "../offers";
import {scoreOpportunity} from "../scoring";

export type BenchmarkCase={id:string;category:string;audience:string;title:string;evidence:Evidence[];offers:Offer[]};

export type BenchmarkResult={id:string;opportunity:string;confidence:number;score:number;decision:"build"|"watch"|"reject";bestOfferId?:string;assetSignal:string};

export function runBenchmark(cases:BenchmarkCase[]):BenchmarkResult[]{
 return cases.map(c=>{
  const opportunities=discoverCommercialOpportunities(c.evidence);
  const o=opportunities[0];
  if(!o)return {id:c.id,opportunity:"none",confidence:0,score:0,decision:"reject",assetSignal:"insufficient evidence"};
  const matches=c.offers.map(x=>matchOffer(o,x)).sort((a,b)=>(b.fitScore+b.economicsScore)-(a.fitScore+a.economicsScore));
  const best=matches[0];
  const score=scoreOpportunity({
   demand:o.confidence*100,
   commercialIntent:Math.max(...c.evidence.map(e=>Number(e.payload.commercialIntent??0)))*100,
   competition:50,
   affiliateValue:best?.economicsScore??0,
   contentGap:70,
   serpOpportunity:60,
   executionCost:70
  });
  return {id:c.id,opportunity:o.title,confidence:o.confidence,score:score.total,decision:score.decision,bestOfferId:best?.offerId,assetSignal:best?"comparison-or-matcher":"validation-first"};
 });
}

export function summarizeBenchmark(results:BenchmarkResult[]){
 const build=results.filter(x=>x.decision==="build").length;
 const watch=results.filter(x=>x.decision==="watch").length;
 const reject=results.filter(x=>x.decision==="reject").length;
 const avg=results.length?results.reduce((s,x)=>s+x.score,0)/results.length:0;
 return {total:results.length,build,watch,reject,averageScore:Math.round(avg*100)/100};
}
