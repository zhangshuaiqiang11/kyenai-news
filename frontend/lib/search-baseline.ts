import type { GuideEditorialSignals, SearchCluster, SearchQueryMappingBasis } from "./types";

export type GscMetric = NonNullable<GuideEditorialSignals["gscBaseline"]>;
export type GscDimension = "date" | "page" | "query" | "country" | "device" | "query-page" | "search-appearance";

export type SearchTarget = {
  query: string;
  path: string;
  cluster: SearchCluster;
  intent: "comparison" | "template" | "examples" | "troubleshooting" | "security" | "enterprise" | "workflow";
  mappingBasis: SearchQueryMappingBasis;
  observedQueryMetric: GscMetric | null;
};

export type GscBaselineSnapshot = {
  baselineId: string;
  windowStart: string;
  windowEnd: string;
  exportedAt: string;
  releaseId: string | null;
  productionReleaseDate: string | null;
  hasQueryPageDimension: boolean;
  metricDimension: GscDimension | null;
  requestedRowLimit: number | null;
  returnedRowCount: number | null;
  rowCountDimension: GscDimension | null;
  dimensionRowCounts?: Partial<Record<GscDimension, number>>;
  sourceFile: string;
  property: string;
  searchType: "Web";
  dimensions: readonly GscDimension[];
  metrics: {
    clicks: number | null;
    impressions: number | null;
    ctr: number | null;
    averagePosition: number | null;
  } | null;
  limitations: readonly string[];
};

export const searchBaselineScope = {
  source: "Google Search Console" as const,
  property: "sc-domain:kyenai.com",
  searchType: "Web",
  startDate: "2026-06-10",
  endDate: "2026-09-09",
  exportedAt: "2026-09-12",
  sourceFile: "artifacts/gsc/kyenai.com-Performance-on-Search-2026-09-12.zip",
  hasQueryPageDimension: false,
};

/** Historical three-month cohort; keep it immutable for later comparisons. */
export const historicalSearchBaseline: GscBaselineSnapshot = {
  baselineId: "gsc-2026-06-10-to-2026-09-09-history",
  windowStart: searchBaselineScope.startDate,
  windowEnd: searchBaselineScope.endDate,
  exportedAt: searchBaselineScope.exportedAt,
  releaseId: null,
  productionReleaseDate: null,
  hasQueryPageDimension: searchBaselineScope.hasQueryPageDimension,
  metricDimension: "date",
  requestedRowLimit: null,
  returnedRowCount: 1000,
  rowCountDimension: "query",
  dimensionRowCounts: { query: 1000 },
  sourceFile: searchBaselineScope.sourceFile,
  property: searchBaselineScope.property,
  searchType: "Web",
  dimensions: ["date", "page", "query", "country", "device", "search-appearance"],
  metrics: { clicks: 97, impressions: 25_271, ctr: 0.0038, averagePosition: null },
  limitations: [
    "Separate GSC dimension tables; no Query x Page export.",
    "returnedRowCount is the parsed query-table data-row count (1,000), not a Query x Page count; query rows remain subject to anonymization and export limits.",
  ],
};

/**
 * Latest 28-day control metadata from the 2026-09-15 archive. Page values
 * remain in the human-readable report until normalized import; null metrics
 * must not be interpreted as zero or as an observed API value.
 */
export const latestControlBaseline: GscBaselineSnapshot = {
  baselineId: "gsc-control-2026-08-19-to-2026-09-15",
  windowStart: "2026-08-19",
  windowEnd: "2026-09-15",
  exportedAt: "2026-09-15",
  releaseId: null,
  productionReleaseDate: null,
  hasQueryPageDimension: false,
  metricDimension: null,
  requestedRowLimit: null,
  returnedRowCount: 932,
  rowCountDimension: "query",
  dimensionRowCounts: { query: 932 },
  sourceFile: "kyenai.com-Performance-on-Search-2026-09-15.zip",
  property: "sc-domain:kyenai.com",
  searchType: "Web",
  dimensions: ["date", "page", "query", "country", "device", "search-appearance"],
  metrics: null,
  limitations: [
    "Control archive is not a live Search Console API response.",
    "The CSV query table contains 932 data rows after parsing quoted multiline fields; this is a query-table row count, not Query x Page data.",
    "No Query x Page table was exported; query-to-URL attribution and cannibalization remain unknown.",
    "Page, country, and device tables have separate row counts and are not represented as zero here.",
    "Import normalized page/query rows before calculating Month 4 scorecards.",
  ],
};

