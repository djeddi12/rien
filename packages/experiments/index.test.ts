import{describe,expect,it}from"vitest";import{conversionRate,clickRate}from"./index";
describe("experiments",()=>it("calculates rates safely",()=>{const o={experimentId:"e",visits:100,clicks:20,conversions:4,attributionQuality:"high",observedAt:""} as any;expect(clickRate(o)).toBe(.2);expect(conversionRate(o)).toBe(.04)}));
