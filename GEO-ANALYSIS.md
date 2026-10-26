# GEO Analysis - KyenAI Guides

Analyzed: 2026-06-26T07:40:53Z  
Scope: `https://www.kyenai.com/guides` and all 13 `/guides/*` routes.

## GEO Readiness Score

**Before fixes: 78/100**  
**After fixes: 88/100**

Platform breakdown after fixes:

| Platform | Score | Notes |
| --- | ---: | --- |
| Google AI Overviews | 89 | SSR pages, ItemList/TechArticle/FAQPage schema, question headings, tables, citations, and guide-level citation summaries are present. |
| ChatGPT Search | 87 | Static `llms.txt`, canonical guide map, methodology/disclosure blocks, and source-linked summaries improve extraction. Brand/entity presence outside the site remains limited. |
| Perplexity | 86 | Source-visible guide pages and comparison hub help citation; off-site community validation is still a gap. |

## AI Crawler Access Status

`robots.txt` allows public pages and explicitly allows major search/AI crawlers including `Googlebot`, `GoogleOther`, `OAI-SearchBot`, `ChatGPT-User`, `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Claude-SearchBot`, and `Bytespider`. Private `/api/` routes remain disallowed while `/api/og` is allowed.

## llms.txt Status

**P0 issue found:** live `https://www.kyenai.com/llms.txt` returned 404 during the audit, even though local code had a dynamic route.

**Fixed:** replaced the fragile dynamic page route with `frontend/public/llms.txt` as a static production fallback and expanded All guides entries from bare URLs to title-plus-summary links.

## Priority Findings and Fixes

| Priority | Finding | Fix |
| --- | --- | --- |
| P0 | Live `/llms.txt` was 404, blocking AI crawler guidance. | Added static `frontend/public/llms.txt`; removed dynamic `pages/llms.txt.tsx`; added tests. |
| P0 | User/AI typo route `/guide` returned 404 instead of reaching `/guides`. | Added permanent redirects for `/guide` and `/guide/:slug`. |
| P0 | All guide pages lacked 134-167 word self-contained citation passages. | Added SSR-visible `AI citation summary` blocks to `/guides` and every guide page. |
| P0 | Comparison pages lacked consistent methodology/disclosure context. | Added guide-level `Methodology and disclosure` blocks with source publishers and verification caveat. |
| P0 | `/guides` did not clearly expose comparison/matrix pages as a GEO hub. | Added a `Comparison pages` section with support matrix, workflow comparison, execution model, mode, and automation-control entries. |
| P1 | `llms.txt` All guides section listed only URLs. | Updated generator to output `[title](url): summary` entries. |
| P1 | Production tests did not protect GEO-specific blocks. | Added tests for static llms fallback, guide citation/methodology blocks, and guide redirects. |

## Passage-Level Citability

Post-build HTML verification found at least one optimal 134-167 word passage on every audited route:

- `/guides`
- `/guides/agent-governance-checklist-for-software-teams`
- `/guides/agent-mode-vs-chat-mode-in-ide`
- `/guides/agents-md-examples-codex-node-python-monorepos`
- `/guides/agents-md-template-for-ai-coding-agents`
- `/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions`
- `/guides/antigravity-cli-gemini-cli-migration`
- `/guides/claude-code-hooks-mcp-setup`
- `/guides/claude-code-subagents-examples`
- `/guides/codex-vs-claude-code`
- `/guides/does-github-copilot-read-claude-md-support-matrix`
- `/guides/local-vs-cloud-ai-coding-agent`
- `/guides/loop-engineering-ai-coding-agents`
- `/guides/secure-mcp-servers-ai-coding-agents`

## Server-Side Rendering Check

All audited guide routes render static HTML in `.next-build/server/pages`. Guide pages include visible H1, updated date, author link, quick answer, AI citation summary, methodology/disclosure, decision table content, FAQ blocks, and source links in server-rendered output.

## Schema Recommendations

Current schema is sound and conservative:

- `/guides`: `BreadcrumbList` + `ItemList`
- `/guides/*`: `TechArticle` + `BreadcrumbList` + `FAQPage`

Next schema improvement, not implemented in this pass: add carefully scoped `mentions` for comparison pages such as `Codex vs Claude Code` only when source coverage is strong enough, without introducing unsupported pricing or review claims.

## Remaining Gaps

- Brand/entity signals outside the site remain limited: Wikipedia, Reddit, YouTube, and LinkedIn presence were not strengthened in code.
- True live ChatGPT/Perplexity citation checks were not available without DataForSEO/AI visibility tooling.
- Comparison pages still need deeper source-verified feature/pricing matrices before publishing richer `SoftwareApplication` or product-style structured data.

## Verification

- `npm test --prefix frontend -- build-config guide-faqs-llms public-seo-copy robots sitemap seo`
- `npm test --prefix frontend -- public-seo-copy guide-faqs-llms build-config`
- `npm run build --prefix frontend`
- Post-build HTML audit confirmed citation block, methodology block, and schema presence across `/guides` and all `/guides/*` routes.
