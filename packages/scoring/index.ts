export type OpportunitySignals = {
  demand:number;
  commercialIntent:number;
  competition:number;
  affiliateValue:number;
  contentGap:number;
  serpOpportunity:number;
  executionCost:number;
  painStrength?:number;
  repeatability?:number;
  buyerSignal?:number;
};

export type OpportunityScore = {
  total:number;
  decision:"build"|"watch"|"reject";
  signals:OpportunitySignals;
};

const WEIGHTS={
  demand:.20,
  commercialIntent:.20,
  competition:.10,
  affiliateValue:.15,
  contentGap:.10,
  serpOpportunity:.10,
  executionCost:.05,
  painStrength:.05,
  repeatability:.025,
  buyerSignal:.025,
} as const;

function clamp(value:number):number{
  if(!Number.isFinite(value)) return 0;
  return Math.max(0,Math.min(100,value));
}

export function scoreOpportunity(signals:OpportunitySignals):OpportunityScore{
 const normalized=Object.fromEntries(Object.entries({...signals,
   painStrength:signals.painStrength??signals.commercialIntent,
   repeatability:signals.repeatability??signals.demand,
   buyerSignal:signals.buyerSignal??signals.commercialIntent
 }).map(([key,value])=>[key,clamp(value)])) as OpportunitySignals;
 const total=(Object.keys(WEIGHTS) as Array<keyof typeof WEIGHTS>)
   .reduce((sum,key)=>sum+(normalized[key]??0)*WEIGHTS[key],0);
 const rounded=Math.round(total*100)/100;
 return {total:rounded,decision:rounded>=75?"build":rounded>=55?"watch":"reject",signals:normalized};
}
