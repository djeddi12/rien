import type {Experiment,Outcome} from "../core";
export function conversionRate(outcome:Outcome){if(!outcome.visits||outcome.visits<=0)return 0;return (outcome.conversions??0)/outcome.visits}
export function clickRate(outcome:Outcome){if(!outcome.visits||outcome.visits<=0)return 0;return (outcome.clicks??0)/outcome.visits}
export function experimentIsMeasurable(outcome:Outcome){return (outcome.visits??0)>0||Boolean(outcome.clicks||outcome.leads||outcome.conversions)}
export type NextAction={experiment:Experiment;priority:number;reason:string};
export function rankNextAction(experiment:Experiment,evidenceConfidence:number,effort:number):NextAction{
 const priority=Math.max(0,Math.min(100,evidenceConfidence*70+(100-Math.max(0,Math.min(100,effort)))*30));
 return {experiment,priority,reason:priority>=70?"Strong evidence and manageable effort":"Needs more evidence or lower execution effort"};
}
