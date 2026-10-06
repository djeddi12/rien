import{describe,expect,it}from"vitest";import{offerFreshness,offerEconomics}from"./schema";
describe("offer intelligence",()=>{it("detects stale offers",()=>expect(offerFreshness({lastVerifiedAt:"2026-01-01"} as any,new Date("2026-03-01"),30)).toBe(false));it("rewards recurring economics",()=>expect(offerEconomics({commission:.4,recurring:true,price:100} as any)).toBeGreaterThan(28))});
