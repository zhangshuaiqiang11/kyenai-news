import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const reportQueries = [
  { id: "agents-md", label: "AGENTS.md", query: "filename:AGENTS.md" },
  { id: "claude-md", label: "CLAUDE.md", query: "filename:CLAUDE.md" },
  { id: "copilot-instructions", label: "copilot-instructions.md", query: "filename:copilot-instructions.md path:.github" },
  { id: "cursor-mdc", label: "Cursor MDC rules", query: "extension:mdc path:.cursor/rules" },
];

const testCommandPatterns = [
  ["npm test", /\bnpm\s+(?:run\s+)?test\b/i],
  ["pnpm test", /\bpnpm\s+(?:run\s+)?test\b/i],
  ["yarn test", /\byarn\s+(?:run\s+)?test\b/i],
  ["pytest", /(?:^|\s)(?:python(?:3)?\s+-m\s+)?pytest\b/im],
  ["go test", /\bgo\s+test\b/i],
  ["cargo test", /\bcargo\s+test\b/i],
  ["dotnet test", /\bdotnet\s+test\b/i],
  ["mvn test", /\bmvn(?:w)?\s+test\b/i],
  ["gradle test", /(?:\.\/)?gradlew?\s+test\b/i],
];

const securityPatterns = [
  ["Secrets and credentials", /\b(secrets?|credentials?|api[-_ ]?keys?|access[-_ ]?tokens?|passwords?)\b/i],
  ["Human approval", /\b(approval|approve|human review|ask before|permission)\b/i],
  ["Production restrictions", /\b(production|prod environment|deploy)\b/i],
  ["Destructive action limits", /\b(destructive|delete|drop database|force push|rm\s+-rf)\b/i],
  ["Generated file boundaries", /\b(generated files?|do not edit|lockfiles?|build output)\b/i],
  ["Network restrictions", /\b(network access|internet access|allowlist|external requests?|outbound)\b/i],
];

const configurationChecks = [
  ["setup or install guidance", /\b(setup|install|bootstrap|dependencies|environment)\b/i],
  ["an explicit test command", /\b(test|pytest|vitest|jest|go test|cargo test|dotnet test)\b/i],
  ["verification or completion criteria", /\b(verify|verification|done|completion|acceptance|before submitting)\b/i],
  ["scope or precedence guidance", /\b(scope|applies to|precedence|nested|directory|folder)\b/i],
  ["a security or approval rule", /\b(secrets?|credentials?|approval|permission|destructive|production)\b/i],
];

export function analyzeInstructionFile(content, filePath) {
  const text = content || "";
  const testCommands = testCommandPatterns.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
  const securityRules = securityPatterns.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
  const missingConfigurations = configurationChecks.filter(([, pattern]) => !pattern.test(text)).map(([label]) => label);

  return {
    nested: filePath.includes("/"),
    testCommands,
    securityRules,
    missingConfigurations,
    readable: Boolean(text.trim()),
  };
}

export function summarizeSamples(type, totalCount, incompleteResults, samples) {
  const readableSamples = samples.filter((sample) => sample.analysis.readable);
  const uniqueRepositories = new Set(samples.map((sample) => sample.repository));
  const languageCounts = countValues(samples.map((sample) => sample.language || "Unknown"));
  const testCommandCounts = countValues(readableSamples.flatMap((sample) => sample.analysis.testCommands));
  const securityRuleCounts = countValues(readableSamples.flatMap((sample) => sample.analysis.securityRules));
  const missingConfigurationCounts = countValues(readableSamples.flatMap((sample) => sample.analysis.missingConfigurations));

  return {
    id: type.id,
    label: type.label,
    query: type.query,
    githubFileMatches: totalCount,
    incompleteResults,
    sampledFiles: samples.length,
    readableFiles: readableSamples.length,
    uniqueSampledRepositories: uniqueRepositories.size,
    nestedFiles: samples.filter((sample) => sample.analysis.nested).length,
    nestedFileSharePct: percentage(samples.filter((sample) => sample.analysis.nested).length, samples.length),
    topLanguages: toRankedRows(languageCounts, samples.length, 8),
    commonTestCommands: toRankedRows(testCommandCounts, readableSamples.length, 8),
    commonSecurityRules: toRankedRows(securityRuleCounts, readableSamples.length, 8),
    commonMissingConfigurations: toRankedRows(missingConfigurationCounts, readableSamples.length, 8),
  };
}

function countValues(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
  return counts;
}

function toRankedRows(counts, denominator, limit) {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([label, count]) => ({ label, count, sharePct: percentage(count, denominator) }));
}

function percentage(numerator, denominator) {
  return denominator ? Number(((numerator / denominator) * 100).toFixed(1)) : 0;
}

