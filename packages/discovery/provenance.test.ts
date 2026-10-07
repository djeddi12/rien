import{describe,expect,it}from"vitest";
import{discoverCommercialOpportunities}from"./commercial";

const e=(id:string,title:string,category:string)=>({id,source:"github",sourceType:"github_issue",capturedAt:"2026-10-07",confidence:.9,payload:{title,body:"We need a better paid tool because the current option is expensive.",category,audience:"software buyers"}});

describe("commercial discovery",()=>{
 it("preserves source titles and keeps commercial interpretation separate",()=>{
  const inputs=[
   e("1","Need a CRM alternative for agencies","marketing"),
   e("2","Need a hosted analytics dashboard for teams","analytics"),
   e("3","Looking for a paid automation service","operations"),
   e("4","Need a better developer tool for CI","developer-tools"),
   e("5","Need an affordable reporting platform","software")
  ];
  const result=discoverCommercialOpportunities(inputs);
  expect(result).toHaveLength(5);
  const sourceTitles=new Set(inputs.map(x=>String(x.payload.title)));
  for(const opportunity of result){
   expect(sourceTitles.has(opportunity.title)).toBe(true);
   expect(opportunity.title).toBe(opportunity.sourceTitle);
   expect(["alternative-seeking","pain-driven","comparison","unclear"]).toContain(opportunity.intent);
   expect(opportunity.keywords.length).toBeGreaterThan(0);
   expect(opportunity.title).not.toMatch(/for buyers with a clear pain|alternatives and buying options|workflow pain and solution gap|commercial opportunity$/i);
  }
 });
});