/**
 * First complete 28-day observation after the September CTR release. The
 * window includes three pre-release days, so releaseId is context rather than
 * evidence that the release caused any movement.
 */
export const octoberObservationBaseline: GscBaselineSnapshot = {
  baselineId: "gsc-observation-2026-09-13-to-2026-10-10",
  windowStart: "2026-09-13",
  windowEnd: "2026-10-10",
  exportedAt: "2026-10-13",
  releaseId: "81f7530",
  productionReleaseDate: "2026-09-16",
  hasQueryPageDimension: false,
  metricDimension: "date",
  requestedRowLimit: null,
  returnedRowCount: null,
  rowCountDimension: null,
  dimensionRowCounts: {
    date: 28,
    query: 255,
    page: 37,
    country: 121,
    device: 3,
    "search-appearance": 0,
  },
  sourceFile: "kyenai.com-Performance-on-Search-2026-10-13.zip",
  property: "sc-domain:kyenai.com",
  searchType: "Web",
  dimensions: ["date", "page", "query", "country", "device", "search-appearance"],
  metrics: { clicks: 34, impressions: 6_456, ctr: 34 / 6_456, averagePosition: 9.5066 },
  limitations: [
    "The chart/date table is the metric basis for the top-level 34 clicks, 6,456 impressions, 0.5266% CTR, and impression-weighted position 9.5066. The page table separately reports 34 clicks, 6,560 impressions, 0.5183% CTR, and weighted position 9.4888.",
    "Row counts are stored by exported dimension: 28 dates, 255 queries, 37 pages, 121 countries, 3 devices, and 0 search-appearance data rows. The top-level returnedRowCount is null because this archive contains multiple independent dimension tables.",
    "The query table exposes 255 rows, 4 clicks, and 947 impressions; anonymized and low-volume queries make it an incomplete subset rather than the site's complete query inventory.",
    "The exported filter summary says Search type: Web (text-based) and Date: Previous 28 days; the chart supplies the exact dates 2026-09-13 through 2026-10-10. No other dimension filter is listed.",
    "No Query x Page table was exported, so query-to-URL attribution, cannibalization, and release causality remain unknown.",
    "The window includes 2026-09-13 through 2026-09-15 before release 81f7530 reached production; do not treat it as a clean post-release experiment.",
    "Search appearance contains no data rows, and the archive does not state whether the final dates were fully settled when exported.",
  ],
};

export const searchBaselineSnapshots = [
  historicalSearchBaseline,
  latestControlBaseline,
  octoberObservationBaseline,
] as const;

export const siteSearchBaseline = {
  ...searchBaselineScope,
  clicks: 97,
  impressions: 25_271,
  ctr: 0.0038,
};

const pageMetric = (clicks: number, impressions: number, ctr: number, averagePosition: number): GscMetric => ({
  source: "Google Search Console",
  dimension: "page",
  startDate: searchBaselineScope.startDate,
  endDate: searchBaselineScope.endDate,
  clicks,
  impressions,
  ctr,
  averagePosition,
});

const queryMetric = (clicks: number, impressions: number, ctr: number, averagePosition: number): GscMetric => ({
  source: "Google Search Console",
  dimension: "query",
  startDate: searchBaselineScope.startDate,
  endDate: searchBaselineScope.endDate,
  clicks,
  impressions,
  ctr,
  averagePosition,
});

export const priorityPageBaselines: Record<string, GscMetric> = {
  "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions": pageMetric(39, 2937, 0.0133, 8.98),
  "/guides/agents-md-template-for-ai-coding-agents": pageMetric(13, 1062, 0.0122, 21.66),
  "/guides/mcp-server-not-showing-tools": pageMetric(11, 439, 0.0251, 6.82),
  "/guides/does-github-copilot-read-claude-md-support-matrix": pageMetric(3, 101, 0.0297, 7.06),
  "/guides/secure-mcp-servers-ai-coding-agents": pageMetric(0, 151, 0, 29.85),
  "/articles/cursor-enterprise-organizations-governance": pageMetric(0, 5278, 0, 11.18),
  "/articles/spacex-cursor-acquisition-2026": pageMetric(4, 5884, 0.0007, 7.44),
  "/guides/loop-engineering-ai-coding-agents": pageMetric(6, 2073, 0.0029, 13.49),
};

