import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, realpathSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDirectory, "..");
const datasetStem = "instruction-file-adoption-report-2026-q3";
const canonicalUrl = "https://www.kyenai.com/guides/ai-coding-agent-instruction-file-adoption-report-2026";

function sha256(pathname) {
  return createHash("sha256").update(readFileSync(pathname)).digest("hex");
}

function artifact(pathname, publicUrl, mediaType) {
  return {
    url: publicUrl,
    mediaType,
    bytes: statSync(pathname).size,
    sha256: sha256(pathname),
  };
}

export function generateInstructionAdoptionAssets({
  inputDirectory = join(repoRoot, "frontend", "public", "resources", "data"),
  outputDirectory = inputDirectory,
  generatorPath = join(scriptDirectory, "generate-github-instruction-adoption.mjs"),
} = {}) {
  mkdirSync(outputDirectory, { recursive: true });

  const reportPath = join(inputDirectory, `${datasetStem}.json`);
  const csvPath = join(inputDirectory, `${datasetStem}.csv`);
  const report = JSON.parse(readFileSync(reportPath, "utf8"));
  const generatorOutputPath = join(outputDirectory, `${datasetStem}-generator.mjs`);
  copyFileSync(generatorPath, generatorOutputPath);

  const citation = `KyenAI. (2026). AI Coding Agent Instruction File Adoption Report — Q3 2026 (Version 2026-Q3) [Data set]. ${canonicalUrl}`;
  const bibtex = `@dataset{kyenai_2026_instruction_files,
  author    = {{KyenAI}},
  title     = {AI Coding Agent Instruction File Adoption Report -- Q3 2026},
  year      = {2026},
  version   = {2026-Q3},
  url       = {${canonicalUrl}},
  note      = {GitHub code-search snapshot dated ${report.snapshotDate}; best-match sample, not a population estimate}
}
`;
  const cff = `cff-version: 1.2.0
message: "If you use this dataset, cite the version and snapshot date and preserve the sampling limitation."
type: dataset
title: "AI Coding Agent Instruction File Adoption Report — Q3 2026"
version: "2026-Q3"
date-released: "${report.snapshotDate}"
authors:
  - name: "KyenAI"
url: "${canonicalUrl}"
keywords:
  - AGENTS.md
  - CLAUDE.md
  - GitHub Copilot instructions
  - Cursor rules
  - AI coding agents
`;
  const methodology = `# AI Coding Agent Instruction File Adoption Report — Q3 2026

Version: 2026-Q3
Snapshot date: ${report.snapshotDate}
Canonical record: ${canonicalUrl}

## Cite this dataset

${citation}

The dataset has no DOI. Use the canonical record URL above as its stable identifier.

## Reproduce the snapshot

1. Download \`${datasetStem}-generator.mjs\`.
2. Use Node.js 20 or newer and a GitHub token with public repository read access.
3. Run:

\`\`\`bash
GITHUB_TOKEN=your_token node ${datasetStem}-generator.mjs \\
  --sample-size ${report.methodology.sampleSizePerQuery} \\
  --snapshot-date ${report.snapshotDate} \\
  --output-dir ./instruction-adoption-output
\`\`\`

GitHub search indexes and best-match ordering change over time. Re-running the same date label later does not recreate the historical index; it repeats the method against the current index. Preserve the downloaded JSON, CSV, manifest, and checksums when citing this snapshot.

## Measurement boundary

- The four GitHub query totals are indexed file-match counts, not unique repository counts or adoption rates.
- The content analysis uses the first ${report.methodology.sampleSizePerQuery} best matches per query and is not a random or statistically representative sample.
- Exact repository/path pairs are deduplicated within each query; a repository may appear in multiple query samples.
- Pattern detection reports visible text signals. It does not prove that a rule is correct, enforced, current, or absent elsewhere in a repository.

## Data files

- \`${datasetStem}.json\`: query totals, methodology, summaries, limitations, and all sampled rows.
- \`${datasetStem}.csv\`: analysis-ready sampled rows.
- \`${datasetStem}-manifest.json\`: version, media type, byte size, and SHA-256 digest for each core artifact.
- \`${datasetStem}-sha256.txt\`: checksums for independent integrity verification.
`;

  writeFileSync(join(outputDirectory, `${datasetStem}-citation.bib`), bibtex);
  writeFileSync(join(outputDirectory, `${datasetStem}-citation.cff`), cff);
  writeFileSync(join(outputDirectory, `${datasetStem}-methodology.md`), methodology);

  const publicBase = "https://www.kyenai.com/resources/data";
  const generatedJsonPath = outputDirectory === inputDirectory ? reportPath : join(outputDirectory, `${datasetStem}.json`);
  const generatedCsvPath = outputDirectory === inputDirectory ? csvPath : join(outputDirectory, `${datasetStem}.csv`);
  if (outputDirectory !== inputDirectory) {
    copyFileSync(reportPath, generatedJsonPath);
    copyFileSync(csvPath, generatedCsvPath);
  }
  const artifacts = {
    json: artifact(generatedJsonPath, `${publicBase}/${datasetStem}.json`, "application/json"),
    csv: artifact(generatedCsvPath, `${publicBase}/${datasetStem}.csv`, "text/csv"),
    generator: artifact(generatorOutputPath, `${publicBase}/${datasetStem}-generator.mjs`, "text/javascript"),
  };
  const manifest = {
    schemaVersion: 1,
    datasetId: `${canonicalUrl}#dataset`,
    name: report.title,
    version: "2026-Q3",
    snapshotDate: report.snapshotDate,
    collectedAt: report.collectedAt,
    source: report.source,
    sample: {
      queryCount: report.methodology.queryCount,
      sampledFiles: report.methodology.sampledFiles,
      ordering: report.methodology.searchOrdering,
    },
    citation,
    doi: null,
    artifacts,
  };
  writeFileSync(join(outputDirectory, `${datasetStem}-manifest.json`), `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(
    join(outputDirectory, `${datasetStem}-sha256.txt`),
    Object.entries(artifacts).map(([key, value]) => `${value.sha256}  ${datasetStem}${key === "generator" ? "-generator.mjs" : `.${key}`}`).join("\n") + "\n",
  );

  return { manifest, outputDirectory };
}

function isMainModule() {
  if (!process.argv[1]) return false;
  return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1]);
}

if (isMainModule()) {
  generateInstructionAdoptionAssets();
  console.log(`Generated citation and reproducibility assets for ${datasetStem}.`);
}
