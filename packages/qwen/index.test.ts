import{describe,expect,it}from"vitest";import{safeQwenExplain}from"./index";
describe("qwen boundary",()=>it("rejects missing facts",async()=>{const r=await safeQwenExplain({explain:async()=> "bad",draft:async()=>""},null,"explain");expect(r).toBe("Insufficient evidence.")}));
