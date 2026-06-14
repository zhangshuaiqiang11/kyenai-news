import type { BenchmarkRun, InstructionTemplate, ToolInstructionSupport } from "./types";

export const instructionResourceVerifiedAt = "2026-06-14";

const sources = {
  codex: "https://developers.openai.com/codex/guides/agents-md",
  claude: "https://docs.anthropic.com/en/docs/claude-code/memory",
  copilotSupport: "https://docs.github.com/en/copilot/reference/custom-instructions-support",
  copilotInstructions:
    "https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot",
  cursor: "https://cursor.com/docs/rules",
} as const;

export const toolInstructionSupport: ToolInstructionSupport[] = [
  {
    id: "codex-agents-md",
    toolId: "openai-codex",
    toolName: "OpenAI Codex",
    path: "AGENTS.override.md → AGENTS.md → configured fallback filename",
    status: "documented",
    scopes: ["user", "repository", "nested-directory"],
    surfaces: ["Codex app", "Codex CLI", "Codex IDE extension", "Codex web"],
    priority:
      "At startup, Codex reads the first non-empty global file from AGENTS.override.md then AGENTS.md. From the project root to the initial working directory, each directory contributes at most one non-empty file selected in this order: AGENTS.override.md, AGENTS.md, then configured project_doc_fallback_filenames.",
    nesting:
      "Codex concatenates the selected project files from root toward the initial working directory. Closer files appear later and override earlier guidance; discovery stops at that initial working directory rather than expanding dynamically into other directories.",
    recommendation:
      "Keep shared rules in root AGENTS.md, use AGENTS.override.md only where it should win within one directory, and reserve configured fallback filenames for repositories that require another recognized name.",
    sourceUrl: sources.codex,
    publisher: "OpenAI",
    verifiedAt: instructionResourceVerifiedAt,
  },
  {
    id: "claude-code-claude-md",
    toolId: "claude-code",
    toolName: "Claude Code",
    path: "CLAUDE.md",
    status: "documented",
    scopes: ["user", "repository", "nested-directory", "path-specific"],
    surfaces: ["Claude Code"],
    priority:
      "CLAUDE.md files above the working directory load at launch; files in child directories load when Claude works with files there.",
    nesting: "Use nested CLAUDE.md files or path-scoped rules for instructions that should not apply repository-wide.",
    recommendation: "Put stable repository commands in root CLAUDE.md and move specialized guidance into scoped files.",
    sourceUrl: sources.claude,
    publisher: "Anthropic",
    verifiedAt: instructionResourceVerifiedAt,
  },
  {
    id: "copilot-repository-instructions",
    toolId: "github-copilot",
    toolName: "GitHub Copilot",
    path: ".github/copilot-instructions.md",
    status: "documented",
    scopes: ["repository"],
    surfaces: [
      "GitHub.com Copilot Chat",
      "Copilot cloud agent",
      "Copilot code review",
      "VS Code Copilot Chat",
      "Visual Studio Copilot Chat",
      "JetBrains Copilot Chat",
      "Eclipse Copilot Chat",
      "Xcode Copilot Chat",
      "Copilot CLI",
    ],
    priority: "Repository-wide instructions are combined with applicable path-specific instructions where supported.",
    nesting: "This file has one fixed repository-wide location; use .github/instructions/*.instructions.md for paths.",
    recommendation:
      "Use .github/copilot-instructions.md as the broad-compatibility Copilot baseline, even when agent-specific files also exist.",
    sourceUrl: sources.copilotSupport,
    publisher: "GitHub",
    verifiedAt: instructionResourceVerifiedAt,
  },
  {
    id: "copilot-claude-md-cloud-agent",
    toolId: "github-copilot",
    toolName: "GitHub Copilot",
    path: "CLAUDE.md",
    status: "documented",
    scopes: ["repository"],
    surfaces: [
      "GitHub.com Copilot cloud agent",
      "Visual Studio Code Copilot cloud agent",
      "JetBrains IDEs Copilot cloud agent",
      "Eclipse Copilot cloud agent",
      "Xcode Copilot cloud agent",
    ],
    priority:
      "GitHub's support matrix lists CLAUDE.md agent instructions for these cloud agent surfaces, separately from Copilot Chat in the same IDE.",
    nesting: "The support matrix establishes file-type support by surface; no broader CLAUDE.md scope behavior is inferred here.",
    recommendation:
      "Keep CLAUDE.md when Claude Code is part of the workflow, but add .github/copilot-instructions.md for Copilot surfaces beyond the cloud agent.",
    sourceUrl: sources.copilotSupport,
    publisher: "GitHub",
    verifiedAt: instructionResourceVerifiedAt,
  },
  {
    id: "copilot-claude-md-other-surfaces",
    toolId: "github-copilot",
    toolName: "GitHub Copilot",
    path: "CLAUDE.md",
    status: "unsupported",
    scopes: ["repository"],
    surfaces: [
      "GitHub.com Copilot Chat",
      "GitHub.com Copilot code review",
      "Visual Studio Code Copilot Chat",
      "Visual Studio Code Copilot code review",
      "Visual Studio Copilot Chat",
      "Visual Studio Copilot code review",
      "JetBrains IDEs Copilot Chat",
      "JetBrains IDEs Copilot code review",
      "Eclipse Copilot Chat",
      "Eclipse Copilot code review",
      "Xcode Copilot Chat",
      "Xcode Copilot code review",
      "Copilot CLI",
    ],
    priority: "GitHub's support matrix does not list CLAUDE.md for these surfaces.",
    nesting: "Do not rely on CLAUDE.md to provide instructions on these surfaces.",
    recommendation: "Mirror shared Copilot guidance in .github/copilot-instructions.md.",
    sourceUrl: sources.copilotSupport,
    publisher: "GitHub",
    verifiedAt: instructionResourceVerifiedAt,
  },
  {
    id: "cursor-project-rules",
    toolId: "cursor",
    toolName: "Cursor",
    path: ".cursor/rules/*.mdc",
    status: "documented",
    scopes: ["repository", "path-specific"],
    surfaces: ["Cursor"],
    priority: "Rule metadata controls whether a rule is always applied, matched to files, requested, or selected manually.",
    nesting: "Store focused project rules under .cursor/rules and use matching metadata to limit their scope.",
    recommendation: "Prefer small .mdc rules with explicit descriptions and globs over one large repository prompt.",
    sourceUrl: sources.cursor,
    publisher: "Cursor",
    verifiedAt: instructionResourceVerifiedAt,
  },
  {
    id: "cursor-cursorrules-status-unknown",
    toolId: "cursor",
    toolName: "Cursor",
    path: ".cursorrules",
    status: "unknown",
    scopes: ["repository"],
    surfaces: ["Cursor"],
    priority:
      "The current Cursor rules documentation prescribes project rules under .cursor/rules; it does not, on the cited page, establish an official legacy or deprecation status for .cursorrules.",
    nesting:
      "No nesting or precedence behavior for .cursorrules is asserted here because the cited current documentation does not establish it.",
    recommendation:
      "For new maintained guidance, follow the currently documented .cursor/rules project-rule format. Review existing .cursorrules behavior separately before removing it.",
    sourceUrl: sources.cursor,
    publisher: "Cursor",
    verifiedAt: instructionResourceVerifiedAt,
  },
];

