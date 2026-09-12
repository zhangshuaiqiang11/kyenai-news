import type { GuideEditorialSignals } from "./types";

export type GscMetric = NonNullable<GuideEditorialSignals["gscBaseline"]>;

export type SearchTarget = {
  query: string;
  path: string;
  cluster: "agent-instructions" | "mcp-security" | "cursor-market" | "agent-workflows";
  intent: "comparison" | "template" | "troubleshooting" | "security" | "enterprise";
  mappingBasis: "editorial-target";
  observedQueryMetric: GscMetric | null;
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
): SearchTarget => ({ query, path, cluster, intent, mappingBasis: "editorial-target", observedQueryMetric });

export const prioritySearchTargets: SearchTarget[] = [
  target("agents.md vs claude.md", "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions", "agent-instructions", "comparison"),
  target("claude md vs copilot instructions", "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions", "agent-instructions", "comparison", queryMetric(3, 36, 0.0833, 7.61)),
  target("agents.md vs copilot-instructions.md", "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions", "agent-instructions", "comparison", queryMetric(1, 32, 0.0312, 11.53)),
  target("copilot instructions vs cursor rules", "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions", "agent-instructions", "comparison"),
  target("agents.md template", "/guides/agents-md-template-for-ai-coding-agents", "agent-instructions", "template"),
  target("agents.md template for codex", "/guides/agents-md-template-for-ai-coding-agents", "agent-instructions", "template"),
  target("agents.md node.js example", "/guides/agents-md-template-for-ai-coding-agents", "agent-instructions", "template"),
  target("agents.md monorepo template", "/guides/agents-md-template-for-ai-coding-agents", "agent-instructions", "template"),
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
  target("cursor enterprise security", "/articles/cursor-enterprise-organizations-governance", "mcp-security", "enterprise", queryMetric(0, 428, 0, 42.36)),
  target("cursor privacy mode retention", "/articles/cursor-enterprise-organizations-governance", "mcp-security", "enterprise"),
  target("cursor enterprise mcp controls", "/articles/cursor-enterprise-organizations-governance", "mcp-security", "enterprise"),
  target("cursor agent default retention", "/articles/cursor-enterprise-organizations-governance", "mcp-security", "enterprise", queryMetric(0, 279, 0, 2.92)),
  target("spacex cursor acquisition status july 2026", "/articles/spacex-cursor-acquisition-2026", "cursor-market", "enterprise", queryMetric(0, 49, 0, 8.78)),
  target("spacex cursor acquisition status 2026", "/articles/spacex-cursor-acquisition-2026", "cursor-market", "enterprise", queryMetric(0, 26, 0, 9.58)),
  target("spacex cursor acquisition anysphere 2026", "/articles/spacex-cursor-acquisition-2026", "cursor-market", "enterprise", queryMetric(0, 25, 0, 8.36)),
  target("loop engineering", "/guides/loop-engineering-ai-coding-agents", "agent-workflows", "comparison", queryMetric(0, 91, 0, 61.42)),
  target("loop engineering in cursor", "/guides/loop-engineering-ai-coding-agents", "agent-workflows", "comparison", queryMetric(1, 10, 0.1, 7.9)),
  target("cursor loop engineering", "/guides/loop-engineering-ai-coding-agents", "agent-workflows", "comparison", queryMetric(0, 13, 0, 14)),
];

export const searchObservationPolicy = {
  primaryWindowDays: 28,
  lowSampleWindowDays: 56,
  earlyCheckDays: 14,
  plannedReleaseDate: "2026-09-13",
  compareBy: ["page", "query", "country", "device"] as const,
  primaryOutcomes: ["non-brand organic clicks", "tool use", "template copy", "resource download click"] as const,
  caveat: "The export has separate query, page, country, and device tables. Editorial target mappings are not observed Query x Page attribution, and the query export is row-limited.",
};
