# Editorial affiliate website prototype

This prototype adds a standalone, static editorial homepage at the repository root. It is deliberately separate from FastSEOHub and does not replace the Opportunity Engine packages.

## Files added

- `index.html` — responsive technology editorial homepage and reusable content sections.
- `styles.css` — responsive visual system, editorial cards, comparison framework, and reduced-motion support.
- `app.js` — accessible mobile navigation, topic filtering, client-side article search, and an explicit newsletter-demo message.

## Important current limitations

- Content in this first pass is sample editorial copy, not published research, product testing, or verified product recommendations.
- There are no live affiliate URLs, tracking pixels, retailer APIs, price feeds, email provider, or newsletter data collection.
- No product scores, live prices, sales, commissions, or conversion results are claimed.
- The site must not imply that a product was hands-on tested unless that testing actually took place.
- The existing Opportunity Engine logic and package configuration are intentionally untouched. The homepage is a presentation layer only; no integration with the engine is claimed yet.

## Local preview

Open `index.html` in a browser, or serve the repository root with a static HTTP server. Confirm the home page, mobile menu, topic filters, search, keyboard focus, and newsletter demo message.

## Validation and deployment

This branch has not been built or deployed in a runtime environment by this change. Before merging or deploying, run the existing repository checks (`npm test` and `npm run typecheck`) and inspect the static page in a browser at desktop and mobile sizes. Since the existing `package.json` does not define a website build command, verify the intended Vercel project and static-output behavior before connecting this root page to production. Do not merge this branch into `main` or deploy production until those checks pass.
