# KyenAI Live Site Audit — /guides Section & AI-Citability State

**Date:** 2026-06-27
**Target:** https://www.kyenai.com (production)
**Method:** `WebFetch` (rendered markdown) + raw `curl` with `Mozilla/5.0` UA for true HTTP status + raw `<head>` extraction (`rg` for `<title>`, `meta description`, `canonical`, `@type`, `<h1>`).
**Purpose:** Drive a code-optimization plan for the local Next.js repo (this workspace).

> **Cross-fetch note:** `WebFetch` returns an *identical homogenized shell* for `/`, `/guides`, `/about`, and every `/guides/*` sub-route (it appears to only see a shared JS-rendered landing layout, not per-page SSR content). All per-page metadata below was therefore captured from the **raw HTML served by curl** (`curl -A "Mozilla/5.0"`), which contains distinct, fully-populated `<head>` tags. Treat WebFetch body output as unreliable for this site; the raw-curl values are authoritative.

---

## Section A — Crawl / config files status

| File | HTTP (curl) | HTTP (WebFetch) | Notes |
|---|---|---|---|
| `/robots.txt` | **200** | timeout (retry 200) | Present, well-structured |
| `/sitemap.xml` | **200** | 500 (UA-specific) | Single flat urlset; no index |
| `/llms.txt` | **200** | 200 | Present, well-formed |
| `/feed.xml` | **200** | — | RSS exists |
| `/entities` | **200** | — | Entity ledger exists |
| `/editorial-policy` | **200** | — | Exists |
| `/sources` | **200** (in sitemap) | — | Exists |

### robots.txt summary
- **Open by default** to search + AI answer crawlers. Explicit comment: *"KyenAI is open to search engines and AI answer crawlers that respect robots.txt."*
- `User-agent: *` → `Allow: /`, `Allow: /api/og`, `Disallow: /api/`.
- **Explicitly allows** the major answer/retrieval bots: `Googlebot`, `Bingbot`, `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Perplexity-User`, `Claude-SearchBot`, `Claude-User`.
- **Training/research crawlers currently allowed**: `GPTBot`, `ClaudeBot`, `Google-Extended`, `Bytespider`.
- **No AI bot blocking.** This is AI-citability-positive.
- `Sitemap: https://www.kyenai.com/sitemap.xml` declared.
- ⚠️ Minor: rules are duplicated per-UA (verbose but harmless). No `Crawl-delay`.

### sitemap.xml URL list (32 URLs)
A single `<urlset>` (no sitemap index). Categories: homepage, info pages (`/about`, `/editorial-policy`, `/sources`, `/entities`, `/authors/editorial-automation-desk`), `/guides` index, **13 `/guides/*`** sub-routes, **11 `/articles/*`** news routes, and 1 category (`/categories/ai-coding-agents`).

**Notable:** `/sources` is in sitemap and returns 200, but is **not** linked from the homogenized WebFetch shell (only `/entities` is). `/authors/editorial-automation-desk` is in sitemap.

### llms.txt
Present and high quality. Contains:
- Site summary blockquote + canonical/guides/editorial-policy/entities/feed URLs.
- "Featured guides" (6) with full absolute URLs.
- "All guides" (13) with absolute URLs + one-line descriptions.
- "Citation guidance" section (prefer canonical URL; verify news against sources; no implied endorsement).

This is the **discovery source** used to enumerate the 13 guide sub-routes below.

### Missing config files (404)
- `/guides/<slug>.md` and `/guides/<slug>/index.md` → **404** (no markdown version of guides)
- `/llms-full.txt` → 404
- `/sitemap-0.xml`, `/sitemap-index.xml` → 404 (single sitemap only)
- `/.well-known/ai-plugin.json` → 404
- `/blog`, `/glossary`, `/articles` (as indexes) → **404**

---

## Section B — Homepage & /about status

### Homepage `/`
- **HTTP:** 200 (curl)
- **`<title>`:** `KyenAI | AI coding agent guides and evidence watch`
- **meta description:** `Source-backed guides for CLAUDE.md vs Copilot Instructions, loop engineering, MCP security, Codex vs Claude Code, and AI coding agent setup.`
- **canonical:** `https://www.kyenai.com`
- **JSON-LD @type:** `WebSite`, `Organization`, `ItemList` (+ `ListItem`, `ImageObject`, `ContactPoint`). *Not* `Person`/`ProfilePage`.
- **H1:** `AI Coding Agent Playbooks`
- **First-screen hero (verbatim):**
  > AI Coding Agent Playbooks
  > Source-backed guides for configuring, migrating, comparing, and securing AI coding agents.
  > Start with the guide that matches the decision in front of your team, then continue into setup and security.