export const instructionTemplates: InstructionTemplate[] = [
  {
    id: "agents-md-template",
    title: "Repository AGENTS.md",
    targetPath: "AGENTS.md",
    downloadName: "AGENTS.md",
    purpose: "Give coding agents repository-wide setup, change, and verification rules.",
    applicableToolIds: ["openai-codex", "github-copilot"],
    body: `# Repository instructions

## Scope
- These instructions apply to the whole repository.
- Read a nearer AGENTS.md before editing files in a nested directory.

## Setup
- Install dependencies with \`npm ci\`.
- Start local development with \`npm run dev\`.

## Change rules
- Follow existing module boundaries and naming conventions.
- Do not change generated files or lockfiles unless the task requires it.
- Keep user-facing behavior backward compatible unless the request says otherwise.

## Verification
- Run \`npm run lint\`.
- Run \`npm test\`.
- Run \`npm run build\` for production-facing changes.

## Delivery
- Summarize changed files and verification results.
- Report skipped checks and remaining risks explicitly.`,
    cautions: [
      "Replace commands with commands that actually exist in the repository.",
      "Put directory-specific exceptions in a nested AGENTS.md instead of expanding the root file.",
    ],
  },
  {
    id: "claude-md-template",
    title: "Claude Code CLAUDE.md",
    targetPath: "CLAUDE.md",
    downloadName: "CLAUDE.md",
    purpose: "Provide Claude Code with durable repository context and working agreements.",
    applicableToolIds: ["claude-code", "github-copilot"],
    body: `# Project context

This repository is a production application. Prefer small, reviewable changes that follow existing patterns.

## Key locations
- Application code: \`src/\`
- Tests: \`tests/\`
- Documentation: \`docs/\`

## Workflow
1. Read the affected module and its nearest tests before editing.
2. Reuse existing helpers and dependencies.
3. Add or update focused tests for behavior changes.
4. Run \`npm test\` and \`npm run lint\`.

## Guardrails
- Never expose credentials or copy secrets into output.
- Do not rewrite unrelated code.
- Ask before destructive data, schema, or dependency changes.

## Completion
State what changed, what was verified, and any known limitation.`,
    cautions: [
      "Copilot support for CLAUDE.md varies by surface; keep Copilot-wide rules in .github/copilot-instructions.md.",
      "Use nested CLAUDE.md or scoped rules when guidance applies only to part of a large repository.",
    ],
  },
  {
    id: "copilot-instructions-template",
    title: "GitHub Copilot repository instructions",
    targetPath: ".github/copilot-instructions.md",
    downloadName: "copilot-instructions.md",
    purpose: "Set a broadly compatible repository-wide baseline for GitHub Copilot.",
    applicableToolIds: ["github-copilot"],
    body: `# Copilot repository instructions

## Repository conventions
- Use the existing language, framework, and folder patterns.
- Prefer existing utilities over adding dependencies.
- Keep public APIs backward compatible unless the task explicitly changes them.

## Implementation
- Read nearby code and tests before proposing edits.
- Make the smallest complete change that solves the request.
- Add tests for fixes and user-visible behavior.
- Do not modify generated artifacts manually.

## Validation
- Run \`npm run lint\`.
- Run \`npm test\`.
- Run \`npm run build\` when build output or routing changes.

## Response
- Cite the files changed.
- Include exact validation results.
- Call out assumptions, skipped checks, and security implications.`,
    cautions: [
      "Keep this file repository-wide; use .github/instructions/*.instructions.md for path-specific guidance.",
      "Verify each listed command in package scripts or project documentation.",
    ],
  },
  {
    id: "cursor-project-rule-template",
    title: "Cursor project rule",
    targetPath: ".cursor/rules/project-guidance.mdc",
    downloadName: "cursor-project-rule.mdc",
    purpose: "Create a scoped Cursor project rule in the current .mdc format.",
    applicableToolIds: ["cursor"],
    body: `---
description: Repository implementation and verification standards
globs:
alwaysApply: true
---

# Project guidance

- Read nearby implementation and tests before editing.
- Follow existing architecture, naming, and formatting.
- Prefer focused changes over broad refactors.
- Do not edit generated files unless generation is part of the task.
- Run \`npm run lint\` and \`npm test\` after code changes.
- Run \`npm run build\` for production-facing changes.
- Report changed files, test results, and unresolved risks.`,
    cautions: [
      "Set alwaysApply to false and add globs when a rule should cover only selected files.",
      "If the repository already has .cursorrules, review its behavior before transferring guidance; this template does not assert an official deprecation status.",
    ],
  },
];

