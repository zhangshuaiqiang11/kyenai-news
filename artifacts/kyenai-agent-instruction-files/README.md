# KyenAI agent instruction files

Reusable, source-backed instruction templates and compatibility data for common AI coding tools.

Verified: 2026-06-14

## Included files

| Template | Intended path | Purpose |
| --- | --- | --- |
| `AGENTS.md` | `AGENTS.md` | Give coding agents repository-wide setup, change, and verification rules. |
| `CLAUDE.md` | `CLAUDE.md` | Provide Claude Code with durable repository context and working agreements. |
| `copilot-instructions.md` | `.github/copilot-instructions.md` | Set a broadly compatible repository-wide baseline for GitHub Copilot. |
| `cursor-project-rule.mdc` | `.cursor/rules/project-guidance.mdc` | Create a scoped Cursor project rule in the current .mdc format. |

The package also includes JSON and CSV compatibility data, a benchmark protocol, unmeasured benchmark results, a verifier, and an example repository.

## Compatibility sources

| Tool | Instruction path | Status | Source |
| --- | --- | --- | --- |
| OpenAI Codex | `AGENTS.override.md → AGENTS.md → configured fallback filename` | documented | [OpenAI](https://developers.openai.com/codex/guides/agents-md) |
| Claude Code | `CLAUDE.md` | documented | [Anthropic](https://docs.anthropic.com/en/docs/claude-code/memory) |
| GitHub Copilot | `.github/copilot-instructions.md` | documented | [GitHub](https://docs.github.com/en/copilot/reference/custom-instructions-support) |
| GitHub Copilot | `CLAUDE.md` | documented | [GitHub](https://docs.github.com/en/copilot/reference/custom-instructions-support) |
| GitHub Copilot | `CLAUDE.md` | unsupported | [GitHub](https://docs.github.com/en/copilot/reference/custom-instructions-support) |
| Cursor | `.cursor/rules/*.mdc` | documented | [Cursor](https://cursor.com/docs/rules) |
| Cursor | `.cursorrules` | unknown | [Cursor](https://cursor.com/docs/rules) |

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
