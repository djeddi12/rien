import {describe,expect,it} from "vitest";
import {collectLiveEvidence,runLiveBenchmark} from "../discovery/live";
import {verifiedOfferCatalog} from "../offers/catalog";

const issue=(n:number)=>({number:n,title:"Need a hosted automation dashboard for teams with reports",html_url:"https://github.com/acme/repo/issues/"+n,body:"We need this because the current manual workflow is slow and difficult. Pricing and alternative would help.",comments:3,created_at:"2026-10-01T00:00:00Z",updated_at:"2026-10-02T00:00:00Z",state:"open",repository_url:"https://api.github.com/repos/acme/repo"});

describe("live benchmark",()=>{
 it("deduplicates repeated GitHub signals",async()=>{
  const fetcher=async()=>new Response(JSON.stringify({items:Array.from({length:20},(_,i)=>issue(i+1))}),{status:200});
  const result=await collectLiveEvidence({queries:["q1","q2"],perQuery:20,target:100},fetcher as typeof fetch);
  expect(result).toHaveLength(1);
 });
 it("returns ranked opportunities",async()=>{
  const fetcher=async()=>new Response(JSON.stringify({items:Array.from({length:20},(_,i)=>({...issue(i+1),html_url:"https://github.com/acme/repo/issues/"+(i+1),title:"Need hosted automation dashboard for teams "+(i+1)}))}),{status:200});
  const rows=await runLiveBenchmark({queries:["q1"],perQuery:20,target:20},verifiedOfferCatalog,fetcher as typeof fetch);
  expect(rows.length).toBeGreaterThan(0);
  expect(rows[0].rank).toBe(1);
 });
});
