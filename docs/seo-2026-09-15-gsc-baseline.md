# KyenAI GSC baseline — 2026-09-15

This is the frozen baseline for the one-week CTR sprint. It is based on the user-provided archive `kyenai.com-Performance-on-Search-2026-09-15.zip`, not on a live Search Console API connection.

## Page opportunities (latest 28-day view)

| Page | Impressions | Clicks | CTR | Average position | Sprint decision |
| --- | ---: | ---: | ---: | ---: | --- |
| `/articles/cursor-enterprise-organizations-governance` | 4,034 | 0 | 0.00% | 8.94 | Rewrite title/description, answer retention exceptions first |
| `/articles/spacex-cursor-acquisition-2026` | 1,720 | 0 | 0.00% | 7.22 | Put SEC closing date and source in the snippet promise |
| `/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions` | 1,083 | 13 | 1.20% | 7.78 | Protect; use as an internal-link hub |
| `/guides/agents-md-template-for-ai-coding-agents` | 1,027 | 8 | 0.78% | 16.52 | Protect metadata; improve copy/download path |
| `/guides/loop-engineering-ai-coding-agents` | 537 | 1 | 0.19% | 13.75 | Rewrite title/description and foreground proof/stop rules |
| `/guides/mcp-server-not-showing-tools` | 190 | 2 | 1.05% | 6.20 | Rewrite title/description around connected-but-empty tools |

CTR is the exported click count divided by exported impressions for the same row; average position is not additive and is not recomputed by averaging page rows.

## Measurement boundaries

- The archive has separate query, page, country, and device tables. It does not contain a Query × Page table, so query-to-URL attribution and cannibalization remain unknown.
- The query export contains 932 rows and must be treated as a limited report, not the complete query universe. Google omits anonymized queries from query tables and applies reporting limits; page/country/device totals will not necessarily reconcile with query totals.
- A zero-click page at position 7–9 is a CTR/snippet hypothesis, not proof that Google or users rejected the page. Validate the live SERP, selected canonical, indexing state, and result features after deployment.
- The baseline does not prove causality, ranking eligibility, or a top-three outcome. It is the control cohort for the next 14-day title/description freeze and 28-day primary comparison.

## Required follow-up export

After deployment, export each target URL with the same date range and filters, then run the existing `npm run audit:gsc` probe for `query,page` when credentials are available. Record the export date, returned row count, filters, and whether the result is still subject to anonymization or row limits.

