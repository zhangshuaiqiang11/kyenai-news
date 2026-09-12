import type { Article, Guide } from "./types";
import { expansionGuides } from "./guide-expansion";
import {
  INSTRUCTION_COMPARISON_GUIDE_SLUG,
  MCP_SECURITY_GUIDE_SLUG,
  MCP_TOOL_DISCOVERY_GUIDE_SLUG,
} from "./guide-routes";

const coreGuides: Guide[] = [
  {
    id: "guide-agent-instructions-comparison",
    title: "AGENTS.md vs CLAUDE.md vs Copilot Instructions: Which File Should You Use?",
    slug: INSTRUCTION_COMPARISON_GUIDE_SLUG,
    summary:
      "Use this support matrix to decide whether CLAUDE.md, Copilot instructions, AGENTS.md, or Cursor rules should carry repository guidance for each tool surface.",
    intent:
      "Choose compatible instruction files, migrate Cursor rules carefully, and test AI coding tools without unsupported benchmark claims.",
    audience: "Developer tools teams, staff engineers, platform teams, and AI coding adopters.",
    pageType: "Evidence-backed compatibility guide",
    secondaryKeywords: [
      "AGENTS.md vs CLAUDE.md",
      "AGENTS.md open standard",
      "GitHub Copilot CLAUDE.md support",
      ".github/copilot-instructions.md",
      ".cursor/rules MDC migration",
      "AI coding agent instruction files",
    ],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "AGENTS.md vs CLAUDE.md is a reader-support question, not a choice between interchangeable filenames. Use AGENTS.md for Codex and as an open shared policy for other documented readers; use CLAUDE.md for Claude Code, where it can import @AGENTS.md; use .github/copilot-instructions.md for broad GitHub Copilot repository guidance; and use .cursor/rules/*.mdc for current Cursor project rules. GitHub Copilot support for CLAUDE.md depends on the Copilot surface: selected cloud-agent surfaces and Copilot CLI support it, while many Copilot Chat and code-review surfaces do not. No single filename is a universal baseline across every agent surface.",
        ],
      },
      {
        heading: "Which instruction file should each tool use?",
        body: [
          "Choose the file by the tool that must read it, not by the wording you prefer. The official AGENTS.md project describes an open format used across a growing coding-agent ecosystem, while each product still documents its own discovery behavior. Codex documents AGENTS.md for repository instructions. Claude Code documents CLAUDE.md as project memory. GitHub documents .github/copilot-instructions.md as the broad repository-wide Copilot instructions file. Cursor documents project rules under .cursor/rules/*.mdc.",
          "A repository can keep the same policy language synchronized across those files, but no single filename is the universal reader for all four tools. Treat each file as a small adapter for the surface that actually loads it.",
        ],
      },
      {
        heading: "Copilot compatibility varies by surface",
        body: [
          "GitHub's support matrix lists CLAUDE.md for selected cloud-agent surfaces and Copilot CLI, while many Copilot Chat and code-review surfaces do not list it. That makes CLAUDE.md a surface-specific Copilot input, not a safe universal Copilot baseline.",
          "Use the dedicated Copilot surface matrix linked on this page for the exact environment-by-environment answer. For broad repository coverage, keep .github/copilot-instructions.md for Copilot and CLAUDE.md for Claude Code.",
        ],
      },
      {
        heading: "CLAUDE.md vs AGENTS.md: What Is the Difference?",
        body: [
          "AGENTS.md is a simple open Markdown format for coding-agent instructions and is the documented repository instruction file for Codex, including directory-scoped guidance and precedence. The official AGENTS.md project says the format is used by more than 60,000 open-source projects and is stewarded by the Agentic AI Foundation under the Linux Foundation. CLAUDE.md is the documented project memory file for Claude Code.",
          "Use AGENTS.md as a shared baseline only for tools and surfaces that document loading it. Use CLAUDE.md for Claude Code memory, workflows, and project context; when appropriate, a short CLAUDE.md can import @AGENTS.md. Keep shared facts synchronized, but do not assume every tool implements the same discovery order, nesting, or precedence.",
        ],
      },
      {
        heading: "What Do Public AGENTS.md and CLAUDE.md Files Commonly Miss?",
        body: [
          "KyenAI's July 19 GitHub snapshot analyzed 100 readable best-match AGENTS.md files and 100 readable best-match CLAUDE.md files. The detector found no explicit security or approval rule in 68% of the AGENTS.md sample and 62% of the CLAUDE.md sample. It found no verification or completion criteria in 53% and 58%, respectively. These percentages describe the non-random samples, not all repositories.",
          "A separate June 2026 preprint analyzed 100 popular repositories and cataloged six instruction-file configuration smells. It reported lint leakage in 62% of files, context bloat in 42%, and skill leakage in 35%. The study uses different sampling and definitions from KyenAI's dataset, so treat the results as complementary warnings rather than numbers to combine.",
        ],
      },
      {
        heading: "Does Cursor Support AGENTS.md?",
        body: [
          "Yes. Cursor documents a root-level AGENTS.md as a simple project-wide alternative to .cursor/rules, and Cursor CLI documents reading both root AGENTS.md and CLAUDE.md alongside Cursor project rules. This support is surface-specific: the cited IDE page limits AGENTS.md to the project root, while the CLI page explicitly names both root files.",
          "Use .cursor/rules/*.mdc when you need metadata, path scoping, or several focused rules. Use root AGENTS.md when one readable shared policy is enough, and reuse root CLAUDE.md in Cursor CLI only when that cross-tool policy is intentional.",
        ],
      },
      {
        heading: "CLAUDE.md vs copilot-instructions.md",
        body: [
          "CLAUDE.md is the Claude Code project memory file. .github/copilot-instructions.md is the broad repository-level instruction file for GitHub Copilot. They may contain similar setup commands and review rules, but they are not interchangeable because the supported surfaces differ.",
          "Use CLAUDE.md when the intended reader is Claude Code. Use .github/copilot-instructions.md when the intended reader is Copilot across supported repository workflows. If a Copilot cloud-agent surface also reads CLAUDE.md, treat that as an exception to verify, not the general Copilot baseline.",
        ],
      },
      {
        heading: "How Do Nested AGENTS.md Files Work?",
        body: [
          "Use nested AGENTS.md files only when a folder genuinely needs different guidance: package-specific test commands, generated-file boundaries, ownership rules, or risk limits. Keep the root file for shared repo policy and the nested file for local exceptions.",
          "A good nested file should be shorter than the root. It should say what changes inside that directory: commands, forbidden files, local completion standards, and when to ask for approval. Avoid duplicating the whole root policy because duplicated policy drifts quickly.",
        ],
      },
      {
        heading: "Can One Repository Use All Four Instruction Files?",
        body: [
          "Yes. A serious AI coding repository can use AGENTS.md, CLAUDE.md, .github/copilot-instructions.md, and .cursor/rules/*.mdc at the same time. The reason to do this is not duplication for its own sake; it is compatibility across tools that load different filenames.",
          "Keep the shared policy short and stable: setup commands, test commands, architecture boundaries, secrets policy, review expectations, and loop stop rules. Then keep each tool adapter concise so maintainers can update all affected files in one reviewed change.",
        ],
      },
      {
        heading: "Which File Should Be the Canonical Source?",
        body: [
          "The canonical source is the place maintainers agree to edit first; it is not necessarily the file every tool reads. Small teams often make AGENTS.md the canonical human-maintained policy because Codex uses it directly and it maps well to nested repository scope. Claude-heavy teams may choose CLAUDE.md instead.",
          "Whichever source you choose, mark the other files as synchronized adapters and review drift. A stale adapter is worse than no adapter because it gives one agent outdated commands while another agent follows the current rule.",
        ],
      },
      {
        heading: "Compatibility is a surface policy",
        body: [
          "Do not reduce compatibility to a single yes-or-no claim per vendor. OpenAI documents AGENTS.md discovery and nested precedence for Codex. Anthropic documents CLAUDE.md memory and scoped project guidance for Claude Code. GitHub publishes a support matrix because instruction-file support differs across Copilot surfaces. Cursor documents project rules, a root AGENTS.md alternative, and extra root-file support in Cursor CLI.",
          "For Copilot specifically, GitHub's matrix lists CLAUDE.md for selected cloud-agent surfaces and Copilot CLI, but not for many Chat and code-review surfaces. A repository that needs broad Copilot coverage should therefore maintain .github/copilot-instructions.md even when CLAUDE.md is also present.",
        ],
      },
      {
        heading: "One shared policy, small tool adapters",
        body: [
          "Choose one maintained policy source for facts that must agree everywhere: setup commands, verification, security boundaries, repository architecture, and review expectations. Then keep AGENTS.md, CLAUDE.md, .github/copilot-instructions.md, and Cursor rules as concise adapters that carry the shared policy into each tool's documented format and scope.",
          "A canonical source does not mean every tool reads that file. It means maintainers know where authoritative wording lives and update adapters in the same change. Never rely on links alone unless the target agent can actually open them.",
        ],
      },
      {
        heading: "Migrate the legacy .cursorrules file safely",
        body: [
          "For maintained Cursor guidance, move rules toward the currently documented .cursor/rules/*.mdc format. Split a large .cursorrules file into focused rules, add descriptions and globs where scope matters, compare behavior, and remove the old file only after repository testing.",
          "Cursor's current rules documentation labels .cursorrules as legacy and deprecated while stating that it remains supported. Preserve it during comparison if an existing workflow still depends on it, then remove it after the maintained .cursor/rules version passes repository checks.",
        ],
      },
      {
        heading: "Test the same task in the same repository",
        body: [
          "Compare tools only with the same repository state, task prompt, allowed tools, instruction files, verification command, and success criteria. Record tool and model versions so the result can be interpreted later.",
          "Report success, elapsed time, measured cost, and human interventions only when they were actually measured. Use Not measured for unavailable values, preserve failed runs, and document limitations instead of filling gaps with estimates or invented benchmark results.",
        ],
      },
    ],
    recommendedPlay: [
      "Inventory the agent surfaces the repository actually uses, then map each surface to the publisher's current support record.",
      "Maintain one canonical shared policy and generate or review concise adapters for AGENTS.md, CLAUDE.md, .github/copilot-instructions.md, and .cursor/rules/*.mdc.",
      "Use .github/copilot-instructions.md as the broad Copilot repository baseline; treat CLAUDE.md support as surface-specific.",
      "Run a controlled same-task, same-repository comparison and publish only measured success, time, cost, and human-intervention values.",
    ],
    decisionTable: {
      title: "Current instruction-file decision table",
      intro:
        "Choose files by documented reader, scope, and surface. Shared wording may be synchronized, but file discovery remains tool-specific.",
      columns: ["Current documented use", "Scope or surface caveat", "Recommended policy"],
      rows: [
        {
          label: "AGENTS.md",
          values: [
            "Open cross-agent instruction format; Codex repository instructions; root project instructions in Cursor IDE and CLI",
            "Support is tool- and surface-specific; Codex supports nested precedence while cited Cursor support is root-level and does not inherit Codex nesting behavior",
            "Use it as a shared policy only where the reader documents support, and keep thin tool-specific adapters where behavior differs",
          ],
        },
        {
          label: "CLAUDE.md",
          values: [
            "Claude Code project memory and instructions",
            "Copilot support exists on selected cloud-agent surfaces and Copilot CLI, not broadly across Chat and code review",
            "Keep it for Claude Code; also use .github/copilot-instructions.md when broad Copilot coverage matters",
          ],
        },
        {
          label: ".github/copilot-instructions.md",
          values: [
            "Repository-wide GitHub Copilot instructions",
            "Broadly supported across Copilot surfaces; path-specific files are separate",
            "Use as the Copilot baseline and add .github/instructions/*.instructions.md only for scoped guidance",
          ],
        },
        {
          label: ".cursor/rules/*.mdc",
          values: [
            "Current documented Cursor project rules",
            "Metadata can make rules always-on, file-matched, requested, or manual",
            "Split guidance into focused rules with explicit descriptions and globs",
          ],
        },
        {
          label: ".cursorrules",
          values: [
            "Legacy Cursor repository instruction file that remains supported",
            "Cursor documents it as deprecated in favor of Project Rules",
            "Test migration to .cursor/rules/*.mdc before removing the legacy file",
          ],
        },
      ],
    },
    actionSteps: [
      {
        title: "Inventory files and surfaces",
        body: "List AGENTS.md, CLAUDE.md, .github/copilot-instructions.md, .github/instructions/*.instructions.md, .cursorrules, and .cursor/rules/*.mdc, then record the exact agent surfaces expected to read each file.",
      },
      {
        title: "Define the canonical shared policy",
        body: "Choose the maintained source for setup, architecture, security, edit boundaries, tests, and review rules. Mark generated or manually synchronized adapters so maintainers know which wording is authoritative.",
      },
      {
        title: "Create documented adapters",
        body: "Place Codex guidance in AGENTS.md, Claude Code guidance in CLAUDE.md, broad Copilot guidance in .github/copilot-instructions.md, and current Cursor guidance in focused .cursor/rules/*.mdc files.",
      },
      {
        title: "Migrate Cursor rules safely",
        body: "Translate the deprecated .cursorrules file into scoped .mdc rules, preserve it during comparison, and remove it only after observed behavior and repository checks support the change.",
      },
      {
        title: "Run a controlled comparison",
        body: "Use the same clean repository state, task, prompt, permissions, and verification criteria for every tool. Record versions and mark unavailable success, elapsed time, cost, or human-intervention data as Not measured.",
      },
    ],
    pitfalls: [
      {
        title: "Saying Copilot reads or ignores CLAUDE.md everywhere",
        fix: "Check the GitHub support matrix by surface and use .github/copilot-instructions.md for broad repository-wide compatibility.",
      },
      {
        title: "Deleting .cursorrules without a migration check",
        fix: "Cursor still supports the deprecated legacy file. Migrate toward .cursor/rules/*.mdc and verify behavior before removal.",
      },
      {
        title: "Copying a shared policy until adapters drift",
        fix: "Name the canonical source, keep adapters narrow, and update all affected files in the same reviewed change.",
      },
      {
        title: "Publishing zeros or estimates as benchmark data",
        fix: "Use measured values only. Display Not measured when success, time, cost, human interventions, or changed-file counts were not captured.",
      },
    ],
    internalLinks: [
      {
        slug: "does-github-copilot-read-claude-md-support-matrix",
        anchor: "Does GitHub Copilot read CLAUDE.md? support matrix",
        reason: "Readers with the Copilot-specific question should move to the narrow support matrix page instead of staying on the broad comparison.",
      },
      {
        slug: "agents-md-examples-codex-node-python-monorepos",
        anchor: "AGENTS.md examples for Node.js, Python, and monorepos",
        reason: "Readers who already chose AGENTS.md need concrete copyable examples for real repository shapes.",
      },
      {
        slug: "agents-md-template-for-ai-coding-agents",
        anchor: "View the AGENTS.md template for monorepos",
        reason: "Use the template to turn the shared policy into a concise Codex repository adapter.",
      },
      {
        slug: "ai-coding-agents-comparison",
        anchor: "AI coding agents comparison",
        reason: "Build a four-tool operating-model shortlist before choosing the repository instruction policy.",
      },
      {
        slug: "codex-vs-claude-code",
        anchor: "Codex vs Claude Code",
        reason: "Compare the tool workflows after instruction-file compatibility and scope are controlled.",
      },
      {
        slug: "codex-vs-github-copilot",
        anchor: "Codex vs GitHub Copilot",
        reason: "Compare current app, CLI, cloud-agent, model, permission, and governance surfaces after choosing the instruction policy.",
      },
      {
        slug: "claude-code-hooks-mcp-setup",
        anchor: "Claude Code hooks and MCP setup",
        reason: "Move deterministic automation into hooks or MCP after deciding what belongs in CLAUDE.md.",
      },
      {
        slug: "secure-mcp-servers-ai-coding-agents",
        anchor: "MCP security checklist",
        reason: "Instruction adapters should name safe tool boundaries before agents receive MCP access.",
      },
      {
        slug: "loop-engineering-ai-coding-agents",
        anchor: "loop engineering for AI coding agents",
        reason: "Shared instruction files should name verification commands and stop rules for agent loops, not only one-shot prompts.",
      },
      {
        slug: "ai-coding-agent-instruction-file-adoption-report-2026",
        anchor: "GitHub instruction-file adoption report",
        reason: "Compare official support rules with a dated 400-file public GitHub content sample and downloadable raw data.",
      },
    ],
    checklist: [
      "List every agent surface, not just each vendor name.",
      "Verify support against current publisher documentation.",
      "Use .github/copilot-instructions.md for broad Copilot repository coverage.",
      "Keep one canonical shared policy and identify every adapter.",
      "Put current Cursor project rules in .cursor/rules/*.mdc.",
      "Treat .cursorrules as supported legacy input and verify its .cursor/rules replacement before removal.",
      "Run the same task against the same repository state and criteria.",
      "Publish only measured success, elapsed time, cost, and human interventions.",
    ],
    evidence: [
      {
        title: "Use AGENTS.md with Codex",
        url: "https://learn.chatgpt.com/docs/agent-configuration/agents-md",
        publisher: "OpenAI",
        note: "Documents Codex instruction discovery, precedence, scope, and fallback filenames.",
        verifiedAt: "2026-07-14",
      },
      {
        title: "AGENTS.md open format and supported-agent ecosystem",
        url: "https://agents.md/",
        publisher: "AGENTS.md",
        note: "Describes the open format, supported-agent ecosystem, 60,000-plus open-source project usage statement, nested guidance, and AAIF stewardship.",
        verifiedAt: "2026-07-19",
      },
      {
        title: "Claude Code memory documentation",
        url: "https://code.claude.com/docs/en/memory",
        publisher: "Anthropic",
        note: "Documents CLAUDE.md loading, scoped project memory, imports such as @AGENTS.md, and symlink options.",
        verifiedAt: "2026-07-14",
      },
      {
        title: "GitHub Copilot custom instructions support matrix",
        url: "https://docs.github.com/en/copilot/reference/custom-instructions-support",
        publisher: "GitHub",
        note: "Lists instruction-file support by Copilot surface, including surface-specific CLAUDE.md support.",
        verifiedAt: "2026-09-08",
        verificationConclusion: "The matrix still varies by Copilot surface: CLAUDE.md is supported by cloud agent and CLI, while other surfaces list AGENTS.md or Copilot-specific files.",
        verificationChangeNote: "Rechecked the current surface matrix and tightened the wording to avoid a universal yes-or-no claim.",
      },
      {
        title: "Adding custom instructions for GitHub Copilot",
        url: "https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions",
        publisher: "GitHub",
        note: "Documents repository-wide and path-specific Copilot instruction files.",
        verifiedAt: "2026-07-14",
      },
      {
        title: "Cursor rules documentation",
        url: "https://docs.cursor.com/context/rules-for-ai",
        publisher: "Cursor",
        note: "Documents project rules, root AGENTS.md support, and the legacy/deprecated .cursorrules status.",
        verifiedAt: "2026-07-14",
      },
      {
        title: "Cursor CLI instruction-file support",
        url: "https://docs.cursor.com/en/cli/using",
        publisher: "Cursor",
        note: "Documents Cursor CLI loading root AGENTS.md and CLAUDE.md alongside .cursor/rules.",
        verifiedAt: "2026-07-14",
      },
      {
        title: "Configuration Smells in AGENTS.md Files",
        url: "https://arxiv.org/abs/2606.15828",
        publisher: "arXiv",
        note: "June 2026 preprint that catalogs six instruction-file configuration smells across 100 popular repositories and reports their observed prevalence.",
        verifiedAt: "2026-07-19",
      },
    ],
    relatedArticleSlugs: ["openai-codex-plugins-sites-annotations", "github-copilot-sdk-general-availability"],
    publishedAt: "2026-06-14",
    updatedAt: "2026-09-08",
    metaTitle: "AGENTS.md vs CLAUDE.md vs Copilot Instructions",
    metaDescription:
      "Compare CLAUDE.md, .github/copilot-instructions.md, AGENTS.md, and Cursor rules by tool surface, scope, and safe sync policy.",
    resourceIds: ["instruction-files"],
  },
  {
    id: "guide-claude-code-subagents",
    title: "Claude Code subagents workflow examples",
    slug: "claude-code-subagents-examples",
    summary:
      "Workflow patterns for using Claude Code subagents to split research, implementation, review, migration, and verification work.",
    intent: "Claude Code users want concrete examples for when and how to delegate work to subagents.",
    audience: "Developers using Claude Code for larger codebases, migrations, and multi-step reviews.",
    pageType: "Practical examples tutorial",
    secondaryKeywords: ["Claude Code subagents workflow", "Claude Code sub-agents", "AI coding subagents", "plan-execute-verify agent loop"],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "Use subagents when a task can be split into independent research, verification, or bounded implementation slices. Keep urgent blocking work local, give each subagent a concrete output, and avoid asking several agents to modify the same files.",
        ],
      },
      {
        heading: "Useful workflows",
        body: [
          "Research pass: one subagent checks official docs or changelogs while the main agent inspects the local codebase.",
          "Review pass: one subagent evaluates a plan or diff for missing tests, unsafe assumptions, or security gaps.",
          "Split implementation: separate agents own disjoint modules only after the write scopes are clear.",
        ],
      },
      {
        heading: "Common failure mode",
        body: [
          "Subagents are not a substitute for clear task boundaries. If two agents need the same context or files, keep the task local until the boundary is clearer.",
        ],
      },
    ],
    recommendedPlay: [
      "Use subagents first for research, review, and verification because those tasks have clear outputs and low file-conflict risk.",
      "Move to split implementation only when file ownership is already disjoint.",
      "Close every subagent with a decision: accept, reject, or park the finding, instead of blending all outputs into vague consensus.",
    ],
    decisionTable: {
      title: "Subagent delegation matrix",
      intro: "Choose the subagent pattern by task shape, not by how large or exciting the project feels.",
      columns: ["Use subagents when", "Keep local when", "Expected output"],
      rows: [
        {
          label: "Research",
          values: ["Official docs, changelogs, or API behavior can be checked independently", "The answer depends on unresolved local code details", "Source-backed summary and risk notes"],
        },
        {
          label: "Review",
          values: ["A plan or diff needs a second pass for bugs, missing tests, or assumptions", "The reviewer would need to edit the same files immediately", "Prioritized findings with file or requirement references"],
        },
        {
          label: "Implementation",
          values: ["Modules and files are clearly separated", "Two agents need the same files or shared state", "Scoped patch or implementation notes"],
        },
        {
          label: "Verification",
          values: ["One agent can run checks while the main thread inspects results", "The failing behavior is still not reproduced", "Commands, outputs, and pass/fail conclusion"],
        },
      ],
    },
    actionSteps: [
      {
        title: "Name the decision",
        body: "Write the exact decision the main agent needs, such as whether a migration path is safe or which docs changed.",
      },
      {
        title: "Bound context and ownership",
        body: "Give the subagent only the files, docs, or question it needs, and state whether it may edit or only report.",
      },
      {
        title: "Collect findings before merging",
        body: "Read every subagent result, separate evidence from opinion, and decide which findings change the main path.",
      },
      {
        title: "Verify the integrated result",
        body: "Run the final checks in the main thread so the completed work has one accountable owner.",
      },
    ],
    pitfalls: [
      {
        title: "Spawning agents before the boundary is clear",
        fix: "Write the desired output first, then decide whether parallel work is actually independent.",
      },
      {
        title: "Letting multiple agents edit the same area",
        fix: "Use subagents for analysis or disjoint files; keep shared edits in the main thread.",
      },
      {
        title: "Averaging conflicting advice",
        fix: "Pick the result with better evidence and explain the decision in the main thread.",
      },
    ],
    internalLinks: [
      {
        slug: "claude-code-hooks-mcp-setup",
        anchor: "Claude Code hooks and MCP setup",
        reason: "Subagent workflows often need hooks or MCP servers once repeated tasks become procedural.",
      },
      {
        slug: "agents-md-vs-claude-md-cursorrules-copilot-instructions",
        anchor: "AI coding agent instruction files",
        reason: "Subagents perform better when repository instructions are current and tool-specific guidance is not contradictory.",
      },
      {
        slug: "loop-engineering-ai-coding-agents",
        anchor: "loop engineering for AI coding agents",
        reason: "Subagents are building blocks inside plan-execute-verify loops that need iteration caps and escalation rules.",
      },
    ],
    checklist: [
      "Name the output you need before spawning a subagent.",
      "Keep each task self-contained.",
      "Assign disjoint file ownership for edits.",
      "Close agents after collecting results.",
      "Merge conclusions into one decision instead of averaging blindly.",
    ],
    evidence: [
      {
        title: "Claude Code subagents",
        url: "https://docs.anthropic.com/en/docs/claude-code/sub-agents",
        publisher: "Anthropic",
        note: "Official subagent capability reference.",
      },
      {
        title: "Claude Code overview",
        url: "https://docs.anthropic.com/en/docs/claude-code/overview",
        publisher: "Anthropic",
        note: "Places subagents in the broader Claude Code workflow.",
      },
    ],
    relatedArticleSlugs: ["claude-code-dynamic-workflows-parallel-subagents"],
    publishedAt: "2026-06-14",
    updatedAt: "2026-06-14",
    metaTitle: "Claude Code Subagents Workflow Examples",
    metaDescription:
      "Examples and checklists for using Claude Code subagents in research, implementation, review, and verification workflows.",
  },
  {
    id: "guide-claude-code-hooks-mcp",
    title: "Claude Code Hooks vs MCP: Setup, Examples and Security",
    slug: "claude-code-hooks-mcp-setup",
    summary:
      "A setup-oriented guide for combining Claude Code hooks, skills, and MCP servers without creating brittle automation.",
    intent: "Advanced Claude Code users want to connect hooks and MCP safely and understand where each control belongs.",
    audience: "Developers and platform teams wiring Claude Code into repo-specific workflows.",
    pageType: "Setup guide and control map",
    secondaryKeywords: ["Claude Code hooks", "Claude Code MCP", "Claude Code skills", "MCP setup", "cursor loop automation"],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "Use Claude Code hooks for deterministic lifecycle events, skills for reusable procedures, and MCP for external tools or data. Hooks answer when something should run, skills answer how Claude should perform a recurring task, and MCP answers what outside system Claude can safely reach.",
        ],
      },
      {
        heading: "Hooks vs Skills vs MCP",
        body: [
          "Hooks are event triggers: run this check, notification, formatter, or guardrail at a predictable lifecycle point. Skills are reusable instruction packages: follow this playbook, load these references, or apply this review method. MCP servers expose external capabilities: browser, GitHub, database, docs, monitoring, internal tools, or other structured data.",
          "Do not use MCP when a hook can run a deterministic local command. Do not use a hook when Claude needs reusable domain knowledge. Do not put credentials or broad tool access in a skill file. Keep each control small enough that a teammate can explain what happens when it fails.",
        ],
      },
      {
        heading: "Control map",
        body: [
          "Hooks are best for repeatable events such as formatting, validation, or notifications.",
          "MCP servers are best when Claude needs structured access to a tool, database, browser, repository, or internal system.",
          "Skills are best for playbooks: how to reason about a domain, what references to load, and what checks to run.",
        ],
      },
      {
        heading: "Safe rollout",
        body: [
          "Start with read-only MCP access, test hooks locally, document expected side effects, and add write capabilities only after the workflow proves useful.",
          "For a hook-to-MCP workflow, keep the hook deterministic and the MCP call scoped. Example: after Claude prepares a release note, a hook can run a local validation command, while MCP can fetch the related issue metadata. The hook should not silently publish, deploy, or write to external systems without approval.",
        ],
      },
      {
        heading: "Logging and troubleshooting",
        body: [
          "Log hook name, trigger, command, exit code, duration, and whether it blocked the task. For MCP calls, log server name, method, target, approval state, and outcome without storing secrets or raw tokens.",
          "Common failures are stale credentials, missing local binaries, slow hooks, incorrect working directories, over-broad MCP permissions, and unclear error handling. Write the expected failure behavior before a team depends on the workflow.",
        ],
      },
      {
        heading: "Claude Code hooks not working: common fixes",
        body: [
          "If a hook never runs, confirm the trigger event, working directory, and that the local binary exists on PATH for the Claude Code session. If a hook runs but the task still proceeds, verify whether the hook is configured to block or only notify.",
          "If MCP calls fail after a hook fires, check credential freshness, server startup order, and whether the hook assumes a tool that is not yet connected. Slow hooks often look like failures when the real issue is timeout or missing progress output.",
          "Fix order: reproduce with one hook and one MCP server, log exit codes, test read-only access first, then widen permissions only after the owner reviews the failure log.",
        ],
      },
    ],
    recommendedPlay: [
      "Start with the control map before installing anything: hooks for deterministic events, MCP for external capability, skills for reusable process.",
      "Ship the first workflow read-only, then add write access only after the benefit is proven and the failure mode is documented.",
      "Connect every hook and MCP server to a visible owner, rollback path, and audit trail.",
    ],
    decisionTable: {
      title: "Hooks, MCP, and skills control map",
      intro: "Use this map to keep automation understandable as Claude Code workflows become more powerful.",
      columns: ["Use for", "Good examples", "Risk to control"],
      rows: [
        {
          label: "Hooks",
          values: ["Deterministic lifecycle actions", "Format before completion, notify after task, run a local check", "Unexpected side effects or slow workflows"],
        },
        {
          label: "MCP",
          values: ["Structured access to external tools and data", "Browser, GitHub, database, docs, monitoring systems", "Over-broad permissions and secret exposure"],
        },
        {
          label: "Skills",
          values: ["Reusable procedural knowledge", "incident review workflow, code review workflow, release checklist", "Outdated references or overly broad instructions"],
        },
        {
          label: "Manual approval",
          values: ["Destructive or production-facing changes", "Deployments, data deletion, billing changes", "Accidental write operations"],
        },
        {
          label: "Logs",
          values: ["Troubleshooting and audit trail", "Hook trigger, MCP method, target, outcome, approval state", "Secret leakage and noisy records nobody reviews"],
        },
      ],
    },
    actionSteps: [
      {
        title: "Write the workflow boundary",
        body: "Describe which action should happen automatically, which action needs a tool, and which action must stay human-approved.",
      },
      {
        title: "Install read-only first",
        body: "Add MCP servers and hooks with the smallest useful permission set so failures are observable without being destructive.",
      },
      {
        title: "Document failure behavior",
        body: "For each hook and MCP tool, write what happens when it times out, fails, returns empty data, or lacks credentials.",
      },
      {
        title: "Promote after proof",
        body: "Only widen permissions after the workflow has completed successfully on a small project and the owner agrees with the logs.",
      },
      {
        title: "Add a troubleshooting note",
        body: "Record the expected working directory, required binaries, credentials, timeout behavior, and rollback command before teammates copy the setup.",
      },
    ],
    pitfalls: [
      {
        title: "Using MCP for deterministic local steps",
        fix: "Prefer hooks for repeatable lifecycle actions and reserve MCP for external systems or structured tool access.",
      },
      {
        title: "Adding write access too early",
        fix: "Keep the first rollout read-only and graduate one capability at a time.",
      },
      {
        title: "No rollback path",
        fix: "Document how to disable each hook or server before it becomes part of team workflow.",
      },
    ],
    internalLinks: [
      {
        slug: "mcp-server-not-showing-tools",
        anchor: "MCP server not showing tools troubleshooting guide",
        reason: "Use the diagnostic fault tree when a configured Claude Code MCP server is missing tools or exposes zero tools.",
      },
      {
        slug: "agents-md-vs-claude-md-cursorrules-copilot-instructions",
        anchor: "repository instruction file comparison",
        reason: "Decide what belongs in CLAUDE.md before moving repeatable actions into hooks or MCP tools.",
      },
      {
        slug: "secure-mcp-servers-ai-coding-agents",
        anchor: "secure MCP servers",
        reason: "Any setup guide that enables MCP needs a deeper security checklist before production use.",
      },
      {
        slug: "claude-code-subagents-examples",
        anchor: "Claude Code subagents workflow examples",
        reason: "Hooks and MCP become more useful when paired with clear delegation patterns.",
      },
      {
        slug: "loop-engineering-ai-coding-agents",
        anchor: "loop engineering for AI coding agents",
        reason: "Hooks and MCP supply the observe-and-act cycles that make agent loops repeatable and stoppable.",
      },
    ],
    checklist: [
      "List every hook and MCP server by purpose.",
      "Mark read-only versus write-capable access.",
      "Document credentials and environment gates.",
      "Add a rollback path for failing hooks.",
      "Test the workflow on a small repo before broad rollout.",
    ],
    evidence: [
      {
        title: "Claude Code hooks",
        url: "https://docs.anthropic.com/en/docs/claude-code/hooks",
        publisher: "Anthropic",
        note: "Official hook behavior reference.",
      },
      {
        title: "Claude Code MCP",
        url: "https://docs.anthropic.com/en/docs/claude-code/mcp",
        publisher: "Anthropic",
        note: "Official MCP setup reference for Claude Code.",
      },
      {
        title: "Model Context Protocol",
        url: "https://modelcontextprotocol.io/",
        publisher: "MCP",
        note: "Protocol reference for MCP servers and clients.",
      },
    ],
    relatedArticleSlugs: ["claude-code-dynamic-workflows-parallel-subagents"],
    publishedAt: "2026-06-14",
    updatedAt: "2026-06-26",
    metaTitle: "Claude Code Hooks vs MCP Setup",
    metaDescription:
      "Compare Claude Code hooks, skills, and MCP with setup examples, hook-to-MCP boundaries, logs, troubleshooting, and security checks.",
    resourceIds: ["claude-code-setup"],
  },
  {
    id: "guide-secure-mcp-servers",
    title: "MCP Server Security Checklist: 25 Controls for AI Agents",
    slug: MCP_SECURITY_GUIDE_SLUG,
    summary:
      "Audit MCP server security with 25 source-backed controls covering authentication, permissions, prompt injection, secrets, sandboxing, logging, revocation, and allow-or-deny tests.",
    intent:
      "Answer how to secure an MCP server with source-backed protocol checks and clearly labeled operational controls.",
    audience: "Engineering leaders, security reviewers, platform teams, and developer tooling owners.",
    pageType: "MCP security checklist and threat model",
    secondaryKeywords: [
      "MCP server security",
      "how to secure an MCP server",
      "MCP authentication",
      "MCP permissions",
      "AI agent tool security",
    ],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "Secure MCP server connections to AI agents before any tool can act. Validate authentication and token audience, avoid token passthrough, grant least-privilege read-only access first, block secrets and undeclared network destinations, log high-impact calls without sensitive payloads, and prove revocation works. Human approval and attributable audit logs are KyenAI operational recommendations for destructive or production actions, not requirements imposed by the MCP specification.",
        ],
      },
      {
        heading: "Define the trust boundary",
        body: [
          "MCP server security spans the client, server, authorization server, credentials, data sources, local process privileges, network destinations, and the model context that can trigger tools. Inventory the exact server owner, publisher, version, distribution source, methods, filesystem roots, data classes, credentials, network reach, and deployment environment before deciding whether it can launch.",
          "The threat model must cover prompt injection, excessive permissions or scope, secret or token exposure, unsafe writes or deletes, network reach or SSRF, and third-party supply chain or local server compromise. Prompt injection and destructive-action gating are broader AI agent tool security concerns; token audience validation, token passthrough, SSRF, and local server compromise are addressed directly in official MCP security material.",
        ],
      },
      {
        heading: "Apply official MCP authorization controls",
        body: [
          "For HTTP transports, follow the MCP authorization flow, publish protected resource metadata, validate access-token audience, reject tokens not issued for the MCP server, and avoid token passthrough. Request minimal initial scopes and elevate only when a specific method needs more access. Keep credentials in managed storage, out of prompts and ordinary logs, and document rotation and revocation.",
          "Use the official MCP Inspector during validation to enumerate resources, prompts, tools, notifications, and protocol exchanges. Exercise both allowed and denied calls so the review covers behavior rather than configuration alone.",
        ],
      },
      {
        heading: "MCP tool permissions boundaries",
        body: [
          "Define MCP tool boundaries at the tool level, not only at the server level. Decide which tools are visible to the agent, which are callable, which are read-only, and which require explicit approval before write, delete, network, secret, or production access.",
          "Use a policy matrix for read-only, write-limited, and admin tools. Map each enabled tool to a declared workflow, owner, and rollback path. Separate repository read, write, and delete capabilities instead of granting one broad server profile to every agent session.",
          "When vendors use different vocabulary such as permissions boundaries, deny policies, or read-write tool use, translate them into the same review questions: who can invoke the tool, on what target, with what evidence, and under what stop condition.",
        ],
      },
      {
        heading: "Compare OAuth, API keys, and mTLS",
        body: [
          "Authentication is not one checkbox. Use OAuth or the MCP authorization flow when HTTP-based servers need audience-bound tokens and scopes. Use API keys or service tokens only when they are narrowly scoped, runtime-injected, redacted, and revocable. Use mTLS or private network identity when production service-to-service access needs strong client identity and certificate lifecycle control.",
          "The included security config example starts from a conservative read-only profile: token audience validation, blocked secret paths, network allowlists, empty write and destructive method lists, human approval for high-impact access, redacted audit fields, and a named revocation command.",
        ],
      },
      {
        heading: "Add operational launch gates",
        body: [
          "Separate repository read, write, and delete capabilities. Deny outbound network, secret access, and production access by default until each destination and use case is reviewed. Require an informed human decision immediately before destructive or production-facing actions, and retain attributable records that identify the actor, session, server version, method, target, approval, and outcome without logging secrets.",
          "These approval, audit-log, read/write separation, and review-cadence controls are KyenAI operational recommendations. They are not presented as normative MCP specification requirements. Teams can adopt stricter controls when data sensitivity, regulatory obligations, or production impact warrants them.",
        ],
      },
    ],
    recommendedPlay: [
      "Inventory one named server and version, including owner, publisher, methods, data classes, credentials, network reach, dependencies, and deployment environment.",
      "Validate official MCP authentication and authorization behavior, including token audience, scopes, deny paths, and token-passthrough protection.",
      "Launch with the narrowest read-only profile, then review write, delete, network, secret, and production capabilities as separate permission decisions.",
      "Use MCP Inspector to test expected allow and deny cases, record evidence, and prove that disablement and credential revocation work.",
    ],
    decisionTable: {
      title: "MCP security launch decisions",
      intro:
        "Distinguish protocol-specific requirements and guidance from general operating controls before approving an MCP server.",
      columns: ["Claim basis", "Security decision", "Launch gate"],
      rows: [
        {
          label: "MCP authentication",
          values: [
            "Official MCP authorization specification and security guidance",
            "Validate token audience, metadata, scopes, and deny paths; do not pass through unrelated tokens",
            "Authorization tests prove accepted and rejected token behavior",
          ],
        },
        {
          label: "MCP permissions",
          values: [
            "Official least-privilege guidance plus local capability policy",
            "Request minimal scopes and review read, write, delete, network, secret, and production access separately",
            "Every enabled scope and method maps to a declared workflow",
          ],
        },
        {
          label: "Human approval",
          values: [
            "KyenAI operational recommendation",
            "Require an informed decision immediately before destructive or production actions",
            "The prompt identifies actor, target, action, environment, and rollback limits",
          ],
        },
        {
          label: "Attributable logs",
          values: [
            "KyenAI operational recommendation",
            "Record actor, session, server version, method, target, approval, timestamp, and outcome",
            "A reviewer can reconstruct a consequential call without exposing secrets",
          ],
        },
        {
          label: "Network isolation",
          values: [
            "Official SSRF guidance plus KyenAI deployment controls",
            "Validate URLs and redirects; allowlist destinations and block private or metadata endpoints",
            "SSRF, redirect, DNS, and undeclared-destination tests pass",
          ],
        },
        {
          label: "Revocation",
          values: [
            "KyenAI operational recommendation informed by MCP token guidance",
            "Disable the server, revoke credentials and client access, preserve records, and assess affected data",
            "The owner proves emergency disablement and names incident contacts",
          ],
        },
      ],
    },
    actionSteps: [
      {
        title: "Record the server profile",
        body: "Name the owner, publisher, version, distribution source, methods, resources, prompts, data classes, credential source, network destinations, dependencies, and deployment environment.",
      },
      {
        title: "Verify authentication and scopes",
        body: "Test protected resource metadata, token audience, minimal scopes, rejected tokens, incremental elevation, and the absence of token passthrough for HTTP-based MCP authentication.",
      },
      {
        title: "Complete the permission matrix",
        body: "Decide repository read, write, delete, outbound network, secret access, and production access separately. Document each default, data risk, approval, logging expectation, and launch gate.",
      },
      {
        title: "Validate with MCP Inspector",
        body: "Enumerate exposed protocol features, exercise expected allow and deny cases, inspect errors and protocol exchanges, and retain evidence for the reviewed server version.",
      },
      {
        title: "Prove revocation and incident response",
        body: "Disable the server, revoke tokens and secrets, remove client access, identify retained records, and confirm who evaluates affected systems before production approval.",
      },
    ],
    pitfalls: [
      {
        title: "Calling every control an MCP requirement",
        fix: "Tie normative language only to official MCP evidence. Label human approval, attributable audit logs, read/write separation, and review cadence as KyenAI operational recommendations.",
      },
      {
        title: "Granting one broad MCP permission bundle",
        fix: "Review repository read, write, delete, outbound network, secret access, and production access as independent capabilities with separate launch gates.",
      },
      {
        title: "Testing only the happy path",
        fix: "Use MCP Inspector and direct authorization tests to prove denied scopes, invalid audiences, undeclared destinations, and disabled capabilities stay blocked.",
      },
      {
        title: "Logging secrets in the name of auditability",
        fix: "Record identifiers and outcomes, not token values or unnecessary payloads. Test redaction before launch.",
      },
    ],
    internalLinks: [
      {
        slug: "mcp-server-not-showing-tools",
        anchor: "MCP tool discovery debugger",
        reason: "Prove tools are discovered and enabled before applying production security controls to their use.",
      },
      {
        slug: "claude-code-hooks-mcp-setup",
        anchor: "Claude Code hooks and MCP setup",
        reason: "The setup page explains where MCP belongs in the broader Claude Code control map.",
      },
      {
        slug: "agents-md-vs-claude-md-cursorrules-copilot-instructions",
        anchor: "repository instruction files",
        reason: "Instruction files are where teams should document safe tool usage and escalation rules.",
      },
      {
        slug: "loop-engineering-ai-coding-agents",
        anchor: "loop engineering for AI coding agents",
        reason: "MCP servers inside unattended loops need scoped permissions, observation tools, and stop rules before scaling.",
      },
    ],
    checklist: [
      "Record the server owner, publisher, version, distribution source, and deployment environment.",
      "Classify methods, capabilities, data classes, credentials, network reach, and dependencies.",
      "Validate MCP authentication, token audience, minimal scopes, and denied authorization paths.",
      "Keep secrets and tokens out of prompts, source control, tool output, and ordinary logs.",
      "Separate repository read, write, and delete permissions.",
      "Deny outbound network, secret access, and production access until independently approved.",
      "Require human approval for destructive or production actions as an operational control.",
      "Retain attributable, secret-redacted audit records as an operational control.",
      "Validate resources, prompts, tools, notifications, and allow or deny behavior with MCP Inspector.",
      "Test server disablement, credential revocation, incident contacts, and restoration criteria.",
    ],
    evidence: [
      {
        title: "MCP security best practices",
        url: "https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices",
        publisher: "MCP",
        note: "Official guidance for least privilege, token security, SSRF, sessions, and local server compromise.",
        verifiedAt: "2026-09-08",
        verificationConclusion: "The guidance continues to require explicit trust boundaries and covers token, SSRF, session, and local-server risks.",
        verificationChangeNote: "Rechecked for the September security refresh; KyenAI operational controls remain clearly labeled.",
      },
      {
        title: "MCP authorization specification",
        url: "https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization",
        publisher: "MCP",
        note: "Official requirements for HTTP authorization, protected resource metadata, tokens, scopes, and audience validation.",
        verifiedAt: "2026-09-08",
        verificationConclusion: "HTTP authorization requires protected-resource discovery and audience-bound token validation.",
        verificationChangeNote: "Rechecked authorization language and retained transport-specific caveats.",
      },
      {
        title: "MCP authorization security considerations",
        url: "https://modelcontextprotocol.io/specification/draft/basic/authorization/security-considerations",
        publisher: "MCP",
        note: "Official security considerations for token passthrough, SSRF, session threats, and local server compromise.",
        verifiedAt: "2026-09-08",
        verificationConclusion: "The draft security considerations explicitly cover token passthrough, audience validation, SSRF, token theft, and secure transport.",
        verificationChangeNote: "Kept the source labeled as draft and avoided presenting KyenAI launch controls as protocol mandates.",
      },
      {
        title: "MCP Inspector",
        url: "https://modelcontextprotocol.io/docs/tools/inspector",
        publisher: "MCP",
        note: "Official interactive workflow for validating resources, prompts, tools, notifications, and protocol exchanges.",
        verifiedAt: "2026-09-08",
        verificationConclusion: "MCP Inspector remains the client-independent validation path for discovery and invocation behavior.",
        verificationChangeNote: "Rechecked the validation workflow for the September refresh.",
      },
    ],
    relatedArticleSlugs: ["github-copilot-cloud-local-sandboxes-preview", "visual-studio-agent-mode-mcp-general-availability"],
    publishedAt: "2026-06-14",
    updatedAt: "2026-09-08",
    metaTitle: "MCP Server Security Checklist: 25 Controls for AI Agents",
    metaDescription:
      "Audit MCP server security across authentication, permissions, prompt injection, secrets, logging, sandboxing, and revocation. Download PDF, CSV, or JSON.",
    resourceIds: ["mcp-security"],
  },
  {
    id: "guide-mcp-tool-discovery",
    title: "MCP Server Not Showing Tools? Diagnose tools/list in 8 Checks",
    slug: MCP_TOOL_DISCOVERY_GUIDE_SLUG,
    summary:
      "Fix an MCP server that is missing, connected with zero tools, stale, filtered, or visible but never called across Claude Code, Cursor, GitHub Copilot, and other clients.",
    intent:
      "Diagnose why an MCP server is not showing tools and identify the first failing layer without widening permissions or reinstalling everything.",
    audience: "Developers, MCP server authors, platform teams, and AI coding tool administrators.",
    pageType: "Interactive MCP troubleshooting guide",
    secondaryKeywords: [
      "MCP server not showing tools",
      "MCP tools not appearing",
      "MCP tools/list debugging",
      "Claude Code MCP zero tools",
      "Cursor MCP tools missing",
      "GitHub Copilot MCP tools",
    ],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "If an MCP server is not showing tools, do not start by reinstalling the client. Prove each layer in order: confirm the client loaded the server config, reproduce the process or HTTP transport, complete initialization, and inspect tools/list in MCP Inspector. If Inspector lists the tools, the server works and the remaining fault is usually client scope, authentication, a tool allowlist or denylist, stale discovery, or on-demand tool loading. A visible tool that is never called is a selection or permission problem, not a discovery problem.",
        ],
      },
      {
        heading: "Connected with zero tools has a specific meaning",
        body: [
          "A connected state proves only that the client reached the server. It does not prove the server completed capability negotiation or returned a non-empty tool list. Claude Code's official MCP documentation explicitly distinguishes a server that advertises the tools capability but exposes no tools, and its /mcp panel shows the tool count beside each server.",
          "Use MCP Inspector as the client-independent boundary. Its Tools tab lists tool names, descriptions, and schemas and can invoke them with test inputs. If that view is empty, fix the server implementation or registration. If it is populated, move to the target client's filters, scope, authentication, cache, and session behavior.",
        ],
      },
      {
        heading: "Test initialize before blaming tools/list",
        body: [
          "MCP tool discovery happens after the protocol initialization exchange. Verify the negotiated protocol version, the server's declared capabilities, and the initialized notification before investigating tool schemas. A transport that opens and then fails initialization can look like an empty tool catalog in a client UI.",
          "For local stdio servers, run the exact configured command with the same arguments and environment. Use absolute paths where the working directory may differ, and write diagnostics to stderr because stdout is reserved for protocol messages. For Streamable HTTP, inspect authentication, response status, session headers, and server-side logs.",
        ],
      },
      {
        heading: "Separate discovery, loading, and invocation",
        body: [
          "Discovery asks whether tools/list returns valid tool definitions. Loading asks whether the client makes those definitions available in the current workspace, agent, and session. Invocation asks whether the model selects an available tool and receives permission to call it. Each layer has different proof and a different fix.",
          "Claude Code and GitHub Copilot can load tools on demand to reduce context use. That means a tool may not be expanded into the model context until a matching task triggers tool search. Check the client status and tool policy before treating deferred loading as server failure.",
        ],
      },
      {
        heading: "Client-specific checks after Inspector passes",
        body: [
          "In Claude Code, use /mcp to inspect connection state, authentication, and tool count. Project-scoped configuration may require approval, duplicate names can resolve by scope precedence, and tool search can defer definitions. In GitHub Copilot CLI, inspect /mcp or copilot mcp get, then check enabled-tool filters and any custom-agent tool policy.",
          "In Cursor or another MCP client, use the MCP settings and logs exposed by the installed version, then compare that client view with the same server in Inspector. Product interfaces and policy controls change, so retain the client version and a sanitized status capture in the bug report instead of assuming one universal menu path.",
        ],
      },
      {
        heading: "What evidence to collect before filing a bug",
        body: [
          "Record the client and server versions, transport, operating system, active config scope, exact symptom, expected tool names, initialization result, tools/list result, enabled-tool policy, and sanitized logs. Remove credentials, tokens, private URLs, and sensitive payloads before sharing any record.",
          "The downloadable worksheet on this page follows the same eight-layer order as the debugger. Attach the first failing check and its observable output; a report that says only 'tools are missing' forces maintainers to repeat every layer.",
        ],
      },
    ],
    recommendedPlay: [
      "Use MCP Inspector first when the server connects but exposes zero tools; it separates server discovery from client behavior.",
      "Keep discovery, client loading, and model invocation as three different states with separate pass conditions.",
      "Change only the first failing layer, then rerun the same proof before modifying permissions or unrelated configuration.",
    ],
    decisionTable: {
      title: "MCP missing-tools symptom map",
      intro: "Start at the row that matches the observable symptom, then move only after its pass condition is proven.",
      columns: ["Likely layer", "First proof", "Do not confuse with"],
      rows: [
        {
          label: "Server absent from status",
          values: ["Config load or scope", "Server name appears in the active client status view", "A tools/list implementation bug"],
        },
        {
          label: "Configured but disconnected",
          values: ["Process, transport, auth, or initialization", "Exact command stays alive or HTTP connection initializes", "A model tool-selection problem"],
        },
        {
          label: "Connected with 0 tools",
          values: ["Capability negotiation or tools/list", "Inspector Tools tab returns expected definitions", "Write permission or prompt wording"],
        },
        {
          label: "Inspector passes, client empty",
          values: ["Client scope, authentication, or tool filter", "Tool is enabled for the current workspace and agent", "A server reinstall"],
        },
        {
          label: "Tool visible but unused",
          values: ["Deferred loading, description, schema, prompt, or approval", "Explicit matching request selects and invokes the tool", "A discovery failure"],
        },
      ],
    },
    actionSteps: [
      {
        title: "Capture the exact state",
        body: "Record whether the server is absent, disconnected, connected with zero tools, populated only in Inspector, stale after a change, or visible but never called.",
      },
      {
        title: "Prove process and initialization",
        body: "Reproduce the exact transport, inspect initialization and declared capabilities, and eliminate stdout noise for local stdio servers.",
      },
      {
        title: "Inspect tools/list independently",
        body: "Connect MCP Inspector to the same server and verify expected names, descriptions, input schemas, and one safe test invocation.",
      },
      {
        title: "Audit client policy",
        body: "Check authentication, configuration precedence, workspace scope, enabled tools, allowlists, denylists, custom-agent policy, and on-demand loading.",
      },
      {
        title: "Retest one changed layer",
        body: "Reconnect or reload as required, repeat the original proof, and retain sanitized evidence for the server and client versions tested.",
      },
    ],
    pitfalls: [
      {
        title: "Reinstalling before finding the failing layer",
        fix: "A reinstall changes many variables without proving the cause. Test config, transport, initialize, and tools/list in order.",
      },
      {
        title: "Writing debug logs to stdout",
        fix: "For stdio servers, keep stdout exclusively for protocol traffic and send diagnostic logs to stderr.",
      },
      {
        title: "Treating a tool that is not called as a missing tool",
        fix: "First prove the tool is visible. Then check deferred loading, prompt fit, description, schema, permission, and invocation separately.",
      },
      {
        title: "Widening every tool permission",
        fix: "Enable only the expected tool in the required scope. A broad allow-all rule hides policy mistakes and increases risk.",
      },
    ],
    internalLinks: [
      {
        slug: "secure-mcp-servers-ai-coding-agents",
        anchor: "MCP server security checklist",
        reason: "After discovery works, review each visible tool's authentication, permissions, data access, logs, and revocation path.",
      },
      {
        slug: "claude-code-hooks-mcp-setup",
        anchor: "Claude Code hooks and MCP setup",
        reason: "Use the control map to decide whether the failing capability belongs in MCP, a hook, or a reusable skill.",
      },
      {
        slug: "agent-governance-checklist-for-software-teams",
        anchor: "AI agent governance checklist",
        reason: "Tool inventory, ownership, audit evidence, and approval boundaries belong in the wider governance process.",
      },
      {
        slug: "loop-engineering-ai-coding-agents",
        anchor: "loop engineering verification workflow",
        reason: "Turn each diagnostic layer into an observable pass or stop condition for repeatable agent operations.",
      },
    ],
    checklist: [
      "Record the exact missing-tools symptom before changing configuration.",
      "Confirm the active config source, scope, server name, command or URL, and authentication state.",
      "Run the exact stdio command or inspect the Streamable HTTP connection and server logs.",
      "Verify initialization, protocol version, declared tools capability, and initialized notification.",
      "Inspect tools/list in MCP Inspector and validate names, descriptions, and input schemas.",
      "Check client allowlists, denylists, enabled-tool filters, workspace scope, and custom-agent policy.",
      "Reconnect or reload after changes and verify dynamic list-change behavior where applicable.",
      "Test one explicit, safe request that clearly matches the expected tool.",
      "Redact credentials, tokens, private URLs, and sensitive payloads from shared evidence.",
    ],
    evidence: [
      {
        title: "MCP Inspector",
        url: "https://modelcontextprotocol.io/docs/tools/inspector",
        publisher: "MCP",
        note: "Official client-independent tool for inspecting server connections, capabilities, tools, schemas, calls, and notifications.",
        verifiedAt: "2026-09-08",
        verificationConclusion: "Inspector remains the independent way to determine whether the server exposes expected tools before debugging a specific client.",
        verificationChangeNote: "Rechecked for the minimal-reproduction workflow.",
      },
      {
        title: "MCP debugging guide",
        url: "https://modelcontextprotocol.io/docs/tools/debugging",
        publisher: "MCP",
        note: "Official guidance for stdio logging, paths, environment variables, initialization, transport debugging, and client logs.",
        verifiedAt: "2026-09-08",
        verificationConclusion: "The guide continues to separate configuration, transport, initialization, and protocol failures.",
        verificationChangeNote: "Rechecked and aligned the eight-layer fault tree.",
      },
      {
        title: "MCP tools specification",
        url: "https://modelcontextprotocol.io/specification/draft/server/tools",
        publisher: "MCP",
        note: "Defines tool discovery, tools/list, tool schemas, and list-change capability behavior.",
        verifiedAt: "2026-09-08",
        verificationConclusion: "A tools-capable server declares the capability and responds to tools/list; listChanged governs dynamic refresh notification.",
        verificationChangeNote: "Rechecked the current draft tools specification and preserved draft status.",
      },
      {
        title: "Connect Claude Code to tools via MCP",
        url: "https://code.claude.com/docs/en/mcp",
        publisher: "Anthropic",
        note: "Documents /mcp status, tool count, scope precedence, dynamic updates, reconnection, authentication, and Tool Search.",
        verifiedAt: "2026-07-19",
      },
      {
        title: "MCP server debugging guide",
        url: "https://docs.github.com/en/copilot/how-tos/copilot-sdk/troubleshooting/mcp-debugging",
        publisher: "GitHub",
        note: "Official debugging guidance for server startup, enabled tools, initialize, tools/list, schemas, timeouts, and stdout framing.",
        verifiedAt: "2026-07-19",
      },
    ],
    relatedArticleSlugs: ["visual-studio-agent-mode-mcp-general-availability"],
    publishedAt: "2026-07-19",
    updatedAt: "2026-09-08",
    metaTitle: "MCP Server Not Showing Tools? 8 Checks That Fix It",
    metaDescription:
      "Fix missing MCP tools by checking config, transport, initialize, tools/list, client filters, refresh behavior, and invocation. Includes a debugger.",
    resourceIds: ["mcp-tool-discovery"],
  },
  {
    id: "guide-antigravity-cli-migration",
    title: "Antigravity CLI migration from Gemini CLI",
    slug: "antigravity-cli-gemini-cli-migration",
    summary:
      "A migration checklist for Gemini CLI users moving to Antigravity CLI, with the key dates, retained concepts, and verification steps.",
    intent: "Gemini CLI users need to understand what changes when moving to Antigravity CLI.",
    audience: "Developers and teams using Gemini CLI or Google coding agents.",
    pageType: "Migration guide and checklist",
    secondaryKeywords: ["Gemini CLI migration", "Antigravity CLI", "Gemini CLI transition", "Google coding agent CLI"],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "Treat the move from Gemini CLI to Antigravity CLI as a workflow migration, not only a package rename. Preserve commands, auth assumptions, agent skills, hooks, extensions, and CI usage in a checklist before switching teams over.",
        ],
      },
      {
        heading: "What to verify",
        body: [
          "Check authentication, workspace permissions, CLI commands, extension support, hooks, subagent behavior, and any scripts that call Gemini CLI directly.",
          "If your team has docs or onboarding built around Gemini CLI, update those before the old command path disappears from active use.",
        ],
      },
      {
        heading: "Why the migration needs a staged rollout",
        body: [
          "Google's transition details can change while teams are migrating. Move one workflow first, verify authentication and automation, then update the rest of the team after the new path is stable.",
        ],
      },
    ],
    recommendedPlay: [
      "Treat the migration as a workflow compatibility audit, not a copy update.",
      "Check official Google dates and changed behaviors before each rollout step.",
      "Keep the setup and security checks close to the migration checklist so teams can verify permissions, credentials, and automation together.",
    ],
    decisionTable: {
      title: "Gemini CLI to Antigravity CLI migration map",
      intro: "Use this map to find the pieces most likely to break when a team moves command-line agent workflows.",
      columns: ["Check area", "What to compare", "Risk if skipped"],
      rows: [
        {
          label: "Commands",
          values: [
            "Local and CI command surface",
            "Local scripts, CI jobs, shell aliases, onboarding docs",
            "Old command paths keep failing after the team switches",
          ],
        },
        {
          label: "Authentication",
          values: [
            "Access and credential model",
            "Personal login, enterprise access, service accounts, environment variables",
            "Users cannot reproduce the workflow outside one machine",
          ],
        },
        {
          label: "Extensions and hooks",
          values: [
            "Automation compatibility",
            "Custom integrations, lifecycle hooks, editor extensions",
            "Automation silently stops or runs at the wrong moment",
          ],
        },
        {
          label: "Agent behavior",
          values: [
            "Runtime behavior",
            "Skills, subagents, context rules, model defaults",
            "The new CLI behaves differently even when commands look similar",
          ],
        },
      ],
    },
    actionSteps: [
      {
        title: "Freeze current Gemini CLI usage",
        body: "Capture commands, scripts, docs, CI references, auth assumptions, and plugin or extension usage before editing anything.",
      },
      {
        title: "Map each workflow",
        body: "For every recurring workflow, write the Antigravity CLI equivalent and mark unresolved behavior differences.",
      },
      {
        title: "Run a small migration test",
        body: "Move one repository or one workflow first, verify auth and hooks, then update docs before expanding to the team.",
      },
      {
        title: "Monitor official updates",
        body: "Keep a dated change log on the page so users can see what changed after the migration article was first published.",
      },
    ],
    pitfalls: [
      {
        title: "Renaming commands without testing workflow behavior",
        fix: "Verify auth, extensions, hooks, and CI outputs before declaring the migration complete.",
      },
      {
        title: "Ignoring old docs and onboarding paths",
        fix: "Update internal docs, README snippets, and developer onboarding at the same time as scripts.",
      },
      {
        title: "Letting a time-sensitive page age silently",
        fix: "Add a review date and update the page when Google changes migration details.",
      },
    ],
    internalLinks: [
      {
        slug: "claude-code-hooks-mcp-setup",
        anchor: "hooks and MCP setup guide",
        reason: "Migration readers often need a broader control map for hooks, skills, and external tooling.",
      },
      {
        slug: "claude-code-subagents-examples",
        anchor: "subagents workflow examples",
        reason: "Teams comparing CLI behavior also need a way to decide when parallel agent workflows are useful.",
      },
    ],
    checklist: [
      "Inventory Gemini CLI commands used locally and in CI.",
      "Map each command to Antigravity CLI behavior.",
      "Confirm authentication and enterprise access.",
      "Retest hooks, skills, extensions, and subagents.",
      "Update internal docs and onboarding.",
      "Monitor Google docs for deadline or feature changes.",
    ],
    evidence: [
      {
        title: "Transitioning Gemini CLI to Antigravity CLI",
        url: "https://developers.googleblog.com/en/an-important-update-transitioning-gemini-cli-to-antigravity-cli/",
        publisher: "Google",
        note: "Official transition announcement.",
      },
      {
        title: "Antigravity CLI migration documentation",
        url: "https://www.antigravity.google/docs/gcli-migration",
        publisher: "Google",
        note: "Official migration reference.",
      },
    ],
    relatedArticleSlugs: ["google-antigravity-cli-gemini-cli-transition"],
    publishedAt: "2026-06-14",
    updatedAt: "2026-06-14",
    metaTitle: "Antigravity CLI Migration from Gemini CLI",
    metaDescription:
      "Checklist for migrating from Gemini CLI to Antigravity CLI, including commands, auth, hooks, extensions, and team docs.",
  },
];

export const seedGuides: Guide[] = [...coreGuides, ...expansionGuides];

export function getGuides(): Guide[] {
  return seedGuides;
}

export function getGuide(slug: string): Guide | undefined {
  return seedGuides.find((guide) => guide.slug === slug);
}

export function getRelatedArticlesForGuide(guide: Guide, articles: Article[]): Article[] {
  const wanted = new Set(guide.relatedArticleSlugs);
  return articles.filter((article) => wanted.has(article.slug) && article.status === "published");
}

export function getInternalLinkedGuides(guide: Guide): Guide[] {
  const guideBySlug = new Map(seedGuides.map((item) => [item.slug, item]));
  return guide.internalLinks.flatMap((link) => {
    const linkedGuide = guideBySlug.get(link.slug);
    return linkedGuide ? [linkedGuide] : [];
  });
}
