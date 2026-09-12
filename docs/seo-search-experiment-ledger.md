# SEO search experiment ledger

This ledger separates production release dates, article update dates, source verification dates, and measurement windows. A content update never implies that its sources were rechecked.

## Release calendar

The planned release date is 2026-09-13. If the production release occurs on another date, replace `R` with the actual production date and shift every observation window by the same number of days.

| Milestone | Planned date | Rule |
|---|---:|---|
| Production release (`R`) | 2026-09-13 | Record the deployed commit and public smoke-check result. |
| Index and crawl checks | 2026-09-13 to 2026-09-14 | Inspect each target URL once and request indexing once after a valid release. |
| Metadata freeze | 2026-09-14 to 2026-09-27 | Do not stack another title or H1 experiment unless there is a factual or technical defect. |
| Early check | 2026-09-28 | Directional only; do not declare a ranking win. |
| Primary comparison window | 2026-09-14 to 2026-10-11 | Compare against 2026-08-17 to 2026-09-13. |
| Primary review | 2026-10-14 to 2026-10-15 | Allow for Search Console reporting delay. |
| Low-sample comparison window | 2026-09-14 to 2026-11-08 | Use for pages or queries with sparse clicks. |
| Low-sample review | 2026-11-11 to 2026-11-12 | Decide whether to add authority, change intent, or stop expanding. |

## Experiment records

| ID | Page | Target query cohort | Baseline window | Planned release | Production release | Article updated | Sources verified | Freeze days | Review status |
|---|---|---|---|---:|---:|---:|---:|---:|---|
| `space-cursor-close-status-2026-09` | `/articles/spacex-cursor-acquisition-2026` | SpaceX Cursor acquisition status; did SpaceX buy Cursor | 2026-06-10 to 2026-09-09 | 2026-09-13 | pending | 2026-09-12 | 2026-09-12 | 14 | planned |
| `cursor-enterprise-security-2026-09` | `/articles/cursor-enterprise-organizations-governance` | cursor enterprise security; privacy mode; retention; permissions | 2026-06-10 to 2026-09-09 | 2026-09-13 | pending | 2026-09-12 | 2026-09-12 | 14 | planned |

## Measurement rules

- Compare page, query, country, and device cohorts with the same date length.
- Keep Query x Page attribution separate from editorial target mappings until a joint GSC export is available.
- Record clicks, impressions, CTR, average position, non-brand clicks, tool use, template copy, and resource download clicks.
- Do not interpret missing metrics as zero.
- Do not change a title because of one or two days of movement.
- Record any rollback as a new release event rather than overwriting the original experiment.
