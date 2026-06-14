import type { BenchmarkRun, InstructionTemplate, ToolInstructionSupport } from "./types";

type BenchmarkProtocol = {
  repository: string;
  revision: string | null;
  taskId: string;
  task: string;
  successCriteria: string[];
  verificationCommand: string;
  measurementRules: string[];
  runs: BenchmarkRun[];
};

const compatibilityHeader = [
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
] as const;

function renderJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function quoteCsv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function escapeMarkdownTableCell(value: string | null | undefined): string {
  const normalized = (value || "").replace(/\r\n?|\n/g, "<br>");
  let escaped = "";
  let backslashRun = 0;

  for (const character of normalized) {
    if (character === "\\") {
      escaped += character;
      backslashRun += 1;
      continue;
    }
    if (character === "|" && backslashRun % 2 === 0) {
      escaped += "\\";
    }
    escaped += character;
    backslashRun = 0;
  }

  return escaped;
}

function renderMarkdownTableCodeCell(value: string): string {
  const escaped = escapeMarkdownTableCell(value);
  const longestBacktickRun = Math.max(
    0,
    ...Array.from(escaped.matchAll(/`+/g), (match) => match[0].length),
  );
  const fence = "`".repeat(longestBacktickRun + 1);
  const padding = escaped.startsWith("`") || escaped.endsWith("`") ? " " : "";
  return `${fence}${padding}${escaped}${padding}${fence}`;
}

function renderMarkdownLinkDestination(value: string | null | undefined): string {
  const encodedWhitespace = (value || "").replace(
    /[\u0000-\u0020\u007f]/g,
    (character) => encodeURIComponent(character),
  );

  try {
    const url = new URL(encodedWhitespace);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return "";
    }
    return url.href.replace(/[()]/g, (character) =>
      character === "(" ? "%28" : "%29",
    );
  } catch {
    return "";
  }
}

export function renderCompatibilityJson(records: ToolInstructionSupport[]): string {
  return renderJson({
    verifiedAt: records[0]?.verifiedAt || null,
    records,
  });
}

export function renderCompatibilityCsv(records: ToolInstructionSupport[]): string {
  const rows = records.map((record) => [
    record.toolName,
    record.path,
    record.status,
    record.scopes.join("|"),
    record.priority,
    record.nesting,
    record.recommendation,
    record.sourceUrl || "",
    record.publisher || "",
    record.verifiedAt,
  ]);

  const renderedRows = rows.map((row) => row.map(quoteCsv).join(","));
  return [compatibilityHeader.join(","), ...renderedRows].join("\n") + "\n";
}

export function renderTemplateFile(template: InstructionTemplate): string {
  return `${template.body.trim()}\n`;
}

export function renderBenchmarkResultsJson(protocol: BenchmarkProtocol): string {
  return renderJson({
    taskId: protocol.taskId,
    status: "Not measured",
    measurementPolicy: "Numeric values remain null until a controlled run is completed.",
    runs: protocol.runs,
  });
}

export function renderGithubReadme(input: {
  records: ToolInstructionSupport[];
  templates: InstructionTemplate[];
  repositoryTree: string;
  verifiedAt: string;
}): string {
  const sourceRows = input.records.map(
    (record) =>
      `| ${escapeMarkdownTableCell(record.toolName)} | ${renderMarkdownTableCodeCell(record.path)} | ${escapeMarkdownTableCell(record.status)} | [${escapeMarkdownTableCell(record.publisher)}](${renderMarkdownLinkDestination(record.sourceUrl)}) |`,
  );
  const templateRows = input.templates.map(
    (template) =>
      `| ${renderMarkdownTableCodeCell(template.downloadName)} | ${renderMarkdownTableCodeCell(template.targetPath)} | ${escapeMarkdownTableCell(template.purpose)} |`,
  );

  return `# KyenAI agent instruction files

Reusable, source-backed instruction templates and compatibility data for common AI coding tools.

Verified: ${input.verifiedAt}

## Included files

| Template | Intended path | Purpose |
| --- | --- | --- |
${templateRows.join("\n")}

The package also includes JSON and CSV compatibility data, a benchmark protocol, unmeasured benchmark results, a verifier, and an example repository.

## Compatibility sources

| Tool | Instruction path | Status | Source |
| --- | --- | --- | --- |
${sourceRows.join("\n")}

Compatibility claims are limited to the linked publisher documentation and the verified date above.

## Benchmark status

**Not measured.** No controlled benchmark run has been completed. Numeric metrics are null, and this package contains no benchmark estimates.

## Example layout

\`\`\`text
${input.repositoryTree}
\`\`\`

## Use

1. Choose the template for the tool and repository scope you need.
2. Replace example commands and paths with values verified in your repository.
3. Keep shared guidance consistent across tool-specific files.
4. Run \`node verifier/verify-instructions.mjs example-repository\` to check the included example.

The templates are starters, not claims about a repository that has not been inspected.
`;
}
