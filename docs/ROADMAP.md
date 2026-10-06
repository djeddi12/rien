# Execution Roadmap

## Completed
- Deterministic opportunity scoring
- Typed domain contracts
- Evidence freshness and provenance
- Evidence adapter interface
- Opportunity discovery from evidence clusters
- Offer matching and economics helpers
- Asset planning
- Experiment metrics
- Outcome learning
- Next-best-action ranking
- Qwen boundary rules
- End-to-end pipeline

## Next production hardening
1. Replace MemoryStore with SQLite/Postgres adapter.
2. Add real, permissioned evidence connectors.
3. Add verified affiliate-program ingestion with source URLs and expiry.
4. Add authentication and approval gates.
5. Add scheduled workers with idempotency keys.
6. Add analytics ingestion and attribution reconciliation.
7. Add dashboard.
8. Run typecheck, tests and CI on every change.

## Product boundary
The engine is independent from FastSEOHub. It may consume public evidence, but it does not depend on FastSEOHub internals.
