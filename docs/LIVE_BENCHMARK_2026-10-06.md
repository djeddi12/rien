# Live Benchmark Run — 2026-10-06

## Scope

- 10 established public repositories
- 10 GitHub issues per repository
- 100 unique public GitHub issue signals
- Search restricted to open issues with 2–50 comments
- Queries targeted feature/support/request/need signals
- Pull requests excluded with `is:issue`
- Evidence is public market/pain evidence, not proof of willingness to pay

Repositories:
- microsoft/vscode
- home-assistant/core
- grafana/grafana
- supabase/supabase
- n8n-io/n8n
- vercel/next.js
- kubernetes/kubernetes
- langchain-ai/langchain
- docker/compose
- pocketbase/pocketbase

## Top opportunity clusters

| Rank | Cluster | Evidence | Score | Offer hypothesis |
|---|---|---:|---:|---|
| 1 | Dashboards / observability | 17 | 83.52 | HubSpot* |
| 2 | Performance / reliability | 3 | 83.45 | — |
| 3 | Workflow automation | 15 | 81.86 | Pabbly |
| 4 | Integrations | 38 | 79.23 | GetResponse* |
| 5 | Data/API workflows | 3 | 73.60 | HubSpot* |
| 6 | General product gaps | 10 | 73.16 | — |
| 7 | Deployment / self-hosting | 7 | 67.87 | — |
| 8 | Authentication | 2 | 64.93 | — |
| 9 | Customization | 5 | 62.78 | Semrush* |

\* An offer match is only a commercial hypothesis. The current catalog match is category-based and must not be treated as proof that the merchant solves the issue.

## Strong evidence examples

### Workflow automation — 81.86

- n8n: Chat Trigger public chat URL returns "Connection rejected" after upgrade
  https://github.com/n8n-io/n8n/issues/28891
- n8n: Webhook trigger firing multiple times
  https://github.com/n8n-io/n8n/issues/31837
- n8n: AI Agent node tool errors fail workflow instead of returning an error to the agent
  https://github.com/n8n-io/n8n/issues/24042

### Integrations — 79.23

- Home Assistant: New integration. Cielo
  https://github.com/home-assistant/core/issues/172885
- Home Assistant: Google Assistant manual OAuth setup failure
  https://github.com/home-assistant/core/issues/156583
- Home Assistant: LG ThinQ cooktop missing from range
  https://github.com/home-assistant/core/issues/132533

### Performance / reliability — 83.45

- Kubernetes: topology-unaware scheduler can cause runaway pod creation
  https://github.com/kubernetes/kubernetes/issues/84869
- Next.js: server requests and latency increased after upgrade
  https://github.com/vercel/next.js/issues/85470
- Next.js: ChunkLoadError while loading application chunks
  https://github.com/vercel/next.js/issues/66526

### Deployment / self-hosting — 67.87

- Docker Compose: remote DOCKER_HOST support for configs and secrets
  https://github.com/docker/compose/issues/11867
- Kubernetes: eviction and PodDisruptionBudget defaults
  https://github.com/kubernetes/kubernetes/issues/35318
- Next.js: i18n configuration issue with app directory
  https://github.com/vercel/next.js/issues/53724

## Offer provenance

The seed catalog was checked against official merchant pages on 2026-10-06:

- HubSpot: 30% recurring commission for up to one year.
- GetResponse: the current program advertises 40% for 12 months for new referrals; its legal terms are time-sensitive.
- Pabbly: 30% recurring commission.
- Semrush: product-specific fixed commissions, including up to $300 for Semrush One and $200 for the SEO Toolkit.

These figures must be re-verified before execution.

## Important benchmark finding

The first naive global GitHub search was contaminated by very large coordination/automation issue threads. The benchmark was therefore changed to a controlled corpus of established repositories. This is an intentional quality improvement: signal quality matters more than raw issue count.

## Next engineering gate

Before autonomous monetization, the engine still needs:

1. semantic clustering instead of keyword-first clustering;
2. negative-signal detection for bugs, internal maintenance, and non-commercial requests;
3. offer-to-problem semantic fit rather than category-only matching;
4. competition/SERP evidence from search data;
5. real affiliate conversion outcomes;
6. adversarial review that can downgrade or reject a seemingly strong opportunity.

The benchmark is therefore **PASS for evidence ingestion and ranking pipeline smoke testing**, but **NOT approved for autonomous publishing or spending**.
