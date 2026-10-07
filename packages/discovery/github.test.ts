import{describe,expect,it,vi}from"vitest";import{discoverGitHubIssues}from"./github";
describe("github discovery",()=>it("turns issue search results into evidence",async()=>{
 const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>({items:[{number:1,title:"Slow export is painfully slow for customer reports and teams",html_url:"https://github.com/x/y/issues/1",body:"exports are painfully slow and difficult for customer teams",comments:4,created_at:"2026-10-01",updated_at:"2026-10-06",state:"open",repository_url:"https://api.github.com/repos/x/y"}]})});
 const r=await discoverGitHubIssues({query:'is:issue "export" pain',perPage:1},fetcher as any);
 expect(r).toHaveLength(1);expect(r[0].sourceUrl).toContain("/issues/1");expect(r[0].payload).toHaveProperty("comments",4);
}));