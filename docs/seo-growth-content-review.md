# KyenAI priority content review

This ledger records the September 2026 on-site optimization pass. It is an editorial record, not a claim that a page or query will reach a particular rank.

## Priority pages

| Priority | Primary intent | Canonical path | Change in this pass | Evidence boundary |
| --- | --- | --- | --- | --- |
| P0 | Choose an instruction file | `/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions` | Reframed the title around `AGENTS.md` vs `copilot-instructions.md`, moved the decision table above the fold, and added a template action. | Product support is stated by surface and tied to current official documentation; the GSC mapping remains editorial because Query x Page was not exported. |
| P0 | Get an AGENTS.md template | `/guides/agents-md-template-for-ai-coding-agents` | Keep the page focused on copy, download, and validation for Codex, Node.js, Python, and monorepos. | Template output is locally tested; it is not represented as product certification. |
| P0 | Diagnose missing MCP tools | `/guides/mcp-server-not-showing-tools` | Reframed the title and first answer around the connected-but-empty `tools/list` symptom and linked the eight-check debugger. | Protocol claims use the MCP specification; product-specific behavior is kept separate. |
| P0 | Check Copilot CLAUDE.md support | `/guides/does-github-copilot-read-claude-md-support-matrix` | Keep the exact-question page surface-specific and separate from broad instruction-file comparison intent. | The support matrix is date-sensitive; unsupported surfaces are not inferred. |
| P1 | Review Cursor enterprise controls | `/articles/cursor-enterprise-organizations-governance` | Put the retention boundary in the title and answer: no universal default period; admins must verify model, feature, Cloud Agent, workspace, and contract terms. | Vendor claims are labeled as vendor-documented. Customer configuration and contracts still require verification. |
| P1 | Secure an MCP server | `/guides/secure-mcp-servers-ai-coding-agents` | Reframed the title and first answer around OAuth, token audience, least privilege, network and secret boundaries, and revocation. | Checklist controls are recommendations unless the protocol documentation defines the behavior. |

## Journey design

- Agent Instructions: choose the file, generate or copy a template, then run the instruction checker.
- MCP and security: diagnose tool discovery, apply the security checklist, then review enterprise governance controls.
- Homepage and `/guides` expose both journeys. Related-resource panels select the journey from the current page instead of sending every technical question to broad comparison content.

## Measurement contract

- The baseline scope and query-to-page map live in `frontend/lib/search-baseline.ts` and `docs/seo-growth-baseline.md`.
- `tool_use` is emitted only after an explicit user action. A visible tool is not counted as use.
- `template_copy` is emitted only after the clipboard operation succeeds.
- `resource_download_click` records a same-origin `/resources/` path after a click. It does not claim that the browser completed a download.
- Events contain only page, tool, action, and resource identifiers. User-entered content is not sent.
- If GA4 is missing, malformed, blocked, or throws an error, the tool continues to work.

## Verification contract

- Article `updatedAt` and source `verifiedAt` are independent fields.
- A missing source verification date remains `Verification needed`; it never falls back to the article date.
- The same source URL keeps separate verification state for every page that uses it.
- Every checked source records a conclusion and change note in the content data. Historical datasets retain their original sampling date and stated limitations.
- Recheck the six pages against official product documentation before changing volatile security, retention, permission, audit, or support claims.

## CTR experiment notes

- `frontend/lib/search-baseline.ts` keeps page and query metrics from the same exported window and adds `priorityIntentNotes` for editorial ownership.
- The target-query list is not a Query x Page report. Do not claim that an individual query caused a page click, template copy, debugger use, or security download.
- Compare complete 7-, 14-, 28-, and (for low samples) 56-day windows only after the revised pages are live. Keep one title/meta experiment family at a time.
- Calculate CTR as clicks divided by impressions for the same GSC row. Do not sum separate dimensions or average average-position values across pages.

## Observation window

Compare complete pre- and post-release 28-day windows for the priority pages, visible non-brand queries, and explicit tool actions. Keep the same page, query, country, and device dimensions. Extend low-sample comparisons to 56 days. The current export has no Query x Page table, so an editorial mapping must not be presented as observed attribution.
