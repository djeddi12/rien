import{describe,expect,it}from"vitest";
import{discoverCommercialOpportunities}from"./commercial";

const e=(id:string,title:string,body="",category="software")=>({id,source:"test",sourceType:"github_issue",capturedAt:"2026-10-07",confidence:.9,payload:{title,body,category,audience:"agencies"}});

describe("commercial discovery",()=>{
 it("creates a specific opportunity instead of a category bucket",()=>{
  const result=discoverCommercialOpportunities([
   e("1","Need a CRM alternative for agencies","Pricing is expensive and we need a cheaper hosted option."),
   e("2","Best CRM for agencies","Looking for a paid CRM alternative with simpler workflow."),
   e("3","Refactor internal unit tests","CI failure in maintainer tooling.")
  ]);
  expect(result.length).toBeGreaterThan(0);
  expect(result[0].title).not.toBe("Commercial opportunity in software");
  expect(result[0].title.toLowerCase()).toContain("crm");
 });
});
