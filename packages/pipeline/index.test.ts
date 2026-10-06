import{describe,expect,it}from"vitest";
import{runPipeline}from"./index";

describe("pipeline",()=>{
  it("runs evidence to next action",()=>{
    const r=runPipeline({
      evidence:[{id:"e1",source:"search",sourceType:"search",capturedAt:"2026-10-01",confidence:.9,payload:{}}],
      title:"CRM for agencies",audience:"agencies",category:"software",
      monetizationHypotheses:["affiliate"],
      offers:[{id:"of1",merchant:"Example",product:"CRM",category:"software",model:"affiliate",commission:.4,lastVerifiedAt:"2026-10-01"}],
      experiment:{id:"ex1",opportunityId:"opp-crm-for-agencies",hypothesis:"comparison attracts buyers",action:"publish comparison",successMetric:"affiliate clicks",minimumObservationDays:7,stopCondition:"no clicks",approvalRequired:true}
    });
    expect(r.opportunity.evidenceIds).toEqual(["e1"]);
    expect(r.state.matches).toHaveLength(1);
    expect(r.score.total).toBeGreaterThan(0);
  });
});