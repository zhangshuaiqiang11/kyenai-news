import type { Article, Guide } from "./types";
import { expansionGuides } from "./guide-expansion";
import {
  INSTRUCTION_COMPARISON_GUIDE_SLUG,
  MCP_SECURITY_GUIDE_SLUG,
} from "./guide-routes";

const coreGuides: Guide[] = [
  {
    id: "guide-agent-instructions-comparison",
    title: "AGENTS.md vs CLAUDE.md vs Cursor rules vs Copilot instructions",
    slug: INSTRUCTION_COMPARISON_GUIDE_SLUG,
    summary:
      "Compare current repository instruction files by tool and surface, then use one shared policy with small adapters for Codex, Claude Code, Cursor, and GitHub Copilot.",
    intent:
      "Choose compatible instruction files, migrate Cursor rules carefully, and test AI coding tools without unsupported benchmark claims.",
    audience: "Developer tools teams, staff engineers, platform teams, and AI coding adopters.",
    pageType: "Evidence-backed compatibility guide",
    secondaryKeywords: [
      "AGENTS.md vs CLAUDE.md",
      "GitHub Copilot CLAUDE.md support",
      ".github/copilot-instructions.md",
      ".cursor/rules MDC migration",
      "AI coding agent instruction files",
    ],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "GitHub Copilot support for CLAUDE.md depends on the Copilot surface: selected cloud-agent surfaces support it, while many Copilot Chat, code-review, and CLI surfaces do not. Use .github/copilot-instructions.md for broad repository-wide Copilot compatibility. Keep AGENTS.md for Codex, CLAUDE.md for Claude Code, and current Cursor project rules in .cursor/rules/*.mdc.",
        ],
      },
      {
        heading: "Compatibility is a surface policy",
        body: [
          "Do not reduce compatibility to a single yes-or-no claim per vendor. OpenAI documents AGENTS.md discovery and nested precedence for Codex. Anthropic documents CLAUDE.md memory and scoped project guidance for Claude Code. GitHub publishes a support matrix because instruction-file support differs across Copilot surfaces. Cursor documents project rules under .cursor/rules with rule metadata controlling application.",
          "For Copilot specifically, GitHub's matrix lists CLAUDE.md for selected cloud-agent surfaces but not for many Chat, code-review, or CLI surfaces. A repository that needs broad Copilot coverage should therefore maintain .github/copilot-instructions.md even when CLAUDE.md is also present.",
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
        heading: "Migrate .cursorrules without inventing a deprecation",
        body: [
          "For maintained Cursor guidance, move rules toward the currently documented .cursor/rules/*.mdc format. Split a large .cursorrules file into focused rules, add descriptions and globs where scope matters, compare behavior, and remove the old file only after repository testing.",
          "The cited current Cursor rules page does not establish an official legacy or deprecation status for .cursorrules. Treat its status as unknown in current documentation rather than claiming Cursor has formally deprecated it.",
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
            "Codex repository instructions",
            "Root-to-working-directory discovery with nearer guidance taking precedence",
            "Put shared Codex setup, change, and verification rules at the repository root; use nested files for narrower scope",
          ],
        },
        {
          label: "CLAUDE.md",
          values: [
            "Claude Code project memory and instructions",
            "Copilot support exists on selected cloud-agent surfaces, not broadly across Chat, code review, and CLI",
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
            "Existing Cursor repository instruction file",
            "Legacy or deprecation status is unknown in the cited current documentation",
            "Test migration to .cursor/rules/*.mdc before removing the existing file",
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
        body: "Translate .cursorrules into scoped .mdc rules, preserve the old file during comparison, and remove it only after observed behavior and repository checks support the change. Do not label it officially deprecated without a source.",
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
        title: "Calling .cursorrules officially deprecated",
        fix: "State that its status is unknown in the cited current documentation, migrate toward .cursor/rules/*.mdc, and verify behavior before removal.",
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
        slug: "agents-md-template-for-ai-coding-agents",
        anchor: "AGENTS.md template for coding agents",
        reason: "Use the template to turn the shared policy into a concise Codex repository adapter.",
      },
      {
        slug: "codex-vs-claude-code",
        anchor: "Codex vs Claude Code",
        reason: "Compare the tool workflows after instruction-file compatibility and scope are controlled.",
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
    ],
    checklist: [
      "List every agent surface, not just each vendor name.",
      "Verify support against current publisher documentation.",
      "Use .github/copilot-instructions.md for broad Copilot repository coverage.",
      "Keep one canonical shared policy and identify every adapter.",
      "Put current Cursor project rules in .cursor/rules/*.mdc.",
      "Do not claim an official .cursorrules deprecation without evidence.",
      "Run the same task against the same repository state and criteria.",
      "Publish only measured success, elapsed time, cost, and human interventions.",
    ],
    evidence: [
      {
        title: "Use AGENTS.md with Codex",
        url: "https://developers.openai.com/codex/guides/agents-md",
        publisher: "OpenAI",
        note: "Documents Codex instruction discovery, precedence, scope, and fallback filenames.",
      },
      {
        title: "Claude Code memory documentation",
        url: "https://docs.anthropic.com/en/docs/claude-code/memory",
        publisher: "Anthropic",
        note: "Documents CLAUDE.md loading and scoped project memory behavior.",
      },
      {
        title: "GitHub Copilot custom instructions support matrix",
        url: "https://docs.github.com/en/copilot/reference/custom-instructions-support",
        publisher: "GitHub",
        note: "Lists instruction-file support by Copilot surface, including surface-specific CLAUDE.md support.",
      },
      {
        title: "Adding custom instructions for GitHub Copilot",
        url: "https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot",
        publisher: "GitHub",
        note: "Documents repository-wide and path-specific Copilot instruction files.",
      },
      {
        title: "Cursor rules documentation",
        url: "https://cursor.com/docs/rules",
        publisher: "Cursor",
        note: "Documents current project rules under .cursor/rules and their application metadata.",
      },
    ],
    relatedArticleSlugs: ["openai-codex-plugins-sites-annotations", "github-copilot-sdk-general-availability"],
    updatedAt: "2026-06-14",
    metaTitle: "AGENTS.md vs CLAUDE.md vs Cursor vs Copilot Instructions",
    metaDescription:
      "Compare AGENTS.md, CLAUDE.md, Cursor rules, and Copilot instructions in 2026 by surface, scope, migration path, and measured testing policy.",
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
    updatedAt: "2026-06-06",
    metaTitle: "Claude Code Subagents Workflow Examples",
    metaDescription:
      "Examples and checklists for using Claude Code subagents in research, implementation, review, and verification workflows.",
  },
  {
    id: "guide-claude-code-hooks-mcp",
    title: "Claude Code hooks and MCP setup guide",
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
          "Use hooks for deterministic lifecycle actions, MCP for external tools and data, and skills for reusable procedural knowledge. Keep security boundaries explicit: every external tool should have a reason, a scope, and a failure mode.",
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
          values: ["Reusable procedural knowledge", "SEO SOP, code review workflow, release checklist", "Outdated references or overly broad instructions"],
        },
        {
          label: "Manual approval",
          values: ["Destructive or production-facing changes", "Deployments, data deletion, billing changes", "Accidental write operations"],
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
    updatedAt: "2026-06-06",
    metaTitle: "Claude Code Hooks and MCP Setup Guide",
    metaDescription:
      "Set up Claude Code hooks, MCP servers, and skills with clear security boundaries and practical rollout checks.",
    resourceIds: ["claude-code-setup"],
  },
  {
    id: "guide-secure-mcp-servers",
    title: "MCP security checklist for AI coding agents",
    slug: MCP_SECURITY_GUIDE_SLUG,
    summary:
      "Use this MCP server security review to map threats, authentication, permissions, secrets, network reach, approvals, logs, and revocation before launch.",
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
          "Use an MCP security checklist before connecting any server: verify MCP authentication and token audience, grant the narrowest permissions, protect secrets, start with read-only capabilities, restrict network reach, and test revocation. Human approval and attributable audit logs are KyenAI operational recommendations for destructive or production actions, not requirements imposed by the MCP specification.",
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
      },
      {
        title: "MCP authorization specification",
        url: "https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization",
        publisher: "MCP",
        note: "Official requirements for HTTP authorization, protected resource metadata, tokens, scopes, and audience validation.",
      },
      {
        title: "MCP authorization security considerations",
        url: "https://modelcontextprotocol.io/specification/draft/basic/authorization/security-considerations",
        publisher: "MCP",
        note: "Official security considerations for token passthrough, SSRF, session threats, and local server compromise.",
      },
      {
        title: "MCP Inspector",
        url: "https://modelcontextprotocol.io/docs/tools/inspector",
        publisher: "MCP",
        note: "Official interactive workflow for validating resources, prompts, tools, notifications, and protocol exchanges.",
      },
    ],
    relatedArticleSlugs: ["github-copilot-cloud-local-sandboxes-preview", "visual-studio-agent-mode-mcp-general-availability"],
    updatedAt: "2026-06-14",
    metaTitle: "MCP Security Checklist for AI Coding Agents",
    metaDescription:
      "Review MCP server security with checks for authentication, permissions, secrets, network reach, approvals, audit logs, and revocation.",
    resourceIds: ["mcp-security"],
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
    updatedAt: "2026-06-06",
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
