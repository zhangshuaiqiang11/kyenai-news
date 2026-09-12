# KyenAI priority content review

This ledger records the September 2026 on-site optimization pass. It is an editorial record, not a claim that a page or query will reach a particular rank.

## Priority pages

| Priority | Primary intent | Canonical path | Change in this pass | Evidence boundary |
| --- | --- | --- | --- | --- |
| P0 | Choose an instruction file | `/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions` | Moved the direct selection answer, support matrix, and migration path forward. | Product support is stated by surface and tied to current official documentation. |
| P0 | Get an AGENTS.md template | `/guides/agents-md-template-for-ai-coding-agents` | Shortened the path to the builder and verified deterministic Node.js, Python, and monorepo outputs. | Template output is locally tested; it is not represented as product certification. |
| P0 | Diagnose missing MCP tools | `/guides/mcp-server-not-showing-tools` | Added symptom-led diagnosis and a crawlable minimal `tools/list` reproduction beside the existing debugger. | Protocol claims use the MCP specification; product-specific behavior is kept separate. |
| P0 | Check Copilot CLAUDE.md support | `/guides/does-github-copilot-read-claude-md-support-matrix` | Clarified the surface-specific answer and separated it from the broad comparison intent. | The support matrix is date-sensitive; unsupported surfaces are not inferred. |
| P1 | Review Cursor enterprise controls | `/articles/cursor-enterprise-organizations-governance` | Updated Privacy Mode, retention, permission, and audit caveats; retained the existing control matrix and download. | Vendor claims are labeled as vendor-documented. Customer configuration and contracts still require verification. |
| P1 | Secure an MCP server | `/guides/secure-mcp-servers-ai-coding-agents` | Strengthened authentication, least privilege, revocation, failure handling, and troubleshooting links. | Checklist controls are recommendations unless the protocol documentation defines the behavior. |

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

## Observation window

Compare complete pre- and post-release 28-day windows for the priority pages, visible non-brand queries, and explicit tool actions. Keep the same page, query, country, and device dimensions. Extend low-sample comparisons to 56 days. The current export has no Query x Page table, so an editorial mapping must not be presented as observed attribution.
