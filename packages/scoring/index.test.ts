import { describe, expect, it } from "vitest";
import { scoreOpportunity } from "./index";

describe("scoreOpportunity", () => {
  it("scores a strong opportunity deterministically", () => {
    const result = scoreOpportunity({
      demand: 82,
      commercialIntent: 94,
      competition: 61,
      affiliateValue: 91,
      contentGap: 87,
      serpOpportunity: 79,
      executionCost: 85,
    });

    expect(result.total).toBe(81.6);
  });

  it("clamps invalid signal ranges", () => {
    const result = scoreOpportunity({
      demand: 120,
      commercialIntent: -10,
      competition: 50,
      affiliateValue: 50,
      contentGap: 50,
      serpOpportunity: 50,
      executionCost: 50,
    });

    expect(result.signals.demand).toBe(100);
    expect(result.signals.commercialIntent).toBe(0);
  });
});
