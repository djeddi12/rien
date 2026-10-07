import {writeFileSync} from "node:fs";
import {collectLiveEvidence} from "../packages/discovery/live";
import {discoverCommercialOpportunities} from "../packages/discovery/commercial";
import {scoreOpportunity} from "../packages/scoring";

const queries=[
 "is:issue is:open comments:>=2 pricing alternative",
 "is:issue is:open comments:>=2 \"feature request\" integration",
 "is:issue is:open comments:>=2 manual workflow",
 "is:issue is:open comments:>=2 hosted dashboard",
 "is:issue is:open comments:>=2 enterprise authentication",
 "is:issue is:open comments:>=2 \"too expensive\" software",
 "is:issue is:open comments:>=2 \"looking for\" tool"
];

const evidence=await collectLiveEvidence({
 queries,
 perQuery:25,
 target:150,
 token:process.env.GITHUB_TOKEN
});

const opportunities=discoverCommercialOpportunities(evidence);
const rows=opportunities.map(o=>{
 const related=evidence.filter(e=>o.evidenceIds.includes(e.id));
 const commercial=Math.max(0,...related.map(e=>Number(e.payload.commercialIntent??0)));
 const result=scoreOpportunity({
  demand:o.confidence*100,
  commercialIntent:commercial*100,
  competition:50,
  affiliateValue:50,
  contentGap:70,
  serpOpportunity:60,
  executionCost:70
 });
 return {
  title:o.title,
  category:o.category,
  audience:o.audience,
  confidence:o.confidence,
  score:result.total,
  decision:result.decision,
  evidenceCount:related.length,
  evidenceIds:o.evidenceIds,
  sourceUrls:related.map(e=>e.sourceUrl).filter(Boolean)
 };
}).sort((a,b)=>b.score-a.score);

const report={
 generatedAt:new Date().toISOString(),
 corpus:{raw:evidence.length,opportunities:opportunities.length},
 decisionCounts:rows.reduce((a,x)=>(a[x.decision]++,a),{build:0,watch:0,reject:0} as Record<string,number>),
 top:rows.slice(0,20)
};

writeFileSync("live-benchmark.json",JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report,null,2));
