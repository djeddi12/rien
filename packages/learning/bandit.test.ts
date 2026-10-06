import{describe,expect,it}from"vitest";import{selectVariant}from"./bandit";
describe("learning selection",()=>it("prefers observed conversion rate",()=>expect(selectVariant([{id:"a",impressions:100,conversions:2},{id:"b",impressions:100,conversions:8}])?.id).toBe("b")));