- Followed by 2 CTAs linking into guides (CLAUDE.md support matrix; Loop Engineering).

### `/guides` index
- **HTTP:** 200
- **`<title>`:** `AI Coding Agent Decision Guides: AGENTS.md, Codex, MCP | KyenAI`
- **meta description:** `Choose instruction files, compare Codex and Claude Code, design agent loops, and secure MCP access with decision matrices and launch checklists.`
- **canonical:** `https://www.kyenai.com/guides`
- **H1:** `AI Coding Agent Guides`
- Lists all 13 guides with one-line descriptions.

### `/about`
- **HTTP:** 200
- **`<title>`:** `About KyenAI | KyenAI`
- **meta description:** `KyenAI explains its evidence-led AI coding agent playbooks, source standards, editorial automation workflow, and ranking-safe publication boundaries.`
- **canonical:** `https://www.kyenai.com/about`
- **H1:** `About KyenAI`

---

## Section C — Full `/guides/*` table (all 13, all 200)

| URL | Title | Meta Description | Canonical | JSON-LD @type | H1 | First ~150 words (summary) | Status |
|---|---|---|---|---|---|---|---|
| `/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions` | CLAUDE.md vs Copilot Instructions: Which File Copilot Reads \| KyenAI | Compare CLAUDE.md, .github/copilot-instructions.md, AGENTS.md, and Cursor rules by tool surface, scope, and safe sync policy. | self | Site/Org/TechArticle/FAQPage/Q&A/Breadcrumb | AGENTS.md vs CLAUDE.md vs Copilot Instructions: Which File Should You Use? | "CLAUDE.md vs Copilot Instructions is a surface question, not a universal filename rule. Use AGENTS.md for Codex, CLAUDE.md for Claude Code, .github/copilot-instructions.md for broad GitHub Copilot repository guidance, and .cursor/rules/*.mdc for current Cursor..." Answer-first, quotable. | 200 |
| `/guides/loop-engineering-ai-coding-agents` | What Is Loop Engineering? AI Agent Loops, Examples, Stop Rules \| KyenAI | Loop engineering designs repeatable AI agent loops around goals, tools, verification, retries, stop rules, and cost caps instead of one better prompt. | self | Site/Org/TechArticle/FAQPage/Q&A/Breadcrumb | What Is Loop Engineering for AI Coding Agents? | "Loop engineering for AI coding agents means designing the repeatable control loop around the agent, not writing one better prompt. Addy Osmani's loop engineering approach is useful context, but the practical repo loop is Plan → Act → Observe → Verify → Stop..." Cites Addy Osmani, Anthropic, Kilo. Strong answer-first. | 200 |
| `/guides/agents-md-template-for-ai-coding-agents` | AGENTS.md Template: Copyable Examples for Codex, Node.js, Python \| KyenAI | AGENTS.md template for Codex: copy Node.js, Python, and monorepo examples with test commands, forbidden files, safe edit boundaries, and review rules. | self | Site/Org/TechArticle/FAQPage/Breadcrumb | AGENTS.md Template: Practical Examples for Codex and Monorepos | Template-oriented; answer-first sentence defines what AGENTS.md template should contain. | 200 |
| `/guides/secure-mcp-servers-ai-coding-agents` | Secure MCP Server Connections to AI Agents: Auth, Scopes, Logs \| KyenAI | Review token audience, least privilege, secrets, network limits, approval gates, audit logs, and revocation before connecting AI agents to MCP servers. | self | Site/Org/TechArticle/FAQPage/Q&A/Breadcrumb | Secure MCP Server Connections to AI Agents | "Secure MCP server connections to AI agents before any tool can act. Validate authentication and token audience, avoid token passthrough, grant least-privilege read-only access first, block secrets and undeclared network destinations, log high-impact calls..." Quotable threat-model sentence. | 200 |
| `/guides/codex-vs-claude-code` | Codex vs Claude Code: Workflow Fit and Same-Repo Test Checklist \| KyenAI | Compare Codex and Claude Code by repo workflow, instruction files, review effort, MCP/hooks, and a same-task protocol before standardizing. | self | Site/Org/TechArticle/FAQPage/Q&A/Breadcrumb | Codex vs Claude Code | "Codex vs Claude Code is a workflow decision: choose Codex when OpenAI-native planning, code review, and shareable agent work fit your team; choose Claude Code when terminal-local memory, hooks, MCP servers, and subagents are part of daily engineering..." Comparison-style quotable answer. | 200 |
| `/guides/claude-code-hooks-mcp-setup` | Claude Code Hooks vs MCP Setup \| KyenAI | Compare Claude Code hooks, skills, and MCP with setup examples, hook-to-MCP boundaries, logs, troubleshooting, and security checks. | self | Site/Org/TechArticle/FAQPage/Breadcrumb | Claude Code Hooks vs MCP: Setup, Examples and Security | Setup-oriented; first para distinguishes hooks vs MCP boundaries. | 200 |
| `/guides/claude-code-subagents-examples` | Claude Code Subagents Workflow Examples \| KyenAI | Examples and checklists for using Claude Code subagents in research, implementation, review, and verification workflows. | self | Site/Org/TechArticle/FAQPage/Breadcrumb | Claude Code subagents workflow examples | Workflow-pattern oriented; quotable definition of subagent use. | 200 |
| `/guides/antigravity-cli-gemini-cli-migration` | Antigravity CLI Migration from Gemini CLI \| KyenAI | Checklist for migrating from Gemini CLI to Antigravity CLI, including commands, auth, hooks, extensions, and team docs. | self | Site/Org/TechArticle/FAQPage/Breadcrumb | Antigravity CLI migration from Gemini CLI | Migration checklist; answer-first migration scope. | 200 |
| `/guides/does-github-copilot-read-claude-md-support-matrix` | Does GitHub Copilot Read CLAUDE.md? Surface Matrix \| KyenAI | Check when GitHub Copilot reads CLAUDE.md, when to use copilot-instructions.md, and which Copilot surfaces need each file. | self | Site/Org/TechArticle/FAQPage/Q&A/Breadcrumb | Does GitHub Copilot Read CLAUDE.md? Support Matrix by Surface | Question-titled; answer-first mapping of Copilot surfaces. | 200 |
| `/guides/agents-md-examples-codex-node-python-monorepos` | AGENTS.md Examples for Codex, Node.js, Python \| KyenAI | Copy AGENTS.md examples for Codex projects, including Node.js apps, Python services, monorepos, nested files, commands, and review rules. | self | Site/Org/TechArticle/FAQPage/Breadcrumb | AGENTS.md Examples for Codex: Node.js, Python and Monorepos | Example-catalog; quotable per-stack guidance. | 200 |
| `/guides/agent-mode-vs-chat-mode-in-ide` | Agent Mode vs Chat Mode: Risks and Use Cases \| KyenAI | Compare agent mode vs chat mode by file edits, terminal commands, network risk, token cost, safe use cases, and stop rules. | self | Site/Org/TechArticle/FAQPage/Breadcrumb | Agent Mode vs Chat Mode: Differences, Risks and When to Use Each | Risk-framed comparison; quotable autonomy/scope distinction. | 200 |
| `/guides/local-vs-cloud-ai-coding-agent` | Local vs Cloud AI Coding Agents \| KyenAI | Compare local vs cloud AI coding agents by privacy, security, cost, speed, sandboxing, hybrid workflows, and team risk. | self | Site/Org/TechArticle/FAQPage/Breadcrumb | Local vs Cloud AI Coding Agents: Security, Cost and Speed Compared | Comparison; quotable privacy/cost tradeoff. | 200 |
| `/guides/agent-governance-checklist-for-software-teams` | AI Coding Agent Governance Checklist \| KyenAI | Use this AI coding agent governance checklist for permissions, logs, approval gates, prohibited actions, rollback, and emergency stop. | self | Site/Org/TechArticle/FAQPage/Breadcrumb | AI Coding Agent Governance Checklist: Permissions, Logs and Approvals | Checklist; quotable governance controls definition. | 200 |

