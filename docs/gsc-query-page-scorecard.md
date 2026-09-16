# GSC Query × Page scorecard

`npm run audit:gsc-scorecard -- path/to/query-page.json` produces a read-only
Month 4 measurement report. It never calls Search Console and never fills
missing observations with zeroes.

The input must contain explicit Query × Page evidence. A separate query export
and a separate page export are not interchangeable with this dimension:

```json
{
  "metadata": {
    "property": "sc-domain:kyenai.com",
    "searchType": "Web",
    "startDate": "2026-09-09",
    "endDate": "2026-09-15",
    "dimensions": ["query", "page"],
    "hasQueryPageDimension": true,
    "requestedRowLimit": 25000,
    "returnedRowCount": 2,
    "sourceFile": "gsc-query-page-2026-09-15.json"
  },
  "rows": [
    {
      "query": "agents.md vs copilot-instructions.md",
      "page": "https://www.kyenai.com/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions",
      "clicks": 1,
      "impressions": 32,
      "ctr": 0.0312,
      "position": 11.53
    }
  ]
}
```

The scorecard recomputes CTR from clicks and impressions, uses impression-
weighted position, reports Top 3/5/10 and position 6–15 opportunities, flags
high-impression low-CTR rows, and lists possible query cannibalization. Query
and page mappings are accepted only when the canonical editorial target and the
canonical page cluster agree. Unknown or mismatched rows remain unmapped.

Pass additional `windows` entries for 7-, 14-, 28-, or 56-day snapshots to get
a descriptive stability view. Two windows do not establish causality; the
report labels that limitation explicitly.

The current 2026-09-15 archive has separate query/page/country/device tables and
no Query × Page export. It is therefore a control metadata snapshot, not an
attribution scorecard.
