import{describe,expect,it}from"vitest";import{learnFromOutcome}from"./index";import type{Opportunity,Outcome}from"../core";
const opp:Opportunity={id:"o1",title:"CRM",audience:"agencies",category:"software",evidenceIds:["e1"],monetizationHypotheses:["affiliate"],createdAt:"",confidence:.7};
const out=(x:Partial<Outcome>):Outcome=>({experimentId:"x1",attributionQuality:"unknown",observedAt:"2026-10-07T00:00:00Z",...x});
describe("learning engine",()=>{
 it("raises confidence modestly on strong positive evidence",()=>{const r=learnFromOutcome({opportunity:opp,outcome:out({visits:300,conversions:18,revenue:180})});expect(r.newConfidence).toBeGreaterThan(.7);expect(r.confidenceDelta).toBeLessThanOrEqual(.15);});
 it("lowers confidence after enough zero-signal traffic",()=>{const r=learnFromOutcome({opportunity:opp,outcome:out({visits:200,conversions:0})});expect(r.newConfidence).toBeLessThan(.7);});
 it("does not overreact to tiny samples",()=>{const r=learnFromOutcome({opportunity:opp,outcome:out({visits:10,conversions:5})});expect(r.newConfidence).toBe(.7);expect(r.outcomeQuality).toBe("insufficient");});
 it("does not strongly learn revenue with unknown attribution",()=>{const r=learnFromOutcome({opportunity:opp,outcome:out({visits:300,conversions:9,revenue:10000,cost:1})});expect(r.confidenceDelta).toBeLessThan(.15);expect(r.reasons).toContain("revenue_not_used_for_strong_update");});
 it("rejects impossible counts without changing confidence",()=>{const r=learnFromOutcome({opportunity:opp,outcome:out({visits:20,clicks:30})});expect(r.newConfidence).toBe(.7);expect(r.reasons).toContain("clicks_exceed_visits");});
});