# KyenAI GSC Reserve Research - 2026-06-11

## Monitor Status

- Site: `https://www.kyenai.com`
- Run date: `2026-06-11`
- GSC status: no reliable data available
- `npm run audit:gsc` result:

```json
{
  "ok": false,
  "code": "missing_credentials_file",
  "message": "Google credentials file was not found: secrets/google-search-console-service-account.json"
}
```

- Credential/API status: blocked by missing local service-account JSON; no GSC clicks, impressions, query rows, or page rows were available.
- Node check: `bash scripts/run-node-script.sh --version` returned `v22.22.1`, which is above Node 20.
- Research mode: enabled because GSC data was unavailable and no prior reserve file existed for today.

## Existing KyenAI Pages Used For Link Planning

- `https://www.kyenai.com/guides/claude-code-hooks-mcp-setup`
- `https://www.kyenai.com/guides/secure-mcp-servers-ai-coding-agents`
- `https://www.kyenai.com/guides/claude-code-subagents-examples`
- `https://www.kyenai.com/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions`
- `https://www.kyenai.com/guides/codex-vs-claude-code`
- `https://www.kyenai.com/guides/agents-md-template-for-ai-coding-agents`
- `https://www.kyenai.com/guides/agent-governance-checklist-for-software-teams`

## Candidate Table

| Lane | Query | Intent | Keep/Drop | Why |
| --- | --- | --- | --- | --- |
| 1 | `claude code hooks vs mcp` | comparison | Drop | SERP already has current official and third-party comparisons. |
| 1 | `claude code hooks permissions` | troubleshooting/reference | Keep | SERP is noisy, partly off-target, and missing a practical permissions playbook. |
| 1 | `claude code mcp setup example` | tutorial/example | Keep | SERP is scattered across docs, YouTube, Reddit, and vendor-specific setups. |
| 2 | `mcp server security checklist` | checklist | Keep | Good material exists, but it is fragmented across spec docs, OWASP, GitHub lists, and vendor blogs. |
| 2 | `secure mcp server authentication` | reference/tutorial | Drop | Official spec/tutorials and current vendors already satisfy the generic query well. |
| 2 | `mcp tool permissions boundaries` | reference/checklist | Keep | SERP is polluted by AWS IAM meaning and fragmented MCP-specific terminology. |
| 3 | `agents.md best practices` | best-practices guide | Drop | Official `agents.md` plus strong recent GitHub/editorial coverage already serve the query. |
| 3 | `agents.md example repository` | examples/roundup | Keep | Searchers want real repos and annotated examples; SERP is only partially satisfying. |
| 3 | `ai coding agent instruction file checklist` | checklist | Keep | Intent is clear, but current results are spread across docs and vendor content instead of one neutral checklist. |
| 4 | `cursor rules vs copilot instructions` | comparison | Keep | Current results skew to forums and fragmented docs rather than one clear explainer. |
| 4 | `cursor rules examples` | examples/template | Keep | SERP mixes legacy `.cursorrules` with newer `.cursor/rules` and lacks a concise current example page. |
| 4 | `copilot repository instructions vs cursor rules` | migration/comparison | Drop | Better as a section within a broader comparison page. |
| 5 | `codex workflow for teams` | workflow guide | Drop | OpenAI already dominates with current workflow pages and team examples. |
| 5 | `ai coding agent workflow checklist` | checklist | Keep | Clear operator intent, but no single strong reusable checklist result. |
| 5 | `codex agents md example` | example/reference | Drop | OpenAI docs, `agents.md`, and real repo examples already satisfy this exact query. |
| 6 | `claude code subagents troubleshooting` | troubleshooting | Keep | SERP mixes docs, issues, Reddit, and videos without one fix-first page. |
| 6 | `claude code permissions explained` | explainer | Drop | Anthropic docs and a good secondary explainer already cover the broad query. |
| 6 | `claude code hooks not working` | troubleshooting | Keep | SERP is dominated by issues and forum threads, not a stable diagnosis guide. |
| 7 | `mcp server not showing tools fix` | troubleshooting | Keep | Cross-client issue, but SERP is mostly bug threads and narrow product docs. |
| 7 | `cursor rules not applying fix` | troubleshooting | Keep | Results are scattered across forum bugs and community workarounds. |
| 7 | `codex agents md not detected` | troubleshooting | Drop | OpenAI's official `AGENTS.md` troubleshooting already covers the core failure modes. |

## Dropped-Candidate Notes

