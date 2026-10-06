# MVP v2

The MVP is now an evidence-driven opportunity decision engine.

## Milestone 1 — Evidence Store
Store immutable observations with:
- evidenceId
- source
- sourceType
- capturedAt
- expiresAt
- confidence
- payload
- hash

Sources can include search, GitHub, GSC, product/offer feeds, SERP observations, public reviews, and first-party analytics.

## Milestone 2 — Opportunity Miner
Turn evidence clusters into candidate opportunities.

An opportunity must include:
- problem/query
- audience
- market/category
- evidenceIds
- commercial intent
- monetization hypotheses
- freshness
- confidence

No candidate becomes actionable without evidence.

## Milestone 3 — Offer Intelligence
Normalize monetizable offers.

Offer fields:
- merchant
- product
- category
- model
- price
- recurring
- commission
- attribution/cookie
- geography
- availability
- terms URL
- lastVerifiedAt

Never assume affiliate terms are permanent.

## Milestone 4 — Scoring
Combine evidence into deterministic scores.

Scoring is explainable and reproducible. Qwen cannot modify the numeric score.

## Milestone 5 — Asset Planner
Choose the minimum useful asset bundle:
- article/page
- comparison
- calculator
- product matcher
- video brief
- lead capture
- email sequence
- interactive tool

The system should prefer useful assets over content volume.

## Milestone 6 — Experiment Engine
Every selected opportunity becomes an experiment with:
- hypothesis
- action
- success metric
- minimum observation window
- stop condition
- owner/approval state

## Milestone 7 — Outcome + Learning
Record:
- impressions/visits
- clicks
- leads
- conversions
- revenue
- costs when available
- confidence
- attribution quality

Feed outcomes back into future scoring.

## Milestone 8 — Next Best Action
Rank active opportunities by expected value, confidence, effort, and risk.

The engine recommends the next action. Automatic external execution is initially approval-gated.
