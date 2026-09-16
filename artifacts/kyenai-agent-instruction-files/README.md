# KyenAI agent instruction files

Reusable, source-backed instruction templates and compatibility data for common AI coding tools.

Verified: 2026-07-14

## Included files

| Template | Intended path | Purpose |
| --- | --- | --- |
| `AGENTS.md` | `AGENTS.md` | Give coding agents repository-wide setup, change, and verification rules. |
| `CLAUDE.md` | `CLAUDE.md` | Provide Claude Code with durable repository context and working agreements. |
| `copilot-instructions.md` | `.github/copilot-instructions.md` | Set a broadly compatible repository-wide baseline for GitHub Copilot. |
| `cursor-project-rule.mdc` | `.cursor/rules/project-guidance.mdc` | Create a scoped Cursor project rule in the current .mdc format. |
| `AGENTS.node.md` | `examples/node/AGENTS.md` | Give Codex concrete Node.js setup, lint, test, build, safety, and delivery rules. |
| `AGENTS.python.md` | `examples/python/AGENTS.md` | Give Codex explicit Python environment, test, formatting, migration, and secret-handling rules. |
| `AGENTS.monorepo.md` | `examples/monorepo/AGENTS.md` | Define root policy, workspace commands, nested overrides, and cross-package boundaries for a monorepo. |

The package also includes JSON and CSV compatibility data, a benchmark protocol, unmeasured benchmark results, a verifier, and an example repository.

## Compatibility sources

| Tool | Instruction path | Surfaces | Status | Source |
| --- | --- | --- | --- | --- |
| OpenAI Codex | `AGENTS.override.md → AGENTS.md → configured fallback filename` | Codex app; Codex CLI; Codex IDE extension; Codex web | documented | [OpenAI](https://learn.chatgpt.com/docs/agent-configuration/agents-md) |
| Claude Code | `CLAUDE.md` | Claude Code | documented | [Anthropic](https://code.claude.com/docs/en/memory) |
| Claude Code | `CLAUDE.md containing @AGENTS.md` | Claude Code | documented | [Anthropic](https://code.claude.com/docs/en/memory) |
| GitHub Copilot | `.github/copilot-instructions.md` | GitHub.com Copilot Chat; GitHub.com Copilot cloud agent; GitHub.com Copilot code review; VS Code Copilot Chat; VS Code Copilot cloud agent; VS Code Copilot code review; Visual Studio Copilot Chat; Visual Studio Copilot code review; JetBrains Copilot Chat; JetBrains Copilot cloud agent; JetBrains Copilot code review; Eclipse Copilot Chat; Eclipse Copilot cloud agent; Xcode Copilot Chat; Xcode Copilot cloud agent; Xcode Copilot code review; Copilot CLI | documented | [GitHub](https://docs.github.com/en/copilot/reference/custom-instructions-support) |
| GitHub Copilot | `.github/instructions/**/*.instructions.md` | GitHub.com Copilot cloud agent; GitHub.com Copilot code review; VS Code Copilot Chat; VS Code Copilot cloud agent; Visual Studio Copilot Chat; JetBrains Copilot Chat; JetBrains Copilot cloud agent; JetBrains Copilot code review; Eclipse Copilot cloud agent; Xcode Copilot Chat; Xcode Copilot cloud agent; Xcode Copilot code review; Copilot CLI | documented | [GitHub](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions) |
| GitHub Copilot | `AGENTS.md` | GitHub.com Copilot cloud agent; GitHub.com Copilot code review; VS Code Copilot Chat; VS Code Copilot cloud agent; JetBrains Copilot cloud agent; Eclipse Copilot cloud agent; Xcode Copilot cloud agent; Copilot CLI | documented | [GitHub](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions) |
| GitHub Copilot | `CLAUDE.md` | GitHub.com Copilot cloud agent; VS Code Copilot cloud agent; JetBrains Copilot cloud agent; Eclipse Copilot cloud agent; Xcode Copilot cloud agent; Copilot CLI | documented | [GitHub](https://docs.github.com/en/copilot/reference/custom-instructions-support) |
| GitHub Copilot | `CLAUDE.md` | GitHub.com Copilot Chat; GitHub.com Copilot code review; VS Code Copilot Chat; VS Code Copilot code review; Visual Studio Copilot Chat; Visual Studio Copilot code review; JetBrains Copilot Chat; JetBrains Copilot code review; Eclipse Copilot Chat; Eclipse Copilot code review; Xcode Copilot Chat; Xcode Copilot code review | unsupported | [GitHub](https://docs.github.com/en/copilot/reference/custom-instructions-support) |
| Cursor | `.cursor/rules/*.mdc` | Cursor IDE; Cursor CLI | documented | [Cursor](https://docs.cursor.com/context/rules-for-ai) |
| Cursor | `AGENTS.md (project root)` | Cursor IDE | documented | [Cursor](https://docs.cursor.com/context/rules-for-ai) |
| Cursor | `AGENTS.md (project root)` | Cursor CLI | documented | [Cursor](https://docs.cursor.com/en/cli/using) |
| Cursor | `CLAUDE.md (project root)` | Cursor CLI | documented | [Cursor](https://docs.cursor.com/en/cli/using) |
| Cursor | `.cursorrules` | Cursor IDE | legacy | [Cursor](https://docs.cursor.com/context/rules-for-ai) |

Compatibility claims are limited to the linked publisher documentation and the verified date above.

## Benchmark status

**Not measured.** No controlled benchmark run has been completed. Numeric metrics are null, and this package contains no benchmark estimates.

## Example layout

```text
example-repository/
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
    └── api/
```

## Use

1. Choose the template for the tool and repository scope you need.
2. Replace example commands and paths with values verified in your repository.
3. Keep shared guidance consistent across tool-specific files.
4. Run `node verifier/verify-instructions.mjs example-repository` to check the included example.

The templates are starters, not claims about a repository that has not been inspected.
