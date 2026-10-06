import type {Experiment} from "../core";
export type NextBestAction={experimentId:string;priority:number;reason:string};
export function nextBestAction(experiment:Experiment,input:{evidenceConfidence:number;effort:number;learningValue:number;risk:number}):NextBestAction{
 const c=Math.max(0,Math.min(1,input.evidenceConfidence));
 const e=Math.max(0,Math.min(100,input.effort));
 const l=Math.max(0,Math.min(100,input.learningValue));
 const r=Math.max(0,Math.min(100,input.risk));
 const priority=Math.round((c*40+(100-e)*.25+l*.25+(100-r)*.10)*100)/100;
 return {experimentId:experiment.id,priority,reason:priority>=70?"High-value next action":"Needs stronger evidence, lower effort, or lower risk"};
}
