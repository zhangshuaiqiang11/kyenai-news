import { getGuides } from "./guides";
import type { Guide, GuideEditorialSignals } from "./types";

const editorialSignalsBySlug: Record<string, GuideEditorialSignals> = {
  "agents-md-vs-claude-md-cursorrules-copilot-instructions": {
    priority: "P0",
    primaryKeyword: "AGENTS.md vs CLAUDE.md",
    demandScore: 9,
    attackabilityScore: 9,
    fitScore: 9.2,
    gscWatchQueries: [
      "claude md vs copilot instructions",
      "claude.md vs copilot-instructions.md",
      "agents md vs claude md vs copilot instructions md",
      "agents.md vs claude.md",
      "claude.md vs cursorrules",
      "\".cursor/rules\" \".mdc\" \"agents.md\" priority precedence behavior",
      "copilot instructions vs cursor rules",
      "ai coding agent instructions",
    ],
    gscBaseline: {
      clicks: 11,
      impressions: 922,
      ctr: 0.0119,
      averagePosition: 9.56,
    },
    emergencyPriority: 105,
  },
  "claude-code-subagents-examples": {
    priority: "P0",
    primaryKeyword: "Claude Code subagents examples",
    demandScore: 9,
    attackabilityScore: 8.5,
    fitScore: 8.4,
    gscWatchQueries: [
      "claude code subagents examples",
      "claude code subagents workflow",
      "claude code sub agent review",
      "when to use claude code subagents",
    ],
  },
  "claude-code-hooks-mcp-setup": {
    priority: "P0",
    primaryKeyword: "Claude Code hooks MCP setup",
    demandScore: 8,
    attackabilityScore: 8,
    fitScore: 8.4,
    gscWatchQueries: [
      "claude code hooks mcp setup",
      "claude code hooks examples",
      "claude code mcp setup",
      "claude code skills hooks mcp",
    ],
  },
  "secure-mcp-servers-ai-coding-agents": {
    priority: "P0",
    primaryKeyword: "MCP server security checklist",
    demandScore: 8,
    attackabilityScore: 7.5,
    fitScore: 9.4,
    gscWatchQueries: [
      "mcp security",
      "mcp server security",
      "how to secure an mcp server",
      "secure mcp server connection to ai agent",
      "securing connection between ai agents and mcp servers",
      "ai coding agent credentials",
      "mcp authentication",
      "mcp permissions",
      "ai agent tool security",
    ],
    gscBaseline: {
      clicks: 0,
      impressions: 52,
      ctr: 0,
      averagePosition: 26.5,
    },
    emergencyPriority: 80,
  },
  "mcp-server-not-showing-tools": {
    priority: "P0",
    primaryKeyword: "MCP server not showing tools",
    demandScore: 8.4,
    attackabilityScore: 9.2,
    fitScore: 9.7,
    gscWatchQueries: [
      "mcp server not showing tools",
      "mcp tools not appearing",
      "mcp server connected but no tools",
      "mcp tools list debugging",
      "claude code mcp zero tools",
      "cursor mcp tools missing",
      "github copilot mcp tools missing",
    ],
  },
  "antigravity-cli-gemini-cli-migration": {
    priority: "P1",
    primaryKeyword: "Antigravity CLI migration from Gemini CLI",
    demandScore: 8,
    attackabilityScore: 9.5,
    fitScore: 6.6,
    gscWatchQueries: [
      "antigravity cli migration",
      "gemini cli migration",
      "antigravity cli gemini cli",
      "gemini cli transition",
    ],
  },
  "codex-vs-claude-code": {
    priority: "P0",
    primaryKeyword: "Codex vs Claude Code",
    demandScore: 9,
    attackabilityScore: 8,
    fitScore: 9.4,
    gscWatchQueries: [
      "codex vs claude code",
      "claude code vs codex",
      "openai codex vs claude code",
      "codex alternatives",
    ],
    gscBaseline: {
      clicks: 1,
      impressions: 109,
      ctr: 0.0092,
      averagePosition: 36.8,
    },
    emergencyPriority: 100,
  },
  "claude-code-alternatives": {
    priority: "P0",
    primaryKeyword: "Claude Code alternatives",
    demandScore: 9.2,
    attackabilityScore: 8.8,
    fitScore: 9.8,
    gscWatchQueries: [
      "claude code alternatives",
      "alternatives to claude code",
      "claude code alternative",
      "free claude code alternative",
      "open source claude code alternative",
      "claude code alternatives for teams",
    ],
  },
  "codex-vs-github-copilot": {
    priority: "P0",
    primaryKeyword: "Codex vs GitHub Copilot",
    demandScore: 8.8,
    attackabilityScore: 8.7,
    fitScore: 9.5,
    gscWatchQueries: [
      "codex vs github copilot",
      "github copilot vs codex",
      "openai codex vs github copilot",
      "codex cli vs copilot cli",
      "codex alternative github copilot",
      "github copilot alternative codex",
    ],
  },
  "ai-coding-agents-comparison": {
    priority: "P0",
    primaryKeyword: "AI coding agents comparison",
    demandScore: 9.1,
    attackabilityScore: 8.4,
    fitScore: 9.8,
    gscWatchQueries: [
      "ai coding agents comparison",
      "ai coding agent comparison",
      "codex vs claude code vs cursor vs copilot",
      "coding agents comparison 2026",
      "ai coding tools for teams",
      "enterprise ai coding agent comparison",
    ],
  },
  "agents-md-template-for-ai-coding-agents": {
    priority: "P0",
    primaryKeyword: "AGENTS.md template",
    demandScore: 8.8,
    attackabilityScore: 9.2,
    fitScore: 9.5,
    gscWatchQueries: [
      "agents.md template",
      "agents.md template for ai coding agents",
      "codex agents.md example",
      "ai coding agent instructions template",
    ],
    gscBaseline: {
      clicks: 3,
      impressions: 142,
      ctr: 0.0211,
      averagePosition: 16.37,
    },
    emergencyPriority: 80,
  },
  "does-github-copilot-read-claude-md-support-matrix": {
    priority: "P1",
    primaryKeyword: "Does GitHub Copilot read CLAUDE.md",
    demandScore: 7.6,
    attackabilityScore: 9.1,
    fitScore: 9.2,
    gscWatchQueries: [
      "does github copilot read claude.md",
      "github copilot claude.md support",
      "copilot claude.md support matrix",
      ".github/copilot-instructions.md vs claude.md",
    ],
  },
  "agents-md-examples-codex-node-python-monorepos": {
    priority: "P1",
    primaryKeyword: "AGENTS.md examples",
    demandScore: 8.1,
    attackabilityScore: 9.3,
    fitScore: 9.5,
    gscWatchQueries: [
      "agents.md examples",
      "codex agents.md examples",
      "agents.md node.js example",
      "agents.md python example",
      "agents.md monorepo example",
    ],
  },
  "agent-mode-vs-chat-mode-in-ide": {
    priority: "P0",
    primaryKeyword: "agent mode vs chat mode in IDE",
    demandScore: 8.4,
    attackabilityScore: 8.6,
    fitScore: 9,
    gscWatchQueries: [
      "agent mode vs chat mode",
      "agent mode vs chat mode in ide",
      "ai coding agent vs chat",
      "vs code agent mode",
    ],
    gscBaseline: {
      clicks: 1,
      impressions: 86,
      ctr: 0.0116,
      averagePosition: 9.99,
    },
  },
  "local-vs-cloud-ai-coding-agent": {
    priority: "P0",
    primaryKeyword: "local vs cloud AI coding agent",
    demandScore: 8.2,
    attackabilityScore: 8.8,
    fitScore: 9.1,
    gscWatchQueries: [
      "local vs cloud ai coding agent",
      "cloud coding agent",
      "local ai coding agent",
      "ai coding agent sandbox",
    ],
  },
  "agent-governance-checklist-for-software-teams": {
    priority: "P0",
    primaryKeyword: "agent governance checklist for software teams",
    demandScore: 8.1,
    attackabilityScore: 8.6,
    fitScore: 9.3,
    gscWatchQueries: [
      "agent governance checklist for software teams",
      "ai coding agent governance",
      "ai coding agent audit logs",
      "ai agent permissions checklist",
    ],
  },
  "loop-engineering-ai-coding-agents": {
    priority: "P0",
    primaryKeyword: "What is loop engineering",
    demandScore: 8.7,
    attackabilityScore: 9.1,
    fitScore: 9.6,
    gscWatchQueries: [
      "what is loop engineering",
      "what is loop engineering addy osmani",
      "loop engineering ai coding agents",
      "cursor loop automation",
      "claude code loop command",
      "loop engineering vs prompt engineering",
      "how to design agent loops",
    ],
    gscBaseline: {
      clicks: 3,
      impressions: 944,
      ctr: 0.0032,
      averagePosition: 8.72,
    },
    emergencyPriority: 115,
  },
  "ai-coding-agent-instruction-file-adoption-report-2026": {
    priority: "P0",
    primaryKeyword: "AI coding agent instruction file adoption",
    demandScore: 8.3,
    attackabilityScore: 9.4,
    fitScore: 9.8,
    gscWatchQueries: [
      "agents.md adoption",
      "claude.md adoption",
      "ai coding agent instruction file statistics",
      "github agents.md report",
      "copilot-instructions.md examples",
      "cursor mdc rules examples",
    ],
  },
};