- Broad comparison queries with strong current official support were not selected for reserve use: `claude code hooks vs mcp`, `codex workflow for teams`, `codex agents md example`, `claude code permissions explained`.
- Broad best-practice explainers also looked over-served: `agents.md best practices`, `secure mcp server authentication`.
- `copilot repository instructions vs cursor rules` is still useful, but only as a section inside a larger comparison page.
- `codex agents md not detected` is not a good reserve target unless narrowed to a sharper edge case such as `AGENTS.override.md` precedence or `CODEX_HOME` confusion.

## Pending Publication Briefs

All briefs below are `waiting for GSC validation`. Do not publish until GSC becomes reliable again.

### 1. MCP Server Security Checklist

- Status: `pending publication - waiting for GSC validation`
- Target query: `mcp server security checklist`
- Search intent: checklist
- Page type: operator checklist
- Opening direct answer: A safe MCP server needs five controls before rollout: server inventory, strong auth where applicable, per-tool boundaries, secret isolation, and runtime logging with approval gates for write actions.
- Required steps/tables/examples:
  - Hardening checklist table by control area: auth, tool exposure, secrets, logging, approval.
  - Example read-only vs write-capable tool classification table.
  - Minimal review cadence for third-party MCP servers.
  - Example incident checklist for prompt-injection and tool abuse.
- Common pitfalls:
  - Treating all MCP tools as equally safe.
  - Mixing auth guidance with tool-boundary guidance and skipping both in implementation.
  - Logging too little to reconstruct tool misuse.
- Internal links:
  - `https://www.kyenai.com/guides/secure-mcp-servers-ai-coding-agents`
  - `https://www.kyenai.com/guides/agent-governance-checklist-for-software-teams`
  - `https://www.kyenai.com/guides/claude-code-hooks-mcp-setup`

### 2. MCP Tool Permissions Boundaries

- Status: `pending publication - waiting for GSC validation`
- Target query: `mcp tool permissions boundaries`
- Search intent: reference/checklist
- Page type: practical reference
- Opening direct answer: MCP tool boundaries should be defined at the tool level, not only at the server level: decide which tools are visible, which are callable, which are read-only, and which require explicit approval.
- Required steps/tables/examples:
  - Terminology table mapping tool visibility, invocation permission, read/write scope, and approval gates.
  - Example policy matrix for read-only, write-limited, and admin tools.
  - Cross-vendor vocabulary table covering `permissions boundaries`, `deny policies`, and `read-write tool use`.
  - Concrete example of a safe default for an MCP client with mixed-risk tools.
- Common pitfalls:
  - Reusing cloud IAM language without translating it to MCP tool behavior.
  - Exposing all tools just because the server is trusted.
  - Forgetting discovery filtering and only controlling execution.
- Internal links:
  - `https://www.kyenai.com/guides/secure-mcp-servers-ai-coding-agents`
  - `https://www.kyenai.com/guides/agent-governance-checklist-for-software-teams`
  - `https://www.kyenai.com/guides/agents-md-template-for-ai-coding-agents`

### 3. AI Coding Agent Workflow Checklist

- Status: `pending publication - waiting for GSC validation`
- Target query: `ai coding agent workflow checklist`
- Search intent: checklist
- Page type: operational checklist
- Opening direct answer: A reliable coding-agent workflow is a repeatable loop: define scope, load repo instructions, limit files and tools, define proof of done, run verification, review the diff, and record rollback risk before merge.
- Required steps/tables/examples:
  - 10-12 step checklist from planning through verification and review.
  - Table showing where instruction files, MCP, tests, and approvals fit in the loop.
  - Example checklist for a small bug fix and a medium refactor.
  - Short section on when to keep work local vs delegate to subagents.
- Common pitfalls:
  - Treating a passing command as full review.
  - Skipping repo instruction files and safety boundaries.
  - Letting agents edit shared files without ownership boundaries.
- Internal links:
  - `https://www.kyenai.com/guides/codex-vs-claude-code`
  - `https://www.kyenai.com/guides/agents-md-template-for-ai-coding-agents`
  - `https://www.kyenai.com/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions`

### 4. Claude Code Hooks Not Working

- Status: `pending publication - waiting for GSC validation`
- Target query: `claude code hooks not working`
- Search intent: troubleshooting
- Page type: fix-oriented guide
- Opening direct answer: When Claude Code hooks fail, check four things first: the hook scope and event, executable path and permissions, the current Claude Code version, and whether the failure is specific to one hook type such as `PreToolUse` or `PostToolUse`.
- Required steps/tables/examples:
  - Diagnosis tree for hook registration, path resolution, event mismatch, and partial hook failure.
  - Minimal working hook example plus one broken example and why it fails.
  - Table of common symptoms mapped to likely root cause.
  - Verification steps for reproducing a working hook from a clean session.
