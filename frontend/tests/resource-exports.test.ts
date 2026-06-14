import { describe, expect, it } from "vitest";

import {
  benchmarkProtocol,
  instructionResourceVerifiedAt,
  instructionTemplates,
  repositoryTree,
  toolInstructionSupport,
} from "../lib/instruction-resources";
import {
  renderBenchmarkResultsJson,
  renderCompatibilityCsv,
  renderCompatibilityJson,
  renderGithubReadme,
  renderTemplateFile,
} from "../lib/resource-exports";

const csvHeader = [
  "tool",
  "path",
  "status",
  "scopes",
  "priority",
  "nesting",
  "recommendation",
  "source_url",
  "publisher",
  "verified_at",
];

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];

    if (quoted) {
      if (character === '"' && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (character !== "\r") {
      field += character;
    }
  }

  expect(quoted).toBe(false);
  expect(row).toEqual([]);
  expect(field).toBe("");
  return rows;
}

function parseMarkdownTableRow(row: string): string[] {
  const cells: string[] = [];
  let cell = "";

  for (let index = 1; index < row.length - 1; index += 1) {
    const character = row[index];
    if (character === "|") {
      let precedingBackslashes = 0;
      for (let cursor = index - 1; cursor >= 0 && row[cursor] === "\\"; cursor -= 1) {
        precedingBackslashes += 1;
      }
      if (precedingBackslashes % 2 === 0) {
        cells.push(cell.trim());
        cell = "";
        continue;
      }
    }
    cell += character;
  }

  cells.push(cell.trim());
  return cells;
}

describe("resource export renderers", () => {
  it("renders deterministic compatibility JSON", () => {
    const first = renderCompatibilityJson(toolInstructionSupport);
    const second = renderCompatibilityJson(toolInstructionSupport);

    expect(first).toBe(second);
    expect(first.endsWith("\n")).toBe(true);
    expect(JSON.parse(first)).toEqual({
      verifiedAt: instructionResourceVerifiedAt,
      records: toolInstructionSupport,
    });
  });

  it("renders the exact CSV schema and round-trips quoted fields", () => {
    const record = {
      ...toolInstructionSupport[0],
      path: 'path, with "quotes"',
      priority: "First line,\nsecond line",
      recommendation: 'Use "one", then two.',
    };
    const csv = renderCompatibilityCsv([record]);
    const rows = parseCsv(csv);

    expect(csv.split("\n")[0]).toBe(csvHeader.join(","));
    expect(rows[0]).toEqual(csvHeader);
    expect(rows[1]).toEqual([
      record.toolName,
      record.path,
      record.status,
      record.scopes.join("|"),
      record.priority,
      record.nesting,
      record.recommendation,
      record.sourceUrl,
      record.publisher,
      record.verifiedAt,
    ]);
  });

  it("renders every template as its trimmed source body plus one newline", () => {
    for (const template of instructionTemplates) {
      expect(renderTemplateFile(template)).toBe(`${template.body.trim()}\n`);
    }
  });

  it("renders a GitHub-ready README with source links and the verified date", () => {
    const readme = renderGithubReadme({
      records: toolInstructionSupport,
      templates: instructionTemplates,
      repositoryTree,
      verifiedAt: instructionResourceVerifiedAt,
    });

    expect(readme).toContain(`# KyenAI agent instruction files`);
    expect(readme).toContain(`Verified: ${instructionResourceVerifiedAt}`);
    for (const record of toolInstructionSupport) {
      expect(readme).toContain(record.sourceUrl);
    }
    expect(readme).toContain("Not measured");
    expect(readme.toLowerCase()).not.toContain("estimated benchmark");
  });

  it("keeps adversarial README table values inside their original cells", () => {
    const record = {
      ...toolInstructionSupport[0],
      toolName: "Tool | one\r\nTool two",
      path: "C:\\docs\\`rules```\\agent|policy.md",
      publisher: "Publisher | docs\\team",
      sourceUrl: "https://docs.example.com/a (draft)/guide_(v2)?path=C:%5Cdocs",
    };
    const template = {
      ...instructionTemplates[0],
      downloadName: "AG`ENTS```|copy.md",
      targetPath: "apps\\web/\r\nAGENTS.md",
      purpose: "One | purpose\nwith a backslash \\",
    };
    const recordBefore = structuredClone(record);
    const templateBefore = structuredClone(template);

    const readme = renderGithubReadme({
      records: [record],
      templates: [template],
      repositoryTree,
      verifiedAt: instructionResourceVerifiedAt,
    });
    const templateRow = readme.split("\n").find((line) => line.includes("AG`ENTS```"));
    const sourceRow = readme.split("\n").find((line) => line.includes("Tool \\| one"));

    expect(templateRow).toBeDefined();
    expect(sourceRow).toBeDefined();
    expect(parseMarkdownTableRow(templateRow!)).toHaveLength(3);
    expect(parseMarkdownTableRow(sourceRow!)).toHaveLength(4);
    expect(templateRow).toContain("````AG`ENTS```\\|copy.md````");
    expect(templateRow).toContain("`apps\\web/<br>AGENTS.md`");
    expect(templateRow).toContain("One \\| purpose<br>with a backslash \\");
    expect(sourceRow).toContain("Tool \\| one<br>Tool two");
    expect(sourceRow).toContain("````C:\\docs\\`rules```\\agent\\|policy.md````");
    expect(sourceRow).toContain(
      "https://docs.example.com/a%20%28draft%29/guide_%28v2%29?path=C:%5Cdocs",
    );
    expect(sourceRow).not.toContain("https://docs.example.com/a%20%28draft%29/guide_%28v2%29?path=C:%255Cdocs");
    expect(record).toEqual(recordBefore);
    expect(template).toEqual(templateBefore);
  });

  it("renders benchmark results with unmeasured values left null", () => {
    const rendered = renderBenchmarkResultsJson(benchmarkProtocol);
    const parsed = JSON.parse(rendered);

    expect(parsed.runs).toHaveLength(benchmarkProtocol.runs.length);
    for (const run of parsed.runs) {
      expect(run.status).toBe("not-measured");
      expect(run.metricSource).toBe("unavailable");
      expect(run.elapsedSeconds).toBeNull();
      expect(run.measuredCostUsd).toBeNull();
      expect(run.humanInterventions).toBeNull();
      expect(run.filesChanged).toBeNull();
      expect(run.verificationPassed).toBeNull();
      expect(run.limitations.join(" ")).toContain("no values are estimated");
    }
  });
});
