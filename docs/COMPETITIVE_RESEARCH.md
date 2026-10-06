# Competitive Research — GitHub

Research date: 2026-10-06

We searched GitHub for systems overlapping with the Opportunity Engine. The conclusion is important:

**There is no single repository that combines evidence-backed opportunity discovery, affiliate economics, offer matching, asset selection, autonomous experimentation, and closed-loop revenue learning in the exact way we want.**

Several projects cover important pieces. We should borrow patterns, not blindly copy the product.

## 1. AffiliateAgent — stay4ever/affiliate-agent

What it does:
- Multi-agent affiliate workflow.
- NicheScout, ProductFinder, ContentCreator, SEOOptimizer, PerformanceAnalyst.
- Structured affiliate-program records.
- Program comparison.
- ROI and performance reporting.
- MCP tools.
- FTC disclosure and reader-first safeguards.

Why it matters:
This validates our agent decomposition and gives us a useful tool taxonomy.

What we take:
- Separate specialist responsibilities.
- Structured tool contracts.
- Standard affiliate-program schema.
- ROI calculator.
- Performance-analysis stage.
- Compliance/disclosure as a first-class field.

What we deliberately improve:
AffiliateAgent starts from affiliate marketing. Our engine starts from an opportunity and chooses the monetization path: affiliate, lead-gen, SaaS, digital product, or other approved model.

License: MIT.

Reference: https://github.com/stay4ever/affiliate-agent

## 2. GitHub Opportunity Miner — whitesungun876/Opportunity-Mining-Agent

What it does:
- Mines real GitHub issues for product pain.
- Converts evidence into opportunity cards.
- Produces buyer hypotheses, willingness-to-pay signals, and validation plans.
- Uses local SQLite and supports mock mode.
- Evidence-first architecture.

What we take:
- Opportunity cards.
- Evidence IDs and traceability.
- Buyer hypothesis.
- WTP signal.
- Validation plan.
- Deterministic/mock mode for tests.

This is especially valuable for our discovery layer: GitHub issues become one signal source, not the whole system.

License: Apache-2.0.

Reference: https://github.com/whitesungun876/Opportunity-Mining-Agent

## 3. OpenGSC — fenjo26/OpenGSC

What it does:
- Self-hosted GSC dashboard.
- Real clicks, impressions, CTR and position.
- Striking-distance keywords.
- Content decay and cannibalization.
- Keyword research and SERP workflows.
- Content-gap analysis.
- MCP server.
- Historical outcome windows.

What we take:
- First-party search data as high-confidence evidence.
- Separate observation from AI interpretation.
- Historical snapshots.
- Outcome windows rather than declaring an experiment successful immediately.
- MCP/tool interface design.
- SQLite/Prisma-style simple self-hosted storage for early stages.

We will NOT copy its private indexing/cloaking approach. That is outside our product principles and introduces search-engine compliance risk.

License: MIT.

Reference: https://github.com/fenjo26/OpenGSC

## 4. SEO Audit Template — longieirl/seo-audit-template

Useful patterns:
- Crawl -> link graph -> keyword research -> SERP -> content gap -> strategy.
- Persist raw outputs.
- Separate audit steps so individual stages can be rerun.
- Gitignored client/output data.
- CLI pipeline.

What we take:
Our discovery workers should be independently rerunnable and idempotent:
DISCOVER -> ENRICH -> SCORE -> PLAN.

License: MIT.

Reference: https://github.com/longieirl/seo-audit-template

## 5. Semantic SEO Suite — siddiqss/semantic-seo-suite

Useful ideas:
- Provenance attached to numeric claims.
- Fabrication guard.
- Content-gap and semantic coverage.
- Rank tracking.
- GEO/AI-search considerations.

What we take:
Every evidence-backed numeric field in our system should carry:
- source
- capturedAt
- evidenceId
- confidence
- freshness

The Qwen layer must refuse to turn missing evidence into a factual claim.

Reference: https://github.com/siddiqss/semantic-seo-suite

## 6. BuyWhere

Useful direction:
- Structured product catalog.
- Product search and comparison.
- Deal discovery.
- Price tracking.
- Affiliate link tracking.
- Agent/MCP interface.

This reveals a major future capability for us:

**Offer Intelligence should be a reusable service**, not a list of affiliate links.

An offer record should support:
product, merchant, price, recurring/one-time economics, commission, cookie/attribution, availability, geography, freshness, and affiliate URL.

Reference:
https://github.com/BuyWhere/buywhere
https://github.com/BuyWhere/buywhere-mcp

## 7. Market Intelligence / evidence-first research projects

Projects such as market-intelligence-agent and multi-agent-market-research reinforce:
- multi-source research
- persistent intermediate evidence
- structured competitor matrices
- voice-of-customer clusters
- ranked opportunities
- skeptic/fact-check stages

We should use these patterns without making the product a generic report generator.

## Architecture changes resulting from research

The repository should now add these concepts:

### Evidence
Every external observation becomes an immutable evidence record.

### Opportunity
A hypothesis backed by multiple evidence records.

### OfferMatch
A monetizable offer matched to the opportunity, with economics and freshness.

### AssetPlan
The minimum useful asset bundle required to attack the opportunity.

Examples:
- comparison page
- calculator
- product matcher
- landing page
- video brief
- FAQ
- email capture
- interactive tool

### Experiment
A measurable action with:
hypothesis, expected signal, start/end dates, traffic source, success metric, and stop condition.

### Outcome
Observed clicks, leads, conversions, revenue, EPC/CVR where valid, and confidence.

### Learning
Outcome-derived updates to future scoring.

## New strategic moat

The strongest idea from this research is not another AI writer.

It is the **evidence graph + outcome graph**:

Evidence -> Opportunity -> Offer -> Asset -> Experiment -> Outcome -> Learning

Over time, the engine can learn:
- which opportunity types convert
- which commercial intents convert
- which offers perform
- which asset types perform
- which SERP patterns are worth attacking
- which channels are inefficient
- which opportunities should be rejected before execution

That feedback loop is the core proprietary asset.

## Important legal/engineering rule

We may use open-source projects as references and, where their licenses permit it, reuse compatible code with proper attribution/license compliance. We will not copy proprietary code or silently transplant dependencies. Before importing code, record the source repository, license, exact component, and compatibility with our private project.

## Decision

Keep the current project direction.

Upgrade the roadmap to:

1. Evidence Store
2. Opportunity Miner
3. Offer Intelligence
4. Deterministic Scoring
5. Asset Planner
6. Qwen Strategy Layer
7. Experiment Engine
8. Revenue/Conversion Attribution
9. Opportunity Memory
10. Autonomous Next-Best-Action Engine

The product should be an **opportunity decision engine**, with affiliate monetization as one execution path—not an affiliate content farm.
