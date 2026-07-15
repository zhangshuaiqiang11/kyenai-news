import { describe, expect, it } from "vitest";

import {
  benchmarkProtocol,
  instructionResourceVerifiedAt,
  instructionTemplates,
  repositoryTree,
  toolInstructionSupport,
} from "../lib/instruction-resources";

describe("instruction resources", () => {
  it("maps support claims to the expected official publishers and source domains", () => {
    const expectedSources = {
      "openai-codex": { publisher: "OpenAI", hostname: "learn.chatgpt.com" },
      "claude-code": { publisher: "Anthropic", hostname: "code.claude.com" },
      "github-copilot": { publisher: "GitHub", hostname: "docs.github.com" },
      cursor: { publisher: "Cursor", hostname: "docs.cursor.com" },
    } as const;

    expect(instructionResourceVerifiedAt).toBe("2026-07-14");
    expect(new Set(toolInstructionSupport.map(({ toolId }) => toolId))).toEqual(
      new Set(["openai-codex", "claude-code", "github-copilot", "cursor"])
    );

    for (const claim of toolInstructionSupport) {
      const expected = expectedSources[claim.toolId];
      expect.soft(claim.sourceUrl, claim.id).toMatch(/^https:\/\//);
      expect.soft(claim.publisher, claim.id).toBe(expected.publisher);
      expect.soft(new URL(claim.sourceUrl!).hostname, claim.id).toBe(expected.hostname);
      expect.soft(claim.verifiedAt, claim.id).toBe(instructionResourceVerifiedAt);
    }

    const evidencedStatuses = toolInstructionSupport
      .filter(({ status }) => ["documented", "legacy", "unsupported"].includes(status))
      .map(({ id }) => id);
    expect(evidencedStatuses).toContain("copilot-claude-md-unlisted-surfaces");
  });

  it("locks Codex startup discovery, per-directory selection, and precedence boundaries", () => {
    const codex = toolInstructionSupport.find(({ id }) => id === "codex-agents-md");
    const discovery = `${codex?.path} ${codex?.priority} ${codex?.nesting}`;

    expect(codex?.sourceUrl).toBe("https://learn.chatgpt.com/docs/agent-configuration/agents-md");
    expect(discovery).toContain("At startup");
    expect(discovery).toContain("AGENTS.override.md");
    expect(discovery).toContain("AGENTS.md");
    expect(discovery).toContain("project_doc_fallback_filenames");
    expect(discovery).toContain("at most one non-empty file");
    expect(discovery).toContain("project root to the initial working directory");
    expect(discovery).toContain("Closer files");
    expect(discovery).toContain("override earlier guidance");
    expect(discovery).toContain("stops at that initial working directory");
  });

  it("documents Claude Code's supported AGENTS.md import bridge without claiming native loading", () => {
    const claude = toolInstructionSupport.find(({ id }) => id === "claude-code-claude-md");
    const bridge = toolInstructionSupport.find(({ id }) => id === "claude-code-agents-md-import");

    expect(claude?.sourceUrl).toBe("https://code.claude.com/docs/en/memory");
    expect(bridge?.status).toBe("documented");
    expect(bridge?.path).toContain("@AGENTS.md");
    expect(`${bridge?.priority} ${bridge?.recommendation}`).toContain("does not read AGENTS.md directly");
    expect(bridge?.recommendation).toContain("single shared baseline");
  });

  it("models Copilot CLAUDE.md support by surface and recommends the broad repository file", () => {
    const claudeMdClaims = toolInstructionSupport.filter(
      ({ toolId, path }) => toolId === "github-copilot" && path === "CLAUDE.md"
    );
    const supported = claudeMdClaims.find(({ id }) => id === "copilot-claude-md-documented-surfaces");
    const unsupported = claudeMdClaims.find(({ id }) => id === "copilot-claude-md-unlisted-surfaces");
    const broadBaseline = toolInstructionSupport.find(
      ({ toolId, path }) => toolId === "github-copilot" && path === ".github/copilot-instructions.md"
    );

    const supportMatrixUrl = "https://docs.github.com/en/copilot/reference/custom-instructions-support";
    const expectedSupportedSurfaces = [
      "GitHub.com Copilot cloud agent",
      "VS Code Copilot cloud agent",
      "JetBrains Copilot cloud agent",
      "Eclipse Copilot cloud agent",
      "Xcode Copilot cloud agent",
      "Copilot CLI",
    ];
    const expectedUnsupportedSurfaces = [
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
    ];

    expect(supported?.sourceUrl).toBe(supportMatrixUrl);
    expect(unsupported?.sourceUrl).toBe(supportMatrixUrl);
    expect(supported?.surfaces).toEqual(expectedSupportedSurfaces);
    expect(unsupported?.surfaces).toEqual(expectedUnsupportedSurfaces);
    expect(supported?.priority).toContain("agent instructions");
    expect(supported?.recommendation).toContain("Copilot CLI");
    expect(unsupported?.surfaces).not.toContain("Copilot CLI");
    expect(broadBaseline?.recommendation).toContain("most portable");
    expect(broadBaseline?.surfaces.length).toBeGreaterThan(supported?.surfaces.length || 0);
  });

  it("models Copilot AGENTS.md and path-specific instructions as distinct documented mechanisms", () => {
    const agents = toolInstructionSupport.find(({ id }) => id === "copilot-agents-md");
    const pathSpecific = toolInstructionSupport.find(({ id }) => id === "copilot-path-specific-instructions");

    expect(agents?.status).toBe("documented");
    expect(agents?.surfaces).toContain("Copilot CLI");
    expect(agents?.priority).toContain("nearest AGENTS.md");
    expect(pathSpecific?.path).toBe(".github/instructions/**/*.instructions.md");
    expect(pathSpecific?.nesting).toContain("combined");
    expect(pathSpecific?.surfaces).not.toContain("GitHub.com Copilot Chat");
  });

  it("models current Cursor IDE and CLI instruction support from official documentation", () => {
    const cursorRootFile = toolInstructionSupport.find(({ path }) => path === ".cursorrules");
    const cursorIdeAgents = toolInstructionSupport.find(({ id }) => id === "cursor-agents-md-ide");
    const cursorCliAgents = toolInstructionSupport.find(({ id }) => id === "cursor-agents-md-cli");
    const cursorCliClaude = toolInstructionSupport.find(({ id }) => id === "cursor-claude-md-cli");
    const wording = `${cursorRootFile?.priority} ${cursorRootFile?.nesting} ${cursorRootFile?.recommendation}`;

    expect(cursorRootFile?.status).toBe("legacy");
    expect(cursorRootFile?.sourceUrl).toBe("https://docs.cursor.com/context/rules-for-ai");
    expect(wording).toMatch(/legacy|deprecated/i);
    expect(wording).toContain(".cursor/rules");
    expect(cursorIdeAgents?.surfaces).toEqual(["Cursor IDE"]);
    expect(cursorIdeAgents?.priority).toContain("root-level AGENTS.md");
    expect(cursorCliAgents?.surfaces).toEqual(["Cursor CLI"]);
    expect(cursorCliClaude?.surfaces).toEqual(["Cursor CLI"]);
    expect(cursorCliClaude?.sourceUrl).toBe("https://docs.cursor.com/en/cli/using");
  });

  it("ships four complete templates and a representative nested repository tree", () => {
    expect(instructionTemplates.map(({ downloadName }) => downloadName)).toEqual([
      "AGENTS.md",
      "CLAUDE.md",
      "copilot-instructions.md",
      "cursor-project-rule.mdc",
    ]);

    for (const template of instructionTemplates) {
      expect.soft(template.body.length, template.id).toBeGreaterThan(300);
      expect.soft(template.cautions.length, template.id).toBeGreaterThanOrEqual(2);
    }

    expect(repositoryTree).toContain("example-repository/");
    expect(repositoryTree).toContain(".github/");
    expect(repositoryTree).toContain(".cursor/");
    expect(repositoryTree).toContain("rules/");
    expect(repositoryTree.match(/AGENTS\.md/g)).toHaveLength(2);
  });

  it("keeps unmeasured benchmark runs entirely free of estimated metrics", () => {
    expect(benchmarkProtocol.taskId).toBe("instruction-drift-fix-001");
    expect(benchmarkProtocol.measurementRules.join(" ")).toContain("never estimate");

    for (const run of benchmarkProtocol.runs) {
      expect.soft(run.status, run.id).toBe("not-measured");
      expect.soft(run.metricSource, run.id).toBe("unavailable");
      expect.soft(run.elapsedSeconds, run.id).toBeNull();
      expect.soft(run.measuredCostUsd, run.id).toBeNull();
      expect.soft(run.humanInterventions, run.id).toBeNull();
      expect.soft(run.filesChanged, run.id).toBeNull();
      expect.soft(run.verificationPassed, run.id).toBeNull();
      expect.soft(run.limitations.join(" "), run.id).toContain("no values are estimated");
    }
  });
});
