import { chmodSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import {
  renderBenchmarkResultsJson,
  renderCompatibilityCsv,
  renderCompatibilityJson,
  renderGithubReadme,
  renderTemplateFile,
} from "../frontend/lib/resource-exports.ts";
import {
  benchmarkProtocol,
  instructionResourceVerifiedAt,
  instructionTemplates,
  repositoryTree,
  toolInstructionSupport,
} from "../frontend/lib/instruction-resources.ts";
import { renderMcpSecurityReviewMarkdown } from "../frontend/lib/mcp-security-resource.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = resolve(repoRoot, "frontend/public/resources");
const publicInstructionRoot = resolve(publicRoot, "instruction-files");
const packageRoot = resolve(repoRoot, "artifacts/kyenai-agent-instruction-files");

export function resolveGeneratedPath(approvedRoot, relativePath, { allowRoot = false } = {}) {
  if (typeof relativePath !== "string" || relativePath.length === 0) {
    throw new Error("Generated path must be a non-empty relative path.");
  }
  if (isAbsolute(relativePath) || /^[A-Za-z]:[\\/]/.test(relativePath) || relativePath.startsWith("\\\\")) {
    throw new Error(`Generated path absolute paths are not allowed: ${relativePath}`);
  }
  if (relativePath.split(/[\\/]/).includes("..")) {
    throw new Error(`Generated path traversal is not allowed: ${relativePath}`);
  }

  const root = resolve(approvedRoot);
  const destination = resolve(root, relativePath);
  const pathFromRoot = relative(root, destination);
  const outsideRoot =
    pathFromRoot === ".." || pathFromRoot.startsWith(`..${sep}`) || isAbsolute(pathFromRoot);

  if (outsideRoot || (!allowRoot && pathFromRoot === "")) {
    throw new Error(`Generated path resolves outside approved root: ${relativePath}`);
  }
  return destination;
}

function writeGeneratedFile(approvedRoot, relativePath, content, mode) {
  const pathname = resolveGeneratedPath(approvedRoot, relativePath);
  if (!content.trim()) {
    throw new Error(`Refusing to write an empty generated file: ${pathname}`);
  }
  mkdirSync(dirname(pathname), { recursive: true });
  writeFileSync(pathname, content, "utf8");
  if (mode) {
    chmodSync(pathname, mode);
  }
}

function removeGeneratedPath(approvedRoot, relativePath, options) {
  const pathname = resolveGeneratedPath(approvedRoot, relativePath, { allowRoot: true });
  rmSync(pathname, options);
}

function renderBenchmarkProtocolJson() {
  return `${JSON.stringify(benchmarkProtocol, null, 2)}\n`;
}

function renderVerifier() {
  return `#!/usr/bin/env node
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.argv[2] || "example-repository");
const required = [
  "AGENTS.md",
  "CLAUDE.md",
  ".github/copilot-instructions.md",
  ".cursor/rules/project-guidance.mdc",
];

let failed = false;
for (const path of required) {
  const pathname = resolve(root, path);
  try {
    if (!statSync(pathname).isFile() || readFileSync(pathname, "utf8").trim() === "") {
      throw new Error("missing content");
    }
    console.log(\`ok \${path}\`);
  } catch {
    failed = true;
    console.error(\`missing or empty: \${path}\`);
  }
}

if (failed) {
  process.exitCode = 1;
}
`;
}

export function main() {
  const compatibilityJson = renderCompatibilityJson(toolInstructionSupport);
  const compatibilityCsv = renderCompatibilityCsv(toolInstructionSupport);
  const benchmarkResultsJson = renderBenchmarkResultsJson(benchmarkProtocol);

  for (const template of instructionTemplates) {
    resolveGeneratedPath(publicInstructionRoot, template.downloadName);
    resolveGeneratedPath(packageRoot, template.downloadName);
    resolveGeneratedPath(packageRoot, template.targetPath);
  }

  removeGeneratedPath(publicInstructionRoot, ".", { recursive: true, force: true });
  writeGeneratedFile(publicInstructionRoot, "compatibility.json", compatibilityJson);
  writeGeneratedFile(publicInstructionRoot, "compatibility.csv", compatibilityCsv);
  writeGeneratedFile(publicInstructionRoot, "benchmark-results.json", benchmarkResultsJson);
  for (const template of instructionTemplates) {
    writeGeneratedFile(publicInstructionRoot, template.downloadName, renderTemplateFile(template));
  }
  const mcpSecurityReview = renderMcpSecurityReviewMarkdown();
  writeGeneratedFile(publicRoot, "mcp-security-review.md", mcpSecurityReview);

  removeGeneratedPath(packageRoot, ".", { recursive: true, force: true });
  writeGeneratedFile(
    packageRoot,
    "README.md",
    renderGithubReadme({
      records: toolInstructionSupport,
      templates: instructionTemplates,
      repositoryTree,
      verifiedAt: instructionResourceVerifiedAt,
    }),
  );
  writeGeneratedFile(packageRoot, "compatibility.json", compatibilityJson);
  writeGeneratedFile(packageRoot, "compatibility.csv", compatibilityCsv);
  writeGeneratedFile(packageRoot, "mcp-security-review.md", mcpSecurityReview);
  for (const template of instructionTemplates) {
    const rendered = renderTemplateFile(template);
    writeGeneratedFile(packageRoot, `templates/${template.downloadName}`, rendered);
    writeGeneratedFile(packageRoot, `example-repository/${template.targetPath}`, rendered);
    if (template.targetPath === "AGENTS.md") {
      writeGeneratedFile(packageRoot, "example-repository/apps/web/AGENTS.md", rendered);
    }
  }
  writeGeneratedFile(
    packageRoot,
    "example-repository/packages/api/README.md",
    "# API package placeholder\n\nThis directory exists to demonstrate nested repository instruction scope.\n",
  );
  writeGeneratedFile(packageRoot, "benchmark/benchmark-protocol.json", renderBenchmarkProtocolJson());
  writeGeneratedFile(packageRoot, "benchmark/benchmark-results.json", benchmarkResultsJson);
  writeGeneratedFile(packageRoot, "verifier/verify-instructions.mjs", renderVerifier(), 0o755);

  console.log(`Generated public resources in ${publicRoot}`);
  console.log(`Recreated package in ${packageRoot}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
