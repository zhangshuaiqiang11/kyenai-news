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

`pending` and `null` are intentional until a production deployment and matching
GSC export are recorded. The current title/description values are repository
copy; the old values and release evidence must be filled from the deployed
HTML, not reconstructed from memory.

| Experiment ID | Page | Cluster | Old title | Current title | Old description | Current description | Target queries | Release commit | Production release date | 14-day freeze | 28-day primary window | 56-day low-sample window | Decision | Failure reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `cursor-enterprise-security-2026-09` | `/articles/cursor-enterprise-organizations-governance` | `cursor-governance` | `pending` | `Cursor Enterprise Data Retention & Security: What Admins Must Verify` | `pending` | `Verify Cursor Enterprise Privacy Mode, ZDR exceptions, model and Cloud Agent retention, SSO/SCIM, MCP controls, audit evidence, and contract terms before rollout.` | cursor enterprise security; cursor privacy mode retention; cursor agent default retention | `pending` | `pending` | `pending` | `pending` | `pending` | `pending` | `pending` |
| `space-cursor-close-status-2026-09` | `/articles/spacex-cursor-acquisition-2026` | `cursor-market` | `pending` | `pending` | `pending` | `pending` | SpaceX Cursor acquisition status; did SpaceX buy Cursor | `pending` | `pending` | `pending` | `pending` | `pending` | `pending` | `pending` |
| `agents-comparison-2026-09` | `/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions` | `agent-instructions` | `pending` | `AGENTS.md vs copilot-instructions.md: Which File Should You Use?` | `pending` | `Compare AGENTS.md, copilot-instructions.md, CLAUDE.md, and Cursor rules by supported tool surface, scope, precedence, and safe sync policy.` | agents.md vs copilot-instructions.md; agents.md vs claude.md; copilot instructions vs cursor rules | `pending` | `pending` | `pending` | `pending` | `pending` | `pending` | `pending` |
| `agents-template-2026-09` | `/guides/agents-md-template-for-ai-coding-agents` | `agent-instructions` | `pending` | `AGENTS.md Template for Codex, Node.js, Python & Monorepos` | `pending` | `Copy, download, and validate a practical AGENTS.md template for Codex, Node.js, Python, and monorepos with nested instructions and safe generation boundaries.` | agents.md template; agents.md template for codex | `pending` | `pending` | `pending` | `pending` | `pending` | `pending` | `pending` |
| `loop-engineering-2026-09` | `/guides/loop-engineering-ai-coding-agents` | `agent-workflows` | `pending` | `Loop Engineering for AI Coding Agents: Stop Rules & Verification` | `pending` | `Design bounded Plan-Act-Observe-Verify-Stop loops with retry caps, proof-of-done checks, and explicit escalation rules.` | loop engineering; loop engineering in cursor; cursor loop engineering | `pending` | `pending` | `pending` | `pending` | `pending` | `pending` | `pending` |
| `mcp-discovery-2026-09` | `/guides/mcp-server-not-showing-tools` | `mcp-security` | `pending` | `MCP Server Connected but No Tools? 8 tools/list Checks` | `pending` | `MCP server connected but no tools? Diagnose initialize, tools/list, Inspector, client filters, refresh, authentication, and invocation in 8 checks.` | mcp server not showing tools; mcp server connected but no tools; mcp tools not appearing | `pending` | `pending` | `pending` | `pending` | `pending` | `pending` | `pending` |

## Measurement rules

- Compare page, query, country, and device cohorts with the same date length.
- Keep Query x Page attribution separate from editorial target mappings until a joint GSC export is available.
- Record clicks, impressions, CTR, average position, non-brand clicks, tool use, template copy, and resource download clicks.
- Do not interpret missing metrics as zero.
- Do not change a title because of one or two days of movement.
- Record any rollback as a new release event rather than overwriting the original experiment.
- Change one experiment family at a time: SERP metadata, above-fold answer, internal links, content increment, or external citation. Do not claim causality when several families moved in the same window.
