import type { BenchmarkRun, InstructionTemplate, ToolInstructionSupport } from "./types";

export const instructionResourceVerifiedAt = "2026-07-14";

export const instructionDocumentationSources = {
  codex: "https://learn.chatgpt.com/docs/agent-configuration/agents-md",
  claude: "https://code.claude.com/docs/en/memory",
  copilotSupport: "https://docs.github.com/en/copilot/reference/custom-instructions-support",
  copilotInstructions:
    "https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions",
  cursor: "https://docs.cursor.com/context/rules-for-ai",
  cursorCli: "https://docs.cursor.com/en/cli/using",
} as const;

const sources = instructionDocumentationSources;

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
    id: "claude-code-agents-md-import",
    toolId: "claude-code",
    toolName: "Claude Code",
    path: "CLAUDE.md containing @AGENTS.md",
    status: "documented",
    scopes: ["repository"],
    surfaces: ["Claude Code"],
    priority:
      "Claude Code does not read AGENTS.md directly. Its documented bridge is a CLAUDE.md file that imports @AGENTS.md, followed by any Claude-specific guidance.",
    nesting:
      "The imported path resolves relative to the CLAUDE.md file. Imports can recurse to a maximum depth of four hops; a symlink is another documented option where supported.",
    recommendation:
      "Use @AGENTS.md from CLAUDE.md when Codex, Copilot, and Claude Code should share a single shared baseline without duplicating repository rules.",
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
      "GitHub.com Copilot cloud agent",
      "GitHub.com Copilot code review",
      "VS Code Copilot Chat",
      "VS Code Copilot cloud agent",
      "VS Code Copilot code review",
      "Visual Studio Copilot Chat",
      "Visual Studio Copilot code review",
      "JetBrains Copilot Chat",
      "JetBrains Copilot cloud agent",
      "JetBrains Copilot code review",
      "Eclipse Copilot Chat",
      "Eclipse Copilot cloud agent",
      "Xcode Copilot Chat",
      "Xcode Copilot cloud agent",
      "Xcode Copilot code review",
      "Copilot CLI",
    ],
    priority: "Repository-wide instructions are combined with applicable path-specific instructions where supported.",
    nesting: "This file has one fixed repository-wide location; use .github/instructions/*.instructions.md for paths.",
    recommendation:
      "Use .github/copilot-instructions.md as the most portable Copilot baseline, even when AGENTS.md or CLAUDE.md also exists for agent-specific surfaces.",
    sourceUrl: sources.copilotSupport,
    publisher: "GitHub",
    verifiedAt: instructionResourceVerifiedAt,
  },
  {
    id: "copilot-path-specific-instructions",
    toolId: "github-copilot",
    toolName: "GitHub Copilot",
    path: ".github/instructions/**/*.instructions.md",
    status: "documented",
    scopes: ["path-specific"],
    surfaces: [
      "GitHub.com Copilot cloud agent",
      "GitHub.com Copilot code review",
      "VS Code Copilot Chat",
      "VS Code Copilot cloud agent",
      "Visual Studio Copilot Chat",
      "JetBrains Copilot Chat",
      "JetBrains Copilot cloud agent",
      "JetBrains Copilot code review",
      "Eclipse Copilot cloud agent",
      "Xcode Copilot Chat",
      "Xcode Copilot cloud agent",
      "Xcode Copilot code review",
      "Copilot CLI",
    ],
    priority:
      "When a file path matches and repository-wide instructions also exist, GitHub documents that both instruction sets are used.",
    nesting:
      "Path-specific files live under .github/instructions and are combined with .github/copilot-instructions.md where the selected surface supports them.",
    recommendation:
      "Use path-specific files for language, package, or directory rules, but keep cross-repository commands and guardrails in the repository-wide Copilot file.",
    sourceUrl: sources.copilotInstructions,
    publisher: "GitHub",
    verifiedAt: instructionResourceVerifiedAt,
  },
  {
    id: "copilot-agents-md",
    toolId: "github-copilot",
    toolName: "GitHub Copilot",
    path: "AGENTS.md",
    status: "documented",
    scopes: ["repository", "nested-directory"],
    surfaces: [
      "GitHub.com Copilot cloud agent",
      "GitHub.com Copilot code review",
      "VS Code Copilot Chat",
      "VS Code Copilot cloud agent",
      "JetBrains Copilot cloud agent",
      "Eclipse Copilot cloud agent",
      "Xcode Copilot cloud agent",
      "Copilot CLI",
    ],
    priority:
      "GitHub documents that the nearest AGENTS.md file in the directory tree takes precedence when Copilot is working.",
    nesting:
      "One or more AGENTS.md files may be stored throughout the repository; surface support still varies according to GitHub's current matrix.",
    recommendation:
      "Use AGENTS.md for nested agent guidance shared with Codex and supported Copilot surfaces, plus .github/copilot-instructions.md when broad Copilot coverage matters.",
    sourceUrl: sources.copilotInstructions,
    publisher: "GitHub",
    verifiedAt: instructionResourceVerifiedAt,
  },
  {
    id: "copilot-claude-md-documented-surfaces",
    toolId: "github-copilot",
    toolName: "GitHub Copilot",
    path: "CLAUDE.md",
    status: "documented",
    scopes: ["repository"],
    surfaces: [
      "GitHub.com Copilot cloud agent",
      "VS Code Copilot cloud agent",
      "JetBrains Copilot cloud agent",
      "Eclipse Copilot cloud agent",
      "Xcode Copilot cloud agent",
      "Copilot CLI",
    ],
    priority:
      "GitHub's support matrix lists CLAUDE.md as agent instructions on these cloud-agent surfaces and in Copilot CLI.",
    nesting: "The support matrix establishes file-type support by surface; no broader CLAUDE.md scope behavior is inferred here.",
    recommendation:
      "Keep CLAUDE.md when Claude Code is part of the workflow or Copilot CLI should reuse it, but add .github/copilot-instructions.md for Copilot surfaces beyond agent instructions.",
    sourceUrl: sources.copilotSupport,
    publisher: "GitHub",
    verifiedAt: instructionResourceVerifiedAt,
  },
  {
    id: "copilot-claude-md-unlisted-surfaces",
    toolId: "github-copilot",
    toolName: "GitHub Copilot",
    path: "CLAUDE.md",
    status: "unsupported",
    scopes: ["repository"],
    surfaces: [
      "GitHub.com Copilot Chat",
      "GitHub.com Copilot code review",
      "VS Code Copilot Chat",
      "VS Code Copilot code review",
      "Visual Studio Copilot Chat",
      "Visual Studio Copilot code review",
      "JetBrains Copilot Chat",
      "JetBrains Copilot code review",
      "Eclipse Copilot Chat",
      "Eclipse Copilot code review",
      "Xcode Copilot Chat",
      "Xcode Copilot code review",
    ],
    priority: "GitHub's current support matrix does not list CLAUDE.md agent instructions for these surfaces.",
    nesting: "Do not rely on CLAUDE.md to provide Copilot instructions on a surface where the matrix does not list it.",
    recommendation: "Mirror shared guidance in .github/copilot-instructions.md and use AGENTS.md only where its surface is documented.",
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
    surfaces: ["Cursor IDE", "Cursor CLI"],
    priority: "Rule metadata controls whether a rule is always applied, matched to files, requested, or selected manually.",
    nesting: "Store focused project rules under .cursor/rules and use matching metadata to limit their scope.",
    recommendation: "Prefer small .mdc rules with explicit descriptions and globs over one large repository prompt.",
    sourceUrl: sources.cursor,
    publisher: "Cursor",
    verifiedAt: instructionResourceVerifiedAt,
  },
  {
    id: "cursor-agents-md-ide",
    toolId: "cursor",
    toolName: "Cursor",
    path: "AGENTS.md (project root)",
    status: "documented",
    scopes: ["repository"],
    surfaces: ["Cursor IDE"],
    priority:
      "Cursor documents root-level AGENTS.md as a plain Markdown alternative to .cursor/rules for straightforward project-wide instructions.",
    nesting:
      "The cited Cursor IDE documentation limits AGENTS.md to the project root and global scope; it does not document nested AGENTS.md support on this surface.",
    recommendation:
      "Use root AGENTS.md when one readable project-wide file is sufficient; use .cursor/rules when metadata, path scoping, or multiple focused rules are needed.",
    sourceUrl: sources.cursor,
    publisher: "Cursor",
    verifiedAt: instructionResourceVerifiedAt,
  },
  {
    id: "cursor-agents-md-cli",
    toolId: "cursor",
    toolName: "Cursor",
    path: "AGENTS.md (project root)",
    status: "documented",
    scopes: ["repository"],
    surfaces: ["Cursor CLI"],
    priority: "Cursor CLI reads AGENTS.md at the project root and applies it alongside .cursor/rules.",
    nesting: "The cited CLI page documents the project-root file and does not establish nested AGENTS.md discovery.",
    recommendation: "Use AGENTS.md to share a simple root policy with Codex and Cursor CLI; keep Cursor-specific scoped rules in .cursor/rules.",
    sourceUrl: sources.cursorCli,
    publisher: "Cursor",
    verifiedAt: instructionResourceVerifiedAt,
  },
  {
    id: "cursor-claude-md-cli",
    toolId: "cursor",
    toolName: "Cursor",
    path: "CLAUDE.md (project root)",
    status: "documented",
    scopes: ["repository"],
    surfaces: ["Cursor CLI"],
    priority: "Cursor CLI reads CLAUDE.md at the project root and applies it alongside .cursor/rules.",
    nesting: "The cited CLI page documents the project-root file and does not establish Claude Code's broader memory precedence inside Cursor.",
    recommendation: "Reuse CLAUDE.md in Cursor CLI when the shared root policy is intentional; use .cursor/rules for Cursor-specific scope and metadata.",
    sourceUrl: sources.cursorCli,
    publisher: "Cursor",
    verifiedAt: instructionResourceVerifiedAt,
  },
  {
    id: "cursor-cursorrules-legacy",
    toolId: "cursor",
    toolName: "Cursor",
    path: ".cursorrules",
    status: "legacy",
    scopes: ["repository"],
    surfaces: ["Cursor IDE"],
    priority:
      "Cursor documents .cursorrules as a legacy root file that remains supported but is deprecated in favor of Project Rules.",
    nesting:
      "The legacy file is repository-wide and does not provide the metadata or nested rule organization available under .cursor/rules.",
    recommendation:
      "Migrate this deprecated legacy format to .cursor/rules, compare behavior before removal, and keep the old file only while an older workflow still depends on it.",
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

## Scope
- These instructions apply to the entire repository.

## Setup
- Install dependencies with \`npm ci\`.

## Change and safety rules
- Read nearby implementation and tests before editing.
- Follow existing architecture, naming, and formatting.
- Do not edit generated files or expose secrets.
- Ask before destructive database or dependency changes.

## Verification
- Run \`npm run lint\` and \`npm test\` after code changes.
- Run \`npm run build\` for production-facing changes.

## Completion
- Report changed files, test results, and unresolved risks.`,
    cautions: [
      "Set alwaysApply to false and add globs when a rule should cover only selected files.",
      "If the repository still has the deprecated .cursorrules file, compare behavior before removing it during migration.",
    ],
  },
];

