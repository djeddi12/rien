import{describe,expect,it}from"vitest";import{enrichCommercialIntent,discoverCommercialOpportunities}from"./commercial";
const e={id:"e",source:"test",sourceType:"github_issue",capturedAt:"2026-10-06",confidence:.9,payload:{title:"Best CRM alternative for agencies: pricing is expensive",category:"software",audience:"agencies"}};
describe("commercial discovery",()=>{it("detects buyer and pain signals",()=>expect(enrichCommercialIntent(e).payload.commercialIntent).toBe(1));it("creates opportunities from commercial evidence",()=>expect(discoverCommercialOpportunities([e])).toHaveLength(1))});