- Common pitfalls:
  - Testing a complex hook before proving a minimal one works.
  - Confusing permission prompts with hook execution failure.
  - Overlooking shell path and executable permissions.
- Internal links:
  - `https://www.kyenai.com/guides/claude-code-hooks-mcp-setup`
  - `https://www.kyenai.com/guides/secure-mcp-servers-ai-coding-agents`
  - `https://www.kyenai.com/guides/claude-code-subagents-examples`

### 5. AGENTS.md Example Repository Roundup

- Status: `pending publication - waiting for GSC validation`
- Target query: `agents.md example repository`
- Search intent: examples/reference
- Page type: annotated roundup
- Opening direct answer: The fastest way to write a useful `AGENTS.md` is to study a few real repositories, then copy the parts that consistently help agents: repo purpose, working commands, file boundaries, and review rules.
- Required steps/tables/examples:
  - Annotated comparison table of real `AGENTS.md` examples by repo type.
  - Short “what to borrow / what to skip” notes for each example.
  - Template section showing how to adapt a real example into a smaller repo.
  - Section comparing root-level `AGENTS.md` with nested or tool-specific adapters.
- Common pitfalls:
  - Copying a large enterprise example into a small repo unchanged.
  - Keeping stale commands or environment assumptions from borrowed files.
  - Turning a repo example into a policy dump instead of an operator file.
- Internal links:
  - `https://www.kyenai.com/guides/agents-md-template-for-ai-coding-agents`
  - `https://www.kyenai.com/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions`
  - `https://www.kyenai.com/guides/codex-vs-claude-code`

## External Discovery Drafts

### Best First Move

- Recommendation: publish a short Dev.to draft about portable agent instructions plus MCP boundaries first, then reuse that language in README sections and selected community replies.

### Draft Opportunities

1. Dev.to short post
   - Angle: Stop rewriting prompts for every coding agent; keep one repo contract plus thin tool adapters.
   - Draft: Most teams do not need a different ruleset for every coding agent. They need one repo contract, one place for MCP assumptions, and a short adapter layer for tool-specific behavior. The useful split is shared engineering rules in `AGENTS.md`, task instructions in issues or PRs, and agent quirks kept as thin wrappers.

2. GitHub README `Agent Setup` section
   - Angle: list supported agents, canonical instruction file, and safe MCP boundaries.
   - Draft: This repo is designed to work with Codex, Claude Code, Cursor, and other MCP-capable coding agents. The canonical project instructions live in `AGENTS.md`; tool-specific files should stay minimal and point back to it. Prefer read-heavy MCP tools by default and document any write-capable tools with explicit safety notes.

3. Reddit reply in `r/ClaudeAI`
   - Thread: user-wide context file across Claude, Cursor, Codex, and Gemini.
   - Draft: The cleanest pattern is one canonical `AGENTS.md` in the repo, then tiny tool-specific files that point back to it. Keep coding standards, repo structure, and test commands in the shared file; keep tool quirks out of it. If you also use MCP, document the server purpose and safety constraints next to the repo so every agent sees the same boundary.

4. Hacker News comment
   - Thread: define AI coding tool configs once and sync them.
   - Draft: The part worth standardizing is the repo contract, not the full tool config. A shared `AGENTS.md` plus a tiny MCP compatibility section gets most of the benefit, while permissions, model choice, and UX settings stay tool-specific.

5. Directory blurb
   - Targets: `glama.ai`, `mcpservers.org`, and `punkpeye/awesome-mcp-servers`.
   - Draft: KyenAI helps coding agents gather external technical context with a bias toward structured, source-linked results. It is best suited for read-first research flows around repos, docs, and engineering decisions, with clear boundaries for any write or networked actions.

### Channels To Avoid

- Broad `best AI coding tool` debates on Reddit and HN.
- Generic self-promo in `r/cursor` and `r/OpenAI`.
- Low-signal directories with weak moderation or poor product-detail pages.

## Assumptions

- This run treated missing local GSC credentials as a no-reliable-data period.
- No PageSpeed run was needed because the task never produced live GSC or crawl signals pointing to a performance problem.
- SERP observations reflect live research completed on June 11, 2026 and may vary by locale or personalization.
- Reserve briefs were deliberately narrowed toward troubleshooting, examples, and checklists to avoid cannibalizing current KyenAI guides.

## Next Actions

- Restore the service-account file at `secrets/google-search-console-service-account.json` and rerun `npm run audit:gsc`.
- When GSC becomes available, validate whether the reserve targets align with early impressions/click patterns before publishing any brief.
- If one reserve item must move first without GSC, prioritize `mcp server security checklist` or `ai coding agent workflow checklist`; both show clear intent and relatively weak SERP consolidation.
