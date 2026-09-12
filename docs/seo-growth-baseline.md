# KyenAI search growth baseline

This baseline preserves the scope of the Google Search Console export used for the September 2026 optimization cycle. The raw export is archived at `artifacts/gsc/kyenai.com-Performance-on-Search-2026-09-12.zip`.

- Property: `sc-domain:kyenai.com`
- Search type: Web
- Period: 2026-06-10 through 2026-09-09
- Exported: 2026-09-12
- Daily/device total: 97 clicks, 25,271 impressions, 0.38% CTR
- Page-table total: 97 clicks, 26,171 impressions; dimension totals do not reconcile with the daily/device export and are used for prioritization only.
- Query export: 1,000 parsed rows and 3,517 impressions; it is row-limited and is not a site total.
- Search appearance export: no usable data rows.
- Source file: `kyenai.com-Performance-on-Search-2026-09-12.zip`

The export contains separate query, page, country, and device tables. It does not contain a Query x Page table. `frontend/lib/search-baseline.ts` therefore keeps observed page metrics, observed query metrics, and editorial query-to-page targets as distinct fields. A missing metric is `null`, never zero. The page and query tables are not added to the daily total because Search Console dimensions can be row-limited and the supplied exports do not reconcile.

The eight priority URLs cover Agent Instructions, MCP/security, Cursor market coverage, and loop workflows. The strongest immediate opportunities are SpaceX/Cursor (5,884 impressions, position 7.44, 0.07% CTR), Cursor Enterprise (5,278 impressions, position 11.18, 0% CTR), and Loop Engineering (2,073 impressions, position 13.49, 0.29% CTR). Protect the AGENTS comparison page (2,937 impressions, position 8.98, 1.33% CTR) and MCP troubleshooting page (439 impressions, position 6.82, 2.51% CTR).

Compare complete 28-day windows after the production release; use 56 days where the sample is too small. Compare the same page, query, country, and device dimensions rather than the site-wide average alone. The previous 2026-06-06 through 2026-09-05 export remains a historical baseline and must not be treated as the same window.
