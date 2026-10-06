# Architecture

## System boundary

The engine has four layers:

### 1. Evidence layer
Collects external observations:
- search/demand signals
- SERP observations
- competitor/page observations
- offer and affiliate-program terms
- first-party analytics
- conversion/revenue events

Raw observations are stored with source, timestamp, confidence, and provenance.

### 2. Decision layer
Transforms evidence into deterministic objects:
- Opportunity
- OfferMatch
- AssetPlan
- Experiment
- Outcome

The decision layer must be testable without an LLM.

### 3. Intelligence layer
Qwen is used only where language reasoning is useful:
- explain why an opportunity matters
- propose angles from supplied evidence
- draft copy
- summarize experiment outcomes
- generate structured strategy

Qwen must not be the authority for numeric facts.

### 4. Execution layer
Creates approved assets and records every action. External irreversible actions remain approval-gated initially.

## Opportunity lifecycle

DISCOVERED → ENRICHED → SCORED → SELECTED → PLANNED → APPROVAL → EXECUTING → LIVE → MEASURED → LEARNED

Rejected opportunities remain in memory with rejection reasons.

## Opportunity memory

Every decision should be traceable:

Opportunity → evidence → score → action → traffic → clicks → conversions → revenue → outcome.

This creates a proprietary feedback loop rather than a generic AI content generator.
