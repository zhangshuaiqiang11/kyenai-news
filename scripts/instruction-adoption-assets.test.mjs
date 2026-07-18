import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { generateInstructionAdoptionAssets } from "./generate-instruction-adoption-assets.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const inputDirectory = join(repoRoot, "frontend", "public", "resources", "data");
const generatorPath = join(repoRoot, "scripts", "generate-github-instruction-adoption.mjs");
const stem = "instruction-file-adoption-report-2026-q3";

function sha256(pathname) {
  return createHash("sha256").update(readFileSync(pathname)).digest("hex");
}

describe("instruction adoption citation assets", () => {
  it("generates a versioned, verifiable citation and reproducibility pack", () => {
    const outputDirectory = mkdtempSync(join(tmpdir(), "kyenai-adoption-assets-"));
    try {
      const { manifest } = generateInstructionAdoptionAssets({ inputDirectory, outputDirectory, generatorPath });

      assert.equal(manifest.version, "2026-Q3");
      assert.equal(manifest.snapshotDate, "2026-07-19");
      assert.equal(manifest.doi, null);
      assert.match(manifest.citation, /best-match|Data set/i);

      for (const [key, value] of Object.entries(manifest.artifacts)) {
        const filename = key === "generator" ? `${stem}-generator.mjs` : `${stem}.${key}`;
        assert.equal(value.sha256, sha256(join(outputDirectory, filename)));
        assert.ok(value.bytes > 0);
      }

      const methodology = readFileSync(join(outputDirectory, `${stem}-methodology.md`), "utf8");
      assert.match(methodology, /no DOI/i);
      assert.match(methodology, /not a random or statistically representative sample/i);
      assert.match(methodology, /--output-dir/);

      const cff = readFileSync(join(outputDirectory, `${stem}-citation.cff`), "utf8");
      assert.match(cff, /^cff-version: 1\.2\.0/m);
      assert.match(cff, /^type: dataset/m);

      const help = execFileSync("node", [join(outputDirectory, `${stem}-generator.mjs`), "--help"], { encoding: "utf8" });
      assert.match(help, /--sample-size/);
      assert.match(help, /--output-dir/);
    } finally {
      rmSync(outputDirectory, { recursive: true, force: true });
    }
  });
});
