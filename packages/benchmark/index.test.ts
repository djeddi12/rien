import{describe,expect,it}from"vitest";import{benchmarkCases}from"./fixtures";import{runBenchmark,summarizeBenchmark}from"./index";
describe("100-case benchmark",()=>it("processes exactly 100 cases",()=>{const r=runBenchmark(benchmarkCases);const s=summarizeBenchmark(r);expect(s.total).toBe(100);expect(s.build+s.watch+s.reject).toBe(100);expect(r.some(x=>x.decision==="build")).toBe(true)}));
