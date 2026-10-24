# Opportunity Engine + SignalShelf affiliate storefront

SignalShelf is the first usable storefront slice of the Opportunity Engine: a responsive product directory, source-conscious offer catalog, outbound-click tracking, and a persistent local SQLite event ledger. It is not a money-making bot and does not claim guaranteed earnings.

## Included

- `web/`: responsive storefront with search, category filters, sorting, editorial method, and affiliate disclosure.
- `web/products.json`: empty static fallback catalog. No fake products, ratings, prices, commissions, or sales are seeded.
- `engine/server.py`: standard-library local server with SQLite persistence, product API, tracked redirects, protected product creation, and operational event ledger.
- `GET /api/health`, `GET /api/products`, `GET /api/click/{product_id}`
- Protected `GET /api/admin/summary`, `POST /api/admin/products`, `POST /api/admin/events`, `GET /api/admin/opportunities`, and `POST /api/admin/opportunities`.
- A first integration bridge for Opportunity Engine: submit scored opportunity candidates with evidence, score (0–100), niche, status, and source URL; SignalShelf stores them in the same persistent ledger.

## Run locally (Windows)

Requires Python 3.11+. From the repository root in PowerShell:

```powershell
$env:SIGNALSHELF_ADMIN_TOKEN = "replace-with-a-long-random-secret"
python engine/server.py
```

Open http://127.0.0.1:8787. SQLite is stored in `data/signalshelf.sqlite3` and persists across restarts. Keep the token private. If it is unset, admin writes remain disabled.

Health check:

```powershell
Invoke-RestMethod http://127.0.0.1:8787/api/health
```

Admin summary:

```powershell
$headers = @{ Authorization = "Bearer $env:SIGNALSHELF_ADMIN_TOKEN" }
Invoke-RestMethod http://127.0.0.1:8787/api/admin/summary -Headers $headers
```

## Connect Opportunity Engine to SignalShelf

The bridge is an authenticated HTTP contract, not a claim that autonomous discovery already runs end-to-end. A discovery/scoring worker can POST each candidate to `/api/admin/opportunities` with the same Bearer token used for administration:

```json
{
  "id": "opp_unique_id",
  "title": "Compare lightweight SEO tools",
  "niche": "SEO & growth",
  "score": 82,
  "status": "reviewed",
  "evidence": [
    {"source": "https://example.com/report", "note": "Describe the specific observed evidence"}
  ],
  "source_url": "https://example.com/report"
}
```

Allowed statuses are `detected`, `reviewed`, `approved`, and `rejected`. Scores must be integers from 0 to 100. Reusing an ID updates that candidate, so retries do not create duplicate rows. Read stored candidates with authenticated `GET /api/admin/opportunities`; the admin summary now includes an opportunity count.

This contract is the first integration seam. The Opportunity Engine discovery/scoring pipeline still needs a worker that sends its real output to this endpoint; no automatic feed, AI agent, scheduled execution, or conversion learning is implied by this API alone.

## Add an offer only after verification

The admin endpoint requires these fields: `name`, `vendor`, `category`, `description`, `affiliate_url`, `vendor_url`, and `source_url`. URLs must use HTTPS. Categories: `AI & writing`, `SEO & growth`, `Productivity`, `Automation`, `Developer tools`, `Other`.

Example JSON (illustrative only; the example domain is not a real offer):

```json
{
  "name": "Verified product name",
  "vendor": "Vendor name",
  "category": "SEO & growth",
  "description": "A factual, source-supported description.",
  "affiliate_url": "https://affiliate.example/tracked-destination",
  "vendor_url": "https://vendor.example/product",
  "source_url": "https://vendor.example/affiliate-terms",
  "price_label": "See vendor",
  "tags": ["SEO", "analytics"],
  "featured": false,
  "verified_at": "2026-10-24"
}
```

The affiliate URL must be the actual tracking destination from a program that has approved the account. Verify country eligibility, payout method, disclosure requirements, and current terms before publishing.

## Test checklist

- [ ] `GET /api/health` returns `ok: true`.
- [ ] `GET /api/products` initially returns an empty array.
- [ ] Admin routes reject missing or invalid bearer tokens.
- [ ] Add one verified test offer using a local test database.
- [ ] Confirm search, filters, and product card rendering.
- [ ] Confirm a tracked click creates one `outbound_click` event and redirects to the configured destination.
- [ ] Restart the server and confirm products and events persist.
- [ ] Back up the SQLite database.

## Limitations and next steps

- This is a local-first implementation; it has not been deployed or runtime-tested in this change.
- Do not expose the local admin API to the public internet. A public production service needs HTTPS, rate limiting, stronger authentication, a production database, and secret management.
- SQLite on a serverless ephemeral filesystem is not durable. Do not deploy this backend to Vercel Functions expecting persistent local storage.
- Automatic OpenAffiliate synchronization, Huginn schedules, AI content generation, a discovery worker that pushes into the bridge, and verified conversion imports are not implemented yet.
- Clicks do not prove purchases. Only import actual network-reported conversions and commissions.
- The upstream projects are referenced as future adapters, not copied wholesale. Review their licenses before integrating code: [OpenAffiliate](https://github.com/Affitor/open-affiliate), [Huginn](https://github.com/huginn/huginn), [MoneyPrinterV2](https://github.com/FujiwaraChoki/MoneyPrinterV2).
- No earnings are guaranteed or claimed.
