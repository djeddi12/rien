import type {LearningAdjustment,Opportunity,Outcome} from "../core";

function validateOutcome(o:Outcome):string[]{
 const reasons:string[]=[];
 for(const [name,value] of [["visits",o.visits],["clicks",o.clicks],["leads",o.leads],["conversions",o.conversions],["revenue",o.revenue],["cost",o.cost]] as const){
  if(value!==undefined && (!Number.isFinite(value)||value<0)) reasons.push(`invalid_${name}`);
 }
 if(o.visits!==undefined){
  if((o.clicks??0)>o.visits) reasons.push("clicks_exceed_visits");
  if((o.leads??0)>o.visits) reasons.push("leads_exceed_visits");
  if((o.conversions??0)>o.visits) reasons.push("conversions_exceed_visits");
  if(o.leads!==undefined && (o.conversions??0)>o.leads) reasons.push("conversions_exceed_leads");
 }
 return reasons;
}

function signal(outcome:Outcome):{rate?:number;count:number;name?:string}{
 const visits=outcome.visits;
 if(!visits || visits<=0) return {count:0};
 if(outcome.conversions!==undefined) return {rate:outcome.conversions/visits,count:outcome.conversions,name:"conversion"};
 if(outcome.leads!==undefined) return {rate:outcome.leads/visits,count:outcome.leads,name:"lead"};
 if(outcome.clicks!==undefined) return {rate:outcome.clicks/visits,count:outcome.clicks,name:"click"};
 return {count:0};
}

function sampleWeight(visits:number):number{return Math.min(1,Math.sqrt(visits/100));}

export function learnFromOutcome({opportunity,outcome}:{opportunity:Opportunity;outcome:Outcome}):LearningAdjustment{
 const prior=Math.max(0,Math.min(1,opportunity.confidence));
 const invalid=validateOutcome(outcome);
 if(invalid.length) return {experimentId:outcome.experimentId,opportunityId:opportunity.id,priorConfidence:prior,newConfidence:prior,confidenceDelta:0,sampleSize:0,outcomeQuality:"insufficient",reasons:invalid,observedAt:outcome.observedAt};

 const s=signal(outcome),visits=outcome.visits??0,weight=sampleWeight(visits),reasons:string[]=[];
 let delta=0;
 if(visits<30 || s.rate===undefined) reasons.push("insufficient_observation");
 else if(s.rate>=.03){delta=.12*weight*Math.min(1,s.rate/.10);reasons.push(`${s.name}_signal_above_learning_floor`);}
 else if(s.rate===0 && visits>=100){delta=-.10*weight;reasons.push("zero_observed_signal_with_sufficient_sample");}
 else {delta=-.04*weight;reasons.push(`${s.name}_signal_below_learning_floor`);}

 const revenuePerVisit=outcome.revenue!==undefined&&visits>0?outcome.revenue/visits:undefined;
 const costPerVisit=outcome.cost!==undefined&&visits>0?outcome.cost/visits:undefined;
 if(revenuePerVisit!==undefined){
  if(outcome.attributionQuality==="high") reasons.push("revenue_attribution_high");
  else reasons.push("revenue_not_used_for_strong_update");
 }
 const revenue=outcome.revenue;
 const cost=outcome.cost;
 if(revenue!==undefined&&cost!==undefined&&outcome.attributionQuality==="high"){
  if(revenue>cost) delta+=Math.min(.03,((revenue-cost)/Math.max(1,revenue))*.03);
  else if(revenue<cost) delta-=Math.min(.03,((cost-revenue)/Math.max(1,cost))*.03);
 }
 delta=Math.max(-.15,Math.min(.15,delta));
 const quality=visits>=300?"strong":visits>=100?"moderate":visits>=30?"weak":"insufficient";
 const adjusted=Math.max(0,Math.min(1,prior+delta));
 return {experimentId:outcome.experimentId,opportunityId:opportunity.id,priorConfidence:prior,newConfidence:Math.round(adjusted*1000)/1000,confidenceDelta:Math.round((adjusted-prior)*1000)/1000,sampleSize:visits,signalRate:s.rate,revenuePerVisit,costPerVisit,outcomeQuality:quality,reasons,observedAt:outcome.observedAt};
}
