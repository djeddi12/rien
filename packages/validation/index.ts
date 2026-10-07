import type {Opportunity,ValidationPlan} from "../core";

function chooseType(o:Opportunity):ValidationPlan["type"]{
 const f=o.fingerprint;
 if(f?.commercialSignal>=.65 && o.monetizationHypotheses.includes("affiliate")) return "comparison";
 if(f?.painStrength>=.7) return "interactive_tool";
 if(f?.buyerSignal>=.5) return "lead_capture";
 return "landing_page";
}
function threshold(type:ValidationPlan["type"]){return type==="lead_capture"?3:type==="comparison"||type==="affiliate_test"?2:1;}
function action(type:ValidationPlan["type"],o:Opportunity){
 const label=o.title;
 if(type==="comparison") return `Publish one evidence-backed comparison for ${label} and measure qualified outbound clicks.`;
 if(type==="interactive_tool") return `Prototype the smallest useful tool for ${label}; require a real user action before counting validation.`;
 if(type==="lead_capture") return `Publish a focused offer page for ${label} with one qualified lead CTA.`;
 return `Publish one focused validation page for ${label} and measure qualified intent.`;
}
export function planValidation(o:Opportunity):ValidationPlan{
 const type=chooseType(o);
 const f=o.fingerprint;
 const quality=f?.quality??o.confidence;
 return {
  opportunityId:o.id,type,
  hypothesis:`Real buyers will take a measurable action because the evidence indicates a recurring commercial problem: ${o.title}.`,
  action:action(type,o),
  successMetric:type==="lead_capture"?"qualified leads per 100 visits":type==="comparison"?"qualified outbound clicks per 100 visits":"qualified validation actions per 100 visits",
  passThreshold:threshold(type),
  minimumObservationDays:7,
  stopCondition:`Stop if fewer than ${threshold(type)} qualified actions per 100 relevant visits after the observation window, or if new evidence materially increases contradiction risk.`,
  estimatedEffort:quality>=.7?"low":quality>=.45?"medium":"high",
  approvalRequired:true,
  evidenceIds:o.evidenceIds
 };
}
