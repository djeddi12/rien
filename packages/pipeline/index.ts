import type {Evidence,Offer,Experiment,Opportunity} from "../core";
import {scoreOpportunity} from "../scoring";
import {mineOpportunity} from "../opportunities";
import {matchOffer} from "../offers";
import {chooseNextAction} from "../next-action";
import {planValidation} from "../validation";
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

  const validation=planValidation(opportunity);
  store.addExperiment(input.experiment);
  const action=chooseNextAction({opportunity,score,validation});
  return {opportunity,score,validation,action,state:store.snapshot()};
}
