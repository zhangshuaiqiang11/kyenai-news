# AI Coding Agent Instruction File Adoption Report — Q3 2026

Version: 2026-Q3
Snapshot date: 2026-07-19
Canonical record: https://www.kyenai.com/guides/ai-coding-agent-instruction-file-adoption-report-2026

## Cite this dataset

KyenAI. (2026). AI Coding Agent Instruction File Adoption Report — Q3 2026 (Version 2026-Q3) [Data set]. https://www.kyenai.com/guides/ai-coding-agent-instruction-file-adoption-report-2026

The dataset has no DOI. Use the canonical record URL above as its stable identifier.

## Reproduce the snapshot

1. Download `instruction-file-adoption-report-2026-q3-generator.mjs`.
2. Use Node.js 20 or newer and a GitHub token with public repository read access.
3. Run:

```bash
GITHUB_TOKEN=your_token node instruction-file-adoption-report-2026-q3-generator.mjs \
  --sample-size 100 \
  --snapshot-date 2026-07-19 \
  --output-dir ./instruction-adoption-output
```

GitHub search indexes and best-match ordering change over time. Re-running the same date label later does not recreate the historical index; it repeats the method against the current index. Preserve the downloaded JSON, CSV, manifest, and checksums when citing this snapshot.

## Measurement boundary

- The four GitHub query totals are indexed file-match counts, not unique repository counts or adoption rates.
- The content analysis uses the first 100 best matches per query and is not a random or statistically representative sample.
- Exact repository/path pairs are deduplicated within each query; a repository may appear in multiple query samples.
- Pattern detection reports visible text signals. It does not prove that a rule is correct, enforced, current, or absent elsewhere in a repository.

## Data files

- `instruction-file-adoption-report-2026-q3.json`: query totals, methodology, summaries, limitations, and all sampled rows.
- `instruction-file-adoption-report-2026-q3.csv`: analysis-ready sampled rows.
- `instruction-file-adoption-report-2026-q3-manifest.json`: version, media type, byte size, and SHA-256 digest for each core artifact.
- `instruction-file-adoption-report-2026-q3-sha256.txt`: checksums for independent integrity verification.
