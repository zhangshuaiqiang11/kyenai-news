import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.dirname(SCRIPT_DIR);
const SEARCH_BASELINE_SOURCE = path.join(REPO_ROOT, "frontend", "lib", "search-baseline.ts");
const GUIDE_EDITORIAL_SOURCE = path.join(REPO_ROOT, "frontend", "lib", "guide-editorial.ts");

const DEFAULT_RULES = Object.freeze({
  top3: "position <= 3",
  top5: "position <= 5",
  top10: "position <= 10",
  position6to15: "6 <= position <= 15",
  highImpressionLowCtr: "impressions >= 20 && recomputed CTR < 0.01",
  ctr: "clicks / impressions from the same row; supplied ctr is ignored",
  weightedAveragePosition: "sum(position * impressions) / sum(impressions); rows without impressions are excluded",
  mapping: "a row is mapped only when its query has a canonical target and its page has a known canonical guide cluster",
});

const SEARCH_CLUSTERS = Object.freeze([
  "agent-instructions",
  "agent-workflows",
  "mcp-security",
  "cursor-governance",
  "cursor-market",
]);

let canonicalMappingCache;

function readCanonicalMappings() {
  if (canonicalMappingCache) return canonicalMappingCache;

  const searchSource = fs.readFileSync(SEARCH_BASELINE_SOURCE, "utf8");
  const editorialSource = fs.readFileSync(GUIDE_EDITORIAL_SOURCE, "utf8");
  const queryTargets = new Map();
  const targetPattern = /target\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"/g;
  for (const match of searchSource.matchAll(targetPattern)) {
    queryTargets.set(normalizeQuery(match[1]), {
      query: match[1],
      path: normalizePagePath(match[2]),
      cluster: match[3],
      intent: match[4],
    });
  }

  const pageClusters = new Map();
  const clusterPattern = /"([^"]+)"\s*:\s*"([^"]+)"/g;
  for (const match of editorialSource.matchAll(clusterPattern)) {
    const slug = match[1];
    const cluster = match[2];
    pageClusters.set(`/guides/${slug}`, cluster);
    pageClusters.set(`/articles/${slug}`, cluster);
  }

  canonicalMappingCache = { queryTargets, pageClusters };
  return canonicalMappingCache;
}

function normalizeQuery(value) {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizePagePath(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  try {
    const parsed = new URL(raw, "https://www.kyenai.com");
    const pathname = parsed.pathname.replace(/\/+$/, "") || "/";
    return pathname;
  } catch {
    return raw.replace(/\/+$/, "") || "/";
  }
}

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeRow(row, index) {
  const clicks = Math.max(0, finiteNumber(row?.clicks));
  const impressions = Math.max(0, finiteNumber(row?.impressions));
  const position = finiteNumber(row?.position, null);
  return {
    index,
    query: String(row?.query ?? "").trim(),
    page: normalizePagePath(row?.page),
    clicks,
    impressions,
    position,
    ctr: impressions > 0 ? clicks / impressions : null,
  };
}

function summarizeRows(rows) {
  const clicks = rows.reduce((sum, row) => sum + row.clicks, 0);
  const impressions = rows.reduce((sum, row) => sum + row.impressions, 0);
  const weightedImpressions = rows.filter((row) => row.impressions > 0 && row.position !== null);
  const weightedAveragePosition = weightedImpressions.length
    ? weightedImpressions.reduce((sum, row) => sum + row.position * row.impressions, 0) /
      weightedImpressions.reduce((sum, row) => sum + row.impressions, 0)
    : null;
  return {
    rowCount: rows.length,
    clicks,
    impressions,
    ctr: impressions > 0 ? clicks / impressions : null,
    weightedAveragePosition,
  };
}

function rowRankFlags(row) {
  if (row.position === null || row.impressions <= 0) {
    return { top3: false, top5: false, top10: false, position6to15: false };
  }
  return {
    top3: row.position <= 3,
    top5: row.position <= 5,
    top10: row.position <= 10,
    position6to15: row.position >= 6 && row.position <= 15,
  };
}

function rowForOutput(row) {
  return {
    rowIndex: row.index,
    query: row.query,
    page: row.page,
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  };
}

function clusterSummary(cluster, rows, unmappedRows = []) {
  const totals = summarizeRows(rows);
  const highImpressionLowCtrRows = rows.filter(
    (row) => row.impressions >= 20 && row.ctr !== null && row.ctr < 0.01,
  );
  const top3Count = countDistinctQueries(rows, "top3");
  const top5Count = countDistinctQueries(rows, "top5");
  const top10Count = countDistinctQueries(rows, "top10");
  const position6to15Count = countDistinctQueries(rows, "position6to15");
  const highImpressionLowCtrPages = summarizePages(rows).filter(
    (page) => page.impressions >= 20 && page.ctr !== null && page.ctr < 0.01,
  );
  return {
    cluster,
    ...totals,
    top3Count,
    top5Count,
    top10Count,
    position6to15Count,
    highImpressionLowCtrRows: highImpressionLowCtrRows.map(rowForOutput),
    highImpressionLowCtrPages,
    unmappedRows,
  };
}

function countDistinctQueries(rows, flag) {
  return new Set(rows.filter((row) => rowRankFlags(row)[flag]).map((row) => normalizeQuery(row.query)).filter(Boolean)).size;
}

function summarizePages(rows) {
  const byPage = new Map();
  for (const row of rows) {
    if (!row.page) continue;
    const current = byPage.get(row.page) ?? { page: row.page, clicks: 0, impressions: 0, rowCount: 0 };
    current.clicks += row.clicks;
    current.impressions += row.impressions;
    current.rowCount += 1;
    byPage.set(row.page, current);
  }
  return [...byPage.values()]
    .map((page) => ({ ...page, ctr: page.impressions > 0 ? page.clicks / page.impressions : null }))
    .sort((left, right) => right.impressions - left.impressions);
}

function buildCannibalization(rows) {
  const byQuery = new Map();
  for (const row of rows) {
    if (!row.query || !row.page) continue;
    if (!byQuery.has(normalizeQuery(row.query))) byQuery.set(normalizeQuery(row.query), []);
    byQuery.get(normalizeQuery(row.query)).push(row);
  }
  return [...byQuery.entries()]
    .filter(([, queryRows]) => new Set(queryRows.map((row) => row.page)).size > 1)
    .map(([query, queryRows]) => ({
      query,
      pages: queryRows.map(rowForOutput),
      distinctPageCount: new Set(queryRows.map((row) => row.page)).size,
    }));
}

function hasQueryPageEvidence(dimensions, metadata = {}) {
  const normalized = (dimensions || []).map((value) => String(value).toLowerCase().replace(/[\s×_]/g, "-"));
  // The Search Console API represents a joint request as dimensions ["query", "page"].
  // Require an explicit flag for that ambiguous shape so two independent exports
  // cannot be mistaken for Query x Page attribution.
  return metadata.hasQueryPageDimension === true || normalized.includes("query-page");
}

function makeMetadata(input, dimensions, limitations) {
  const metadata = input?.metadata && typeof input.metadata === "object" ? input.metadata : input || {};
  return {
    property: metadata.property ?? null,
    searchType: metadata.searchType ?? null,
    dateRange: {
      startDate: metadata.startDate ?? metadata.windowStart ?? null,
      endDate: metadata.endDate ?? metadata.windowEnd ?? null,
    },
    dimensions,
    hasQueryPageDimension: metadata.hasQueryPageDimension === true || dimensions.includes("query-page"),
    requestedRowLimit: metadata.requestedRowLimit ?? null,
    returnedRowCount: metadata.returnedRowCount ?? null,
    sourceFile: metadata.sourceFile ?? null,
    baselineId: metadata.baselineId ?? null,
    exportedAt: metadata.exportedAt ?? null,
    releaseId: metadata.releaseId ?? null,
    productionReleaseDate: metadata.productionReleaseDate ?? null,
    windowDays: metadata.windowDays ?? null,
    limitations: [...new Set([...(Array.isArray(metadata.limitations) ? metadata.limitations : []), ...limitations])],
  };
}

function scoreSingleWindow(input) {
  const metadataInput = input?.metadata && typeof input.metadata === "object" ? input.metadata : input || {};
  const dimensions = Array.isArray(metadataInput.dimensions) ? metadataInput.dimensions : [];
  const rows = (Array.isArray(input?.rows) ? input.rows : Array.isArray(metadataInput.rows) ? metadataInput.rows : []).map(normalizeRow);
  const queryPageAvailable = hasQueryPageEvidence(dimensions, metadataInput);
  const limitations = [];
  if (!queryPageAvailable) {
    limitations.push("Query x Page dimensions are missing; page attribution, cluster ranking, and cannibalization are blocked.");
  }
  const metadata = makeMetadata(input, dimensions, limitations);
  const mappings = readCanonicalMappings();
  const unmappedRows = [];
  const mappedRows = [];
  const byCluster = new Map();

  for (const row of rows) {
    if (!queryPageAvailable) {
      unmappedRows.push({ ...rowForOutput(row), reason: "missing-query-page-dimension" });
      continue;
    }
    const queryTarget = mappings.queryTargets.get(normalizeQuery(row.query));
    const pageCluster = mappings.pageClusters.get(row.page);
    if (!queryTarget || !pageCluster) {
      unmappedRows.push({
        ...rowForOutput(row),
        reason: !queryTarget && !pageCluster ? "unknown-query-and-page" : !queryTarget ? "unknown-query" : "unknown-page",
      });
      if (pageCluster) {
        if (!byCluster.has(pageCluster)) byCluster.set(pageCluster, { rows: [], unmappedRows: [] });
        byCluster.get(pageCluster).unmappedRows.push(unmappedRows.at(-1));
      }
      continue;
    }
    if (normalizePagePath(queryTarget.path) !== row.page || queryTarget.cluster !== pageCluster) {
      unmappedRows.push({
        ...rowForOutput(row),
        reason: normalizePagePath(queryTarget.path) !== row.page ? "query-target-page-mismatch" : "query-target-cluster-mismatch",
        expectedPage: queryTarget.path,
        queryCluster: queryTarget.cluster,
        pageCluster,
      });
      if (!byCluster.has(pageCluster)) byCluster.set(pageCluster, { rows: [], unmappedRows: [] });
      byCluster.get(pageCluster).unmappedRows.push(unmappedRows.at(-1));
      continue;
    }
    mappedRows.push(row);
    if (!byCluster.has(pageCluster)) byCluster.set(pageCluster, { rows: [], unmappedRows: [] });
    byCluster.get(pageCluster).rows.push(row);
  }

  const totals = summarizeRows(rows);
  const clusters = SEARCH_CLUSTERS.map((cluster) => {
    const value = byCluster.get(cluster) ?? { rows: [], unmappedRows: [] };
    return clusterSummary(cluster, value.rows, value.unmappedRows);
  });
  const blocked = !queryPageAvailable;
  return {
    blocked,
    queryPageEvidence: queryPageAvailable ? { status: "available" } : { status: "blocked", reason: "missing-query-page-dimension" },
    metadata,
    rules: DEFAULT_RULES,
    totals,
    clusters,
    unmappedRows,
    cannibalization: queryPageAvailable ? buildCannibalization(rows) : null,
    mappedRowCount: mappedRows.length,
    stabilityWindowSupport: null,
  };
}

function buildStabilityWindowSupport(input, currentScorecard) {
  const windows = Array.isArray(input?.windows) ? input.windows : [];
  if (!windows.length) return null;
  const scoredWindows = windows.map((window) => ({
    windowDays: window.windowDays ?? window.metadata?.windowDays ?? null,
    scorecard: scoreSingleWindow(window),
  }));
  if (scoredWindows.length < 2) {
    return { status: "pending", reason: "At least two explicit windows are required; no causal conclusion is inferred.", windows: scoredWindows.map(({ windowDays, scorecard }) => ({ windowDays, dateRange: scorecard.metadata.dateRange })) };
  }
  const clusterNames = new Set(scoredWindows.flatMap(({ scorecard }) => scorecard.clusters.map((cluster) => cluster.cluster)));
  const clusters = [...clusterNames].sort().map((cluster) => {
    const byWindow = scoredWindows.map(({ windowDays, scorecard }) => {
      const found = scorecard.clusters.find((item) => item.cluster === cluster);
      return { windowDays, top3Count: found?.top3Count ?? 0, top5Count: found?.top5Count ?? 0, top10Count: found?.top10Count ?? 0 };
    });
    return {
      cluster,
      windows: byWindow,
      supportedWindowCount: byWindow.filter((item) => item.top5Count > 0).length,
      consecutiveTop5Windows: longestConsecutive(byWindow.map((item) => item.top5Count > 0)),
    };
  });
  return {
    status: "available",
    note: "Windows are reported independently. Stability support is descriptive and is not a causal attribution.",
    windows: scoredWindows.map(({ windowDays, scorecard }) => ({ windowDays, dateRange: scorecard.metadata.dateRange, blocked: scorecard.blocked })),
    clusters,
    currentWindowIncluded: Boolean(currentScorecard),
  };
}

function longestConsecutive(values) {
  let best = 0;
  let current = 0;
  for (const value of values) {
    current = value ? current + 1 : 0;
    best = Math.max(best, current);
  }
  return best;
}

export function buildScorecard(input = {}) {
  const scorecard = scoreSingleWindow(input);
  scorecard.stabilityWindowSupport = buildStabilityWindowSupport(input, scorecard);
  return scorecard;
}

export function parseInputJson(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== "object") throw new TypeError("Scorecard input must be a JSON object.");
  return parsed;
}

async function main(argv = process.argv.slice(2)) {
  const inputPath = argv.find((arg) => !arg.startsWith("--"));
  const text = inputPath ? fs.readFileSync(path.resolve(inputPath), "utf8") : await readStdin();
  process.stdout.write(`${JSON.stringify(buildScorecard(parseInputJson(text)), null, 2)}\n`);
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let text = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (text += chunk));
    process.stdin.on("end", () => resolve(text));
    process.stdin.on("error", reject);
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
