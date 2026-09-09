import type { GuideEditorialSignals } from "./types";

export type GscMetric = NonNullable<GuideEditorialSignals["gscBaseline"]>;

export type SearchTarget = {
  query: string;
  path: string;
  cluster: "agent-instructions" | "mcp-security";
  intent: "comparison" | "template" | "troubleshooting" | "security" | "enterprise";
  mappingBasis: "editorial-target";
  observedQueryMetric: GscMetric | null;
};

export const searchBaselineScope = {
  source: "Google Search Console" as const,
  property: "sc-domain:kyenai.com",
  searchType: "Web",
  startDate: "2026-06-06",
  endDate: "2026-09-05",
  exportedAt: "2026-09-07",
  sourceFile: "kyenai.com-Performance-on-Search-2026-09-07.zip",
  hasQueryPageDimension: false,
};

export const siteSearchBaseline = {
  ...searchBaselineScope,
  clicks: 98,
  impressions: 23_318,
  ctr: 0.0042,
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
  "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions": pageMetric(39, 2773, 0.0141, 9.16),
  "/guides/agents-md-template-for-ai-coding-agents": pageMetric(13, 952, 0.0137, 23.19),
  "/guides/mcp-server-not-showing-tools": pageMetric(11, 413, 0.0266, 6.94),
  "/guides/does-github-copilot-read-claude-md-support-matrix": pageMetric(2, 91, 0.022, 7.16),
  "/articles/cursor-enterprise-organizations-governance": pageMetric(0, 4298, 0, 11.84),
  "/guides/secure-mcp-servers-ai-coding-agents": pageMetric(0, 159, 0, 28.23),
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
  target("claude md vs copilot instructions", "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions", "agent-instructions", "comparison", queryMetric(3, 37, 0.0811, 7.51)),
  target("agents.md vs copilot-instructions.md", "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions", "agent-instructions", "comparison", queryMetric(1, 22, 0.0455, 13.23)),
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
  target("cursor enterprise security", "/articles/cursor-enterprise-organizations-governance", "mcp-security", "enterprise", queryMetric(0, 404, 0, 42.76)),
  target("cursor privacy mode retention", "/articles/cursor-enterprise-organizations-governance", "mcp-security", "enterprise"),
  target("cursor enterprise mcp controls", "/articles/cursor-enterprise-organizations-governance", "mcp-security", "enterprise"),
  target("cursor agent default retention", "/articles/cursor-enterprise-organizations-governance", "mcp-security", "enterprise", queryMetric(0, 278, 0, 2.92)),
];

export const searchObservationPolicy = {
  primaryWindowDays: 28,
  lowSampleWindowDays: 56,
  compareBy: ["page", "query", "country", "device"] as const,
  primaryOutcomes: ["non-brand organic clicks", "tool use", "template copy", "resource download click"] as const,
  caveat: "The export has separate query and page tables. Editorial target mappings are not observed Query x Page attribution.",
};
