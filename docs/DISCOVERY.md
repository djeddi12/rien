# Real Market Discovery

The first production connector is public GitHub issue search.

## Flow

GitHub search -> raw issue signal -> normalized Evidence -> commercial intent enrichment -> Opportunity Miner.

GitHub issues are treated as evidence, not proof of market size or revenue.

## Query strategy

Use queries that target explicit pain and buying language, for example:
- `is:issue (pain OR difficult OR missing) (tool OR software)`
- `is:issue "alternative" "pricing"`
- `is:issue "wish" "integration"`

The engine should run several narrow queries rather than one giant query.

## Commercial interpretation

The deterministic layer looks for buyer-intent and pain signals. Qwen may explain clusters, but cannot invent demand, revenue, pricing, or conversion numbers.

## Next connectors

1. Permissioned first-party search data.
2. Public discussion sources where collection is permitted.
3. Affiliate-program feeds/pages with verified terms.
4. Product/catalog sources.

All connectors must preserve source URL, capture time, confidence and raw evidence.
