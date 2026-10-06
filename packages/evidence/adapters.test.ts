import{describe,expect,it}from"vitest";import{collectEvidence,normalizeSignal}from"./adapters";
describe("evidence adapters",()=>{
 it("normalizes and clamps signals",()=>{const e=normalizeSignal({source:"Search API",sourceType:"search",confidence:2,payload:{volume:120}},"2026-10-06T10:00:00.000Z");expect(e.id).toBe("ev_search-api_20261006100000");expect(e.confidence).toBe(1)});
 it("collects multiple adapters",async()=>{const e=await collectEvidence([{name:"a",collect:async()=>[{source:"a",sourceType:"test",payload:{x:1},confidence:.8}]},{name:"b",collect:async()=>[{source:"b",sourceType:"test",payload:{x:2},confidence:.7}]}],"2026-10-06T10:00:00.000Z");expect(e).toHaveLength(2)});
});