export const agentsMdVariantTemplates: InstructionTemplate[] = [
  {
    id: "agents-md-node-template",
    title: "Node.js AGENTS.md",
    targetPath: "examples/node/AGENTS.md",
    downloadName: "AGENTS.node.md",
    purpose: "Give Codex concrete Node.js setup, lint, test, build, safety, and delivery rules.",
    applicableToolIds: ["openai-codex", "github-copilot"],
    body: `# Node.js repository instructions

## Scope
- These instructions apply to the whole Node.js repository.
- Read a nearer AGENTS.md before editing a nested package.

## Setup
- Install the locked dependency graph with \`npm ci\`.
- Start local development with \`npm run dev\`.

## Project map
- Application code: \`src/\`
- Tests: \`tests/\` or colocated \`*.test.*\` files
- Generated output: \`dist/\`, \`.next/\`, and coverage folders

## Change rules
- Reuse existing modules before adding a production dependency.
- Do not edit generated output or dependency lockfiles unless the task requires it.
- Keep public APIs backward compatible unless the request explicitly changes them.
- Never expose secrets, tokens, or customer data in code, fixtures, logs, or output.

## Verification
- Run \`npm run lint\`.
- Run \`npm test\`.
- Run \`npm run build\` for production-facing changes.

## Delivery
- Summarize changed files and observable behavior.
- Report exact verification results, skipped checks, and remaining risks.`,
    cautions: [
      "Keep only commands that exist in package.json and work from a clean checkout.",
      "Replace paths and generated folders with the repository's real layout.",
    ],
  },
  {
    id: "agents-md-python-template",
    title: "Python AGENTS.md",
    targetPath: "examples/python/AGENTS.md",
    downloadName: "AGENTS.python.md",
    purpose: "Give Codex explicit Python environment, test, formatting, migration, and secret-handling rules.",
    applicableToolIds: ["openai-codex", "github-copilot"],
    body: `# Python repository instructions

## Scope
- These instructions apply to the Python service in this repository.
- Follow a nearer AGENTS.md when a package has different commands or ownership.

## Setup
- Create a virtual environment with \`python -m venv .venv\`.
- Install dependencies with \`.venv/bin/python -m pip install -r requirements.txt\`.

## Project map
- Application code: \`src/\` or the documented package directory
- Tests: \`tests/\`
- Migrations: the repository's migration directory

## Change rules
- Use the project virtual environment for commands and tests.
- Do not edit migrations, lockfiles, generated clients, or production data without approval.
- Keep secrets out of source, fixtures, snapshots, logs, and prompts.
- Preserve public function and API behavior unless the request explicitly changes it.

## Verification
- Run \`.venv/bin/python -m pytest\`.
- Run the repository's configured formatter and linter.
- Run type checking when the project configures it.

## Delivery
- Summarize changed modules and behavior.
- Report exact test results, skipped checks, migration impact, and remaining risks.`,
    cautions: [
      "Replace the virtual-environment, package, migration, lint, and type-check commands with project-specific values.",
      "Do not add a new formatter or type checker merely because the template mentions those checks.",
    ],
  },
  {
    id: "agents-md-monorepo-template",
    title: "Monorepo AGENTS.md",
    targetPath: "examples/monorepo/AGENTS.md",
    downloadName: "AGENTS.monorepo.md",
    purpose: "Define root policy, workspace commands, nested overrides, and cross-package boundaries for a monorepo.",
    applicableToolIds: ["openai-codex", "github-copilot"],
    body: `# Monorepo instructions

## Scope and precedence
- This root AGENTS.md defines shared policy for every workspace.
- Read the nearest nested AGENTS.md before editing a package.
- A nested file should override only commands, paths, or ownership that differ locally.

## Setup
- Install the full workspace from the repository root with \`npm ci\`.
- Do not run a second package manager inside a workspace.

## Workspace map
- Applications: \`apps/\`
- Shared packages: \`packages/\`
- Generated artifacts: \`generated/\`, \`dist/\`, and build-cache folders

## Change rules
- Keep package-specific edits inside the owning workspace when possible.
- Coordinate public API changes with every consuming workspace and its tests.
- Do not edit generated artifacts, deployment manifests, migrations, or lockfiles without task-specific justification.
- Never expose repository, CI, or production credentials.

## Verification
- Run root lint and unit tests.
- Run the affected workspace's focused tests and build.
- Run cross-workspace integration checks when a shared package changes.

## Delivery
- List affected workspaces, changed public APIs, and generated outputs.
- Report focused and root verification results, skipped checks, and rollout risks.`,
    cautions: [
      "Replace npm commands with the repository's actual workspace runner and package filters.",
      "Create nested AGENTS.md files only where commands or ownership differ; avoid duplicating the root policy.",
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
