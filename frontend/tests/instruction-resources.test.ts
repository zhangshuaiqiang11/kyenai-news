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
      "openai-codex": { publisher: "OpenAI", hostname: "developers.openai.com" },
      "claude-code": { publisher: "Anthropic", hostname: "docs.anthropic.com" },
      "github-copilot": { publisher: "GitHub", hostname: "docs.github.com" },
      cursor: { publisher: "Cursor", hostname: "cursor.com" },
    } as const;

    expect(instructionResourceVerifiedAt).toBe("2026-06-14");
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
    expect(evidencedStatuses).toContain("copilot-claude-md-other-surfaces");
  });

  it("locks Codex startup discovery, per-directory selection, and precedence boundaries", () => {
    const codex = toolInstructionSupport.find(({ id }) => id === "codex-agents-md");
    const discovery = `${codex?.path} ${codex?.priority} ${codex?.nesting}`;

    expect(codex?.sourceUrl).toBe("https://developers.openai.com/codex/guides/agents-md");
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

  it("models Copilot CLAUDE.md support by surface and recommends the broad repository file", () => {
    const claudeMdClaims = toolInstructionSupport.filter(
      ({ toolId, path }) => toolId === "github-copilot" && path === "CLAUDE.md"
    );
    const supported = claudeMdClaims.find(({ status }) => status === "documented");
    const unsupported = claudeMdClaims.find(({ status }) => status === "unsupported");
    const broadBaseline = toolInstructionSupport.find(
      ({ toolId, path }) => toolId === "github-copilot" && path === ".github/copilot-instructions.md"
    );

    const supportMatrixUrl = "https://docs.github.com/en/copilot/reference/custom-instructions-support";
    const expectedSupportedSurfaces = [
      "GitHub.com Copilot cloud agent",
      "Visual Studio Code Copilot cloud agent",
      "JetBrains IDEs Copilot cloud agent",
      "Eclipse Copilot cloud agent",
      "Xcode Copilot cloud agent",
    ];
    const expectedUnsupportedSurfaces = [
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
    ];

    expect(supported?.sourceUrl).toBe(supportMatrixUrl);
    expect(unsupported?.sourceUrl).toBe(supportMatrixUrl);
    expect(supported?.surfaces).toEqual(expectedSupportedSurfaces);
    expect(unsupported?.surfaces).toEqual(expectedUnsupportedSurfaces);
    expect(supported?.priority).toContain("separately from Copilot Chat");
    expect(broadBaseline?.recommendation).toContain("broad-compatibility");
    expect(broadBaseline?.surfaces.length).toBeGreaterThan(supported?.surfaces.length || 0);
  });

  it("does not present .cursorrules legacy or deprecation status as an official current-doc claim", () => {
    const cursorRootFile = toolInstructionSupport.find(({ path }) => path === ".cursorrules");
    const wording = `${cursorRootFile?.priority} ${cursorRootFile?.nesting} ${cursorRootFile?.recommendation}`;

    expect(cursorRootFile?.status).toBe("unknown");
    expect(cursorRootFile?.sourceUrl).toBe("https://cursor.com/docs/rules");
    expect(wording).toContain("does not");
    expect(wording).toContain("official legacy or deprecation status");
    expect(wording).toContain(".cursor/rules");
    expect(wording).not.toContain("superseded");
    expect(wording).not.toContain("Migrate");
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
