export type OpportunitySignals = {
  demand: number;
  commercialIntent: number;
  competition: number;
  affiliateValue: number;
  contentGap: number;
  serpOpportunity: number;
  executionCost: number;
};

export type OpportunityScore = {
  total: number;
  decision: "build" | "watch" | "reject";
  signals: OpportunitySignals;
};

const WEIGHTS: Record<keyof OpportunitySignals, number> = {
  demand: 0.25,
  commercialIntent: 0.20,
  competition: 0.15,
  affiliateValue: 0.15,
  contentGap: 0.10,
  serpOpportunity: 0.10,
  executionCost: 0.05,
};

function clamp(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

export function scoreOpportunity(signals: OpportunitySignals): OpportunityScore {
  const normalized = Object.fromEntries(
    Object.entries(signals).map(([key, value]) => [key, clamp(value)])
  ) as OpportunitySignals;

  const total = (Object.keys(WEIGHTS) as Array<keyof OpportunitySignals>)
    .reduce((sum, key) => sum + normalized[key] * WEIGHTS[key], 0);

  const rounded = Math.round(total * 100) / 100;

  return {
    total: rounded,
    decision: rounded >= 75 ? "build" : rounded >= 55 ? "watch" : "reject",
    signals: normalized,
  };
}
