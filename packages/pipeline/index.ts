import type {Evidence,Offer,Experiment,Opportunity} from "../core";
import {scoreOpportunity} from "../scoring";
import {mineOpportunity} from "../opportunities";
import {matchOffer} from "../offers";
import {nextBestAction} from "../next-action";
import {MemoryStore} from "../store";

export function runPipeline(input:{
  evidence:Evidence[];
  title:string;
  audience:string;
  category:string;
  monetizationHypotheses:string[];
  offers:Offer[];
  experiment:Experiment;
}){
  const store=new MemoryStore();
  input.evidence.forEach(e=>store.addEvidence(e));
  const opportunity:Opportunity=mineOpportunity({
    title:input.title,audience:input.audience,category:input.category,
    evidence:input.evidence,monetizationHypotheses:input.monetizationHypotheses
  });
  store.addOpportunity(opportunity);
  const signals={
    demand:opportunity.confidence*100,
    commercialIntent:70,
    competition:50,
    affiliateValue:input.offers.length?80:0,
    contentGap:60,
    serpOpportunity:60,
    executionCost:70
  };
  const score=scoreOpportunity(signals);
  input.offers.forEach(o=>{
    store.addOffer(o);
    store.addMatch(matchOffer(opportunity,o));
  });
  store.addExperiment(input.experiment);
  const action=nextBestAction(input.experiment,{
    evidenceConfidence:opportunity.confidence,
    effort:35,learningValue:80,risk:20
  });
  return {opportunity,score,action,state:store.snapshot()};
}