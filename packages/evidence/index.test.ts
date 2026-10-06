import {describe,expect,it} from "vitest";import {isFresh,evidenceQuality} from "./index";
describe("evidence",()=>{it("expires",()=>expect(isFresh({expiresAt:"2026-01-01T00:00:00Z"} as any,new Date("2026-01-02T00:00:00Z"))).toBe(false));it("clamps confidence",()=>expect(evidenceQuality({confidence:2} as any)).toBe(1))});