export const repositoryTree = `example-repository/
├── AGENTS.md
├── CLAUDE.md
├── .github/
│   └── copilot-instructions.md
├── .cursor/
│   └── rules/
│       └── project-guidance.mdc
├── apps/
│   └── web/
│       └── AGENTS.md
└── packages/
    └── api/`;

const notMeasuredRun = (toolId: BenchmarkRun["toolId"]): BenchmarkRun => ({
  id: `instruction-drift-fix-001-${toolId}`,
  toolId,
  toolVersion: null,
  status: "not-measured",
  metricSource: "unavailable",
  elapsedSeconds: null,
  measuredCostUsd: null,
  humanInterventions: null,
  filesChanged: null,
  verificationPassed: null,
  evidenceUrl: null,
  limitations: ["No controlled run has been completed; no values are estimated."],
});

export const benchmarkProtocol = {
  repository: "KyenAI public instruction example repository",
  revision: null,
  taskId: "instruction-drift-fix-001",
  task:
    "Correct one stale test command in repository instructions and make all tool-specific files consistent without changing application code.",
  successCriteria: [
    "All instruction files name the same test command.",
    "The repository verification command passes.",
    "No application source file changes.",
  ],
  verificationCommand: "node scripts/verify-instructions.mjs",
  measurementRules: [
    "Record values only from a completed controlled run.",
    "Attach an evidence URL or artifact for every completed run.",
    "Leave every numeric metric null when a run is not measured; never estimate.",
  ],
  runs: [
    notMeasuredRun("openai-codex"),
    notMeasuredRun("claude-code"),
    notMeasuredRun("github-copilot"),
    notMeasuredRun("cursor"),
  ],
};
