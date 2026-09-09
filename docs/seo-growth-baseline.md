# KyenAI search growth baseline

This baseline preserves the scope of the Google Search Console export used for the September 2026 optimization cycle.

- Property: `sc-domain:kyenai.com`
- Search type: Web
- Period: 2026-06-06 through 2026-09-05
- Exported: 2026-09-07
- Site total: 98 clicks, 23,318 impressions, 0.42% CTR
- Source file: `kyenai.com-Performance-on-Search-2026-09-07.zip`

The export contains separate query, page, country, and device tables. It does not contain a Query x Page table. `frontend/lib/search-baseline.ts` therefore keeps observed page metrics, observed query metrics, and editorial query-to-page targets as distinct fields. A missing metric is `null`, never zero.

The six priority URLs cover Agent Instructions and MCP/security. Compare complete 28-day windows after release; use 56 days where the sample is too small. Compare the same page, query, country, and device dimensions rather than the site-wide average alone.