const target = (
  query: string,
  path: string,
  cluster: SearchTarget["cluster"],
  intent: SearchTarget["intent"],
  observedQueryMetric: GscMetric | null = null,
): SearchTarget => ({
  query,
  path,
  cluster,
  intent,
  // A query-table metric is observed, but it cannot prove page attribution
  // until Search Console exports the Query x Page dimension.
  mappingBasis: observedQueryMetric ? "observed-query" : "editorial-target",
  observedQueryMetric,
});

export const prioritySearchTargets: SearchTarget[] = [
  target("ai coding config files", "/guides/ai-coding-config-files-guide", "agent-instructions", "comparison"),
  target("ai coding configuration files", "/guides/ai-coding-config-files-guide", "agent-instructions", "comparison"),
  target("coding agent instruction files", "/guides/ai-coding-config-files-guide", "agent-instructions", "comparison"),
  target("ai assistant config files", "/guides/ai-coding-config-files-guide", "agent-instructions", "comparison"),
  target("agents.md vs claude.md", "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions", "agent-instructions", "comparison"),
  target("claude md vs copilot instructions", "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions", "agent-instructions", "comparison", queryMetric(3, 36, 0.0833, 7.61)),
  target("agents.md vs copilot-instructions.md", "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions", "agent-instructions", "comparison", queryMetric(1, 32, 0.0312, 11.53)),
  target("copilot instructions vs cursor rules", "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions", "agent-instructions", "comparison"),
  target("agents.md template", "/guides/agents-md-template-for-ai-coding-agents", "agent-instructions", "template"),
  target("agents.md template for codex", "/guides/agents-md-template-for-ai-coding-agents", "agent-instructions", "template"),
  target("agents.md node.js example", "/guides/agents-md-examples-codex-node-python-monorepos", "agent-instructions", "examples"),
  target("agents.md monorepo template", "/guides/agents-md-examples-codex-node-python-monorepos", "agent-instructions", "examples"),
  target("does github copilot read claude.md", "/guides/does-github-copilot-read-claude-md-support-matrix", "agent-instructions", "comparison"),
  target("github copilot claude.md support", "/guides/does-github-copilot-read-claude-md-support-matrix", "agent-instructions", "comparison"),
  target("copilot cli claude.md", "/guides/does-github-copilot-read-claude-md-support-matrix", "agent-instructions", "comparison"),
  target("copilot-instructions.md vs claude.md", "/guides/does-github-copilot-read-claude-md-support-matrix", "agent-instructions", "comparison"),
  target("mcp server not showing tools", "/guides/mcp-server-not-showing-tools", "mcp-security", "troubleshooting"),
  target("mcp server connected but no tools", "/guides/mcp-server-not-showing-tools", "mcp-security", "troubleshooting"),
  target("mcp tools not appearing", "/guides/mcp-server-not-showing-tools", "mcp-security", "troubleshooting"),
  target("cursor mcp tools missing", "/guides/mcp-server-not-showing-tools", "mcp-security", "troubleshooting"),
  target("mcp server security checklist", "/guides/secure-mcp-servers-ai-coding-agents", "mcp-security", "security"),
  target("how to secure an mcp server", "/guides/secure-mcp-servers-ai-coding-agents", "mcp-security", "security"),
  target("mcp authentication security", "/guides/secure-mcp-servers-ai-coding-agents", "mcp-security", "security"),
  target("mcp token passthrough", "/guides/secure-mcp-servers-ai-coding-agents", "mcp-security", "security"),
  target("cursor enterprise security", "/articles/cursor-enterprise-organizations-governance", "cursor-governance", "enterprise", queryMetric(0, 428, 0, 42.36)),
  target("cursor privacy mode retention", "/articles/cursor-enterprise-organizations-governance", "cursor-governance", "enterprise"),
  target("cursor enterprise mcp controls", "/articles/cursor-enterprise-organizations-governance", "cursor-governance", "enterprise"),
  target("cursor agent default retention", "/articles/cursor-enterprise-organizations-governance", "cursor-governance", "enterprise", queryMetric(0, 279, 0, 2.92)),
  target("spacex cursor acquisition status july 2026", "/articles/spacex-cursor-acquisition-2026", "cursor-market", "enterprise", queryMetric(0, 49, 0, 8.78)),
  target("spacex cursor acquisition status 2026", "/articles/spacex-cursor-acquisition-2026", "cursor-market", "enterprise", queryMetric(0, 26, 0, 9.58)),
  target("spacex cursor acquisition anysphere 2026", "/articles/spacex-cursor-acquisition-2026", "cursor-market", "enterprise", queryMetric(0, 25, 0, 8.36)),
  target("loop engineering", "/guides/loop-engineering-ai-coding-agents", "agent-workflows", "workflow", queryMetric(0, 91, 0, 61.42)),
  target("loop engineering in cursor", "/guides/loop-engineering-ai-coding-agents", "agent-workflows", "workflow", queryMetric(1, 10, 0.1, 7.9)),
  target("cursor loop engineering", "/guides/loop-engineering-ai-coding-agents", "agent-workflows", "workflow", queryMetric(0, 13, 0, 14)),
];

