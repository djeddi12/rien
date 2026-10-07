import{describe,expect,it}from"vitest";import{adversarialJudge}from"./index";
const e=(id:string,title:string):any=>({id,source:"test",sourceType:"github_issue",capturedAt:"2026-10-07",confidence:1,payload:{title,body:""}});
describe("adversarial judge",()=>{
 it("does not reject a commercial cluster because one item is technical noise",()=>{
  const evidence=[e("1","Need a hosted workflow alternative for business"),e("2","Feature request for paid service integration"),e("3","Bug: crash in internal unit test")];
  const opportunity:any={id:"o",title:"Commercial opportunity",audience:"buyers",category:"operations",evidenceIds:["1","2","3"],monetizationHypotheses:["affiliate"],createdAt:"",confidence:1};
  const r=adversarialJudge(opportunity,evidence); expect(r.verdict).toBe("pass");
 });
 it("rejects evidence with no buyer and no pain",()=>{
  const evidence=[e("1","Refactor internal unit test")];
  const opportunity:any={id:"o",title:"x",audience:"buyers",category:"software",evidenceIds:["1"],monetizationHypotheses:["affiliate"],createdAt:"",confidence:1};
  expect(adversarialJudge(opportunity,evidence).verdict).toBe("reject");
 });
});