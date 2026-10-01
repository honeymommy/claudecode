# Honey Mommy automation

Runs on GitHub Actions (`.github/workflows/automation.yml`). Only for the TopDawg Premier plan (API). Setup steps, in French: [`GUIDE-PREMIER.md`](GUIDE-PREMIER.md). Do not run it at the same time as Frooition.

| Command | What it does |
|---|---|
| `node src/run.js products` | TopDawg catalog → eBay listings (create, reprice, restock, zero out), writes `site/products.json` |
| `node src/run.js orders` | Paid eBay orders → TopDawg orders; TopDawg tracking → eBay |
| `node src/setup.js` | Creates the US-only eBay business policies, prints their IDs |
| `node src/ebay-auth.js url` / `code "<code>"` | One-time eBay OAuth consent → refresh token |
| `npm test` | Runs the whole flow against in-memory fake eBay/TopDawg |

`DRY_RUN` is on unless the variable is exactly `false`: nothing is listed, bought or marked shipped.

| File | Role |
|---|---|
| `config.js` | Business rules: markup, categories, banned items, order limits, TopDawg paths |
| `src/topdawg.js` | TopDawg client. Its API docs are private (Premier plan): adjust paths/fields here if they differ |
| `src/ebay.js` | eBay Inventory, Fulfillment, Account and Taxonomy APIs |
| `src/catalog.js` | Normalizes TopDawg products, picks what to sell |
| `src/sync-products.js` / `src/sync-orders.js` | The two jobs |
| `state/state.json` | Memory committed after each run (listings, forwarded orders, alerts raised) |