**JSON-LD detail (guide pages):** Each guide carries a rich block set including `WebSite`, `Organization`, `WebPage`, `TechArticle`, `FAQPage` (with `Question`/`Answer` pairs), `BreadcrumbList`. This is strong for AI citation extraction — `FAQPage` + `Q&A` is exactly what LLM answer engines parse for featured-snippet/answer-card style content.

> Note: the earlier per-guide "JSON-LD@type: Organization,ImageObject,ContactPoint" lines came from a `head -3` truncation; the *full* set per guide is richer (verified on `loop-engineering`): `Answer, BreadcrumbList, ContactPoint, CreativeWork, FAQPage, ImageObject, ListItem, Organization, Question, TechArticle, Thing, WebPage, WebSite`.

**og: tags (verified on loop-engineering):** `og:title`, `og:description`, `og:type=website`, `og:url`, `og:site_name=KyenAI`, `og:image=https://www.kyenai.com/api/og?title=...` (1200×630 dynamic OG). Twitter card tags not yet verified — worth checking in repo.

---

## Section D — Blog / glossary URL status

| URL | HTTP | Note |
|---|---|---|
| `/glossary/loop-engineering` | **404** | Glossary section does not exist. `/glossary` index also 404. |
| `/glossary/ai-coding-agent` | **404** | Missing. |
| `/blog/what-is-loop-engineering-for-ai-coding-agents` | **404** | `/blog` section does not exist (`/blog` index also 404). |
| `/blog/codex-vs-claude-code-loop-engineering` | **404** | Missing. |

