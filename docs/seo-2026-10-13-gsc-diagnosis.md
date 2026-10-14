# KyenAI GSC diagnosis — 2026-10-13 export

## Scope and evidence boundary

- Property: `sc-domain:kyenai.com`
- Search type: Web (text-based)
- Current window: 2026-09-13 through 2026-10-10
- Export filter summary: Search type `Web (text-based)`; date preset `Previous 28 days`; no other filter listed
- Source archive: `kyenai.com-Performance-on-Search-2026-10-13.zip`
- SHA-256: `e7eb1f10306b997182a2c918b0c944af0c071dfb48ce1516ed048bcabdbaf682`
- Current data rows: date 28, query 255, page 37, country 121, device 3, search appearance 0
- Comparison archive: `kyenai.com-Performance-on-Search-2026-09-15.zip`
- Comparison SHA-256: `5eff1681a098fde5bc454f9d935b8a55c9afb47836180184669045ff2c773011`

The archives contain separate query, page, country, and device tables. They do not contain Query x Page data. Do not join the independent tables to claim which query produced a page click, diagnose cannibalization, or attribute a change to a release. The October query table contains only 4 of 34 clicks and 947 of 6,456 impressions; it is not a complete query inventory.

## What changed

| Metric | September export current period | October export | Change |
| --- | ---: | ---: | ---: |
| Clicks | 37 | 34 | -8.1% |
| Impressions | 12,915 | 6,456 | -50.0% |
| CTR | 0.286% | 0.527% | +0.241 percentage points |
| Impression-weighted position | about 20.38 | about 9.51 | date-table weighted average; mix-adjusted, not a same-query rank change |

The October date-table average position is 9.5066 when weighting its 28 daily positions by that day's impressions. The separately aggregated page table gives 9.4888 across 37 URLs and 6,560 impressions. The top-level click, impression, CTR, and position figures in the comparison use the date table consistently; page rows are used only for page prioritization.

The exposure loss is real, but it is not a matching traffic collapse. Clicks fell by three while roughly half of the impressions disappeared. The comparison period contained a large volume of low-click exposure, so the higher October CTR and better average position are partly selection effects.

Within the October window, the first 14 days produced 20 clicks from 3,699 impressions and the last 14 days produced 14 clicks from 2,757 impressions. The latest seven days were nearly flat against the preceding seven days: 1,373 versus 1,384 impressions, with seven clicks in each period. The sharp decline has therefore plateaued around 196 impressions per day in the latest complete week.

## Page contribution

Page totals are directional because GSC aggregates the page dimension separately from the property total.

| Page | Previous impressions | Current impressions | Click change | Position change | Interpretation |
| --- | ---: | ---: | ---: | ---: | --- |
| Cursor Enterprise governance | 4,034 | 890 | 0 to 0 | 8.94 to 11.80 | Largest exposure loss; previous visibility produced no clicks and was concentrated in retention-related query variants. |
| AI coding agents comparison | 1,047 | 268 | 0 to 0 | 44.59 to 21.57 | Broad visibility contracted while relevance improved; still outside the main click zone. |
| AGENTS.md template | 1,027 | 311 | 8 to 0 | 16.52 to 7.05 | Highest-priority CTR loss because the page now ranks in the first page but stopped earning clicks. |
| Guides index | 861 | 223 | 0 to 0 | 62.51 to 15.27 | Low-value index-page exposure contracted; improve discovery paths, not the generic title alone. |
| SpaceX–Cursor status | 1,720 | 1,359 | 0 to 0 | 7.22 to 6.75 | High visibility and no clicks; freshness and SERP promise need ongoing verification. |
| MCP no-tools guide | 190 | 564 | 2 to 7 | 6.20 to 5.79 | Strongest healthy growth; protect the URL and expand symptom coverage without changing its core intent. |
| Instruction-file comparison | 1,083 | 1,450 | 13 to 14 | 7.78 to 6.76 | Main durable winner; impressions rose faster than clicks, leaving a title/snippet opportunity. |

The first five declining pages account for about 87% of the property-level impression loss on a directional basis. The Cursor Enterprise page alone accounts for about 49%.

## Query, country, and device cautions

- The visible AGENTS.md versus Copilot variants grew from 35 impressions and one click to 278 impressions and three clicks, while visible-query CTR fell from 2.86% to 1.08%.
- The largest visible October query is the error string `execution failed: failed to refresh mcp tools for server github-mcp-server; the last catalog is stale`: 118 impressions, zero clicks, position 7.66. Cover the symptom directly, but do not stuff the whole error into the title.
- Cursor default-retention variants fell from 288 visible impressions to 32 and never produced a visible click. Do not attempt to restore the old quoted-query spike at the expense of accurate enterprise guidance.
- The United States explains roughly 61% of the property impression decline, but US clicks increased from 5 to 13. Desktop explains roughly 86% of the impression decline, while desktop clicks moved only from 33 to 30.
- Mobile impressions fell from 1,285 to 351 and position worsened from 9.09 to 13.38; this is the clearest device cohort to monitor separately.

## Decisions

1. Do not roll back the September release on this evidence. The current live crawl has no technical regression, and the GSC archive cannot establish release causality.
2. Run a title/meta experiment on the AGENTS.md template and main instruction-file comparison pages. Freeze the experiment for 14 days and use 28 days for the primary decision.
3. Preserve the MCP troubleshooting URL and add a direct stale-catalog/refresh diagnostic section.
4. Refresh the Cursor Enterprise page with current official product changes, but do not promise a universal retention period.
5. Add one focused, current guide explaining the new agent-harness layer across model, editor, ACP/MCP, review, and delivery. Treat Harness (the company) and a generic agent harness as different concepts; treat Jev as an optional bounded decision signal, not an editor or execution authority.
6. Request a genuine Query x Page export for the next review. Until then, every query-to-page mapping remains editorial, not observed attribution.

## October 14 implementation follow-up

- Added the October 13 archive as a distinct observation snapshot in `frontend/lib/search-baseline.ts`; historical baselines remain immutable. The snapshot now labels the date table as its metric basis, keeps per-dimension row counts separate, and leaves the aggregate row count null because the archive contains multiple tables.
- Changed only the AGENTS.md template SERP title and description because its page row showed 311 impressions, zero clicks, and position 7.05. The H1 and visible-content date were not changed for this snippet test.
- Added `/guides/harness-engineering-for-ai-coding-agents` as a forward-looking editorial acquisition test. Harness/Jev terms did not appear in the visible October query rows; the new guide is not a recovery explanation or a guaranteed traffic source.
- Added current VS Code harness distinctions, a loop-versus-harness explanation, and dated Cursor Enterprise workflow information checked against official sources on October 14. Remote Control, Rollouts, and Security Review are separate workflow controls; none establishes a universal retention period.
- The harness, comparison, loop, and Cursor content additions ship together, so their results are a bundled content increment. The template metadata change is tracked separately but remains observational, not causal proof.
- Production commit/date, crawl recheck, and the 14/28/56-day review windows remain pending until production deployment is confirmed.

## Measurement dates

- Early direction: 14 days after the confirmed production deployment timestamp, after the snippet freeze.
- Primary comparison: 28 complete days after production deployment of this release.
- Low-sample pages: 56 complete days.

Record production commit and production timestamp separately from `updatedAt`. Compare identical search type, country, device, page, and query filters; never average average-position rows without impression weighting.