async function collectReport({ token, sampleSize, snapshotDate }) {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "KyenAI-instruction-adoption-research",
  };
  const collected = [];

  for (const [index, type] of reportQueries.entries()) {
    if (index > 0) await sleep(7_000);
    const searchUrl = new URL("https://api.github.com/search/code");
    searchUrl.searchParams.set("q", type.query);
    searchUrl.searchParams.set("per_page", String(sampleSize));
    const search = await fetchJson(searchUrl, headers);

    const samples = await mapWithConcurrency(search.items, 8, async (item) => {
      const [contentResponse, repositoryResponse] = await Promise.all([
        fetchJson(item.url, headers),
        fetchJson(item.repository.url, headers),
      ]);
      const content = contentResponse.encoding === "base64"
        ? Buffer.from((contentResponse.content || "").replace(/\n/g, ""), "base64").toString("utf8")
        : "";
      return {
        typeId: type.id,
        typeLabel: type.label,
        repository: item.repository.full_name,
        repositoryUrl: item.repository.html_url,
        filePath: item.path,
        fileUrl: item.html_url,
        language: repositoryResponse.language || "Unknown",
        stars: repositoryResponse.stargazers_count || 0,
        fork: Boolean(repositoryResponse.fork),
        archived: Boolean(repositoryResponse.archived),
        analysis: analyzeInstructionFile(content, item.path),
      };
    });

    collected.push({
      type,
      totalCount: search.total_count,
      incompleteResults: Boolean(search.incomplete_results),
      samples,
    });
  }

  const summaries = collected.map(({ type, totalCount, incompleteResults, samples }) =>
    summarizeSamples(type, totalCount, incompleteResults, samples));
  const samples = collected.flatMap((entry) => entry.samples);
  const uniqueRepositories = new Set(samples.map((sample) => sample.repository));

  return {
    title: "AI Coding Agent Instruction File Adoption Report — Q3 2026",
    snapshotDate,
    collectedAt: new Date().toISOString(),
    source: "GitHub REST API public code search and repository metadata",
    methodology: {
      sampleSizePerQuery: sampleSize,
      queryCount: reportQueries.length,
      sampledFiles: samples.length,
      uniqueSampledRepositories: uniqueRepositories.size,
      searchOrdering: "GitHub best-match ordering; this is not a random sample",
      deduplication: "File rows are unique by instruction type, repository, and file path. Repository counts are deduplicated by owner/name within each query.",
      readableContentRule: "Only successfully decoded UTF-8 file content contributes to command, security-rule, and missing-configuration analysis.",
    },
    querySummaries: summaries,
    samples,
    limitations: [
      "githubFileMatches is GitHub's indexed file-match count, not a count of unique repositories or active users.",
      "The first results use GitHub best-match ordering and are not statistically representative of all public repositories.",
      "Search index coverage, default branches, repository visibility, ranking, and totals can change after the snapshot date.",
      "Pattern matching detects explicit wording, not whether a rule is correct, enforced, or followed by an agent.",
      "Nested file share is measured across sampled file paths, not across every file in each repository.",
    ],
  };
}

async function fetchJson(url, headers) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status} for ${url}: ${body.slice(0, 300)}`);
  }
  return response.json();
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await mapper(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

function renderCsv(report) {
  const headers = [
    "instruction_type", "repository", "repository_url", "file_path", "file_url", "primary_language",
    "stars", "fork", "archived", "nested", "readable", "test_commands", "security_rules", "missing_configurations",
  ];
  const rows = report.samples.map((sample) => [
    sample.typeLabel, sample.repository, sample.repositoryUrl, sample.filePath, sample.fileUrl, sample.language,
    sample.stars, sample.fork, sample.archived, sample.analysis.nested, sample.analysis.readable,
    sample.analysis.testCommands.join(" | "), sample.analysis.securityRules.join(" | "), sample.analysis.missingConfigurations.join(" | "),
  ]);
  return [headers, ...rows].map((row) => row.map(escapeCsvCell).join(",")).join("\n") + "\n";
}

export function escapeCsvCell(value) {
  const raw = String(value ?? "");
  const text = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("Set GITHUB_TOKEN to a GitHub token with public repository read access.");
  const sampleSizeArg = Number(process.argv[process.argv.indexOf("--sample-size") + 1]);
  const snapshotDateArg = process.argv[process.argv.indexOf("--snapshot-date") + 1];
  const sampleSize = Number.isInteger(sampleSizeArg) && sampleSizeArg > 0 && sampleSizeArg <= 100 ? sampleSizeArg : 100;
  const snapshotDate = /^\d{4}-\d{2}-\d{2}$/.test(snapshotDateArg || "") ? snapshotDateArg : new Date().toISOString().slice(0, 10);
  const report = await collectReport({ token, sampleSize, snapshotDate });
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const publicDir = path.join(root, "frontend", "public", "resources", "data");
  const dataDir = path.join(root, "frontend", "lib", "data");
  fs.mkdirSync(publicDir, { recursive: true });
  fs.mkdirSync(dataDir, { recursive: true });
  const filename = "instruction-file-adoption-report-2026-q3";
  const json = `${JSON.stringify(report, null, 2)}\n`;
  fs.writeFileSync(path.join(publicDir, `${filename}.json`), json);
  fs.writeFileSync(path.join(publicDir, `${filename}.csv`), renderCsv(report));
  fs.writeFileSync(path.join(dataDir, `${filename}.json`), json);
  console.log(`Generated ${report.samples.length} public GitHub sample rows across ${report.querySummaries.length} instruction-file queries.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
