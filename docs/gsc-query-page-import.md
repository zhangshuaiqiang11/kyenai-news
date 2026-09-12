# GSC Query x Page Import

This runbook produces the missing joint Search Console dimension for the September 2026 SEO experiment. It is a maintenance export, not a replacement for the archived page, query, country, or device baselines.

## Preconditions

- Use a Google account with read-only access to `sc-domain:kyenai.com`.
- Keep the OAuth client JSON outside the repository.
- Do not commit a refresh token, client secret, or service-account key.
- Use a completed date window. Search Console data can lag, so do not treat the latest two days as final.

## Export

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/secure/path/client_secret.json
export GSC_SITE_URL=sc-domain:kyenai.com
export GOOGLE_OAUTH_REFRESH_TOKEN=your_refresh_token

npm run audit:gsc -- \
  --start=2026-08-13 \
  --end=2026-09-09 \
  --rows=25000 \
  > /tmp/kyenai-gsc-query-page-20260813-20260909.json
```

The JSON contains `dimensions: ["query", "page"]` and a complete `rows` array. Each row preserves `query`, `page`, `clicks`, `impressions`, `ctr`, and `position`. The API response is still subject to Search Console row limits; record the requested row limit and returned row count with the export.

## Review filter

Filter only after the export is saved:

```text
impressions >= 20
position <= 20
CTR < 1%
```

Map one intent to one primary page. Start with the six page groups recorded in `frontend/lib/search-baseline.ts`, and use the joint export to detect actual page conflict before creating or redirecting content. Do not infer Query x Page attribution by joining independent query and page CSV tables.

## Recordkeeping

Store the export outside git unless it is intentionally approved as a maintenance artifact. Record the property, search type, start and end dates, export date, row limit, returned row count, and any API error. Missing rows are unknown, not zero.
