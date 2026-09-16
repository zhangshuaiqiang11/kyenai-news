import { describe, expect, it } from "vitest";

import { auditInstructionFile, getRecommendedInstructionPath } from "../lib/instruction-file-audit";

const strongInstructions = `# Repository instructions

## Scope
- These instructions apply to the entire repository.
- Read a nearer AGENTS.md for package-specific exceptions.

## Setup
- Install dependencies with \`npm ci\`.
- Start development with \`npm run dev\`.

## Change rules
- Follow existing module boundaries.
- Do not edit generated files or expose secrets.
- Ask before destructive database or dependency changes.

## Verification
- Run \`npm run lint\`.
- Run \`npm test\`.
- Run \`npm run build\` for production changes.

## Completion
- Summarize changed files, checks run, and remaining risks.
`;

describe("instruction-file audit", () => {
  it("returns a zero score and actionable error for empty input", () => {
    const result = auditInstructionFile({
      tool: "codex",
      surface: "Codex",
      filePath: "AGENTS.md",
      content: "   ",
    });

    expect(result.score).toBe(0);
    expect(result.findings).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "empty-content", severity: "error" })]),
    );
  });

  it("gives a strong, safe, executable AGENTS.md a high score", () => {
    const result = auditInstructionFile({
      tool: "codex",
      surface: "Codex",
      filePath: "AGENTS.md",
      content: strongInstructions,
    });

    expect(result.score).toBeGreaterThanOrEqual(90);
    expect(result.grade).toBe("Strong");
    expect(result.recommendedPath).toBe("AGENTS.md");
    expect(result.findings.filter((finding) => finding.severity === "error")).toHaveLength(0);
  });

  it("flags unresolved placeholders and likely secrets without echoing secret values", () => {
    const content = `${strongInstructions}\nAPI key: sk-abcdefghijklmnopqrstuvwxyz123456\nOwner: <TEAM_NAME>\nTODO: replace command`;
    const result = auditInstructionFile({
      tool: "claude-code",
      surface: "Claude Code",
      filePath: "CLAUDE.md",
      content,
    });
    const serialized = JSON.stringify(result);

    expect(result.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "unresolved-placeholders", severity: "warning" }),
        expect.objectContaining({ id: "possible-secret", severity: "error" }),
      ]),
    );
    expect(serialized).not.toContain("sk-abcdefghijklmnopqrstuvwxyz123456");
  });

  it("identifies missing setup, verification, scope, and safety guidance", () => {
    const result = auditInstructionFile({
      tool: "github-copilot",
      surface: "GitHub.com Copilot Chat",
      filePath: ".github/copilot-instructions.md",
      content: "Please write clean TypeScript and be helpful.",
    });
    const findingIds = result.findings.map((finding) => finding.id);

    expect(findingIds).toEqual(
      expect.arrayContaining(["missing-setup", "missing-verification", "missing-scope", "missing-safety"]),
    );
    expect(result.score).toBeLessThan(65);
  });

  it("treats destructive commands as a high-risk error", () => {
    const result = auditInstructionFile({
      tool: "codex",
      surface: "Codex",
      filePath: "AGENTS.md",
      content: `${strongInstructions}\n- Always run \`git reset --hard\` before starting.`,
    });

    expect(result.findings).toContainEqual(expect.objectContaining({ id: "destructive-command", severity: "error" }));
    expect(result.score).toBeLessThan(85);
  });

  it("warns when content exceeds documented tool-size guidance", () => {
    const oversizedClaudeFile = Array.from({ length: 205 }, (_, index) => `- Rule ${index + 1}: keep the change focused.`).join("\n");
    const result = auditInstructionFile({
      tool: "claude-code",
      surface: "Claude Code",
      filePath: "CLAUDE.md",
      content: `${strongInstructions}\n${oversizedClaudeFile}`,
    });

    expect(result.stats.lines).toBeGreaterThan(200);
    expect(result.findings).toContainEqual(expect.objectContaining({ id: "oversized-content", severity: "warning" }));
  });

  it("checks tool-path compatibility and recommends the documented baseline", () => {
    const result = auditInstructionFile({
      tool: "cursor",
      surface: "Cursor IDE",
      filePath: "CLAUDE.md",
      content: strongInstructions,
    });

    expect(result.compatiblePath).toBe(false);
    expect(result.recommendedPath).toBe(".cursor/rules/project-guidance.mdc");
    expect(result.findings).toContainEqual(expect.objectContaining({ id: "path-mismatch", severity: "error" }));
    expect(getRecommendedInstructionPath("github-copilot", "Copilot CLI")).toBe(".github/copilot-instructions.md");
  });

  it("recognizes current Copilot CLI agent-file support while preserving the portable baseline", () => {
    const result = auditInstructionFile({
      tool: "github-copilot",
      surface: "Copilot CLI",
      filePath: "CLAUDE.md",
      content: strongInstructions,
    });

    expect(result.compatiblePath).toBe(true);
    expect(result.recommendedPath).toBe(".github/copilot-instructions.md");
    expect(result.findings).toContainEqual(expect.objectContaining({ id: "portable-copilot-baseline" }));
    expect(result.findings).not.toContainEqual(expect.objectContaining({ id: "path-mismatch" }));
  });

  it("uses the exact Copilot environment for AGENTS.md compatibility", () => {
    const codeReview = auditInstructionFile({
      tool: "github-copilot",
      surface: "GitHub.com Copilot code review",
      filePath: "AGENTS.md",
      content: strongInstructions,
    });
    const chat = auditInstructionFile({
      tool: "github-copilot",
      surface: "GitHub.com Copilot Chat",
      filePath: "AGENTS.md",
      content: strongInstructions,
    });

    expect(codeReview.compatiblePath).toBe(true);
    expect(codeReview.findings).not.toContainEqual(expect.objectContaining({ id: "path-mismatch" }));
    expect(chat.compatiblePath).toBe(false);
    expect(chat.findings).toContainEqual(expect.objectContaining({ id: "path-mismatch" }));
  });

  it("distinguishes Cursor IDE and CLI root-file support", () => {
    const cursorIdeAgents = auditInstructionFile({
      tool: "cursor",
      surface: "Cursor IDE",
      filePath: "AGENTS.md",
      content: strongInstructions,
    });
    const cursorIdeClaude = auditInstructionFile({
      tool: "cursor",
      surface: "Cursor IDE",
      filePath: "CLAUDE.md",
      content: strongInstructions,
    });
    const cursorCliClaude = auditInstructionFile({
      tool: "cursor",
      surface: "Cursor CLI",
      filePath: "CLAUDE.md",
      content: strongInstructions,
    });

    expect(cursorIdeAgents.compatiblePath).toBe(true);
    expect(cursorIdeClaude.compatiblePath).toBe(false);
    expect(cursorCliClaude.compatiblePath).toBe(true);
  });

  it("rejects keyword-only claims that contain no executable commands or safety rule", () => {
    const result = auditInstructionFile({
      tool: "codex",
      surface: "Codex",
      filePath: "AGENTS.md",
      content: `# Setup\nDependencies are not documented.\n\n## Verification\nNever test or build.\n\n## Safety\nAllowed colors are blue.\n\n## Completion\nCompletion reports are possible.`,
    });

    expect(result.score).toBeLessThan(60);
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "missing-setup" }),
      expect.objectContaining({ id: "missing-verification" }),
      expect.objectContaining({ id: "missing-safety" }),
      expect.objectContaining({ id: "no-executable-command", severity: "error" }),
    ]));
  });

  it("does not flag a prohibited destructive command as an instruction to execute it", () => {
    const result = auditInstructionFile({
      tool: "codex",
      surface: "Codex",
      filePath: "AGENTS.md",
      content: `${strongInstructions}\n- Never run \`git reset --hard\` or force-push without explicit approval.`,
    });

    expect(result.findings).not.toContainEqual(expect.objectContaining({ id: "destructive-command" }));
  });

  it("detects hidden bidirectional text and incomplete Cursor rule metadata", () => {
    const result = auditInstructionFile({
      tool: "cursor",
      surface: "Cursor IDE",
      filePath: ".cursor/rules/project.mdc",
      content: `${strongInstructions}\n\u202E concealed`,
    });

    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "bidirectional-control-character", severity: "error" }),
      expect.objectContaining({ id: "invalid-cursor-frontmatter", severity: "error" }),
    ]));
  });

  it("warns when package-manager commands are ambiguous", () => {
    const result = auditInstructionFile({
      tool: "codex",
      surface: "Codex",
      filePath: "AGENTS.md",
      content: `${strongInstructions}\n- Also run \`pnpm install\`.`,
    });

    expect(result.findings).toContainEqual(expect.objectContaining({ id: "multiple-package-managers" }));
  });

  it("does not credit setup and verification commands that are explicitly prohibited", () => {
    const result = auditInstructionFile({
      tool: "codex",
      surface: "Codex",
      filePath: "AGENTS.md",
      content: `# Repository instructions

## Scope
- These instructions apply to the entire repository.

## Setup
- Never run npm ci.

## Safety
- Do not expose secrets.

## Verification
- Never run npm test.

## Completion
- Summarize changed files, checks run, and remaining risks.`,
    });

    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "missing-setup" }),
      expect.objectContaining({ id: "missing-verification" }),
      expect.objectContaining({ id: "no-executable-command", severity: "error" }),
    ]));
    expect(result.grade).not.toBe("Strong");
  });

  it("does not let a separate safety sentence hide an affirmative destructive command", () => {
    const result = auditInstructionFile({
      tool: "codex",
      surface: "Codex",
      filePath: "AGENTS.md",
      content: `${strongInstructions}\n- Never expose a secret. Always run git reset --hard before starting.`,
    });

    expect(result.findings).toContainEqual(expect.objectContaining({ id: "destructive-command", severity: "error" }));
    expect(result.grade).not.toBe("Strong");
  });

  it("does not let an unrelated negated clause hide a coordinated destructive command", () => {
    const result = auditInstructionFile({
      tool: "codex",
      surface: "Codex",
      filePath: "AGENTS.md",
      content: `${strongInstructions}\n- Never expose a secret, and always run git reset --hard before starting.`,
    });

    expect(result.findings).toContainEqual(expect.objectContaining({ id: "destructive-command", severity: "error" }));
    expect(result.grade).not.toBe("Strong");
  });
});
