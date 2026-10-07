import type {LearningAdjustment,Opportunity,ValidationPlan} from "../core";
import type {OpportunityScore} from "../scoring";
import type {NextAction,NextBestAction} from "../core";

export type NextActionInput={
 opportunity:Opportunity;
 score:OpportunityScore;
 validation:ValidationPlan;
 learning?:LearningAdjustment;
};

export function chooseNextAction(input:NextActionInput):NextBestAction{
 const {opportunity,score,validation,learning}=input;
 const confidence=learning?.newConfidence??opportunity.confidence;
 const reasons:string[]=[];
 let action:NextAction="watch";

 if(learning&&learning.sampleSize>=100&&learning.newConfidence<.35){
   action="kill";
   reasons.push("observed_outcomes_materially_weaken_confidence");
 }else if(learning&&learning.sampleSize>=100&&learning.confidenceDelta>=.05){
   action=score.decision==="build"?"expand":"build";
   reasons.push("observed_outcomes_support_the_opportunity");
 }else if(score.decision==="build"){
   action="validate";
   reasons.push("deterministic_score_reaches_build_threshold");
 }else if(score.decision==="watch"){
   action="validate";
   reasons.push("opportunity_is_promising_but_not_ready_for_full_build");
 }else{
   action="watch";
   reasons.push("score_is_below_validation_threshold");
 }

 reasons.push("human_approval_required_before_execution");
 const priority=Math.round(Math.max(0,Math.min(100,(score.total*.7)+(confidence*100*.3)))*100)/100;
 return {opportunityId:opportunity.id,action,priority,reason:reasons,confidence,approvalRequired:true,validationType:validation.type,observedOutcome:learning};
}
