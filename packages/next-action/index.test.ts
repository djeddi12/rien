import{describe,expect,it}from"vitest";
import{chooseNextAction}from"./index";
import type{Opportunity,ValidationPlan}from"../core";
import type{OpportunityScore}from"../scoring";

const opportunity:Opportunity={id:"o1",title:"CRM alternatives",audience:"agencies",category:"software",evidenceIds:["e1"],monetizationHypotheses:["affiliate"],createdAt:"",confidence:.8};
const validation:ValidationPlan={opportunityId:"o1",type:"comparison",hypothesis:"h",action:"a",successMetric:"clicks",passThreshold:2,minimumObservationDays:7,stopCondition:"stop",estimatedEffort:"low",approvalRequired:true,evidenceIds:["e1"]};
const score=(decision:OpportunityScore["decision"],total:number):OpportunityScore=>({decision,total,signals:{demand:80,commercialIntent:80,competition:40,affiliateValue:80,contentGap:70,serpOpportunity:70,executionCost:80}});
describe("next best action",()=>{
 it("starts with validation for a build-ready opportunity",()=>{const r=chooseNextAction({opportunity,score:score("build",82),validation});expect(r.action).toBe("validate");expect(r.approvalRequired).toBe(true);});
 it("expands when strong observed outcomes materially improve confidence",()=>{const r=chooseNextAction({opportunity,score:score("build",82),validation,learning:{experimentId:"x",opportunityId:"o1",priorConfidence:.8,newConfidence:.9,confidenceDelta:.1,sampleSize:200,signalRate:.05,outcomeQuality:"moderate",reasons:[],observedAt:"2026-10-07T00:00:00Z"}});expect(r.action).toBe("expand");});
 it("kills only after enough evidence materially weakens confidence",()=>{const r=chooseNextAction({opportunity,score:score("watch",60),validation,learning:{experimentId:"x",opportunityId:"o1",priorConfidence:.8,newConfidence:.3,confidenceDelta:-.5,sampleSize:200,outcomeQuality:"moderate",reasons:[],observedAt:"2026-10-07T00:00:00Z"}});expect(r.action).toBe("kill");});
});
