import type {Evidence,Offer,Experiment,Opportunity,Outcome,OfferMatch,AssetPlan,ValidationPlan,LearningAdjustment,NextBestAction} from "../core";
import {discoverCommercialOpportunities} from "../discovery/commercial";
import {matchOffer} from "../offers";
import {scoreOpportunity,OpportunityScore} from "../scoring";
import {planValidation} from "../validation";
import {planAssets} from "../assets";
import {learnFromOutcome} from "../learning";
import {chooseNextAction} from "../next-action";

export type OpportunityRun={
 opportunity:Opportunity;
 score:OpportunityScore;
 matches:OfferMatch[];
 validation:ValidationPlan;
 assets:AssetPlan;
 action:NextBestAction;
};

export type OutcomeRun=OpportunityRun & {
 outcome:Outcome;
 learning:LearningAdjustment;
 nextAction:NextBestAction;
};

function scoreFor(opportunity:Opportunity,matches:OfferMatch[]):OpportunityScore{
 const best=matches[0];
 const relatedCommercial=opportunity.fingerprint?.commercialSignal??opportunity.confidence;
 return scoreOpportunity({
  demand:opportunity.confidence*100,
  commercialIntent:relatedCommercial*100,
  competition:Math.max(0,100-(opportunity.fingerprint?.evidenceDiversity??0)*100),
  affiliateValue:best?.economicsScore??0,
  contentGap:Math.min(100,(opportunity.fingerprint?.painStrength??0)*100),
  serpOpportunity:Math.min(100,(opportunity.fingerprint?.buyerSignal??0)*100),
  executionCost:100-(opportunity.fingerprint?.quality??opportunity.confidence)*100,
  painStrength:(opportunity.fingerprint?.painStrength??0)*100,
  repeatability:(opportunity.fingerprint?.repeatability??0)*100,
  buyerSignal:(opportunity.fingerprint?.buyerSignal??0)*100
 });
}

export function buildOpportunityRun(opportunity:Opportunity,offers:Offer[]):OpportunityRun{
 const matches=offers.map(o=>matchOffer(opportunity,o)).sort((a,b)=>(b.fitScore+b.economicsScore)-(a.fitScore+a.economicsScore));
 const score=scoreFor(opportunity,matches);
 const validation=planValidation(opportunity);
 const assets=planAssets(opportunity,matches);
 const action=chooseNextAction({opportunity,score,validation});
 return {opportunity,score,matches,validation,assets,action};
}

export function discoverAndPlan(evidence:Evidence[],offers:Offer[]):OpportunityRun[]{
 return discoverCommercialOpportunities(evidence).map(o=>buildOpportunityRun(o,offers));
}

export function learnAndReplan(run:OpportunityRun,outcome:Outcome):OutcomeRun{
 const learning=learnFromOutcome({opportunity:run.opportunity,outcome});
 const updated={...run.opportunity,confidence:learning.newConfidence};
 const next=buildOpportunityRun(updated,run.matches.map(m=>({
  id:m.offerId,merchant:"",product:"",category:"",model:"other",lastVerifiedAt:""
 } as Offer));
 const nextAction=chooseNextAction({opportunity:updated,score:next.score,validation:next.validation,learning});
 return {...run,outcome,learning,nextAction};
}
