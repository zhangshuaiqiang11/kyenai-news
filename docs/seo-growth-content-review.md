# KyenAI priority content review

This ledger records the September 2026 on-site optimization pass and the October 14, 2026 follow-up. It is an editorial record, not a claim that a page or query will reach a particular rank.

## Priority pages

| Priority | Primary intent | Canonical path | Change in this pass | Evidence boundary |
| --- | --- | --- | --- | --- |
| P0 | Choose an instruction file | `/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions` | Reframed the title around `AGENTS.md` vs `copilot-instructions.md`, moved the decision table above the fold, and added a template action. | Product support is stated by surface and tied to current official documentation; the GSC mapping remains editorial because Query x Page was not exported. |
| P0 | Get an AGENTS.md template | `/guides/agents-md-template-for-ai-coding-agents` | Keep the page focused on copy, download, and validation for Codex, Node.js, Python, and monorepos. | Template output is locally tested; it is not represented as product certification. |
| P0 | Diagnose missing MCP tools | `/guides/mcp-server-not-showing-tools` | Reframed the title and first answer around the connected-but-empty `tools/list` symptom and linked the eight-check debugger. | Protocol claims use the MCP specification; product-specific behavior is kept separate. |
| P0 | Check Copilot CLAUDE.md support | `/guides/does-github-copilot-read-claude-md-support-matrix` | Keep the exact-question page surface-specific and separate from broad instruction-file comparison intent. | The support matrix is date-sensitive; unsupported surfaces are not inferred. |
| P1 | Review Cursor enterprise controls | `/articles/cursor-enterprise-organizations-governance` | Put the retention boundary in the title and answer: no universal default period; admins must verify model, feature, Cloud Agent, workspace, and contract terms. | Vendor claims are labeled as vendor-documented. Customer configuration and contracts still require verification. |
| P1 | Secure an MCP server | `/guides/secure-mcp-servers-ai-coding-agents` | Reframed the title and first answer around OAuth, token audience, least privilege, network and secret boundaries, and revocation. | Checklist controls are recommendations unless the protocol documentation defines the behavior. |
| P0 | Improve AGENTS.md template SERP clicks | `/guides/agents-md-template-for-ai-coding-agents` | Changed only the SERP title and description to make copy/download/validate utility explicit; left the on-page heading and substantive guide date unchanged for this snippet-only test. | October GSC page row: 311 impressions, 0 clicks, average position 7.05; separate page dimension, not query-attributed. Production start and 14-day freeze remain pending. |
| P1 | Explain current agent harness architecture | `/guides/harness-engineering-for-ai-coding-agents` | Added a guide separating model, agent, harness, decision model, verification, and delivery; covers editing/IDE workflows, Jev limits, and deterministic gates. | New-URL acquisition hypothesis; no Harness/Jev query was visible in the 255-row query export. Do not call it the cause of the traffic decline. |
| P1 | Refresh workflow and enterprise facts | `/guides/loop-engineering-ai-coding-agents`, `/guides/ai-coding-agents-comparison`, `/articles/cursor-enterprise-organizations-governance` | Added the loop-versus-harness distinction, current IDE harness distinctions, and dated Cursor Enterprise workflow controls for Remote Control, Rollouts, and Security Review. | Cursor claims are vendor-documented, checked Oct 14; retention exceptions remain, and these features do not establish a universal default retention period. Content changes are bundled. |

## Journey design

- Agent Instructions: choose the file, generate or copy a template, then run the instruction checker.
- MCP and security: diagnose tool discovery, apply the security checklist, then review enterprise governance controls.
- Homepage and `/guides` expose both journeys. Related-resource panels select the journey from the current page instead of sending every technical question to broad comparison content.

## Measurement contract

- The baseline scope and query-to-page map live in `frontend/lib/search-baseline.ts` and `docs/seo-growth-baseline.md`.
- The October 13 export reports 34 clicks / 6,456 impressions for Sep 13–Oct 10. Its query table contains only 4 clicks / 947 impressions and is not a complete query inventory.
- The template page's separate GSC page row shows 311 impressions, zero clicks, and position 7.05. The new title/description is a CTR hypothesis and has not yet been measured in production.
- The harness guide's watch queries are editorial targets, not observed search demand until a later GSC query export shows them.
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

For the October 14 release, record the actual production timestamp and deployed commit before calculating the freeze or review dates. If production deploys later, shift every window by that delay. Treat 7-day movement as directional, use at least 14 days for the snippet check, 28 days for the primary CTR decision, and 56 days for sparse pages.
