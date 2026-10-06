# Qwen adapter

Qwen is an interpretation layer only.

Input must be structured evidence, deterministic scores and recorded outcomes.
The adapter must never be the source of search volume, rankings, prices, commissions, revenue or conversion metrics.

Recommended interface:
- explainEvidence(input)
- proposeStrategy(input)
- draftAsset(input)
- summarizeOutcome(input)
- recommendNextAction(input)

All numeric facts must originate outside Qwen and retain evidence IDs.
