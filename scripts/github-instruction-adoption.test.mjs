import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { analyzeInstructionFile, escapeCsvCell, summarizeSamples } from "./generate-github-instruction-adoption.mjs";

describe("GitHub instruction adoption analysis", () => {
  it("detects commands, security rules, missing sections, and nested paths", () => {
    const analysis = analyzeInstructionFile(
      "# Rules\n## Setup\nRun npm ci.\n## Verification\nRun npm test. Never expose secrets. Ask for approval before production deploy.",
      "apps/web/AGENTS.md",
    );
    assert.equal(analysis.nested, true);
    assert.deepEqual(analysis.testCommands, ["npm test"]);
    assert.deepEqual(analysis.securityRules, ["Secrets and credentials", "Human approval", "Production restrictions"]);
    assert.deepEqual(analysis.missingConfigurations, ["scope or precedence guidance"]);
  });

  it("keeps file matches separate from unique sampled repository counts", () => {
    const samples = [
      { repository: "example/repo", language: "TypeScript", analysis: analyzeInstructionFile("Run npm test", "AGENTS.md") },
      { repository: "example/repo", language: "TypeScript", analysis: analyzeInstructionFile("Run pytest", "apps/api/AGENTS.md") },
    ];
    const summary = summarizeSamples({ id: "agents-md", label: "AGENTS.md", query: "filename:AGENTS.md" }, 12345, false, samples);
    assert.equal(summary.githubFileMatches, 12345);
    assert.equal(summary.sampledFiles, 2);
    assert.equal(summary.uniqueSampledRepositories, 1);
    assert.equal(summary.nestedFileSharePct, 50);
  });

  it("neutralizes spreadsheet formulas in public GitHub values", () => {
    assert.equal(escapeCsvCell("=HYPERLINK(\"https://example.com\")"), "\"'=HYPERLINK(\"\"https://example.com\"\")\"");
    assert.equal(escapeCsvCell("+SUM(1,1)"), "\"'+SUM(1,1)\"");
    assert.equal(escapeCsvCell("normal/path.md"), "normal/path.md");
  });
});