**Interpretation:** KyenAI currently has **no `/blog` and no `/glossary` routes at all**. The equivalent "definition" and "comparison" content lives exclusively under `/guides/*` (e.g., `/guides/loop-engineering-ai-coding-agents` is the de-facto glossary entry for "loop engineering"). Any AI-citation optimization plan that expected a `/blog/...` or `/glossary/...` URL shape will need to either (a) build those sections, or (b) redirect/intent-map the requested URLs to the existing `/guides/*` canonicals.

---

## Section E — Notable observations for AI citability

### Strengths (already AI-citation-positive)

1. **Answer-first, quotable guide openings.** Every sampled guide (`loop-engineering`, `agents-md-vs-claude`, `codex-vs-claude-code`, `secure-mcp`) opens with a single dense declarative sentence that directly answers the H1 question. This is the ideal format for LLM extraction (e.g., *"Loop engineering for AI coding agents means designing the repeatable control loop around the agent, not writing one better prompt."*).
2. **`FAQPage` + `Question`/`Answer` JSON-LD on guides.** This is the most directly citable schema shape for AI answer engines. Strong.
3. **`TechArticle` schema on guides.** Correct for evergreen technical content (vs `Article`).
4. **robots.txt explicitly opens AI answer crawlers** (`OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`/`Perplexity-User`, `Claude-SearchBot`/`Claude-User`) **and** training crawlers (`GPTBot`, `ClaudeBot`, `Google-Extended`). No AI blocking.
5. **`/llms.txt` exists and is high quality** — lists all 13 guides with absolute URLs and one-line descriptions. This is the #1 file LLM tooling reads for site orientation.
6. **Canonicals are clean and self-referential** on every guide (no trailing slash, no query dupes).
7. **Per-page metadata is fully differentiated in raw HTML** (distinct title/desc/canonical/H1 per guide). The homogenization only appears in WebFetch's rendered view, not in the served HTML.
8. **"Evidence-first / Cited sources visible / Editorial guardrails active" trust strip** renders at the top of every guide — good E-E-A-T signal.
9. **Cited sources named inline** (Addy Osmani, Anthropic, Kilo) with an `/entities` ledger and `/sources` page — strong provenance.

### Gaps & risks (drive the code plan)

1. **🚨 Organization JSON-LD email is a placeholder leak.** On the homepage (and repeated on every page via the shared Organization block):
   ```json
   "contactPoint":{"@type":"ContactPoint","email":"editorial@your-production-domain.com","contactType":"editorial corrections"}
   ```
   `your-production-domain.com` is a deploy-time placeholder that was never replaced. This is a real bug — likely a missing env var substitution in `SeoHead.tsx` or the org schema builder. **Fix in repo.**

