import{describe,expect,it}from"vitest";import{buildOpportunityFingerprint}from"./index";
const e=(id:string,title:string,body:string,sourceUrl:string)=>({id,source:"GitHub",sourceType:"github_issue",capturedAt:"2026-10-07T00:00:00Z",confidence:1,sourceUrl,payload:{title,body}});
describe("opportunity fingerprint",()=>{
 it("separates independent commercial pain from technical noise",()=>{
  const f=buildOpportunityFingerprint([
   e("1","Need a hosted CRM alternative","Pricing is expensive and the workflow is manual.","https://github.com/a/one/issues/1"),
   e("2","Best CRM for agencies","We need a paid replacement for the current tool.","https://github.com/b/two/issues/2"),
   e("3","CI crash","Refactor internal unit tests.","https://github.com/c/three/issues/3")
  ]);
  expect(f.painStrength).toBeGreaterThan(0.5); expect(f.buyerSignal).toBeGreaterThan(0.5);
  expect(f.evidenceDiversity).toBe(1); expect(f.technicalNoiseRatio).toBeLessThan(0.5); expect(f.quality).toBeGreaterThan(0.4);
 });
 it("penalizes contradiction-heavy evidence",()=>{
  const f=buildOpportunityFingerprint([
   e("1","Need paid workflow","Current workaround is painful.","https://github.com/a/one/issues/1"),
   e("2","Already solved","No longer need this.","https://github.com/b/two/issues/2")
  ]);
  expect(f.contradictionRisk).toBeGreaterThan(0); expect(f.quality).toBeLessThan(0.8);
 });
});
