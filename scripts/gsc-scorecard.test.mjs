import assert from "node:assert/strict";
import { test } from "node:test";
import { buildScorecard } from "./gsc-scorecard.mjs";

const comparisonPage = "https://www.kyenai.com/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions";
const templatePage = "https://www.kyenai.com/guides/agents-md-template-for-ai-coding-agents";

function input(rows, overrides = {}) {
  return {
    metadata: {
      property: "sc-domain:kyenai.com",
      searchType: "Web",
      startDate: "2026-08-19",
      endDate: "2026-09-15",
      dimensions: ["query", "page"],
      hasQueryPageDimension: true,
      requestedRowLimit: 1000,
      returnedRowCount: rows.length,
      sourceFile: "fixtures/query-page.json",
      ...overrides,
    },
    rows,
  };
}

test("recomputes CTR and uses impression-weighted position", () => {
  const scorecard = buildScorecard(input([
    { query: "agents.md vs copilot-instructions.md", page: comparisonPage, clicks: 1, impressions: 10, ctr: 0.99, position: 2 },
    { query: "claude md vs copilot instructions", page: comparisonPage, clicks: 2, impressions: 90, ctr: 0, position: 10 },
  ]));
  assert.equal(scorecard.totals.ctr, 0.03);
  assert.equal(scorecard.totals.weightedAveragePosition, 9.2);
  assert.notEqual(scorecard.totals.weightedAveragePosition, 6);
});

test("counts Top 3/5/10 and position 6-15 opportunities", () => {
  const scorecard = buildScorecard(input([
    { query: "agents.md vs copilot-instructions.md", page: comparisonPage, clicks: 1, impressions: 10, position: 2 },
    { query: "claude md vs copilot instructions", page: comparisonPage, clicks: 1, impressions: 10, position: 5 },
    { query: "copilot instructions vs cursor rules", page: comparisonPage, clicks: 1, impressions: 10, position: 9 },
    { query: "agents.md vs claude.md", page: comparisonPage, clicks: 1, impressions: 10, position: 15 },
  ]));
  const cluster = scorecard.clusters.find((item) => item.cluster === "agent-instructions");
  assert.equal(cluster.top3Count, 1);
  assert.equal(cluster.top5Count, 2);
  assert.equal(cluster.top10Count, 3);
  assert.equal(cluster.position6to15Count, 2);
});

test("flags high-impression low-CTR rows using recomputed CTR", () => {
  const scorecard = buildScorecard(input([
    { query: "agents.md vs copilot-instructions.md", page: comparisonPage, clicks: 0, impressions: 20, ctr: 1, position: 8 },
    { query: "claude md vs copilot instructions", page: comparisonPage, clicks: 0, impressions: 20, ctr: 0, position: 8 },
  ]));
  const cluster = scorecard.clusters.find((item) => item.cluster === "agent-instructions");
  assert.equal(cluster.highImpressionLowCtrRows.length, 2);
  assert.equal(cluster.highImpressionLowCtrRows[0].query, "agents.md vs copilot-instructions.md");
  assert.equal(cluster.highImpressionLowCtrPages.length, 1);
  assert.equal(cluster.highImpressionLowCtrPages[0].page, "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions");
});

test("reports duplicate query pages as potential cannibalization", () => {
  const scorecard = buildScorecard(input([
    { query: "agents.md vs copilot-instructions.md", page: comparisonPage, clicks: 1, impressions: 10, position: 4 },
    { query: "agents.md vs copilot-instructions.md", page: templatePage, clicks: 1, impressions: 10, position: 12 },
  ]));
  assert.equal(scorecard.cannibalization.length, 1);
  assert.equal(scorecard.cannibalization[0].distinctPageCount, 2);
  assert.equal(scorecard.clusters.find((item) => item.cluster === "agent-instructions").top5Count, 1);
});

test("blocks attribution when Query x Page dimensions are absent", () => {
  const blocked = buildScorecard(input([
    { query: "agents.md vs copilot-instructions.md", page: comparisonPage, clicks: 1, impressions: 10, position: 4 },
  ], { dimensions: ["page", "query", "country"], hasQueryPageDimension: false }));
  assert.equal(blocked.blocked, true);
  assert.equal(blocked.queryPageEvidence.status, "blocked");
});

test("accepts only an explicit Query x Page dimension", () => {
  const scorecard = buildScorecard(input([
    { query: "agents.md vs copilot-instructions.md", page: comparisonPage, clicks: 1, impressions: 10, position: 6 },
  ], { dimensions: ["query", "page"], hasQueryPageDimension: true }));
  assert.equal(scorecard.blocked, false);
  assert.equal(scorecard.clusters.length, 5);
  assert.equal(scorecard.clusters.find((item) => item.cluster === "agent-instructions").position6to15Count, 1);
});

test("explicitly blocks dimensions without query and page evidence", () => {
  const scorecard = buildScorecard(input([
    { query: "agents.md vs copilot-instructions.md", page: comparisonPage, clicks: 1, impressions: 10, position: 4 },
  ], { dimensions: ["page", "country"], hasQueryPageDimension: false }));
  assert.equal(scorecard.blocked, true);
  assert.equal(scorecard.queryPageEvidence.status, "blocked");
  assert.equal(scorecard.cannibalization, null);
  assert.match(scorecard.metadata.limitations.join(" "), /Query x Page dimensions are missing/);
});

test("keeps unknown query or page rows unmapped", () => {
  const scorecard = buildScorecard(input([
    { query: "unknown query that is not in the editorial map", page: comparisonPage, clicks: 1, impressions: 10, position: 4 },
    { query: "agents.md vs copilot-instructions.md", page: "https://www.kyenai.com/unknown", clicks: 1, impressions: 10, position: 4 },
  ]));
  assert.equal(scorecard.mappedRowCount, 0);
  assert.equal(scorecard.unmappedRows.length, 2);
  assert.equal(scorecard.clusters.length, 5);
  assert.deepEqual(scorecard.clusters.find((item) => item.cluster === "agent-instructions").unmappedRows, [scorecard.unmappedRows[0]]);
});

test("preserves scorecard metadata and leaves stability pending without windows", () => {
  const scorecard = buildScorecard(input([], {
    baselineId: "control-2026-09-15",
    exportedAt: "2026-09-15T10:00:00Z",
    releaseId: "f0f8314",
    productionReleaseDate: "2026-09-16",
    limitations: ["Query export is row limited."],
  }));
  assert.equal(scorecard.metadata.baselineId, "control-2026-09-15");
  assert.equal(scorecard.metadata.releaseId, "f0f8314");
  assert.equal(scorecard.metadata.sourceFile, "fixtures/query-page.json");
  assert.equal(scorecard.stabilityWindowSupport, null);
  assert.match(scorecard.metadata.limitations.join(" "), /row limited/);
});

test("supports independent windows without making causal claims", () => {
  const rows = [{ query: "agents.md vs copilot-instructions.md", page: comparisonPage, clicks: 1, impressions: 10, position: 4 }];
  const scorecard = buildScorecard({
    ...input(rows),
    windows: [
      { windowDays: 7, ...input(rows, { startDate: "2026-09-09", endDate: "2026-09-15" }) },
      { windowDays: 14, ...input(rows, { startDate: "2026-09-02", endDate: "2026-09-15" }) },
    ],
  });
  assert.equal(scorecard.stabilityWindowSupport.status, "available");
  assert.match(scorecard.stabilityWindowSupport.note, /not a causal attribution/);
  assert.equal(scorecard.stabilityWindowSupport.clusters[0].supportedWindowCount, 2);
});
