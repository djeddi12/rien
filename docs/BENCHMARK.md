# 100 Opportunity Benchmark

This benchmark is the quality gate for the commercial brain.

## Purpose

Before adding a dashboard or autonomous publishing, the engine must process a fixed set of 100 cases and expose:
- score
- decision
- confidence
- best matched offer
- whether the next asset should be a comparison/matcher or validation first

## Two modes

### Fixture mode
Deterministic, offline and safe for CI. The repository contains 100 generated cases covering software, marketing, analytics, developer tools and operations.

### Live mode
The same evaluator can consume normalized Evidence from real connectors. Live evidence must retain source URLs and capture timestamps. It must never be mixed into the deterministic fixture dataset.

## Quality rules

The benchmark is not a claim that every BUILD decision will make money.

GitHub evidence demonstrates a problem signal, not willingness to pay. This follows the evidence-first principle used by comparable open-source opportunity miners. citeturn0search1

A strong benchmark should therefore measure:
1. Evidence completeness.
2. Commercial-intent precision.
3. Duplicate/cluster quality.
4. Offer-match quality.
5. Decision stability.
6. False-positive rate.
7. Whether the system explicitly rejects insufficient evidence.

## Graduation gate

Do not enable autonomous external execution until the benchmark has:
- 100 cases processed without crashes.
- deterministic repeatable results.
- zero invented numeric fields.
- source provenance on live evidence.
- explicit reject/watch/build decisions.
- human approval for irreversible actions.

## Research note

AffiliateAgent demonstrates useful separation between niche research, product finding and performance analysis, while newer opportunity-mining projects emphasize evidence traceability and commercial validation. We borrow those architectural patterns, not proprietary code. citeturn0search0turn0search1
