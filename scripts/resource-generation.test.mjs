import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { resolveGeneratedPath } from "./generate-instruction-resources.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = join(repoRoot, "frontend/public/resources");
const packageRoot = join(repoRoot, "artifacts/kyenai-agent-instruction-files");
const allowedOutputRoots = [publicRoot, packageRoot];

const requiredPublicPaths = [
  "instruction-files/compatibility.json",
  "instruction-files/compatibility.csv",
  "instruction-files/benchmark-results.json",
  "instruction-files/AGENTS.md",
  "instruction-files/CLAUDE.md",
  "instruction-files/copilot-instructions.md",
  "instruction-files/cursor-project-rule.mdc",
  "mcp-security-review.md",
];

const requiredPackagePaths = [
  "README.md",
  "compatibility.json",
  "compatibility.csv",
  "mcp-security-review.md",
  "templates/AGENTS.md",
  "templates/CLAUDE.md",
  "templates/copilot-instructions.md",
  "templates/cursor-project-rule.mdc",
  "benchmark/benchmark-protocol.json",
  "benchmark/benchmark-results.json",
  "verifier/verify-instructions.mjs",
  "example-repository/AGENTS.md",
  "example-repository/CLAUDE.md",
  "example-repository/.github/copilot-instructions.md",
  "example-repository/.cursor/rules/project-guidance.mdc",
  "example-repository/apps/web/AGENTS.md",
  "example-repository/packages/api/README.md",
];

function isInside(pathname, root) {
  const pathFromRoot = relative(root, pathname);
  return pathFromRoot === "" || (!pathFromRoot.startsWith("..") && !pathFromRoot.startsWith("/"));
}

function shouldSkip(pathname) {
  if (allowedOutputRoots.some((root) => isInside(pathname, root))) {
    return true;
  }

  const pathFromRepo = relative(repoRoot, pathname);
  return pathFromRepo.split("/").some((part) =>
    ["node_modules", ".next", ".next-build", ".git", "__pycache__"].includes(part),
  );
}

function snapshotFiles(directory = repoRoot, snapshot = new Map()) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const pathname = join(directory, entry.name);
    if (shouldSkip(pathname)) {
      continue;
    }
    if (entry.isDirectory()) {
      snapshotFiles(pathname, snapshot);
    } else if (entry.isFile()) {
      const digest = createHash("sha256").update(readFileSync(pathname)).digest("hex");
      snapshot.set(relative(repoRoot, pathname), digest);
    }
  }
  return snapshot;
}

function listFiles(root, directory = root, files = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const pathname = join(directory, entry.name);
    if (entry.isDirectory()) {
      listFiles(root, pathname, files);
    } else if (entry.isFile()) {
      files.push(relative(root, pathname));
    }
  }
  return files.sort();
}

function assertExactFiles(root, paths) {
  assert.deepEqual(listFiles(root), [...paths].sort());
  for (const path of paths) {
    const pathname = join(root, path);
    assert.ok(statSync(pathname).isFile(), `${relative(repoRoot, pathname)} must be a file`);
    assert.ok(readFileSync(pathname).length > 0, `${relative(repoRoot, pathname)} must be non-empty`);
  }
}

function assertUnmeasuredBenchmarks(pathname) {
  const benchmark = JSON.parse(readFileSync(pathname, "utf8"));
  assert.equal(benchmark.status, "Not measured");
  for (const run of benchmark.runs) {
    assert.equal(run.status, "not-measured");
    assert.equal(run.metricSource, "unavailable");
    for (const metric of [
      "elapsedSeconds",
      "measuredCostUsd",
      "humanInterventions",
      "filesChanged",
      "verificationPassed",
    ]) {
      assert.equal(run[metric], null, `${run.toolId}.${metric} must be null`);
    }
  }
}

