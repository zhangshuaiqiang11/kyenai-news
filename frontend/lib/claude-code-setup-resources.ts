import type { CodeExampleCardProps } from "../components/CodeExampleCard";

export const claudeCodeSetupVerifiedAt = "2026-06-14";

export const claudeCodeSetupExamples: Array<CodeExampleCardProps & { id: string; targetPath: string }> = [
  {
    id: "claude-settings-hooks",
    title: "Claude Code hooks configuration",
    targetPath: ".claude/settings.json",
    purpose: "Run deterministic checks after file edits without giving the agent extra discretion.",
    body: `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint -- --fix"
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "npm test -- --runInBand"
          }
        ]
      }
    ]
  }
}`,
    cautions: [
      "Replace commands with scripts that exist in the repository and finish within your hook timeout.",
      "Keep hooks narrow: format, lint, or notify — not broad network or write operations.",
    ],
  },
  {
    id: "claude-settings-mcp",
    title: "Claude Code MCP server entry",
    targetPath: ".claude/settings.json",
    purpose: "Register a read-only MCP server with explicit command, args, and environment gates.",
    body: `{
  "mcpServers": {
    "github-readonly": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "\${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  }
}`,
    cautions: [
      "Start with read-only scopes and add write capabilities only after the workflow is proven.",
      "Never commit token values; reference environment variable names and managed secret storage.",
    ],
  },
  {
    id: "claude-skill-playbook",
    title: "Claude Code skill outline",
    targetPath: ".claude/skills/release-checklist/SKILL.md",
    purpose: "Capture reusable procedural knowledge the agent can load for repeated workflows.",
    body: `# Release checklist

## When to use
- Preparing a production release
- Verifying changelog, version bump, and rollback notes

## Steps
1. Read \`CHANGELOG.md\` and confirm the release version matches the tagged commit.
2. Run \`npm run lint\`, \`npm test\`, and \`npm run build\`.
3. Confirm migration notes and breaking changes are documented.
4. List changed packages, verification output, and any skipped checks.

## Guardrails
- Do not deploy from this skill.
- Escalate production approvals to a human owner.`,
    cautions: [
      "Keep skills focused on one workflow; split unrelated playbooks into separate skill folders.",
      "Update command paths whenever CI, package managers, or release flow changes.",
    ],
  },
];
