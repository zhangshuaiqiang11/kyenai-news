import { getGuides } from "./guides";
import type { Article, Guide } from "./types";

export type CategoryHub = {
  category: string;
  overview: string[];
  guideSlugs: string[];
  minimumPublishedArticles: number;
  minimumOverviewWords: number;
};

const categoryHubs: Record<string, CategoryHub> = {
  "AI Coding Agents": {
    category: "AI Coding Agents",
    overview: [
      "AI coding agents are moving from autocomplete toward repository-aware systems that can inspect files, run tools, propose changes, and verify results. The useful question is no longer whether an agent can generate code. Teams need to know which instruction files it reads, how it handles context, what permissions it receives, and how its output is reviewed before changes reach production.",
      "This hub connects evidence-led product updates with practical setup and comparison guides. Use the articles for dated vendor changes, then use the guides for durable decisions such as choosing repository instructions, comparing Codex and Claude Code, and creating reusable AGENTS.md policies. Pages remain separate when the search intent differs, while related updates point back to the evergreen guide that should accumulate long-term authority.",
    ],
    guideSlugs: [
      "agents-md-vs-claude-md-cursorrules-copilot-instructions",
      "agents-md-template-for-ai-coding-agents",
      "codex-vs-claude-code",
    ],
    minimumPublishedArticles: 5,
    minimumOverviewWords: 120,
  },
  "IDE & CLI": {
    category: "IDE & CLI",
    overview: [
      "IDE and command-line agent surfaces often expose the same model through very different workflows. An IDE agent may have editor context, sandbox controls, and approval prompts, while a CLI agent may be easier to automate inside scripts and CI. Product announcements therefore matter only when readers can connect the feature to setup, migration, permissions, and verification behavior.",
      "This hub groups dated IDE and CLI releases with durable migration and operating guides. Use the news pages to confirm what a vendor announced and when. Use the guides to decide whether agent mode fits the task, how to migrate command-line workflows without breaking authentication or hooks, and where external tools belong. The goal is to prevent short-lived release coverage from becoming an isolated page with no path to a reusable implementation decision.",
    ],
    guideSlugs: [
      "agent-mode-vs-chat-mode-in-ide",
      "antigravity-cli-gemini-cli-migration",
      "claude-code-hooks-mcp-setup",
    ],
    minimumPublishedArticles: 5,
    minimumOverviewWords: 120,
  },
  "Agent Workflows": {
    category: "Agent Workflows",
    overview: [
      "Agent workflows become useful when the task has explicit state, bounded tool access, observable verification, and a stopping condition. More agents do not automatically create a better system. Parallel subagents, scheduled loops, hooks, and external tools all introduce coordination costs that must be justified by clearer ownership or faster independent work.",
      "This hub connects workflow announcements to practical patterns for delegation and loop design. Read the articles for dated capability changes, then use the guides to decide when work should stay in one agent, when a subagent can own an independent output, and how plan-execute-verify loops should stop or escalate. The pages prioritize repeatable engineering controls over theatrical multi-agent diagrams, because software still has to compile after the agents finish congratulating one another.",
    ],
    guideSlugs: [
      "claude-code-subagents-examples",
      "loop-engineering-ai-coding-agents",
      "claude-code-hooks-mcp-setup",
    ],
    minimumPublishedArticles: 5,
    minimumOverviewWords: 120,
  },
  "Security & Governance": {
    category: "Security & Governance",
    overview: [
      "Security and governance for coding agents starts with capabilities, not slogans. Reviewers need to know which repositories, files, secrets, network destinations, external tools, and production environments an agent can reach. Authentication alone is not enough when a tool can still perform an unsafe write or expose sensitive context through an over-broad workflow.",
      "This hub joins dated security and enterprise product updates with durable review checklists. Use the articles to understand a vendor's current sandbox, policy, or MCP announcement. Use the guides to evaluate least privilege, approval boundaries, logging, revocation, and organizational ownership before rollout. The category is eligible for indexing only after it has enough original coverage and guide depth to function as a real topic hub rather than a thin archive wearing a serious title.",
    ],
    guideSlugs: [
      "secure-mcp-servers-ai-coding-agents",
      "agent-governance-checklist-for-software-teams",
      "agents-md-vs-claude-md-cursorrules-copilot-instructions",
    ],
    minimumPublishedArticles: 5,
    minimumOverviewWords: 120,
  },
};

export function getCategoryHub(category: string): CategoryHub | undefined {
  return categoryHubs[category];
}

export function getCategoryGuides(category: string): Guide[] {
  const hub = getCategoryHub(category);
  if (!hub) {
    return [];
  }

  const guideBySlug = new Map(getGuides().map((guide) => [guide.slug, guide]));
  return hub.guideSlugs.flatMap((slug) => {
    const guide = guideBySlug.get(slug);
    return guide ? [guide] : [];
  });
}

export function shouldIndexCategoryHub(category: string, articles: Article[]): boolean {
  const hub = getCategoryHub(category);
  if (!hub) {
    return false;
  }

  const publishedArticleCount = articles.filter(
    (article) => article.status === "published" && article.category === category,
  ).length;
  const overviewWords = hub.overview.join(" ").match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)?/g)?.length || 0;

  return (
    publishedArticleCount >= hub.minimumPublishedArticles &&
    overviewWords >= hub.minimumOverviewWords &&
    getCategoryGuides(category).length > 0
  );
}

export function getIndexableCategoryNames(articles: Article[]): string[] {
  return Array.from(new Set(articles.map((article) => article.category)))
    .filter((category) => shouldIndexCategoryHub(category, articles))
    .sort();
}