describe("generated instruction resources", () => {
  it("rejects absolute and traversal paths before filesystem access", () => {
    const root = resolve(repoRoot, "frontend/public/resources/instruction-files");
    const outsideRepo = join(tmpdir(), "kyenai-resource-escape.txt");

    assert.throws(() => resolveGeneratedPath(root, outsideRepo), /absolute paths are not allowed/);
    assert.throws(() => resolveGeneratedPath(root, "C:\\temp\\escape.txt"), /absolute paths are not allowed/);
    assert.throws(() => resolveGeneratedPath(root, "../mcp-security-review.md"), /traversal is not allowed/);
    assert.throws(() => resolveGeneratedPath(root, "nested/../escape.txt"), /traversal is not allowed/);
    assert.throws(() => resolveGeneratedPath(root, "../../../../../../tmp/escape.txt"), /traversal is not allowed/);
    assert.equal(resolveGeneratedPath(root, "nested/file.md"), join(root, "nested/file.md"));
  });

  it("generates and audits only the approved output directories", () => {
    const stalePublicFile = join(publicRoot, "instruction-files/stale-resource.txt");
    const stalePackageFile = join(packageRoot, "stale-package-resource.txt");
    const unrelatedPublicFile = join(publicRoot, "unrelated-resource.txt");
    mkdirSync(dirname(stalePublicFile), { recursive: true });
    writeFileSync(stalePublicFile, "stale\n");
    mkdirSync(dirname(stalePackageFile), { recursive: true });
    writeFileSync(stalePackageFile, "stale\n");
    writeFileSync(unrelatedPublicFile, "preserve\n");
    const before = snapshotFiles();

    try {
      execFileSync(
        "bash",
        [
          "scripts/run-node-script.sh",
          "--experimental-strip-types",
          "scripts/generate-instruction-resources.mjs",
        ],
        { cwd: repoRoot, stdio: "pipe" },
      );

      const after = snapshotFiles();
      assert.deepEqual(after, before, "generation wrote outside the approved output directories");
      assert.equal(readFileSync(unrelatedPublicFile, "utf8"), "preserve\n");

      assertExactFiles(join(publicRoot, "instruction-files"), requiredPublicPaths
        .filter((path) => path.startsWith("instruction-files/"))
        .map((path) => path.slice("instruction-files/".length)));
      assertExactFiles(packageRoot, requiredPackagePaths);
      assert.ok(statSync(join(publicRoot, "mcp-security-review.md")).isFile());

      for (const pathname of [
        join(publicRoot, "instruction-files/compatibility.json"),
        join(publicRoot, "instruction-files/benchmark-results.json"),
        join(packageRoot, "compatibility.json"),
        join(packageRoot, "benchmark/benchmark-protocol.json"),
        join(packageRoot, "benchmark/benchmark-results.json"),
      ]) {
        assert.doesNotThrow(() => JSON.parse(readFileSync(pathname, "utf8")), `${pathname} must contain valid JSON`);
      }

      assertUnmeasuredBenchmarks(join(publicRoot, "instruction-files/benchmark-results.json"));
      assertUnmeasuredBenchmarks(join(packageRoot, "benchmark/benchmark-results.json"));

      const readme = readFileSync(join(packageRoot, "README.md"), "utf8");
      assert.match(readme, /Not measured/);
      assert.match(readme, /Verified: 2026-06-14/);
      assert.match(readme, /https:\/\//);

      for (const pathname of [
        join(publicRoot, "mcp-security-review.md"),
        join(packageRoot, "mcp-security-review.md"),
      ]) {
        const review = readFileSync(pathname, "utf8");
        for (const field of [
          "Server owner",
          "Version / publisher",
          "Data classes",
          "Methods / capabilities",
          "Credentials / authentication",
          "Network reach",
          "Approval gates",
          "Logging",
          "Dependency / supply-chain review",
          "Revocation / incident response",
          "Reviewer",
          "Review date",
          "Sign-off",
        ]) {
          assert.match(review, new RegExp(field.replace("/", "\\/"), "i"));
        }
        assert.match(review, /Prompt injection/);
        assert.match(review, /Read repository files/);
        assert.match(review, /Official MCP requirement or guidance/);
        assert.match(review, /KyenAI operational recommendation/);
        assert.match(review, /https:\/\/modelcontextprotocol\.io\/docs\/tools\/inspector/);
      }

      assert.equal(
        readFileSync(join(publicRoot, "mcp-security-review.md"), "utf8"),
        readFileSync(join(packageRoot, "mcp-security-review.md"), "utf8"),
      );
    } finally {
      rmSync(unrelatedPublicFile, { force: true });
    }
  });
});