2. **🚨 WebFetch returns an identical homogenized shell for every route** (`/`, `/guides`, `/about`, all `/guides/*`). While raw curl shows correct per-page SSR `<head>`, the *rendered body* seen by fetch-without-JS tooling collapses to a shared landing layout. This suggests either (a) the body content is client-rendered after hydration and WebFetch isn't executing the right path, or (b) a middleware/layout is intercepting. For AI crawlers that *do* execute JS this is likely fine, but for crawlers that read only the initial HTML the body is thin. **Worth verifying in repo whether guide body is SSR'd into the initial HTML or only hydrated client-side.**

3. **No markdown / `.md` version of guides.** `/guides/<slug>.md` and `/guides/<slug>/index.md` both 404. Providing a plain-markdown mirror (or a `Content-Type: text/markdown` variant) is a known AI-citability booster (Perplexity, ChatGPT browsing, Claude prefer clean markdown). Recommend a `Content-Type` negotiation or `?format=md` route, or at minimum ensure `llms-full.txt` aggregates full guide bodies.

4. **No `/llms-full.txt`.** The `/llms.txt` is index-only (links + one-liners). A `/llms-full.txt` that embeds the *full* markdown of all guides is increasingly the expected pattern for LLM ingestion. Missing.

5. **Sitemap is a single flat file (32 entries), no sitemap index.** Fine at current scale, but `/articles/*` and `/guides/*` are mixed in one urlset. As content grows, split into `sitemap-guides.xml`, `sitemap-articles.xml`, `sitemap-index.xml`. Also: sitemap lacks `<changefreq>` / `<priority>` (optional but helpful).

6. **WebFetch-specific 500 on `/sitemap.xml`** while curl gets 200 — indicates the sitemap route may be UA-gated or have a fetcher-specific code path. Low priority but worth a defensive check in the sitemap route handler (don't gate on UA).

7. **`/sources` is in sitemap (200) but not surfaced** in the homogenized WebFetch shell (only `/entities` is linked). Minor internal-linking gap.

8. **No `/blog` or `/glossary` sections exist.** If the AI-citation strategy expects "what is X" glossary pages or `/blog/` comparison posts, these need to be built — or the strategy reframed around the existing `/guides/*` canonicals (which already answer these queries well).

9. **Homepage H1 is `AI Coding Agent Playbooks`** — a category label, not a one-sentence definition of *what KyenAI is*. The hero subheading ("Source-backed guides for...") supplies the definition, but for AI citability the H1 itself isn't a self-contained "KyenAI is X" statement. Consider whether the brand-definition sentence should be the H1 or immediately follow it as the first crawlable `<p>`.

10. **Guide titles are SEO-optimized but H1s are longer/editorial.** E.g., title `What Is Loop Engineering? AI Agent Loops, Examples, Stop Rules | KyenAI` vs H1 `What Is Loop Engineering for AI Coding Agents?`. This is fine (title for SERP, H1 for body) but ensure the H1 question is also reflected in the `FAQPage.Question` strings for max citation overlap.

11. **OG image is dynamic via `/api/og?title=...`** — good. `robots.txt` correctly `Allow: /api/og`. Twitter card tags not verified in this pass — confirm `twitter:card=summary_large_image` in repo.

---

## Recommended code-plan hooks (for the local Next.js repo)

Based on the above, the local repo work should prioritize:

1. **Fix the Organization `contactPoint.email` placeholder** (`editorial@your-production-domain.com` → real address or remove the `email` field). Search `SeoHead.tsx` / the org-schema builder for `your-production-domain`.
2. **Verify SSR of guide body** — confirm `getStaticProps`/RSC streams the full guide body into initial HTML (not hydration-only), since WebFetch sees a homogenized shell.
3. **Add `?format=md` or `Accept: text/markdown` negotiation** for `/guides/*` to serve clean markdown for LLM ingestion.
4. **Add `/llms-full.txt`** aggregating full guide bodies as markdown.
5. **Add `twitter:card` meta** if missing in `SeoHead.tsx`.
6. **Split sitemap** into `sitemap-index.xml` + per-section sitemaps; add `<lastmod>` (already present), consider `<changefreq>`.
7. **Defensive UA handling on `/sitemap.xml`** route (don't 500 on any UA).
8. **Decide `/blog` vs `/glossary` strategy** — build the sections, or 301 the requested URLs to the existing `/guides/*` canonicals.
9. **Surfacelink `/sources`** in the site nav (it's sitemap-listed but not in the WebFetch-visible nav).

---

*End of audit. All values captured 2026-06-27 via curl (`Mozilla/5.0`) + WebFetch.*
