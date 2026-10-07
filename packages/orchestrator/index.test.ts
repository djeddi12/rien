import{describe,expect,it}from"vitest";
import{buildOpportunityRun,discoverAndPlan,learnAndReplan}from"./index";
import type{Evidence,Offer,Opportunity,Outcome}from"../core";

const evidence=(id:string):Evidence=>({id,source:"github",sourceType:"github_issue",capturedAt:"2026-10-07T00:00:00Z",confidence:.9,payload:{title:"Need a cheaper hosted CRM alternative for agencies",body:"We need a paid alternative because the current workflow is manual and expensive",category:"software",audience:"agencies"}});
const offer:Offer={id:"offer1",merchant:"Example",product:"CRM software",category:"software",model:"affiliate",commission:.4,recurring:true,lastVerifiedAt:"2026-10-07T00:00:00Z"};

describe("orchestrator",()=>{
 it("builds a complete opportunity plan",()=>{
  const opportunity:Opportunity={id:"o1",title:"CRM alternatives",audience:"agencies",category:"software",evidenceIds:["e1"],monetizationHypotheses:["affiliate"],createdAt:"2026-10-07T00:00:00Z",confidence:.8,fingerprint:{problem:"CRM pricing",buyer:"agencies",jobToBeDone:"replace expensive workflow",currentWorkaround:"manual process",painStrength:.8,buyerSignal:.8,commercialSignal:.8,repeatability:.7,evidenceFreshness:.9,evidenceDiversity:.8,contradictionRisk:0,technicalNoiseRatio:0,quality:.8}};
  const run=buildOpportunityRun(opportunity,[offer]);
  expect(run.matches).toHaveLength(1); expect(run.assets.assets).toContain("comparison"); expect(run.validation.approvalRequired).toBe(true);
 });
 it("discovers and plans commercial opportunities",()=>{
  const runs=discoverAndPlan([evidence("e1"),evidence("e2")],[offer]);
  expect(runs.length).toBeGreaterThan(0); expect(runs[0].validation.evidenceIds.length).toBeGreaterThan(0);
 });
 it("replans after measured outcomes",()=>{
  const opportunity:Opportunity={id:"o1",title:"CRM",audience:"agencies",category:"software",evidenceIds:["e1"],monetizationHypotheses:["affiliate"],createdAt:"",confidence:.8};
  const run=buildOpportunityRun(opportunity,[offer]);
  const outcome:Outcome={experimentId:"x",visits:300,conversions:18,revenue:180,attributionQuality:"high",observedAt:"2026-10-07T00:00:00Z"};
  const result=learnAndReplan(run,outcome);
  expect(result.learning.newConfidence).toBeGreaterThan(.8);
  expect(result.nextAction.observedOutcome?.experimentId).toBe("x");
 });
});
