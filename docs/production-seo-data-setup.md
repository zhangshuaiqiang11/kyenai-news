# Production SEO Data Setup

This checklist turns the local KyenAI MVP into a measurable production site. It covers the missing inputs that cannot be faked locally: real search-platform data, real user performance data, indexing submission, and off-site authority.

## 1. Domain and Public Identity

Set these before launch:

```env
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
NEXT_PUBLIC_EDITORIAL_EMAIL=editorial@your-production-domain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

The domain must match the verified Google Search Console and Bing Webmaster site. The editorial inbox should be monitored because correction requests, source disputes, and takedown requests are E-E-A-T signals in practice.

## 2. Search Console API

Use the Google Search Console API `searchanalytics.query` endpoint to import query/page metrics:

- Official docs: https://developers.google.com/webmaster-tools/v1/searchanalytics/query
- Required env for a service account: `GOOGLE_APPLICATION_CREDENTIALS`, `GSC_SITE_URL`
- Required env for an OAuth client JSON: `GOOGLE_APPLICATION_CREDENTIALS`, `GOOGLE_OAUTH_REFRESH_TOKEN`, `GSC_SITE_URL`
- Production mount env: `GOOGLE_APPLICATION_CREDENTIALS_HOST_PATH` points to the server-only JSON file, while `GOOGLE_APPLICATION_CREDENTIALS` points to the read-only path inside the backend container.
- Data to import: page, query, clicks, impressions, ctr, position, date, device, country
- Store as: `SearchMetric(source="gsc")`

If Google gives you a `client_secret_*.json` OAuth client file, do not commit it to the repository. Put it under `/opt/seo/secrets/` on the server, set `GOOGLE_APPLICATION_CREDENTIALS_HOST_PATH`, then run:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/to/client_secret.json GSC_SITE_URL=https://www.kyenai.com/ npm run audit:gsc -- --print-auth-url
```

Open the consent URL with a Google account that can access the verified Search Console property. Exchange the returned code with:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/to/client_secret.json GSC_SITE_URL=https://www.kyenai.com/ npm run audit:gsc -- --exchange-code=PASTE_CODE_HERE
```

Save the returned refresh token as `GOOGLE_OAUTH_REFRESH_TOKEN` in production. Without that refresh token, the OAuth client secret is present but Search Console data import is not yet live.

Recommended schedule: daily for the prior complete day, plus a weekly backfill for late-arriving data. Use this data to detect high-impression/low-CTR pages, positions 8-30, stale pages, and long-tail query opportunities.

## 3. GA4 Data API

Use GA4 Data API `runReport` for engagement and conversion-side context:

- Official docs: https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport
- Required env: `GOOGLE_APPLICATION_CREDENTIALS`, `GA4_PROPERTY_ID`, `NEXT_PUBLIC_GA_ID`; OAuth client credentials also require `GOOGLE_OAUTH_REFRESH_TOKEN`
- Frontend collection: the app loads GA4 only when `NEXT_PUBLIC_GA_ID` is set
- Web Vitals collection: the app reports LCP, CLS, INP, FCP, and TTFB events to GA4 via `reportWebVitals`

GA4 should not replace Search Console for ranking data. Use it to learn whether landing pages keep users engaged after search clicks.

## 4. Bing Webmaster and IndexNow

Use Bing Webmaster data to add non-Google search signals, and IndexNow to notify search engines when approved content changes:

- Bing Webmaster API docs: https://learn.microsoft.com/en-us/bingwebmaster/
- IndexNow docs: https://www.indexnow.org/documentation
- Required env: `BING_WEBMASTER_API_KEY`, `BING_SITE_URL`, `INDEXNOW_KEY`, `INDEXNOW_HOST`
- Store as: `SearchMetric(source="bing")`

IndexNow should run only after a real publish, rollback, or sitemap-affecting change. Do not submit URLs that failed validation or were not materially updated.

## 5. PageSpeed Insights and Core Web Vitals

Use PageSpeed Insights for repeatable lab checks and field data when available:

- PageSpeed API docs: https://developers.google.com/speed/docs/insights/v5/get-started
- Core Web Vitals docs: https://developers.google.com/search/docs/appearance/core-web-vitals
- Required env: `PAGESPEED_API_KEY`, `NEXT_PUBLIC_SITE_URL`

Run after deployment:

```bash
npm run audit:pagespeed
```

The script writes a JSON report to `artifacts/`. PageSpeed can test public URLs only; it will reject localhost and `.local` placeholders. Google Search Console Core Web Vitals depends on real Chrome user data, so a new site may show "not enough data" until enough real traffic exists.

## 6. Backlinks and Brand Mentions

Outbound entity links can be added inside KyenAI, but backlinks cannot be self-created from the same site. Real external authority comes from:

- original research, benchmarks, or teardown posts worth citing
- product docs or open-source examples that other developers reference
- guest posts, community writeups, newsletters, podcasts, and launch pages
- reputable directories or marketplace listings where the product is actually listed
- partnerships or integrations that create a legitimate reason for another site to mention the brand

Brand mentions inside KyenAI must remain factual. Mentioning OpenAI, ChatGPT, Anthropic, Claude Code, Microsoft, GitHub, Google, Gemini, xAI, or Grok is allowed when there is a real entity relationship or source context. Do not imply endorsement, sponsorship, certification, or partnership unless there is written proof.

## 7. AI Content Guardrail

Google does not ban AI-assisted content simply because AI helped produce it. The risk is low-value, scaled, misleading, or unsupported content. KyenAI's publishing path should keep blocking:

- unsupported claims
- fake freshness
- keyword stuffing
- generic template language
- rewritten source summaries without added value
- brand-name stuffing without a visible source or entity relationship

Useful content should add decisions, constraints, scope, source dates, and operational implications beyond the source.