export function getGuideEditorialSignals(slug: string): GuideEditorialSignals | undefined {
  return editorialSignalsBySlug[slug];
}

export function getPriorityGuides(limit = 5): Guide[] {
  return [...getGuides()]
    .sort((left, right) => guideRank(right.slug) - guideRank(left.slug))
    .slice(0, limit);
}

function guideRank(slug: string): number {
  const signals = getGuideEditorialSignals(slug);
  if (!signals) {
    return 0;
  }

  const priorityBoost = signals.priority === "P0" ? 2 : signals.priority === "P1" ? 1 : 0;
  const baseline = signals.gscBaseline;
  const impressionScore = baseline ? Math.min(baseline.impressions / 25, 20) : 0;
  const nearPageOneScore = baseline ? Math.max(0, 20 - Math.abs(baseline.averagePosition - 10)) : 0;
  const zeroClickBoost = baseline && baseline.clicks === 0 && baseline.impressions > 40 ? 8 : 0;
  const emergencyBoost = signals.emergencyPriority ? signals.emergencyPriority / 5 : 0;

  return (
    signals.demandScore +
    signals.attackabilityScore +
    signals.fitScore +
    priorityBoost +
    impressionScore +
    nearPageOneScore +
    zeroClickBoost +
    emergencyBoost
  );
}
