# Opportunity Scoring

Deterministic scoring contract.

Input dimensions are normalized to 0–100.

score =
demand * 0.25 +
commercialIntent * 0.20 +
competition * 0.15 +
affiliateValue * 0.15 +
contentGap * 0.10 +
serpOpportunity * 0.10 +
executionCost * 0.05

Competition and execution cost are represented as opportunity-positive values: higher means easier to attack.

No LLM is required to calculate the score.