/**
 * Editorial intent ownership is a planning aid, not observed Query x Page attribution.
 * Keep this separate from GSC metrics so a title experiment cannot be reported as a
 * query-level causal result when the export contains independent dimensions only.
 */
export const priorityIntentNotes: Record<string, string> = {
  "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions":
    "Broad comparison and exact-file choice: AGENTS.md, copilot-instructions.md, CLAUDE.md, and Cursor rules. Use the page baseline for CTR; query targets are editorial mappings because Query x Page was not exported.",
  "/guides/agents-md-template-for-ai-coding-agents":
    "Template action intent: copy, download, and validate a concise AGENTS.md starter. Node.js and monorepo examples belong to the dedicated examples page; template-page clicks do not prove a specific query caused a copy event.",
  "/guides/agents-md-examples-codex-node-python-monorepos":
    "Examples intent: show Node.js, Python, and monorepo instruction layouts, test commands, and generated-file boundaries. Keep this separate from the downloadable template starter.",
  "/guides/does-github-copilot-read-claude-md-support-matrix":
    "Exact support question by Copilot surface. Keep separate from the broad comparison page and recheck the dated GitHub matrix before interpreting changes.",
  "/guides/mcp-server-not-showing-tools":
    "Troubleshooting intent: connected-but-empty tools/list, Inspector, client scope, authentication, and invocation. Do not infer server failure from a client-only zero-tool view.",
  "/guides/secure-mcp-servers-ai-coding-agents":
    "Security checklist intent: OAuth or authorization, token audience, least privilege, secrets, network boundaries, logging, and revocation. Operational recommendations are not protocol requirements.",
  "/articles/cursor-enterprise-organizations-governance":
    "Cursor governance intent: Privacy Mode, model and feature retention exceptions, Cloud Agent storage, MCP controls, and contracts. No universal default retention period is asserted; this is separate from the MCP security checklist.",
  "/guides/loop-engineering-ai-coding-agents":
    "Workflow concept and implementation intent: bounded Plan-Act-Observe-Verify-Stop loops, proof, retry caps, and stop rules. Average position is supporting context, not a causal measure of the rewrite.",
};

export const searchObservationPolicy = {
  primaryWindowDays: 28,
  lowSampleWindowDays: 56,
  earlyCheckDays: 14,
  plannedReleaseDate: "2026-09-13",
  compareBy: ["page", "query", "country", "device"] as const,
  primaryOutcomes: ["non-brand organic clicks", "tool use", "template copy", "resource download click"] as const,
  caveat: "The export has separate query, page, country, and device tables. Editorial target mappings are not observed Query x Page attribution, and the query export is row-limited. CTR is clicks divided by impressions for the same GSC row; do not reconcile dimensions by summing or averaging average position.",
};
